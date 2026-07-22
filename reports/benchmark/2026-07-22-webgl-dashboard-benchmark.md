# Laporan Benchmark Dashboard dan Unity WebGL UPNVJ

Tanggal pengujian: 22 Juli 2026 (WIB)  
Target lokal: `http://127.0.0.1:4173/`  
Target produksi: `https://dashboard-profile-upnvj.vercel.app/`  
Build Unity: `v0.8.6.1`, Unity `6000.4.1f1`  
Status laporan: baseline teknis lengkap; spesifikasi minimum WebGL masih provisional sampai uji foreground pada device fisik selesai.

## 1. Ringkasan eksekutif

### Keputusan singkat

- **Dashboard desktop: lulus.** Lighthouse Performance `99`, Accessibility `100`, Best Practices `100`, SEO `100`.
- **Dashboard mobile: lulus bersyarat.** Performance `88`; tiga kategori lain `100`. Target internal yang disarankan adalah median lima run `>= 90`.
- **Unity WebGL: berfungsi di produksi** pada WebGL 2 melalui Intel UHD Graphics, tetapi belum layak diberi label “minimum-spec certified”.
- **Warm-cache startup produksi: `6,04 detik`** dari pemilihan mode 3D sampai kontrol pencarian Unity aktif.
- **Cold-ish startup produksi: `<= 23,36 detik`** pada sesi pengujian. Angka ini adalah batas atas karena mengandung overhead otomasi dan preload yang sudah berjalan.
- **Payload Unity aktual: `83,12 MiB`**, bukan `~39 MB` seperti teks UI dan rumus estimasi saat ini.
- **Memori fresh Unity:** sekitar `390,4 MiB` WASM terpakai + `205,4 MiB` JS terpakai; total heap yang dialokasikan sekitar `840,6 MiB` sebelum menghitung proses browser, driver, dan memori GPU.
- **FPS steady-state belum valid untuk sertifikasi.** Browser automation mengubah fokus tab dan memicu throttling ke 4–6 FPS. Sampel awal menunjukkan 69–144 FPS, tetapi tidak boleh dipakai sebagai klaim performa perangkat.

### Rekomendasi produk

1. Pertahankan denah 2D sebagai default universal.
2. Untuk sementara, tawarkan 3D sebagai fitur opt-in pada desktop dan perangkat mobile kelas menengah-atas.
3. Jangan klaim dukungan 3D pada HP RAM 3–4 GB sebelum device lab membuktikan tidak ada OOM/context loss.
4. Perbaiki angka ukuran dan estimasi unduhan dari `39 MB` menjadi nilai build aktual atau hitung otomatis dari manifest.
5. Jalankan sertifikasi FPS dengan Unity Profiler + Spector.js + PresentMon pada perangkat fisik.

## 2. Cakupan dan tingkat kepastian

| Area | Status | Keterangan |
| --- | --- | --- |
| Lighthouse dashboard mobile | Valid | Run 22 Juli 2026; artefak JSON lengkap terbentuk walaupun cleanup profil Chrome di Windows mengembalikan `EBUSY` setelah audit selesai. |
| Lighthouse dashboard desktop | Valid | Run 21 Juli 2026 pada source/build yang sama; working tree bersih sebelum instrumentasi. |
| Ukuran file Unity | Valid | Diukur langsung dari file build dan `Content-Length` produksi. |
| Header Brotli/cache produksi | Valid | Diverifikasi langsung pada deployment Vercel. |
| Throughput CDN sesi ini | Valid untuk koneksi penguji | Bukan angka universal; lokasi/CDN/koneksi pengguna akan berbeda. |
| Warm-cache startup produksi | Valid | Stopwatch wall-clock sampai kontrol Unity aktif. |
| Cold startup produksi | Batas atas | Preloader sudah dapat berjalan dan otomasi menambah overhead. |
| Heap WASM/JS | Valid untuk fresh run lokal | Diambil dari `UnityInstance.GetMetricsInfo()` selama 15 sampel. |
| FPS steady-state | Tidak valid | Tab mengalami browser throttling ketika fokus berpindah ke alat otomasi. |
| Spek minimum HP/tablet | Provisional | Harus dikonfirmasi lewat device fisik dan soak test. |

## 3. Lingkungan pengujian

### Mesin penguji

