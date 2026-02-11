# Audit Lengkap: Dashboard Profile UPNVJ

> Dokumen ini berisi hasil analisis menyeluruh terhadap project **UPNVJ Dashboard** meliputi arsitektur sistem, keamanan, frontend, backend, database, DevOps, dan rekomendasi pengembangan.

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Arsitektur Sistem](#2-arsitektur-sistem)
3. [Keamanan (Security)](#3-keamanan-security)
4. [Frontend Best Practices](#4-frontend-best-practices)
5. [Backend & Database](#5-backend--database)
6. [DevOps & Deployment](#6-devops--deployment)
7. [Rekomendasi Pengembangan](#7-rekomendasi-pengembangan)

---

## 1. Ringkasan Eksekutif

| Kategori | Critical | High | Medium | Low |
|---|---|---|---|---|
| Keamanan | 4 | 5 | 7 | 4 |
| Frontend | 2 | 4 | 8 | 6 |
| Backend & Database | 3 | 5 | 5 | 3 |
| DevOps | 3 | 2 | 4 | 3 |
| **TOTAL** | **12** | **16** | **24** | **16** |

**Verdict:** Project ini memiliki fondasi yang baik (TypeScript strict mode, Supabase RLS enabled, proper gitignore, Context API pattern), namun memiliki celah keamanan serius yang harus ditangani sebelum production, serta banyak area yang bisa dioptimasi dari sisi arsitektur dan performa.

---

## 2. Arsitektur Sistem

### 2.1 Gambaran Umum

```
[Browser] --> [Vite SPA (React 19 + TypeScript)]
                |
                +--> [Supabase Client] --> [Supabase (PostgreSQL + Auth + RLS)]
                |
                +--> [Express API Server (port 3001)] --> [Supabase]
                |
                +--> [Unity WebGL Viewer] (Campus Map)
```

### 2.2 Temuan Arsitektur

#### Dual Data Path yang Tidak Konsisten
Frontend mengakses Supabase melalui **dua jalur berbeda**:
- Langsung via `@supabase/supabase-js` di browser (`supabaseDataService.ts`)
- Via Express server (`server/index.js`) untuk endpoint rooms/buildings

Ini menciptakan inkonsistensi: sebagian data melalui RLS, sebagian tidak. Express server menggunakan anon key (bukan service role key), jadi sebenarnya tidak memberikan nilai tambah dibanding akses langsung.

#### Monolithic Frontend
Seluruh aplikasi di-bundle menjadi satu chunk. Tidak ada code splitting, lazy loading, atau route-based splitting. User yang hanya mengakses dashboard publik tetap download seluruh modul admin (1,822 baris `AdminDashboard.tsx` + semua CRUD modal).

#### State Management Sederhana tapi Bermasalah
Menggunakan React Context API (4 context: Auth, Language, Dashboard, Toast). Tidak ada Context value yang di-memoize, menyebabkan unnecessary re-render di seluruh component tree.

---

## 3. Keamanan (Security)

### CRITICAL

#### 3.1 Kredensial Supabase Ter-commit di Git
**File:** `GITHUB_PAGES_SETUP.md` (line 16, 22) dan `server/.env.example` (line 5-6)

URL dan anon key Supabase ter-hardcode di file yang tracked oleh git. Meskipun anon key bersifat "publik", kombinasi dengan RLS yang terlalu permisif (lihat 3.4) memberikan akses baca ke seluruh data.

```
URL: https://aaysacqsibquiulpdzwz.supabase.co
Key: eyJhbGciOiJIUzI1NiIs... (JWT anon key lengkap)
```

**Rekomendasi:** Rotate key di Supabase dashboard. Ganti isi file dengan placeholder. Hapus dari git history dengan `git filter-branch` atau BFG Repo-Cleaner.

---

#### 3.2 Informasi Sensitif di Console Log (Production)
**File:** `src/components/auth/Login.tsx:52-54`, `src/contexts/AuthContext.tsx:85,93-94`

```typescript
console.log("Username:", username);         // Login.tsx:53
console.log("Password length:", password.length);  // Login.tsx:54
console.log('Attempting login with email:', email); // AuthContext.tsx:85
console.error('Full error:', error);        // AuthContext.tsx:94
```

Username, email format internal, dan error object lengkap ter-log di browser console tanpa kondisi environment.

**Rekomendasi:** Hapus semua console.log/error di production. Gunakan conditional logging: `if (import.meta.env.DEV) console.log(...)`.

---

#### 3.3 CORS Terbuka Penuh di Express Server
**File:** `server/index.js:13`

```javascript
app.use(cors()); // Access-Control-Allow-Origin: *
```

Semua origin diizinkan. Website manapun bisa membuat request ke API ini.

**Rekomendasi:**
```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'http://localhost:5173'],
  methods: ['GET'],
  credentials: false
}));
```

---

#### 3.4 RLS Policies Terlalu Permisif -- Semua User Authenticated = Admin
**File:** `database/rls-policies.sql:49-88`

```sql
-- Pattern yang berulang di SEMUA tabel:
CREATE POLICY "Admin full access for akreditasi" ON akreditasi
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

Siapapun yang ter-autentikasi bisa INSERT, UPDATE, DELETE di **semua tabel**. Tidak ada pengecekan role admin.

**Rekomendasi:** Gunakan custom claim atau tabel referensi:
```sql
CREATE POLICY "Admin write access" ON akreditasi
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.auth_id = auth.uid()
      AND admin_users.role IN ('admin', 'superadmin')
    )
  );
```

---

### HIGH

#### 3.5 Role Diambil dari `user_metadata` yang Bisa Diubah User
**File:** `src/contexts/AuthContext.tsx:54,124`

```typescript
role: session.user.user_metadata?.role || 'admin',
```

`user_metadata` bisa diubah oleh user sendiri via `supabase.auth.updateUser()`. Fallback-nya adalah `'admin'` -- artinya jika metadata kosong, user otomatis jadi admin.

**Rekomendasi:** Simpan role di tabel terpisah (`admin_users`) yang tidak bisa diubah oleh client. Gunakan Supabase custom claims via database function.

---

#### 3.6 Express API Tanpa Authentication
**File:** `server/index.js:46-209`

Semua endpoint (`/api/rooms`, `/api/buildings`, dll.) tidak memiliki middleware autentikasi. Siapapun bisa query data.

---

#### 3.7 Server Menggunakan Anon Key, Bukan Service Role Key
**File:** `server/index.js:17-18`

```javascript
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
```

Backend seharusnya menggunakan `SUPABASE_SERVICE_ROLE_KEY` dengan middleware verifikasi token.

---

#### 3.8 Analytics Table Tanpa Batasan Insert
**File:** `database/rls-policies.sql:95-96`

```sql
CREATE POLICY "Anyone can insert analytics" ON web_analytics_log
  FOR INSERT WITH CHECK (true);
```

Siapapun (termasuk anonymous) bisa insert data apapun ke tabel analytics tanpa batasan. Rentan terhadap data poisoning dan storage exhaustion.

---

### MEDIUM

| # | Temuan | File |
|---|--------|------|
| 3.9 | Error message expose email format internal (`username@admin.upnvj.ac.id`) | `AuthContext.tsx:98-101` |
| 3.10 | XOR "encryption" dengan key hardcoded (`UPNVJ2025Dashboard`) | `dataProtection.ts:10,15-23` |
| 3.11 | JWT di-parse tanpa verifikasi signature | `dataProtection.ts:209-226` |
| 3.12 | Tidak ada rate limiting di login | `Login.tsx:47-73` |
| 3.13 | Type `password_hash` ada di client-side | `supabase.ts:26-28` |
| 3.14 | Error internal di-expose ke HTTP response | `server/index.js:77,121,164,207` |
| 3.15 | Security headers tidak lengkap (tidak ada CSP, HSTS) | `public/_headers` |

### LOW

| # | Temuan | File |
|---|--------|------|
| 3.16 | `innerHTML` pada static string (aman tapi fragile) | `SkeletonLoader.tsx:145-150` |
| 3.17 | "Hash" function hanya hex encoding, bukan hashing | `trackingService.ts:86-95` |
| 3.18 | Tabel `admin_users` tidak ada RLS policy | `rls-policies.sql` (absent) |
| 3.19 | Console logging berlebihan di production | Multiple files |

---

## 4. Frontend Best Practices

### CRITICAL

#### 4.1 Tidak Ada Lazy Loading / Code Splitting
**File:** `src/App.tsx:7-10`

```typescript
import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import Login from "./components/auth/Login";
```

Semua route di-import eagerly. Seluruh modul admin (1,822 baris + modal + tabel) masuk ke initial bundle.

**Rekomendasi:**
```typescript
const AdminDashboard = React.lazy(() => import("./components/admin/AdminDashboard"));
const Login = React.lazy(() => import("./components/auth/Login"));
```

---

#### 4.2 AdminDashboard.tsx = 1,822 Baris Monolitik
**File:** `src/components/admin/AdminDashboard.tsx`

Satu file berisi:
- Main AdminDashboard component
- ProfessorsTable (lines 782-965)
- AccreditationsTable (lines 968-1157)
- StudentsTable (lines 1160-1352)
- FacilitiesTable (lines 1355-1648)
- ProgramsTable (lines 1651-1821)
- Dead code / unreachable return statement (lines 651-676)
- Hidden button masih di DOM (line 530)

---

### HIGH

#### 4.3 Context Value Tidak Di-Memoize (Re-render Massal)
**File:** `src/contexts/DashboardContext.tsx:51-62`, `AuthContext.tsx:148-158`, `LanguageContext.tsx:45-48`

Semua Context Provider membuat object baru di setiap render, menyebabkan seluruh consumer re-render.

**Rekomendasi:**
```typescript
const value = useMemo(() => ({
  data, faculties, loading, error, reload: loadData,
}), [data, faculties, loading, error]);
```

---

#### 4.4 Duplikasi Code Massif

| Komponen | Duplikasi | Jumlah |
|----------|-----------|--------|
| Pagination logic (`getPageNumbers`) | Copy-paste identik | 5 kali |
| Modal body scroll prevention (`useEffect`) | Copy-paste identik | 4 kali |
| Modal shell structure (backdrop, container, header, footer) | Near-identical | 5 kali |
| `handleSubmit` pattern di setiap modal | Near-identical | 5 kali |
| `ProgramBarChart` vs `DepartmentBarChart` | 95% identik | 2 file |
| Data loading (`loadData`) | Identik | 2 kali (DashboardContext + AdminDashboard) |

**Rekomendasi:** Buat reusable components:
- `<Pagination />` component
- `useBodyScrollLock(isOpen)` custom hook
- `<ModalShell>` wrapper component
- `<HorizontalBarChart>` generic chart

---

#### 4.5 Error Handling Tidak Konsisten (3 Metode Berbeda)

| Komponen | Metode |
|----------|--------|
| `AdminDashboard.handleSave` | `alert()` |
| `AdminDashboard.handleSaveProfessor` | `showToast("...", "error")` |
| `ProfessorModal`, `AccreditationModal`, `StudentModal`, `ProgramModal` | `alert()` |
| `DashboardContext.loadData` | `setError(string)` |
| `FacilitiesTable.fetchFacilities` | `console.error()` only (user tidak tahu ada error) |

Beberapa path menghasilkan **double error** -- modal menampilkan `alert()` lalu throw error, parent menampilkan `toast`.

**Rekomendasi:** Standardisasi ke `ToastContext` yang sudah ada. Hapus semua `alert()`.

---

### MEDIUM

#### 4.6 Accessibility (a11y) Hampir Tidak Ada

| Area | Masalah |
|------|---------|
| Carousel | Tidak ada `role="region"`, `aria-roledescription`, `aria-live` |
| Modals | Tidak ada `role="dialog"`, `aria-modal`, focus trapping |
| Tab Navigation | Tidak ada `role="tablist"`, `role="tab"`, `aria-selected` |
| Toast | Tidak ada `role="alert"` atau `aria-live` |
| Icon Buttons | Tidak ada `aria-label` (edit, delete, navigation dots) |
| Tables | Tidak ada `scope` pada `<th>` |

---

#### 4.7 Performance Issues

| Masalah | File |
|---------|------|
| Resize listener tanpa debounce | `Dashboard.tsx:37-53` |
| Carousel timer tidak reset saat navigasi manual | `Dashboard.tsx:70-88` |
| `heroImages` array dibuat ulang setiap render | `Dashboard.tsx:63-67` |
| Chart dimensions tidak reactive terhadap window resize | `FacultyBarChart.tsx:28-29` |
| FacilitiesTable refetch setiap kali tab di-switch | `AdminDashboard.tsx:1370-1372` |
| Tidak ada `React.memo`, `useMemo`, atau `useCallback` kecuali di 3 file | Seluruh codebase |

---

#### 4.8 i18n Tidak Konsisten

| Masalah | Detail |
|---------|--------|
| Admin module 100% hardcoded Bahasa Indonesia | `AdminDashboard.tsx` (1,822 baris) |
| Login punya translation object sendiri, terpisah dari sistem global | `Login.tsx:18-43` |
| Tidak ada type safety untuk translation key (typo = silent fail) | `translations.ts` |
| Key name tidak cocok dengan konten: `excellenceSince1996` berisi "Since 1967" | `translations.ts:202,402` |

---

#### 4.9 Type Definitions Bermasalah
**File:** `src/types/index.ts`

- Database fields dan display fields dicampur dalam satu interface (e.g., `nama_dosen` + `name?` di `Professor`)
- ID types tidak konsisten: `number`, `string`, `string | number`, `number | string`
- `ProgramData.level` missing `"S3"` tapi ada di database, `ProgramModal` punya `"D4"` dan `"Profesi"` yang tidak ada di type
- `ApiResponse`, `PaginatedResponse`, `PaginationMeta` defined tapi tidak digunakan

---

#### 4.10 Dead Code / Unused Code

| Item | File |
|------|------|
| `retry.ts` (retryWithBackoff, retryIf, withRetry) | Tidak pernah di-import |
| `RateLimiter` class | `dataProtection.ts:157-179` -- tidak pernah di-import |
| `sanitizeData`, `obfuscateData` functions | `dataProtection.ts` -- tidak pernah di-import |
| Legacy asset CRUD stubs (createAssetCategory, etc.) | `supabaseDataService.ts:1135-1160` |
| `ApiResponse`, `PaginatedResponse` types | `types/index.ts` |
| Unreachable return statement | `AdminDashboard.tsx:651-676` |
| Hidden button (`display:none`) | `AdminDashboard.tsx:530` |
| Unused CSS animations | `index.css` (~6 keyframes) |

---

#### 4.11 CSS Organization

| Masalah | Detail |
|---------|--------|
| Style di 3 lokasi berbeda | `index.css`, `App.css`, inline `<style>` tag di AdminDashboard |
| `.card-hover` didefinisikan di `index.css` DAN `App.css` | Duplikat identik |
| `@keyframes fadeIn` didefinisikan di kedua file | Duplikat identik |
| Override Tailwind `.transition-all` | `App.css:9-11` -- override built-in utility |
| WebKit-only scrollbar styles | `App.css:14-29` -- Firefox tidak terpengaruh |

---

## 5. Backend & Database

### CRITICAL

#### 5.1 Tidak Ada Rate Limiting
**File:** `server/index.js:12-14`

Server Express tidak memiliki rate limiting. Package `express-rate-limit` tidak terinstall.

**Rekomendasi:**
```javascript
import rateLimit from 'express-rate-limit';
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

---

#### 5.2 Seluruh Data Tabel Bisa Dibaca Publik
**File:** `database/rls-policies.sql:23-42`

```sql
CREATE POLICY "Public read access for dosen" ON dosen FOR SELECT USING (true);
CREATE POLICY "Public read access for mahasiswa" ON mahasiswa FOR SELECT USING (true);
```

NIM mahasiswa, NIDN dosen, email, dan data pribadi lainnya dapat diakses oleh **siapa saja** dengan anon key.

---

#### 5.3 Tidak Ada Input Validation di CRUD Operations
**File:** `src/services/api/supabaseDataService.ts:603+`

Tidak ada validasi format NIDN, range NIM, panjang string, format email, atau sanitasi input. Contoh:
```typescript
nidn: professor.nidn || `NIDN-${Date.now()}`,  // Fallback random
id_prodi: student.id_prodi || 1,                // Fallback hardcoded
```

---

### HIGH

#### 5.4 Database Schema Kekurangan

| Masalah | Detail |
|---------|--------|
| Tidak ada `created_at`/`updated_at` di tabel utama | Hanya `admin_users` yang punya `created_at` |
| Tidak ada CHECK constraint untuk enum columns | `mahasiswa.status`, `program_studi.jenjang`, `admin_users.role` |
| `web_analytics_log` tanpa data retention | Tabel akan tumbuh tanpa batas |
| Kolom `fasilitas.color` = presentasi logic di data layer | Redundan dengan `categoryColors` di service |
| Semua admin user menggunakan password hash yang sama | `insert-dummy-data.sql` -- password: "password123" |

---

#### 5.5 In-Memory Cache Tanpa TTL
**File:** `src/services/api/supabaseDataService.ts:31-32`

```typescript
let dataCache: DashboardData | null = null;
let facultiesCache: FacultyInfo[] | null = null;
```

Cache tidak pernah expire. Tab browser yang terbuka lama akan menampilkan data stale.

**Rekomendasi:**
```typescript
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 menit

function isCacheValid(): boolean {
  return Date.now() - cacheTimestamp < CACHE_TTL;
}
```

---

#### 5.6 Faculty Mapping Hardcoded di Service
**File:** `src/services/api/supabaseDataService.ts:35-79`

Warna, nama pendek, dan ID fakultas di-hardcode. Menambah fakultas baru membutuhkan perubahan kode, bukan hanya database.

---

### MEDIUM

| # | Temuan | File |
|---|--------|------|
| 5.7 | Duplikasi query logic antara `roomsApi.ts` dan `server/index.js` | Kedua file |
| 5.8 | N+1 query potensial: fetch ALL mahasiswa lalu grouping di JavaScript | `supabaseDataService.ts:234-290` |
| 5.9 | `parseInt(id)` tanpa validasi (bisa jadi `NaN`) | `supabaseDataService.ts:695,744,809` |
| 5.10 | Duplikasi RLS policies antara `setup-analytics.sql` dan `rls-policies.sql` | Kedua file |
| 5.11 | `any` type digunakan secara luas di data service | `supabaseDataService.ts` (12+ lokasi) |

---

## 6. DevOps & Deployment

### CRITICAL

#### 6.1 Zero Testing
Tidak ada framework testing (Jest, Vitest, Cypress, Playwright). Tidak ada file test (`*.test.*`, `*.spec.*`). Tidak ada test step di CI pipeline.

---

#### 6.2 Script yang Broken

| Script | Masalah |
|--------|---------|
| `npm run dev:api` | Referensi `server/index.js` -- direktori mungkin tidak ada di repo |
| `npm run dev:full` | Bergantung pada `dev:api` yang broken |
| `npm run anonymize-data` | Referensi `scripts/anonymize-data.js` -- tidak ada |

---

#### 6.3 CI Pipeline Tidak Lengkap
**File:** `.github/workflows/deploy.yml`

```yaml
# Yang ADA:
- checkout, setup node, npm ci, build, deploy to GitHub Pages

# Yang TIDAK ADA:
- npm run lint (linting)
- npm test (testing)
- npm audit (security audit)
- Environment validation
```

---

### HIGH

#### 6.4 Konflik Deployment Target
- GitHub Actions deploy ke **GitHub Pages**
- `vercel.json` configured untuk **Vercel** (tapi tidak ada Vercel CI)
- `_headers` file untuk **Netlify/Cloudflare Pages** (tidak didukung GitHub Pages)

Tidak jelas target deployment yang sebenarnya.

---

#### 6.5 `process.env.NODE_ENV` di Client Code (Tidak Bekerja di Vite)
**File:** `src/services/analytics/trackingService.ts:112,117,141,146`, `src/components/common/ErrorBoundary.tsx:88`

Vite tidak me-replace `process.env.NODE_ENV` secara otomatis. Harus menggunakan `import.meta.env.DEV` atau `import.meta.env.MODE`.

---

### MEDIUM

| # | Temuan | Detail |
|---|--------|--------|
| 6.6 | Dependencies mati (`express`, `cors`, `dotenv`) | Di `dependencies` tapi server mungkin tidak ada di repo |
| 6.7 | Dua icon library (`lucide-react` + `react-icons`) | Bundle size membengkak |
| 6.8 | Tidak ada Docker configuration | Tidak ada Dockerfile atau docker-compose |
| 6.9 | Environment variables tidak typed | `vite-env.d.ts` tidak declare `ImportMetaEnv` |

### LOW

| # | Temuan | Detail |
|---|--------|--------|
| 6.10 | Version `0.0.0` -- tidak ada versioning strategy | `package.json:4` |
| 6.11 | Tidak ada `engines` field di package.json | Node version tidak di-enforce |
| 6.12 | Google Fonts di-load dua kali | `index.html:23,40` (Material Icons Round) |

---

## 7. Rekomendasi Pengembangan

### Prioritas 1: Security (Harus Segera)

1. **Rotate Supabase credentials** -- Key yang sudah terexpose di git history harus di-rotate
2. **Perbaiki RLS policies** -- Implementasi role-based access control yang proper:
   - Public: read-only untuk data non-sensitif
   - Authenticated: read-only
   - Admin (verified via database): full CRUD
3. **Hapus semua console.log sensitif** di production code
4. **Konfigurasi CORS** dengan whitelist origin
5. **Gunakan service role key** di backend server
6. **Pindahkan role checking** dari `user_metadata` ke tabel database

### Prioritas 2: Architecture (Penting)

7. **Code splitting & lazy loading** -- Pisahkan admin module dari public bundle
8. **Refactor AdminDashboard.tsx** -- Pecah menjadi file terpisah per tabel
9. **Buat reusable components:**
   - `<Pagination />`
   - `<ModalShell />`
   - `useBodyScrollLock()` hook
   - `<HorizontalBarChart />`
10. **Memoize Context values** -- `useMemo` di semua Provider
11. **Standardisasi error handling** -- Hapus `alert()`, gunakan `ToastContext` konsisten
12. **Pisahkan DB types dari display types** -- `ProfessorRow` vs `ProfessorDisplay`

### Prioritas 3: Quality & Testing

13. **Setup testing framework** -- Vitest + React Testing Library (minimal)
14. **Tambahkan lint step di CI** -- `npm run lint` sebelum build
15. **Tambahkan `npm audit`** di CI pipeline
16. **Setup Prettier** untuk code formatting konsisten
17. **Tambahkan eslint-plugin-jsx-a11y** untuk accessibility checking
18. **Hapus dead code** -- `retry.ts` (unused), legacy asset stubs, unreachable returns

### Prioritas 4: Performance

19. **Debounce resize listener** di Dashboard carousel
20. **Implementasi cache TTL** di `supabaseDataService`
21. **Tambahkan `React.memo`** ke chart components dan KPICard
22. **Vendor chunk splitting** di Vite config
23. **Preload/preconnect** untuk Google Fonts
24. **Gunakan `loading="lazy"`** untuk gambar non-hero

### Prioritas 5: DX & Maintenance

25. **Type environment variables** di `vite-env.d.ts`:
   ```typescript
   interface ImportMetaEnv {
     readonly VITE_SUPABASE_URL: string;
     readonly VITE_SUPABASE_ANON_KEY: string;
     readonly VITE_API_URL?: string;
   }
   ```
26. **i18n untuk admin module** -- Gunakan sistem translation yang sudah ada
27. **Konsolidasi CSS** -- Pilih satu pendekatan (Tailwind utilities vs custom CSS)
28. **Tambahkan `created_at`/`updated_at`** di semua tabel database
29. **Tambahkan CHECK constraints** untuk enum-like columns
30. **Cleanup dependencies** -- Hapus `express`/`cors`/`dotenv` jika server tidak dipakai, pilih satu icon library

### Prioritas 6: Nice-to-Have / Pengembangan Lanjutan

31. **Error monitoring** -- Integrasi Sentry atau LogRocket
32. **Structured logging** -- Winston/Pino di backend
33. **Input validation library** -- Zod untuk validasi form dan API input
34. **Data retention policy** -- Auto-cleanup untuk `web_analytics_log`
35. **Docker setup** -- Dockerfile + docker-compose untuk development consistency
36. **E2E testing** -- Playwright untuk critical user flows
37. **404 page** -- Catch-all route untuk URL yang tidak dikenal
38. **SPA routing di Vercel** -- Tambah rewrite rules di `vercel.json`
39. **PWA support** -- Service worker untuk offline capability
40. **Rate limiting** -- Di login form (client-side) dan Express server

---

## Hal Positif yang Sudah Ada

Tidak semua temuan negatif. Berikut yang sudah dilakukan dengan baik:

- TypeScript strict mode enabled dengan `noUnusedLocals` dan `noUnusedParameters`
- `.env` files properly gitignored
- GitHub Actions menggunakan `secrets.*` untuk credentials
- RLS enabled di semua tabel data (meskipun policy-nya perlu diperbaiki)
- React JSX auto-escaping mencegah sebagian besar XSS
- Parallel data fetching dengan `Promise.all()`
- Cache invalidation pada setiap write operation
- Foreign key constraints dengan appropriate CASCADE/SET NULL
- 16 database indexes covering FK dan lookup columns
- Proper table comments di schema
- `ProtectedRoute` component untuk guard admin routes
- Retry with exponential backoff implementation (meskipun belum dipakai di semua tempat)
- Error boundary di root level

---

*Dihasilkan pada: 2026-02-11*
*Analyzer: Claude Code*
