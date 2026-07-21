# AI Handoff - Latest Lighthouse Audit

> Status: hasil audit terbaru dan sumber kebenaran untuk pekerjaan optimasi berikutnya.  
> Audit selesai: 21 Juli 2026, sekitar 08:15 WIB (01:15 UTC).  
> State aplikasi yang diaudit sudah tersimpan pada commit `bdeb5bc` (`perf: improve Lighthouse scores and reporting`).

## 1. Tujuan dokumen

Dokumen ini memberi AI penerus konteks yang cukup untuk melanjutkan optimasi tanpa mengulang investigasi awal. Angka di bawah diambil dari artefak JSON Lighthouse, bukan ditranskrip hanya dari tampilan HTML.

Sumber data lokal:

- `reports/lighthouse/latest-mobile.json`
- `reports/lighthouse/latest-desktop.json`
- `reports/lighthouse/latest-mobile.html`
- `reports/lighthouse/latest-desktop.html`
- `reports/lighthouse/latest-summary.md`

HTML dan JSON diabaikan oleh Git karena besar dan selalu berubah. File handoff serta ringkasan Markdown tetap versionable.

## 2. Kesimpulan singkat

- Desktop sudah sangat kuat: Performance `99`; Accessibility, Best Practices, dan SEO masing-masing `100`.
- Mobile berada di Performance `86`; tiga kategori lainnya tetap `100`.
- Hambatan utama mobile adalah FCP `2.44 s` dan LCP `3.68 s`, bukan layout shift atau blocking time.
- CLS `0` dan TBT `89 ms` menunjukkan stabilitas visual dan respons main thread secara umum sudah baik.
- Elemen LCP adalah gambar hero pertama `hero1-mobile.webp`. Request-nya sudah eager, discoverable dari dokumen awal, dan memakai `fetchpriority="high"`; masalah yang tersisa didominasi waktu render setelah resource tersedia.
- Peluang terbesar yang terukur adalah sekitar `75 KiB` JavaScript tidak terpakai, optimasi kompresi/responsiveness gambar hero, dan satu stylesheet render-blocking berukuran sekitar `16 KiB`.
- Jangan mengejar skor desktop `100` dengan perubahan berisiko. Prioritas selanjutnya adalah membuat mobile konsisten mencapai Performance `>= 90` tanpa menurunkan tiga skor `100` lainnya.

## 3. Konfigurasi audit

| Parameter | Mobile | Desktop |
| --- | --- | --- |
| URL | `http://127.0.0.1:4173/` | `http://127.0.0.1:4173/` |
| Lighthouse | 12.8.2 | 12.8.2 |
| Host Chrome | HeadlessChrome 150 | HeadlessChrome 150 |
| Form factor | Mobile | Desktop |
| Viewport | 412 x 823, DPR 1.75 | 1350 x 940, DPR 1 |
| Throttling | Simulated | Simulated |
| RTT | 150 ms | 40 ms |
| Throughput | 1,638.4 Kbps | 10,240 Kbps |
| CPU slowdown | 4x | 1x |
| Storage reset | Aktif; cache browser terpilih dibersihkan | Aktif; cache browser terpilih dibersihkan |

Perintah reproduksi:

```bash
npm run lighthouse
```

Runner akan melakukan production build, menjalankan preview server lokal, lalu memperbarui report mobile dan desktop.

## 4. Skor kategori

| Mode | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | 86 | 100 | 100 | 100 |
| Desktop | 99 | 100 | 100 | 100 |

Catatan cakupan:

- Accessibility memiliki 19 audit otomatis yang applicable dan semuanya lulus. Masih ada 10 pemeriksaan manual Lighthouse yang perlu validasi manusia.
- SEO memiliki 9 audit otomatis yang lulus dan 1 pemeriksaan manual.
- Kategori PWA tidak dijalankan.
- Skor ini adalah lab data lokal, bukan Chrome UX Report atau data pengguna nyata.

## 5. Metrik utama