| Komponen | Nilai |
| --- | --- |
| CPU | Intel Core i5-12450H, 8 core / 12 logical processor |
| RAM | 15,6 GB |
| GPU tersedia | Intel UHD Graphics + NVIDIA GeForce RTX 3050 Laptop GPU 4 GB |
| GPU yang benar-benar dipilih browser | Intel UHD Graphics melalui ANGLE / Direct3D 11 |
| OS | Windows 11 Home Single Language 64-bit, `10.0.26200` |
| API grafis Unity | WebGL 2.0 / OpenGL ES 3.0 |
| Build mode web | Vite production preview dan Vercel production |

Catatan: adanya RTX 3050 tidak berarti Unity memakai RTX. Log runtime menunjukkan Chromium memilih Intel UHD; hasil WebGL di laporan ini harus dianggap hasil iGPU.

### Resolusi kanvas yang diamati

| Skenario | CSS canvas | Internal render target |
| --- | ---: | ---: |
| Lokal, keadaan stabil | 1358 × 768 | 1697 × 960 |
| Produksi | 1272 × 720 | 1590 × 900 |

Konfigurasi aplikasi membatasi `devicePixelRatio` maksimum `2`, tetapi render target tetap dapat mahal pada layar HiDPI.

## 4. Perangkat lunak benchmark yang tepat

Lighthouse berguna untuk halaman dashboard, tetapi tidak cukup untuk menilai Unity WebGL. Stack pengujian yang direkomendasikan:

| Tujuan | Alat | Output utama | Status pada audit ini |
| --- | --- | --- | --- |
| Core Web Vitals/lab page load | Lighthouse/Lighthouse CI | FCP, LCP, TBT, CLS, bundle opportunities | Dipakai |
| First/repeat view dari jaringan/lokasi nyata | WebPageTest | waterfall, filmstrip, cold/warm, user journey | Direkomendasikan untuk tahap sertifikasi |
| CPU, scripting, physics, rendering, memory Unity | Unity Profiler, Development Build + Autoconnect | frame breakdown, allocation, GC, module timing | Belum dapat dijalankan; project Unity asli tidak ada di repo web |
| Draw call, shader, texture, framebuffer WebGL | Spector.js | capture satu frame WebGL dan state lengkap | Direkomendasikan |
| JS/WASM startup dan heap browser | Chrome DevTools Performance + Memory Inspector | main-thread trace, WebAssembly memory, long tasks | Sebagian digantikan metrik loader Unity |
| Frame time dan 1% low Windows | PresentMon/CapFrameX | CSV per frame, display/CPU/GPU timing | Direkomendasikan pada foreground run |
| Android real-device | Chrome remote debugging + Perfetto/ADB | CPU, memory, thermal, frame scheduling | Direkomendasikan |
| iOS/iPadOS real-device | Safari Web Inspector + Instruments | memory, CPU, energy, thermal | Direkomendasikan |
| Compatibility matrix | BrowserStack/Sauce Labs | browser/device compatibility | Gunakan untuk compatibility; jangan menganggap cloud VM sebagai FPS GPU yang representatif |

Unity mendokumentasikan bahwa Web build harus dibuat dengan **Autoconnect Profiler**, dan Unity Profiler tidak dapat menyediakan draw-call profiling untuk WebGL. Karena itu Spector.js dibutuhkan sebagai pelengkap, bukan pengganti yang opsional.

## 5. Hasil dashboard

### 5.1 Lighthouse

| Metrik | Mobile | Desktop | Target yang disarankan |
| --- | ---: | ---: | ---: |
| Performance | 88 | 99 | >= 90 |
| Accessibility | 100 | 100 | >= 95 |
| Best Practices | 100 | 100 | >= 95 |
| SEO | 100 | 100 | >= 95 |
| FCP | 2.475 ms | 541 ms | <= 1.800 ms |
| LCP | 3.214 ms | 775 ms | <= 2.500 ms |
| Speed Index | 2.475 ms | 589 ms | <= 3.400 ms |
| TBT | 150 ms | 6 ms | <= 200 ms |
| TTI | 3.533 ms | 781 ms | informasional |
| Max Potential FID | 273 ms | 62 ms | <= 200 ms |
| CLS | 0 | 0 | <= 0,1 |
| Main-thread work | 3.269 ms | 619 ms | turunkan mobile |
| Transfer halaman | 418.421 B | 566.763 B | tidak ada budget absolut tunggal |
| DOM | 355 elemen | 355 elemen | aman |

