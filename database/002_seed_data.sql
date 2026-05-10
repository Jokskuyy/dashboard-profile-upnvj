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
'$2b$10$examplehashedpassword',
'Administrator UPNVJ',
'superadmin'
);

-- =========================================
-- INSERT WEB ANALYTICS SAMPLE
-- =========================================

INSERT INTO public.web_analytics_log
(visitor_hash, page_path, device_type)
VALUES
('visitor_demo_001', '/', 'Desktop'),
('visitor_demo_002', '/fakultas', 'Mobile'),
('visitor_demo_003', '/gedung/ki-hadjar-dewantara', 'Desktop');

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
