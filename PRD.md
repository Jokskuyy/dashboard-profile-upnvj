# PRD: Platform Web UPNVJ — Dashboard Profil Kampus & Sistem Navigasi 3D WebGL

> **Versi:** 2.0 — Post-Grill Unified  
> **Status:** Final Draft  
> **Tanggal:** 14 Juni 2026  
> **Scope:** Frontend (Vite + React SPA) + Backend (Supabase Cloud + Vercel Serverless + Express.js) + Engine 3D (Unity WebGL)  
> **Repo Unity:** `T_A---Copy`  
> **Repo Web:** `dashboard-profile-upnvj`

---

## Problem Statement

Universitas Pembangunan Nasional Veteran Jakarta (UPNVJ) menghadapi tiga masalah utama yang saling berkaitan:

**1. Akses Informasi Kampus yang Terfragmentasi**  
Calon mahasiswa, mahasiswa baru, dan pengunjung kesulitan mendapatkan gambaran spasial dan akademis kampus secara terintegrasi. Data profil (fakultas, program studi, fasilitas) tersebar dan disajikan dalam format statis tanpa koneksi ke representasi fisik kampus.

**2. Navigasi Fisik Kampus yang Sulit**  
Mahasiswa baru, tamu, dan civitas akademika kesulitan menemukan lokasi gedung, ruangan, dan fasilitas. Denah 2D statis dan papan petunjuk fisik tidak memadai, terutama untuk kampus multi-gedung bertingkat dengan koridor dan tangga antar lantai. Tidak ada sistem navigasi digital interaktif yang bisa diakses langsung dari browser — khususnya dari **perangkat mobile** yang merupakan device utama mahasiswa.

**3. Tidak Ada Single Source of Truth untuk Admin**  
Admin kampus tidak memiliki pusat data terpadu untuk memperbarui data gedung, fasilitas, dan program studi secara dinamis — setiap perubahan data fisik kampus harus dilakukan manual di banyak tempat, termasuk menjaga konsistensi antara data web dan model 3D Unity.

---

## Solution

Membangun **Platform Web UPNVJ** yang menyatukan empat komponen terintegrasi:

1. **Interactive Dashboard Publik**: Dashboard interaktif yang menyajikan statistik lalu lintas kunjungan web (Website Traffic Statistics), kartu indikator (KPI) aset kampus (gedung dan fasilitas), serta tabel akreditasi program studi dengan dukungan multi-bahasa (Bahasa Indonesia & English).

2. **Denah Virtual 3D** *(Unity WebGL)*: Peta interaktif 3D kampus dengan dua mode:
   - **Eksplorasi Bebas** — jelajahi kampus tanpa tujuan spesifik
   - **Navigasi Terpandu** — pathfinding first-person ke lokasi spesifik melalui pencarian React
   
   Terhubung langsung ke pencarian React melalui komunikasi satu arah (React→Unity via `SendMessage`). Berjalan sepenuhnya di browser tanpa instalasi.

3. **Admin Panel Terpusat**: Dashboard CRUD berbasis Supabase dengan Row Level Security (RLS), audit logs, dan sinkronisasi data antara web dan Unity scene melalui field `unity_object_name`.

4. **Analytics Terintegrasi**: Pemantauan traffic via Umami Analytics (self-hosted di server kampus) dengan tetap menjaga privasi pengunjung.

**Prinsip kunci:** `unity_object_name` adalah **jembatan tunggal** yang menghubungkan data di database (tabel `gedung`/`fasilitas`) dengan GameObject di Unity scene. Setiap perubahan data gedung melalui Admin Panel langsung tercermin pada kemampuan navigasi Denah Virtual 3D.

---

## Arsitektur Sistem

