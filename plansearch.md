# Plan: Search & Navigation — Roadmap

> Dokumen ini melacak progress migrasi fitur search dari Unity ke web frontend, menuju arsitektur digital twin.

---

## Phase 1 — Static Search Overlay ✅ SELESAI

**Commit:** `8bd1980` | **Tanggal:** 19 Mei 2026

### Yang sudah dilakukan:
- [x] `NavigationReceiver.cs` — menerima `SendMessage` dari JavaScript
- [x] `BuildingDatabase.cs` — MonoBehaviour menyimpan list gedung
- [x] `NavigationGuide.cs` — arrow navigasi + distance text
- [x] Setup di Unity Inspector (BuildingDatabase, NavigationGuide, NavigationReceiver)
- [x] `SearchOverlay.tsx` — komponen React overlay glassmorphic
- [x] `buildingList.ts` — data statis: `["Dewsar", "Gedung Rektorat"]`
- [x] Integrasi ke `CampusMapViewer.tsx`
- [x] CSS styles di `index.css`

### Pending:
- [ ] Build WebGL baru ✅ selesai (gzip)
- [ ] Copy build ke `public/unity-builds/downloads/prototipe/Build/` — ganti semua file lama
- [ ] Copy `TemplateData/` jika ada perubahan
- [ ] Test end-to-end: search → klik → arrow muncul di Unity

### Lokasi Deploy Build:

```
public/unity-builds/downloads/prototipe/
├── Build/                    ← file build Unity (.data.gz, .wasm.gz, .framework.js, .loader.js)
├── TemplateData/             ← template HTML Unity
├── StreamingAssets/
└── index.html
```

File build saat ini menggunakan **gzip** (`.gz`), bukan Brotli (`.br`).

---

## Phase 2 — Data Dinamis dari Database

**Status:** Belum dimulai

### Tujuan:
Ganti data gedung statis di React dengan data dari Supabase. Admin bisa ubah nama gedung tanpa rebuild Unity.

### Skema DB yang Sudah Ada:

```sql
-- TABEL 1: gedung (parent)
public.gedung
├── id SERIAL PRIMARY KEY
├── nama_gedung VARCHAR(255) NOT NULL UNIQUE   -- nama tampilan
├── deskripsi_gedung TEXT
├── lokasi TEXT
├── jumlah_lantai INT DEFAULT 1
└── foto_url VARCHAR(255)

-- TABEL 2: fasilitas (child, FK ke gedung)
public.fasilitas
├── id SERIAL PRIMARY KEY
├── nama_fasilitas VARCHAR(255) NOT NULL
├── deskripsi_fasilitas TEXT
├── tipe_fasilitas VARCHAR(100)
├── color VARCHAR(50) DEFAULT 'gray'
├── lantai INT DEFAULT 1
├── foto_url TEXT
└── id_gedung INT → REFERENCES gedung(id)

-- Relasi: 1 gedung → banyak fasilitas
```

### Perubahan yang diperlukan:

#### A. Database — Tambah kolom `unity_object_name`

```sql
-- Kolom baru: nama GameObject di Unity Hierarchy
ALTER TABLE public.gedung ADD COLUMN unity_object_name TEXT UNIQUE;

-- Isi mapping (sesuaikan dengan nama di Inspector):
UPDATE public.gedung SET unity_object_name = 'Gedung_Rektorat' WHERE nama_gedung = 'Gedung Rektorat';
UPDATE public.gedung SET unity_object_name = 'Dewsar' WHERE nama_gedung = 'Dewsar';
```

**Penjelasan mapping:**

| Kolom | Fungsi | Siapa yang ubah |
|---|---|---|
| `nama_gedung` | Nama tampilan di search / UI | Admin (bebas ubah) |
| `unity_object_name` | Nama GameObject di Unity scene | Developer (jarang ubah) |

> **Kenapa bukan ID?** `unity_object_name` lebih mudah dikenali dan didebug. Untuk skala kampus (~10-30 gedung), ini sudah cukup aman.

#### B. React (Frontend)

| File | Perubahan |
|---|---|
| `buildingList.ts` | **Hapus** — tidak diperlukan lagi |
| `SearchOverlay.tsx` | Fetch dari Supabase, bukan import statis |
| **Baru:** `hooks/useBuildingSearch.ts` | Custom hook untuk fetch + cache data gedung & fasilitas |

```tsx
// hooks/useBuildingSearch.ts
interface SearchableBuilding {
  nama_gedung: string;
  unity_object_name: string;
  fasilitas?: string[];   // nama fasilitas di gedung ini
}

export function useBuildingSearch() {
  const [buildings, setBuildings] = useState<SearchableBuilding[]>([]);

  useEffect(() => {
    supabase
      .from("gedung")
      .select("nama_gedung, unity_object_name, fasilitas(nama_fasilitas)")
      .then(({ data }) => {
        setBuildings(data?.map(g => ({
          nama_gedung: g.nama_gedung,
          unity_object_name: g.unity_object_name,
          fasilitas: g.fasilitas?.map(f => f.nama_fasilitas) || [],
        })) || []);
      });
  }, []);

  return buildings;
}
```

#### C. SearchOverlay — Search Gedung + Fasilitas

User bisa cari berdasarkan nama **gedung** atau nama **fasilitas**:

