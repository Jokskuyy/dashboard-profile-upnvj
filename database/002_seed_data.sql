-- =========================================
-- SEEDING DATA UPNVJ PONDOK LABU
-- =========================================
-- Jalankan SETELAH 001_full_setup.sql
-- =========================================

-- =========================================
-- INSERT GEDUNG
-- =========================================

INSERT INTO public.gedung 
(nama_gedung, deskripsi_gedung, lokasi, jumlah_lantai)
VALUES
('Gedung Jenderal Sudirman', 'Gedung rektorat dan pusat administrasi universitas', 'Area depan kampus utama Pondok Labu', 4),

('Gedung DR. Soetomo', 'Gedung perpustakaan pusat dan laboratorium terpadu universitas', 'Zona pelayanan akademik', 4),

('Gedung Dr. Wahidin Sudiro Husodo', 'Gedung utama Fakultas Kedokteran', 'Klaster Fakultas Kedokteran', 4),

('Gedung Dr. Cipto Mangunkusumo', 'Gedung penunjang laboratorium dan skills lab Fakultas Kedokteran', 'Klaster Fakultas Kedokteran', 3),

('Gedung Abdul Rahman Saleh', 'Gedung fasilitas pendukung Fakultas Kedokteran dan laboratorium klinis', 'Perbatasan FK dan FISIP', 4),

('Gedung Ki Hadjar Dewantara', 'Gedung Fakultas Ilmu Komputer dan laboratorium komputer', 'Klaster Fakultas Ilmu Komputer', 4),

('Gedung Moh. Husni Thamrin', 'Gedung Fakultas Ekonomi dan Bisnis', 'Klaster Fakultas Ekonomi dan Bisnis', 4),

('Gedung Muhammad Yamin', 'Gedung Fakultas Ilmu Sosial dan Ilmu Politik', 'Klaster FISIP', 2),

('Gedung Yos Sudarso', 'Gedung Fakultas Hukum Program Sarjana', 'Klaster Fakultas Hukum', 4),

('Gedung RA Kartini', 'Gedung Fakultas Hukum Pascasarjana', 'Klaster Fakultas Hukum', 3),

('Area Parkir UPNVJ', 'Gedung parkir bertingkat untuk kendaraan mahasiswa dan staf', 'Sisi belakang kampus', 4),

('Gedung Kuliah dan Kegiatan Mahasiswa', 'Gedung ruang kuliah dan sekretariat UKM', 'Area belakang kampus', 8);

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
'Fakultas bidang teknologi informasi dan komputasi',
'fik@upnvj.ac.id',
'https://new-fik.upnvj.ac.id',
6
),

(
'Fakultas Hukum',
'Fakultas bidang ilmu hukum dan peradilan',
'turnitin.fh@upnvj.ac.id',
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
    'Mini Company',
    'Fasilitas simulasi perusahaan untuk praktik kewirausahaan dan bisnis mahasiswa FEB.',
    'Laboratorium Bisnis',
    'blue',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/WhatsApp-Image-2022-04-21-at-11.41.31.jpeg',
    1
),

(
    'Sibuni',
    'Sistem bisnis universitas yang digunakan untuk pengembangan praktik bisnis dan kewirausahaan mahasiswa.',
    'Laboratorium Bisnis',
    'indigo',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/WhatsApp-Image-2022-04-21-at-11.41.28.jpeg',
    1
),

(
    'Bank Mini',
    'Laboratorium praktik perbankan untuk mahasiswa program studi keuangan dan perbankan.',
    'Laboratorium',
    'green',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/WhatsApp-Image-2022-04-21-at-11.42.51.jpeg',
    1
),

(
    'Lembaga Kajian Ekonomi dan Bisnis',
    'Fasilitas penelitian dan pengkajian ekonomi serta bisnis untuk dosen dan mahasiswa.',
    'Pusat Penelitian',
    'purple',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/IMG_6400.jpg',
    1
),

(
    'BI Corner',
    'Pojok literasi ekonomi dan keuangan hasil kerja sama dengan Bank Indonesia.',
    'Perpustakaan',
    'yellow',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-16-at-10.15.43_b7572c4f.jpg',
    1
),

(
    'Selasar FEB',
    'Area terbuka untuk diskusi, kegiatan mahasiswa, dan interaksi akademik.',
    'Area Mahasiswa',
    'orange',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/01/IMG_4518.jpg',
    1
),