```
┌──────────────────────────────────────────────────────────────────┐
│                       Browser (Pengguna)                         │
│  ┌────────────────────────────┐  ┌────────────────────────────┐  │
│  │    Vite + React SPA        │  │     Unity WebGL Canvas     │  │
│  │  - Dashboard akademik      │──┤  - Scene 3D kampus         │  │
│  │  - Panel pencarian         │  │  - NavMesh pathfinding     │  │
│  │  - Multi-language toggle   │  │  - First-person control    │  │
│  │  - Admin Panel (Auth)      │  │  - Visual route line       │  │
│  │  - Loading overlay         │  │  - Joystick virtual (mobile)│ │
│  └────────────┬───────────────┘  └────────────────────────────┘  │
│               │ SendMessage("NavigationReceiver","NavigateTo")    │
│               └───────────────────────────────────────────────►  │
└──────────────────────────────────────────────────────────────────┘
                    │                         
     ┌──────────────┼──────────────────────┐
     ▼                                     ▼
┌─────────────────────────┐    ┌────────────────────────────┐
│   VERCEL                │    │   SERVER KAMPUS             │
│                         │    │                            │
│  Static Hosting:        │    │  Express.js (port 3001):   │
│   dist/ (Vite build)    │    │   - Umami API proxy        │
│   unity-builds/ (WebGL) │    │   - Analytics endpoints    │
│  │  - Rate limiter            │
│  Serverless Functions:  │    │                            │
│   api/unity/names.js    │    │  Umami (Docker, port 3000):│
│   api/unity/data.js     │    │   - Web analytics          │
│   api/buildings/*       │    │   - PostgreSQL pendamping   │
│   api/rooms/*           │    │                            │
│   api/health.js         │    │  Supabase (rencana masa    │
│                         │    │   depan, saat ini Cloud)   │
└────────────┬────────────┘    └────────────────────────────┘
             │ HTTPS
             ▼
   ┌────────────────────┐
   │  Supabase Cloud    │
   │  - PostgreSQL      │
   │  - Auth (JWT)      │
   │  - RLS             │
   └────────────────────┘
```

### Stack Teknologi

| Komponen | Teknologi | Deploy |
|---|---|---|
| Frontend | Vite + React SPA + React Router (client-side) | Vercel Static |
| Serverless API | Vercel Functions (Node.js) | Vercel |
| Express.js Server | Node.js + Express | Server kampus (port 3001) |
| Database | Supabase Cloud (PostgreSQL) | Supabase Cloud |
| Engine 3D | Unity 6 (6000.x) + URP | WebGL build → Vercel Static |
| Analytics | Umami (Docker) | Server kampus (port 3000) |
| Unity Input | New Input System (bukan legacy `UnityEngine.Input`) | — |

---

## User Stories

### A. Pengguna Publik (Mahasiswa, Calon Mahasiswa, Tamu)

#### A1 — Dashboard Informasi Akademik
1. Sebagai Pengguna Publik, saya ingin melihat statistik traffic website (tren pengunjung harian dan tampilan halaman), sehingga saya mengetahui tingkat aktivitas platform.
2. Sebagai Pengguna Publik, saya ingin melihat dan menjelajahi sebaran aset kampus (seperti gedung dan fasilitas) via kartu indikator (KPI) serta daftar program studi beserta status akreditasinya, sehingga saya mendapatkan data akademis dan fisik terintegrasi.
3. Sebagai Pengguna Publik, saya ingin beralih bahasa antarmuka (Bahasa Indonesia ↔ English) dengan toggle beranimasi, sehingga saya dapat memahami konten dalam bahasa yang saya kuasai.
4. Sebagai Pengguna Publik, saya ingin preferensi bahasa saya tersimpan otomatis (localStorage), sehingga saat kunjungan berikutnya bahasa tidak kembali ke default.