```
User ketik "perpus"
  → Hasil 1: "Perpustakaan" (di Gedung Rektorat, Lt. 1)  ← fasilitas
  → Hasil 2: "Gedung Rektorat"                            ← gedung parent

User klik "Perpustakaan"
  → Navigasi ke Gedung_Rektorat di Unity (gedung parent)
  → Info panel: detail fasilitas perpustakaan
```

#### D. Unity — Tidak Ada Perubahan

Unity tetap menerima `unity_object_name` via `SendMessage`. Tidak perlu rebuild.

```js
// React mengirim unity_object_name, bukan nama_gedung
window.unityInstance.SendMessage("NavigationReceiver", "NavigateTo", "Gedung_Rektorat");
```

### Verifikasi Phase 2:
- [ ] Kolom `unity_object_name` ditambahkan ke tabel `gedung`
- [ ] SearchOverlay fetch dari Supabase (bukan statis)
- [ ] Search gedung: ketik nama → klik → navigasi Unity berfungsi
- [ ] Search fasilitas: ketik nama fasilitas → klik → navigasi ke gedung parent
- [ ] Admin ubah `nama_gedung` di Supabase → search menampilkan nama baru
- [ ] Admin panel: field `unity_object_name` pakai dropdown (bukan free text)

---

## Phase 3 — Digital Twin (Enriched Data)

**Status:** Belum dimulai

### Tujuan:
Setiap gedung menampilkan data detail (fasilitas, foto, status) yang bisa diakses dari web overlay saat navigasi.

### Fitur baru:

#### A. Info Panel (React Overlay)

Saat user memilih gedung dan navigasi selesai, tampilkan panel info:

```
┌─────────────────────────────────────┐
│ 🏛️ Gedung Rektorat                  │
│ Lantai: 3                           │
│                                     │
│ Fasilitas:                          │
│  📚 Perpustakaan (Lt. 1)            │
│  🏢 Ruang Rapat (Lt. 2)             │
│  🖥️ Lab Komputer (Lt. 3)            │
│                                     │
│ [📷 Foto]  [📋 Detail]              │
└─────────────────────────────────────┘
```

Data dari Supabase:
```tsx
supabase
  .from("gedung")
  .select("*, fasilitas(*)")
  .eq("unity_object_name", selectedObjectName)
  .single();
```

#### B. Unity → React Communication

Unity mengirim event ke React saat navigasi selesai:

```
NavigationGuide.StopNavigation()
  → jslib → window.dispatchEvent("unity:navComplete")
    → React menampilkan Info Panel
```

File baru: `Assets/Plugins/WebGL/bridge.jslib`

#### C. Admin Panel — Manajemen Gedung

Admin bisa:
- Ubah `nama_gedung` (nama tampilan) → langsung update di search
- Ubah deskripsi, foto, jumlah lantai
- CRUD fasilitas per gedung
- `unity_object_name` ditampilkan sebagai **read-only** atau **dropdown** (hanya developer yang boleh ubah)

#### D. Supabase Realtime (Opsional)

```tsx
supabase
  .channel("gedung_changes")
  .on("postgres_changes", { event: "*", schema: "public", table: "gedung" },
    () => refetchBuildings() // auto-update search list
  )
  .subscribe();
```

### Perubahan Phase 3:

| File | Status | Keterangan |
|---|---|---|
| `BuildingInfoPanel.tsx` | Baru | Panel info overlay |
| `bridge.jslib` | Baru | Unity → JS communication |
| `NavigationGuide.cs` | Modifikasi | Kirim event saat navigasi selesai |
| `SearchOverlay.tsx` | Modifikasi | Tampilkan info setelah navigasi |

---

## Arsitektur Target (Phase 3)

```
┌──────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│                                                              │
│  ┌──────────────────────┐    ┌─────────────────────────────┐ │
│  │  React Web App       │    │  Unity WebGL Canvas         │ │
│  │                      │    │                             │ │
│  │  SearchOverlay ──────┼──→ │  NavigationReceiver         │ │
│  │  (nama_gedung +      │ SM │    └→ NavigationGuide       │ │
│  │   nama_fasilitas)    │    │       └→ Arrow + Distance   │ │
│  │                      │    │                             │ │
│  │  BuildingInfoPanel ←─┼──  │  StopNavigation             │ │
│  │  (detail + fasilitas)│ EV │    └→ bridge.jslib          │ │
│  └──────────┬───────────┘    └─────────────────────────────┘ │
│             │                                                │
│             │ fetch          SM = SendMessage (JS → Unity)   │
│  ┌──────────▼───────────┐    EV = Event (Unity → JS)        │
│  │  Supabase            │                                    │
│  │  ┌─────────────┐     │                                    │
│  │  │ gedung       │←──┐ │                                    │
│  │  │ + unity_obj  │   │ │                                    │
│  │  └─────────────┘   │ │                                    │
│  │  ┌─────────────┐   │ │                                    │
│  │  │ fasilitas    │───┘ │    (FK: fasilitas.id_gedung)      │
│  │  └─────────────┘     │                                    │
│  └──────────────────────┘                                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Timeline Estimasi

| Phase | Effort | Dependensi |
|---|---|---|
| Phase 1 ✅ | Selesai | — |
| Phase 2 | 2–4 jam | ALTER TABLE gedung + isi unity_object_name |
| Phase 3 | 1–2 hari | Phase 2 + build Unity baru (jslib) |