### 5.2 Interpretasi dashboard

- Bottleneck mobile adalah **paint/render dan main-thread startup**, bukan layout shift.
- LCP mobile `3,214 detik` masih di atas batas “good” `2,5 detik`.
- TBT `150 ms` masih lulus, tetapi Max Potential FID `273 ms` menunjukkan interaksi terburuk masih dapat terasa lambat pada CPU lemah.
- Desktop sudah sangat kuat; perubahan berisiko untuk mengejar skor 100 tidak disarankan.
- Dua sumber unused JavaScript terbesar pada initial load:
  - main bundle: sekitar `40,3 KiB` tidak terpakai (`~31,3%`);
  - vendor Supabase: sekitar `36,4 KiB` tidak terpakai (`~79,9%`).
- Chart Recharts mengeluarkan dua warning container `width(-1)`/`height(-1)` saat section berada di keadaan deferred/offscreen. Ini bukan crash, tetapi perlu dibereskan agar pengukuran dan layout chart konsisten.

### 5.3 Status dashboard

- **Desktop:** pass.
- **Mobile:** conditional pass; lakukan minimal lima run dan gunakan median. Target rilis: Performance `>= 90`, LCP `<= 2,5 s`, TBT `<= 200 ms`, CLS `<= 0,1`.

## 6. Hasil Unity WebGL

### 6.1 Payload build

| File | Byte | MiB | Persentase build |
| --- | ---: | ---: | ---: |
| `v0.8.6.1.data.unityweb` | 80.361.906 | 76,64 | 92,21% |
| `v0.8.6.1.wasm.unityweb` | 6.600.650 | 6,29 | 7,57% |
| `v0.8.6.1.loader.js` | 118.132 | 0,11 | 0,14% |
| `v0.8.6.1.framework.js.unityweb` | 72.306 | 0,07 | 0,08% |
| **Total** | **87.152.994** | **83,12** | **100%** |

Temuan kritis: UI dan komentar source masih memakai asumsi `~39 MB`. Build aktual `83,12 MiB`, sekitar `2,13×` lebih besar. Estimasi waktu di `UnityCampusMap.tsx` menggunakan rumus `(39 × 8) / Mbps`, sehingga perkiraan pengguna bisa kurang dari setengah waktu nyata.

### 6.2 Header produksi

Untuk `data.unityweb`, produksi mengirim:

- `HTTP 200`;
- `Content-Encoding: br`;
- `Content-Length: 80361906`;
- `Cache-Control: public, max-age=31536000, immutable`;
- `X-Vercel-Cache: HIT`.

Ini benar. Warning header Brotli yang muncul pada preview lokal tidak berlaku pada Vercel; Vite preview tidak menerapkan `vercel.json`.

### 6.3 Throughput CDN pada sesi penguji

| File | TTFB | Total download | Throughput |
| --- | ---: | ---: | ---: |
| loader | 168 ms | 189 ms | 0,63 MB/s |
| framework | 126 ms | 139 ms | 0,52 MB/s |
| WASM | 112 ms | 876 ms | 7,53 MB/s |
| data | 90 ms | 10,983 s | 7,32 MB/s |

Total transfer empat file secara berurutan sekitar `12,19 detik`. File besar mendapat throughput sekitar `58,5 Mbps` pada koneksi penguji.

Estimasi ideal payload `83,12 MiB`, sebelum overhead dan startup:

| Koneksi efektif | Waktu transfer ideal | Budget realistis cold-start |
| --- | ---: | ---: |
| 5 Mbps | ~139 s | 160–180 s |
| 10 Mbps | ~70 s | 80–100 s |
| 20 Mbps | ~35 s | 40–55 s |
| 50 Mbps | ~14 s | 20–30 s |
| ~58,5 Mbps terukur | ~12 s | <= 23,36 s teramati |

### 6.4 Startup

| Skenario | Time-to-Unity-controls | Interpretasi |
| --- | ---: | --- |
| Produksi, cold-ish | <= 23,36 s | Batas atas; preload dapat berjalan dan otomasi menambah overhead |
| Produksi, warm cache | 6,04 s | Angka pembanding cache yang paling bersih |
| Lokal Vite preview | 20,43 s | Tidak representatif produksi karena file Brotli didekompresi oleh worker Unity |
| `assetLoadTime` loader lokal | 19,51 s | Sejalan dengan stopwatch lokal |

