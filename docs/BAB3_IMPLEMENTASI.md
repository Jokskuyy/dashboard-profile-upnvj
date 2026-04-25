# BAB 3 — METODE PENELITIAN DAN IMPLEMENTASI SISTEM

## 3.2 Implementasi Sistem

Bab ini menjelaskan proses implementasi sistem Dashboard Profil UPNVJ secara teknis dan mendetail, mencakup metode pengembangan, arsitektur sistem, implementasi backend, frontend, integrasi Unity, fitur CRUD admin, modul pendukung, serta alur sistem secara keseluruhan.

---

## 3.2.1 Metode Pengembangan Sistem (Prototyping)

### Alasan Penggunaan Metode Prototyping

Metode pengembangan yang diterapkan pada sistem ini adalah **metode prototyping**. Pemilihan metode ini didasari oleh beberapa pertimbangan teknis dan kontekstual:

1. **Sistem bersifat multi-platform dan interaktif** — Sistem terdiri dari tiga lapisan yang saling terhubung: backend API, dashboard web, dan visualisasi 3D berbasis Unity WebGL. Integrasi antar lapisan ini memerlukan validasi bertahap agar setiap komponen dapat beroperasi secara kohesif sebelum dianggap final.

2. **Kebutuhan pengguna bersifat dinamis** — Fitur-fitur seperti tampilan visualisasi gedung kampus, tabel data akademik, dan form pengelolaan data administrasi memerlukan umpan balik langsung dari pengguna yang melihat antarmuka nyata, bukan hanya spesifikasi tertulis.

3. **Mempercepat validasi pengalaman pengguna** — Dengan adanya purwarupa fungsional, antarmuka dashboard dan interaksi Unity dapat diuji lebih awal tanpa harus menunggu semua fitur backend selesai dikembangkan.

4. **Mendukung integrasi bertahap** — Integrasi antara Supabase (database), Express API, React dashboard, dan Unity WebGL dilakukan secara modular dan iteratif, sehingga setiap modul dapat diuji secara independen sebelum diintegrasikan ke sistem utuh.

### Tahapan Prototyping

#### a. Requirement Gathering (Pengumpulan Kebutuhan)

Tahap ini dilakukan dengan mengidentifikasi seluruh kebutuhan fungsional dan non-fungsional sistem:

- **Kebutuhan fungsional:** pengelolaan data dosen, mahasiswa, program studi, akreditasi, fasilitas, dan gedung oleh admin; visualisasi kampus 3D interaktif untuk pengguna publik; dashboard statistik akademik; dan dukungan multi-bahasa (Indonesia/Inggris).
- **Kebutuhan non-fungsional:** performa API yang responsif, keamanan autentikasi admin, kompatibilitas browser untuk Unity WebGL, dan aksesibilitas data secara real-time dari Supabase.
- **Kebutuhan integrasi:** Unity WebGL harus mampu mengonsumsi data gedung dan fasilitas dari endpoint API yang sama yang digunakan oleh dashboard web.

#### b. Pembuatan Prototype Awal

Purwarupa awal dikembangkan secara bertahap dalam tiga bagian utama:

- **Backend:** Endpoint REST API dasar (`/api/rooms`, `/api/buildings`, `/api/unity/data`) dibangun menggunakan Express.js dan dihubungkan ke database Supabase PostgreSQL.
- **Frontend:** Tampilan dashboard awal mencakup komponen KPI card, tabel data dosen, tabel akreditasi, dan halaman login admin.
- **Unity WebGL:** Build awal Unity dikonfigurasi untuk menerima data JSON dari React melalui mekanisme `SendMessage`, lalu merender gedung-gedung kampus sebagai objek 3D yang dapat diklik.

#### c. Evaluasi Prototype

Prototype diuji dan dievaluasi dari aspek:

- Ketepatan alur data dari Supabase → API → frontend dan Unity.
- Kemudahan penggunaan antarmuka CRUD pada admin dashboard.
- Ketepatan representasi gedung dan fasilitas pada scene 3D Unity.
- Performa loading Unity WebGL Build (ukuran file, waktu muat).
- Konsistensi respons API terhadap berbagai kondisi input.

#### d. Iterasi Pengembangan

Berdasarkan hasil evaluasi, dilakukan penyempurnaan pada:

- Struktur endpoint API (penambahan endpoint `/api/unity/data` khusus Unity, penambahan endpoint analytics via Umami).
- Optimasi query Supabase menggunakan `Promise.all` untuk pengambilan data paralel.
- Penambahan mekanisme retry pada `DatabaseFetcher.cs` di Unity untuk menangani koneksi tidak stabil.
- Penyempurnaan state management frontend menggunakan React Context API.
- Penambahan modul analytics berbasis Umami untuk menggantikan tracking Supabase yang sudah *deprecated*.

Siklus evaluasi–iterasi ini berulang hingga sistem memenuhi standar fungsional, performa, dan kebutuhan tampilan akhir.

---

## 3.2.2 Arsitektur Implementasi Sistem

Arsitektur sistem menggunakan pendekatan **terdistribusi berbasis API** (*API-first architecture*), di mana tiga lapisan utama — backend, frontend, dan Unity — masing-masing memiliki tanggung jawab yang terpisah namun saling terhubung melalui satu titik data terpusat (API).

### 1) Backend sebagai Data Hub