| Metrik | Mobile | Desktop | Interpretasi |
| --- | ---: | ---: | --- |
| First Contentful Paint | 2,444 ms | 541 ms | Mobile masih lambat; desktop sangat baik |
| Largest Contentful Paint | 3,681 ms | 775 ms | Fokus utama mobile; desktop sangat baik |
| Speed Index | 2,444 ms | 589 ms | Baik |
| Total Blocking Time | 89 ms | 6 ms | Baik, di bawah target 200 ms |
| Cumulative Layout Shift | 0 | 0 | Sangat baik |
| Time to Interactive | 3,913 ms | 781 ms | Mobile masih dapat dipercepat |
| Max Potential FID | 221 ms | 62 ms | Mobile masih dapat dipercepat |
| Root document response | 2.9 ms | 2.2 ms | Server lokal bukan bottleneck |
| Total byte weight | 419,577 B (~410 KiB) | 566,763 B (~553 KiB) | Desktop lebih besar karena memakai hero desktop |
| DOM size | 355 elemen | 355 elemen | Aman |

## 6. Analisis LCP

Elemen LCP pada kedua mode adalah gambar slide hero pertama dengan alt `UPNVJ Campus 1`.

### Mobile

- Resource: `hero1-mobile.webp`, transfer sekitar `32.2 KiB`.
- Elemen tampil pada area 412 x 757.
- Legacy LCP element audit membagi `3,680 ms` menjadi:
  - TTFB: `453 ms` atau 12%.
  - Load delay: `0 ms`.
  - Load time: `0 ms`.
  - Render delay: `3,228 ms` atau 88%.
- LCP discovery insight lulus seluruh checklist:
  - `fetchpriority=high` sudah dipakai.
  - Request dapat ditemukan dari dokumen awal.
  - Gambar tidak memakai lazy loading.

### Desktop

- Resource: `hero1.webp`, transfer sekitar `65.4 KiB`.
- Elemen tampil pada area sekitar 1342 x 865.
- Legacy LCP element audit membagi `775 ms` menjadi:
  - TTFB: `124 ms` atau 16%.
  - Render delay: `650 ms` atau 84%.

### Catatan interpretasi penting

Audit insight berbasis trace menampilkan breakdown yang lebih kecil daripada angka LCP tersimulasi. Contohnya pada mobile, insight mencatat TTFB `5 ms`, resource delay `7 ms`, load duration `11 ms`, dan element render delay `455 ms`. Jangan menjumlahkan angka insight itu untuk menggantikan LCP tersimulasi `3.68 s`; keduanya berasal dari model/representasi audit yang berbeda. Gunakan angka kategori/metrik tersimulasi untuk target skor, lalu gunakan trace insight untuk mencari penyebab teknis.

Hipotesis kerja berikutnya: resource gambar sudah cepat ditemukan dan cukup kecil, sehingga penyelidikan harus berfokus pada kapan browser diizinkan mengecat slide pertama. Periksa initial opacity/transform/transition, pekerjaan React sebelum paint, style/layout, serta provider/data initialization yang berjalan pada startup.

## 7. Main-thread dan JavaScript

### Mobile main-thread work: sekitar 2.3 s

| Kelompok | Durasi |
| --- | ---: |
| Script evaluation | 714 ms |
| Other | 698 ms |
| Style and layout | 440 ms |
| Rendering | 397 ms |
| Garbage collection | 20 ms |
| Parse HTML and CSS | 10 ms |
| Script parse/compile | 4 ms |

Long task yang dilaporkan:

- `assets/index-FPM8rd42.js`: `221 ms` pada sekitar 3.95 s.
- Root document/unattributed page work: `92 ms` pada sekitar 0.65 s.
- `assets/index-FPM8rd42.js`: `57 ms` pada sekitar 4.17 s.

Desktop hanya memiliki satu long task `62 ms` dari main bundle.

### Unused JavaScript

| Bundle | Transfer | Estimasi tidak terpakai | Persentase |
| --- | ---: | ---: | ---: |
| `assets/index-FPM8rd42.js` | 128,800 B | 40,289-40,366 B | ~31.3% |
| `assets/vendor-supabase-By9dx53u.js` | 45,539 B | 36,405 B | ~79.9% |
| Total peluang | - | 76,694-76,771 B (~75 KiB) | - |

Estimasi dampak Lighthouse: sekitar `450 ms` pada mobile dan `80 ms` pada desktop untuk FCP/LCP.

Implikasi:

- Code splitting sudah ada, tetapi main bundle masih memuat sekitar 40 KiB kode yang tidak dibutuhkan untuk initial viewport.
- Supabase vendor chunk hampir 80% tidak digunakan saat initial load. Telusuri apakah pembuatan client, auth, atau fetch dashboard dapat ditunda sampai section data mendekati viewport.
- Jangan memindahkan seluruh Supabase ke bundle utama. Pertahankan atau tingkatkan lazy boundary.

