# Saran Optimasi Unity WebGL Build

## Dashboard Profil UPNVJ — Denah Virtual Kampus

> Dokumen ini berisi rangkuman analisis dan rekomendasi untuk meringankan build Unity WebGL  
> yang digunakan pada fitur Denah Virtual Kampus di proyek Dashboard Profil UPNVJ.

---

## 1. Analisis Kondisi Saat Ini

### Ukuran Build

| File | Ukuran | Keterangan |
|---|---|---|
| `prototipe.data.br` | ~27 MB | Asset data (texture, model 3D, dll) — **paling besar** |
| `prototipe.wasm.br` | ~8 MB | Compiled C# code (IL2CPP → WebAssembly) |
| `prototipe.framework.js.br` | ~75 KB | Unity framework runtime |
| `prototipe.loader.js` | ~26 KB | Loader/bootstrap script |
| **Total Download** | **~35 MB** | Estimasi setelah dekompresi di RAM: **80–100+ MB** |

### Masalah yang Ditemukan

- **Initial load terlalu berat** — User harus menunggu download 35MB+ sebelum bisa berinteraksi.
- **Timeout 60 detik** mungkin tidak cukup untuk koneksi lambat.
- **Kompatibilitas GitHub Pages** — Brotli compression (`.br`) tidak didukung oleh GitHub Pages, sehingga fitur ini tidak bisa dijalankan di sana.
- **Mobile performance** — Unity WebGL runtime sangat berat untuk perangkat mobile.
- **RAM usage tinggi** — Setelah dekompresi, aset bisa memakan 80MB+ di memori browser.

---

## 2. Rekomendasi Solusi

### 2.1 Optimasi Unity Build Settings (Quick Win) ⭐⭐⭐

Dilakukan di **Unity Editor** sebelum build. Potensi pengurangan: **40–60% ukuran build**.

#### a. Strip Engine Code

```
Player Settings > Other Settings > Strip Engine Code = ON
```

Menghapus modul Unity yang tidak dipakai (misal: Physics 2D, Audio, Cloth, Particle System). Jika proyek hanya menampilkan denah 3D interaktif, banyak modul bawaan yang bisa dibuang.

#### b. Managed Stripping Level

```
Player Settings > Other Settings > Managed Stripping Level = High
```

Menghapus kode C# yang tidak direferensikan. Ini mengurangi ukuran file `.wasm.br` secara signifikan.

> ⚠️ **Catatan:** Jika menggunakan Reflection di C#, gunakan `Minimal` agar tidak error saat runtime.

#### c. Kompresi Texture

```
Texture Import Settings > Max Size = 512 atau 1024
Texture Import Settings > Compression = ASTC atau ETC2
```

File `prototipe.data.br` (27MB) kemungkinan besar berisi texture beresolusi tinggi. Menurunkan resolusi texture dan menggunakan format kompresi mobile-friendly bisa mengurangi ukuran **drastis**.

| Max Size Texture | Estimasi Dampak pada `data.br` |
|---|---|
| 2048 (default) | ~27 MB (saat ini) |
| 1024 | ~12–15 MB |
| 512 | ~6–8 MB |

#### d. Nonaktifkan Modul yang Tidak Dipakai

Di `Project Settings > Player > WebGL`, pastikan modul berikut **dimatikan** jika tidak digunakan:

- [ ] Physics (jika tidak ada simulasi fisika)
- [ ] Physics 2D
- [ ] Audio (jika tidak ada suara)
- [ ] Cloth
- [ ] Particle System (jika tidak ada efek partikel)
- [ ] Video Player
- [ ] AI Navigation (jika tidak ada pathfinding)

#### e. Color Space

```
Player Settings > Other Settings > Color Space = Gamma
```

`Gamma` lebih ringan daripada `Linear` untuk rendering WebGL. Gunakan jika kualitas visual masih dapat diterima.

---