#### A2 — Denah Virtual 3D & Navigasi
5. Sebagai Pengguna Publik, saya ingin Denah Virtual 3D ter-load langsung di web tanpa perlu memasang aplikasi tambahan.
6. Sebagai mahasiswa baru, saya ingin mencari ruang kelas di kotak pencarian website (satu list campuran gedung + fasilitas, dibedakan ikon), sehingga saya bisa menemukan lokasi kelas dengan cepat tanpa bertanya kepada orang lain.
7. Sebagai Pengguna Publik, saya ingin sistem navigasi Unity memandu saya otomatis dari posisi saat ini ke tujuan setelah memilih lokasi di React, termasuk rute lintas gedung melalui jalan outdoor, sehingga saya tahu rute fisik menuju lokasi tersebut.
8. Sebagai mahasiswa, saya ingin melihat rute visual berupa garis di lantai 3D yang menunjukkan jalan ke tujuan, sehingga saya bisa mengikuti rute secara intuitif.
9. Sebagai mahasiswa, saya ingin rute menampilkan garis yang menyesuaikan kontur tangga antar lantai, sehingga saya bisa menavigasi gedung bertingkat tanpa bingung.
10. Sebagai pengguna, saya ingin melihat nama fasilitas tujuan (nama tampilan, bukan kode internal Unity) di label jarak, sehingga saya yakin sedang menuju tempat yang benar.
11. Sebagai pengguna, saya ingin melihat informasi jarak tersisa ke tujuan, sehingga saya bisa memperkirakan waktu tempuh.
12. Sebagai pengguna, saya ingin navigasi berhenti otomatis saat saya sudah dekat tujuan, sehingga tidak perlu mematikannya manual.
13. Sebagai pengguna, saya ingin bisa memutar kamera 360° tanpa kursor mentok di tepi layar (Pointer Lock), sehingga saya bisa melihat sekeliling secara bebas.
14. Sebagai pengguna, saya ingin menekan ESC untuk melepaskan kursor, sehingga saya bisa kembali menggunakan antarmuka website tanpa keluar dari halaman.
15. Sebagai pengguna di perangkat mobile (**hard requirement**), saya ingin mengontrol karakter via joystick virtual yang hanya tampil di mobile (tersembunyi di desktop), sehingga saya bisa navigasi tanpa keyboard fisik.
16. Sebagai tamu kampus, saya ingin menemukan gedung utama (Rektorat, Masjid, Aula) hanya dengan mengetik nama di pencarian.
17. Sebagai pengguna, saya ingin halaman web memuat < 10 detik meskipun berisi model 3D kampus lengkap.
18. Sebagai pengguna, saya ingin melihat loading screen informatif (progress bar) saat engine dimuat, sehingga pengalaman menunggu terasa lebih baik.

### B. Admin Kampus

19. Sebagai Admin, saya ingin masuk ke halaman admin menggunakan akun aman via Supabase Auth, sehingga hanya personel berwenang yang bisa mengubah data profil kampus.
20. Sebagai Admin, saya ingin menambah/memperbarui/menghapus data gedung (nama, deskripsi, lokasi, jumlah lantai, foto, `unity_object_name`), sehingga Denah Virtual 3D tetap sinkron dengan kondisi fisik.
21. Sebagai Admin, saya ingin mengelola data fasilitas dan mengaitkannya ke gedung beserta info lantainya, sehingga pengguna publik bisa mencari fasilitas berdasarkan letak gedungnya.
22. Sebagai Admin, saya ingin mengelola program studi tiap fakultas (nama, jenjang, akreditasi), sehingga data akademis selalu mutakhir.
23. Sebagai Admin, saya ingin menambahkan gedung/fasilitas baru via dashboard web tanpa menyentuh kode Unity, sehingga data selalu up-to-date.
24. Sebagai Admin, saya ingin setiap entri DB memiliki field `unity_object_name` yang menghubungkan data ke GameObject Unity, sehingga sistem navigasi bisa menemukan target yang tepat.
25. Sebagai Admin, saya ingin bisa memasukkan `nama_gedung` (tampil ke user) terpisah dari `unity_object_name` (internal Unity), sehingga nama yang tampil bisa dalam Bahasa Indonesia yang rapi.
26. Sebagai Admin, saya ingin konfirmasi pop-up (modal) sebelum menghapus data penting, sehingga terhindar dari penghapusan tidak sengaja.
27. Sebagai Admin, saya ingin melihat riwayat perubahan data (audit logs: siapa, kapan, tabel apa, data apa), sehingga akuntabilitas pengelolaan data terjaga.
28. Sebagai Admin, saya ingin memantau statistik traffic kunjungan web via Umami Analytics, sehingga saya tahu halaman paling diakses dan tren kunjungan.