Backend berfungsi sebagai **pusat data dan logika bisnis** (*single source of truth*). Implementasinya terbagi menjadi dua bentuk:

- **Express.js Server** (`server/index.js`): server Node.js lokal untuk keperluan development dan Unity Editor. Menyajikan endpoint `/api/rooms`, `/api/buildings`, `/api/analytics/*`, dan lainnya.
- **Vercel Serverless Functions** (`api/`): deployment production di Vercel. Setiap file JavaScript di folder `api/` menjadi satu endpoint mandiri (misalnya `api/rooms/index.js` → `GET /api/rooms`, `api/unity/data.js` → `GET /api/unity/data`).

Backend terhubung langsung ke **Supabase** (PostgreSQL as a Service) melalui Supabase JavaScript Client. Semua operasi database (SELECT, INSERT, UPDATE, DELETE) dilakukan menggunakan Supabase SDK.

### 2) Frontend sebagai Interface

Frontend diimplementasikan sebagai **React SPA (Single Page Application)** yang menangani dua peran sekaligus:

- **Dashboard publik** (`/`): menampilkan statistik akademik, data dosen, mahasiswa, akreditasi, dan peta kampus 3D.
- **Admin dashboard** (`/admin`): antarmuka berbasis tabel dan form untuk pengelolaan data CRUD yang diproteksi dengan autentikasi Supabase Auth.

Frontend mengonsumsi data langsung dari **Supabase** melalui Supabase JS Client (bukan melalui Express API), kecuali untuk data analytics yang diproksikan melalui Express.

### 3) Unity sebagai Visual Layer

Unity WebGL berfungsi sebagai **lapisan visualisasi interaktif** yang di-*embed* ke dalam halaman dashboard publik. Unity tidak menyimpan data sendiri, melainkan:

- Menerima data gedung dan fasilitas dari React melalui `unityInstance.SendMessage()` setelah Unity selesai dimuat.
- Merender objek gedung 3D berdasarkan data tersebut.
- Menangani interaksi pengguna (hover dan klik gedung) untuk menampilkan panel informasi dinamis.

Dalam mode development (Unity Editor atau Standalone), Unity dapat langsung fetch data dari backend Express melalui `UnityWebRequest` menggunakan script `DatabaseFetcher.cs`.

### Gambaran Arsitektur Sistem

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
│                                                                    │
│  ┌──────────────────────────┐    ┌────────────────────────────┐  │
│  │   React Frontend (SPA)   │    │    Unity WebGL (Embedded)  │  │
│  │   - Dashboard Publik     │    │    - 3D Campus Map         │  │
│  │   - Admin Dashboard      │    │    - Building Click Events │  │
│  │   - Login / Auth         │    │    - Facility Info Panel   │  │
│  └───────────┬──────────────┘    └────────────┬───────────────┘  │
└──────────────│──────────────────────────────────│─────────────────┘
               │ Supabase JS Client               │ SendMessage (JSON)
               │ / Fetch API                      │ / UnityWebRequest
               ▼                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                          API LAYER                                 │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │            Express.js / Vercel Serverless Functions        │    │