## 8. Gambar

### Mobile image delivery: estimasi penghematan 74,970 B (~73 KiB)

| Resource | Ukuran | Estimasi hemat | Temuan |
| --- | ---: | ---: | --- |
| `hero3.webp` | 51,146 B | 37,503 B | Kompresi dapat dinaikkan; belum ada varian mobile |
| `hero2-mobile.webp` | 50,804 B | 28,569 B | Kompresi dapat dinaikkan |
| `hero1-mobile.webp` | 32,666 B | 8,898 B | Kompresi tambahan memungkinkan |

Responsive image audit mobile sudah lulus.

### Desktop image delivery: estimasi penghematan 61,039 B (~60 KiB)

| Resource | Ukuran | Estimasi hemat | Temuan |
| --- | ---: | ---: | --- |
| `hero2.webp` | 164,788 B | 48,848 B | Sumber 1600 x 1031 lebih besar dari ukuran tampil sekitar 1342 x 865 |
| `hero3.webp` | 51,146 B | 12,191 B | Kompresi dapat dinaikkan |

Audit `Properly size images` secara khusus memperkirakan `48,826 B` dapat dihemat pada `hero2.webp`.

Urutan aman untuk iterasi gambar:

1. Buat varian mobile untuk `hero3.webp`.
2. Buat varian desktop hero kedua yang lebih dekat ke lebar render aktual atau tambahkan kandidat `srcset` yang tepat.
3. Uji AVIF/WebP dengan kualitas lebih rendah sambil membandingkan artefak visual.
4. Pertahankan dimensi eksplisit, `sizes="100vw"`, eager loading hanya untuk slide pertama, dan lazy loading untuk slide berikutnya.

## 9. CSS dan render blocking

- Resource: `assets/index-BK6I1S4O.css`.
- Transfer: `16,557 B` (~16.2 KiB).
- Durasi tercatat: `454 ms` mobile dan `84 ms` desktop.
- Render-blocking insight memperkirakan potensi `150 ms` mobile dan `40 ms` desktop.
- Audit opportunity lama menampilkan estimasi penghematan total `0 ms`, jadi perlakukan ini sebagai optimasi sekunder setelah render delay dan JavaScript.

Jangan langsung memasukkan seluruh stylesheet secara inline. Jika menguji critical CSS, ukur ulang ukuran HTML, cacheability, dan hasil tiga run agar tidak hanya memindahkan biaya.

## 10. Network dan page weight

Resource summary Lighthouse:

| Jenis | Mobile | Desktop |
| --- | ---: | ---: |
| Script | 6 request / 208,093 B | 6 request / 208,093 B |
| Image | 4 request / 140,778 B | 4 request / 288,726 B |
| Other | 14 request / 37,011 B | 14 request / 36,249 B |
| Stylesheet | 1 request / 16,557 B | 1 request / 16,557 B |
| Document | 1 request / 1,755 B | 1 request / 1,755 B |

Request terbesar mobile:

1. Main JS: `126.2 KiB`.
2. `hero3.webp`: `50.2 KiB`.
3. `hero2-mobile.webp`: `49.9 KiB`.
4. Supabase vendor JS: `44.8 KiB`.
5. `hero1-mobile.webp`: `32.2 KiB`.

Request terbesar desktop:

1. `hero2.webp`: `161.2 KiB`.
2. Main JS: `126.2 KiB`.
3. `hero1.webp`: `65.4 KiB`.
4. `hero3.webp`: `50.2 KiB`.
5. Supabase vendor JS: `44.8 KiB`.

Third-party summary hanya menunjukkan Supabase, sekitar `36 KiB` transfer dan `0 ms` main-thread time. Network trace menampilkan URL query `fasilitas` dua kali dengan ukuran sekitar `14.9 KiB` per request. Verifikasi apakah ini duplicate fetch yang dapat dieliminasi atau memang dua konsumen yang sengaja meminta data sama; jangan mengubah caching/data flow tanpa menelusuri `DashboardContext` dan service API terlebih dahulu.

## 11. Hal yang sudah dioptimalkan

Jangan membatalkan perubahan berikut tanpa bukti regresi:

- `hero1-mobile.webp` dan `hero2-mobile.webp` sudah digunakan melalui `srcset`.
- Slide hero pertama menggunakan eager loading, high fetch priority, dan synchronous decoding; slide lain lazy/async.
- Section di bawah fold sudah memakai `React.lazy`, `Suspense`, dan `DeferredSection` berbasis `IntersectionObserver`.
- Campus map/Unity ditunda agar `unityKeyboardPatch` tidak memodifikasi event browser saat initial load.
- Dimensi gambar eksplisit mencegah layout shift; hasil CLS sekarang `0`.
- Metadata, `robots.txt`, label aksesibilitas, dan struktur tombol/link sudah menghasilkan skor Accessibility, Best Practices, dan SEO `100`.
- Runner `scripts/run-lighthouse.js` sudah menangani build, preview, audit dua mode, cleanup, dan pembuatan summary.

File awal yang relevan untuk dibaca:

- `src/components/dashboard/Dashboard.tsx`
- `src/components/common/DeferredSection.tsx`
- `src/contexts/DashboardContext.tsx`
- `src/services/api/supabaseDataService.ts`
- `src/index.css`
- `vite.config.ts`
- `scripts/run-lighthouse.js`

Untuk arsitektur proyek dan kontrak Unity/Supabase yang lebih luas, baca `docs/AI_HANDOFF.md`. Snapshot commit di bagian awal dokumen umum tersebut lebih lama; untuk status Lighthouse gunakan dokumen ini.

## 12. Prioritas pekerjaan berikutnya

### P1 - Mobile LCP dan startup render

1. Rekam Performance trace pada mobile emulation dan tandai kapan hero pertama menjadi paintable.
2. Pastikan slide pertama tidak menunggu transisi opacity/transform atau state update setelah mount.
3. Cari provider, analytics, data fetch, dan synchronous effect yang berjalan sebelum first paint; tunda yang tidak dibutuhkan hero.
4. Ukur setiap perubahan minimal tiga kali dan gunakan median karena skor Lighthouse bervariasi antar-run.

### P1 - Kurangi startup JavaScript

1. Gunakan treemap/source map untuk memecah 40 KiB kode tidak terpakai dari main bundle.
2. Tunda Supabase/auth/data code yang tidak dibutuhkan initial viewport.
3. Pastikan lazy sections tidak diprefetch terlalu dini.
4. Periksa duplicate query `fasilitas` dan konsolidasikan hanya jika memang redundan.

### P2 - Optimasi hero images

1. Tambahkan `hero3-mobile`.
2. Tambahkan kandidat ukuran menengah untuk `hero2.webp` desktop.
3. Uji kompresi lebih agresif atau AVIF dengan visual QA.

### P3 - Critical CSS

Eksperimen hanya setelah P1/P2. Potensi tercatat lebih kecil dan hasil audit lama tidak menunjukkan penghematan langsung.

## 13. Guardrail dan acceptance criteria

Target iterasi berikutnya:

- Median dari tiga run mobile Performance `>= 90`.
- Mobile LCP `<= 2.5 s`.
- Mobile FCP `<= 1.8 s`.
- TBT tetap `<= 200 ms`.
- CLS tetap `<= 0.1`, idealnya `0`.
- Accessibility, Best Practices, dan SEO tetap `100`.
- Desktop tidak turun secara material dari `99`.
- Interaksi dashboard, carousel, deferred sections, map 2D, dan Unity 3D tetap berfungsi.

Setelah perubahan:

```bash
npm run lint
npm test
npm run build
npm run lighthouse
```

Lighthouse tidak memvalidasi interaksi Unity/WebGL karena section itu berada di bawah fold dan ditunda. Lakukan smoke test manual terpisah untuk pemilih 2D/3D, loading Unity, input pointer/keyboard, search tujuan, dan navigasi.

## 14. Prompt siap pakai untuk AI penerus

```text
Lanjutkan optimasi Lighthouse untuk dashboard-profile-upnvj. Baca
reports/lighthouse/AI_HANDOFF_LATEST.md dan docs/AI_HANDOFF.md terlebih dahulu.
Baseline terbaru adalah mobile 86/100/100/100 dan desktop 99/100/100/100.
Prioritaskan mobile LCP 3.68 s, FCP 2.44 s, render delay hero, serta sekitar
75 KiB unused JavaScript. Pertahankan CLS 0, TBT 89 ms, tiga skor kategori 100,
lazy/deferred loading section, dan jangan memuat Unity pada initial viewport.
Ukur perubahan minimal tiga kali, laporkan median, lalu jalankan lint, test,
build, dan Lighthouse. Jangan mengubah kontrak Unity/Supabase tanpa membaca
handoff arsitektur dan menelusuri konsumen datanya.
```
