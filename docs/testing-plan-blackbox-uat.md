:Testing 
>**Poyk:**PatformWeb — Kapus& Navgas3D WeGL
> **Vdoum:** 1.0 — 7 Juli 2026
> **Bss:**`PRD.md v2.0` (sdhdiveriksiterhdapke ktual)
>**Ckp:**FontendRtSPA + SrverlesPI+ DeahVrtu UityWbGL+ AiPel0CraMembaDkumenIn (nKeparunny Begini
Ada dafepeujdi doumnn**uutnnyasnga: BckBxdulu, buUAT**-**Blck BxTestg**= kmu(timtks/QA)misem drsi uarnp mehtk,memka teknk ertrukturntuurubug ungonl
-**UAT(UAcctceTsing)**=engguna/tkehldes(akmpusmhasswdose)mcob temnkmmus"pkhnlykdpki"
**KeBlckBoxruulu?** UATiuh —wkstakeholeratsdnekal erekkeuug l(tmorr, mapgagal),eprcayaa merek ke pduklsu turn d UATjddkpoukf.BlcBxefsisebi**r**:ksihkn duldefec fngsnalybsdistemats,supayasaatUATsakhlfousel*kecocokgn ebutuhny*,bkjai tetrbg.

Sinya: **Blck Boxenjb"khsistembekejsesuispesifksi?"—UATmnjawb"apakhsistemmylsaanmaslhpnggu?**Kduanyertay,makaykduaya butuhka.

---

##⚠️ BlckerWjbDperbiSEBELUMTesiDmula vifikR,ditmukn bug ktisyangka mengagalnpfiturunggulan (Dnh3D):

| ID | MaahDmpak | Aki------------LK1`CamusMpViwr.tx`&Preloder.smunjukkol-uilds/v0.2.2/**tdaa**uildldd`v0.2.16/`. DnVirtl3D **glod (404**—luulunvgsikbisa ditesGaispthv0.2.2→`v0.2.16`sbmskuiiMp/Nvgs.|

>Jgulibg MulC (Dh 3D**dibwhpLK1b.Modl li(Dshboad,Adi, Srch UI) bsajldl.

---

## 1.EtryCr(SyaBoMuliTtg)Peganmuasebelmsierpenuh. Alsnny:muisg ikygbelumtimengkan "buglsu" ygmmgwaktun enutupi bugl[]BLK-01(vromitch) udhdpbaikbuil kss(`pmunbui`)-[]Lgungsgingaktenganaased erntaif (bk DB og)
- [ ] Krednal aundmin testeeda (Suabseuth)- [ ]EndpitAI(`/ap/helt``/p/unty/da`)mgalk`200`
-[]DfrutoryD(A1–2, B, C) dijaka checklacua
---

## 2. BLACK BOX TEST PLAN

### 2.1 Teknik yang Dipakai (dan Kenapa)

Kita tidak menguji "asal klik". Input yang mungkin itu tak terhingga, jadi kita pakai teknik yang mempersempit ke kasus paling mungkin gagal:

| Teknik | Apa itu | Kenapa dipakai di sini |
|--------|---------|------------------------|
| **Equivalence Partitioning** | Kelompokkan input jadi kelas yang diperlakukan sama; tes 1 wakil per kelas | Cukup tes 1 nama gedung valid + 1 invalid, bukan ratusan nama. Hemat waktu tanpa kehilangan coverage. |
| **Boundary Value Analysis** | Uji nilai di tepi (min, max, tepat di batas, tepat di luar) | Bug paling sering ngumpul di batas: `jumlah_lantai = 0`, query kosong, string sangat panjang, `stopDistance` tepat di ambang. |
| **Negative / Error-path Testing** | Sengaja kasih input salah / kondisi gagal | Sistem harus gagal dengan anggun (pesan jelas), bukan crash/layar putih. PRD menekankan fallback & error handling. |
| **State Transition** | Uji perpindahan status | Contoh: idle → loading → loaded → error pada Map; belum login → login → logout pada Admin. |
| **Cross-environment** | Uji di device/browser berbeda | Mobile adalah *hard requirement* di PRD; WebGL & Pointer Lock perilakunya beda per browser. |

### 2.2 Klasifikasi Severity Defect

Supaya laporan bug konsisten dan bisa diprioritaskan:

- **S1 Critical** — fitur inti mati / data corrupt / celah keamanan (mis. anon bisa menulis DB). Blokir rilis.
- **S2 Major** — fitur penting salah tapi ada workaround (mis. label navigasi salah nama).
- **S3 Minor** — kosmetik / UX kecil (mis. animasi toggle patah).
- **S4 Trivial** — typo, spacing.

### 2.3 Test Suite

Notasi: **TC-<modul>-<no>**. Setiap kasus punya *Expected Result* yang bisa dijawab lulus/gagal — kalau ekspektasi tidak jelas, itu bukan test case yang baik.

#### Modul A — Dashboard Publik (Info Akademik)

| ID | Skenario | Langkah | Expected Result | Ref PRD |
|----|----------|---------|-----------------|---------|
| TC-A-01 | Statistik traffic tampil | Buka `/` | KPI/grafik traffic muncul dengan data (bukan `NaN`/kosong) | A1-1 |
| TC-A-02 | KPI aset kampus | Lihat kartu indikator gedung & fasilitas | Angka sesuai jumlah data di DB | A1-2 |
| TC-A-03 | Tabel prodi & akreditasi | Scroll ke daftar prodi | Prodi tampil dengan jenjang + status akreditasi | A1-2 |
| TC-A-04 | Toggle bahasa ID→EN | Klik toggle bahasa | Seluruh teks berganti tanpa reload halaman | A1-3 |
| TC-A-05 | Persistensi bahasa | Ganti ke EN, refresh halaman | Bahasa tetap EN (localStorage) | A1-4 |
| TC-A-06 | Fallback bahasa | Set key terjemahan yang hilang (dev) | Tampilkan fallback, bukan raw key/blank | 6.3 |
| TC-A-07 | Responsif mobile | Buka di viewport <768px | Layout tidak overflow, terbaca | Responsive |

#### Modul B — Pencarian (React Search)

| ID | Skenario | Langkah | Expected Result | Ref PRD |
|----|----------|---------|-----------------|---------|
| TC-B-01 | Cari gedung valid | Ketik "Rektorat" | Hasil muncul dengan ikon `Building2` | A2-16 |
| TC-B-02 | Cari fasilitas | Ketik nama ruang kelas | Hasil muncul ikon `LayoutGrid` + sub-label gedung induk | A2-6 |
| TC-B-03 | List campuran | Ketik kata yang cocok keduanya | Gedung & fasilitas satu list, dibedakan ikon | A2-6 |
| TC-B-04 | Query kosong (boundary) | Kosongkan input | Tidak error; tidak menembak Unity | BVA |
| TC-B-05 | Query tak ditemukan | Ketik "zzzz999" | Empty state jelas, bukan crash | Negative |
| TC-B-06 | Sanitasi XSS/RegExp | Ketik `<script>` / `.*[(` | Input tersanitasi, tak ada eksekusi/error regex | Keamanan |

#### Modul C — Denah Virtual 3D & Navigasi *(jalankan setelah BLK-01 beres)*

> **Cara kerja yang diuji:** WebGL memuat player first-person yang bisa jalan keliling kampus. Pencarian ruangan ada di **React**; saat user memilih hasil, React mengirim `unity_object_name` ke Unity via `SendMessage` (satu arah React→Unity). Unity menghitung **jalur terpendek (NavMesh shortest path)** dari posisi player ke tujuan, menggambar garis rute + label di denah 3D. **Objek 3D tidak bisa diklik**; info detail gedung/ruangan ditampilkan di dashboard React, bukan di dalam kanvas Unity.

| ID | Skenario | Langkah | Expected Result | Ref PRD |
|----|----------|---------|-----------------|---------|
| TC-C-01 | Map load | Buka bagian Denah 3D | Aset v0.2.16 ter-load, canvas tampil | A2-5 |
| TC-C-02 | Loading overlay | Amati saat loading | Progress bar 0→100% + pesan, transisi opacity halus | A2-18 |
| TC-C-03 | Waktu muat | Ukur load pada koneksi normal | Halaman utama interaktif < 10 detik | A2-17 |
| TC-C-04 | Click-to-start pointer lock | Klik canvas | Kursor terkunci, kamera bisa 360° tanpa mentok | A2-13 |
| TC-C-05 | Lepas kursor | Tekan ESC | Kursor lepas, UI web bisa dipakai lagi | A2-14 |
| TC-C-06 | Navigasi via pencarian | Pilih lokasi dari search React | Unity terima `unity_object_name`; player dipandu jalur terpendek dari posisi saat ini | A2-6, A2-7 |
| TC-C-07 | Garis rute | Amati lantai 3D | Garis rute halus mengikuti kontur & tangga antar lantai | A2-8, A2-9 |
| TC-C-08 | Label nama tampilan | Lihat label jarak | Muncul **nama tampilan** (mis. "Ruang MHT 201"), bukan kode `mht_201` | A2-10 |
| TC-C-09 | Info jarak | Selama navigasi | Jarak tersisa ter-update | A2-11 |
| TC-C-10 | Auto-stop | Dekati target < `stopDistance` | Navigasi berhenti otomatis | A2-12 |
| TC-C-11 | Target tak ada (negative) | Kirim `unity_object_name` tak dikenal | Fallback + warning log, **tidak** throw/crash | 2.2 |
| TC-C-12 | Fullscreen | Klik fullscreen & minimize | Masuk/keluar fullscreen benar (termasuk mobile landscape) | UI |
| TC-C-13 | WebGL tak didukung | Buka di browser tanpa WebGL | Tampilkan pesan fallback + tips, bukan layar putih | Negative |
| TC-C-14 | Joystick mobile | Buka di perangkat sentuh | Joystick virtual muncul (verifikasi: masih tampil di desktop? = bug 🟡) | A2-15 |
| TC-C-15 | Preload mobile-aware | Buka di mobile / Save-Data | Preload di-skip (cek log), tidak boros kuota | Perf |

#### Modul D — Admin Panel

| ID | Skenario | Langkah | Expected Result | Ref PRD |
|----|----------|---------|-----------------|---------|
| TC-D-01 | Login valid | Login akun admin benar | Masuk `/admin`, sesi aktif | B-19 |
| TC-D-02 | Login invalid | Password salah | Ditolak dengan pesan jelas, tetap di login | Negative |
| TC-D-03 | Proteksi route | Akses `/admin` tanpa login | Redirect ke login | B-19 |
| TC-D-04 | CRUD gedung | Tambah/edit/hapus gedung | Perubahan tersimpan & tampil; `unity_object_name` tersimpan | B-20, B-24 |
| TC-D-05 | Nama vs unity_object_name | Isi `nama_gedung` ≠ `unity_object_name` | Keduanya disimpan terpisah | B-25 |
| TC-D-06 | CRUD fasilitas | Kelola fasilitas + kaitkan gedung & lantai | Relasi & lantai tersimpan | B-21 |
| TC-D-07 | CRUD prodi | Kelola prodi (nama, jenjang, akreditasi) | Data akademis ter-update | B-22 |
| TC-D-08 | Boundary jumlah_lantai | Isi `0`, negatif, sangat besar | Validasi menolak nilai tak wajar | BVA |
| TC-D-09 | Modal konfirmasi hapus | Klik hapus data | Muncul modal konfirmasi + focus trap; batal = tak terhapus | B-26 |
| TC-D-10 | Audit logs | Lakukan mutasi, buka audit logs | Tercatat: aktor, waktu, tabel, aksi | B-27 |
| TC-D-11 | Analytics Umami | Buka dashboard analytics | Statistik traffic tampil | B-28 |

#### Modul E — Keamanan & API (Cross-cutting)

| ID | Skenario | Langkah | Expected Result | Ref PRD |
|----|----------|---------|-----------------|---------|
| TC-E-01 | RLS anon read-only | Coba `INSERT` sebagai anon | Ditolak RLS (hanya `SELECT`) | Keamanan |
| TC-E-02 | Rate limiting | Spam request ke endpoint sensitif | Dibatasi/throttled | Keamanan |
| TC-E-03 | Mass assignment | Kirim field di luar whitelist saat update | Field ekstra diabaikan | Keamanan |
| TC-E-04 | Health check | `GET /api/health` | `{ "status": "ok" }` | API |
| TC-E-05 | API fallback error | Matikan sumber data, panggil `/api/unity/data` | Error 500 tertangani, bukan hang | 2.1 |

### 2.4 Exit Criteria Black Box (Syarat Boleh Lanjut ke UAT)

Kenapa perlu gate: mencegah produk setengah matang masuk ke tangan stakeholder.

- [ ] 100% test case S1/S2 area sudah dieksekusi
- [ ] **0 defect S1 (Critical) terbuka**
- [ ] **0 defect S2 (Major) terbuka** pada alur inti (Map load, Navigasi, Login, CRUD)
- [ ] Defect S3/S4 terdokumentasi dengan rencana (boleh ditunda)
- [ ] Semua user story PRD punya minimal 1 test case yang lulus
---

## 3. UAT PLAN (User Acceptance Testing)

### 3.1 Tujuan & Prinsip (Kenapa UAT Beda dari Black Box)

Black Box bertanya *"apakah tombol X bekerja?"*. UAT bertanya *"apakah mahasiswa baru benar-benar bisa menemukan ruang kelasnya, dan admin bisa mengurus data tanpa pusing?"*

Karena itu **UAT tidak ditulis sebagai test case teknis**, tapi sebagai **skenario tugas dunia nyata** yang dijalankan oleh **pengguna asli**, bukan QA. Fokusnya: kecocokan dengan kebutuhan (fitness for purpose), bukan konformansi spesifikasi. Peran QA di sini hanya memfasilitasi & mencatat, bukan memandu jawaban.

### 3.2 Peran Peserta (dan Alasannya)

Peserta UAT harus mewakili pengguna nyata PRD, karena merekalah yang berhak memutuskan "layak dipakai":

| Peran | Mewakili | Alasan wajib ada |
|-------|----------|------------------|
| Mahasiswa baru / calon mahasiswa | Pengguna publik navigasi | Mereka target utama fitur Denah 3D & pencarian |
| Tamu / non-teknis | Pengunjung umum | Uji apakah UI intuitif tanpa pelatihan |
| Admin kampus | Pengelola data | Satu-satunya yang bisa menilai apakah CRUD & audit cukup untuk kerja harian |
| Pengguna mobile | Device utama mahasiswa (PRD: *hard requirement*) | Validasi joystick & performa di HP asli |

### 3.3 Skenario UAT

Setiap skenario diberi tugas berbasis tujuan (goal-based), lalu peserta menilai. **Kriteria lulus = peserta menyelesaikan tugas tanpa bantuan dan menyatakan puas.**

#### UAT-01 — Mahasiswa Baru Mencari Ruang Kelas
> "Anda mahasiswa baru. Besok ada kelas di Ruang MHT 201. Temukan di mana lokasinya dan bagaimana rutenya."
- **Sukses bila:** peserta menemukan lokasi via pencarian, memulai navigasi, mengikuti garis rute ke tujuan, dan label menampilkan nama yang benar (bukan kode).
- **Menguji:** A2-6, A2-7, A2-8, A2-10.

#### UAT-02 — Tamu Menemukan Gedung Utama
> "Anda tamu kampus. Temukan Gedung Rektorat dan arahkan diri Anda ke sana di denah 3D."
- **Sukses bila:** peserta menemukan gedung hanya dengan mengetik nama, navigasi memandu sampai berhenti otomatis.
- **Menguji:** A2-16, A2-12.

#### UAT-03 — Navigasi Lintas Lantai/Gedung
> "Cari fasilitas di lantai berbeda dari posisi awal Anda dan ikuti rutenya."
- **Sukses bila:** garis rute menyesuaikan tangga antar lantai dan peserta tidak tersesat.
- **Menguji:** A2-9.

#### UAT-04 — Pengguna Mobile
> "Gunakan HP Anda: jelajahi kampus dan navigasi ke satu lokasi."
- **Sukses bila:** joystick virtual muncul & responsif di HP, halaman termuat wajar, tidak boros kuota berlebihan.
- **Menguji:** A2-15, A2-17.

#### UAT-05 — Ganti Bahasa
> "Ubah tampilan ke Bahasa Inggris, lalu tutup dan buka lagi halaman."
- **Sukses bila:** semua teks berganti mulus dan preferensi tetap tersimpan setelah dibuka ulang.
- **Menguji:** A1-3, A1-4.

#### UAT-06 — Admin Menambah Gedung Baru
> "Ada gedung baru di kampus. Tambahkan datanya (nama, deskripsi, lokasi, jumlah lantai, `unity_object_name`) lewat panel admin."
- **Sukses bila:** admin berhasil menambah tanpa bantuan teknis, data muncul di dashboard publik.
- **Menguji:** B-20, B-23, B-24.

#### UAT-07 — Admin Mengelola Fasilitas & Prodi
> "Perbarui akreditasi satu prodi dan tambahkan satu fasilitas ke sebuah gedung."
- **Sukses bila:** perubahan tersimpan dan tampil benar di sisi publik.
- **Menguji:** B-21, B-22.

#### UAT-08 — Admin Menghapus Data dengan Aman
> "Hapus satu data fasilitas percobaan."
- **Sukses bila:** muncul konfirmasi sebelum hapus; admin merasa terlindungi dari kesalahan; aksi tercatat di audit logs.
- **Menguji:** B-26, B-27.

#### UAT-09 — Admin Memantau Traffic
> "Lihat halaman mana yang paling banyak dikunjungi minggu ini."
- **Sukses bila:** admin bisa membaca statistik Umami tanpa bingung.
- **Menguji:** B-28.

### 3.4 Formulir Penilaian Peserta

Untuk tiap skenario, peserta mengisi:

| Kolom | Isi |
|-------|-----|
| Skenario | UAT-xx |
| Tugas selesai? | Ya / Tidak / Dengan bantuan |
| Tingkat kesulitan | 1 (mudah) – 5 (sulit) |
| Puas dengan hasil? | Ya / Tidak |
| Komentar / kendala | Teks bebas |

> Kenapa ada kolom "dengan bantuan": kalau peserta hanya bisa selesai setelah dibantu, secara UAT itu **belum lulus** — artinya UI belum cukup intuitif.

### 3.5 Exit / Sign-off Criteria UAT

Kenapa perlu sign-off formal: menandai keputusan bisnis "produk diterima", memberi akuntabilitas, dan jadi dasar go-live.

- [ ] Semua skenario UAT-01…09 dijalankan oleh peserta yang mewakili tiap peran
- [ ] ≥ 90% skenario "Tugas selesai = Ya" **tanpa bantuan**
- [ ] Tidak ada kendala kategori "menghalangi tugas inti" yang belum ditangani
- [ ] Rata-rata kepuasan positif; keluhan kritis dijadwalkan perbaikannya
- [ ] Persetujuan tertulis dari perwakilan stakeholder (admin kampus / pemilik produk)

---

## 4. Ringkasan Alur

```
Perbaiki BLK-01 ──► Entry Criteria OK ──► BLACK BOX (Modul A–E)
        │                                       │
        │                            Exit Criteria Black Box
        │                                       │ (0 S1/S2)
        └───────────────────────────────►  U A T (skenario nyata)
                                                │
                                          Sign-off ──► Go-Live
```

**Inti alasannya:** perbaiki blocker → saring bug lewat pengujian terstruktur → baru minta pengguna asli menilai kelayakan. Tiap gerbang mencegah masalah mahal lolos ke tahap berikutnya, saat memperbaikinya jauh lebih sulit dan merusak kepercayaan pengguna.