│  │  GET /api/rooms    GET /api/buildings    GET /api/health   │    │
│  │  GET /api/unity/data    GET /api/analytics/*              │    │
│  └───────────────────────────┬──────────────────────────────┘    │
└──────────────────────────────│───────────────────────────────────┘
                               │ Supabase SDK
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                   Supabase (PostgreSQL)                    │    │
│  │  gedung | fasilitas | dosen | mahasiswa | program_studi   │    │
│  │  fakultas | akreditasi | admin_users | web_analytics_log  │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3.2.3 Implementasi Backend (API dan Database)

### a. Struktur Backend

Backend menerapkan pola **modular** dengan pemisahan berdasarkan fungsi:

```
api/                        ← Vercel Serverless Functions (production)
├── _shared.js              ← Helper: Supabase client, CORS, createResponse
├── health.js               ← GET /api/health
├── buildings/
│   ├── index.js            ← GET /api/buildings
│   └── [id].js             ← GET /api/buildings/:id/rooms
├── rooms/
│   ├── index.js            ← GET /api/rooms
│   └── [id].js             ← GET /api/rooms/:id
└── unity/
    └── data.js             ← GET /api/unity/data (khusus Unity)

server/
└── index.js                ← Express server (development + analytics proxy)
```

Di sisi `server/index.js`, struktur kode mengikuti pola berikut:

```
express app
├── Middleware (CORS, JSON parser, rate limiting)
├── Helper functions (createResponse, validateId)
├── API Endpoints (route → query Supabase → return JSON)
└── Error handling terpusat
```

### b. Teknologi Backend

| Komponen | Teknologi |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v4 |
| Database | PostgreSQL (via Supabase) |
| ORM / Query | Supabase JavaScript Client v2 |
| Deployment API | Vercel Serverless Functions |
| Analytics Proxy | Express.js + Umami API Client |
| Bahasa | JavaScript (ES Module) |

### c. Endpoint Utama

#### Endpoint Publik (konsumsi React dan Unity)

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/health` | Health check server |
| GET | `/api/rooms` | Daftar semua fasilitas/ruangan |
| GET | `/api/rooms/:id` | Detail satu fasilitas berdasarkan ID |
| GET | `/api/buildings` | Daftar semua gedung beserta daftar fasilitasnya |
| GET | `/api/buildings/:id/rooms` | Fasilitas dalam satu gedung |
| GET | `/api/unity/data` | Data gedung + fasilitas dalam format Unity-friendly |

#### Endpoint Analytics (proxy ke Umami)

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/analytics/stats` | Statistik total (pageviews, visitors, bounce) |
| GET | `/api/analytics/pageviews` | Data time-series pageviews |
| GET | `/api/analytics/active` | Pengunjung aktif saat ini |
| GET | `/api/analytics/metrics` | Metrik per halaman / device |
| GET | `/api/analytics/events` | Event tracking (klik, interaksi) |
| GET | `/api/analytics/summary` | Ringkasan analytics (digunakan admin dashboard) |

#### Endpoint Auth (README — via Supabase Auth)

Autentikasi tidak diimplementasikan sebagai endpoint Express terpisah, melainkan langsung menggunakan **Supabase Auth** dari sisi klien (lihat subbab 3.2.3.d di bawah).

### d. Autentikasi dan Otorisasi

Sistem menggunakan **Supabase Auth** sebagai mekanisme autentikasi. Alurnya:

1. Admin memasukkan username dan password di halaman `/login`.
2. Frontend mengkonversi username ke format email internal: `{username}@admin.upnvj.ac.id`.
3. Login dilakukan dengan `supabase.auth.signInWithPassword({ email, password })`.
4. Supabase Auth mengembalikan session yang secara otomatis disimpan di browser (LocalStorage) dan di-refresh oleh SDK.
5. `AuthContext.tsx` mendengarkan perubahan state autentikasi melalui `supabase.auth.onAuthStateChange()` dan memperbarui state `admin` secara reaktif.
6. Route `/admin` dilindungi oleh komponen `ProtectedRoute` yang memeriksa status autentikasi dari `AuthContext` sebelum merender halaman admin.

```typescript
// AuthContext.tsx — Contoh alur login
const login = async (username: string, password: string) => {
  const email = `${username}@admin.upnvj.ac.id`;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, message: error.message };
  if (data.session) {
    setAdmin({ id: data.user.id, username, ... });
  }
  return { success: true, message: "Login berhasil" };
};
```

### e. Flow Request–Response

Berikut adalah alur teknis dari sisi backend ketika menerima request:

```
Client (React / Unity)
     │
     │  HTTP GET /api/unity/data
     ▼
Vercel Serverless Function (api/unity/data.js)
     │
     ├─ setCors(res)          ← Set CORS headers (Allow-Origin: *)
     ├─ Validasi method       ← Tolak jika bukan GET
     │
     ├─ getSupabase()         ← Inisialisasi Supabase client
     │
     ├─ Promise.all([
     │    supabase.from("gedung").select(...),
     │    supabase.from("fasilitas").select(...)
     │  ])                    ← Fetch paralel dari 2 tabel
     │
     ├─ Map hasil query ke format Unity-friendly
     │
     └─ res.status(200).json({ gedung: [...], fasilitas: [...] })
```

Contoh format respons `/api/unity/data`:

```json
{
  "gedung": [
    {
      "id": 1,
      "nama_gedung": "Gedung A UPNVJ",
      "deskripsi_gedung": "Gedung utama kampus",
      "lokasi": "Kampus I",
      "jumlah_lantai": 4
    }
  ],
  "fasilitas": [
    {
      "id": 1,
      "nama_fasilitas": "Laboratorium Komputer",
      "deskripsi_fasilitas": "Lab dengan 40 unit komputer",
      "tipe_fasilitas": "Laboratorium",
      "id_gedung": 1,
      "lantai": 2,
      "foto_url": ""
    }
  ]
}
```

### f. Skema Database (PostgreSQL via Supabase)

Database terdiri dari **8 tabel utama** dengan relasi hierarki:

```
akreditasi (id, status, tgl_berlaku, tgl_kadaluarsa)
gedung     (id, nama_gedung, deskripsi_gedung, lokasi, jumlah_lantai)
admin_users (id, username, password_hash, nama_lengkap, role)
    │
    ├── fakultas (id, nama_fakultas, id_gedung_utama FK→gedung)
    │       │
    │       └── program_studi (id, nama_prodi, jenjang, id_fakultas FK, id_akreditasi FK)
    │               │
    │               ├── dosen (id, nidn, nama_dosen, jabatan_fungsional, id_prodi FK)
    │               └── mahasiswa (id, nim, nama_mahasiswa, angkatan, status, id_prodi FK)
    │
    └── fasilitas (id, nama_fasilitas, tipe_fasilitas, id_gedung FK, lantai, foto_url)

web_analytics_log (id, visitor_hash, page_path, device_type, visited_at)
```

Setiap tabel dilengkapi dengan **indeks database** pada kolom yang sering digunakan dalam query (misalnya `idx_dosen_prodi`, `idx_mahasiswa_angkatan`, `idx_fasilitas_gedung`) untuk mengoptimalkan performa query.

---

## 3.2.4 Implementasi Frontend (Dashboard Web)

### a. Framework dan Teknologi Frontend

| Komponen | Teknologi |
|---|---|
| Framework | React 19 (TypeScript) |
| Build Tool | Vite 7 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| Charting | Recharts v3 |
| Icon Library | Lucide React |
| HTTP Client | Supabase JS Client (langsung ke Supabase) |
| Bahasa | TypeScript 5.8 |

### b. Struktur Komponen

Struktur komponen diorganisir berdasarkan domain fungsional:

```
src/
├── App.tsx                       ← Root: routing, context providers
├── contexts/
│   ├── AuthContext.tsx            ← State autentikasi admin (Supabase Auth)
│   ├── DashboardContext.tsx       ← State data dashboard publik + caching
│   ├── LanguageContext.tsx        ← Multi-bahasa (ID/EN)
│   └── ToastContext.tsx           ← Notifikasi global
├── components/
│   ├── common/
│   │   ├── Header.tsx             ← Navigasi atas
│   │   ├── Footer.tsx
│   │   ├── ProtectedRoute.tsx     ← Guard route /admin
│   │   ├── ErrorBoundary.tsx
│   │   ├── SkeletonLoader.tsx     ← Loading state
│   │   └── Toast.tsx              ← Notifikasi pop-up
│   ├── dashboard/
│   │   ├── Dashboard.tsx          ← Halaman utama publik
│   │   ├── KPICard.tsx            ← Kartu statistik ringkas
│   │   └── sections/
│   │       ├── ProfessorsSection.tsx
│   │       ├── AccreditationSection.tsx
│   │       ├── StudentsSection.tsx
│   │       ├── CampusMapSection.tsx  ← Wrapper Unity WebGL
│   │       └── AssetsSection.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx     ← Halaman CRUD admin (tabulasi)
│   │   ├── tables/
│   │   │   ├── ProfessorsTable.tsx
│   │   │   ├── AccreditationsTable.tsx
│   │   │   ├── StudentsTable.tsx
│   │   │   ├── FacilitiesTable.tsx
│   │   │   └── ProgramsTable.tsx
│   │   └── analytics/
│   │       └── AdminTrafficAnalytics.tsx
│   ├── modals/
│   │   ├── crud/
│   │   │   ├── ProfessorModal.tsx
│   │   │   ├── AccreditationModal.tsx
│   │   │   ├── StudentModal.tsx
│   │   │   ├── ProgramModal.tsx
│   │   │   └── FacilityModal.tsx
│   │   └── shared/
│   │       └── DeleteConfirmModal.tsx
│   ├── analytics/
│   │   ├── Analytics.tsx          ← Injeksi Umami script tracking
│   │   ├── TrafficOverview.tsx    ← Grafik traffic publik
│   │   └── trackingHelpers.ts     ← window.umami.track() wrappers
│   ├── campus-map/
│   │   └── CampusMapViewer.tsx    ← Embed Unity WebGL + SendMessage
│   ├── auth/
│   │   └── Login.tsx              ← Form login admin
│   └── charts/
│       ├── FacultyBarChart.tsx
│       └── ProgramBarChart.tsx
├── services/
│   └── api/
│       ├── supabaseDataService.ts ← Semua operasi CRUD ke Supabase
│       └── dataService.ts         ← Re-export + wrapper kompatibilitas
└── lib/
    └── supabase.ts                ← Inisialisasi Supabase client
```

### c. Integrasi API (Data Fetching)

Frontend menggunakan **dua mekanisme** pengambilan data:

**1. Supabase JS Client (untuk data akademik)**

Data dosen, mahasiswa, program studi, akreditasi, gedung, dan fasilitas diambil langsung dari Supabase menggunakan `supabaseDataService.ts`. Query menggunakan Supabase JS SDK dengan join relasi:

```typescript
// Contoh: fetchProfessors() di supabaseDataService.ts
const { data, error } = await supabase
  .from("dosen")
  .select(`
    *,
    program_studi (
      nama_prodi, jenjang,
      fakultas ( nama_fakultas )
    )
  `)
  .order("nama_dosen", { ascending: true });
```

**2. Fetch API ke Express (untuk analytics)**

Data analytics diambil dari Express server yang memproksikan request ke Umami:

```typescript
// umamiService.ts
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
const response = await fetch(`${API_BASE}/api/analytics/summary?days=30`);
```

### d. State Management

State dikelola menggunakan **React Context API** yang dibagi ke empat konteks:

| Context | Isi State | Scope |
|---|---|---|
| `AuthContext` | `admin`, `isAuthenticated`, `isLoading` | Global (seluruh aplikasi) |
| `DashboardContext` | `data` (semua data akademik), `faculties`, `loading`, `error` | Hanya di route `/` |
| `LanguageContext` | `language` (id/en), fungsi `t()` untuk terjemahan | Global |
| `ToastContext` | `showToast()` untuk notifikasi global | Global |

`DashboardContext` juga mengimplementasikan **in-memory caching** untuk menghindari fetch ulang yang tidak perlu:

```typescript
// supabaseDataService.ts
let dataCache: DashboardData | null = null;
let facultiesCache: FacultyInfo[] | null = null;

export const fetchDashboardData = async (): Promise<DashboardData> => {
  if (dataCache) return dataCache;  // Kembalikan cache jika sudah ada
  // ... fetch dari Supabase
  dataCache = result;
  return result;
};
```

Komponen dalam `AdminDashboard.tsx` menggunakan **local state** (`useState`) untuk mengelola state modal (buka/tutup form tambah/ubah), state loading saat save, dan state toast notifikasi per-aksi CRUD.

---

## 3.2.5 Implementasi Integrasi Backend dengan Unity

Integrasi antara React dan Unity WebGL merupakan aspek teknis yang menjadi **keunggulan utama** sistem ini. Unity tidak berdiri sebagai aplikasi terpisah, melainkan di-embed ke dalam halaman React dan bertukar data secara dua arah.

### a. Mekanisme Embedding Unity WebGL ke React

Unity WebGL Build di-embed ke dalam React menggunakan komponen `CampusMapViewer.tsx`. Komponen ini secara dinamis memuat Unity loader script dan menginisialisasi Unity instance pada elemen `<canvas>`:

```typescript
// CampusMapViewer.tsx (disederhanakan)
const unityConfig = {
  dataUrl:      `${basePath}unity-builds/.../prototipe.data.br`,
  frameworkUrl: `${basePath}unity-builds/.../prototipe.framework.js.br`,
  codeUrl:      `${basePath}unity-builds/.../prototipe.wasm.br`,
  streamingAssetsUrl: "StreamingAssets",
};

// Load Unity loader script secara dinamis
const script = document.createElement('script');
script.src = `${basePath}unity-builds/.../prototipe.loader.js`;
document.body.appendChild(script);

// Inisialisasi Unity instance
const instance = await window.createUnityInstance(canvas, unityConfig, (progress) => {
  setLoadingProgress(Math.round(progress * 100));
});
window.unityInstance = instance;
```

### b. Pengiriman Data dari React ke Unity

Setelah Unity berhasil dimuat, React mengambil data gedung dan fasilitas dari Supabase, lalu mengirimkannya ke Unity menggunakan `SendMessage`:

```typescript
// Pseudocode alur di CampusMapViewer atau parent component
const response = await fetch('/api/unity/data');
const jsonData = await response.json();
const jsonString = JSON.stringify(jsonData);

// Kirim JSON ke Unity — targetkan GameObject "DataReceiver"
window.unityInstance.SendMessage("DataReceiver", "ReceiveBuildingsData", jsonString);
```

Di sisi Unity, method `ReceiveBuildingsData` pada script `BuildingDataReceiver.cs` menerima dan memparsing JSON:

```csharp
// BuildingDataReceiver.cs
public void ReceiveBuildingsData(string json)
{
    AllData allData = JsonUtility.FromJson<AllData>(json);
    AllGedung = allData.gedung ?? new GedungData[0];
    AllFasilitas = allData.fasilitas ?? new FasilitasData[0];

    // Bangun lookup dictionary untuk akses O(1)
    foreach (var gedung in AllGedung)
        GedungMap[gedung.id] = gedung;

    foreach (var fasilitas in AllFasilitas)
        FasilitasByGedung[fasilitas.id_gedung].Add(fasilitas);

    IsDataReady = true;
    OnDataReceived?.Invoke();  // Notify semua subscriber
}
```

### c. Format Data JSON (Supabase → API → Unity)

Format data yang dikirim dari API ke Unity mengikuti skema berikut:

```json
{
  "gedung": [
    {
      "id": 1,
      "nama_gedung": "Gedung A",
      "deskripsi_gedung": "Gedung Utama Kampus UPNVJ",
      "lokasi": "Kampus I Limo",
      "jumlah_lantai": 4
    }
  ],
  "fasilitas": [
    {
      "id": 10,
      "nama_fasilitas": "Lab Jaringan",
      "deskripsi_fasilitas": "Laboratorium jaringan komputer",
      "tipe_fasilitas": "Laboratorium",
      "id_gedung": 1,
      "lantai": 2,
      "foto_url": "https://..."
    }
  ]
}
```

Class C# di Unity (`BuildingDataReceiver.cs`) mendefinisikan struct yang **field-nya sama persis** dengan key JSON:

```csharp
[Serializable] public class GedungData {
    public int id;
    public string nama_gedung;
    public string deskripsi_gedung;
    public string lokasi;
    public int jumlah_lantai;
}

[Serializable] public class FasilitasData {
    public int id;
    public string nama_fasilitas;
    public string deskripsi_fasilitas;
    public string tipe_fasilitas;
    public int id_gedung;
    public int lantai;
    public string foto_url;
}
```

### d. Event Interaksi: Klik Gedung → Tampilkan Informasi

Saat pengguna mengklik sebuah objek gedung di scene 3D Unity, alur interaksi berikut terjadi:

```
Pengguna klik objek 3D gedung di Unity
         │
         ▼
BuildingClickHandler.OnMouseDown()
  │ Validasi: IsDataReady?
  │ Ambil data: dataReceiver.GetGedung(gedungId)
  │
  ├─ CameraController.ZoomToTarget(cameraTarget)
  │     └─ Kamera smooth zoom ke posisi gedung
  │
  └─ UIManager.ShowFloorPanel(gedung, fasilitasList)
        ├─ Tampilkan nama gedung, deskripsi, lokasi
        └─ Tampilkan daftar fasilitas per lantai
```

Implementasi `BuildingClickHandler.cs`:

```csharp
void OnMouseDown()
{
    GedungData gedung = dataReceiver.GetGedung(gedungId);
    if (gedung == null) return;

    // Zoom kamera
    CameraController cam = FindObjectOfType<CameraController>();
    cam?.ZoomToTarget(cameraTarget.position, cameraTarget.rotation);

    // Tampilkan panel informasi gedung & fasilitas
    List<FasilitasData> fasilitasList = dataReceiver.GetFasilitasByGedung(gedungId);
    uiManager?.ShowFloorPanel(gedung, fasilitasList);
}
```

Sebagai tambahan, terdapat juga **hover highlight** yang mengubah warna material gedung saat kursor berada di atas objek:

```csharp
void OnMouseEnter() => buildingRenderer.material.color = highlightColor;
void OnMouseExit()  => buildingRenderer.material.color = originalColor;
```

### e. Mode Alternatif: Unity Editor (Direct Fetch via UnityWebRequest)

Untuk keperluan development di Unity Editor (tanpa perlu membuka browser), `DatabaseFetcher.cs` dapat langsung mengambil data dari backend Express melalui `UnityWebRequest`:

```csharp
// DatabaseFetcher.cs
private IEnumerator FetchData(System.Action<bool> onComplete)
{
    using (UnityWebRequest request = UnityWebRequest.Get(GetApiUrl()))
    {
        request.timeout = 10;
        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            string json = request.downloadHandler.text;
            dataReceiver.ReceiveBuildingsData(json);  // Gunakan receiver yang sama
            onComplete?.Invoke(true);
        }
    }
}
```

URL yang digunakan:
- **Unity Editor:** `http://localhost:3001/api/unity/data`
- **WebGL Production:** `https://dashboard-profile-upnvj.vercel.app/api/unity/data`
- Di WebGL mode, `DatabaseFetcher` *tidak* auto-fetch — menunggu data dikirim dari React via `SendMessage`.

### f. Flow Data End-to-End (Integrasi Penuh)

```
1. Admin input/edit data gedung/fasilitas di Admin Dashboard (React)
        │
        ▼
2. React memanggil supabaseDataService (INSERT/UPDATE ke tabel gedung/fasilitas)
        │
        ▼
3. Data tersimpan di Supabase PostgreSQL
        │
        ▼
4. Pengguna buka halaman Dashboard publik
        │
        ▼
5. CampusMapViewer.tsx load Unity WebGL Build (prototipe.loader.js → canvas)
        │
        ▼
6. Unity selesai loading → React fetch GET /api/unity/data
        │
        ▼
7. Vercel Function (api/unity/data.js) query Supabase → kembalikan JSON
        │
        ▼
8. React: window.unityInstance.SendMessage("DataReceiver", "ReceiveBuildingsData", json)
        │
        ▼
9. Unity: BuildingDataReceiver.ReceiveBuildingsData(json) → parse & simpan di memory
        │
        ▼
10. IsDataReady = true → semua BuildingClickHandler dapat menggunakan data
        │
        ▼
11. Pengguna klik gedung → BuildingClickHandler → tampilkan panel info gedung + fasilitas
```

---

## 3.2.6 Implementasi Admin Dashboard (CRUD System)

### a. Fitur CRUD

Admin dashboard mengimplementasikan operasi **Create, Read, Update, Delete** untuk lima entitas data utama:

| Entitas | Tabel Supabase | Tab Admin |
|---|---|---|
| Dosen / Profesor | `dosen` | `professors` |
| Akreditasi Program Studi | `akreditasi` + `program_studi` | `accreditations` |
| Data Mahasiswa | `mahasiswa` | `students` |
| Program Studi | `program_studi` | `programs` |
| Fasilitas Gedung | `fasilitas` | `assets` |

Setiap entitas memiliki:
- **Tabel** untuk Read: `ProfessorsTable.tsx`, `AccreditationsTable.tsx`, dll.
- **Modal form** untuk Create/Update: `ProfessorModal.tsx`, `FacilityModal.tsx`, dll.
- **Modal konfirmasi** untuk Delete: `DeleteConfirmModal.tsx`.

Contoh implementasi CRUD dosen di `AdminDashboard.tsx`:

```typescript
// READ — Load saat komponen mount
const loadData = async () => {
  const [dashboardData, facultiesData] = await Promise.all([
    fetchDashboardData(),
    fetchFaculties(),
  ]);
  setData(dashboardData);
};

// CREATE
const handleAddProfessor = async (professorData) => {
  setSaving(true);
  const result = await createProfessor(professorData);
  if (result.success) {
    showToast("Dosen berhasil ditambahkan", "success");
    clearCache();
    await loadData();
  }
  setSaving(false);
};

// UPDATE
const handleEditProfessor = async (id, professorData) => {
  const result = await updateProfessor(id, professorData);
  if (result.success) {
    showToast("Data dosen berhasil diperbarui", "success");
    clearCache();
    await loadData();
  }
};

// DELETE
const handleDeleteProfessor = async (id) => {
  const result = await deleteProfessor(id);
  if (result.success) {
    showToast("Dosen berhasil dihapus", "success");
    clearCache();
    await loadData();
  }
};
```

### b. Proteksi Akses Admin

Akses ke halaman admin dilindungi di dua lapisan:

**1. Route Guard (Frontend)**

Komponen `ProtectedRoute.tsx` memeriksa status autentikasi dari `AuthContext` sebelum merender halaman admin. Jika belum login, pengguna diredirect ke `/login`:

```typescript
// ProtectedRoute.tsx (pseudocode)
const { isAuthenticated, isLoading } = useAuth();
if (isLoading) return <LoadingSpinner />;
if (!isAuthenticated) return <Navigate to="/login" />;
return children;
```

**2. Supabase Auth (Backend)**

Sesi autentikasi dikelola sepenuhnya oleh Supabase Auth dengan fitur:
- Session otomatis tersimpan di `localStorage` dan di-refresh sebelum expired.
- `supabase.auth.onAuthStateChange()` memastikan state admin di-reset jika sesi kadaluarsa.
- Role-based access: field `role` pada metadata user Supabase dapat digunakan untuk membedakan level akses.

### c. Alur Pengelolaan Data

```
Admin buka /admin → ProtectedRoute cek sesi Supabase
        │
        ├─ Belum login → Redirect ke /login
        │
        └─ Sudah login → Render AdminDashboard
                │
                ├─ loadData() dipanggil saat mount
                │    └─ fetchDashboardData() → Supabase → data tampil di tabel
                │
                ├─ Admin klik "Tambah Data"
                │    └─ Modal form terbuka → Admin isi form → Submit
                │         └─ createXxx() → Supabase INSERT → clearCache() → reload data
                │
                ├─ Admin klik icon "Edit" di tabel
                │    └─ Modal form terbuka dengan data existing → Admin ubah → Submit
                │         └─ updateXxx() → Supabase UPDATE → clearCache() → reload data
                │
                └─ Admin klik icon "Hapus" di tabel
                     └─ DeleteConfirmModal muncul → Admin konfirmasi
                          └─ deleteXxx() → Supabase DELETE → clearCache() → reload data
```

Setiap aksi menampilkan **Toast notification** (sukses/gagal) dan me-*clear* cache in-memory agar data terbaru selalu ditampilkan.

---

## 3.2.7 Implementasi Modul Pendukung

### a. Modul Analytics (Umami Analytics)

Sistem menggunakan **Umami** sebagai platform analytics web yang diintegrasikan melalui dua cara:

**Tracking otomatis (pageviews):**
Script Umami diinjeksikan ke halaman melalui komponen `Analytics.tsx` yang di-render di luar routing tree, sehingga tracking aktif di semua halaman.

**Tracking event manual (klik, carousel):**
`trackingHelpers.ts` menyediakan wrapper untuk memanggil `window.umami.track()`:

```typescript
// trackingHelpers.ts
export const trackClick = (buttonName: string, section: string) => {
  window.umami?.track('button-click', { button: buttonName, section });
};

export const trackCarousel = (action: string, slideIndex: number) => {
  window.umami?.track('carousel-interaction', { action, slide: slideIndex });
};
```

**Dashboard analytics admin:**
Komponen `AdminTrafficAnalytics.tsx` menampilkan data analytics dari endpoint `/api/analytics/summary` yang diproksikan dari Umami melalui Express server.

> **Catatan:** Sistem sebelumnya menggunakan Supabase `web_analytics_log` untuk tracking, tetapi sudah *deprecated* dan digantikan oleh Umami. Tabel `web_analytics_log` masih ada di schema untuk menyimpan data historis.

### b. Modul Search (Pencarian Data)

Setiap tabel di admin dashboard memiliki fitur pencarian berbasis **client-side filtering** menggunakan React state dan array `filter()`. Pencarian diterapkan secara reaktif saat admin mengetik di kolom input search.

Pada halaman dashboard publik, komponen `StudentsSection.tsx` memiliki fitur **filter bertingkat**:
- Filter berdasarkan fakultas
- Filter berdasarkan program studi
- Tampilan tabel mahasiswa yang diperbarui secara reaktif menggunakan `useMemo()` untuk menghindari komputasi ulang yang tidak perlu.

### c. Modul Logging

**Client-side logging:**
Utilitas `logger.ts` digunakan di seluruh codebase untuk logging terstandar, dengan perilaku yang berbeda antara mode development dan production (suppressed di production).

**Server-side logging:**
Express server (`server/index.js`) mencetak log struktural di console untuk setiap startup server, mencantumkan semua endpoint yang tersedia.

**Unity logging:**
Semua script Unity menggunakan prefix tag di setiap pesan `Debug.Log` untuk memudahkan filter log:
```
[DataReceiver] Received data from React/Supabase!
[BuildingClick] Clicked building with gedungId: 1
[DatabaseFetcher] Fetching data from: http://localhost:3001/api/unity/data
```

### d. Modul Multi-Bahasa

`LanguageContext.tsx` mengimplementasikan dukungan **dua bahasa (Indonesia dan Inggris)**. Fungsi `t(key)` mengembalikan string sesuai bahasa aktif, dan pengguna dapat mengubah bahasa dari header navigasi.

### e. Modul Error Handling

- **React:** Komponen `ErrorBoundary.tsx` menangkap error JavaScript yang tidak tertangani di level tree React.
- **API:** Setiap serverless function dan Express route dibungkus `try-catch` dengan respons error terstandar.
- **Unity:** Error parsing JSON dan koneksi yang gagal ditangani dengan mekanisme retry (3x) di `DatabaseFetcher.cs`, dengan log warning yang informatif.

### f. Modul Skeleton Loading

Komponen `SkeletonLoader.tsx` menyediakan placeholder animasi saat data sedang dimuat, mencegah tampilan kosong yang tidak informatif. Tersedia varian `KPICardSkeleton`, `SectionSkeleton`, dan `DashboardSkeleton`.

---

## 3.2.8 Alur Implementasi Sistem

Berikut adalah alur implementasi sistem secara keseluruhan yang menggambarkan bagaimana data mengalir dari input admin hingga ditampilkan di frontend dan Unity:

### Narasi Alur Lengkap

**Langkah 1 — Admin Input/Kelola Data**

Admin membuka browser, navigasi ke `https://dashboard-profile-upnvj.vercel.app/admin`, dan login menggunakan kredensial Supabase Auth. Setelah terautentikasi, admin menggunakan form CRUD untuk menambah, memperbarui, atau menghapus data (dosen, mahasiswa, program studi, fasilitas, gedung).

**Langkah 2 — Data Masuk Database**

Setiap aksi CRUD dari admin dashboard dikirim ke Supabase menggunakan Supabase JS Client. Supabase mengeksekusi operasi INSERT/UPDATE/DELETE pada database PostgreSQL dan mengembalikan hasil operasi ke frontend.

**Langkah 3 — API Mengekspos Data**

Backend (Vercel Serverless Functions atau Express server) menyediakan endpoint REST API yang membaca data dari Supabase dan mengembalikan respons JSON terstandar. Endpoint ini dapat diakses oleh siapa pun tanpa autentikasi (data bersifat publik).

**Langkah 4 — Frontend Dashboard Mengonsumsi API**

Halaman dashboard publik (`/`) mengambil data dari Supabase via `DashboardContext` saat pertama kali dimuat. Data di-cache di memory untuk menghindari fetch berulang. Komponen React merender data ke tampilan tabel, grafik bar chart (Recharts), dan kartu KPI statistik.

**Langkah 5 — Unity Mengonsumsi API**

Ketika `CampusMapSection` dirender, komponen `CampusMapViewer` memuat Unity WebGL Build secara asynchronous. Setelah Unity siap, React melakukan fetch ke `GET /api/unity/data` dan mengirim hasilnya ke Unity via `SendMessage`. Unity memparsing JSON dan menyimpan data di `BuildingDataReceiver` (Singleton).

**Langkah 6 — Interaksi Pengguna di Unity**

Pengguna dapat berinteraksi dengan scene 3D:
- **Hover gedung** → highlight visual (warna berubah).
- **Klik gedung** → kamera zoom ke gedung, panel informasi gedung dan daftar fasilitas per lantai muncul.

Data yang ditampilkan di panel berasal dari data yang sudah di-cache di Unity memory (dari langkah 5), sehingga tidak ada fetch HTTP tambahan saat pengguna berinteraksi.

### Diagram Alur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN FLOW                                                      │
│                                                                   │
│  Admin Login ──► Admin Dashboard ──► Form CRUD                  │
│                                           │                       │
│                              Supabase JS Client                   │
│                                           │                       │
│                                           ▼                       │
│                              Supabase PostgreSQL DB              │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ Data tersimpan
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│  PUBLIC FLOW                                                     │
│                                                                   │
│  Pengguna buka /   ──────────────────────────────────────────   │
│         │                                                         │
│         ├─ DashboardContext.fetchDashboardData()                  │
│         │         └─ Supabase JS Client ──► PostgreSQL           │
│         │              └─ Data → KPI Cards, Tabel, Charts        │
│         │                                                         │
│         └─ CampusMapSection ──► CampusMapViewer                  │
│                   │                                               │
│                   ├─ Load Unity WebGL Build (loader.js + WASM)   │
│                   │                                               │
│                   ├─ fetch GET /api/unity/data                   │
│                   │       └─ Vercel Function ──► Supabase        │
│                   │                └─ JSON { gedung, fasilitas } │
│                   │                                               │
│                   └─ SendMessage("DataReceiver",                  │
│                        "ReceiveBuildingsData", jsonString)        │
│                                   │                               │
│                                   ▼                               │
│              Unity: parse JSON → BuildingDataReceiver            │
│                       IsDataReady = true                          │
│                                   │                               │
│              Pengguna klik gedung ▼                               │
│              BuildingClickHandler.OnMouseDown()                   │
│                   └─ ShowFloorPanel(gedung, fasilitasList)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Catatan Keunggulan Implementasi

Implementasi sistem ini memiliki beberapa keunggulan teknis yang membedakannya dari sistem dashboard konvensional:

1. **Integrasi lintas platform (React + Unity WebGL):** Unity bukan aplikasi terpisah, melainkan di-embed ke dalam React dan bertukar data secara real-time menggunakan `SendMessage` API. Pendekatan ini memungkinkan data dari satu sumber (Supabase) divisualisasikan di dua medium yang berbeda secara bersamaan.

2. **API sebagai single source of truth:** Baik dashboard web maupun Unity mengonsumsi endpoint API yang sama (`/api/unity/data`). Perubahan data yang dilakukan admin di dashboard akan otomatis tercermin di visualisasi Unity pada refresh berikutnya.

3. **Arsitektur serverless untuk production:** Penggunaan Vercel Serverless Functions menghilangkan kebutuhan mengelola server secara manual, dengan skalabilitas otomatis dan zero-downtime deployment.

4. **Dual-mode Unity data fetching:** Selama development, `DatabaseFetcher.cs` memungkinkan Unity Editor untuk langsung fetch data dari backend lokal tanpa membuka browser. Di production WebGL, data diterima dari React via `SendMessage`. Kedua mode menggunakan `BuildingDataReceiver` yang sama, sehingga logika pengelolaan data tidak perlu diduplikasi.

5. **Fullstack TypeScript:** Frontend menggunakan TypeScript end-to-end dengan type-checking pada semua layer (komponen, context, service, tipe data dari Supabase), meningkatkan reliabilitas kode dan kemudahan refactoring.