(
    'Aula BEJ',
    'Aula kegiatan seminar, workshop, dan acara akademik Fakultas Ekonomi dan Bisnis.',
    'Aula',
    'red',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/IMG_6394.jpg',
    1
),

(
    'Ruang Kelas',
    'Ruang perkuliahan reguler untuk kegiatan belajar mengajar mahasiswa FEB.',
    'Ruang Akademik',
    'gray',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2024/02/IMG_6397.jpg',
    1
),

(
    'Ruang Kelas Magister',
    'Ruang kelas khusus program magister Fakultas Ekonomi dan Bisnis.',
    'Ruang Akademik',
    'teal',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/01/IMG_9968.jpg',
    1
),

(
    'Sekretariat Magister',
    'Ruang administrasi dan pelayanan akademik program magister FEB.',
    'Administrasi',
    'cyan',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/01/WhatsApp-Image-2024-05-17-at-14.30.40_dd6f3fff-1.jpg',
    1
),

(
    'Ruang Kelas Doktoral',
    'Ruang pembelajaran untuk program doktoral di lingkungan FEB.',
    'Ruang Akademik',
    'brown',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/06/IMG_5228.jpg',
    1
),

(
    'Sekretariat Doktoral',
    'Fasilitas administrasi dan layanan akademik program doktoral FEB.',
    'Administrasi',
    'pink',
    NULL,
    'https://feb.upnvj.ac.id/wp-content/uploads/2025/06/IMG_5222.jpg',
    1
),

(
    'Laboratorium Akuntansi dan Komputasi',
    'Laboratorium untuk praktik akuntansi komputer dan pengolahan data bisnis.',
    'Laboratorium Komputer',
    'emerald',
    NULL,
    'https://feb.upnvj.ac.id/struktur-organisasi/',
    1
),

(
    'Laboratorium Ilmu Ekonomi dan Manajemen',
    'Laboratorium penunjang pembelajaran ekonomi dan manajemen berbasis teknologi.',
    'Laboratorium',
    'sky',
    NULL,
    'https://feb.upnvj.ac.id/struktur-organisasi/',
    1
);

-- FK
INSERT INTO public.fasilitas
(nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, color, lantai, foto_url, id_gedung)
VALUES

(
    'Laboratorium Biologi Molekuler',
    'Laboratorium penelitian dan praktikum biologi molekuler Fakultas Kedokteran.',
    'Laboratorium',
    'green',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Laboratorium Biokimia',
    'Laboratorium untuk praktikum dan penelitian bidang biokimia.',
    'Laboratorium',
    'emerald',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Laboratorium Patologi Klinik',
    'Laboratorium pembelajaran dan penelitian patologi klinik.',
    'Laboratorium',
    'red',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Laboratorium Mikrobiologi',
    'Laboratorium untuk pembelajaran mikrobiologi kedokteran.',
    'Laboratorium',
    'lime',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Laboratorium Parasitologi',
    'Laboratorium pembelajaran dan penelitian parasitologi.',
    'Laboratorium',
    'yellow',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Laboratorium Farmakologi',
    'Laboratorium untuk praktik dan penelitian farmakologi.',
    'Laboratorium',
    'orange',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Laboratorium Farmasi',
    'Fasilitas laboratorium untuk kegiatan pendidikan farmasi.',
    'Laboratorium',
    'amber',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Laboratorium Histologi',
    'Laboratorium praktikum histologi mahasiswa kedokteran.',
    'Laboratorium',
    'pink',
    NULL,
    'https://fk.upnvj.ac.id/mengenal-fasilitas-pendidikan-kesehatan-di-fakultas-kedokteran-upn-veteran-jakarta/',
    2
),

(
    'Laboratorium Anatomi',
    'Laboratorium anatomi untuk pembelajaran struktur tubuh manusia.',
    'Laboratorium',
    'rose',
    NULL,
    'https://fk.upnvj.ac.id/mengenal-fasilitas-pendidikan-kesehatan-di-fakultas-kedokteran-upn-veteran-jakarta/',
    2
),

(
    'Laboratorium Fisiologi',
    'Laboratorium pembelajaran fisiologi tubuh manusia.',
    'Laboratorium',
    'cyan',
    NULL,
    'https://fk.upnvj.ac.id/mengenal-fasilitas-pendidikan-kesehatan-di-fakultas-kedokteran-upn-veteran-jakarta/',
    2
),