### C. Developer / Tim Teknis

29. Sebagai developer, saya ingin tool Unity Editor (`Tools → UPNVJ → Check Database Sync`) yang memeriksa apakah semua `unity_object_name` di database punya GameObject yang sesuai di scene, sehingga bisa mendeteksi ketidakcocokan sebelum build.
30. Sebagai developer, saya ingin tool tersebut menampilkan tiga kategori: ✅ cocok, ❌ ada di DB tapi tidak di scene, ⚠️ ada di scene tapi tidak di DB (saat ini hanya cek root objects untuk kategori ⚠️).
31. Sebagai developer, saya ingin bisa menyalin daftar objek yang missing ke clipboard langsung dari tool, sehingga pembuatan objek bisa dilakukan lebih cepat.
32. Sebagai developer, saya ingin sistem navigasi menghitung ulang rute hanya saat player berpindah > threshold tertentu (`pathUpdateDistance`), bukan tiap frame, sehingga performa WebGL tetap ringan.
33. Sebagai developer, saya ingin build WebGL dikompres Brotli dengan decompression fallback, sehingga ukuran file yang diunduh browser lebih kecil.
34. Sebagai developer, saya ingin konfigurasi build WebGL (stripping level, IL2CPP, kompresi) di aplikasikan dengan satu klik dari menu Unity (`Tools → UPNVJ → Apply Optimal WebGL Settings`), sehingga pengaturan build selalu konsisten.

---

## Implementation Decisions

### 1. Integrasi Data: `unity_object_name` sebagai Bridge

`unity_object_name` adalah **field kunci** yang menghubungkan dua dunia:
- **Database sisi web**: Field di tabel `gedung` dan `fasilitas` di Supabase, diisi via Admin Panel
- **Unity scene**: Nama GameObject di dalam folder `Pointer` setiap gedung

**Konvensi wajib:** Huruf kecil + underscore (contoh: `mht_201`, `gedung_rektorat`). Lookup bersifat case-insensitive.

**Alur data (setelah fix bug endpoint):**
```
Admin Panel (web) → Supabase Cloud → Vercel Serverless (/api/unity/data)
    → BuildingDatabase.cs (cache realNames + unityObjectNames)
    → NavigationReceiver.cs (cache Transform lookup)
    → NavigationGuide.cs (render path + display name)
```

Ketidakcocokan antara DB dan scene dideteksi via `DatabaseSyncChecker` (Unity Editor Tool, hit `/api/unity/names`) sebelum build.

---

## Modul Unity (C#)

### 2.1 BuildingDatabase
- Fetch dari `/api/unity/data` saat game start (relative URL di WebGL build)
- Cache dua struktur: `unityObjectNames` (list) dan `realNames` (dict `unity_name → nama_tampil`)
- `GetRealName(unityObjectName)` = single source of truth nama tampilan; fallback ke input asli jika tidak ditemukan (bukan `null`)
- Setelah loaded, trigger rebuild cache di `NavigationReceiver` dan `BuildingCulling`
- `isLoaded` flag untuk tracking status

### 2.2 NavigationReceiver
- Terima perintah `NavigateTo(string unityObjectName)` dari JavaScript via `SendMessage`
- Lookup Transform target via cache dictionary (lowercase key) → O(1)
- Fallback bertingkat: cache → rebuild cache → pencarian langsung di scene (`FindInactiveByName`, termasuk inactive objects, case-insensitive)
- Ambil nama tampilan dari `BuildingDatabase.GetRealName()` sebelum kirim ke NavigationGuide
- Terima `StopNavigation("")` dari JavaScript

