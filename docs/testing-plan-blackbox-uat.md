# Rencana Pengujian (Black Box & UAT)
## Integrasi Denah Virtual UPNVJ Kampus Pondok Labu (Dashboard Profil)

Dokumen ini berisi skenario pengujian fungsional (Black Box) dan panduan User Acceptance Testing (UAT) untuk disalin ke dokumen Laporan Tugas Akhir (.docx).

---

## 1. Pengujian Black Box (Validasi Fungsional Utama)
**Fokus**: Memastikan fungsi CRUD, mapping kategori fasilitas, dan integrasi API berjalan tanpa error secara sistem.

### A. Skenario Admin Panel
| ID | Skenario | Langkah Pengujian | Ekspektasi Hasil | Status |
|---|---|---|---|---|
| BB-01 | Validasi Dropdown Tipe Fasilitas | Buka form edit/tambah fasilitas. Cek opsi dropdown tipe. | Dropdown menampilkan tepat 9 opsi (Laboratorium, Ruang Kuliah, Administrasi & Layanan, Lainnya, Ruang Kegiatan Mahasiswa, Auditorium & Aula, Perpustakaan & Ruang Baca, Fasilitas Ibadah, Fasilitas Olahraga). | [ ] |
| BB-02 | Integrasi Update Data | Ubah fasilitas dengan tipe lama ke salah satu dari 9 tipe baru, lalu simpan. | Data tersimpan di database tanpa *override* kosong/blank. | [ ] |

### B. Skenario Public Dashboard
| ID | Skenario | Langkah Pengujian | Ekspektasi Hasil | Status |
|---|---|---|---|---|
| BB-03 | Hitungan Card Kategori | Cek angka total pada Card "Laboratorium" dan "Ruang Kuliah". | Angka sesuai dengan agregat di database (Lab termasuk Studio; Ruang Kuliah termasuk Ujian & Diskusi). | [ ] |
| BB-04 | Filter Modal Kategori | Klik card "Administrasi & Layanan". | Modal menampilkan daftar ruang dosen, ruang rapat, fasilitas umum, dan ruang kegiatan mahasiswa tanpa ada ruangan *orphan* yang hilang. | [ ] |
| BB-05 | Search Bar & Render Ikon | Ketik "BEM" atau "Senat" di search bar. | Muncul dropdown hasil pencarian dengan rendering ikon yang sesuai (misal: ikon "groups" untuk Ruang Kegiatan Mahasiswa). | [ ] |

### C. Skenario Integrasi Unity (API)
| ID | Skenario | Langkah Pengujian | Ekspektasi Hasil | Status |
|---|---|---|---|---|
| BB-06 | Endpoint Data Denah | Akses endpoint `/api/unity/data`. | Response JSON berhasil di-fetch dan memiliki atribut `unity_object_name` yang sinkron (misal: `ds_201`, `ds_ukm_1`). | [ ] |
| BB-07 | Navigasi via Pencarian (React→Unity) | Ketik lalu pilih sebuah ruangan (misal: Lab) di search bar React, kemudian amati denah 3D. | Unity menerima `unity_object_name` via `SendMessage`, lalu **player dipandu ke ruangan dengan jalur terpendek (NavMesh shortest path)**; garis rute tergambar di lantai 3D, label menampilkan **nama tampilan** (bukan kode internal) + jarak tersisa. Komunikasi satu arah React→Unity. | [ ] |
| BB-08 | Navigasi Berhenti Otomatis | Ikuti/gerakkan player mendekati ruangan tujuan hingga di bawah `stopDistance`. | Navigasi berhenti otomatis; garis rute & label dibersihkan tanpa perlu aksi manual. | [ ] |

> **Catatan arsitektur:** Objek 3D di WebGL **tidak bisa diklik** untuk memunculkan info (tidak ada callback Unity→React — *out of scope* di PRD). Informasi detail gedung/ruangan ditampilkan di sisi **dashboard publik / hasil pencarian React**, bukan di dalam kanvas Unity.

---

## 2. User Acceptance Testing (UAT)
**Fokus**: Memastikan sistem teruji dan disetujui oleh End-User serta validator akademik. 
*Note: Format di bawah dipindahkan ke tabel Microsoft Word (.docx) untuk lembar persetujuan/kuesioner fisik.*

### Daftar Partisipan UAT
1. **Dosen Penguji**: Dr. Widya Cholil, Kharisma Wiati Gusti
2. **Dosen Pembimbing**: Dr. Ridwan Raafi'udin, Novi Trisman Hadi
3. **Representatif End-User**: Humas UPNVJ
4. **Representatif Administrator**: Admin Prodi

### Form Evaluasi UAT (Draft Kuesioner)
*Skala Penilaian: 1 (Sangat Kurang) - 5 (Sangat Baik)*

**A. Aspek Administrator (Admin Prodi & Humas)**
1. Apakah antarmuka panel admin mudah dipahami untuk melakukan manajemen data gedung dan ruangan? (1-5)
2. Apakah klasifikasi kategori ruangan pada dashboard publik sudah merepresentasikan tata ruang nyata kampus secara akurat? (1-5)

**B. Aspek Integrasi Denah Virtual (Penguji & Pembimbing)**
3. Apakah pencarian ruangan dari dashboard berhasil memandu navigasi denah 3D (jalur terpendek/*shortest path*) ke lokasi gedung/ruangan yang benar? (1-5)
4. Apakah informasi detail gedung/ruangan yang ditampilkan di dashboard publik (hasil pencarian) sesuai dengan data yang diinput via panel admin? (1-5)

**C. Aspek UX Keseluruhan (General)**
5. Secara keseluruhan, apakah aplikasi ini memudahkan navigasi informasi fasilitas dan ruang fisik bagi civitas akademika UPNVJ? (1-5)