(
    'Laboratorium Patologi Anatomi',
    'Laboratorium pembelajaran patologi anatomi.',
    'Laboratorium',
    'purple',
    NULL,
    'https://fk.upnvj.ac.id/mengenal-fasilitas-pendidikan-kesehatan-di-fakultas-kedokteran-upn-veteran-jakarta/',
    2
),

(
    'Skills Lab',
    'Laboratorium keterampilan klinik untuk simulasi tindakan medis dan OSCE.',
    'Laboratorium',
    'blue',
    NULL,
    'https://fk.upnvj.ac.id/pusat-osce/',
    2
),

(
    'OSCE Center',
    'Pusat ujian Objective Structured Clinical Examination mahasiswa kedokteran.',
    'Laboratorium',
    'indigo',
    NULL,
    'https://fk.upnvj.ac.id/pusat-osce/',
    2
),

(
    'Perpustakaan FK',
    'Perpustakaan Fakultas Kedokteran dengan fasilitas e-library dan internet.',
    'Perpustakaan',
    'sky',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Laboratorium Komputer',
    'Laboratorium komputer dengan akses internet untuk program research dan pembelajaran.',
    'Laboratorium Komputer',
    'gray',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Auditorium FK',
    'Auditorium Fakultas Kedokteran untuk seminar dan kegiatan akademik.',
    'Aula',
    'red',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Ruang Tutorial',
    'Ruang diskusi kelompok kecil untuk proses belajar mahasiswa kedokteran.',
    'Akademik',
    'teal',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Ruang Introduction',
    'Ruang pembelajaran umum berkapasitas besar untuk mahasiswa.',
    'Akademik',
    'slate',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Medical Education Unit',
    'Unit pengembangan pendidikan kedokteran FK UPNVJ.',
    'Administrasi',
    'violet',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Medical Research Unit',
    'Unit penelitian medis Fakultas Kedokteran.',
    'Penelitian',
    'fuchsia',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Medical Assessment Unit',
    'Unit evaluasi dan asesmen pendidikan kedokteran.',
    'Administrasi',
    'stone',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Medical Quality Assurance',
    'Unit penjaminan mutu pendidikan Fakultas Kedokteran.',
    'Administrasi',
    'zinc',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'UPNVJ Medical e-Library',
    'Perpustakaan elektronik Fakultas Kedokteran dengan akses digital dan WiFi.',
    'Perpustakaan',
    'blue',
    NULL,
    'https://fk.upnvj.ac.id/gedung-perkuliahan/',
    2
),

(
    'Rumah Sakit Mini',
    'Fasilitas simulasi layanan kesehatan dan pembelajaran klinis.',
    'Laboratorium',
    'red',
    NULL,
    'https://fk.upnvj.ac.id/peresmian-gedung-upnvj-merce-fakultas-kedokteran-upn-veteran-jakarta/',
    2
),

(
    'Laboratorium Hiperbarik',
    'Laboratorium khusus fasilitas hiperbarik untuk pendidikan dan penelitian medis.',
    'Laboratorium',
    'blue',
    NULL,
    'https://fk.upnvj.ac.id/peresmian-gedung-upnvj-merce-fakultas-kedokteran-upn-veteran-jakarta/',
    2
);

-- =========================================
-- INSERT PROGRAM STUDI
-- =========================================

INSERT INTO public.program_studi
(nama_prodi, jenjang, id_fakultas)
VALUES