### 6.5 Memori fresh instance

| Heap | Terpakai puncak | Total dialokasikan/reserved |
| --- | ---: | ---: |
| WASM | 390,4 MiB | 591,3 MiB |
| JavaScript | 205,4 MiB | 249,3 MiB |
| **Gabungan** | **~595,8 MiB** | **~840,6 MiB** |

Angka gabungan belum mencakup seluruh working set Chromium, buffer GPU, texture upload, proses renderer lain, dan overhead OS. Device 3D perlu menyediakan headroom setidaknya `1,2–1,5 GB` untuk tab ini.

Pada inisialisasi kedua tanpa reload penuh, total JS heap sempat tumbuh ke sekitar `413 MiB`. Ini belum membuktikan memory leak karena GC dan lifecycle browser dapat menunda pelepasan, tetapi wajib ditindaklanjuti dengan 10–20 siklus buka/tutup Unity dan heap snapshot.

### 6.6 Render/runtime diagnostics

Fresh local run mencatat:

- 63 warning texture `ASTC6X6` tidak didukung dan didekompresi;
- 3 pesan shader/subshader tidak didukung;
- post-processing FSR/edge adaptive upsampling tidak berjalan pada GPU ini;
- 6 collision mesh tidak valid/non-degenerate;
- 6 resource `UI/Skin/UISprite.psd` gagal dimuat;
- 4 warning collider dengan negative scale;
- physics berjalan `Single-Threaded` pada build WebGL.

Dampak paling mungkin:

1. Dekompresi ASTC menambah startup CPU dan memori pada desktop yang tidak menyediakan ekstensi ASTC.
2. Shader fallback dapat mengubah visual dan menghapus post-processing pada GPU minimum.
3. Collider dan mesh invalid menambah log noise dan dapat menimbulkan bug navigasi/physics.
4. Asset UI yang hilang perlu dibersihkan agar build tidak membawa referensi mati.

Error parsing `/api/unity/data` pada preview lokal tidak dihitung sebagai bug produksi karena Vite preview tidak menjalankan rewrite/API Vercel. Produksi berhasil menampilkan kontrol Unity.

### 6.7 FPS

`GetMetricsInfo()` sempat membaca 69–144 FPS ketika frame pertama aktif, lalu turun ke 4–6 FPS setelah fokus berpindah ke proses otomasi. Chromium memang men-throttle tab yang tidak benar-benar foreground/focused.

Kesimpulan: **tidak ada angka FPS steady-state yang sah dari run ini**. Laporan sengaja tidak menyulap sampel 144 FPS menjadi klaim performa. Sertifikasi harus memakai foreground capture tanpa DevTools mengubah optimisasi, idealnya PresentMon/CapFrameX + Unity Profiler pada device fisik.

## 7. Spek minimum sementara

Spek berikut adalah **release gate provisional**, bukan sertifikasi final.

### 7.1 Dashboard tanpa Unity 3D

| Kelas | Minimum sementara | Rekomendasi |
| --- | --- | --- |
| Desktop/laptop | OS 64-bit modern; 2 core x64 ~2 GHz; RAM 4 GB; browser dua versi terbaru; 1366×768; 5 Mbps | 4 core; RAM 8 GB; 1920×1080; 10+ Mbps |
| Android | Android 10+; CPU 4-core Cortex-A53/A55 class; RAM 3 GB; Chrome modern; 720p; 3 Mbps | Android 12+; RAM 4–6 GB; CPU mid-range; 10+ Mbps |
| iPhone | iOS 15+; iPhone 8/X class; Safari modern | iOS 16+; A13+; RAM 4 GB |
| Tablet | RAM 3–4 GB; browser modern; lebar >= 768 px | RAM 6 GB; SoC mid-range 2021+ |

### 7.2 Unity WebGL 3D

| Kelas | Minimum sementara | Rekomendasi |
| --- | --- | --- |
| Desktop/laptop | OS/browser 64-bit; WebGL 2; WebAssembly 2023; CPU 4 core; RAM 8 GB; Intel UHD/Vega iGPU class dengan >= 1,5 GB shared headroom; 1366×768; 20 Mbps | CPU 6 core; RAM 16 GB; Iris Xe/GTX 1050 atau lebih tinggi; 50 Mbps |
| Android | Android 11+ 64-bit; WebGL 2; RAM 6 GB; Snapdragon 720G/732G, Dimensity 700, Helio G95 class atau lebih tinggi; Chrome current; 20 Mbps | Android 13+; RAM 8 GB; Snapdragon 778G/Dimensity 1080 class; 50 Mbps |
| iPhone | iOS/Safari 16.4+; A13; RAM 4 GB; 20 Mbps | A15+; RAM 6 GB; 50 Mbps |
| Tablet | Android tablet RAM 6 GB atau iPad A14/4 GB; WebGL 2; 20 Mbps | RAM 8 GB atau iPad M1 class; 50 Mbps |