### 2.3 NavigationGuide
- Kelola siklus navigasi: start, update per frame, stop
- `NavMesh.CalculatePath()` untuk kalkulasi rute
- Path recalculation dipicu **berdasarkan jarak pergerakan player** (threshold `pathUpdateDistance`), bukan timer
- Titik awal rute selalu di-override ke posisi player saat ini
- **Algoritma Catmull-Rom Centripetal** (alpha=0.5) untuk interpolasi corners NavMesh menjadi kurva halus tanpa looping
- **Raycast subdivisi** setiap 10cm sepanjang kurva untuk deteksi ketinggian permukaan (lantai/anak tangga), offset Y=0.20m
- Label teks 3D (TMP) selalu menghadap kamera: tampilkan `nama_fasilitas + jarak tersisa`
- Stop otomatis jika jarak ke target < `stopDistance`
- Integrasi Pointer Lock (New Input System): kunci kursor saat klik kiri, lepas saat ESC

### 2.4 BuildingCulling
- Optimasi performa: nonaktifkan renderer gedung yang terlalu jauh dari player (frustum/distance culling kustom)
- Rebuild cache dipicu oleh `BuildingDatabase` setelah data API dimuat

### 2.5 WebGLOptimizer (Editor Tool)
- Menu: `Tools → UPNVJ → Apply Optimal WebGL Settings`
- Konfigurasi: Brotli compression, decompression fallback, data caching, stripping level Medium, IL2CPP Master
- API: `NamedBuildTarget.WebGL` (Unity 6 — bukan `BuildTargetGroup` obsolete)

### 2.6 DatabaseSyncChecker (Editor Tool)
- Menu: `Tools → UPNVJ → Check Database Sync`
- Fetch dari `/api/unity/names` via `UnityWebRequest` di Editor (menggunakan EditorCoroutines)
- Parse format: `{"unityObjectNames": ["nama1", "nama2", ...]}`
- Pencarian GameObject **secara rekursif** melalui seluruh hierarki scene (root → anak → cucu) untuk kategori "ditemukan" dan "missing in scene"
- Kategori "ada di scene tapi tidak di DB" saat ini hanya mengecek **root objects** (bukan rekursif)
- Tampilkan tiga kategori: ✅ Ditemukan / ❌ Ada di DB tapi tidak di scene / ⚠️ Ada di scene tapi tidak di DB
- Tombol copy ke clipboard untuk list objek missing

### 2.7 Joystick Virtual (StarterAssets Mobile)
- Prefab: `UI_Virtual_Joystick.prefab` + `UIVirtualJoystick.cs`
- **Status:** Sudah ada dan berfungsi di build, tapi belum responsive — tampil di desktop juga
- **TODO:** Tambahkan platform detection untuk hide di desktop, show di mobile

---

## Konvensi Struktur Scene Unity

```
SceneUtama
├── [Infrastruktur]
│   ├── MainCamera
│   ├── PlayerArmature
│   ├── PlayerFollowCamera
│   ├── NavigationGuide
│   ├── NavigationReceiver
│   ├── BuildingDatabase
│   ├── BuildingCulling
│   ├── NavMesh_Bake
│   └── PathLine
├── BuildingObjek
│   └── [NamaGedung]
│       ├── Pointer                    ← Parent dari semua unity_object_name
│       │   ├── [unity_object_name_1]  ← Target navigasi (match dengan DB)
│       │   └── [unity_object_name_2]  ← Bisa gedung ATAU fasilitas
│       ├── Lantai 1
│       ├── Lantai 2
│       └── Lantai N
└── Environment
```

---

## API Contracts

### Vercel Serverless Functions (repo: `dashboard-profile-upnvj/api/`)

| Endpoint | Method | Response Format | Konsumen |
|---|---|---|---|
| `/api/unity/names` | GET | `{ "unityObjectNames": string[] }` | DatabaseSyncChecker (Editor only) |
| `/api/unity/data` | GET | `{ "gedung": UnityGedungData[], "fasilitas": UnityFasilitasData[] }` | BuildingDatabase.cs (runtime) |
| `/api/buildings/*` | GET | Data gedung untuk React frontend | React SPA |
| `/api/rooms/*` | GET | Data fasilitas untuk React frontend | React SPA |
| `/api/health` | GET | `{ "status": "ok" }` | Monitoring |

