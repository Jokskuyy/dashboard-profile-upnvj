# Kamus Istilah (Domain Glossary)

Dokumen ini berisi definisi kanonikal dari istilah-istilah domain yang digunakan dalam proyek **Dashboard Profil UPNVJ & Integrasi Denah Virtual**. Tujuannya adalah untuk memastikan seluruh tim dan dokumentasi menggunakan bahasa yang seragam, tanpa detail implementasi teknis yang spesifik.

## Aktor & Sistem

* **Admin Kampus**: Pengguna dengan hak akses (terautentikasi) untuk mengelola data profil kampus, fasilitas, dosen, dan aset melalui dashboard khusus.
* **Pengguna Publik**: Pengguna anonim (tanpa login) yang mengakses dashboard profil dan denah virtual untuk mencari informasi atau lokasi kampus.
* **Denah Virtual**: Komponen simulasi 3D lingkungan kampus (di-render via Unity WebGL) yang diintegrasikan ke dalam halaman web publik.

## Konsep & Modul Baru

* **Supabase (Self-hosted)**: Platform Backend-as-a-Service yang digunakan sebagai sumber kebenaran data (database) dan manajemen identitas (autentikasi), menggantikan peran backend Node.js/Express tradisional.
* **Umami**: Sistem pelacakan analitik lalu lintas web yang berfokus pada privasi, digunakan untuk menggantikan modul analitik manual.
* **React-to-Unity Navigation (Pathfinding)**: UI pencarian lokasi berada di frontend React. Saat pengguna memilih lokasi, React mengirim pesan (SendMessage) berisi `object_name` ke Unity. Unity kemudian mengaktifkan sistem *pathfinding* untuk memandu pemain ke titik tujuan secara otomatis di dalam lingkungan *First Person*.
* **Multi-language**: Kemampuan sistem dashboard untuk menyajikan antarmuka dalam lebih dari satu bahasa.
