-- =========================================
-- SEEDING DATA UPNVJ PONDOK LABU
-- =========================================
-- Jalankan SETELAH 001_full_setup.sql
-- Aman untuk di-run ulang (akan TRUNCATE dulu)
-- =========================================

-- =========================================
-- CLEAN EXISTING DATA (safe re-run)
-- =========================================
TRUNCATE public.fasilitas, public.program_studi, public.fakultas, public.gedung RESTART IDENTITY CASCADE;

-- =========================================
-- INSERT GEDUNG
-- =========================================

INSERT INTO public.gedung 
(nama_gedung, deskripsi_gedung, lokasi, jumlah_lantai, foto_url)
VALUES
('Gedung Jenderal Sudirman', 'Gedung rektorat dan pusat administrasi universitas', 'Area depan kampus utama Pondok Labu', 4, 'https://lh3.googleusercontent.com/p/AF1QipNfznFUQmK_jNHYGwvy-PhNWFyakaWDwpbpcChk=s1360-w1360-h1020-rw'),

('Gedung DR. Soepomo', 'Gedung perpustakaan pusat dan laboratorium terpadu universitas', 'Zona pelayanan akademik', 4, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHP4bEdhC5nk1gfOqby_zHT9oKCovBX2WsHIwD4Ov64kpGzirWAW8dfAKBGwftct2ENL5HcPPlCAx6anVa_H3dJUP-RwS9J7x9rKjxL6no_xnjpvSK8dXp5w7IZpr6HFVIi04c2=s1360-w1360-h1020-rw'),

('Gedung Dr. Wahidin Sudiro Husodo', 'Gedung utama Fakultas Kedokteran', 'Klaster Fakultas Kedokteran', 4, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAH_kJkMUYypSOPQCcHhMvExYp5AYpdDUaaYuG5qitbtoSPj7j8D8SZI-iKz4fTLRCx3gDxFHjYkbk1hjLX_rInT1ZRI85vAprglf9kUut_2XODKNYm9Hy-5_W6R-dc_Ub4km58m5P1nwGhK=s1360-w1360-h1020-rw'),

('Gedung Dr. Cipto Mangunkusumo', 'Gedung penunjang laboratorium dan skills lab Fakultas Kedokteran', 'Klaster Fakultas Kedokteran', 3, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEuafZGrUzwGKAgdCd2ypupHw0fC0nzc3SrnfBaa-n_sdwlt-tRurr-USbmlMVT-eC1-jSCMwObrVcjVKkPEZsU_mnlrQXlS2slOjtx-w71PNaP-xih06I7q3_c722PJKnLnioD=s1360-w1360-h1020-rw'),

('Gedung Abdul Rahman Saleh', 'Gedung fasilitas pendukung Fakultas Kedokteran dan laboratorium klinis', 'Perbatasan FK dan FISIP', 4, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFN69ll_2oviGvoSVxqOLSXKGitp5YcsG1SwaS98aas0JotI0LcnYEAfpx45ME5h-2dAkd0HeM7EnBRohk848CBtRE0ZnHYrMHnka93pW0URtKOOkbI5F4yht6l-xUfAkwFmeD8=s1360-w1360-h1020-rw'),

('Gedung Ki Hadjar Dewantara', 'Gedung Fakultas Ilmu Komputer dan laboratorium komputer', 'Klaster Fakultas Ilmu Komputer', 4, NULL),

('Gedung Moh. Husni Thamrin', 'Gedung Fakultas Ekonomi dan Bisnis', 'Klaster Fakultas Ekonomi dan Bisnis', 4, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGflOIbXcOobrndabRHJSRJAhfL_paxHsrWpeYPkKE9NHoFIUwTfdkHXtt2W5uUkFP0Hw-E2PRVtVgIKR_Cxw5-5QQgu7yWgMIhKnMSstSsAO8sLZWib1D-9up5i4gtRmTFcQJ5UA=s1360-w1360-h1020-rw'),

('Gedung Muhammad Yamin', 'Gedung Fakultas Ilmu Sosial dan Ilmu Politik', 'Klaster FISIP', 2, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEMaTEfjms_FZz94oRK6Nh4UDLmVOLEDSE-FbJn9KanlLTV4_3_bFBi-OXyPfdAD-53PM-og8M0fjsQz6afff34paF4v_ZfKKJBgH-cm4auYKTTDmirhOyLP-kULtZdBFEjqvCX=s1360-w1360-h1020-rw'),

('Gedung Yos Sudarso', 'Gedung Fakultas Hukum Program Sarjana', 'Klaster Fakultas Hukum', 4, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAE4HfluOl3-xKlviPZHoIojU3Ogkeg7CmInvqij6OiLrAFwmG_4StjZZXymXAvXgVcCTSecMM9c7op3c75JD7J_t2X-fcqS8V44malDGnqf6f0AmVJRpJTsPNgpc56vxqWxHRXGCMLlljrl=s1360-w1360-h1020-rw'),

('Gedung RA Kartini', 'Gedung Fakultas Hukum Pascasarjana', 'Klaster Fakultas Hukum', 3, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFVIJBJOJTg_3lSkBco74Dee_FmZP8EyNMLbUleJAwf-6ZavcUyBtiz8lAimtSVsoqgJq0OKJ1plzSNSrejeDDZ8yMNX13A_a_uW0-Qr4oZzn_kGUmqFO6mYtuwSble9OmiH892Zw=s1360-w1360-h1020-rw'),

('Gedung Parkir Depan UPNVJ', 'Gedung parkir bertingkat untuk kendaraan mahasiswa dan staf', 'Sisi depan kampus', NULL, 'https://www.upnvj.ac.id/id/files/large/8bc605d9f811bf6fe60a23c2e0626ea0'),

('Area Parkir Depan UPNVJ', 'Area parkir terbuka untuk kendaraan mahasiswa dan staf', 'Sisi depan kampus', 4, 'https://www.upnvj.ac.id/id/files/thumb/65f06b5d1b2ab2a6603d3018c6c91b43/520'),

('Gedung Dewi Sartika', 'Gedung Fakultas Ilmu Komputer', 'Klaster Fakultas Ilmu Komputer', 4, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGa2dHMbS8-UqBc37_gAecDSWVc1uhXSpfA1fjnG0BiIzfb5igOofBUrkgUsKEjST29WRgalK0p17rjAwhap4HGbCIJBscgAfrziBv3apXVDoYNN9YcnKX7mwNCHivCpNLJQekA=s1360-w1360-h1020-rw'),

('Lapangan Upacara', 'Tempat upacara dan parkir mobil apabila sedang tidak dipakai', 'Area tengah kampus', 1, 'https://www.upnvj.ac.id/id/files/thumb/7c60154c9cdad11f95c5d0ef86090f1d/520'),

('Gedung Kuliah dan Kegiatan Mahasiswa', 'Gedung ruang kuliah dan sekretariat UKM', 'Area belakang kampus', 8, NULL),

('Area Parkir Belakang UPNVJ', 'Area parkir terbuka parkir untuk kendaraan mahasiswa dan staf', 'Sisi belakang kampus', 1, NULL);

-- =========================================
-- INSERT FAKULTAS
-- =========================================

INSERT INTO public.fakultas
(nama_fakultas, deskripsi_fakultas, email, website, id_gedung_utama)
VALUES
(
'Fakultas Kedokteran',
'Fakultas pendidikan kedokteran dan kesehatan',
'tatausahafkupn@upnvj.ac.id',
'https://fk.upnvj.ac.id',
3
),

(
'Fakultas Ekonomi dan Bisnis',
'Fakultas bidang ekonomi, akuntansi, dan manajemen',
'feb@upnvj.ac.id',
'https://feb.upnvj.ac.id',
7
),

(
'Fakultas Ilmu Komputer',
'Fakultas bidang teknologi informasi dan komputer',
'fik@upnvj.ac.id',
'https://new-fik.upnvj.ac.id',
6
),

(
'Fakultas Hukum',
'Fakultas bidang ilmu hukum dan peradilan',
'fh@upnvj.ac.id',
'https://hukum.upnvj.ac.id',
9
),

(
'Fakultas Ilmu Sosial dan Ilmu Politik',
'Fakultas bidang komunikasi, hubungan internasional, dan politik',
'fisip@upnvj.ac.id',
'https://fisip.upnvj.ac.id',
8
),

(
'Fakultas Teknik',
'Fakultas bidang teknik industri, mesin, dan perkapalan',
'ft@upnvj.ac.id',
'https://ft.upnvj.ac.id',
NULL
),

(
'Fakultas Ilmu Kesehatan',
'Fakultas bidang keperawatan dan kesehatan masyarakat',
'fikes@upnvj.ac.id',
'https://fikes.upnvj.ac.id',
NULL
);

-- =========================================
-- INSERT FASILITAS
-- =========================================

-- FEB

INSERT INTO public.fasilitas
(nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, color, lantai, foto_url, id_gedung)
VALUES

(
    'Ruang Kelas 201',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    2,
    NULL,
    7
),

(
    'Ruang Kelas 202',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    2,
    NULL,
    7
),

(
    'Ruang Dosen Ilmu Ekonomi',
    'Ruang kerja dosen Program Studi Ilmu Ekonomi FEB.',
    'Ruang Dosen',
    'orange',
    2,
    NULL,
    7
),

(
    'Ruang Dosen Manajemen Program Sarjana',
    'Ruang kerja dosen Program Studi Manajemen jenjang sarjana FEB.',
    'Ruang Dosen',
    'orange',
    2,
    NULL,
    7
),

(
    'Ruang Sekretariat Program Studi Manajemen dan Akuntansi Program Magister',
    'Ruang administrasi dan sekretariat Program Magister Manajemen dan Akuntansi FEB.',
    'Ruang Administrasi',
    'yellow',
    2,
    NULL,
    7
),

(
    'Ruang Kelas 203',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    2,
    NULL,
    7
),

(
    'Ruang Kelas 204',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    2,
    NULL,
    7
),

(
    'Ruang Kelas 205',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    2,
    NULL,
    7
),

(
    'Ruang Kelas 206',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    2,
    NULL,
    7
),

(
    'Ruang Kelas 207',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    2,
    NULL,
    7
),
-- LANTAI 3

(
    'Ruang Kelas 301',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    3,
    NULL,
    7
),

(
    'Ruang Kelas 302',
    'Laboratorium Ilmu Ekonomi untuk kegiatan praktikum dan pembelajaran mahasiswa FEB.',
    'Laboratorium',
    'purple',
    3,
    NULL,
    7
),

(
    'Ruang Kelas 303',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    3,
    NULL,
    7
),

(
    'Ruang Kelas 304',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    3,
    NULL,
    7
),

(
    'Ruang Kelas 305',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    3,
    NULL,
    7
),

(
    'Ruang Kelas 306',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    3,
    NULL,
    7
),

(
    'Ruang Kelas 307',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    3,
    NULL,
    7
),

(
    'Mash Classroom',
    'Ruang pembelajaran modern untuk kegiatan akademik mahasiswa FEB.',
    'Ruang Kelas',
    'cyan',
    3,
    NULL,
    7
),

(
    'Laboratorium Akuntansi 2',
    'Laboratorium untuk kegiatan praktikum akuntansi mahasiswa FEB.',
    'Laboratorium',
    'purple',
    3,
    NULL,
    7
),

-- LANTAI 4

(
    'Ruang Kelas D.401',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    4,
    NULL,
    7
),

(
    'Ruang Kelas D.402',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    4,
    NULL,
    7
),

(
    'Ruang Kelas D.403',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    4,
    NULL,
    7
),

(
    'Ruang Kelas D.404',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    4,
    NULL,
    7
),

(
    'Ruang Kelas C.402',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    4,
    NULL,
    7
),

(
    'Ruang Kelas C.403',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    4,
    NULL,
    7
),

(
    'Ruang Kelas C.404',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    4,
    NULL,
    7
),

(
    'Ruang Kelas C.405',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    4,
    NULL,
    7
),

(
    'Ruang Kelas C.406',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    4,
    NULL,
    7
),

(
    'Ruang Kelas C.407',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    'blue',
    4,
    NULL,
    7
),
(
    'Mushola FEB',
    'Fasilitas mushola untuk kegiatan ibadah mahasiswa FEB.',
    'Tempat Ibadah',
    'green',
    4,
    NULL,
    7
),
(
    'Mini Company',
    'Fasilitas simulasi perusahaan untuk praktik kewirausahaan dan bisnis mahasiswa FEB.',
    'Laboratorium Bisnis',
    'blue',
    3,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/WhatsApp-Image-2022-04-21-at-11.41.31.jpeg',
    7
),

(
    'Sibuni',
    'Sistem bisnis universitas yang digunakan untuk pengembangan praktik bisnis dan kewirausahaan mahasiswa.',
    'Laboratorium Bisnis',
    'indigo',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/WhatsApp-Image-2022-04-21-at-11.41.28.jpeg',
    7
),

(
    'Bank Mini',
    'Laboratorium praktik perbankan untuk mahasiswa program studi keuangan dan perbankan.',
    'Laboratorium',
    'green',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/WhatsApp-Image-2022-04-21-at-11.42.51.jpeg',
    7
),

(
    'Lembaga Kajian Ekonomi dan Bisnis',
    'Fasilitas penelitian dan pengkajian ekonomi serta bisnis untuk dosen dan mahasiswa.',
    'Pusat Penelitian',
    'purple',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/IMG_6400.jpg',
    7
),

(
    'BI Corner',
    'Pojok literasi ekonomi dan keuangan hasil kerja sama dengan Bank Indonesia.',
    'Perpustakaan',
    'yellow',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-16-at-10.15.43_b7572c4f.jpg',
    7
),

(
    'Selasar FEB',
    'Area terbuka untuk diskusi, kegiatan mahasiswa, dan interaksi akademik.',
    'Area Mahasiswa',
    'orange',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/IMG_4518.jpg',
    7
),

(
    'Aula BEJ',
    'Aula kegiatan seminar, workshop, dan acara akademik Fakultas Ekonomi dan Bisnis.',
    'Aula',
    'red',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/IMG_6394.jpg',
    7
),

(
    'Ruang Kelas',
    'Ruang perkuliahan reguler untuk kegiatan belajar mengajar mahasiswa FEB.',
    'Ruang Akademik',
    'gray',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/IMG_6397.jpg',
    7
),

(
    'Ruang Kelas Magister',
    'Ruang kelas khusus program magister Fakultas Ekonomi dan Bisnis.',
    'Ruang Akademik',
    'teal',
    2,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/01/IMG_9968.jpg',
    7
),

(
    'Sekretariat Magister',
    'Ruang administrasi dan pelayanan akademik program magister FEB.',
    'Administrasi',
    'cyan',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2024-05-17-at-14.30.40_dd6f3fff-1.jpg',
    7
),

(
    'Ruang Kelas Doktoral',
    'Ruang pembelajaran untuk program doktoral di lingkungan FEB.',
    'Ruang Akademik',
    'brown',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/06/IMG_5228.jpg',
    7
),

(
    'Sekretariat Doktoral',
    'Fasilitas administrasi dan layanan akademik program doktoral FEB.',
    'Administrasi',
    'pink',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/06/IMG_5222.jpg',
    7
),

(
    'Laboratorium Akuntansi dan Komputasi',
    'Laboratorium untuk praktik akuntansi komputer dan pengolahan data bisnis.',
    'Laboratorium Komputer',
    'emerald',
    NULL,
    'https://feb.upnvj.ac.id/struktur-organisasi/',
    7
),

(
    'Laboratorium Ilmu Ekonomi dan Manajemen',
    'Laboratorium penunjang pembelajaran ekonomi dan manajemen berbasis teknologi.',
    'Laboratorium',
    'sky',
    NULL,
    'https://feb.upnvj.ac.id/struktur-organisasi/',
    7
),

-- FK


-- =========================
-- GEDUNG ID 3
-- =========================

(
    'Ruang Dosen FK UPNVJ',
    'Ruang kerja dan aktivitas dosen Fakultas Kedokteran UPNVJ.',
    'Administrasi & Layanan',
    'blue',
    1,
    NULL,
    3
),

(
    'Pusat Stemcell & Tissue Engineering Research Centre',
    'Pusat kegiatan penelitian sel punca dan rekayasa jaringan.',
    'Laboratorium',
    'green',
    1,
    NULL,
    3
),

(
    'Ruang Akreditasi FK UPNVJ',
    'Ruang pengelolaan administrasi dan dokumen akreditasi Fakultas Kedokteran.',
    'Administrasi & Layanan',
    'blue',
    1,
    NULL,
    3
),

(
    'Ruang BEM FK UPNVJ',
    'Ruang organisasi mahasiswa BEM Fakultas Kedokteran.',
    'Administrasi & Layanan',
    'orange',
    1,
    NULL,
    3
),

(
    'Ruang Dekan FK UPNVJ',
    'Ruang kerja Dekan Fakultas Kedokteran.',
    'Administrasi & Layanan',
    'blue',
    2,
    NULL,
    3
),

(
    'Ruang Wakil Dekan Bidang Akademik',
    'Ruang kerja Wakil Dekan bidang akademik.',
    'Administrasi & Layanan',
    'blue',
    2,
    NULL,
    3
),

(
    'Ruang Wakil Dekan Bidang Umum dan Keuangan',
    'Ruang kerja Wakil Dekan bidang umum dan keuangan.',
    'Administrasi & Layanan',
    'blue',
    2,
    NULL,
    3
),

(
    'Ruang Wakil Dekan Bidang Kemahasiswaan dan Kerjasama',
    'Ruang kerja Wakil Dekan bidang kemahasiswaan dan kerjasama.',
    'Administrasi & Layanan',
    'blue',
    2,
    NULL,
    3
),

(
    'Ruang Sekretariat Tata Usaha FK UPNVJ',
    'Ruang sekretariat tata usaha Fakultas Kedokteran.',
    'Administrasi & Layanan',
    'blue',
    2,
    NULL,
    3
),

(
    'Ruang Administrasi Keuangan FK UPNVJ',
    'Ruang administrasi keuangan Fakultas Kedokteran.',
    'Administrasi & Layanan',
    'blue',
    2,
    NULL,
    3
),

(
    'Medical Education Unit (MEU)',
    'Unit pengembangan pendidikan kedokteran.',
    'Administrasi & Layanan',
    'green',
    2,
    NULL,
    3
),

(
    'Medical Research Unit (MRU)',
    'Unit penelitian medis Fakultas Kedokteran.',
    'Laboratorium',
    'green',
    2,
    NULL,
    3
),

(
    'Medical Assessment Unit (MAU)',
    'Unit evaluasi dan asesmen pendidikan medis.',
    'Administrasi & Layanan',
    'green',
    2,
    NULL,
    3
),

(
    'Medical Quality Assurance (MQA)',
    'Unit penjaminan mutu pendidikan medis.',
    'Administrasi & Layanan',
    'green',
    2,
    NULL,
    3
),

(
    'Ruang Rapat Dekan dan Fakultas Kedokteran',
    'Ruang rapat untuk kegiatan pimpinan dan fakultas.',
    'Administrasi & Layanan',
    'purple',
    2,
    NULL,
    3
),

(
    'Auditorium Fakultas Kedokteran',
    'Auditorium dengan kapasitas sekitar 200 orang.',
    'Auditorium & Aula',
    'red',
    3,
    NULL,
    3
),

(
    'Laboratorium Biologi Molekuler',
    'Laboratorium untuk praktikum dan penelitian biologi molekuler.',
    'Laboratorium',
    'green',
    3,
    NULL,
    3
),

(
    'Laboratorium Biokimia',
    'Laboratorium untuk kegiatan praktikum biokimia.',
    'Laboratorium',
    'green',
    3,
    NULL,
    3
),

(
    'Laboratorium Patologi Klinik',
    'Laboratorium untuk kegiatan patologi klinik.',
    'Laboratorium',
    'green',
    3,
    NULL,
    3
),

(
    'Laboratorium IKK/IKM',
    'Laboratorium Ilmu Kesehatan Komunitas dan Ilmu Kesehatan Masyarakat.',
    'Laboratorium',
    'green',
    3,
    NULL,
    3
),

(
    'Ruang Diskusi FK',
    'Ruang diskusi akademik mahasiswa dan dosen.',
    'Ruang Kuliah & Akademik',
    'yellow',
    3,
    NULL,
    3
),

-- =========================
-- GEDUNG ID 4
-- =========================

(
    'Perpustakaan FK UPNVJ',
    'Perpustakaan dengan fasilitas ruang baca, e-library, WiFi, hotspot, dan layanan internet.',
    'Perpustakaan & Ruang Baca',
    'brown',
    1,
    NULL,
    4
),

(
    'Laboratorium Komputer FK',
    'Laboratorium komputer dengan 150 komputer terhubung internet.',
    'Laboratorium',
    'green',
    1,
    NULL,
    4
),

(
    'Laboratorium Histologi',
    'Laboratorium Departemen Histologi.',
    'Laboratorium',
    'green',
    1,
    NULL,
    4
),

(
    'Laboratorium Patologi Anatomi',
    'Laboratorium Departemen Patologi Anatomi.',
    'Laboratorium',
    'green',
    1,
    NULL,
    4
),

(
    'Ruang Tutorial FK',
    'Enam belas ruang diskusi kelompok untuk proses tutorial mahasiswa.',
    'Ruang Kuliah & Akademik',
    'yellow',
    2,
    NULL,
    4
),

(
    'Ruang Tutor Meeting',
    'Ruang observasi dan monitoring pelaksanaan tutorial.',
    'Ruang Kuliah & Akademik',
    'yellow',
    2,
    NULL,
    4
),

(
    'Skills Lab FK',
    'Laboratorium keterampilan klinik dengan ruang coaching dan station OSCE.',
    'Laboratorium',
    'green',
    3,
    NULL,
    4
),

(
    'Ruang Introduction A dan B',
    'Ruang pengenalan pembelajaran berkapasitas 75–100 mahasiswa.',
    'Ruang Kuliah & Akademik',
    'yellow',
    3,
    NULL,
    4
),

(
    'Gudang Mannequin Skills Lab',
    'Gudang penyimpanan mannequin keterampilan medis.',
    'Laboratorium',
    'gray',
    3,
    NULL,
    4
),

(
    'Ruang Administrasi Skills Lab',
    'Ruang administrasi kegiatan skills lab.',
    'Administrasi & Layanan',
    'blue',
    3,
    NULL,
    4
),

(
    'Ruang Instruktur Skills Lab',
    'Ruang instruktur kegiatan skills lab.',
    'Administrasi & Layanan',
    'blue',
    3,
    NULL,
    4
),

(
    'Mushola FK',
    'Fasilitas ibadah untuk mahasiswa dan civitas akademika.',
    'Fasilitas Ibadah',
    'teal',
    3,
    NULL,
    4
),

(
    'Ruang Lecture A dan B',
    'Dua ruang kuliah berkapasitas sekitar 190 orang.',
    'Ruang Kuliah & Akademik',
    'yellow',
    4,
    NULL,
    4
),

(
    'Ruang Seminar FK',
    'Ruang seminar dengan kapasitas sekitar 40 orang.',
    'Auditorium & Aula',
    'red',
    4,
    NULL,
    4
),

(
    'Hall FK',
    'Hall pendukung perluasan ruang lecture.',
    'Auditorium & Aula',
    'red',
    4,
    NULL,
    4
),

(
    'Ruang Transit Dosen',
    'Ruang transit dan istirahat dosen.',
    'Administrasi & Layanan',
    'blue',
    4,
    NULL,
    4
),

-- =========================
-- GEDUNG ID 5
-- =========================

(
    'Departemen Anatomi',
    'Fasilitas departemen anatomi Fakultas Kedokteran.',
    'Laboratorium',
    'green',
    1,
    NULL,
    5
),

(
    'Departemen Fisiologi',
    'Fasilitas departemen fisiologi Fakultas Kedokteran.',
    'Laboratorium',
    'green',
    1,
    NULL,
    5
),

(
    'Ruang Tutorial Gedung Abdul Rahman Saleh',
    'Tiga ruang tutorial untuk diskusi akademik mahasiswa.',
    'Ruang Kuliah & Akademik',
    'yellow',
    3,
    NULL,
    5
),

(
    'OSCE Center FKUPN',
    'Pusat ujian OSCE dengan 24 ruang ujian, control panel, dan gudang manekin.',
    'Laboratorium',
    'green',
    4,
    NULL,
    5
),

(
    'Ruang Alumni I',
    'Ruang kegiatan alumni Fakultas Kedokteran.',
    'Administrasi & Layanan',
    'orange',
    4,
    NULL,
    5
),

(
    'Ruang Peserta Alumni FK UPNVJ',
    'Ruang peserta alumni Fakultas Kedokteran UPNVJ.',
    'Administrasi & Layanan',
    'orange',
    4,
    NULL,
    5
),

(
    'Ruang Komisi Etik',
    'Ruang kegiatan komisi etik Fakultas Kedokteran.',
    'Administrasi & Layanan',
    'purple',
    4,
    NULL,
    5
),

-- FIK

-- =========================
-- GEDUNG KI HADJAR DEWANTARA (id = 6)
-- =========================
(
    'Ruang Kuliah 203 Ki Hadjar Dewantara',
    'Ruang kuliah yang berada di Gedung Ki Hadjar Dewantara lantai 2.',
    'Ruang Kuliah & Akademik',
    'yellow',
    2,
    NULL,
    6
),

(
    'Ruang Kuliah 202 Ki Hadjar Dewantara',
    'Ruang kuliah yang berada di Gedung Ki Hadjar Dewantara lantai 2.',
    'Ruang Kuliah & Akademik',
    'yellow',
    2,
    NULL,
    6
),

(
    'Selasar Lantai 1',
    'Selasar pada lantai 1 Gedung Ki Hadjar Dewantara.',
    'Administrasi & Layanan',
    'gray',
    1,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/09/WhatsApp-Image-2024-09-26-at-16.06.50-1-1024x768.jpeg',
    6
),

(
    'Sekretariat Laboratorium',
    'Ruang sekretariat laboratorium yang berfungsi sebagai pusat administrasi dan koordinasi kegiatan laboratorium.',
    'Administrasi & Layanan',
    'blue',
    3,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-01-at-14.02.56-scaled.jpeg',
    6
),
(
    'Lab Immersive dan Multimedia',
    'Pusat praktikum dan penelitian di bidang pemrograman komputer dengan fasilitas komputer terbaru, internet berkecepatan tinggi, proyektor, dan papan tulis digital.',
    'Laboratorium',
    'green',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-Programming-JPG.jpg',
    6
),
(
    'Digital Library',
    'Perpustakaan digital Fakultas Ilmu Komputer yang menyimpan koleksi buku, jurnal, artikel, dan sumber informasi lainnya dalam bentuk digital.',
    'Perpustakaan & Ruang Baca',
    'brown',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2025/01/20241231_104651-scaled.jpg',
    6
),
(
    'Lab Cybersecurity dan Networking',
    'Pusat praktikum dan penelitian bidang keamanan siber dengan perangkat keras canggih, perangkat lunak keamanan terkini, dan jaringan simulasi serangan siber.',
    'Laboratorium',
    'green',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-Cybersecurity.jpeg',
    6
),
(
    'Lab Big Data dan Data Science',
    'Pusat praktikum dan penelitian dalam bidang penambangan data dan ilmu data dengan komputer berkinerja tinggi dan perangkat lunak analisis data terkini.',
    'Laboratorium',
    'green',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-Data-Mining-dan-Data-Science-JPG.jpg',
    6
),
(
    'Lab Artificial Intelligence dan Robotics',
    'Pusat praktikum dan penelitian bidang kecerdasan buatan dengan fasilitas komputer berperforma tinggi, perangkat lunak AI terbaru, big data, dan machine learning.',
    'Laboratorium',
    'green',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-Artificial-Intelligence-JPG.jpg',
    6
),
(
    'Lab Enterprise System',
    'Pusat praktikum dan penelitian bidang intelijen bisnis dengan komputer berperforma tinggi, perangkat lunak analitik terkini, dan platform visualisasi data.',
    'Laboratorium',
    'green',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/WhatsApp-Image-2024-06-11-at-4.05.11-PM.jpeg',
    6
),
(
    'Lab E-Governance',
    'Pusat praktikum dan penelitian bidang manajemen basis data dengan komputer berperforma tinggi dan perangkat lunak database terkini seperti SQL Server, Oracle, dan MySQL.',
    'Laboratorium',
    'green',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-Database.jpeg',
    6
),
(
    'Lab Internet of Things',
    'Pusat kegiatan praktikum dan penelitian bidang teknologi IoT dengan sensor, mikrokontroler, modul komunikasi nirkabel, dan perangkat lunak pengembangan IoT terkini.',
    'Laboratorium',
    'green',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-IoT-JPG.jpg',
    6
),
(
    'Lab Software Engineering',
    'Pusat praktikum dan penelitian di bidang pemrograman komputer dengan komputer terbaru, internet berkecepatan tinggi, proyektor, dan papan tulis digital.',
    'Laboratorium',
    'green',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-25-at-09.57.29-1-scaled.jpeg',
    6
),
(
    'Masjid',
    'Masjid di lingkungan kampus UPNVJ',
    'Tempat Ibadah',
    'green',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2025/03/20250326_071225-1024x768.jpg',
    6
),

-- =========================
-- GEDUNG DEWI SARTIKA (id = 13)
-- =========================
(
    'Lapangan dan Alat Olahraga FIK',
    'Fasilitas Olahraga yang terletak di depan Gedung Dewi Sartika lantai 1.',
    'Olahraga',
    'orange',
    1,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2025/03/20250326_071558-768x576.jpg',
    13
),
(
    'Ruang UKM UBV',
    'Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.',
    'Administrasi & Layanan',
    'orange',
    1,
    NULL,
    13
),
(
    'Ruang UKM Sepak Bola',
    'Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.',
    'Administrasi & Layanan',
    'orange',
    1,
    NULL,
    13
),(
    'Ruang UKM Basket',
    'Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.',
    'Administrasi & Layanan',
    'orange',
    1,
    NULL,
    13
),
(
    'Ruang UKM UFO',
    'Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.',
    'Administrasi & Layanan',
    'orange',
    1,
    NULL,
    13
),
(
    'Ruang UKM Catur',
    'Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.',
    'Administrasi & Layanan',
    'orange',
    1,
    NULL,
    13
),
(
    'Ruang BEM FIK',
    'Ruang kegiatan Badan Eksekutif Mahasiswa di Gedung Dewi Sartika lantai 1.',
    'Administrasi & Layanan',
    'orange',
    1,
    NULL,
    13
),
(
    'Ruang Kuliah 201 Dewi Sartika',
    'Ruang kuliah yang berada di Gedung Dewi Sartika lantai 2.',
    'Ruang Kuliah & Akademik',
    'yellow',
    2,
    NULL,
    13
),
(
    'Ruang Kuliah 202 Dewi Sartika',
    'Ruang kuliah yang berada di Gedung Dewi Sartika lantai 2.',
    'Ruang Kuliah & Akademik',
    'yellow',
    2,
    NULL,
    13
),
(
    'Ruang Kuliah 203 Dewi Sartika',
    'Ruang kuliah yang berada di Gedung Dewi Sartika lantai 2.',
    'Ruang Kuliah & Akademik',
    'yellow',
    2,
    NULL,
    13
),
(
    'Ruang Kuliah 301',
    'Ruang kuliah yang berada di Gedung Dewi Sartika lantai 3.',
    'Ruang Kuliah & Akademik',
    'yellow',
    3,
    NULL,
    13
),
(
    'Ruang Kuliah 302',
    'Ruang kuliah yang berada di Gedung Dewi Sartika lantai 3.',
    'Ruang Kuliah & Akademik',
    'yellow',
    3,
    NULL,
    13
),
(
    'Ruang Kuliah 303',
    'Ruang kuliah yang berada di Gedung Dewi Sartika lantai 3.',
    'Ruang Kuliah & Akademik',
    'yellow',
    3,
    NULL,
    13
),
(
    'Ruang Kuliah 401',
    'Ruang kuliah yang berada di Gedung Dewi Sartika lantai 4.',
    'Ruang Kuliah & Akademik',
    'yellow',
    4,
    NULL,
    13
),
(
    'Ruang Kuliah 402',
    'Ruang kuliah yang berada di Gedung Dewi Sartika lantai 4.',
    'Ruang Kuliah & Akademik',
    'yellow',
    4,
    NULL,
    13
),
(
    'Ruang Kuliah 403',
    'Ruang kuliah yang berada di Gedung Dewi Sartika lantai 4.',
    'Ruang Kuliah & Akademik',
    'yellow',
    4,
    NULL,
    13
),

-- FH

-- =========================
-- GEDUNG YOS SUDARSO (id = 9)
-- =========================
(
    'Ruang Dosen Yos Sudarso Lantai 1',
    'Ruang dosen pada lantai 1 Gedung Yos Sudarso.',
    'Administrasi & Layanan',
    'blue',
    1,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2023/11/RUANG-KONSENTRASI-2048x1536.png',
    9
),
(
    'Ruang Dosen Yos Sudarso Lantai 2',
    'Ruang dosen pada lantai 2 Gedung Yos Sudarso.',
    'Administrasi & Layanan',
    'blue',
    2,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2021/03/f0fd3420-8e5e-433f-b7b8-2da5e898cb64.png',
    9
),
(
    'Ruang Administrasi Yos Sudarso',
    'Ruang administrasi pada Gedung Yos Sudarso.',
    'Administrasi & Layanan',
    'blue',
    1,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2021/03/54a42329-09bc-48a5-8ae2-0e7e5ee0bb26.png',
    9
),
(
    'Ruang Rapat Yos Sudarso Lantai 2',
    'Ruang rapat pada lantai 2 Gedung Yos Sudarso.',
    'Administrasi & Layanan',
    'blue',
    2,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/06/IMG_5457.jpg',
    9
),
(
    'Ruang Podcast Yos Sudarso',
    'Ruang podcast pada lantai 4 Gedung Yos Sudarso.',
    'Administrasi & Layanan',
    'purple',
    4,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/RuangPODCAST-LT-4-768x599-HD.png',
    9
),
(
    'Ruang Praktik Peradilan Semu',
    'Ruang praktik peradilan semu pada lantai 4 Gedung Yos Sudarso.',
    'Ruang Kuliah & Akademik',
    'yellow',
    4,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/RuangPODCAST-LT-4-768x599-HD.png',
    9
),
(
    'Smartclass Yos Sudarso Lantai 2-3',
    'Smartclass yang digunakan pada lantai 2 dan 3 Gedung Yos Sudarso.',
    'Ruang Kuliah & Akademik',
    'yellow',
    NULL,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2022/06/WhatsApp-Image-2022-06-06-at-11.16.52-1-768x576.jpeg',
    9
),
(
    'Ruang Baca Yos Sudarso',
    'Ruang baca pada lantai 3 Gedung Yos Sudarso.',
    'Perpustakaan & Ruang Baca',
    'brown',
    3,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-14-at-09.19.42.jpeg',
    9
),
(
    'Lab Perancangan Kontrak',
    'Laboratorium perancangan kontrak pada lantai 2 Gedung Yos Sudarso.',
    'Laboratorium',
    'green',
    2,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-14-at-09.20.39.jpeg',
    9
),
(
    'Selasar Kanan Yos Sudarso',
    'Selasar kanan pada lantai 1 Gedung Yos Sudarso.',
    'Administrasi & Layanan',
    'gray',
    1,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-14-at-09.19.43.jpeg',
    9
),
(
    'Selasar Kiri Yos Sudarso',
    'Selasar kiri pada lantai 1 Gedung Yos Sudarso.',
    'Administrasi & Layanan',
    'gray',
    1,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-14-at-09.19.43-1.jpeg',
    9
),

-- =========================
-- GEDUNG RA KARTINI (id = 10)
-- =========================
(
    'Ruang Kelas Magister RA Kartini',
    'Ruang kelas program magister pada lantai 1 Gedung RA Kartini.',
    'Ruang Kuliah & Akademik',
    'yellow',
    1,
    NULL,
    10
),
(
    'Ruang Kelas Prodi Magister & Doktor RA Kartini',
    'Ruang kelas program magister dan doktor pada lantai 1 Gedung RA Kartini.',
    'Ruang Kuliah & Akademik',
    'yellow',
    1,
    NULL,
    10
),
(
    'Ruang Konseling Magister & Doktor',
    'Ruang konseling program magister dan doktor pada lantai 1 Gedung RA Kartini.',
    'Administrasi & Layanan',
    'blue',
    1,
    NULL,
    10
),
(
    'Ruang Rapat Magister & Doktor',
    'Ruang rapat program magister dan doktor pada lantai 1 Gedung RA Kartini.',
    'Administrasi & Layanan',
    'blue',
    1,
    NULL,
    10
),
(
    'Ruang Tunggu Magister & Doktor',
    'Ruang tunggu program magister dan doktor pada lantai 1 Gedung RA Kartini.',
    'Administrasi & Layanan',
    'gray',
    1,
    NULL,
    10
),
(
    'Ruang Dosen Magister & Doktor',
    'Ruang dosen program magister dan doktor pada lantai 1 Gedung RA Kartini.',
    'Administrasi & Layanan',
    'blue',
    1,
    NULL,
    10
),
(
    'Ruang Administrasi Magister & Doktor',
    'Ruang administrasi program magister dan doktor pada lantai 1 Gedung RA Kartini.',
    'Administrasi & Layanan',
    'blue',
    1,
    NULL,
    10
),

-- FISIP


(
    'Auditorium FISIP',
    'Auditorium Fakultas Ilmu Sosial dan Ilmu Politik untuk seminar, kuliah umum, dan kegiatan akademik.',
    'Auditorium & Aula',
    'red',
    NULL,
    NULL,
    NULL
),

(
    'Ruang Baca FISIP',
    'Ruang baca dengan koleksi buku, jurnal, referensi digital, serta akses internet untuk mendukung kegiatan akademik.',
    'Perpustakaan & Ruang Baca',
    'brown',
    2,
    NULL,
    NULL
),

(
    'Lab Multimedia',
    'Laboratorium multimedia untuk pembelajaran produksi video, audio, animasi, dan desain grafis.',
    'Laboratorium',
    'green',
    NULL,
    NULL,
    NULL
),

(
    'Lab Politik',
    'Laboratorium pembelajaran dan penelitian di bidang ilmu politik.',
    'Laboratorium',
    'green',
    NULL,
    NULL,
    NULL
),

(
    'Lab Big Data',
    'Laboratorium untuk praktikum dan penelitian big data serta analisis data.',
    'Laboratorium',
    'green',
    NULL,
    NULL,
    NULL
),

(
    'Lab Fotografi',
    'Laboratorium fotografi untuk praktikum dan pengembangan keterampilan fotografi mahasiswa.',
    'Laboratorium',
    'green',
    NULL,
    NULL,
    NULL
),

(
    'Lab Radio',
    'Laboratorium radio untuk praktik penyiaran dan produksi audio.',
    'Laboratorium',
    'green',
    NULL,
    NULL,
    NULL
),

(
    'Lab Podcast',
    'Laboratorium podcast untuk produksi konten audio digital dan broadcasting.',
    'Laboratorium',
    'green',
    NULL,
    NULL,
    NULL
),

(
    'Lab Film dan TV',
    'Laboratorium produksi film dan televisi untuk mendukung pembelajaran media audiovisual.',
    'Laboratorium',
    'green',
    NULL,
    NULL,
    NULL
),

(
    'Lab Diplomasi',
    'Laboratorium diplomasi untuk simulasi dan pembelajaran hubungan internasional.',
    'Laboratorium',
    'green',
    NULL,
    NULL,
    NULL
),

(
    'Ruang Kelas FISIP',
    'Ruang kelas untuk kegiatan belajar mengajar mahasiswa FISIP.',
    'Ruang Kuliah & Akademik',
    'yellow',
    NULL,
    NULL,
    NULL
),

(
    'Area Lounge Mahasiswa FISIP',
    'Area bersantai dan diskusi mahasiswa di lingkungan FISIP.',
    'Administrasi & Layanan',
    'gray',
    NULL,
    NULL,
    NULL
),

(
    'Ruang Diskusi FISIP',
    'Ruang diskusi mahasiswa untuk kegiatan akademik dan kolaborasi.',
    'Ruang Kuliah & Akademik',
    'yellow',
    NULL,
    NULL,
    NULL
);

-- =========================================
-- INSERT PROGRAM STUDI
-- =========================================

-- data prodi
INSERT INTO program_studi (nama_prodi, jenjang, id_fakultas, akreditasi) VALUES
('Perbankan dan Keuangan', 'Vokasi', 2, 'Unggul'),
('Akuntansi', 'Vokasi', 2, 'Unggul'),
('Manajemen', 'Sarjana', 2, 'Unggul'),
('Akuntansi', 'Sarjana', 2, 'Unggul'),
('Ekonomi Pembangunan', 'Sarjana', 2, 'Baik Sekali'),
('Ekonomi Syariah', 'Sarjana', 2, 'Unggul'),
('Manajemen', 'Magister', 2, 'B'),
('Akuntansi', 'Magister', 2, 'Baik Sekali'),

('Kedokteran', 'Sarjana', 1, 'Unggul'),
('Farmasi', 'Sarjana', 1, 'Baik Sekali'),
('Biologi', 'Sarjana', 1, 'Izin Operasional'),
('Pendidikan Profesi Dokter', 'Profesi', 1, 'Unggul'),
('Apoteker', 'Profesi', 1, 'Izin Operasional'),
('Sains Biomedis', 'Magister', 1, 'Izin Operasional'),
('Radiologi', 'Spesialis', 1, 'Izin Operasional'),

('Sistem Informasi', 'Vokasi', 3, 'B'),
('Informatika', 'Sarjana', 3, 'Unggul'),
('Sistem Informasi', 'Sarjana', 3, 'Baik Sekali'),
('Sains Data', 'Sarjana', 3, 'Ijin Operasional'),

('Hukum', 'Sarjana', 4, 'Unggul'),
('Hukum Bisnis', 'Sarjana', 4, 'Ijin Operasional'),
('Hukum', 'Magister', 4, 'Baik Sekali'),
('Hukum', 'Doktor', 4, 'Ijin Operasional'),

('Ilmu Komunikasi', 'Sarjana', 5, 'Unggul'),
('Hubungan Internasional', 'Sarjana', 5, 'B'),
('Ilmu Politik', 'Sarjana', 5, 'Baik Sekali'),
('Sains Informasi', 'Sarjana', 5, 'Baik'),
('Kajian Film, Televisi dan Media', 'Sarjana', 5, 'Izin Operasional'),
('Hubungan Internasional', 'Magister', 5, 'Baik'),
('Ilmu Politik', 'Magister', 5, 'Baik'),
('Ilmu Komunikasi', 'Magister', 5, 'Baik Sekali'),

('Teknik Mesin', 'Sarjana', 6, 'Unggul'),
('Teknik Industri', 'Sarjana', 6, 'Unggul'),
('Teknik Perkapalan', 'Sarjana', 6, 'Unggul'),
('Teknik Elektro', 'Sarjana', 6, 'Unggul'),

('Keperawatan', 'Vokasi', 7, 'Unggul'),
('Fisioterapi', 'Vokasi', 7, 'Unggul'),
('Kesehatan Masyarakat', 'Sarjana', 7, 'Unggul'),
('Gizi', 'Sarjana', 7, 'Unggul'),
('Keperawatan', 'Sarjana', 7, 'Baik Sekali'),
('Fisioterapi', 'Sarjana', 7, 'Unggul'),
('Pendidikan Profesi Ners', 'Profesi', 7, 'Baik Sekali'),
('Kesehatan Masyarakat', 'Magister', 7, 'Baik'),
('Keperawatan', 'Magister', 7, 'Ijin Operasional');INSERT INTO program_studi (nama_prodi, jenjang, id_fakultas, akreditasi) VALUES
('Perbankan dan Keuangan', 'Vokasi', 2, 'Unggul'),
('Akuntansi', 'Vokasi', 2, 'Unggul'),
('Manajemen', 'Sarjana', 2, 'Unggul'),
('Akuntansi', 'Sarjana', 2, 'Unggul'),
('Ekonomi Pembangunan', 'Sarjana', 2, 'Baik Sekali'),
('Ekonomi Syariah', 'Sarjana', 2, 'Unggul'),
('Manajemen', 'Magister', 2, 'B'),
('Akuntansi', 'Magister', 2, 'Baik Sekali'),

('Kedokteran', 'Sarjana', 1, 'Unggul'),
('Farmasi', 'Sarjana', 1, 'Baik Sekali'),
('Biologi', 'Sarjana', 1, 'Izin Operasional'),
('Pendidikan Profesi Dokter', 'Profesi', 1, 'Unggul'),
('Apoteker', 'Profesi', 1, 'Izin Operasional'),
('Sains Biomedis', 'Magister', 1, 'Izin Operasional'),
('Radiologi', 'Spesialis', 1, 'Izin Operasional'),

('Sistem Informasi', 'Vokasi', 3, 'B'),
('Informatika', 'Sarjana', 3, 'Unggul'),
('Sistem Informasi', 'Sarjana', 3, 'Baik Sekali'),
('Sains Data', 'Sarjana', 3, 'Ijin Operasional'),

('Hukum', 'Sarjana', 4, 'Unggul'),
('Hukum Bisnis', 'Sarjana', 4, 'Ijin Operasional'),
('Hukum', 'Magister', 4, 'Baik Sekali'),
('Hukum', 'Doktor', 4, 'Ijin Operasional'),

('Ilmu Komunikasi', 'Sarjana', 5, 'Unggul'),
('Hubungan Internasional', 'Sarjana', 5, 'B'),
('Ilmu Politik', 'Sarjana', 5, 'Baik Sekali'),
('Sains Informasi', 'Sarjana', 5, 'Baik'),
('Kajian Film, Televisi dan Media', 'Sarjana', 5, 'Izin Operasional'),
('Hubungan Internasional', 'Magister', 5, 'Baik'),
('Ilmu Politik', 'Magister', 5, 'Baik'),
('Ilmu Komunikasi', 'Magister', 5, 'Baik Sekali'),

('Teknik Mesin', 'Sarjana', 6, 'Unggul'),
('Teknik Industri', 'Sarjana', 6, 'Unggul'),
('Teknik Perkapalan', 'Sarjana', 6, 'Unggul'),
('Teknik Elektro', 'Sarjana', 6, 'Unggul'),

('Keperawatan', 'Vokasi', 7, 'Unggul'),
('Fisioterapi', 'Vokasi', 7, 'Unggul'),
('Kesehatan Masyarakat', 'Sarjana', 7, 'Unggul'),
('Gizi', 'Sarjana', 7, 'Unggul'),
('Keperawatan', 'Sarjana', 7, 'Baik Sekali'),
('Fisioterapi', 'Sarjana', 7, 'Unggul'),
('Pendidikan Profesi Ners', 'Profesi', 7, 'Baik Sekali'),
('Kesehatan Masyarakat', 'Magister', 7, 'Baik'),
('Keperawatan', 'Magister', 7, 'Ijin Operasional');