### Express.js Server (server kampus, port 3001)

| Fungsi | Detail |
|---|---|
| Umami API proxy | Forward analytics requests |
| Analytics endpoints | Aggregated traffic data |
| Rate limiter | Throttle sensitive operations |

### Bridge React→Unity

```js
// Mulai navigasi (kirim unity_object_name dari search result, bukan nama tampilan)
unityInstance.SendMessage("NavigationReceiver", "NavigateTo", unity_object_name)

// Stop navigasi
unityInstance.SendMessage("NavigationReceiver", "StopNavigation", "")
```

---

## Skema Database (Supabase Cloud — PostgreSQL)

```sql
gedung          → id, nama_gedung, deskripsi_gedung, lokasi, jumlah_lantai, foto_url, unity_object_name
fasilitas       → id, nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, color, lantai, id_gedung (FK→gedung), foto_url, unity_object_name
fakultas        → id, nama_fakultas, deskripsi_fakultas, email, website, id_gedung_utama (FK→gedung)
program_studi   → id, nama_prodi, jenjang (D3/S1/S2/S3), id_fakultas (FK→fakultas), akreditasi
admin_users     → id, username, password_hash, nama_lengkap, role, created_at
audit_logs      → id, actor_id, actor_email, action (INSERT/UPDATE/DELETE), table_name, record_id, old_data, new_data, created_at
```

**RLS Policy:**
- `anon`: hanya `SELECT`
- `authenticated`: `SELECT`, `INSERT`, `UPDATE`, `DELETE`

**Audit Logging:** Database trigger otomatis menulis ke `audit_logs` setiap mutasi oleh user terautentikasi.

---

## Frontend (Vite + React SPA)

### 6.1 Routing (React Router, client-side)
- `/` → Dashboard publik (`<DashboardProvider>` + `<Dashboard>`)
- `/admin` → Protected route (`<ProtectedRoute>` + lazy-loaded `<AdminDashboard>`)
- `/login`, `/admin/login` → Lazy-loaded `<Login>`

### 6.2 Integrasi React-Unity (Navigation Bridge)
- Library: `react-unity-webgl`
- Komponen: `CampusMapViewer.tsx`
- **Loading overlay:** React `onProgress` callback → progress bar → smooth opacity transition saat selesai
- **Preloading Strategy:** `scheduleUnityPreload(10000)` — cache WebGL files di background 10 detik setelah halaman utama load, menggunakan `fetch` dengan `priority: "low"` + `requestIdleCallback` + `cache: "force-cache"`
  
  > [!WARNING]
  > **Enhancement needed:** Preload saat ini berjalan otomatis di semua device termasuk mobile. Perlu ditambahkan deteksi `navigator.connection.saveData` / tipe koneksi seluler untuk skip preload di mobile dan ganti dengan tombol eksplisit "Buka Denah 3D".

- Pencarian: `SearchOverlay.tsx` + `useBuildingSearch.ts` — satu list campuran, ikon `Building2` (gedung) / `LayoutGrid` (fasilitas), sub-label nama gedung induk untuk fasilitas

### 6.3 Multi-language Support
- `LanguageProvider` berbasis React Context
- Penggantian bahasa real-time tanpa page reload
- Kamus JSON lokal dengan token replacement: Bahasa Indonesia (`id`) & English (`en`)
- Preferensi disimpan di `localStorage`

### 6.4 Admin Panel
- Autentikasi via Supabase JWT
- CRUD form untuk: `gedung`, `fasilitas`, `program_studi`, `fakultas`
- Konfirmasi modal (`DeleteConfirmModal`) sebelum DELETE, dengan focus trap aksesibilitas
- Tampilan audit logs (read-only)
- Integrasi Umami Analytics dashboard
- Lazy-loaded (code splitting) → tidak membebani halaman publik

---

## Build & Performa WebGL