### 7.3 Jangan aktifkan 3D sebagai default pada

- browser 32-bit;
- perangkat tanpa WebGL 2;
- Safari sebelum 16.4 atau browser tanpa WebAssembly 2023;
- RAM total <= 4 GB;
- koneksi 2G/Save-Data;
- device yang pernah mengalami `webglcontextlost` atau gagal mengalokasikan heap.

Untuk device di bawah gate tersebut, tampilkan denah 2D dan alasan yang jelas, bukan error generik.

## 8. Kriteria lulus sertifikasi minimum

### Dashboard

Jalankan lima cold runs dan ambil median:

- Lighthouse Performance >= 90;
- LCP <= 2,5 s;
- TBT <= 200 ms;
- CLS <= 0,1;
- INP field/RUM p75 <= 200 ms;
- tidak ada error runtime yang memblokir konten.

### Unity WebGL

Jalankan minimal 10 menit per device, termasuk jalan kaki, putar kamera, pencarian, navigasi, fullscreen, dan buka/tutup mode:

- median FPS >= 30 pada minimum;
- 1% low >= 20 FPS;
- p95 frame time <= 33,3 ms;
- tidak ada freeze > 1 s setelah scene siap;
- warm time-to-controls <= 8 s;
- cold time-to-controls <= 45 s pada 20 Mbps;
- context loss/crash/OOM = 0;
- peak total browser working set <= 1,5 GB desktop dan <= 1,0 GB mobile;
- tidak ada pertumbuhan heap material setelah 10 siklus buka/tutup;
- suhu/clock tidak mengalami thermal throttling parah selama 15 menit.

## 9. Device matrix untuk sertifikasi

| Tier | Contoh kelas perangkat | Tujuan |
| --- | --- | --- |
| Desktop minimum | 4-core low-power + Intel UHD/Vega iGPU, RAM 8 GB | Menentukan gate minimum nyata |
| Desktop target | Core i5/Ryzen 5 + Iris Xe/GTX 1050+, RAM 16 GB | Target mayoritas pengguna |
| Desktop high | RTX-class, RAM 16–32 GB | Memastikan CPU/build, bukan GPU, yang menjadi bottleneck |
| Android minimum | 6 GB, Snapdragon 720G/Dimensity 700 class | OOM, WebGL2, 30 FPS gate |
| Android target | 8 GB, Snapdragon 778G/Dimensity 1080 class | Pengalaman rekomendasi |
| iOS minimum | A13, 4 GB, iOS 16.4+ | Safari/WASM compatibility |
| Tablet | Android 6–8 GB dan iPad A14/M1 | Touch, orientation, virtual keyboard |

Gunakan minimal tiga unit fisik yang benar-benar berbeda. Browser emulation hanya mengubah viewport/CPU/network; emulation tidak mengganti GPU, driver, thermal behavior, atau kapasitas RAM nyata.

## 10. Prioritas perbaikan

### P0 — sebelum menyatakan minimum spec final

1. Buat Unity Development Build dengan Autoconnect Profiler dari project Unity asli.
2. Jalankan foreground FPS capture pada device matrix dan simpan CSV mentah.
3. Ganti ukuran/estimasi `39 MB` dengan nilai `83,12 MiB` atau manifest otomatis.
4. Tetapkan memory gate dan fallback 2D untuk perangkat rendah.
5. Audit ulang texture compression; sediakan format yang cocok untuk desktop dan mobile tanpa 63 fallback ASTC.

### P1 — dampak besar

1. Turunkan ukuran `data.unityweb` 76,64 MiB: hapus asset tidak terpakai, turunkan texture resolution, mesh compression, audio compression, strip shader variants.
2. Capture Spector.js pada idle, berjalan, dan saat navigasi; tetapkan budget draw call/triangle/texture.
3. Uji lifecycle 10–20 kali untuk memastikan heap kembali setelah `Quit()`.
4. Pertimbangkan preload berbasis intent. Saat ini desktop mengunduh 83,12 MiB otomatis setelah sekitar 10 detik idle meskipun pengguna tidak membuka 3D.
5. Perbaiki shader unsupported, missing UI sprite, degenerate collision mesh, dan negative-scale collider.