-- data prodi
-- data prodi
INSERT INTO program_studi (id, nama_prodi, jenjang, id_fakultas, akreditasi) VALUES
(1, 'Perbankan dan Keuangan', 'Vokasi', 2, 'Unggul'),
(2, 'Akuntansi', 'Vokasi', 2, 'Unggul'),
(3, 'Manajemen', 'Sarjana', 2, 'Unggul'),
(4, 'Akuntansi', 'Sarjana', 2, 'Unggul'),
(5, 'Ekonomi Pembangunan', 'Sarjana', 2, 'Baik Sekali'),
(6, 'Ekonomi Syariah', 'Sarjana', 2, 'Unggul'),
(7, 'Manajemen', 'Magister', 2, 'B'),
(8, 'Akuntansi', 'Magister', 2, 'Baik Sekali');
INSERT INTO program_studi (id, nama_prodi, jenjang, id_fakultas, akreditasi) VALUES
(9, 'Kedokteran', 'Sarjana', 1, 'Unggul'),
(10, 'Farmasi', 'Sarjana', 1, 'Baik Sekali'),
(11, 'Biologi', 'Sarjana', 1, 'Izin Operasional'),
(12, 'Pendidikan Profesi Dokter', 'Profesi', 1, 'Unggul'),
(13, 'Apoteker', 'Profesi', 1, 'Izin Operasional'),
(14, 'Sains Biomedis', 'Magister', 1, 'Izin Operasional'),
(15, 'Radiologi', 'Spesialis', 1, 'Izin Operasional');
INSERT INTO program_studi (id, nama_prodi, jenjang, id_fakultas, akreditasi) VALUES
(16, 'Sistem Informasi', 'Vokasi', 3, 'B'),
(17, 'Informatika', 'Sarjana', 3, 'Unggul'),
(18, 'Sistem Informasi', 'Sarjana', 3, 'Baik Sekali'),
(19, 'Sains Data', 'Sarjana', 3, 'Ijin Operasional');
INSERT INTO program_studi (id, nama_prodi, jenjang, id_fakultas, akreditasi) VALUES
(20, 'Hukum', 'Sarjana', 4, 'Unggul'),
(21, 'Hukum Bisnis', 'Sarjana', 4, 'Ijin Operasional'),
(22, 'Hukum', 'Magister', 4, 'Baik Sekali'),
(23, 'Hukum', 'Doktor', 4, 'Ijin Operasional');
INSERT INTO program_studi (id, nama_prodi, jenjang, id_fakultas, akreditasi) VALUES
(24, 'Ilmu Komunikasi', 'Sarjana', 5, 'Unggul'),
(25, 'Hubungan Internasional', 'Sarjana', 5, 'B'),
(26, 'Ilmu Politik', 'Sarjana', 5, 'Baik Sekali'),
(27, 'Sains Informasi', 'Sarjana', 5, 'Baik'),
(28, 'Kajian Film, Televisi dan Media', 'Sarjana', 5, 'Izin Operasional'),
(29, 'Hubungan Internasional', 'Magister', 5, 'Baik'),
(30, 'Ilmu Politik', 'Magister', 5, 'Baik'),
(31, 'Ilmu Komunikasi', 'Magister', 5, 'Baik Sekali');
INSERT INTO program_studi (id, nama_prodi, jenjang, id_fakultas, akreditasi) VALUES
(32, 'Teknik Mesin', 'Sarjana', 6, 'Unggul'),
(33, 'Teknik Industri', 'Sarjana', 6, 'Unggul'),
(34, 'Teknik Perkapalan', 'Sarjana', 6, 'Unggul'),
(35, 'Teknik Elektro', 'Sarjana', 6, 'Unggul');
INSERT INTO program_studi (id, nama_prodi, jenjang, id_fakultas, akreditasi) VALUES
(36, 'Keperawatan', 'Vokasi', 7, 'Unggul'),
(37, 'Fisioterapi', 'Vokasi', 7, 'Unggul'),
(38, 'Kesehatan Masyarakat', 'Sarjana', 7, 'Unggul'),
(39, 'Gizi', 'Sarjana', 7, 'Unggul'),
(40, 'Keperawatan', 'Sarjana', 7, 'Baik Sekali'),
(41, 'Fisioterapi', 'Sarjana', 7, 'Unggul'),
(42, 'Pendidikan Profesi Ners', 'Profesi', 7, 'Baik Sekali'),
(43, 'Kesehatan Masyarakat', 'Magister', 7, 'Baik'),
(44, 'Keperawatan', 'Magister', 7, 'Ijin Operasional');
-- =========================================
-- INSERT ADMIN USER DEFAULT
-- =========================================

INSERT INTO public.admin_users
(username, password_hash, nama_lengkap, role)
VALUES
(
'admin',
hash_password('admin123'),
'Administrator UPNVJ',
'superadmin'
);

-- =========================================
-- INSERT WEB ANALYTICS SAMPLE
-- =========================================

INSERT INTO public.web_analytics_log
(visitor_hash, page_path, device_type, visited_at)
VALUES
-- 14 days of realistic seed data
('v_a1b2c3', '/', 'Desktop', NOW() - INTERVAL '1 day'),
('v_a1b2c3', '/admin', 'Desktop', NOW() - INTERVAL '1 day'),
('v_d4e5f6', '/', 'Mobile', NOW() - INTERVAL '1 day'),
('v_g7h8i9', '/', 'Desktop', NOW() - INTERVAL '1 day'),
('v_j0k1l2', '/', 'Tablet', NOW() - INTERVAL '1 day'),