| Setting | Nilai | Alasan |
|---|---|---|
| Kompresi | Brotli + decompression fallback | Ukuran file kecil; fallback agar bisa jalan meski server tidak serve `Content-Encoding: br` |
| IL2CPP | Master + LTO | Ukuran binary minimal untuk production |
| NavMesh | Di-bake di Unity Editor — **seluruh area kampus** (indoor + outdoor + jalan antar gedung) | Tangga terhubung secara fisik → rute multi-lantai tanpa NavMeshLink manual. Rute lintas gedung supported. |
| Pointer Lock | Kunci saat klik kiri, lepas saat ESC | Aturan keamanan browser: tidak bisa dikunci otomatis saat inisialisasi |
| Path Recalculation | Berdasarkan jarak player (threshold `pathUpdateDistance`) | Hemat performa vs. recalculate tiap frame |

**Vercel deployment:** File `.br` dilayani dengan header `Content-Encoding: br` dikonfigurasi di `vercel.json` per-path:
- `.data.br` / `.data.unityweb` → `Content-Type: application/octet-stream`
- `.wasm.br` / `.wasm.unityweb` → `Content-Type: application/wasm`
- `.framework.js.br` / `.framework.js.unityweb` → `Content-Type: application/javascript`
- Semua unity-builds → `Cache-Control: public, max-age=31536000, immutable`

---

## Analytics

- **Tool:** Umami Analytics (self-hosted di server kampus via Docker)
- **Menggantikan:** Pencatatan log manual
- **Data:** Traffic per halaman, tren kunjungan, halaman paling diakses
- **Privasi:** Tidak ada PII, tidak ada cookie tracking
- **Proxy:** Express.js di server kampus (port 3001) berfungsi sebagai proxy ke Umami API

---

## Known Issues & Planned Fixes

### 🔴 BuildingDatabase Endpoint/Parser Mismatch
- **Masalah:** `Awake()` override ke `/api/unity/names` (returns `{"unityObjectNames":[...]}`), tapi parser expect `{"gedung":[], "fasilitas":[]}` (format `/api/unity/data`). Akibatnya cache `realNames` dan `unityObjectNames` kosong. Navigasi tetap berfungsi via brute-force fallback (`FindInactiveByName`), tapi label menampilkan kode internal (`mht_201`) bukan nama tampilan ("Ruang MHT 201").
- **Fix:** Ubah endpoint di `BuildingDatabase.cs` ke `/api/unity/data` + tambahkan `unity_object_name` ke select query di `api/unity/data.js`

### 🟡 Joystick Virtual Tidak Responsive
- **Masalah:** Joystick tampil di desktop dan mobile
- **Fix:** Tambahkan platform detection (cek `SystemInfo.deviceType` atau `#if UNITY_WEBGL` + JS bridge untuk detect touch device)

### 🟡 Preloading Tidak Mobile-Aware
- **Masalah:** WebGL files di-preload otomatis termasuk di mobile → boros kuota data
- **Fix:** Cek `navigator.connection.saveData` / `effectiveType`, skip preload di koneksi lambat/metered

---

## Testing Decisions

### Prinsip
- Test hanya menguji **perilaku eksternal** dari setiap modul, bukan detail implementasi internal
- Test tidak bergantung pada nama variabel private atau implementasi konkret cache

### Unity (C#)

#### DatabaseSyncChecker (Editor Test)
- Response API 3 nama + scene hanya punya 2 → lapor 1 missing
- Response API kosong → tampilkan error jelas, bukan crash
- Nama di child `Pointer` (bukan root) → harus terdeteksi sebagai "ditemukan"

#### NavigationGuide (Play Mode Test)
- `StartNavigation` dengan target valid → `pathLine` aktif + > 0 posisi
- Player dalam `stopDistance` ke target → `StopNavigation` terpanggil otomatis
- `StopNavigation` dipanggil → `pathLine` nonaktif + label teks dihapus