### P2 — dashboard

1. Tunda Supabase initial chunk atau fetch sampai benar-benar diperlukan.
2. Kurangi unused main bundle sekitar 40 KiB.
3. Investigasi mobile LCP/render delay dan targetkan LCP <= 2,5 s.
4. Perbaiki warning Recharts `width/height -1` pada deferred section.
5. Jalankan Lighthouse CI lima kali dan gunakan median, bukan satu run.

## 11. Protokol benchmark presisi yang disarankan

1. Buat dua build: production dan Development + Autoconnect Profiler.
2. Bersihkan cache untuk cold run; lakukan 5 cold + 5 repeat-view run.
3. Jalankan skenario tetap: load halaman, buka bagian peta, pilih 3D, tunggu kontrol aktif, jalan 60 detik, putar kamera 30 detik, cari gedung, mulai navigasi, fullscreen, kembali ke 2D.
4. Rekam Unity Profiler untuk CPU/memory, Spector.js untuk tiga frame, dan PresentMon selama 120 detik.
5. Simpan raw `.data`, Spector capture, CSV, trace Chrome, screenshot device info, dan temperatur awal/akhir.
6. Hitung median, p95 frame time, 1% low, peak memory, jank count, cold/warm startup.
7. Spek minimum adalah tier terendah yang lulus semua kriteria pada tiga pengulangan tanpa crash.

## 12. Artefak dan reproduksi

Dashboard:

```powershell
npm.cmd run lighthouse
```

Artefak Lighthouse:

- `reports/lighthouse/latest-mobile.report.json` — mobile run 22 Juli 2026;
- `reports/lighthouse/latest-desktop.json` — desktop run 21 Juli 2026;
- `reports/lighthouse/latest-mobile.html` / `latest-desktop.html` — laporan interaktif yang tersimpan.

Build production dengan `.env` eksplisit pada lingkungan Windows ini:

```powershell
npx.cmd tsc -b
node -r dotenv/config node_modules/vite/bin/vite.js build
```

Catatan runner: Lighthouse sempat selesai membuat report mobile, kemudian gagal membersihkan file profil Chrome sementara dengan `EBUSY`. Ini masalah cleanup alat pada Windows, bukan kegagalan render aplikasi. Runner sebaiknya dibuat toleran terhadap cleanup error dan menormalisasi report sebelum proses Chrome teardown.

## 13. Referensi alat

- [Unity Manual — profiling applications](https://docs.unity3d.com/2022.2/Documentation/Manual/profiler-profiling-applications.html)
- [Unity Manual — GPU Profiler support matrix](https://docs.unity3d.com/es/current/Manual/ProfilerGPU.html)
- [Chrome DevTools — WebAssembly performance profiling](https://developer.chrome.com/docs/devtools/wasm)
- [Chrome DevTools — Memory Inspector](https://developer.chrome.com/docs/devtools/memory-inspector)
- [Chrome DevTools — Performance Monitor](https://developer.chrome.com/docs/devtools/performance-monitor)
- [Spector.js — WebGL frame capture](https://chromewebstore.google.com/detail/spectorjs/denbgaamihkadbghdceggmchnflmhpmk)
- [WebPageTest product/API overview](https://product.webpagetest.org/)
- [Intel PresentMon](https://github.com/GameTechDev/PresentMon)

## 14. Kesimpulan akhir

Dashboard sudah dekat dengan release-grade pada mobile dan sangat baik pada desktop. Risiko utama produk berada pada Unity WebGL: payload `83,12 MiB`, heap gabungan sekitar `840,6 MiB` dialokasikan, fallback texture/shader, serta belum adanya capture FPS foreground lintas device.

Spek minimum yang aman untuk sementara adalah **desktop RAM 8 GB + WebGL 2 + iGPU modern** dan **mobile RAM 6 GB + SoC mid-range + WebGL 2**, dengan denah 2D sebagai fallback. Label minimum resmi baru boleh diterbitkan setelah device matrix memenuhi FPS, memory, startup, dan soak-test gate pada bagian 8.