('v_a1b2c3', '/', 'Desktop', NOW() - INTERVAL '2 days'),
('v_m3n4o5', '/', 'Mobile', NOW() - INTERVAL '2 days'),
('v_p6q7r8', '/', 'Desktop', NOW() - INTERVAL '2 days'),
('v_p6q7r8', '/login', 'Desktop', NOW() - INTERVAL '2 days'),

('v_s9t0u1', '/', 'Mobile', NOW() - INTERVAL '3 days'),
('v_v2w3x4', '/', 'Desktop', NOW() - INTERVAL '3 days'),
('v_y5z6a7', '/', 'Mobile', NOW() - INTERVAL '3 days'),
('v_y5z6a7', '/input-data', 'Mobile', NOW() - INTERVAL '3 days'),
('v_b8c9d0', '/', 'Desktop', NOW() - INTERVAL '3 days'),

('v_e1f2g3', '/', 'Desktop', NOW() - INTERVAL '4 days'),
('v_h4i5j6', '/', 'Mobile', NOW() - INTERVAL '4 days'),
('v_k7l8m9', '/', 'Tablet', NOW() - INTERVAL '4 days'),

('v_n0o1p2', '/', 'Desktop', NOW() - INTERVAL '5 days'),
('v_q3r4s5', '/', 'Mobile', NOW() - INTERVAL '5 days'),
('v_t6u7v8', '/', 'Desktop', NOW() - INTERVAL '5 days'),
('v_w9x0y1', '/', 'Desktop', NOW() - INTERVAL '5 days'),
('v_z2a3b4', '/', 'Mobile', NOW() - INTERVAL '5 days'),

('v_c5d6e7', '/', 'Desktop', NOW() - INTERVAL '6 days'),
('v_f8g9h0', '/', 'Mobile', NOW() - INTERVAL '6 days'),

('v_i1j2k3', '/', 'Desktop', NOW() - INTERVAL '7 days'),
('v_l4m5n6', '/', 'Mobile', NOW() - INTERVAL '7 days'),
('v_o7p8q9', '/', 'Desktop', NOW() - INTERVAL '7 days'),
('v_r0s1t2', '/', 'Tablet', NOW() - INTERVAL '7 days'),

('v_u3v4w5', '/', 'Desktop', NOW() - INTERVAL '8 days'),
('v_x6y7z8', '/', 'Mobile', NOW() - INTERVAL '8 days'),

('v_a9b0c1', '/', 'Desktop', NOW() - INTERVAL '9 days'),
('v_d2e3f4', '/', 'Mobile', NOW() - INTERVAL '9 days'),
('v_g5h6i7', '/', 'Desktop', NOW() - INTERVAL '9 days'),

('v_j8k9l0', '/', 'Desktop', NOW() - INTERVAL '10 days'),
('v_m1n2o3', '/', 'Mobile', NOW() - INTERVAL '10 days'),

('v_p4q5r6', '/', 'Desktop', NOW() - INTERVAL '11 days'),
('v_s7t8u9', '/', 'Mobile', NOW() - INTERVAL '11 days'),
('v_v0w1x2', '/', 'Desktop', NOW() - INTERVAL '11 days'),

('v_y3z4a5', '/', 'Desktop', NOW() - INTERVAL '12 days'),
('v_b6c7d8', '/', 'Mobile', NOW() - INTERVAL '12 days'),

('v_e9f0g1', '/', 'Desktop', NOW() - INTERVAL '13 days'),
('v_h2i3j4', '/', 'Mobile', NOW() - INTERVAL '13 days'),
('v_k5l6m7', '/', 'Tablet', NOW() - INTERVAL '13 days'),

('v_n8o9p0', '/', 'Desktop', NOW() - INTERVAL '14 days'),
('v_q1r2s3', '/', 'Mobile', NOW() - INTERVAL '14 days');

-- =========================================
-- INSERT AUDIT LOG SAMPLE
-- =========================================

INSERT INTO public.audit_logs
(actor_id, actor_email, action, table_name, record_id, old_data, new_data)
VALUES
(
gen_random_uuid(),
'admin@upnvj.ac.id',
'INSERT',
'gedung',
'1',
NULL,
'{
  "nama_gedung": "Gedung Jenderal Sudirman",
  "jumlah_lantai": 4
}'::jsonb
);