#### NavigationReceiver (Play Mode Test)
- `NavigateTo` nama ada di cache → panggil `NavigationGuide.StartNavigation` dengan Transform benar
- `NavigateTo` nama tidak ada → fallback + log warning, tidak throw exception

#### BuildingDatabase (Play Mode Test)
- API berhasil → `isLoaded = true`, `unityObjectNames` tidak kosong
- `GetRealName("mht_201")` → nama yang terbaca manusia, bukan kode
- `GetRealName("nama_tidak_ada")` → kembalikan input asli sebagai fallback, bukan `null`

### Web (Vite + React)

#### Unit Tests (Vitest + React Testing Library)
- **`retry.ts`**: Ketahanan koneksi DB/API via exponential backoff
- **`sanitizeData`**: Validasi masking email/telepon di tampilan
- **`rateLimiter`**: Validasi pembatasan akses operasi sensitif
- **`translationEngine.ts`**: Pencarian string via dot-notation key (`dashboard.title`) + resolusi token parameter
- **`DeleteConfirmModal.tsx`**: Perilaku visual modal, aksi klik confirm/batal, focus trap aksesibilitas

#### Integration Tests
- Endpoint Vercel serverless: mock request untuk health, data gedung/fasilitas, error fallback DB

#### Audit Performa & SEO (Lighthouse)
- Metrik: Largest Contentful Paint, Total Blocking Time, Cumulative Layout Shift
- Validasi: code splitting rute Admin Dashboard, caching aset statis

---

## Out of Scope

- **Augmented Reality (AR):** Proyek ini simulasi 3D di browser, bukan AR kamera smartphone
- **Real-time multiplayer / location sharing:** Tidak ada sesi navigasi bersama
- **Text-to-speech / aksesibilitas audio:** Panduan suara tidak termasuk scope ini
- **Offline mode / Service Worker:** Sistem butuh koneksi internet untuk fetch data gedung; IndexedDB caching tidak dicakup
- **Analytics penggunaan rute navigasi:** Tidak ada pelacakan rute mana paling sering dipakai
- **iOS/Android native build:** Target platform adalah WebGL browser
- **Pathfinding di area non-baked NavMesh:** Rute hanya bisa dihitung di area walkable yang sudah di-bake
- **Sistem pembayaran / fitur akademik internal (KRS, dll.)**
- **Pengeditan model 3D dari frontend web:** Pengeditan aset 3D hanya di Unity Editor
- **Unity→React communication:** Informasi detail gedung/fasilitas hanya ditampilkan di sisi React (hasil pencarian), tidak ada callback dari Unity ke React saat klik objek 3D

---

## Further Notes

### Keamanan
- **Supabase Anon Key** aman diekspos di sisi klien karena perlindungan data sepenuhnya mengandalkan RLS di PostgreSQL
- **JWT Auth** untuk semua operasi admin

### Konvensi & Dependencies
- **`unity_object_name` naming:** Wajib lowercase + underscore. Harus sama persis (case-insensitive) dengan nama GameObject di folder `Pointer`
- **Tangga multi-lantai:** Harus terhubung secara fisik (collision mesh tersambung) agar NavMesh bisa rute antar lantai tanpa NavMeshLink manual
- **Package wajib Unity:** `com.unity.editorcoroutines` — agar `DatabaseSyncChecker` bisa hit API dari Editor tanpa Play Mode
- **Browser compatibility:** Pointer Lock API hanya aktif setelah interaksi pengguna pertama (klik) — aturan keamanan browser, tidak bisa di-bypass dari Unity

### Deployment
- **Supabase self-hosted** = rencana masa depan saat server kampus sudah tersedia. Saat ini menggunakan Supabase Cloud agar online 24/7
- **docker-compose.yml** di repo web = **khusus Umami Analytics**, bukan untuk Supabase atau dashboard UPNVJ
- **Unity WebGL builds** disimpan di `/unity-builds/` pada Vercel static hosting, versi saat ini: `v0.2.05`

### Dua Repository
- Unity: `T_A---Copy`
- Web: `dashboard-profile-upnvj`
