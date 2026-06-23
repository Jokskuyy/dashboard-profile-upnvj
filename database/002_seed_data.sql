-- =============================================================================
-- SEEDING DATA UPNVJ PONDOK LABU
-- =============================================================================
-- Jalankan SETELAH 001_full_setup.sql
-- Aman untuk di-run ulang (akan TRUNCATE dulu)
-- =============================================================================

-- =============================================================================
-- CLEAN EXISTING DATA (safe re-run)
-- =============================================================================
TRUNCATE public.fasilitas, public.program_studi, public.fakultas, public.gedung RESTART IDENTITY CASCADE;

-- =============================================================================
-- INSERT GEDUNG
-- =============================================================================

INSERT INTO public.gedung (nama_gedung, deskripsi_gedung, lokasi, jumlah_lantai, foto_url, unity_object_name) VALUES
('Gedung Rektorat', 'Gedung rektorat dan pusat administrasi universitas', 'Area depan kampus utama Pondok Labu', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_rektorat.webp', 'Gedung_Rektorat'),
('Gedung DR. Soepomo', 'Gedung perpustakaan pusat dan laboratorium terpadu universitas', 'Zona pelayanan akademik', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_dr_soepomo.webp', NULL),
('Gedung Dr. Wahidin Sudiro Husodo', 'Gedung utama Fakultas Kedokteran', 'Klaster Fakultas Kedokteran', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_dr_wahidin_sudiro_husodo.webp', NULL),
('Gedung Dr. Cipto Mangunkusumo', 'Gedung penunjang laboratorium dan skills lab Fakultas Kedokteran', 'Klaster Fakultas Kedokteran', 3, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_dr_cipto_mangunkusumo.webp', NULL),
('Gedung Abdul Rahman Saleh', 'Gedung fasilitas pendukung Fakultas Kedokteran dan laboratorium klinis', 'Perbatasan FK dan FISIP', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_abdul_rahman_saleh.webp', NULL),
('Gedung Ki Hadjar Dewantara', 'Gedung Fakultas Ilmu Komputer dan laboratorium komputer', 'Klaster Fakultas Ilmu Komputer', 4, NULL, NULL),
('Gedung Moh. Husni Thamrin', 'Gedung Fakultas Ekonomi dan Bisnis', 'Klaster Fakultas Ekonomi dan Bisnis', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_moh_husni_thamrin.webp', NULL),
('Gedung Muhammad Yamin', 'Gedung Fakultas Ilmu Sosial dan Ilmu Politik', 'Klaster FISIP', 2, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_muhammad_yamin.webp', NULL),
('Gedung Yos Sudarso', 'Gedung Fakultas Hukum Program Sarjana', 'Klaster Fakultas Hukum', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_yos_sudarso.webp', NULL),
('Gedung RA Kartini', 'Gedung Fakultas Hukum Pascasarjana', 'Klaster Fakultas Hukum', 3, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_ra_kartini.webp', NULL),
('Gedung Parkir Depan UPNVJ', 'Gedung parkir bertingkat untuk kendaraan mahasiswa dan staf', 'Sisi depan kampus', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_parkir_depan_upnvj.jpg', NULL),
('Area Parkir Depan UPNVJ', 'Area parkir terbuka untuk kendaraan mahasiswa dan staf', 'Sisi depan kampus', NULL, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_area_parkir_depan_upnvj.jpg', NULL),
('Gedung Dewi Sartika', 'Gedung Fakultas Ilmu Komputer', 'Klaster Fakultas Ilmu Komputer', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_dewi_sartika.webp', 'Dewsar'),
('Lapangan Upacara', 'Tempat upacara dan parkir mobil apabila sedang tidak dipakai', 'Area tengah kampus', 1, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_lapangan_upacara.jpg', NULL),
('Gedung Kuliah dan Kegiatan Mahasiswa', 'Gedung ruang kuliah dan sekretariat UKM', 'Area belakang kampus', 8, NULL, NULL),
('Area Parkir Belakang UPNVJ', 'Area parkir terbuka parkir untuk kendaraan mahasiswa dan staf', 'Sisi belakang kampus', 1, NULL, NULL);

-- =============================================================================
-- INSERT FAKULTAS
-- =============================================================================

INSERT INTO public.fakultas (nama_fakultas, deskripsi_fakultas, email, website, id_gedung_utama) VALUES
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

-- =============================================================================
-- INSERT FASILITAS
-- =============================================================================

INSERT INTO public.fasilitas (nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, lantai, foto_url, id_gedung, unity_object_name) VALUES
-- Gedung 3: Gedung Dr. Wahidin Sudiro Husodo
(
    'Ilmu Kesehatan Matra / UPNVERI',
    $$Fasilitas Ilmu Kesehatan Matra / UPNVERI yang mendukung kegiatan operasional dan kemahasiswaan$$,
    'Lainnya',
    1,
    NULL,
    3,
    'wsh_upnveri'
),
(
    'Medical Quality Assurance (MQA)',
    $$Unit penjaminan mutu pendidikan medis.$$,
    'Lainnya',
    1,
    NULL,
    3,
    'wsh_mqa'
),
(
    'Pusat Stemcell & Tissue Engineering Research Centre',
    $$Pusat kegiatan penelitian sel punca dan rekayasa jaringan.$$,
    'Lainnya',
    1,
    NULL,
    3,
    'wsh_stem_cell'
),
(
    'Ruang Akreditasi FK UPNVJ',
    $$Ruang pengelolaan administrasi dan dokumen akreditasi Fakultas Kedokteran.$$,
    'Lainnya',
    1,
    NULL,
    3,
    NULL
),
(
    'Ruang BEM FK UPNVJ',
    $$Ruang organisasi mahasiswa BEM Fakultas Kedokteran.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    3,
    'wsh_bem'
),
(
    'Ruang Dosen FK UPNVJ',
    $$Ruang kerja dan aktivitas dosen Fakultas Kedokteran UPNVJ.$$,
    'Ruang Dosen',
    1,
    NULL,
    3,
    'wsh_ruang_dosen_fk'
),
(
    'Ruang Program Studi Spesialis',
    $$Fasilitas Ruang Program Studi Spesialis yang mendukung kegiatan operasional dan kemahasiswaan$$,
    'Lainnya',
    1,
    NULL,
    3,
    'wsh_program_studi_spesialis'
),
(
    'Medical Assessment Unit (MAU)',
    $$Unit evaluasi dan asesmen pendidikan medis.$$,
    'Lainnya',
    2,
    NULL,
    3,
    NULL
),
(
    'Medical Education Unit (MEU)',
    $$Unit pengembangan pendidikan kedokteran.$$,
    'Lainnya',
    2,
    NULL,
    3,
    NULL
),
(
    'Medical Research Unit (MRU)',
    $$Unit penelitian medis Fakultas Kedokteran.$$,
    'Lainnya',
    2,
    NULL,
    3,
    NULL
),
(
    'Musholla FK UPNVJ',
    $$Fasilitas Musholla FK UPNVJ yang mendukung kegiatan operasional dan kemahasiswaan$$,
    'Fasilitas Ibadah',
    2,
    NULL,
    3,
    'wsh_musholla'
),
(
    'Ruang Administrasi Keuangan FK UPNVJ',
    $$Ruang administrasi keuangan Fakultas Kedokteran.$$,
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    NULL
),
(
    'Ruang Dekan FK UPNVJ',
    $$Ruang kerja Dekan Fakultas Kedokteran.$$,
    'Lainnya',
    2,
    NULL,
    3,
    'wsh_dekan'
),
(
    'Ruang Podcast/mitek/meeting FK UPNVJ',
    $$Fasilitas Ruang Podcast/mitek/meeting FK UPNVJ yang mendukung kegiatan operasional dan kemahasiswaan$$,
    'Studio & Produksi Media',
    2,
    NULL,
    3,
    'wsh_podcast_meeting'
),
(
    'Ruang Prodi Profesi',
    $$Fasilitas Ruang Prodi Profesi yang mendukung kegiatan operasional dan kemahasiswaan$$,
    'Lainnya',
    2,
    NULL,
    3,
    'wsh_prodi_profesi'
),
(
    'Ruang PSKPP',
    $$Fasilitas Ruang PSKPP yang mendukung kegiatan operasional dan kemahasiswaan$$,
    'Lainnya',
    2,
    NULL,
    3,
    'wsh_pskpp'
),
(
    'Ruang Rapat Dekan dan Fakultas Kedokteran',
    $$Ruang rapat untuk kegiatan pimpinan dan fakultas.$$,
    'Lainnya',
    2,
    NULL,
    3,
    'wsh_rapat_fk'
),
(
    'Ruang Sekretariat Tata Usaha FK UPNVJ',
    $$Ruang sekretariat tata usaha Fakultas Kedokteran.$$,
    'Administrasi & Layanan',
    2,
    NULL,
    3,
    'wsh_tata_usaha'
),
(
    'Ruang Server FK UPNVJ',
    $$Fasilitas umum dan infrastruktur pendukung gedung$$,
    'Fasilitas Umum',
    2,
    NULL,
    3,
    'wsh_server'
),
(
    'Ruang Wakil Dekan Bidang Akademik',
    $$Ruang kerja Wakil Dekan bidang akademik.$$,
    'Ruang Kuliah',
    2,
    NULL,
    3,
    'wsh_wadek_akademik'
),
(
    'Ruang Wakil Dekan Bidang Kemahasiswaan dan Kerjasama',
    $$Ruang kerja Wakil Dekan bidang kemahasiswaan dan kerjasama.$$,
    'Lainnya',
    2,
    NULL,
    3,
    'wsh_wadek_kemahasiswaan'
),
(
    'Ruang Wakil Dekan Bidang Umum dan Keuangan',
    $$Ruang kerja Wakil Dekan bidang umum dan keuangan.$$,
    'Lainnya',
    2,
    NULL,
    3,
    NULL
),
(
    'Auditorium Fakultas Kedokteran',
    $$Auditorium dengan kapasitas sekitar 200 orang.$$,
    'Auditorium & Aula',
    3,
    NULL,
    3,
    'wsh_auditorium'
),
(
    'Laboratorium Biokimia',
    $$Laboratorium untuk kegiatan praktikum biokimia.$$,
    'Laboratorium',
    3,
    NULL,
    3,
    NULL
),
(
    'Laboratorium Biologi Molekuler',
    $$Laboratorium untuk praktikum dan penelitian biologi molekuler.$$,
    'Laboratorium',
    3,
    NULL,
    3,
    'wsh_lab_biologi_molekuler'
),
(
    'Laboratorium IKK/IKM',
    $$Laboratorium Ilmu Kesehatan Komunitas dan Ilmu Kesehatan Masyarakat.$$,
    'Laboratorium',
    3,
    NULL,
    3,
    NULL
),
(
    'Laboratorium Patologi Klinik',
    $$Laboratorium untuk kegiatan patologi klinik.$$,
    'Laboratorium',
    3,
    NULL,
    3,
    'wsh_lab_patologi_klinik'
),
(
    'Ruang Diskusi FK',
    $$Ruang diskusi akademik mahasiswa dan dosen.$$,
    'Lainnya',
    3,
    NULL,
    3,
    NULL
),
(
    'Ruang Dosen Patologi Klinik',
    $$Ruang kerja dan transit untuk Dosen Patologi Klinik$$,
    'Ruang Dosen',
    3,
    NULL,
    3,
    'wsh_ruang_dosen_patologi_klinik'
),
(
    'Ruang Kelas Farmasi',
    $$Fasilitas Ruang Kelas Farmasi yang mendukung kegiatan operasional dan kemahasiswaan$$,
    'Ruang Kuliah',
    3,
    NULL,
    3,
    'wsh_kelas_farmasi'
),
(
    'Ruang Kepala Laboratorium Biokimia',
    $$Ruang kepala laboratorium biokimia.$$,
    'Laboratorium',
    3,
    NULL,
    3,
    'wsh_ruang_kalab_biokimia'
),
(
    'Ruang Kepala Laboratorium Biologi',
    $$Ruang kepala laboratorium biologi.$$,
    'Laboratorium',
    3,
    NULL,
    3,
    'wsh_ruang_kalab_biologi'
),
(
    'Ruang Kepala Laboratorium Patologi Klinik',
    $$Ruang kepala laboratorium patologi klinik.$$,
    'Laboratorium',
    3,
    NULL,
    3,
    'wsh_ruang_kalab_patologi_klinik'
),
(
    'Ruang Laboratorium Biokimia',
    $$Ruang laboratorium biokimia.$$,
    'Laboratorium',
    3,
    NULL,
    3,
    'wsh_ruang_lab_biokimia'
),
(
    'Ruang Multimedia',
    $$Fasilitas Ruang Multimedia yang mendukung kegiatan operasional dan kemahasiswaan$$,
    'Lainnya',
    3,
    NULL,
    3,
    'wsh_multimedia'
),
(
    'Ruang Reagent Biokimia',
    $$Ruang penyimpanan reagen biokimia.$$,
    'Lainnya',
    3,
    NULL,
    3,
    'wsh_reagent_biokimia'
),
(
    'Bimbingan dan Konseling Farmasi UPNVJ',
    $$Bimbingan dan konseling farmasi di Universitas Pembangunan Nasional Veteran Jakarta.$$,
    'Lainnya',
    4,
    NULL,
    3,
    'wsh_bimbingan_dan_konseling_farmasi'
),
(
    'Kandang Hewan FK UPNVJ',
    $$Fasilitas kandang hewan untuk penelitian dan praktikum mahasiswa Fakultas Kedokteran.$$,
    'Lainnya',
    4,
    NULL,
    3,
    'wsh_kandang_hewan'
),
(
    'Lab Mikrobiologi',
    $$Ruangan laboratorium mikrobiologi untuk kegiatan praktikum dan penelitian mahasiswa Fakultas Kedokteran.$$,
    'Laboratorium',
    4,
    NULL,
    3,
    'wsh_lab_mikrobiologi'
),
(
    'Lab Parasitologi',
    $$Ruangan laboratorium parasitologi untuk kegiatan praktikum dan penelitian mahasiswa Fakultas Kedokteran.$$,
    'Laboratorium',
    4,
    NULL,
    3,
    'wsh_lab_parasitologi'
),
(
    'Laboratorium Farmakologi Dan Farmasi Klinik',
    $$Laboratorium untuk kegiatan praktikum dan penelitian farmakologi dan farmasi klinik.$$,
    'Laboratorium',
    4,
    NULL,
    3,
    'wsh_lab_farmakologi_dan_farmasi_klinik'
),
(
    'Laboratorium Farmasi UPNVJ',
    $$Laboratorium farmasi di Universitas Pembangunan Nasional Veteran Jakarta.$$,
    'Laboratorium',
    4,
    NULL,
    3,
    'wsh_lab_farmasi'
),
(
    'Laboratorium Instrumentasi Farmasi',
    $$Laboratorium untuk kegiatan praktikum dan penelitian instrumentasi farmasi.$$,
    'Laboratorium',
    4,
    NULL,
    3,
    'wsh_lab_instrumentasi_farmasi'
),
(
    'Prodi Farmasi UPNVJ',
    $$Program studi farmasi di Universitas Pembangunan Nasional Veteran Jakarta.$$,
    'Lainnya',
    4,
    NULL,
    3,
    'wsh_prodi_farmasi'
),
(
    'Ruangan Kalab Mikrobiologi & Parasitologi',
    $$Ruangan kepala laboratorium mikrobiologi dan parasitologi.$$,
    'Laboratorium',
    4,
    NULL,
    3,
    'wsh_kalab_mikrobiologi_dan_parasitologi'
),
(
    'Ruangan Kepala Farmakologi',
    $$Ruang kepala laboratorium farmakologi.$$,
    'Lainnya',
    4,
    NULL,
    3,
    'wsh_kalab_farmakologi'
),
(
    'Ruangan Laporan & Mitek Prodi Farmasi',
    $$Ruangan untuk kegiatan laporan dan mitek program studi farmasi.$$,
    'Lainnya',
    4,
    NULL,
    3,
    'wsh_laporan_dan_mitek_prodi_farmasi'
),


-- Gedung 4: Gedung Dr. Cipto Mangunkusumo
(
    'Laboratorium Histologi',
    $$Laboratorium Departemen Histologi.$$,
    'Laboratorium',
    1,
    NULL,
    4,
    NULL
),
(
    'Laboratorium Komputer FK',
    $$Laboratorium komputer dengan 150 komputer terhubung internet.$$,
    'Laboratorium',
    1,
    NULL,
    4,
    NULL
),
(
    'Laboratorium Patologi Anatomi',
    $$Laboratorium Departemen Patologi Anatomi.$$,
    'Laboratorium',
    1,
    NULL,
    4,
    NULL
),
(
    'Perpustakaan FK UPNVJ',
    $$Perpustakaan dengan fasilitas ruang baca, e-library, WiFi, hotspot, dan layanan internet.$$,
    'Perpustakaan & Ruang Baca',
    1,
    NULL,
    4,
    NULL
),
(
    'Ruang Tutor Meeting',
    $$Ruang observasi dan monitoring pelaksanaan tutorial.$$,
    'Lainnya',
    2,
    NULL,
    4,
    NULL
),
(
    'Ruang Tutorial FK',
    $$Enam belas ruang diskusi kelompok untuk proses tutorial mahasiswa.$$,
    'Lainnya',
    2,
    NULL,
    4,
    NULL
),
(
    'Gudang Mannequin Skills Lab',
    $$Gudang penyimpanan mannequin keterampilan medis.$$,
    'Laboratorium',
    3,
    NULL,
    4,
    NULL
),
(
    'Mushola FK',
    $$Fasilitas ibadah untuk mahasiswa dan civitas akademika.$$,
    'Lainnya',
    3,
    NULL,
    4,
    NULL
),
(
    'Ruang Administrasi Skills Lab',
    $$Ruang administrasi kegiatan skills lab.$$,
    'Laboratorium',
    3,
    NULL,
    4,
    NULL
),
(
    'Ruang Instruktur Skills Lab',
    $$Ruang instruktur kegiatan skills lab.$$,
    'Laboratorium',
    3,
    NULL,
    4,
    NULL
),
(
    'Ruang Introduction A dan B',
    $$Ruang pengenalan pembelajaran berkapasitas 75–100 mahasiswa.$$,
    'Lainnya',
    3,
    NULL,
    4,
    NULL
),
(
    'Skills Lab FK',
    $$Laboratorium keterampilan klinik dengan ruang coaching dan station OSCE.$$,
    'Laboratorium',
    3,
    NULL,
    4,
    NULL
),
(
    'Hall FK',
    $$Hall pendukung perluasan ruang lecture.$$,
    'Lainnya',
    4,
    NULL,
    4,
    NULL
),
(
    'Ruang Lecture A dan B',
    $$Dua ruang kuliah berkapasitas sekitar 190 orang.$$,
    'Lainnya',
    4,
    NULL,
    4,
    NULL
),
(
    'Ruang Seminar FK',
    $$Ruang seminar dengan kapasitas sekitar 40 orang.$$,
    'Lainnya',
    4,
    NULL,
    4,
    NULL
),
(
    'Ruang Transit Dosen',
    $$Ruang transit dan istirahat dosen.$$,
    'Ruang Dosen',
    4,
    NULL,
    4,
    NULL
),


-- Gedung 5: Gedung Abdul Rahman Saleh
(
    'Laboratorium Anatomi A.101',
    $$Fasilitas laboratorium anatomi Fakultas Kedokteran.$$,
    'Laboratorium',
    1,
    NULL,
    5,
    'ars_lab_anatomi_101'
),
(
    'Laboratorium Anatomi A.102',
    $$Fasilitas laboratorium anatomi Fakultas Kedokteran.$$,
    'Laboratorium',
    1,
    NULL,
    5,
    'ars_lab_anatomi_102'
),
(
    'Laboratorium Fisiologi',
    $$Laboratorium fisiologi Fakultas Kedokteran.$$,
    'Laboratorium',
    1,
    NULL,
    5,
    'ars_lab_fisiologi'
),
(
    'PBU',
    $$Layanan Pusat Bimbingan Ujian dan Administrasi Terpadu.$$,
    'Lainnya',
    1,
    NULL,
    5,
    'ars_pbu'
),
(
    'Musholla',
    $$Fasilitas tempat ibadah bagi mahasiswa, staf, dan dosen.$$,
    'Fasilitas Ibadah',
    2,
    NULL,
    5,
    'ars_musholla'
),
(
    'Pantry',
    $$Fasilitas dapur kecil untuk kebutuhan konsumsi staf dan dosen.$$,
    'Fasilitas Umum',
    2,
    NULL,
    5,
    'ars_pantry'
),
(
    'Ruang BEM FISIP',
    $$Ruang sekretariat Badan Eksekutif Mahasiswa (BEM) Fakultas Ilmu Sosial dan Ilmu Politik.$$,
    'Ruang Kegiatan Mahasiswa',
    2,
    NULL,
    5,
    'ars_ruang_bem_fisip'
),
(
    'Ruang Dosen',
    $$Fasilitas ruang istirahat dan kerja bagi tenaga pendidik atau dosen.$$,
    'Ruang Dosen',
    2,
    NULL,
    5,
    'ars_ruang_dosen'
),
(
    'Ruang EOS',
    $$Ruang sekretariat unit kegiatan kemahasiswaan EOS.$$,
    'Lainnya',
    2,
    NULL,
    5,
    'ars_ruang_eos'
),
(
    'Ruang Gugus Kendali Mutu',
    $$Ruang operasional Gugus Kendali Mutu untuk penjaminan standar mutu akademik dan pelayanan.$$,
    'Lainnya',
    2,
    NULL,
    5,
    'ars_gugus_kendali_mutu'
),
(
    'Ruang HIMASIFO',
    $$Ruang sekretariat operasional Himpunan Mahasiswa Sistem Informasi (HIMASIFO).$$,
    'Ruang Kegiatan Mahasiswa',
    2,
    NULL,
    5,
    'ars_ruang_himasifo'
),
(
    'Ruang Kelas F.201',
    $$Fasilitas ruang kelas pembelajaran teori F.201.$$,
    'Ruang Kuliah',
    2,
    NULL,
    5,
    'ars_ruang_kelas_f201'
),
(
    'Ruang Konseling dan Bimbingan Karir',
    $$Ruangan khusus untuk memberikan layanan bimbingan konseling dan pengembangan karir mahasiswa.$$,
    'Lainnya',
    2,
    NULL,
    5,
    'ars_ruang_konseling_dan_bimbingan_karir'
),
(
    'Ruang Server Wifi',
    $$Pusat kontrol dan server jaringan WiFi untuk menjamin konektivitas internet di area gedung.$$,
    'Fasilitas Umum',
    2,
    NULL,
    5,
    'ars_ruang_server_wifi'
),
(
    'Ruang Kelas F.301',
    $$Fasilitas ruang kelas pembelajaran teori F.301.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f301'
),
(
    'Ruang Kelas F.302',
    $$Fasilitas ruang kelas pembelajaran teori F.302.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f302'
),
(
    'Ruang Kelas F.303',
    $$Fasilitas ruang kelas pembelajaran teori F.303.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f303'
),
(
    'Ruang Kelas F.304',
    $$Fasilitas ruang kelas pembelajaran teori F.304.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f304'
),
(
    'Ruang Kelas F.305',
    $$Fasilitas ruang kelas pembelajaran teori F.305.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f305'
),
(
    'Ruang Kelas F.306',
    $$Fasilitas ruang kelas pembelajaran teori F.306.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f306'
),
(
    'Ruang Kelas F.307',
    $$Fasilitas ruang kelas pembelajaran teori F.307.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f307'
),
(
    'Ruang Tutorial Gedung Abdul Rahman Saleh',
    $$Tiga ruang tutorial untuk diskusi akademik mahasiswa.$$,
    'Lainnya',
    3,
    NULL,
    5,
    NULL
),
(
    'OSCE Center FKUPN',
    $$Pusat ujian OSCE dengan 24 ruang ujian, control panel, dan gudang manekin.$$,
    'Lainnya',
    4,
    NULL,
    5,
    NULL
),
(
    'Ruang Alumni I',
    $$Ruang kegiatan alumni Fakultas Kedokteran.$$,
    'Lainnya',
    4,
    NULL,
    5,
    NULL
),
(
    'Ruang Kelas F.401',
    $$Fasilitas ruang kelas pembelajaran teori F.401.$$,
    'Ruang Kuliah',
    4,
    NULL,
    5,
    'ars_ruang_kelas_f401'
),
(
    'Ruang Kelas F.402',
    $$Fasilitas ruang kelas pembelajaran teori F.402.$$,
    'Ruang Kuliah',
    4,
    NULL,
    5,
    'ars_ruang_kelas_f402'
),
(
    'Ruang Kelas F.403',
    $$Fasilitas ruang kelas pembelajaran teori F.403.$$,
    'Ruang Kuliah',
    4,
    NULL,
    5,
    'ars_ruang_kelas_f403'
),
(
    'Ruang Kelas F.404',
    $$Fasilitas ruang kelas pembelajaran teori F.404.$$,
    'Ruang Kuliah',
    4,
    NULL,
    5,
    'ars_ruang_kelas_f404'
),
(
    'Ruang Komisi Etik',
    $$Ruang kegiatan komisi etik Fakultas Kedokteran.$$,
    'Lainnya',
    4,
    NULL,
    5,
    NULL
),
(
    'Ruang Peserta Alumni FK UPNVJ',
    $$Ruang peserta alumni Fakultas Kedokteran UPNVJ.$$,
    'Lainnya',
    4,
    NULL,
    5,
    NULL
),


-- Gedung 6: Gedung Ki Hadjar Dewantara
(
    'Digital Library',
    $$Perpustakaan digital Fakultas Ilmu Komputer yang menyimpan koleksi buku, jurnal, artikel, dan sumber informasi lainnya dalam bentuk digital.$$,
    'Lainnya',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/digital_library.jpg',
    6,
    'khd_digital_library'
),
(
    'Ruang Podcast FIK',
    $$Ruang podcast Fakultas Ilmu Komputer yang dilengkapi dengan peralatan rekaman audio dan video profesional, digunakan untuk produksi konten digital, wawancara, dan kegiatan penyiaran mahasiswa.$$,
    'Studio & Produksi Media',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/digital_library.jpg',
    6,
    NULL
),
(
    'Selasar Kihajar Dewantara',
    $$Selasar pada lantai 1 Gedung Ki Hadjar Dewantara.$$,
    'Lainnya',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/selasar_lantai_1.jpg',
    6,
    'khd_selasar'
),
(
    'Lab Software Engineering(201)',
    $$Pusat praktikum dan penelitian di bidang pemrograman komputer dengan komputer terbaru, internet berkecepatan tinggi, proyektor, dan papan tulis digital.$$,
    'Laboratorium',
    2,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_software_engineering_201.jpg',
    6,
    'khd_201_lab'
),
(
    'Ruang Kuliah 202 Ki Hadjar Dewantara',
    $$Ruang kuliah yang berada di Gedung Ki Hadjar Dewantara lantai 2.$$,
    'Ruang Kuliah',
    2,
    NULL,
    6,
    'khd_202'
),
(
    'Ruang Kuliah 203 Ki Hadjar Dewantara',
    $$Ruang kuliah yang berada di Gedung Ki Hadjar Dewantara lantai 2.$$,
    'Ruang Kuliah',
    2,
    NULL,
    6,
    'khd_203'
),
(
    'Lab Artificial Intelligence dan Robotics(302)',
    $$Pusat praktikum dan penelitian bidang kecerdasan buatan dengan fasilitas komputer berperforma tinggi, perangkat lunak AI terbaru, big data, dan machine learning.$$,
    'Laboratorium',
    3,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_artificial_intelligence_dan_robotics_302.jpg',
    6,
    'khd_302_lab'
),
(
    'Lab Big Data dan Data Science(303)',
    $$Pusat praktikum dan penelitian dalam bidang penambangan data dan ilmu data dengan komputer berkinerja tinggi dan perangkat lunak analisis data terkini.$$,
    'Laboratorium',
    3,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_big_data_dan_data_science_303.jpg',
    6,
    'khd_303_lab'
),
(
    'Lab Cybersecurity dan Networking (304)',
    $$Pusat praktikum dan penelitian bidang keamanan siber dengan perangkat keras canggih, perangkat lunak keamanan terkini, dan jaringan simulasi serangan siber.$$,
    'Laboratorium',
    3,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_cybersecurity_dan_networking_304.jpg',
    6,
    'khd_304_lab'
),
(
    'Sekretariat Laboratorium',
    $$Ruang sekretariat laboratorium yang berfungsi sebagai pusat administrasi dan koordinasi kegiatan laboratorium.$$,
    'Laboratorium',
    3,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/sekretariat_laboratorium.jpg',
    6,
    'khd_sekretariat_lab'
),
(
    'Lab E-Governance',
    $$Pusat praktikum dan penelitian bidang manajemen basis data dengan komputer berperforma tinggi dan perangkat lunak database terkini seperti SQL Server, Oracle, dan MySQL.$$,
    'Laboratorium',
    4,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_e_governance.jpg',
    6,
    'khd_403_lab'
),
(
    'Lab Internet of Things(401)',
    $$Pusat kegiatan praktikum dan penelitian bidang teknologi IoT dengan sensor, mikrokontroler, modul komunikasi nirkabel, dan perangkat lunak pengembangan IoT terkini.$$,
    'Laboratorium',
    4,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_internet_of_things_401.jpg',
    6,
    'khd_401_lab'
),
(
    'Lab Enterprise System',
    $$Pusat praktikum dan penelitian bidang intelijen bisnis dengan komputer berperforma tinggi, perangkat lunak analitik terkini, dan platform visualisasi data.$$,
    'Laboratorium',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_enterprise_system.jpg',
    6,
    NULL
),
(
    'Lab Immersive dan Multimedia',
    $$Pusat praktikum dan penelitian di bidang pemrograman komputer dengan fasilitas komputer terbaru, internet berkecepatan tinggi, proyektor, dan papan tulis digital.$$,
    'Laboratorium',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_immersive_dan_multimedia.jpg',
    6,
    NULL
),
(
    'Masjid',
    $$Masjid di lingkungan kampus UPNVJ$$,
    'Fasilitas Ibadah',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/masjid.jpg',
    6,
    'masjid'
),


-- Gedung 7: Gedung Moh. Husni Thamrin
(
    'Ruang Dosen Ilmu Ekonomi',
    $$Ruang kerja dosen Program Studi Ilmu Ekonomi FEB.$$,
    'Ruang Dosen',
    2,
    NULL,
    7,
    NULL
),
(
    'Ruang Dosen Manajemen Program Sarjana',
    $$Ruang kerja dosen Program Studi Manajemen jenjang sarjana FEB.$$,
    'Ruang Dosen',
    2,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas 201',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    2,
    NULL,
    7,
    'mht_201'
),
(
    'Ruang Kelas 202',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    2,
    NULL,
    7,
    'mht_202'
),
(
    'Ruang Kelas 203',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    2,
    NULL,
    7,
    'mht_203'
),
(
    'Ruang Kelas 204',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    2,
    NULL,
    7,
    'mht_204'
),
(
    'Ruang Kelas 205',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    2,
    NULL,
    7,
    'mht_205'
),
(
    'Ruang Kelas 206',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    2,
    NULL,
    7,
    'mht_206'
),
(
    'Ruang Kelas 207',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    2,
    NULL,
    7,
    'mht_207'
),
(
    'Ruang Kelas Magister',
    $$Ruang kelas khusus program magister Fakultas Ekonomi dan Bisnis.$$,
    'Ruang Kuliah',
    2,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/ruang_kelas_magister.jpg',
    7,
    NULL
),
(
    'Ruang Sekretariat Program Studi Manajemen dan Akuntansi Program Magister',
    $$Ruang administrasi dan sekretariat Program Magister Manajemen dan Akuntansi FEB.$$,
    'Lainnya',
    2,
    NULL,
    7,
    NULL
),
(
    'Laboratorium Akuntansi 2',
    $$Laboratorium untuk kegiatan praktikum akuntansi mahasiswa FEB.$$,
    'Laboratorium',
    3,
    NULL,
    7,
    NULL
),
(
    'Mash Classroom',
    $$Ruang pembelajaran modern untuk kegiatan akademik mahasiswa FEB.$$,
    'Lainnya',
    3,
    NULL,
    7,
    NULL
),
(
    'Mini Company',
    $$Fasilitas simulasi perusahaan untuk praktik kewirausahaan dan bisnis mahasiswa FEB.$$,
    'Lainnya',
    3,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/mini_company.jpg',
    7,
    NULL
),
(
    'Ruang Kelas 301',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    3,
    NULL,
    7,
    'mht_301'
),
(
    'Ruang Kelas 302',
    $$Laboratorium Ilmu Ekonomi untuk kegiatan praktikum dan pembelajaran mahasiswa FEB.$$,
    'Ruang Kuliah',
    3,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas 303',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    3,
    NULL,
    7,
    'mht_303'
),
(
    'Ruang Kelas 304',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    3,
    NULL,
    7,
    'mht_304'
),
(
    'Ruang Kelas 305',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    3,
    NULL,
    7,
    'mht_305'
),
(
    'Ruang Kelas 306',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    3,
    NULL,
    7,
    'mht_306'
),
(
    'Ruang Kelas 307',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    3,
    NULL,
    7,
    'mht_307'
),
(
    'Mushola FEB',
    $$Fasilitas mushola untuk kegiatan ibadah mahasiswa FEB.$$,
    'Lainnya',
    4,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas C.402',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    4,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas C.403',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    4,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas C.404',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    4,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas C.405',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    4,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas C.406',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    4,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas C.407',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    4,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas D.401',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    4,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas D.402',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    4,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas D.403',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    4,
    NULL,
    7,
    NULL
),
(
    'Ruang Kelas D.404',
    $$Ruang kelas untuk kegiatan perkuliahan mahasiswa FEB.$$,
    'Ruang Kuliah',
    4,
    NULL,
    7,
    NULL
),
(
    'Aula BEJ',
    $$Aula kegiatan seminar, workshop, dan acara akademik Fakultas Ekonomi dan Bisnis.$$,
    'Auditorium & Aula',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/aula_bej.jpg',
    7,
    NULL
),
(
    'Bank Mini',
    $$Laboratorium praktik perbankan untuk mahasiswa program studi keuangan dan perbankan.$$,
    'Lainnya',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/bank_mini.jpg',
    7,
    NULL
),
(
    'BI Corner',
    $$Pojok literasi ekonomi dan keuangan hasil kerja sama dengan Bank Indonesia.$$,
    'Lainnya',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/bi_corner.jpg',
    7,
    NULL
),
(
    'Laboratorium Akuntansi dan Komputasi',
    $$Laboratorium untuk praktik akuntansi komputer dan pengolahan data bisnis.$$,
    'Laboratorium',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/laboratorium_ilmu_ekonomi_dan_manajemen.jpg',
    7,
    NULL
),
(
    'Laboratorium Ilmu Ekonomi dan Manajemen',
    $$Laboratorium penunjang pembelajaran ekonomi dan manajemen berbasis teknologi.$$,
    'Laboratorium',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/laboratorium_ilmu_ekonomi_dan_manajemen.jpg',
    7,
    NULL
),
(
    'Lembaga Kajian Ekonomi dan Bisnis',
    $$Fasilitas penelitian dan pengkajian ekonomi serta bisnis untuk dosen dan mahasiswa.$$,
    'Lainnya',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/lembaga_kajian_ekonomi_dan_bisnis.jpg',
    7,
    NULL
),
(
    'Ruang Kelas',
    $$Ruang perkuliahan reguler untuk kegiatan belajar mengajar mahasiswa FEB.$$,
    'Ruang Kuliah',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/ruang_kelas.jpg',
    7,
    NULL
),
(
    'Ruang Kelas Doktoral',
    $$Ruang pembelajaran untuk program doktoral di lingkungan FEB.$$,
    'Ruang Kuliah',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/ruang_kelas_doktoral.jpg',
    7,
    NULL
),
(
    'Sekretariat Doktoral',
    $$Fasilitas administrasi dan layanan akademik program doktoral FEB.$$,
    'Lainnya',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/sekretariat_doktoral.jpg',
    7,
    NULL
),
(
    'Sekretariat Magister',
    $$Ruang administrasi dan pelayanan akademik program magister FEB.$$,
    'Lainnya',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/sekretariat_magister.jpg',
    7,
    NULL
),
(
    'Selasar FEB',
    $$Area terbuka untuk diskusi, kegiatan mahasiswa, dan interaksi akademik.$$,
    'Lainnya',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/selasar_feb.jpg',
    7,
    NULL
),
(
    'Sibuni',
    $$Sistem bisnis universitas yang digunakan untuk pengembangan praktik bisnis dan kewirausahaan mahasiswa.$$,
    'Lainnya',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/sibuni.jpg',
    7,
    NULL
),


-- Gedung 8: Gedung Muhammad Yamin
(
    'Auditorium FISIP',
    $$Auditorium Fakultas Ilmu Sosial dan Ilmu Politik untuk seminar, kuliah umum, dan kegiatan akademik.$$,
    'Auditorium & Aula',
    1,
    NULL,
    8,
    NULL
),
(
    'Lab Podcast',
    $$Laboratorium podcast untuk produksi konten audio digital dan broadcasting.$$,
    'Laboratorium',
    3,
    NULL,
    8,
    NULL
),
(
    'Lab Politik',
    $$Laboratorium pembelajaran dan penelitian di bidang ilmu politik.$$,
    'Laboratorium',
    3,
    NULL,
    8,
    NULL
),
(
    'Lab Big Data',
    $$Laboratorium untuk praktikum dan penelitian big data serta analisis data.$$,
    'Laboratorium',
    4,
    NULL,
    8,
    NULL
),
(
    'Lab Film dan Televisi',
    $$Laboratorium produksi film dan televisi untuk mendukung pembelajaran media audiovisual.$$,
    'Laboratorium',
    4,
    NULL,
    8,
    NULL
),
(
    'Lab Fotografi',
    $$Laboratorium fotografi untuk praktikum dan pengembangan keterampilan fotografi mahasiswa.$$,
    'Laboratorium',
    4,
    NULL,
    8,
    NULL
),


-- Gedung 9: Gedung Yos Sudarso
(
    'Ruang Administrasi Yos Sudarso',
    $$Ruang administrasi pada Gedung Yos Sudarso.$$,
    'Administrasi & Layanan',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_administrasi_yos_sudarso.png',
    9,
    NULL
),
(
    'Ruang Dosen Yos Sudarso Lantai 1',
    $$Ruang dosen pada lantai 1 Gedung Yos Sudarso.$$,
    'Ruang Dosen',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_dosen_yos_sudarso_lantai_1.png',
    9,
    NULL
),
(
    'Selasar Kanan Yos Sudarso',
    $$Selasar kanan pada lantai 1 Gedung Yos Sudarso.$$,
    'Lainnya',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/selasar_kanan_yos_sudarso.jpg',
    9,
    NULL
),
(
    'Selasar Kiri Yos Sudarso',
    $$Selasar kiri pada lantai 1 Gedung Yos Sudarso.$$,
    'Lainnya',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/selasar_kiri_yos_sudarso.jpg',
    9,
    NULL
),
(
    'Lab Perancangan Kontrak',
    $$Laboratorium perancangan kontrak pada lantai 2 Gedung Yos Sudarso.$$,
    'Laboratorium',
    2,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/lab_perancangan_kontrak.jpg',
    9,
    NULL
),
(
    'Ruang Dosen Yos Sudarso Lantai 2',
    $$Ruang dosen pada lantai 2 Gedung Yos Sudarso.$$,
    'Ruang Dosen',
    2,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_dosen_yos_sudarso_lantai_2.png',
    9,
    NULL
),
(
    'Ruang Rapat Yos Sudarso Lantai 2',
    $$Ruang rapat pada lantai 2 Gedung Yos Sudarso.$$,
    'Lainnya',
    2,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_rapat_yos_sudarso_lantai_2.jpg',
    9,
    NULL
),
(
    'Smartclass Yos Sudarso Lantai 2',
    $$Smartclass yang digunakan pada lantai 2 Gedung Yos Sudarso.$$,
    'Lainnya',
    2,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/smartclass_yos_sudarso_lantai_3.jpg',
    9,
    NULL
),
(
    'Ruang Baca Yos Sudarso',
    $$Ruang baca pada lantai 3 Gedung Yos Sudarso.$$,
    'Perpustakaan & Ruang Baca',
    3,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_baca_yos_sudarso.jpg',
    9,
    NULL
),
(
    'Smartclass Yos Sudarso Lantai 3',
    $$Smartclass yang digunakan pada lantai 3 Gedung Yos Sudarso.$$,
    'Lainnya',
    3,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/smartclass_yos_sudarso_lantai_3.jpg',
    9,
    NULL
),
(
    'Ruang Podcast Yos Sudarso',
    $$Ruang podcast pada lantai 4 Gedung Yos Sudarso.$$,
    'Studio & Produksi Media',
    4,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_praktik_peradilan_semu.png',
    9,
    NULL
),
(
    'Ruang Praktik Peradilan Semu',
    $$Ruang praktik peradilan semu pada lantai 4 Gedung Yos Sudarso.$$,
    'Lainnya',
    4,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_praktik_peradilan_semu.png',
    9,
    NULL
),


-- Gedung 10: Gedung RA Kartini
(
    'Ruang Dosen dan Staff Administrasi Prodi Doktor Hukum',
    $$Ruang dosen dan staff administrasi program doktor pada lantai 1 Gedung RA Kartini.$$,
    'Ruang Dosen',
    1,
    NULL,
    10,
    'rak_dosen_staff_doktor'
),
(
    'Ruang Kelas Magister 101',
    $$Ruang kelas program magister pada lantai 1 Gedung RA Kartini.$$,
    'Ruang Kuliah',
    1,
    NULL,
    10,
    'rak_magister_101'
),
(
    'Ruang Kelas Magister 102',
    $$Ruang kelas program magister pada lantai 1 Gedung RA Kartini.$$,
    'Ruang Kuliah',
    1,
    NULL,
    10,
    'rak_magister_102'
),
(
    'Ruang UPT Pengembangan Karir dan Kewirausahaan',
    $$Ruang UPT Pengembangan Karir dan Kewirausahaan pada lantai 1 Gedung RA Kartini.$$,
    'Lainnya',
    1,
    NULL,
    10,
    'rak_upt_penkawan'
),
(
    'Ruangan Laboratorium Farmasi Fakultas Kedokteran',
    $$Ruangan Laboratorium Farmasi Fakultas Kedokteran pada lantai 1 Gedung RA Kartini.$$,
    'Laboratorium',
    1,
    NULL,
    10,
    'rak_lab_farmasi'
),
(
    'Ruangan Diskusi dan Ruang Instruktur',
    $$Ruangan Diskusi dan Ruang Instruktur pada lantai 2 Gedung RA Kartini.$$,
    'Lainnya',
    2,
    NULL,
    10,
    'rak_diskusi_instruktur'
),
(
    'Ruangan Guru Besar Fakultas Teknik',
    $$Ruangan guru besar fakultas teknik pada lantai 2 Gedung RA Kartini.$$,
    'Lainnya',
    2,
    NULL,
    10,
    'rak_guru_besar'
),
(
    'Ruangan Kelas 201',
    $$Ruangan kelas pada lantai 2 Gedung RA Kartini.$$,
    'Ruang Kuliah',
    2,
    NULL,
    10,
    'rak_201'
),
(
    'Ruangan Lab Bahasa dan Ruang ujian',
    $$Ruangan Lab Bahasa dan Ruang ujian pada lantai 2 Gedung RA Kartini.$$,
    'Laboratorium',
    2,
    NULL,
    10,
    'rak_lab_bahasa_ruang_ujian'
),
(
    'Ruangan Ujian dan Ruang Sidang Doktor',
    $$Ruangan ujian dan ruang sidang Doktor pada lantai 2 Gedung RA Kartini.$$,
    'Lainnya',
    2,
    NULL,
    10,
    'rak_ujian_sidang_doktor'
),
(
    'Ruangan UPA Bahasa',
    $$Ruangan UPA Bahasa pada lantai 2 Gedung RA Kartini.$$,
    'Lainnya',
    2,
    NULL,
    10,
    'rak_upa_bahasa'
),
(
    'Ruangan 303',
    $$Ruangan 303 pada lantai 3 Gedung RA Kartini.$$,
    'Lainnya',
    3,
    NULL,
    10,
    'rak_303'
),
(
    'Ruangan 304',
    $$Ruangan 304 pada lantai 3 Gedung RA Kartini.$$,
    'Lainnya',
    3,
    NULL,
    10,
    'rak_304'
),
(
    'Ruangan Kelas 301',
    $$Ruangan Kelas 301 pada lantai 3 Gedung RA Kartini.$$,
    'Ruang Kuliah',
    3,
    NULL,
    10,
    'rak_301'
),
(
    'Ruangan Kelas 302',
    $$Ruangan 302 pada lantai 3 Gedung RA Kartini.$$,
    'Ruang Kuliah',
    3,
    NULL,
    10,
    'rak_302'
),
(
    'Ruangan Ujian 305',
    $$Ruangan ujian 305 pada lantai 3 Gedung RA Kartini.$$,
    'Lainnya',
    3,
    NULL,
    10,
    'rak_305'
),
(
    'Ruangan Ujian 306',
    $$Ruangan ujian 306 pada lantai 3 Gedung RA Kartini.$$,
    'Lainnya',
    3,
    NULL,
    10,
    'rak_306'
),
(
    'Ruangan 404',
    $$Ruangan 404 pada lantai 4 Gedung RA Kartini.$$,
    'Lainnya',
    4,
    NULL,
    10,
    'rak_404'
),
(
    'Ruangan 405',
    $$Ruangan 405 pada lantai 4 Gedung RA Kartini.$$,
    'Lainnya',
    4,
    NULL,
    10,
    'rak_405'
),
(
    'Ruangan 406',
    $$Ruangan 406 pada lantai 4 Gedung RA Kartini.$$,
    'Lainnya',
    4,
    NULL,
    10,
    'rak_406'
),
(
    'Ruangan Kelas 402',
    $$Ruangan kelas 402 pada lantai 4 Gedung RA Kartini.$$,
    'Ruang Kuliah',
    4,
    NULL,
    10,
    'rak_402'
),
(
    'Ruangan Kelas 403',
    $$Ruangan kelas 403 pada lantai 4 Gedung RA Kartini.$$,
    'Ruang Kuliah',
    4,
    NULL,
    10,
    'rak_403'
),
(
    'Ruangan Ujian 401',
    $$Ruangan ujian 401 pada lantai 4 Gedung RA Kartini.$$,
    'Lainnya',
    4,
    NULL,
    10,
    'rak_401'
),


-- Gedung 13: Gedung Dewi Sartika
(
    'Lapangan dan Alat Olahraga FIK',
    $$Fasilitas Olahraga yang terletak di depan Gedung Dewi Sartika lantai 1.$$,
    'Fasilitas Olahraga',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/dewi%20sartika/lapangan_dan_alat_olahraga_fik.jpg',
    13,
    NULL
),
(
    'Ruang BEM FIK',
    $$Ruang kegiatan Badan Eksekutif Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_bem'
),
(
    'Ruang SENAT FIK',
    $$Ruang kegiatan SENAT Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_senat'
),
(
    'Ruang UKM Basket',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_basket'
),
(
    'Ruang UKM Boxer',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_boxer'
),
(
    'Ruang UKM Bulu Tangkis',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_bulu_tangkis'
),
(
    'Ruang UKM Catur',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_catur'
),
(
    'Ruang UKM Juijutsu',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_juijutsu'
),
(
    'Ruang UKM Katolik',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_katolik'
),
(
    'Ruang UKM MC',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_mc'
),
(
    'Ruang UKM Paduan Suara',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_paduan_suara'
),
(
    'Ruang UKM Pencak Silat',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_pencak_silat'
),
(
    'Ruang UKM Protestan',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_protestan'
),
(
    'Ruang UKM Seni tari',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_seni_tari'
),
(
    'Ruang UKM Sepak Bola',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_sepak_bola'
),
(
    'Ruang UKM UBV',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_ubv'
),
(
    'Ruang UKM UFO',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_ufo'
),
(
    'Ruang UKM Voli',
    $$Ruang kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika lantai 1.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_voli'
),
(
    'Ruang Kuliah 201 Dewi Sartika',
    $$Ruang kuliah yang berada di Gedung Dewi Sartika lantai 2.$$,
    'Ruang Kuliah',
    2,
    NULL,
    13,
    'ds_201'
),
(
    'Ruang Kuliah 202 Dewi Sartika',
    $$Ruang kuliah yang berada di Gedung Dewi Sartika lantai 2.$$,
    'Ruang Kuliah',
    2,
    NULL,
    13,
    'ds_202'
),
(
    'Ruang Kuliah 203 Dewi Sartika',
    $$Ruang kuliah yang berada di Gedung Dewi Sartika lantai 2.$$,
    'Ruang Kuliah',
    2,
    NULL,
    13,
    'ds_203'
),
(
    'Ruang Kuliah 301',
    $$Ruang kuliah yang berada di Gedung Dewi Sartika lantai 3.$$,
    'Ruang Kuliah',
    3,
    NULL,
    13,
    'ds_301'
),
(
    'Ruang Kuliah 302',
    $$Ruang kuliah yang berada di Gedung Dewi Sartika lantai 3.$$,
    'Ruang Kuliah',
    3,
    NULL,
    13,
    'ds_302'
),
(
    'Ruang Kuliah 303',
    $$Ruang kuliah yang berada di Gedung Dewi Sartika lantai 3.$$,
    'Ruang Kuliah',
    3,
    NULL,
    13,
    'ds_303'
),
(
    'Ruang Kuliah 401',
    $$Ruang kuliah yang berada di Gedung Dewi Sartika lantai 4.$$,
    'Ruang Kuliah',
    4,
    NULL,
    13,
    'ds_401'
),
(
    'Ruang Kuliah 402',
    $$Ruang kuliah yang berada di Gedung Dewi Sartika lantai 4.$$,
    'Ruang Kuliah',
    4,
    NULL,
    13,
    'ds_402'
),
(
    'Ruang Kuliah 403(mesh room)',
    $$Ruang kuliah yang berada di Gedung Dewi Sartika lantai 4.$$,
    'Ruang Kuliah',
    4,
    NULL,
    13,
    'ds_403_mesh'
),


-- Tanpa Gedung (id_gedung NULL)
(
    'Ruang Baca FISIP',
    'Ruang baca dengan koleksi buku, jurnal, referensi digital, serta akses internet untuk mendukung kegiatan akademik.',
    'Perpustakaan & Ruang Baca',
    2,
    NULL,
    NULL,
    NULL
),
(
    'Area Lounge Mahasiswa FISIP',
    'Area bersantai dan diskusi mahasiswa di lingkungan FISIP.',
    'Administrasi & Layanan',
    NULL,
    NULL,
    NULL,
    NULL
),
(
    id_gedung NULL
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
    'Lab Multimedia',
    'Laboratorium multimedia untuk pembelajaran produksi video, audio, animasi, dan desain grafis.',
    'Laboratorium',
    NULL,
    NULL,
    NULL,
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
    'Ruang Diskusi FISIP',
    'Ruang diskusi mahasiswa untuk kegiatan akademik dan kolaborasi.',
    'Ruang Kuliah & Akademik',
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'Ruang Kelas FISIP',
    'Ruang kelas untuk kegiatan belajar mengajar mahasiswa FISIP.',
    'Ruang Kuliah & Akademik',
    NULL,
    NULL,
    NULL,
    NULL
);

-- =============================================================================
-- INSERT PROGRAM STUDI
-- =============================================================================

-- data prodi
INSERT INTO public.program_studi (nama_prodi, jenjang, id_fakultas, akreditasi) VALUES
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

-- =============================================================================
-- INSERT ADMIN USER DEFAULT
-- =============================================================================

INSERT INTO public.admin_users (username, password_hash, nama_lengkap, role) VALUES
(
    'admin',
    hash_password('admin123'),
    'Administrator UPNVJ',
    'superadmin'
);

-- =============================================================================
-- INSERT WEB ANALYTICS LOGS
-- =============================================================================

INSERT INTO public.web_analytics_log (visitor_hash, page_path, device_type, visited_at) VALUES
('visitor_demo_001', '/', 'Desktop', '2026-05-09T15:16:26.844293'),
('visitor_demo_002', '/fakultas', 'Mobile', '2026-05-09T15:16:26.844293'),
('visitor_demo_003', '/gedung/ki-hadjar-dewantara', 'Desktop', '2026-05-09T15:16:26.844293'),
('v_8o0kw5', '/login', 'Desktop', '2026-05-10T12:49:03.830735'),
('v_8o0kw5', '/', 'Desktop', '2026-05-10T12:49:03.830673'),
('v_8o0kw5', '/', 'Desktop', '2026-05-10T12:49:03.830706'),
('v_g75rfy', '/admin', 'Desktop', '2026-05-10T12:49:04.144125'),
('v_8o0kw5', '/admin', 'Desktop', '2026-05-10T12:50:10.405581'),
('v_8o0kw5', '/', 'Desktop', '2026-05-10T12:50:26.663183'),
('v_8o0kw5', '/login', 'Desktop', '2026-05-10T12:50:46.583647'),
('v_8o0kw5', '/', 'Desktop', '2026-05-10T12:51:04.878446'),
('v_8o0kw5', '/', 'Desktop', '2026-05-10T12:51:47.47857'),
('v_8o0kw5', '/', 'Desktop', '2026-05-10T12:53:52.523898'),
('v_8o0kw5', '/', 'Desktop', '2026-05-10T13:10:39.210219'),
('v_8o0kw5', '/', 'Desktop', '2026-05-10T13:14:05.38629'),
('v_g75rfy', '/admin', 'Desktop', '2026-05-10T13:22:06.209524'),
('v_g75rfy', '/admin/login', 'Desktop', '2026-05-10T13:22:21.428895'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T13:22:23.393'),
('v_g75rfy', '/login', 'Desktop', '2026-05-10T13:22:32.430769'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T13:22:35.395251'),
('v_g75rfy', '/login', 'Desktop', '2026-05-10T13:23:26.812952'),
('v_g75rfy', '/admin', 'Desktop', '2026-05-10T13:23:29.237853'),
('v_8o0kw5', '/', 'Desktop', '2026-05-10T13:26:00.237135'),
('v_g75rfy', '/admin/login', 'Desktop', '2026-05-10T13:38:31.815782'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T13:38:33.249816'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T13:45:56.646131'),
('v_8o0kw5', '/', 'Desktop', '2026-05-10T13:47:28.638968'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T13:49:33.438105'),
('v_g75rfy', '/login', 'Desktop', '2026-05-10T13:49:44.126208'),
('v_g75rfy', '/admin', 'Desktop', '2026-05-10T13:50:04.242328'),
('v_g75rfy', '/login', 'Desktop', '2026-05-10T13:51:30.805505'),
('v_g75rfy', '/admin', 'Desktop', '2026-05-10T13:51:33.985804'),
('v_g75rfy', '/login', 'Desktop', '2026-05-10T13:51:35.109089'),
('v_g75rfy', '/admin', 'Desktop', '2026-05-10T13:51:35.896571'),
('v_8o0kw5', '/admin/login', 'Desktop', '2026-05-10T13:52:30.851199'),
('v_g75rfy', '/login', 'Desktop', '2026-05-10T13:52:40.065652'),
('v_g75rfy', '/admin', 'Desktop', '2026-05-10T13:52:42.648866'),
('v_9js687', '/admin/login', 'Desktop', '2026-05-10T13:53:07.923083'),
('v_9js687', '/', 'Desktop', '2026-05-10T13:53:09.315272'),
('v_77kg2w', '/', 'Desktop', '2026-05-10T14:10:34.275275'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T14:10:51.636103'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T14:11:13.133757'),
('v_77kg2w', '/', 'Desktop', '2026-05-10T14:11:43.54553'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T14:18:21.993303'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T14:18:36.862309'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T14:18:41.305471'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T14:18:50.019182'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T14:18:56.744631'),
('v_77kg2w', '/', 'Desktop', '2026-05-10T14:19:47.503733'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T14:19:59.99338'),
('v_77kg2w', '/', 'Desktop', '2026-05-10T14:22:37.184296'),
('v_77kg2w', '/', 'Desktop', '2026-05-10T14:22:46.394142'),
('v_77kg2w', '/', 'Desktop', '2026-05-10T14:24:26.980409'),
('v_5ow1dm', '/', 'Mobile', '2026-05-10T14:24:42.495005'),
('v_5ow1dm', '/', 'Mobile', '2026-05-10T14:26:40.898344'),
('v_5ow1dm', '/', 'Mobile', '2026-05-10T14:26:45.671822'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T14:35:36.721421'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T14:35:47.501595'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T14:37:42.880672'),
('v_5ow1dm', '/', 'Mobile', '2026-05-10T14:38:26.731673'),
('v_77kg2w', '/', 'Desktop', '2026-05-10T14:42:06.270362'),
('v_5ow1dm', '/', 'Mobile', '2026-05-10T14:45:28.582915'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T15:02:11.331683'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T15:04:17.652606'),
('v_5ow1dm', '/', 'Mobile', '2026-05-10T15:05:02.992963'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T15:07:02.402125'),
('v_5ow1dm', '/', 'Mobile', '2026-05-10T15:09:19.411168'),
('v_77kg2w', '/', 'Desktop', '2026-05-10T15:09:41.995268'),
('v_5ow1dm', '/', 'Mobile', '2026-05-10T15:13:28.835858'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T15:15:40.08143'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T15:19:29.09845'),
('v_ua8mg2', '/', 'Mobile', '2026-05-10T15:19:57.034961'),
('v_9js687', '/login', 'Desktop', '2026-05-10T15:23:43.64182'),
('v_9js687', '/admin', 'Desktop', '2026-05-10T15:23:47.535883'),
('v_g75rfy', '/admin', 'Desktop', '2026-05-10T15:31:42.525284'),
('v_8o0kw5', '/admin/login', 'Desktop', '2026-05-10T15:41:41.322701'),
('v_9js687', '/admin/login', 'Desktop', '2026-05-10T15:45:16.304176'),
('v_9js687', '/', 'Desktop', '2026-05-10T15:45:18.131796'),
('v_9js687', '/login', 'Desktop', '2026-05-10T15:45:59.498469'),
('v_9js687', '/admin', 'Desktop', '2026-05-10T15:46:02.562928'),
('v_8o0kw5', '/admin/login', 'Desktop', '2026-05-10T15:52:27.501231'),
('v_9js687', '/admin', 'Desktop', '2026-05-10T15:53:50.9994'),
('v_9js687', '/admin', 'Desktop', '2026-05-10T15:56:49.124549'),
('v_9js687', '/admin', 'Desktop', '2026-05-10T15:58:37.287138'),
('v_9js687', '/admin', 'Desktop', '2026-05-10T16:02:19.413892'),
('v_9js687', '/admin', 'Desktop', '2026-05-10T16:04:10.849743'),
('v_9js687', '/admin', 'Desktop', '2026-05-10T16:06:48.490108'),
('v_9js687', '/admin', 'Desktop', '2026-05-10T16:09:06.086654'),
('v_9js687', '/admin', 'Desktop', '2026-05-10T16:10:37.672004'),
('v_9js687', '/admin/login', 'Desktop', '2026-05-10T16:11:20.630744'),
('v_9js687', '/', 'Desktop', '2026-05-10T16:11:22.259203'),
('v_9js687', '/login', 'Desktop', '2026-05-10T16:15:25.556881'),
('v_9js687', '/admin', 'Desktop', '2026-05-10T16:15:28.351491'),
('v_9js687', '/admin/login', 'Desktop', '2026-05-10T16:31:42.439252'),
('v_9js687', '/', 'Desktop', '2026-05-10T16:31:43.561765'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T16:32:58.847314'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T16:43:15.88181'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T16:43:18.740195'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T16:45:18.650697'),
('v_ua8mg2', '/login', 'Mobile', '2026-05-10T16:47:48.501925'),
('v_ua8mg2', '/', 'Mobile', '2026-05-10T16:47:51.78067'),
('v_ua8mg2', '/', 'Mobile', '2026-05-10T16:48:29.503989'),
('v_ua8mg2', '/', 'Mobile', '2026-05-10T16:50:12.727984'),
('v_ua8mg2', '/', 'Mobile', '2026-05-10T16:55:25.64512'),
('v_ua8mg2', '/', 'Mobile', '2026-05-10T17:01:46.558066'),
('v_9js687', '/', 'Desktop', '2026-05-10T17:08:03.838387'),
('v_9js687', '/', 'Desktop', '2026-05-10T17:10:08.096763'),
('v_9js687', '/', 'Desktop', '2026-05-10T17:10:21.99548'),
('v_9js687', '/', 'Desktop', '2026-05-10T17:11:24.134483'),
('v_9js687', '/', 'Desktop', '2026-05-10T17:12:52.560761'),
('v_9js687', '/', 'Desktop', '2026-05-10T17:14:47.615114'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T17:25:44.664082'),
('v_cb9zfy', '/login', 'Mobile', '2026-05-10T17:26:31.158226'),
('v_cb9zfy', '/admin', 'Mobile', '2026-05-10T17:26:41.512352'),
('v_cb9zfy', '/admin', 'Mobile', '2026-05-10T17:30:27.743173'),
('v_cb9zfy', '/admin/login', 'Mobile', '2026-05-10T18:42:31.081731'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T18:42:39.709534'),
('v_cb9zfy', '/admin/login', 'Mobile', '2026-05-10T18:42:44.094178'),
('v_cb9zfy', '/', 'Mobile', '2026-05-10T18:42:45.660725'),
('v_g75rfy', '/', 'Desktop', '2026-05-10T19:30:54.966703'),
('v_g75rfy', '/login', 'Desktop', '2026-05-10T19:31:16.7971'),
('v_g75rfy', '/admin', 'Desktop', '2026-05-10T19:31:19.672673'),
('v_77kg2w', '/', 'Desktop', '2026-05-11T00:13:10.162188'),
('v_g75rfy', '/', 'Desktop', '2026-05-11T00:20:38.149894'),
('v_g75rfy', '/', 'Desktop', '2026-05-11T00:31:53.181084'),
('v_g75rfy', '/', 'Desktop', '2026-05-11T00:33:25.711294'),
('v_g75rfy', '/', 'Desktop', '2026-05-11T00:35:18.524014'),
('v_g75rfy', '/', 'Desktop', '2026-05-11T00:37:29.702482'),
('v_104g3c', '/', 'Mobile', '2026-05-11T01:12:24.748686'),
('v_bg7b2w', '/', 'Mobile', '2026-05-11T01:13:58.709887'),
('v_g75rfy', '/', 'Desktop', '2026-05-11T01:16:43.396743'),
('v_g75rfy', '/', 'Desktop', '2026-05-11T01:18:38.845351'),
('v_104g3c', '/', 'Mobile', '2026-05-11T01:19:59.220507'),
('v_g75rfy', '/', 'Desktop', '2026-05-11T01:22:37.462201'),
('v_104g3c', '/', 'Mobile', '2026-05-11T01:24:05.400883'),
('v_104g3c', '/', 'Mobile', '2026-05-11T01:31:35.068586'),
('v_104g3c', '/', 'Mobile', '2026-05-11T01:32:18.448542'),
('v_104g3c', '/', 'Mobile', '2026-05-11T01:43:28.305004'),
('v_bg7b2w', '/', 'Mobile', '2026-05-11T01:44:32.126816'),
('v_g75rfy', '/', 'Desktop', '2026-05-11T01:56:12.443724'),
('v_104g3c', '/', 'Mobile', '2026-05-11T01:58:39.974673'),
('v_bg7b2w', '/', 'Mobile', '2026-05-11T01:59:40.988644'),
('v_104g3c', '/', 'Mobile', '2026-05-11T02:00:44.936478'),
('v_104g3c', '/', 'Mobile', '2026-05-11T02:02:10.304282'),
('v_104g3c', '/', 'Mobile', '2026-05-11T02:03:19.247176'),
('v_104g3c', '/', 'Mobile', '2026-05-11T02:04:38.626176'),
('v_bg7b2w', '/', 'Mobile', '2026-05-11T02:17:23.872009'),
('v_bg7b2w', '/', 'Mobile', '2026-05-11T02:17:41.209225'),
('v_bg7b2w', '/', 'Mobile', '2026-05-11T02:18:00.0623'),
('v_g75rfy', '/login', 'Desktop', '2026-05-11T02:40:58.961547'),
('v_g75rfy', '/admin', 'Desktop', '2026-05-11T02:41:01.800776'),
('v_77kg2w', '/', 'Desktop', '2026-05-11T02:44:24.453816'),
('v_cb9zfy', '/', 'Mobile', '2026-05-11T03:17:01.602589'),
('v_cb9zfy', '/', 'Mobile', '2026-05-11T04:13:17.035402'),
('v_cb9zfy', '/', 'Mobile', '2026-05-11T04:14:22.048034'),
('v_g75rfy', '/', 'Desktop', '2026-05-11T04:19:45.748913'),
('v_9js687', '/', 'Desktop', '2026-05-11T04:20:54.003052'),
('v_9js687', '/login', 'Desktop', '2026-05-11T04:21:14.437512'),
('v_9js687', '/admin', 'Desktop', '2026-05-11T04:21:18.006992'),
('v_5j2ovg', '/', 'Desktop', '2026-05-16T23:16:24.107797'),
('v_5j2ovg', '/', 'Desktop', '2026-05-16T23:16:24.915049'),
('v_5j2ovg', '/', 'Desktop', '2026-05-16T23:16:25.044782'),
('v_a3ww1t', '/', 'Desktop', '2026-05-16T23:16:25.103743'),
('v_a3ww1t', '/', 'Desktop', '2026-05-16T23:16:25.938266'),
('v_5j2ovg', '/', 'Desktop', '2026-05-16T23:16:26.037332'),
('v_5j2ovg', '/', 'Desktop', '2026-05-16T23:16:26.508118'),
('v_5j2ovg', '/login', 'Desktop', '2026-05-16T23:16:27.043146'),
('v_5j2ovg', '/login', 'Desktop', '2026-05-16T23:16:27.612661'),
('v_5j2ovg', '/login', 'Desktop', '2026-05-16T23:16:27.904284'),
('v_5j2ovg', '/login', 'Desktop', '2026-05-16T23:16:27.903626'),
('v_5j2ovg', '/login', 'Desktop', '2026-05-16T23:16:28.274769'),
('v_5j2ovg', '/login', 'Desktop', '2026-05-16T23:16:28.749549'),
('v_5j2ovg', '/login', 'Desktop', '2026-05-16T23:16:29.109146'),
('v_5j2ovg', '/', 'Desktop', '2026-05-16T23:16:29.303463'),
('v_hh6n98', '/', 'Desktop', '2026-05-16T23:16:29.583864'),
('v_hh6n98', '/', 'Desktop', '2026-05-16T23:16:29.658698'),
('v_5j2ovg', '/admin/login', 'Desktop', '2026-05-16T23:16:29.661669'),
('v_hh6n98', '/', 'Desktop', '2026-05-16T23:16:29.809737'),
('v_hh6n98', '/login', 'Desktop', '2026-05-16T23:16:30.682224'),
('v_v6zrfr', '/', 'Desktop', '2026-05-16T23:16:31.058993'),
('v_5j2ovg', '/', 'Desktop', '2026-05-16T23:16:31.593337'),
('v_w4l92g', '/', 'Desktop', '2026-05-16T23:16:32.327253'),
('v_a3ww1t', '/', 'Desktop', '2026-05-16T23:16:32.345976'),
('v_lgk0tw', '/', 'Desktop', '2026-05-16T23:16:32.488873'),
('v_5j2ovg', '/login', 'Desktop', '2026-05-16T23:16:33.029066'),
('v_8o0kw5', '/', 'Desktop', '2026-05-19T02:08:56.539919'),
('v_8o0kw5', '/', 'Desktop', '2026-05-19T02:41:14.582341'),
('v_9js687', '/', 'Desktop', '2026-05-19T02:41:41.553344'),
('v_u6v30f', '/', 'Desktop', '2026-05-19T02:45:29.647843'),
('v_8o0kw5', '/', 'Desktop', '2026-05-19T02:45:31.711456'),
('v_u6v30f', '/', 'Desktop', '2026-05-19T02:51:53.371128'),
('v_8o0kw5', '/', 'Desktop', '2026-05-19T02:51:53.986048'),
('v_u6v30f', '/', 'Desktop', '2026-05-19T02:54:20.820983'),
('v_8o0kw5', '/', 'Desktop', '2026-05-19T02:54:20.964205'),
('v_u6v30f', '/', 'Desktop', '2026-05-19T02:54:23.946904'),
('v_u6v30f', '/', 'Desktop', '2026-05-19T03:00:22.437229'),
('v_8o0kw5', '/', 'Desktop', '2026-05-19T03:00:23.153732'),
('v_8o0kw5', '/', 'Desktop', '2026-05-19T03:05:08.714308'),
('v_u6v30f', '/', 'Desktop', '2026-05-19T03:05:11.278574'),
('v_u6v30f', '/', 'Desktop', '2026-05-19T03:10:43.71964'),
('v_u6v30f', '/', 'Desktop', '2026-05-19T03:11:00.784558'),
('v_8o0kw5', '/', 'Desktop', '2026-05-19T03:11:01.038847'),
('v_u6v30f', '/', 'Desktop', '2026-05-19T03:11:32.909187'),
('v_9js687', '/', 'Desktop', '2026-05-19T03:18:36.599855'),
('v_9js687', '/', 'Desktop', '2026-05-19T03:21:08.352686'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T03:31:35.237035'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T03:31:35.258752'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T03:33:13.404969'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T03:38:38.398605'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T03:38:38.968208'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T03:38:42.136906'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T03:38:47.906423'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T03:39:41.827073'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T03:44:28.934031'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T03:44:29.740537'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T03:44:31.130754'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T03:52:39.254302'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T04:01:59.935472'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T04:01:59.991391'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T04:02:02.492852'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T04:02:44.080268'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T04:07:32.810762'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T04:07:33.08552'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T04:52:18.366394'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T04:52:18.406428'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T04:52:26.622454'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T05:52:26.909027'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T05:55:14.041457'),
('v_cb9zfy', '/', 'Mobile', '2026-05-19T05:55:28.577537'),
('v_77kg2w', '/', 'Desktop', '2026-05-19T05:56:15.9338'),
('v_77kg2w', '/', 'Desktop', '2026-05-19T05:56:21.596167'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T05:56:48.759105'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T05:56:48.760091'),
('v_77kg2w', '/', 'Desktop', '2026-05-19T05:56:51.809246'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T06:00:49.136825'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T06:00:49.18291'),
('v_77kg2w', '/', 'Desktop', '2026-05-19T06:01:02.541189'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T06:07:52.492845'),
('v_77kg2w', '/', 'Desktop', '2026-05-19T06:07:52.588194'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T06:07:52.588551'),
('v_cb9zfy', '/', 'Mobile', '2026-05-19T06:57:45.77368'),
('v_cb9zfy', '/', 'Mobile', '2026-05-19T06:58:28.510775'),
('v_cb9zfy', '/', 'Mobile', '2026-05-19T06:58:34.492171'),
('v_cb9zfy', '/', 'Mobile', '2026-05-19T06:58:40.595397'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T06:59:21.126918'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T07:20:48.41084'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T07:50:31.845032'),
('v_77kg2w', '/', 'Desktop', '2026-05-19T09:26:24.418594'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T15:33:08.262681'),
('v_8o0kw5', '/', 'Desktop', '2026-05-19T15:37:37.10607'),
('v_8o0kw5', '/denah-kampus', 'Desktop', '2026-05-19T15:42:18.532921'),
('v_8o0kw5', '/', 'Desktop', '2026-05-19T15:42:24.812508'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T15:44:20.298881'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T15:45:09.653353'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T15:46:19.113019'),
('v_8o0kw5', '/', 'Desktop', '2026-05-19T15:46:19.673739'),
('v_g75rfy', '/', 'Desktop', '2026-05-19T15:47:43.021958'),
('v_77kg2w', '/', 'Desktop', '2026-05-19T15:54:47.779039'),
('v_8ljqm4', '/', 'Desktop', '2026-05-19T15:57:33.344447'),
('v_77kg2w', '/', 'Desktop', '2026-05-19T15:57:38.985072'),
('v_77kg2w', '/', 'Desktop', '2026-05-20T01:18:06.31439'),
('v_77kg2w', '/', 'Desktop', '2026-05-20T01:18:10.003032'),
('v_54wk0m', '/', 'Desktop', '2026-05-20T05:37:44.945948'),
('v_jwtfr0', '/', 'Desktop', '2026-05-20T05:40:08.592372'),
('v_8ljqm4', '/', 'Desktop', '2026-05-20T05:40:08.729447'),
('v_54wk0m', '/', 'Desktop', '2026-05-20T05:40:20.046322'),
('v_54wk0m', '/', 'Desktop', '2026-05-20T05:40:33.597691'),
('v_8ljqm4', '/', 'Desktop', '2026-05-20T05:42:59.706389'),
('v_8ljqm4', '/', 'Desktop', '2026-05-20T05:42:59.746338'),
('v_g75rfy', '/', 'Desktop', '2026-05-20T05:43:03.407428'),
('v_8ljqm4', '/', 'Desktop', '2026-05-20T05:43:05.008164'),
('v_g75rfy', '/', 'Desktop', '2026-05-20T05:43:27.575268'),
('v_g75rfy', '/', 'Desktop', '2026-05-20T05:43:32.562372'),
('v_g75rfy', '/', 'Desktop', '2026-05-20T05:45:10.560037'),
('v_g75rfy', '/', 'Desktop', '2026-05-20T05:45:16.513011'),
('v_8ljqm4', '/', 'Desktop', '2026-05-20T05:47:31.950132'),
('v_8ljqm4', '/', 'Desktop', '2026-05-20T05:47:31.948631'),
('v_g75rfy', '/', 'Desktop', '2026-05-20T05:47:34.468209'),
('v_g75rfy', '/', 'Desktop', '2026-05-20T05:47:42.051317'),
('v_54wk0m', '/', 'Desktop', '2026-05-20T05:49:12.541243'),
('v_54wk0m', '/', 'Desktop', '2026-05-20T05:49:35.960255'),
('v_g75rfy', '/', 'Desktop', '2026-05-20T06:01:52.529816'),
('v_g75rfy', '/', 'Desktop', '2026-05-20T06:02:15.540143'),
('v_g75rfy', '/', 'Desktop', '2026-05-20T06:03:11.000107'),
('v_g75rfy', '/', 'Desktop', '2026-05-20T06:05:50.953533'),
('v_7opjrh', '/', 'Mobile', '2026-05-20T14:01:42.104067'),
('v_cb9zfy', '/', 'Mobile', '2026-05-21T12:58:37.166455');

-- =============================================================================
-- INSERT AUDIT LOGS
-- =============================================================================

INSERT INTO public.audit_logs (actor_id, actor_email, action, table_name, record_id, old_data, new_data, created_at) VALUES
('cef4ca0b-cc5a-4cf5-9e07-bb87b4affef6', 'admin@admin.upnvj.ac.id', 'create', 'gedung', '17', NULL, '{"id":17,"lokasi":"","url_foto":"","nama_gedung":"asdasd","jumlah_lantai":1,"deskripsi_gedung":"asd"}'::jsonb, '2026-05-11T02:41:46.665755'),
('cef4ca0b-cc5a-4cf5-9e07-bb87b4affef6', 'admin@admin.upnvj.ac.id', 'update', 'gedung', '17', '{"id":17,"lokasi":"","url_foto":"","nama_gedung":"asdasd","jumlah_lantai":1,"deskripsi_gedung":"asd"}'::jsonb, '{"id":17,"lokasi":"sss","url_foto":"","nama_gedung":"asdasd","jumlah_lantai":1,"deskripsi_gedung":"asd"}'::jsonb, '2026-05-11T02:41:53.690881'),
('cef4ca0b-cc5a-4cf5-9e07-bb87b4affef6', 'admin@admin.upnvj.ac.id', 'delete', 'gedung', '17', '{"id":17,"lokasi":"sss","url_foto":"","nama_gedung":"asdasd","jumlah_lantai":1,"deskripsi_gedung":"asd"}'::jsonb, NULL, '2026-05-11T02:41:56.804048'),
('cef4ca0b-cc5a-4cf5-9e07-bb87b4affef6', 'admin@admin.upnvj.ac.id', 'create', 'fasilitas', '204', NULL, '{"id":204,"color":"gray","lantai":1,"foto_url":"","id_gedung":14,"nama_fasilitas":"sdassad","tipe_fasilitas":"Laboratorium","deskripsi_fasilitas":"asd"}'::jsonb, '2026-05-11T04:22:02.913079'),
('cef4ca0b-cc5a-4cf5-9e07-bb87b4affef6', 'admin@admin.upnvj.ac.id', 'delete', 'fasilitas', '106', '{"id":106,"color":"pink","lantai":null,"foto_url":"https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/husni%20thamrin/sekretariat_doktoral.jpg","id_gedung":7,"nama_fasilitas":"Sekretariat Doktoral","tipe_fasilitas":"Administrasi","deskripsi_fasilitas":"Fasilitas administrasi dan layanan akademik program doktoral FEB."}'::jsonb, NULL, '2026-05-11T04:22:06.983021');