### 2.2 Addressables / Asset Bundles (Lazy Loading) ⭐⭐⭐

Daripada semua aset di-bundle dalam satu file `data.br` (27MB), pisah menjadi beberapa bundle yang di-load secara bertahap:

```
📦 Bundle 1 — Core (Initial Load)
├── Gedung utama (low-poly)
├── Environment dasar
└── UI elements
→ Estimasi: ~3–5 MB

📦 Bundle 2 — Detail (Load on Click)
├── Interior gedung
├── Fasilitas detail
└── Furniture/props
→ Estimasi: ~5–8 MB

📦 Bundle 3 — HD Textures (Load on Demand)
├── Texture resolusi tinggi
├── Foto fasilitas
└── Material detail
→ Estimasi: ~8–10 MB
```

**Keuntungan:**

- Initial load turun dari 35MB → **~5MB**
- User bisa mulai interaksi lebih cepat
- Aset tambahan di-load secara transparan di background

**Implementasi:**

1. Install package `Addressables` di Unity Package Manager
2. Tandai aset dengan label/group
3. Gunakan `Addressables.LoadAssetAsync<T>()` untuk load on demand
4. Host bundle tambahan di CDN terpisah

---

### 2.3 Migrasi ke Three.js / React Three Fiber (Solusi Jangka Panjang) ⭐⭐⭐

Alternatif paling ringan — mengganti Unity WebGL dengan library JavaScript native:

| Aspek | Unity WebGL (Saat Ini) | Three.js / React Three Fiber |
|---|---|---|
| Initial download | **35+ MB** | **500KB – 2MB** |
| RAM usage | 80–100 MB | 10–30 MB |
| Startup time | 10–30 detik | 1–3 detik |
| Integrasi React | Via `SendMessage` (bridging) | **Native React** (langsung) |
| Format 3D | Proprietary | glTF/GLB (standar web) |
| Mobile support | Berat | Ringan & responsif |
| GitHub Pages | ❌ Tidak bisa (Brotli) | ✅ Bisa langsung |

**Langkah migrasi:**

1. Ekspor model 3D gedung dari Unity/Blender ke format `.glb` (biasanya hanya 1–5MB)
2. Install `@react-three/fiber` dan `@react-three/drei`
3. Buat komponen React yang me-render denah 3D
4. Data gedung/fasilitas tetap dari Supabase — langsung di-consume React (tanpa bridging)

**Contoh struktur komponen:**

```
src/components/campus-map/
├── CampusMap3D.tsx        ← Main 3D viewer (React Three Fiber)
├── BuildingModel.tsx      ← Komponen per gedung
├── CameraControls.tsx     ← Orbit/pan/zoom controls
├── BuildingTooltip.tsx    ← Info popup saat hover/klik
└── models/
    ├── campus.glb         ← Model 3D ekspor (~1-5MB)
    └── facilities.glb
```

---

### 2.4 Lazy Loading di React (Quick Win) ⭐⭐

Optimasi di sisi frontend tanpa mengubah Unity build:

#### a. Load Unity Hanya Saat Diminta

Saat ini Unity otomatis di-load saat komponen mount. Ubah agar hanya load saat user **klik tombol**:

```tsx
// CampusMapSection.tsx — hanya load saat user siap
const [shouldLoad, setShouldLoad] = useState(false);

return shouldLoad
  ? <CampusMapViewer />
  : <button onClick={() => setShouldLoad(true)}>Buka Denah Virtual</button>;
```

#### b. Preload Hint Saat Hover

Tambahkan preload hint di `<head>` saat user hover tombol, agar browser mulai download sebelum user klik:

```tsx
const handleHover = () => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '/unity-builds/downloads/prototipe/Build/prototipe.data.br';
  document.head.appendChild(link);
};
```

#### c. Loading Skeleton

Tampilkan estimasi waktu download dan progress bar yang informatif:

```
"Memuat Denah Virtual (35 MB)... 45%"
"Estimasi waktu: ~20 detik"
```

---

### 2.5 CDN + Caching (Quick Win) ⭐⭐

#### a. Host File Build di CDN

Pindahkan file Unity build ke CDN (Cloudflare R2, AWS S3, Vercel Blob) agar download lebih cepat dari edge server terdekat.

#### b. Set Cache Headers

Tambahkan header di `public/_headers` atau konfigurasi hosting:

```
/unity-builds/*
  Cache-Control: public, max-age=31536000, immutable
```

Ini memastikan file Unity **hanya di-download sekali**. Kunjungan berikutnya langsung dari cache browser.

#### c. Service Worker Caching

Gunakan Service Worker untuk cache file Unity secara proaktif:

```javascript
// service-worker.js
const UNITY_CACHE = 'unity-build-v1';
const UNITY_FILES = [
  '/unity-builds/downloads/prototipe/Build/prototipe.data.br',
  '/unity-builds/downloads/prototipe/Build/prototipe.wasm.br',
  '/unity-builds/downloads/prototipe/Build/prototipe.framework.js.br',
  '/unity-builds/downloads/prototipe/Build/prototipe.loader.js',
];
```

---

## 3. Ringkasan Prioritas Implementasi

| Prioritas | Solusi | Effort | Dampak | Waktu |
|---|---|---|---|---|
| 🥇 1 | Optimasi Unity Build Settings | Rendah | Ukuran build turun 40–60% | 1–2 jam |
| 🥈 2 | Lazy Loading di React + Caching | Rendah | UX lebih baik, repeat visit instan | 1–2 jam |
| 🥉 3 | Addressables / Asset Bundles | Sedang | Initial load turun ke ~5MB | 1–2 hari |
| 🏅 4 | CDN Hosting | Rendah | Download lebih cepat | 30 menit |
| 🎯 5 | Migrasi ke Three.js / R3F | Tinggi | Load < 2MB, native React | 1–2 minggu |

---

## 4. Kesimpulan

Build Unity WebGL saat ini berukuran **~35MB** (compressed), yang terlalu berat untuk pengalaman web yang optimal. Penyebab utama adalah:

1. **File `data.br` (27MB)** — kemungkinan besar berisi texture beresolusi tinggi yang belum dioptimasi.
2. **File `wasm.br` (8MB)** — menandakan banyak modul Unity yang tidak dipakai ikut ter-compile.

**Langkah yang disarankan:**

1. **Segera:** Optimasi build settings di Unity (texture compression, code stripping) — bisa mengurangi ukuran 40–60% tanpa mengubah tampilan secara signifikan.
2. **Jangka pendek:** Implementasi lazy loading dan caching di sisi React untuk memperbaiki pengalaman user.
3. **Jangka panjang:** Pertimbangkan migrasi ke Three.js/React Three Fiber jika ingin performa web-native yang sesungguhnya (load < 2MB, kompatibel semua hosting termasuk GitHub Pages).

---

*Dokumen ini dibuat pada 4 Mei 2026 sebagai bagian dari evaluasi teknis proyek Dashboard Profil UPNVJ.*

Prioritas	Solusi	Effort	Dampak
🥇	Optimasi Unity Build Settings (texture, stripping)	Rendah	Bisa kurangi 40-60% size
🥈	Addressables/Asset Bundles untuk lazy loading	Sedang	Initial load bisa turun ke ~5MB
🥉	Migrasi ke Three.js/R3F	Tinggi	Load bisa turun ke < 2MB total
🏅	CDN + Caching headers	Rendah	Repeat visit instan
Mau saya bantu implementasi solusi yang mana? Kalau mau quick win, saya bisa bantu setup lazy loading + preload hints di sisi React sekarang. Kalau mau solusi jangka panjang, saya bisa bantu arsitektur Three.js/React Three Fiber sebagai pengganti Unity WebGL.