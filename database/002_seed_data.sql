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
('Gedung Rektorat', 'Gedung rektorat dan pusat administrasi universitas', 'Area depan kampus utama Pondok Labu', 4, 'https://lh3.googleusercontent.com/p/AF1QipNfznFUQmK_jNHYGwvy-PhNWFyakaWDwpbpcChk=s1360-w1360-h1020-rw'),

('Gedung DR. Soepomo', 'Gedung perpustakaan pusat dan laboratorium terpadu universitas', 'Zona pelayanan akademik', 4, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHP4bEdhC5nk1gfOqby_zHT9oKCovBX2WsHIwD4Ov64kpGzirWAW8dfAKBGwftct2ENL5HcPPlCAx6anVa_H3dJUP-RwS9J7x9rKjxL6no_xnjpvSK8dXp5w7IZpr6HFVIi04c2=s1360-w1360-h1020-rw'),

('Gedung Dr. Wahidin Sudiro Husodo', 'Gedung utama Fakultas Kedokteran', 'Klaster Fakultas Kedokteran', 4, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAH_kJkMUYypSOPQCcHhMvExYp5AYpdDUaaYuG5qitbtoSPj7j8D8SZI-iKz4fTLRCx3gDxFHjYkbk1hjLX_rInT1ZRI85vAprglf9kUut_2XODKNYm9Hy-5_W6R-dc_Ub4km58m5P1nwGhK=s1360-w1360-h1020-rw'),

('Gedung Dr. Cipto Mangunkusumo', 'Gedung penunjang laboratorium dan skills lab Fakultas Kedokteran', 'Klaster Fakultas Kedokteran', 3, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEuafZGrUzwGKAgdCd2ypupHw0fC0nzc3SrnfBaa-n_sdwlt-tRurr-USbmlMVT-eC1-jSCMwObrVcjVKkPEZsU_mnlrQXlS2slOjtx-w71PNaP-xih06I7q3_c722PJKnLnioD=s1360-w1360-h1020-rw'),

('Gedung Abdul Rahman Saleh', 'Gedung fasilitas pendukung Fakultas Kedokteran dan laboratorium klinis', 'Perbatasan FK dan FISIP', 4, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFN69ll_2oviGvoSVxqOLSXKGitp5YcsG1SwaS98aas0JotI0LcnYEAfpx45ME5h-2dAkd0HeM7EnBRohk848CBtRE0ZnHYrMHnka93pW0URtKOOkbI5F4yht6l-xUfAkwFmeD8=s1360-w1360-h1020-rw'),

('Gedung Ki Hadjar Dewantara', 'Gedung Fakultas Ilmu Komputer dan laboratorium komputer', 'Klaster Fakultas Ilmu Komputer', 4, NULL),

('Gedung Moh. Husni Thamrin', 'Gedung Fakultas Ekonomi dan Bisnis', 'Klaster Fakultas Ekonomi dan Bisnis', 4, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGflOIbXcOobrndabRHJSRJAhfL_paxHsrWpeYPkKE9NHoFIUwTfdkHXtt2W5uUkFP0Hw-E2PRVtVgIKR_Cxw5-5QQgu7yWgMIhKnMSstSsAO8sLZWib1D-9up5i4gtRmTFcQJ5UA=s1360-w1360-h1020-rw'),

('Gedung Muhammad Yamin', 'Gedung Fakultas Ilmu Sosial dan Ilmu Politik', 'Klaster FISIP', 2, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEMaTEfjms_FZz94oRK6Nh4UDLmVOLEDSE-FbJn9KanlLTV4_3_bFBi-OXyPfdAD-53PM-og8M0fjsQz6afff34paF4v_ZfKKJBgH-cm4auYKTTDmirhOyLP-kULtZdBFEjqvCX=s1360-w1360-h1020-rw'),

('Gedung Yos Sudarso', 'Gedung Fakultas Hukum Program Sarjana', 'Klaster Fakultas Hukum', 4, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAE4HfluOl3-xKlviPZHoIojU3Ogkeg7CmInvqij6OiLrAFwmG_4StjZZXymXAvXgVcCTSecMM9c7op3c75JD7J_t2X-fcqS8V44malDGnqf6f0AmVJRpJTsPNgpc56vxqWxHRXGCMLlljrl=s1360-w1360-h1020-rw'),

('Gedung RA Kartini', 'Gedung Fakultas Hukum Pascasarjana', 'Klaster Fakultas Hukum', 3, 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFVIJBJOJTg_3lSkBco74Dee_FmZP8EyNMLbUleJAwf-6ZavcUyBtiz8lAimtSVsoqgJq0OKJ1plzSNSrejeDDZ8yMNX13A_a_uW0-Qr4oZzn_kGUmqFO6mYtuwSble9OmiH892Zw=s1360-w1360-h1020-rw'),

('Gedung Parkir Depan UPNVJ', 'Gedung parkir bertingkat untuk kendaraan mahasiswa dan staf', 'Sisi depan kampus', 4, 'https://www.upnvj.ac.id/id/files/large/8bc605d9f811bf6fe60a23c2e0626ea0'),

('Area Parkir Depan UPNVJ', 'Area parkir terbuka untuk kendaraan mahasiswa dan staf', 'Sisi depan kampus', NULL, 'https://www.upnvj.ac.id/id/files/thumb/65f06b5d1b2ab2a6603d3018c6c91b43/520'),

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
(nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, lantai, foto_url, id_gedung, unity_object_name)
VALUES

(
    'Ruang Kelas 201',
    'Ruang kelas perkuliahan mahasiswa Fakultas Ekonomi dan Bisnis di Gedung Moh. Husni Thamrin lantai 2, dilengkapi proyektor, papan tulis, dan AC untuk kenyamanan kegiatan belajar mengajar.',
    'Ruang Kelas',
    2,
    NULL,
    7,
    'mht_201'
),

(
    'Ruang Kelas 202',
    'Ruang kelas perkuliahan mahasiswa Fakultas Ekonomi dan Bisnis di Gedung Moh. Husni Thamrin lantai 2, digunakan untuk berbagai mata kuliah program sarjana dan magister FEB.',
    'Ruang Kelas',
    2,
    NULL,
    7,
    'mht_202'
),

(
    'Ruang Dosen Ilmu Ekonomi',
    'Ruang kerja dosen Program Studi Ilmu Ekonomi FEB.',
    'Ruang Dosen',
    2,
    NULL,
    7,
    NULL
),

(
    'Ruang Dosen Manajemen Program Sarjana',
    'Ruang kerja dosen Program Studi Manajemen jenjang sarjana FEB.',
    'Ruang Dosen',
    2,
    NULL,
    7,
    NULL
),

(
    'Ruang Sekretariat Program Studi Manajemen dan Akuntansi Program Magister',
    'Ruang administrasi dan sekretariat Program Magister Manajemen dan Akuntansi FEB.',
    'Ruang Administrasi',
    2,
    NULL,
    7,
    NULL
),

(
    'Ruang Kelas 203',
    'Ruang kelas perkuliahan mahasiswa FEB di lantai 2, dilengkapi fasilitas multimedia dan kapasitas memadai untuk mendukung perkuliahan ekonomi, bisnis, dan manajemen.',
    'Ruang Kelas',
    2,
    NULL,
    7,
    'mht_203'
),

(
    'Ruang Kelas 204',
    'Ruang kelas perkuliahan mahasiswa FEB di lantai 2, digunakan untuk kuliah reguler dengan fasilitas proyektor dan sistem audio yang mendukung presentasi akademik.',
    'Ruang Kelas',
    2,
    NULL,
    7,
    'mht_204'
),

(
    'Ruang Kelas 205',
    'Ruang kelas perkuliahan mahasiswa FEB di lantai 2, digunakan untuk kegiatan belajar mengajar dengan fasilitas lengkap termasuk proyektor, papan tulis, dan AC.',
    'Ruang Kelas',
    2,
    NULL,
    7,
    'mht_205'
),

(
    'Ruang Kelas 206',
    'Ruang kelas perkuliahan mahasiswa FEB di lantai 2, digunakan untuk perkuliahan reguler mata kuliah program sarjana maupun magister FEB UPNVJ.',
    'Ruang Kelas',
    2,
    NULL,
    7,
    'mht_206'
),

(
    'Ruang Kelas 207',
    'Ruang kelas perkuliahan mahasiswa FEB di lantai 2, dilengkapi tata ruang yang mendukung diskusi kelompok dan presentasi untuk mengakomodasi berbagai metode pembelajaran aktif.',
    'Ruang Kelas',
    2,
    NULL,
    7,
    'mht_207'
),
-- LANTAI 3

(
    'Ruang Kelas 301',
    'Ruang kelas perkuliahan mahasiswa Fakultas Ekonomi dan Bisnis di Gedung Moh. Husni Thamrin lantai 3, dilengkapi fasilitas multimedia dan sistem AC untuk kenyamanan perkuliahan.',
    'Ruang Kelas',
    3,
    NULL,
    7,
    'mht_301'
),

(
    'Ruang Kelas 302',
    'Laboratorium Ilmu Ekonomi untuk kegiatan praktikum dan pembelajaran mahasiswa FEB.',
    'Laboratorium',
    3,
    NULL,
    7,
    NULL
),

(
    'Ruang Kelas 303',
    'Ruang kelas perkuliahan mahasiswa FEB di lantai 3, digunakan untuk kegiatan belajar mengajar berbagai mata kuliah program sarjana FEB dengan fasilitas proyektor dan papan tulis.',
    'Ruang Kelas',
    3,
    NULL,
    7,
    'mht_303'
),

(
    'Ruang Kelas 304',
    'Ruang kelas perkuliahan mahasiswa FEB di lantai 3, dilengkapi perangkat audio-visual dan kapasitas memadai untuk mendukung perkuliahan ekonomi, akuntansi, dan manajemen.',
    'Ruang Kelas',
    3,
    NULL,
    7,
    'mht_304'
),

(
    'Ruang Kelas 305',
    'Ruang kelas perkuliahan mahasiswa FEB di lantai 3, digunakan untuk kegiatan kuliah reguler dengan sistem multimedia terintegrasi untuk presentasi dan diskusi akademik.',
    'Ruang Kelas',
    3,
    NULL,
    7,
    'mht_305'
),

(
    'Ruang Kelas 306',
    'Ruang kelas perkuliahan mahasiswa FEB di lantai 3, digunakan untuk berbagai mata kuliah dengan fasilitas proyektor, papan tulis, dan tempat duduk yang nyaman.',
    'Ruang Kelas',
    3,
    NULL,
    7,
    'mht_306'
),

(
    'Ruang Kelas 307',
    'Ruang kelas perkuliahan mahasiswa FEB di lantai 3, dilengkapi fasilitas lengkap untuk mendukung proses pembelajaran aktif, presentasi kelompok, dan diskusi mata kuliah.',
    'Ruang Kelas',
    3,
    NULL,
    7,
    'mht_307'
),

(
    'Mash Classroom',
    'Ruang pembelajaran modern untuk kegiatan akademik mahasiswa FEB.',
    'Ruang Kelas',
    3,
    NULL,
    7,
    NULL
),

(
    'Laboratorium Akuntansi 2',
    'Laboratorium untuk kegiatan praktikum akuntansi mahasiswa FEB.',
    'Laboratorium',
    3,
    NULL,
    7,
    NULL
),

-- LANTAI 4

(
    'Ruang Kelas D.401',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    4,
    NULL,
    7,
    NULL
),

(
    'Ruang Kelas D.402',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    4,
    NULL,
    7,
    NULL
),

(
    'Ruang Kelas D.403',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    4,
    NULL,
    7,
    NULL
),

(
    'Ruang Kelas D.404',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    4,
    NULL,
    7,
    NULL
),

(
    'Ruang Kelas C.402',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    4,
    NULL,
    7,
    NULL
),

(
    'Ruang Kelas C.403',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    4,
    NULL,
    7,
    NULL
),

(
    'Ruang Kelas C.404',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    4,
    NULL,
    7,
    NULL
),

(
    'Ruang Kelas C.405',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    4,
    NULL,
    7,
    NULL
),

(
    'Ruang Kelas C.406',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    4,
    NULL,
    7,
    NULL
),

(
    'Ruang Kelas C.407',
    'Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.',
    'Ruang Kelas',
    4,
    NULL,
    7,
    NULL
),
(
    'Mushola FEB',
    'Fasilitas mushola untuk kegiatan ibadah mahasiswa FEB.',
    'Tempat Ibadah',
    4,
    NULL,
    7,
    NULL
),
(
    'Mini Company',
    'Fasilitas simulasi perusahaan untuk praktik kewirausahaan dan bisnis mahasiswa FEB.',
    'Laboratorium Bisnis',
    3,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/WhatsApp-Image-2022-04-21-at-11.41.31.jpeg',
    7,
    NULL
),

(
    'Sibuni',
    'Sistem bisnis universitas yang digunakan untuk pengembangan praktik bisnis dan kewirausahaan mahasiswa.',
    'Laboratorium Bisnis',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/WhatsApp-Image-2022-04-21-at-11.41.28.jpeg',
    7,
    NULL
),

(
    'Bank Mini',
    'Laboratorium praktik perbankan untuk mahasiswa program studi keuangan dan perbankan.',
    'Laboratorium',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/WhatsApp-Image-2022-04-21-at-11.42.51.jpeg',
    7,
    NULL
),

(
    'Lembaga Kajian Ekonomi dan Bisnis',
    'Fasilitas penelitian dan pengkajian ekonomi serta bisnis untuk dosen dan mahasiswa.',
    'Pusat Penelitian',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/IMG_6400.jpg',
    7,
    NULL
),

(
    'BI Corner',
    'Pojok literasi ekonomi dan keuangan hasil kerja sama dengan Bank Indonesia.',
    'Perpustakaan',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-16-at-10.15.43_b7572c4f.jpg',
    7,
    NULL
),

(
    'Selasar FEB',
    'Area terbuka untuk diskusi, kegiatan mahasiswa, dan interaksi akademik.',
    'Area Mahasiswa',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/IMG_4518.jpg',
    7,
    NULL
),

(
    'Aula BEJ',
    'Aula kegiatan seminar, workshop, dan acara akademik Fakultas Ekonomi dan Bisnis.',
    'Aula',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/IMG_6394.jpg',
    7,
    NULL
),

(
    'Ruang Kelas',
    'Ruang perkuliahan reguler untuk kegiatan belajar mengajar mahasiswa FEB.',
    'Ruang Akademik',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/IMG_6397.jpg',
    7,
    NULL
),

(
    'Ruang Kelas Magister',
    'Ruang kelas khusus program magister Fakultas Ekonomi dan Bisnis.',
    'Ruang Akademik',
    2,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/01/IMG_9968.jpg',
    7,
    NULL
),

(
    'Sekretariat Magister',
    'Ruang administrasi dan pelayanan akademik program magister FEB.',
    'Administrasi',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2024-05-17-at-14.30.40_dd6f3fff-1.jpg',
    7,
    NULL
),

(
    'Ruang Kelas Doktoral',
    'Ruang pembelajaran untuk program doktoral di lingkungan FEB.',
    'Ruang Akademik',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/06/IMG_5228.jpg',
    7,
    NULL
),

(
    'Sekretariat Doktoral',
    'Fasilitas administrasi dan layanan akademik program doktoral FEB.',
    'Administrasi',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/06/IMG_5222.jpg',
    7,
    NULL
),

(
    'Laboratorium Akuntansi dan Komputasi',
    'Laboratorium untuk praktik akuntansi komputer dan pengolahan data bisnis.',
    'Laboratorium Komputer',
    NULL,
    'https://feb.upnvj.ac.id/struktur-organisasi/',
    7,
    NULL
),

(
    'Laboratorium Ilmu Ekonomi dan Manajemen',
    'Laboratorium penunjang pembelajaran ekonomi dan manajemen berbasis teknologi.',
    'Laboratorium',
    NULL,
    'https://feb.upnvj.ac.id/struktur-organisasi/',
    7,
    NULL
),

-- FK


-- =========================
-- GEDUNG ID 3
-- =========================
(
    'Ruang Ilmu Kesehatan Matra (UPNVERI)',
    'Ruang pelayanan dan administrasi bidang Ilmu Kesehatan Matra (UPNVERI) yang mengelola program pendidikan terkait kesehatan militer dan ketahanan fisik dalam kondisi ekstrem, sebagai bagian dari kekhasan Fakultas Kedokteran UPNVJ yang berciri bela negara.',
    'Administrasi & Layanan',
    1,
    NULL,
    3,
    'wsh_upnveri'
),
(
    'Ruang Medical Quality Assurance (MQA) UPNVERI',
    'Ruang penjaminan mutu pendidikan kedokteran yang bertanggung jawab memantau, mengevaluasi, dan meningkatkan standar kualitas proses akademik serta layanan pendidikan di Fakultas Kedokteran UPNVJ sesuai regulasi nasional dan internasional.',
    'Administrasi & Layanan',
    1,
    NULL,
    3,
    'wsh_mqa'
),
(
    'Ruang Dosen FK UPNVJ',
    'Ruang kerja bersama dosen Fakultas Kedokteran UPNVJ yang dilengkapi meja kerja, fasilitas komputer, dan area konsultasi dengan mahasiswa.',
    'Administrasi & Layanan',
    1,
    NULL,
    3,
    'wsh_fk_dosen'
),

(
    'Pusat Stemcell & Tissue Engineering Research Centre',
    'Pusat riset unggulan FK UPNVJ di bidang sel punca (stem cell) dan rekayasa jaringan (tissue engineering), mendukung penelitian biomedis terkini untuk pengembangan terapi regeneratif.',
    'Laboratorium',
    1,
    NULL,
    3,
    'wsh_stemcell'
),

(
    'Ruang Akreditasi FK UPNVJ',
    'Ruang pengelolaan dan penyimpanan dokumen akreditasi Fakultas Kedokteran, termasuk koordinasi persiapan visitasi BAN-PT/LAMPTKes dan pengelolaan borang akreditasi program studi.',
    'Administrasi & Layanan',
    1,
    NULL,
    3,
    NULL
),

(
    'Ruang BEM FK UPNVJ',
    'Ruang sekretariat Badan Eksekutif Mahasiswa Fakultas Kedokteran sebagai pusat koordinasi kegiatan kemahasiswaan, pengabdian masyarakat, dan kegiatan sosial-akademik mahasiswa FK.',
    'Administrasi & Layanan',
    1,
    NULL,
    3,
    'wsh_bem_fk'
),

(
    'Ruang Dekan FK UPNVJ',
    'Ruang kerja resmi Dekan Fakultas Kedokteran UPNVJ, digunakan untuk kegiatan pimpinan, audiensi tamu, dan pengambilan keputusan strategis fakultas.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    'wsh_dekan'
),

(
    'Ruang Wakil Dekan Bidang Akademik',
    'Ruang kerja Wakil Dekan I Bidang Akademik FK UPNVJ, bertanggung jawab atas pengelolaan kurikulum, penjadwalan, dan pengembangan mutu akademik program studi.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    'wsh_wd1'
),

(
    'Ruang Wakil Dekan Bidang Umum dan Keuangan',
    'Ruang kerja Wakil Dekan II Bidang Umum dan Keuangan FK UPNVJ, mengurus pengelolaan anggaran, aset, dan sumber daya manusia di lingkungan fakultas.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    'wsh_wd2'
),

(
    'Ruang Wakil Dekan Bidang Kemahasiswaan dan Kerjasama',
    'Ruang kerja Wakil Dekan III Bidang Kemahasiswaan dan Kerjasama FK UPNVJ, mengelola pembinaan mahasiswa, kegiatan ekstrakurikuler, beasiswa, serta kerja sama dengan institusi lain.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    'wsh_wd3'
),
(
    'Ruang MITEK',
    'Ruang MITEK yang menjadi pusat inovasi teknologi dan keunggulan akademik Fakultas Kedokteran UPNVJ, meliputi fasilitas laboratorium canggih, ruang simulasi klinis, dan area kolaborasi riset untuk mahasiswa serta dosen dalam mengembangkan solusi kesehatan berbasis teknologi.',
    'Laboratorium',
    2,
    NULL,
    3,
    'wsh_mitek'
),
(
    'Ruang Rapat Lantai 2',
    'Ruang rapat lantai 2 Fakultas Kedokteran, digunakan untuk kegiatan rapat dan diskusi.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    'wsh_rapat_2'
),
(
    'Ruang Prodi Profesi',
    'Ruang prodi Fakultas Kedokteran, digunakan untuk kegiatan rapat dan diskusi.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    'wsh_rapat_2'
),
(
    'Ruang Sekretariat Tata Usaha FK UPNVJ',
    'Pusat layanan administrasi dan tata usaha Fakultas Kedokteran, menangani surat-menyurat, legalisir dokumen akademik, dan layanan administrasi bagi mahasiswa serta dosen.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    NULL
),

(
    'Ruang Administrasi Keuangan FK UPNVJ',
    'Ruang pengelolaan keuangan Fakultas Kedokteran, meliputi pembayaran biaya pendidikan, pengelolaan anggaran operasional, dan pelaporan keuangan fakultas.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    NULL
),

(
    'Medical Education Unit (MEU)',
    'Unit yang bertanggung jawab atas pengembangan dan inovasi kurikulum pendidikan kedokteran, pelatihan metode pembelajaran berbasis masalah (PBL), dan evaluasi mutu pendidikan FK.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    NULL
),

(
    'Medical Research Unit (MRU)',
    'Unit yang mengelola dan memfasilitasi kegiatan penelitian medis dosen dan mahasiswa FK, mulai dari penyusunan proposal, etik penelitian, hingga publikasi hasil riset di jurnal ilmiah.',
    'Laboratorium',
    2,
    NULL,
    3,
    NULL
),

(
    'Medical Assessment Unit (MAU)',
    'Unit yang bertanggung jawab merancang dan mengelola sistem evaluasi dan asesmen kompetensi mahasiswa kedokteran, termasuk ujian tulis, OSCE, dan ujian kompetensi dokter.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    NULL
),

(
    'Medical Quality Assurance (MQA)',
    'Unit penjaminan mutu internal FK yang memantau dan mengevaluasi standar proses pendidikan, penelitian, dan pengabdian masyarakat agar sesuai dengan standar nasional dan internasional pendidikan kedokteran.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    NULL
),

(
    'Ruang Rapat Dekan dan Fakultas Kedokteran',
    'Ruang rapat resmi yang digunakan untuk pertemuan pimpinan fakultas, rapat koordinasi departemen, serta rapat bersama tamu dan mitra institusi FK UPNVJ.',
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    NULL
),

(
    'Auditorium Fakultas Kedokteran',
    'Auditorium berkapasitas sekitar 200 orang, digunakan untuk kegiatan seminar ilmiah, wisuda profesi dokter, kuliah umum, dan berbagai acara akademik berskala besar FK UPNVJ.',
    'Auditorium & Aula',
    3,
    NULL,
    3,
    NULL
),

(
    'Laboratorium Biologi Molekuler',
    'Laboratorium canggih untuk praktikum dan penelitian di bidang biologi molekuler, mencakup teknik PCR, elektroforesis, kloning gen, dan analisis DNA/RNA untuk keperluan akademik dan riset medis.',
    'Laboratorium',
    3,
    NULL,
    3,
    NULL
),

(
    'Laboratorium Biokimia',
    'Laboratorium untuk praktikum mata kuliah biokimia, dilengkapi peralatan spektrofotometer, sentrifuge, dan reagen kimia untuk analisis enzim, metabolit, dan komponen biokimia tubuh manusia.',
    'Laboratorium',
    3,
    NULL,
    3,
    NULL
),

(
    'Laboratorium Patologi Klinik',
    'Laboratorium untuk praktikum pemeriksaan laboratorium klinik, meliputi hematologi, kimia darah, urinalisis, dan mikrobiologi, sebagai bekal kompetensi diagnostik mahasiswa kedokteran.',
    'Laboratorium',
    3,
    NULL,
    3,
    NULL
),

(
    'Laboratorium IKK/IKM',
    'Laboratorium Ilmu Kesehatan Komunitas dan Ilmu Kesehatan Masyarakat, digunakan untuk analisis data epidemiologi, survei kesehatan, dan penelitian berbasis komunitas sebagai penerapan kedokteran keluarga dan preventif.',
    'Laboratorium',
    3,
    NULL,
    3,
    NULL
),

(
    'Ruang Diskusi FK',
    'Ruang diskusi terbuka untuk kegiatan tutorial Problem Based Learning (PBL), diskusi kelompok kecil mahasiswa, dan konsultasi akademik antara mahasiswa dengan dosen pembimbing.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    3,
    NULL
),

-- =========================
-- GEDUNG ID 4
-- =========================

(
    'Perpustakaan FK UPNVJ',
    'Perpustakaan khusus Fakultas Kedokteran yang dilengkapi ruang baca, koleksi buku teks kedokteran, e-library, akses jurnal internasional, koneksi WiFi/hotspot, dan layanan internet untuk mendukung kegiatan akademik dan penelitian.',
    'Perpustakaan & Ruang Baca',
    1,
    NULL,
    4,
    NULL
),

(
    'Laboratorium Komputer FK',
    'Laboratorium komputer Fakultas Kedokteran yang dilengkapi 150 unit komputer terhubung internet, digunakan untuk ujian berbasis komputer (CBT), e-learning, dan praktikum berbasis teknologi informasi kesehatan.',
    'Laboratorium',
    1,
    NULL,
    4,
    NULL
),

(
    'Laboratorium Histologi',
    'Laboratorium Departemen Histologi untuk praktikum pengamatan jaringan tubuh menggunakan mikroskop, meliputi identifikasi sel, jaringan epitel, jaringan ikat, otot, dan saraf secara preparat histologis.',
    'Laboratorium',
    1,
    NULL,
    4,
    NULL
),

(
    'Laboratorium Patologi Anatomi',
    'Laboratorium Departemen Patologi Anatomi untuk praktikum dan penelitian pemeriksaan jaringan dan sel secara makroskopik dan mikroskopik, mendukung diagnosis penyakit berbasis pemeriksaan patologi.',
    'Laboratorium',
    1,
    NULL,
    4,
    NULL
),

(
    'Ruang Tutorial FK',
    'Terdiri dari 16 ruang diskusi kelompok kecil yang digunakan dalam proses pembelajaran berbasis masalah (Problem Based Learning/PBL), tempat mahasiswa berdiskusi dipandu seorang tutor dosen.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    4,
    NULL
),

(
    'Ruang Tutor Meeting',
    'Ruang khusus untuk pertemuan dan koordinasi antar tutor dosen, serta digunakan untuk observasi dan monitoring proses jalannya tutorial secara langsung.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    4,
    NULL
),

(
    'Skills Lab FK',
    'Laboratorium keterampilan klinis yang dilengkapi ruang coaching, mannequin, dan station OSCE (Objective Structured Clinical Examination) untuk melatih mahasiswa dalam prosedur klinis seperti pemeriksaan fisik, pemasangan infus, dan tindakan medis dasar.',
    'Laboratorium',
    3,
    NULL,
    4,
    NULL
),

(
    'Ruang Introduction A dan B',
    'Dua ruang pengenalan pembelajaran berkapasitas 75–100 mahasiswa, digunakan untuk briefing sebelum kegiatan praktikum, pengarahan materi blok, dan kuliah pengantar topik medis.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    4,
    NULL
),

(
    'Gudang Mannequin Skills Lab',
    'Gudang penyimpanan mannequin dan alat peraga keterampilan medis yang digunakan dalam praktikum Skills Lab, termasuk boneka simulasi, phantom, dan perlengkapan tindakan klinis.',
    'Laboratorium',
    3,
    NULL,
    4,
    NULL
),

(
    'Ruang Administrasi Skills Lab',
    'Ruang pengelolaan jadwal, pendaftaran, dan administrasi kegiatan Skills Lab, termasuk koordinasi pelaksanaan ujian OSCE dan peminjaman alat keterampilan medis.',
    'Administrasi & Layanan',
    3,
    NULL,
    4,
    NULL
),

(
    'Ruang Instruktur Skills Lab',
    'Ruang persiapan dan istirahat instruktur Skills Lab, digunakan untuk koordinasi teknis sebelum praktikum dan evaluasi pelaksanaan kegiatan keterampilan klinis mahasiswa.',
    'Administrasi & Layanan',
    3,
    NULL,
    4,
    NULL
),

(
    'Mushola FK',
    'Fasilitas ibadah sholat bagi mahasiswa, dosen, dan staf civitas akademika Fakultas Kedokteran, dilengkapi tempat wudhu dan perlengkapan ibadah.',
    'Tempat Ibadah',
    3,
    NULL,
    4,
    NULL
),

(
    'Ruang Lecture A dan B',
    'Dua ruang kuliah berkapasitas sekitar 190 orang, dilengkapi LCD proyektor, sistem audio, dan tempat duduk bertingkat, digunakan untuk kuliah pleno dan perkuliahan skala besar mahasiswa FK.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    4,
    NULL
),

(
    'Ruang Seminar FK',
    'Ruang seminar berkapasitas sekitar 40 orang, digunakan untuk presentasi hasil penelitian, seminar proposal tesis, seminar ilmiah dosen, dan kegiatan diskusi akademik terbatas di lingkungan FK.',
    'Auditorium & Aula',
    4,
    NULL,
    4,
    NULL
),

(
    'Hall FK',
    'Area hall yang berfungsi sebagai ruang tunggu dan area pendukung perluasan Ruang Lecture, digunakan untuk pameran poster ilmiah, registrasi peserta acara, dan kegiatan informal akademik.',
    'Auditorium & Aula',
    4,
    NULL,
    4,
    NULL
),

(
    'Ruang Transit Dosen',
    'Ruang transit dan istirahat dosen yang digunakan sebagai tempat persiapan sebelum mengajar, menyimpan barang, serta berdiskusi singkat antar dosen sebelum atau setelah kegiatan perkuliahan.',
    'Administrasi & Layanan',
    4,
    NULL,
    4,
    NULL
),

-- =========================
-- GEDUNG ID 5
-- =========================

(
    'Ruangan Lab Anatomi 1',
    'Laboratorium anatomi Departemen Anatomi Fakultas Kedokteran, digunakan untuk praktikum identifikasi struktur tubuh manusia menggunakan kadaver, model anatomi, dan atlas, sebagai dasar ilmu kedokteran klinik.',
    'Laboratorium',
    1,
    NULL,
    5,
    'ars_1_lab_anatomi'
),
(
    'Departemen Anatomi',
    'Ruang kantor dan koordinasi Departemen Anatomi FK UPNVJ, tempat dosen anatomi berkegiatan, menyimpan referensi, menyusun materi ajar, dan melakukan riset di bidang ilmu anatomi manusia.',
    'Laboratorium',
    1,
    NULL,
    5,
    'ars_anatomi'
),
(
    'Ruangan Badan Pengelola Usaha (BPU)',
    'Ruang kantor Badan Pengelola Usaha (BPU) UPNVJ yang bertanggung jawab mengelola aset dan unit usaha komersial universitas guna mendukung kemandirian finansial institusi.',
    'Administrasi & Layanan',
    1,
    NULL,
    5,
    'ars_bpu'
),
(
    'Departemen Fisiologi',
    'Ruang kantor dan koordinasi Departemen Fisiologi FK UPNVJ, tempat dosen fisiologi berdiskusi, menyusun kurikulum, dan melakukan riset tentang fungsi dan mekanisme kerja sistem tubuh manusia.',
    'Laboratorium',
    1,
    NULL,
    5,
    'ars_lab_fisiologi'
),
(
    'Ruang Kelas 201',
    'Ruang kelas perkuliahan mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 2, dilengkapi proyektor, papan tulis, dan tempat duduk untuk proses belajar mengajar.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    5,
    'ars_201'
),
(
    'Ruangan Gugus Kendali Mutu',
    'Ruang koordinasi tim Gugus Kendali Mutu (GKM) yang bertugas memantau dan meningkatkan standar mutu akademik dan non-akademik di lingkungan Gedung Abdul Rahman Saleh FK UPNVJ.',
    'Administrasi & Layanan',
    2,
    NULL,
    5,
    'ars_gkm_2'
),
(
    'Ruang Dosen',
    'Ruang kerja bersama dosen FK UPNVJ di Gedung Abdul Rahman Saleh, digunakan untuk persiapan mengajar, bimbingan akademik mahasiswa, dan kegiatan akademik dosen sehari-hari.',
    'Administrasi & Layanan',
    2,
    NULL,
    5,
    'ars_dosen'
),
(
    'Ruang Server Wifi',
    'Ruang teknis penyimpanan perangkat server dan infrastruktur jaringan Wi-Fi kampus, bertanggung jawab menjaga konektivitas internet di seluruh area Gedung Abdul Rahman Saleh.',
    'Administrasi & Layanan',
    2,
    NULL,
    5,
    'ars_server'
),
(
    'Ruang Mushola',
    'Fasilitas tempat ibadah sholat bagi mahasiswa dan dosen di Gedung Abdul Rahman Saleh, dilengkapi tempat wudhu, sajadah, dan mukena untuk kenyamanan beribadah selama kegiatan kampus.',
    'Tempat Ibadah',
    2,
    NULL,
    5,
    'ars_mushola'
),
(
    'Ruang Konseling & Bimbingan Karir',
    'Ruang layanan konseling psikologis dan bimbingan perencanaan karir bagi mahasiswa, difasilitasi konselor profesional untuk membantu mahasiswa mengatasi permasalahan akademik, personal, dan mempersiapkan masa depan karir.',
    'Administrasi & Layanan',
    2,
    NULL,
    5,
    'ars_konseling'
),
(
    'Ruang UKM EOS',
    'Ruang sekretariat Unit Kegiatan Mahasiswa EOS (Equator of Science) FK UPNVJ, digunakan sebagai pusat koordinasi kegiatan ilmiah, penelitian, dan kompetisi akademik mahasiswa kedokteran.',
    'Administrasi & Layanan',
    2,
    NULL,
    5,
    'ars_ukm_eos'
),
(
    'Ruang BEM FISIP',
    'Ruang sekretariat Badan Eksekutif Mahasiswa FISIP yang berada di Gedung Abdul Rahman Saleh, digunakan untuk koordinasi program kerja, rapat, dan kegiatan kemahasiswaan FISIP.',
    'Administrasi & Layanan',
    2,
    NULL,
    5,
    'ars_bem_fisip'
),
(
    'Ruang HIMASIFO',
    'Ruang sekretariat Himpunan Mahasiswa Sistem Informasi (HIMASIFO) UPNVJ, berfungsi sebagai pusat koordinasi kegiatan organisasi, program kerja, dan pengembangan mahasiswa Sistem Informasi.',
    'Administrasi & Layanan',
    2,
    NULL,
    5,
    'ars_himasifo'
),
(
    'Ruang Kelas 301',
    'Ruang kelas perkuliahan untuk mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 3, dilengkapi proyektor, papan tulis, dan AC untuk kenyamanan belajar mengajar.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    5,
    'ars_301'
),
(
    'Ruang Kelas 302',
    'Ruang kelas perkuliahan untuk mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 3, dilengkapi proyektor, papan tulis, dan AC untuk kenyamanan belajar mengajar.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    5,
    'ars_302'
),
(
    'Ruang Kelas 303',
    'Ruang kelas perkuliahan untuk mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 3, dilengkapi proyektor, papan tulis, dan AC untuk kenyamanan belajar mengajar.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    5,
    'ars_303'
),
(
    'Ruang Kelas 304',
    'Ruang kelas perkuliahan untuk mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 3, dilengkapi proyektor, papan tulis, dan AC untuk kenyamanan belajar mengajar.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    5,
    'ars_304'
),
(
    'Ruang Kelas 305',
    'Ruang kelas perkuliahan untuk mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 3, dilengkapi proyektor, papan tulis, dan AC untuk kenyamanan belajar mengajar.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    5,
    'ars_305'
),
(
    'Ruang Kelas 306',
    'Ruang kelas perkuliahan untuk mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 3, dilengkapi proyektor, papan tulis, dan AC untuk kenyamanan belajar mengajar.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    5,
    'ars_306'
),
(
    'Ruang Kelas 307',
    'Ruang kelas perkuliahan untuk mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 3, dilengkapi proyektor, papan tulis, dan AC untuk kenyamanan belajar mengajar.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    5,
    'ars_307'
),
(
    'Gudang lantai 3',
    'Gudang penyimpanan peralatan, perlengkapan laboratorium, dan inventaris Fakultas Kedokteran yang berlokasi di lantai 3 Gedung Abdul Rahman Saleh.',
    'Administrasi & Layanan',
    3,
    NULL,
    5,
    'ars_3_gudang'
),
(
    'Ruang Tutorial Gedung Abdul Rahman Saleh',
    'Tiga ruang tutorial untuk kegiatan diskusi kelompok kecil dalam metode PBL (Problem Based Learning), digunakan mahasiswa FK bersama tutor dosen untuk membahas kasus dan skenario klinis.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    5,
    NULL
),
(
    'Ruang Kelas 401',
    'Ruang kelas perkuliahan untuk mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 4, dilengkapi fasilitas audio-visual dan tempat duduk yang memadai.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    5,
    'ars_401'
),
(
    'Ruang Kelas 402',
    'Ruang kelas perkuliahan untuk mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 4, dilengkapi fasilitas audio-visual dan tempat duduk yang memadai.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    5,
    'ars_402'
),

(
    'Ruang Kelas 403',
    'Ruang kelas perkuliahan untuk mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 4, dilengkapi fasilitas audio-visual dan tempat duduk yang memadai.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    5,
    'ars_403'
),

(
    'Ruang Kelas 404',
    'Ruang kelas perkuliahan untuk mahasiswa Fakultas Kedokteran di Gedung Abdul Rahman Saleh lantai 4, dilengkapi fasilitas audio-visual dan tempat duduk yang memadai.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    5,
    'ars_404'
),

(
    'Gudang lantai 4',
    'Gudang penyimpanan peralatan dan perlengkapan OSCE Center serta inventaris FK yang berlokasi di lantai 4 Gedung Abdul Rahman Saleh.',
    'Administrasi & Layanan',
    4,
    NULL,
    5,
    'ars_4_gudang'
),
(
    'OSCE Center FKUPN',
    'Pusat ujian OSCE (Objective Structured Clinical Examination) berstandar nasional dengan 24 ruang ujian, ruang control panel, dan gudang manekin, digunakan untuk asesmen kompetensi klinis mahasiswa kedokteran secara komprehensif.',
    'Laboratorium',
    4,
    NULL,
    5,
    NULL
),

(
    'Ruang Alumni I',
    'Ruang kegiatan dan pertemuan alumni Fakultas Kedokteran UPNVJ, digunakan untuk networking, seminar alumni, dan koordinasi Ikatan Alumni (IKA) FK UPNVJ.',
    'Administrasi & Layanan',
    4,
    NULL,
    5,
    NULL
),

(
    'Ruang Peserta Alumni FK UPNVJ',
    'Ruang yang diperuntukkan bagi peserta dan anggota alumni FK UPNVJ untuk berkumpul, berdiskusi, dan mengikuti berbagai kegiatan yang diselenggarakan oleh ikatan alumni fakultas.',
    'Administrasi & Layanan',
    4,
    NULL,
    5,
    NULL
),

(
    'Ruang Komisi Etik',
    'Ruang kegiatan Komisi Etik Penelitian Kesehatan FK UPNVJ, bertugas melakukan telaah etik terhadap protokol penelitian yang melibatkan subjek manusia sesuai standar etika penelitian biomedis nasional dan internasional.',
    'Administrasi & Layanan',
    4,
    NULL,
    5,
    NULL
),

-- FIK

-- =========================
-- GEDUNG KI HADJAR DEWANTARA (id = 6)
-- =========================
(
    'Ruang Kuliah 203 Ki Hadjar Dewantara',
    'Ruang perkuliahan mahasiswa Fakultas Ilmu Komputer di Gedung Ki Hadjar Dewantara lantai 2, dilengkapi proyektor, papan tulis digital, dan kapasitas tempat duduk yang memadai untuk pembelajaran teori dan praktikum.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    6,
    'khd_203'
),

(
    'Ruang Kuliah 202 Ki Hadjar Dewantara',
    'Ruang perkuliahan mahasiswa Fakultas Ilmu Komputer di Gedung Ki Hadjar Dewantara lantai 2, digunakan untuk kuliah teori maupun diskusi kelompok dengan fasilitas multimedia yang terintegrasi.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    6,
    'khd_202'
),

(
    'Selasar Lantai 1',
    'Area selasar terbuka di lantai 1 Gedung Ki Hadjar Dewantara yang digunakan sebagai ruang tunggu, area transit mahasiswa, dan lokasi berbagai pameran atau kegiatan informal Fakultas Ilmu Komputer.',
    'Administrasi & Layanan',
    1,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/09/WhatsApp-Image-2024-09-26-at-16.06.50-1-1024x768.jpeg',
    6,
    NULL
),

(
    'Sekretariat Laboratorium',
    'Ruang sekretariat laboratorium yang berfungsi sebagai pusat administrasi dan koordinasi kegiatan laboratorium.',
    'Administrasi & Layanan',
    3,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-01-at-14.02.56-scaled.jpeg',
    6,
    NULL
),
(
    'Lab Immersive dan Multimedia',
    'Pusat praktikum dan penelitian di bidang pemrograman komputer dengan fasilitas komputer terbaru, internet berkecepatan tinggi, proyektor, dan papan tulis digital.',
    'Laboratorium',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-Programming-JPG.jpg',
    6,
    NULL
),

(
    'Ruang Podcast FIK',
    'Ruang podcast Fakultas Ilmu Komputer yang dilengkapi dengan peralatan rekaman audio dan video profesional, digunakan untuk produksi konten digital, wawancara, dan kegiatan penyiaran mahasiswa.',
    'Studio & Produksi Media',
    1,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2025/01/20241231_104651-scaled.jpg',
    6,
    NULL
),
(
    'Digital Library',
    'Perpustakaan digital Fakultas Ilmu Komputer yang menyimpan koleksi buku, jurnal, artikel, dan sumber informasi lainnya dalam bentuk digital.',
    'Perpustakaan & Ruang Baca',
    1,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2025/01/20241231_104651-scaled.jpg',
    6,
    NULL
),
(
    'Lab Cybersecurity dan Networking (304)',
    'Pusat praktikum dan penelitian bidang keamanan siber dengan perangkat keras canggih, perangkat lunak keamanan terkini, dan jaringan simulasi serangan siber.',
    'Laboratorium',
    3,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-Cybersecurity.jpeg',
    6,
    'khd_304_lab'
),
(
    'Lab Big Data dan Data Science(303)',
    'Pusat praktikum dan penelitian dalam bidang penambangan data dan ilmu data dengan komputer berkinerja tinggi dan perangkat lunak analisis data terkini.',
    'Laboratorium',
    3,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-Data-Mining-dan-Data-Science-JPG.jpg',
    6,
    'khd_303_lab'
),
(
    'Lab Artificial Intelligence dan Robotics(302)',
    'Pusat praktikum dan penelitian bidang kecerdasan buatan dengan fasilitas komputer berperforma tinggi, perangkat lunak AI terbaru, big data, dan machine learning.',
    'Laboratorium',
    3,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-Artificial-Intelligence-JPG.jpg',
    6,
    'khd_302_lab'
),
(
    'Lab Enterprise System',
    'Pusat praktikum dan penelitian bidang intelijen bisnis dengan komputer berperforma tinggi, perangkat lunak analitik terkini, dan platform visualisasi data.',
    'Laboratorium',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/WhatsApp-Image-2024-06-11-at-4.05.11-PM.jpeg',
    6,
    NULL
),
(
    'Lab E-Governance',
    'Pusat praktikum dan penelitian bidang manajemen basis data dengan komputer berperforma tinggi dan perangkat lunak database terkini seperti SQL Server, Oracle, dan MySQL.',
    'Laboratorium',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-Database.jpeg',
    6,
    NULL
),
(
    'Lab Internet of Things(401)',
    'Pusat kegiatan praktikum dan penelitian bidang teknologi IoT dengan sensor, mikrokontroler, modul komunikasi nirkabel, dan perangkat lunak pengembangan IoT terkini.',
    'Laboratorium',
    4,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2024/06/Lab-IoT-JPG.jpg',
    6,
    'khd_401_lab'
),
(
    'Lab Software Engineering(201)',
    'Pusat praktikum dan penelitian di bidang pemrograman komputer dengan komputer terbaru, internet berkecepatan tinggi, proyektor, dan papan tulis digital.',
    'Laboratorium',
    2,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-25-at-09.57.29-1-scaled.jpeg',
    6,
    'khd_201_lab'
),
(
    'Masjid',
    'Masjid di lingkungan kampus UPNVJ',
    'Tempat Ibadah',
    NULL,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2025/03/20250326_071225-1024x768.jpg',
    6,
    'masjid'
),

-- =========================
-- GEDUNG DEWI SARTIKA (id = 13)
-- =========================
(
    'Lapangan dan Alat Olahraga FIK',
    'Fasilitas Olahraga yang terletak di depan Gedung Dewi Sartika lantai 1.',
    'Olahraga',
    1,
    'https://new-fik.upnvj.ac.id/wp-content/uploads/2025/03/20250326_071558-768x576.jpg',
    13,
    NULL
),
(
    'Ruang UKM UBV',
    'Ruang sekretariat Unit Kegiatan Mahasiswa UBV (Unit Beladiri Veteran) di Gedung Dewi Sartika, digunakan untuk koordinasi latihan, rapat anggota, dan kegiatan bela diri mahasiswa UPNVJ.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_ubv'
),
(
    'Ruang UKM Sepak Bola',
    'Ruang sekretariat UKM Sepak Bola UPNVJ di Gedung Dewi Sartika, digunakan untuk rapat anggota, perencanaan program latihan, dan persiapan kompetisi sepak bola antar universitas.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_sepak_bola'
),
(
    'Ruang UKM Basket',
    'Ruang sekretariat UKM Basket UPNVJ di Gedung Dewi Sartika, digunakan untuk koordinasi program latihan, strategi pertandingan, dan administrasi tim basket mahasiswa.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_basket'
),
(
    'Ruang UKM UFO',
    'Ruang sekretariat UKM UFO (Unit Film dan Fotografi) UPNVJ, digunakan untuk koordinasi produksi film pendek, fotografi, dan berbagai kegiatan kreatif media visual mahasiswa.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_ufo'
),
(
    'Ruang UKM Catur',
    'Ruang sekretariat UKM Catur UPNVJ, digunakan untuk latihan, turnamen catur internal, dan persiapan kompetisi catur tingkat regional dan nasional.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_catur'
),
(
    'Ruang UKM Juijutsu',
    'Ruang sekretariat UKM Jujitsu UPNVJ, digunakan untuk koordinasi jadwal latihan seni bela diri jujitsu dan persiapan kejuaraan bela diri mahasiswa.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_juijutsu'
),
(
    'Ruang UKM Seni tari',
    'Ruang sekretariat UKM Seni Tari UPNVJ, digunakan untuk koordinasi latihan tari tradisional dan modern, serta persiapan pentas seni dan perlombaan tingkat nasional.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_seni_tari'
),
(
    'Ruang UKM Boxer',
    'Ruang sekretariat UKM Tinju/Boxing UPNVJ, digunakan untuk koordinasi program latihan tinju, jadwal sparring, dan persiapan kompetisi bela diri tingkat mahasiswa.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_boxer'
),
(
    'Ruang UKM Voli',
    'Ruang sekretariat UKM Voli UPNVJ, digunakan untuk koordinasi jadwal latihan bola voli dan persiapan pertandingan antar universitas.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_voli'
),
(
    'Ruang UKM Pencak Silat',
    'Ruang sekretariat UKM Pencak Silat UPNVJ, sebagai pusat koordinasi latihan pencak silat dan pengembangan atlet mahasiswa untuk kompetisi regional dan nasional.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_pencak_silat'
),
(
    'Ruang UKM MC',
    'Ruang sekretariat UKM Master of Ceremony (MC) UPNVJ, digunakan untuk pelatihan public speaking, teknik pembawa acara, dan koordinasi kegiatan seremonial universitas.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_mc'
),
(
    'Ruang UKM Bulu Tangkis',
    'Ruang sekretariat UKM Bulu Tangkis UPNVJ, digunakan untuk koordinasi program latihan bulu tangkis dan persiapan kejuaraan antar mahasiswa dan universitas.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_bulu_tangkis'
),
(
    'Ruang UKM Paduan Suara',
    'Ruang sekretariat UKM Paduan Suara UPNVJ, digunakan untuk latihan vokal, persiapan pentas musik, dan koordinasi kegiatan paduan suara dalam acara resmi universitas dan kompetisi paduan suara.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_paduan_suara'
),
(
    'Ruang UKM Protestan',
    'Ruang persekutuan dan kegiatan keagamaan mahasiswa Kristen Protestan UPNVJ, digunakan untuk ibadah, doa bersama, dan berbagai kegiatan rohani mahasiswa.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_protestan'
),
(
    'Ruang UKM Katolik',
    'Ruang persekutuan dan kegiatan keagamaan mahasiswa Katolik UPNVJ, digunakan untuk kegiatan rohani, doa bersama, retret, dan pembinaan iman mahasiswa Katolik.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_ukm_katolik'
),
(
    'Ruang BEM FIK',
    'Ruang sekretariat Badan Eksekutif Mahasiswa Fakultas Ilmu Komputer di Gedung Dewi Sartika, sebagai pusat koordinasi program kerja, rapat kabinet, dan kegiatan kemahasiswaan FIK UPNVJ.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_bem'
),
(
    'Ruang SENAT FIK',
    'Ruang kerja Senat Mahasiswa Fakultas Ilmu Komputer di Gedung Dewi Sartika, digunakan untuk sidang legislatif mahasiswa, penyusunan aturan kemahasiswaan, dan pengawasan program BEM FIK.',
    'Administrasi & Layanan',
    1,
    NULL,
    13,
    'ds_senat'
),
(
    'Ruang Kuliah 201 Dewi Sartika',
    'Ruang kuliah reguler mahasiswa Fakultas Ilmu Komputer di Gedung Dewi Sartika lantai 2, dilengkapi proyektor, papan tulis, AC, dan tempat duduk nyaman untuk proses belajar mengajar.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    13,
    'ds_201'
),
(
    'Ruang Kuliah 202 Dewi Sartika',
    'Ruang kuliah reguler mahasiswa Fakultas Ilmu Komputer di Gedung Dewi Sartika lantai 2, digunakan untuk perkuliahan teori, presentasi, dan diskusi kelompok dengan fasilitas multimedia.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    13,
    'ds_202'
),
(
    'Ruang Kuliah 203 Dewi Sartika',
    'Ruang kuliah reguler mahasiswa Fakultas Ilmu Komputer di Gedung Dewi Sartika lantai 2, digunakan untuk perkuliahan dan diskusi dengan sistem tata letak fleksibel yang mendukung metode pembelajaran aktif.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    13,
    'ds_203'
),
(
    'Ruang Kuliah 301',
    'Ruang kuliah mahasiswa Fakultas Ilmu Komputer di Gedung Dewi Sartika lantai 3, dilengkapi fasilitas proyektor dan papan tulis untuk mendukung perkuliahan teori dan praktikum dasar.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    13,
    'ds_301'
),
(
    'Ruang Kuliah 302',
    'Ruang kuliah mahasiswa Fakultas Ilmu Komputer di Gedung Dewi Sartika lantai 3, digunakan untuk perkuliahan dengan kapasitas memadai dan fasilitas multimedia yang mendukung pembelajaran berbasis teknologi.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    13,
    'ds_302'
),
(
    'Ruang Kuliah 303',
    'Ruang kuliah mahasiswa Fakultas Ilmu Komputer di Gedung Dewi Sartika lantai 3, dilengkapi perangkat presentasi dan konektivitas internet untuk mendukung pembelajaran berbasis digital.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    13,
    'ds_303'
),
(
    'Ruang Kuliah 401',
    'Ruang kuliah mahasiswa Fakultas Ilmu Komputer di Gedung Dewi Sartika lantai 4, dilengkapi fasilitas lengkap untuk mendukung perkuliahan teori dan presentasi mahasiswa.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    13,
    'ds_401'
),
(
    'Ruang Kuliah 402',
    'Ruang kuliah mahasiswa Fakultas Ilmu Komputer di Gedung Dewi Sartika lantai 4, digunakan untuk perkuliahan reguler dengan fasilitas proyektor, papan tulis, dan AC.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    13,
    'ds_402'
),
(
    'Ruang Kuliah 403(mesh room)',
    'Ruang kuliah inovatif dengan konsep Mesh Room di Gedung Dewi Sartika lantai 4, dirancang dengan tata ruang fleksibel dan teknologi digital interaktif untuk mendukung pembelajaran kolaboratif mahasiswa FIK.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    13,
    'ds_403_mesh'
),

-- FH

-- =========================
-- GEDUNG YOS SUDARSO (id = 9)
-- =========================
(
    'Ruang Dosen Yos Sudarso Lantai 1',
    'Ruang kerja dosen Fakultas Hukum di Gedung Yos Sudarso lantai 1, digunakan sebagai tempat konsultasi mahasiswa dengan dosen, persiapan bahan ajar, dan kegiatan akademik dosen sehari-hari.',
    'Administrasi & Layanan',
    1,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2023/11/RUANG-KONSENTRASI-2048x1536.png',
    9,
    NULL
),
(
    'Ruang Dosen Yos Sudarso Lantai 2',
    'Ruang kerja dosen Fakultas Hukum di Gedung Yos Sudarso lantai 2, dilengkapi fasilitas kerja individual dan area diskusi untuk bimbingan penelitian hukum dan penulisan skripsi mahasiswa.',
    'Administrasi & Layanan',
    2,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2021/03/f0fd3420-8e5e-433f-b7b8-2da5e898cb64.png',
    9,
    NULL
),
(
    'Ruang Administrasi Yos Sudarso',
    'Ruang administrasi akademik Fakultas Hukum UPNVJ di Gedung Yos Sudarso, melayani kebutuhan administrasi mahasiswa seperti surat keterangan aktif, transkrip nilai, dan layanan akademik lainnya.',
    'Administrasi & Layanan',
    1,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2021/03/54a42329-09bc-48a5-8ae2-0e7e5ee0bb26.png',
    9,
    NULL
),
(
    'Ruang Rapat Yos Sudarso Lantai 2',
    'Ruang rapat resmi Fakultas Hukum di Gedung Yos Sudarso lantai 2, digunakan untuk rapat dosen, koordinasi program studi, dan pertemuan dengan mitra atau tamu institusi.',
    'Administrasi & Layanan',
    2,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/06/IMG_5457.jpg',
    9,
    NULL
),
(
    'Ruang Podcast Yos Sudarso',
    'Studio podcast Fakultas Hukum di lantai 4 Gedung Yos Sudarso, dilengkapi peralatan rekaman audio-video profesional untuk produksi konten hukum digital, wawancara pakar, dan siaran akademik mahasiswa hukum.',
    'Studio & Produksi Media',
    4,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/RuangPODCAST-LT-4-768x599-HD.png',
    9,
    NULL
),
(
    'Ruang Praktik Peradilan Semu',
    'Ruang simulasi persidangan (moot court) Fakultas Hukum di lantai 4 Gedung Yos Sudarso, dirancang menyerupai ruang sidang pengadilan untuk melatih mahasiswa dalam praktik beracara, debat hukum, dan kompetisi peradilan semu.',
    'Ruang Kuliah & Akademik',
    4,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/RuangPODCAST-LT-4-768x599-HD.png',
    9,
    NULL
),
(
    'Smartclass Yos Sudarso Lantai 2',
    'Ruang kelas cerdas (smartclass) di lantai 2 Gedung Yos Sudarso, dilengkapi teknologi pembelajaran interaktif berbasis digital, papan tulis elektronik, dan sistem konektivitas nirkabel untuk perkuliahan hukum modern.',
    'Ruang Kuliah & Akademik',
    2,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2022/06/WhatsApp-Image-2022-06-06-at-11.16.52-1-768x576.jpeg',
    9,
    NULL
),
(
    'Smartclass Yos Sudarso Lantai 3',
    'Ruang kelas cerdas (smartclass) di lantai 3 Gedung Yos Sudarso, digunakan untuk perkuliahan berbasis teknologi dengan sistem presentasi interaktif dan akses materi digital secara real-time.',
    'Ruang Kuliah & Akademik',
    3,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2022/06/WhatsApp-Image-2022-06-06-at-11.16.52-1-768x576.jpeg',
    9,
    NULL
),
(
    'Ruang Baca Yos Sudarso',
    'Ruang baca Fakultas Hukum di lantai 3 Gedung Yos Sudarso, menyediakan koleksi literatur hukum, jurnal ilmiah, peraturan perundang-undangan, dan buku referensi untuk mendukung penelitian mahasiswa dan dosen.',
    'Perpustakaan & Ruang Baca',
    3,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-14-at-09.19.42.jpeg',
    9,
    NULL
),
(
    'Lab Perancangan Kontrak',
    'Laboratorium perancangan kontrak di lantai 2 Gedung Yos Sudarso, digunakan untuk praktikum drafting kontrak hukum bisnis, perjanjian internasional, dan simulasi negosiasi kontrak komersial oleh mahasiswa hukum.',
    'Laboratorium',
    2,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-14-at-09.20.39.jpeg',
    9,
    NULL
),
(
    'Selasar Kanan Yos Sudarso',
    'Area selasar di sisi kanan lantai 1 Gedung Yos Sudarso, berfungsi sebagai ruang sirkulasi, tempat interaksi mahasiswa, dan area menunggu di antara kegiatan perkuliahan.',
    'Administrasi & Layanan',
    1,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-14-at-09.19.43.jpeg',
    9,
    NULL
),
(
    'Selasar Kiri Yos Sudarso',
    'Area selasar di sisi kiri lantai 1 Gedung Yos Sudarso, digunakan sebagai koridor penghubung antar ruang dan area mahasiswa untuk berdiskusi atau menunggu jadwal perkuliahan.',
    'Administrasi & Layanan',
    1,
    'https://hukum.upnvj.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-14-at-09.19.43-1.jpeg',
    9,
    NULL
),

-- =========================
-- GEDUNG RA KARTINI (id = 10)
-- =========================
(
    'Ruang Kelas Magister 101',
    'Ruang kuliah program Magister Hukum di Gedung RA Kartini lantai 1, dilengkapi fasilitas multimedia dan tata ruang yang mendukung diskusi ilmiah mendalam sesuai kebutuhan pembelajaran pascasarjana.',
    'Ruang Kuliah & Akademik',
    1,
    NULL,
    10,
    'rak_magister_101'
),
(
    'Ruang Kelas Magister 102',
    'Ruang kuliah program Magister Hukum di Gedung RA Kartini lantai 1, digunakan untuk perkuliahan pascasarjana dengan kapasitas yang mendukung kegiatan seminar dan diskusi hukum intensif.',
    'Ruang Kuliah & Akademik',
    1,
    NULL,
    10,
    'rak_magister_102'
),
(
    'Ruang Dosen dan Staff Administrasi Prodi Doktor Hukum',
    'Ruang kerja dosen dan staf administrasi Program Doktor Hukum FH UPNVJ di Gedung RA Kartini lantai 1, sebagai pusat koordinasi akademik dan pelayanan administrasi program doktoral.',
    'Administrasi & Layanan',
    1,
    NULL,
    10,
    'rak_dosen_staff_doktor'
),
(
    'Ruang UPT Pengembangan Karir dan Kewirausahaan',
    'Ruang Unit Pelaksana Teknis (UPT) Pengembangan Karir dan Kewirausahaan UPNVJ di Gedung RA Kartini, menyediakan layanan bimbingan karir, pelatihan wirausaha, penempatan kerja, dan informasi magang bagi mahasiswa.',
    'Administrasi & Layanan',
    1,
    NULL,
    10,
    'rak_upt_penkawan'
),
(
    'Ruangan Laboratorium Farmasi Fakultas Kedokteran',
    'Laboratorium Farmasi Fakultas Kedokteran UPNVJ di Gedung RA Kartini lantai 1, digunakan untuk praktikum farmasetika, farmakokinetika, dan analisis sediaan obat bagi mahasiswa program studi farmasi.',
    'Laboratorium',
    1,
    NULL,
    10,
    'rak_lab_farmasi'
),
(
    'Ruangan UPA Bahasa',
    'Ruang Unit Pelaksana Akademik (UPA) Bahasa UPNVJ di Gedung RA Kartini lantai 2, mengelola program pembelajaran bahasa asing (Inggris, Arab, Mandarin, dll.) dan tes kemampuan bahasa bagi seluruh mahasiswa UPNVJ.',
    'Layanan Akademik',
    2,
    NULL,
    10,
    'rak_upa_bahasa'
),
(
    'Ruangan Guru Besar Fakultas Teknik',
    'Ruang kerja Guru Besar (Profesor) Fakultas Teknik UPNVJ di Gedung RA Kartini lantai 2, digunakan untuk kegiatan penelitian, penulisan karya ilmiah, bimbingan doktoral, dan konsultasi akademik tingkat lanjut.',
    'Layanan Akademik',
    2,
    NULL,
    10,
    'rak_guru_besar'
),
(
    'Ruangan Kelas 201',
    'Ruang kuliah di Gedung RA Kartini lantai 2, digunakan untuk perkuliahan Program Magister atau kegiatan akademik pascasarjana yang membutuhkan ruang dengan kapasitas sedang.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    10,
    'rak_201'
),
(
    'Ruangan Lab Bahasa dan Ruang ujian',
    'Ruang Laboratorium Bahasa dan Ruang Ujian UPA Bahasa di Gedung RA Kartini lantai 2, dilengkapi perangkat audio-visual untuk praktikum mendengarkan, berbicara, dan pelaksanaan tes kemampuan bahasa asing mahasiswa.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    10,
    'rak_lab_bahasa_ruang_ujian'
),
(
    'Ruangan Diskusi dan Ruang Instruktur',
    'Ruang diskusi kelompok dan ruang instruktur di Gedung RA Kartini lantai 2, digunakan untuk bimbingan akademik, konsultasi pengajaran, dan persiapan instruktur sebelum kegiatan pembelajaran.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    10,
    'rak_diskusi_instruktur'
),
(
    'Ruangan Ujian dan Ruang Sidang Doktor',
    'Ruang ujian komprehensif dan ruang sidang disertasi program Doktor Hukum FH UPNVJ di Gedung RA Kartini lantai 2, dirancang formal untuk pelaksanaan ujian akhir dan sidang terbuka promosi doktor.',
    'Ruang Kuliah & Akademik',
    2,
    NULL,
    10,
    'rak_ujian_sidang_doktor'
),
(
    'Ruangan Kelas 301',
    'Ruang kuliah program pascasarjana di Gedung RA Kartini lantai 3, dilengkapi fasilitas pembelajaran modern untuk mendukung perkuliahan magister dan doktoral hukum.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    10,
    'rak_301'
),
(
    'Ruangan Kelas 302',
    'Ruang kuliah dan kegiatan akademik di Gedung RA Kartini lantai 3, digunakan untuk perkuliahan pascasarjana dengan kapasitas memadai dan fasilitas presentasi.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    10,
    'rak_302'
),
(
    'Ruangan 303',
    'Ruang multifungsi di Gedung RA Kartini lantai 3 yang digunakan untuk perkuliahan, seminar kecil, atau kegiatan akademik program pascasarjana.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    10,
    'rak_303'
),
(
    'Ruangan 304',
    'Ruang multifungsi di Gedung RA Kartini lantai 3, difungsikan untuk perkuliahan, diskusi akademik, atau kegiatan tambahan program pascasarjana hukum.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    10,
    'rak_304'
),
(
    'Ruangan Ujian 305',
    'Ruang pelaksanaan ujian tertulis bagi mahasiswa program pascasarjana di Gedung RA Kartini lantai 3, dirancang dengan kapasitas dan tata ruang yang mendukung ketertiban ujian.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    10,
    'rak_305'
),
(
    'Ruangan Ujian 306',
    'Ruang pelaksanaan ujian tertulis bagi mahasiswa pascasarjana di Gedung RA Kartini lantai 3, digunakan sebagai ruang cadangan ujian atau ujian komprehensif program magister dan doktoral.',
    'Ruang Kuliah & Akademik',
    3,
    NULL,
    10,
    'rak_306'
),
(
    'Ruangan Ujian 401',
    'Ruang pelaksanaan ujian di Gedung RA Kartini lantai 4, digunakan untuk ujian komprehensif, ujian proposal penelitian, atau kegiatan evaluasi akademik program pascasarjana hukum.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    10,
    'rak_401'
),
(
    'Ruangan Kelas 402',
    'Ruang kuliah program pascasarjana di Gedung RA Kartini lantai 4, digunakan untuk perkuliahan magister atau doktoral dengan fasilitas lengkap untuk mendukung pembelajaran tingkat lanjut.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    10,
    'rak_402'
),
(   
    'Ruangan Kelas 403',
    'Ruang kuliah program pascasarjana di Gedung RA Kartini lantai 4, dilengkapi fasilitas presentasi dan diskusi untuk mendukung perkuliahan intensif program magister dan doktoral hukum.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    10,
    'rak_403'
),
(   
    'Ruangan 404',
    'Ruang multifungsi di Gedung RA Kartini lantai 4, dapat digunakan untuk perkuliahan, seminar terbatas, atau kegiatan penelitian akademik program pascasarjana.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    10,
    'rak_404'
),
(   
    'Ruangan 405',
    'Ruang multifungsi di Gedung RA Kartini lantai 4, difungsikan untuk perkuliahan, bimbingan akademik, atau kegiatan tambahan program pascasarjana hukum.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    10,
    'rak_405'
),
(
    'Ruangan 406',
    'Ruang multifungsi di Gedung RA Kartini lantai 4, digunakan untuk perkuliahan atau kegiatan akademik program pascasarjana dengan kapasitas yang memadai.',
    'Ruang Kuliah & Akademik',
    4,
    NULL,
    10,
    'rak_406'
),

-- FISIP


(
    'Auditorium FISIP',
    'Auditorium utama Fakultas Ilmu Sosial dan Ilmu Politik UPNVJ berkapasitas besar, digunakan untuk seminar nasional, kuliah umum dengan narasumber pakar, debat publik, dan kegiatan akademik-kemahasiswaan skala besar.',
    'Auditorium & Aula',
    1,
    NULL,
    8,
    NULL
),

(
    'Ruang Baca FISIP',
    'Ruang baca Fakultas Ilmu Sosial dan Ilmu Politik yang menyediakan koleksi buku, jurnal ilmu komunikasi, politik, hubungan internasional, referensi digital, serta akses internet untuk mendukung riset dan tugas akademik mahasiswa.',
    'Perpustakaan & Ruang Baca',
    2,
    NULL,
    NULL,
    NULL
),

(
    'Lab Multimedia',
    'Laboratorium multimedia untuk pembelajaran produksi video, audio, animasi, dan desain grafis.',
    'Laboratorium',
    NULL,
    NULL,
    NULL,
    NULL
),

(
    'Lab Politik',
    'Laboratorium pembelajaran dan penelitian di bidang ilmu politik.',
    'Laboratorium',
    3,
    NULL,
    8,
    NULL
),

(
    'Lab Big Data',
    'Laboratorium untuk praktikum dan penelitian big data serta analisis data.',
    'Laboratorium',
    4,
    NULL,
    8,
    NULL
),

(
    'Lab Fotografi',
    'Laboratorium fotografi untuk praktikum dan pengembangan keterampilan fotografi mahasiswa.',
    'Laboratorium',
    4,
    NULL,
    8,
    NULL
),

(
    'Lab Radio',
    'Laboratorium radio untuk praktik penyiaran dan produksi audio.',
    'Laboratorium',
    NULL,
    NULL,
    NULL,
    NULL
),

(
    'Lab Podcast',
    'Laboratorium podcast untuk produksi konten audio digital dan broadcasting.',
    'Laboratorium',
    3,
    NULL,
    8,
    NULL
),

(
    'Lab Film dan Televisi',
    'Laboratorium produksi film dan televisi untuk mendukung pembelajaran media audiovisual.',
    'Laboratorium',
    4,
    NULL,
    8,
    NULL
),

(
    'Lab Diplomasi',
    'Laboratorium diplomasi untuk simulasi dan pembelajaran hubungan internasional.',
    'Laboratorium',
    NULL,
    NULL,
    NULL,
    NULL
),

(
    'Ruang Kelas FISIP',
    'Ruang kuliah reguler mahasiswa Fakultas Ilmu Sosial dan Ilmu Politik, dilengkapi fasilitas multimedia yang mendukung perkuliahan berbasis diskusi, presentasi, dan kajian ilmu sosial, komunikasi, politik, dan hubungan internasional.',
    'Ruang Kuliah & Akademik',
    NULL,
    NULL,
    NULL,
    NULL
),

(
    'Area Lounge Mahasiswa FISIP',
    'Area santai dan diskusi informal bagi mahasiswa FISIP, dilengkapi tempat duduk nyaman dan akses WiFi, digunakan untuk diskusi tugas kelompok, kegiatan komunitas, dan interaksi sosial antar mahasiswa.',
    'Administrasi & Layanan',
    NULL,
    NULL,
    NULL,
    NULL
),

(
    'Ruang Diskusi FISIP',
    'Ruang diskusi akademik mahasiswa FISIP yang dirancang untuk kegiatan kolaborasi, kajian ilmiah, dan presentasi kelompok kecil, mendukung budaya akademik kritis dan dialogis di lingkungan FISIP UPNVJ.',
    'Ruang Kuliah & Akademik',
    NULL,
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
