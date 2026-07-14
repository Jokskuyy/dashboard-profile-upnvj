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
('Gedung Rektorat (jenderal soedirman)', 'Gedung rektorat dan pusat administrasi universitas', 'Area depan kampus utama Pondok Labu', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_rektorat.webp', 'soedirman'),
('Gedung DR. Soepomo', 'Gedung perpustakaan pusat dan laboratorium terpadu universitas', 'Zona pelayanan akademik', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_dr_soepomo.webp', 'soepomo'),
('Gedung Dr. Wahidin Sudiro Husodo', 'Gedung utama Fakultas Kedokteran', 'Klaster Fakultas Kedokteran', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_dr_wahidin_sudiro_husodo.webp', 'wahidin_sudiro_husodo'),
('Gedung Dr. Cipto Mangunkusumo', 'Gedung penunjang laboratorium dan skills lab Fakultas Kedokteran', 'Klaster Fakultas Kedokteran', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_dr_cipto_mangunkusumo.webp', 'cipto_mangunkusumo'),
('Gedung Abdul Rahman Saleh', 'Gedung fasilitas pendukung Fakultas Kedokteran dan laboratorium klinis', 'Perbatasan FK dan FISIP', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_abdul_rahman_saleh.webp', 'abdul_rahman_saleh'),
('Gedung Ki Hadjar Dewantara', 'Gedung Fakultas Ilmu Komputer dan laboratorium komputer', 'Klaster Fakultas Ilmu Komputer', 4, NULL, 'ki_hadjar_dewantara'),
('Gedung Muh. Husni Thamrin', 'Gedung Fakultas Ekonomi dan Bisnis', 'Klaster Fakultas Ekonomi dan Bisnis', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_moh_husni_thamrin.webp', 'thamrin'),
('Gedung Muhammad Yamin', 'Gedung Fakultas Ilmu Sosial dan Ilmu Politik', 'Klaster FISIP', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_muhammad_yamin.webp', 'yamin'),
('Gedung Yos Sudarso', 'Gedung Fakultas Hukum Program Sarjana', 'Klaster Fakultas Hukum', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_yos_sudarso.webp', 'yos_sudarso'),
('Gedung RA Kartini', 'Gedung Fakultas Hukum Pascasarjana', 'Klaster Fakultas Hukum', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_ra_kartini.webp', 'kartini'),
('Parkir Depan UPNVJ', 'Gedung parkir bertingkat untuk kendaraan mahasiswa dan staf', 'Sisi depan kampus', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_parkir_depan_upnvj.jpg', 'parkir_depan'),
('Parkir Belakang UPNVJ', 'Gedung parkir bertingkat untuk kendaraan mahasiswa dan staf', 'Sisi belakang kampus', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_parkir_belakang_upnvj.jpg', 'parkir_belakang'),
('Gedung Dewi Sartika', 'Gedung Fakultas Ilmu Komputer', 'Klaster Fakultas Ilmu Komputer', 4, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_gedung_dewi_sartika.webp', 'dewi_sartika'),
('Lapangan Upacara', 'Tempat upacara dan parkir mobil apabila sedang tidak dipakai', 'Area tengah kampus', 1, 'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/gedung/gedung_lapangan_upacara.jpg', 'lapangan_upacara'),
('Gedung Kuliah dan Kegiatan Mahasiswa', 'Gedung ruang kuliah dan sekretariat UKM', 'Area belakang kampus', 8, NULL, 'ukm'),
('Gedung Soetomo', 'Gedung perpustakaan utama kampus, ruang organisasi mahasiswa, dan Unit Kegiatan Mahasiswa UPN Veteran Jakarta', 'Kampus Pondok Labu', 4, NULL, 'soetomo'),
('Lapangan Basket', 'Lapangan basket outdoor untuk kegiatan olahraga mahasiswa dan staf', 'Area belakang kampus', 1, NULL, 'lapangan_basket'),
('Parkir Hukum', 'Parkir untuk kendaraan mahasiswa dan staf Fakultas Hukum', 'Sisi belakang kampus', 4, NULL, 'parkir_hukum'),
('Kantin', 'Kantin dan tempat makan mahasiswa, staf, dan dosen', 'Area samping kampus', 1, NULL, 'kantin');
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
    $$Ilmu Kesehatan Matra / UPNVERI yang mendukung kegiatan akademik, operasional, dan pelayanan di lingkungan Fakultas Kedokteran UPNVJ.$$,
    'Lainnya',
    1,
    NULL,
    3,
    'wsh_upn_veri'
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
    'Administrasi & Layanan',
    1,
    NULL,
    3,
    'wsh_ruang_dosen_fk'
),
(
    'Ruang Program Studi Spesialis',
    $$Ruang Program Studi Spesialis yang mendukung kegiatan akademik, operasional, dan pelayanan di lingkungan Fakultas Kedokteran UPNVJ.$$,
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
    $$Musholla FK UPNVJ yang mendukung kegiatan akademik, operasional, dan pelayanan di lingkungan Fakultas Kedokteran UPNVJ.$$,
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
    $$Ruang Podcast/mitek/meeting FK UPNVJ yang mendukung kegiatan akademik, operasional, dan pelayanan di lingkungan Fakultas Kedokteran UPNVJ.$$,
    'Laboratorium',
    2,
    NULL,
    3,
    'wsh_podcast_meeting'
),
(
    'Ruang Prodi Profesi',
    $$Ruang Prodi Profesi yang mendukung kegiatan akademik, operasional, dan pelayanan di lingkungan Fakultas Kedokteran UPNVJ.$$,
    'Lainnya',
    2,
    NULL,
    3,
    'wsh_prodi_profesi'
),
(
    'Ruang PSKPP',
    $$Ruang PSKPP yang mendukung kegiatan akademik, operasional, dan pelayanan di lingkungan Fakultas Kedokteran UPNVJ.$$,
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
    'Administrasi & Layanan',
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
    'Administrasi & Layanan',
    3,
    NULL,
    3,
    'wsh_ruang_dosen_patologi_klinik'
),
(
    'Ruang Kelas Farmasi',
    $$Ruang Kelas Farmasi yang mendukung kegiatan akademik, operasional, dan pelayanan di lingkungan Fakultas Kedokteran UPNVJ.$$,
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
    $$Ruang Multimedia yang mendukung kegiatan akademik, operasional, dan pelayanan di lingkungan Fakultas Kedokteran UPNVJ.$$,
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
    'Administrasi & Layanan',
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
    'Administrasi & Layanan',
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
    $$Ruang perkuliahan teori F.201 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
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
    'Administrasi & Layanan',
    2,
    NULL,
    5,
    'ars_ruang_server_wifi'
),
(
    'Ruang Kelas F.301',
    $$Ruang perkuliahan teori F.301 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f301'
),
(
    'Ruang Kelas F.302',
    $$Ruang perkuliahan teori F.302 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f302'
),
(
    'Ruang Kelas F.303',
    $$Ruang perkuliahan teori F.303 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f303'
),
(
    'Ruang Kelas F.304',
    $$Ruang perkuliahan teori F.304 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f304'
),
(
    'Ruang Kelas F.305',
    $$Ruang perkuliahan teori F.305 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f305'
),
(
    'Ruang Kelas F.306',
    $$Ruang perkuliahan teori F.306 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    3,
    NULL,
    5,
    'ars_ruang_kelas_f306'
),
(
    'Ruang Kelas F.307',
    $$Ruang perkuliahan teori F.307 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
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
    $$Ruang perkuliahan teori F.401 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    4,
    NULL,
    5,
    'ars_ruang_kelas_f401'
),
(
    'Ruang Kelas F.402',
    $$Ruang perkuliahan teori F.402 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    4,
    NULL,
    5,
    'ars_ruang_kelas_f402'
),
(
    'Ruang Kelas F.403',
    $$Ruang perkuliahan teori F.403 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    4,
    NULL,
    5,
    'ars_ruang_kelas_f403'
),
(
    'Ruang Kelas F.404',
    $$Ruang perkuliahan teori F.404 untuk kegiatan belajar mengajar, dilengkapi kursi kuliah, papan tulis, dan proyektor.$$,
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
    'Perpustakaan & Ruang Baca',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/digital_library.jpg',
    6,
    'khd_digital_library'
),
(
    'Pelayanan Mahasiswa FIK',
    $$Loket pelayanan akademik dan administrasi bagi mahasiswa Fakultas Ilmu Komputer, seperti pengurusan surat, KRS, dan informasi akademik.$$,
    'Lainnya',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/selasar_lantai_1.jpg',
    6,
    'khd_pelayanan_mahasiswa'
),
(
    'Ruang Dekan FIK',
    $$Ruang kerja Dekan Fakultas Ilmu Komputer untuk kegiatan administrasi, koordinasi, dan pengambilan keputusan tingkat fakultas.$$,
    'Administrasi & Layanan',
    1,
    NULL,
    6,
    'khd_ruang_dekan'
),
(
    'Ruang Kepala Program Studi FIK',
    $$Ruang kerja Kepala Program Studi Fakultas Ilmu Komputer untuk pengelolaan kurikulum, akademik, dan kemahasiswaan program studi.$$,
    'Lainnya',
    1,
    NULL,
    6,
    'khd_kaprodi'
),
(
    'Ruang Podcast FIK',
    $$Ruang podcast Fakultas Ilmu Komputer yang dilengkapi dengan peralatan rekaman audio dan video profesional, digunakan untuk produksi konten digital, wawancara, dan kegiatan penyiaran mahasiswa.$$,
    'Laboratorium',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/digital_library.jpg',
    6,
    'khd_podcast'
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
    'Ruang Dosen FIK',
    $$Ruang kerja dan transit dosen Fakultas Ilmu Komputer untuk persiapan mengajar, bimbingan mahasiswa, dan kegiatan akademik.$$,
    'Administrasi & Layanan',
    2,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_software_engineering_201.jpg',
    6,
    'khd_ruang_dosen'
),
(
    'Ruang Kuliah 202',
    $$Ruang perkuliahan di lantai 2 Gedung Ki Hadjar Dewantara untuk kegiatan belajar mengajar mahasiswa Fakultas Ilmu Komputer, dilengkapi proyektor dan papan tulis.$$,
    'Ruang Kuliah',
    2,
    NULL,
    6,
    'khd_202'
),
(
    'Ruang Kuliah 203',
    $$Ruang perkuliahan di lantai 2 Gedung Ki Hadjar Dewantara untuk kegiatan belajar mengajar mahasiswa Fakultas Ilmu Komputer, dilengkapi proyektor dan papan tulis.$$,
    'Ruang Kuliah',
    2,
    NULL,
    6,
    'khd_203'
),
(
    'Sekretariat Laboratorium',
    $$Ruang sekretariat laboratorium yang berfungsi sebagai pusat administrasi dan koordinasi kegiatan laboratorium.$$,
    'Laboratorium',
    2,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/sekretariat_laboratorium.jpg',
    6,
    'khd_sekretariat_ikatik'
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
    'Lab Immersive dan Multimedia / Programming',
    $$Pusat praktikum dan penelitian di bidang pemrograman komputer dengan fasilitas komputer terbaru, internet berkecepatan tinggi, proyektor, dan papan tulis digital.$$,
    'Laboratorium',
    3,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_immersive_dan_multimedia.jpg',
    6,
    'khd_301_lab'
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
    'Lab E-Governance / Database',
    $$Pusat praktikum dan penelitian bidang manajemen basis data dengan komputer berperforma tinggi dan perangkat lunak database terkini seperti SQL Server, Oracle, dan MySQL.$$,
    'Laboratorium',
    4,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_e_governance.jpg',
    6,
    'khd_403_lab'
),
(
    'Lab Enterprise System / Business Intelligence',
    $$Pusat praktikum dan penelitian bidang intelijen bisnis dengan komputer berperforma tinggi, perangkat lunak analitik terkini, dan platform visualisasi data.$$,
    'Laboratorium',
    4,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/lab_enterprise_system.jpg',
    6,
    'khd_402_lab'
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
    'Masjid',
    $$Masjid di lingkungan kampus UPNVJ$$,
    'Fasilitas Ibadah',
    NULL,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/kihadjar/masjid.jpg',
    6,
    'masjid'
),


-- Gedung 9: Gedung Yos Sudarso
(
    'Ruang Administrasi',
    $$Ruang administrasi pada Gedung Yos Sudarso.$$,
    'Administrasi & Layanan',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_administrasi_yos_sudarso.png',
    9,
    NULL
),
(
    'Ruang Dosen Lantai 1',
    $$Ruang dosen pada lantai 1 Gedung Yos Sudarso.$$,
    'Administrasi & Layanan',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_dosen_yos_sudarso_lantai_1.png',
    9,
    NULL
),
(
    'Selasar Kanan',
    $$Selasar kanan pada lantai 1 Gedung Yos Sudarso.$$,
    'Lainnya',
    1,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/selasar_kanan_yos_sudarso.jpg',
    9,
    NULL
),
(
    'Selasar Kiri',
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
    'Ruang Dosen Lantai 2',
    $$Ruang dosen pada lantai 2 Gedung Yos Sudarso.$$,
    'Administrasi & Layanan',
    2,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_dosen_yos_sudarso_lantai_2.png',
    9,
    NULL
),
(
    'Ruang Rapat Lantai 2',
    $$Ruang rapat pada lantai 2 Gedung Yos Sudarso.$$,
    'Lainnya',
    2,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_rapat_yos_sudarso_lantai_2.jpg',
    9,
    NULL
),
(
    'Smartclass Lantai 2',
    $$Smartclass yang digunakan pada lantai 2 Gedung Yos Sudarso.$$,
    'Lainnya',
    2,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/smartclass_yos_sudarso_lantai_3.jpg',
    9,
    NULL
),
(
    'Ruang Baca',
    $$Ruang baca pada lantai 3 Gedung Yos Sudarso.$$,
    'Perpustakaan & Ruang Baca',
    3,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/ruang_baca_yos_sudarso.jpg',
    9,
    NULL
),
(
    'Smartclass Lantai 3',
    $$Smartclass yang digunakan pada lantai 3 Gedung Yos Sudarso.$$,
    'Lainnya',
    3,
    'https://aaysacqsibquiulpdzwz.supabase.co/storage/v1/object/public/Gambar%20Gedung%20dan%20Fasilitas/fasilitas/yos%20sudarso/smartclass_yos_sudarso_lantai_3.jpg',
    9,
    NULL
),
(
    'Ruang Podcast',
    $$Ruang podcast pada lantai 4 Gedung Yos Sudarso.$$,
    'Laboratorium',
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
    'Ruang Dosen dan Staff Administrasi Doktor (S3) Hukum',
    $$Ruang dosen dan staff administrasi Program Doktor (S3) Hukum pada lantai 1 Gedung RA Kartini.$$,
    'Administrasi & Layanan',
    1,
    NULL,
    10,
    'rak_dosen_staff_doktor_hukum'
),
(
    'Ruang Kelas 101',
    $$Ruang perkuliahan 101 di lantai 1 Gedung RA Kartini untuk kegiatan belajar mengajar, dilengkapi kursi, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    1,
    NULL,
    10,
    'rak_kelas_101'
),
(
    'Ruang Kelas 102',
    $$Ruang perkuliahan 102 di lantai 1 Gedung RA Kartini untuk kegiatan belajar mengajar, dilengkapi kursi, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    1,
    NULL,
    10,
    'rak_kelas_102'
),
(
    'Laboratorium Farmasi Fakultas Kedokteran',
    $$Laboratorium Farmasi Fakultas Kedokteran pada lantai 1 Gedung RA Kartini.$$,
    'Laboratorium',
    1,
    NULL,
    10,
    'rak_lab_farmasi_fk'
),
(
    'Ruang UPT Pengembangan Karir dan Kewirausahaan',
    $$Ruang UPT Pengembangan Karir dan Kewirausahaan pada lantai 1 Gedung RA Kartini.$$,
    'Administrasi & Layanan',
    1,
    NULL,
    10,
    'rak_upt_pengembangan_karir'
),
(
    'Ruang Ujian UPA Bahasa dan Ruang Sidang S3',
    $$1 ruang fisik yang difungsikan sebagai Ruang Ujian UPA Bahasa sekaligus Ruang Sidang S3 pada lantai 2 Gedung RA Kartini. Alias: Ruang Sidang Doktor, Ruang Sidang S3.$$,
    'Ruang Kuliah',
    2,
    NULL,
    10,
    'rak_ujian_upa_sidang_s3'
),
(
    'Ruang Diskusi dan Ruang Instruktur UPA Bahasa',
    $$1 ruang fisik yang difungsikan sebagai ruang diskusi dan ruang instruktur UPA Bahasa pada lantai 2 Gedung RA Kartini.$$,
    'Ruang Kuliah',
    2,
    NULL,
    10,
    'rak_diskusi_instruktur_upa_bahasa'
),
(
    'Lab Bahasa dan Ruang Ujian UPA Bahasa',
    $$1 ruang fisik: laboratorium bahasa yang juga digunakan sebagai ruang ujian UPA Bahasa pada lantai 2 Gedung RA Kartini. Alias: Lab Bahasa, Ruang Ujian UPA Bahasa.$$,
    'Laboratorium',
    2,
    NULL,
    10,
    'rak_lab_bahasa_ujian_upa'
),
(
    'Ruang Kelas 201',
    $$Ruang perkuliahan 201 di lantai 2 Gedung RA Kartini untuk kegiatan belajar mengajar, dilengkapi kursi, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    2,
    NULL,
    10,
    'rak_kelas_201'
),
(
    'Ruang Guru Besar dan Pengelola Jurnal',
    $$Ruang Guru Besar dan Pengelola Jurnal pada lantai 2 Gedung RA Kartini.$$,
    'Administrasi & Layanan',
    2,
    NULL,
    10,
    'rak_guru_besar_pengelola_jurnal'
),
(
    'UPA Bahasa',
    $$Ruang layanan Unit Pelaksana Akademik (UPA) Bahasa pada lantai 2 Gedung RA Kartini.$$,
    'Administrasi & Layanan',
    2,
    NULL,
    10,
    'rak_upa_bahasa'
),
(
    'Ruang Ujian UPA Bahasa R.301',
    $$Ruang ujian UPA Bahasa R.301 di lantai 3 Gedung RA Kartini untuk pelaksanaan tes kemampuan bahasa bagi mahasiswa.$$,
    'Ruang Kuliah',
    3,
    NULL,
    10,
    'rak_ujian_upa_bahasa_301'
),
(
    'Ruang Ujian UPA Bahasa R.302',
    $$Ruang ujian UPA Bahasa R.302 di lantai 3 Gedung RA Kartini untuk pelaksanaan tes kemampuan bahasa bagi mahasiswa.$$,
    'Ruang Kuliah',
    3,
    NULL,
    10,
    'rak_ujian_upa_bahasa_302'
),
(
    'Ruang Ujian UPA Bahasa R.303',
    $$Ruang ujian UPA Bahasa R.303 di lantai 3 Gedung RA Kartini untuk pelaksanaan tes kemampuan bahasa bagi mahasiswa.$$,
    'Ruang Kuliah',
    3,
    NULL,
    10,
    'rak_ujian_upa_bahasa_303'
),
(
    'Ruang Ujian UPA Bahasa R.304',
    $$Ruang ujian UPA Bahasa R.304 di lantai 3 Gedung RA Kartini untuk pelaksanaan tes kemampuan bahasa bagi mahasiswa.$$,
    'Ruang Kuliah',
    3,
    NULL,
    10,
    'rak_ujian_upa_bahasa_304'
),
(
    'Ruang Ujian UPA Bahasa R.305',
    $$Ruang ujian UPA Bahasa R.305 di lantai 3 Gedung RA Kartini untuk pelaksanaan tes kemampuan bahasa bagi mahasiswa.$$,
    'Ruang Kuliah',
    3,
    NULL,
    10,
    'rak_ujian_upa_bahasa_305'
),
(
    'Ruang Ujian UPA Bahasa R.306',
    $$Ruang ujian UPA Bahasa R.306 di lantai 3 Gedung RA Kartini untuk pelaksanaan tes kemampuan bahasa bagi mahasiswa.$$,
    'Ruang Kuliah',
    3,
    NULL,
    10,
    'rak_ujian_upa_bahasa_306'
),
-- Fasilitas RA Kartini Lantai 4 (Kelas 401-406)
(
    'Ruang Kelas 401',
    $$Ruang perkuliahan 401 di lantai 4 Gedung RA Kartini untuk kegiatan belajar mengajar, dilengkapi kursi, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    4,
    NULL,
    10,
    'rak_ujian_upa_bahasa_401'
),
(
    'Ruang Kelas 402',
    $$Ruang perkuliahan 402 di lantai 4 Gedung RA Kartini untuk kegiatan belajar mengajar, dilengkapi kursi, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    4,
    NULL,
    10,
    'rak_ujian_upa_bahasa_402'
),
(
    'Ruang Kelas 403',
    $$Ruang perkuliahan 403 di lantai 4 Gedung RA Kartini untuk kegiatan belajar mengajar, dilengkapi kursi, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    4,
    NULL,
    10,
    'rak_ujian_upa_bahasa_403'
),
(
    'Ruang Kelas 404',
    $$Ruang perkuliahan 404 di lantai 4 Gedung RA Kartini untuk kegiatan belajar mengajar, dilengkapi kursi, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    4,
    NULL,
    10,
    'rak_ujian_upa_bahasa_404'
),
(
    'Ruang Kelas 405',
    $$Ruang perkuliahan 405 di lantai 4 Gedung RA Kartini untuk kegiatan belajar mengajar, dilengkapi kursi, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    4,
    NULL,
    10,
    'rak_ujian_upa_bahasa_405'
),
(
    'Ruang Kelas 406',
    $$Ruang perkuliahan 406 di lantai 4 Gedung RA Kartini untuk kegiatan belajar mengajar, dilengkapi kursi, papan tulis, dan proyektor.$$,
    'Ruang Kuliah',
    4,
    NULL,
    10,
    'rak_ujian_upa_bahasa_406'
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
    $$Ruang sekretariat Badan Eksekutif Mahasiswa (BEM) FIK di Gedung Dewi Sartika, sebagai pusat koordinasi program kerja dan kegiatan kemahasiswaan.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_bem'
),
(
    'Ruang SENAT FIK',
    $$Ruang sekretariat Senat Mahasiswa FIK di Gedung Dewi Sartika, sebagai lembaga perwakilan dan pengawasan kegiatan kemahasiswaan.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_senat'
),
(
    'Ruang UKM Basket',
    $$Ruang sekretariat dan kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota UKM.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_basket'
),
(
    'Ruang UKM Boxer',
    $$Ruang sekretariat dan kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota UKM.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_boxer'
),
(
    'Ruang UKM Bulu Tangkis',
    $$Ruang sekretariat dan kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota UKM.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_bulu_tangkis'
),
(
    'Ruang UKM Catur',
    $$Ruang sekretariat dan kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota UKM.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_catur'
),
(
    'Ruang UKM Futsal',
    $$Ruang sekretariat dan kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota UKM.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_futsal'
),
(
    'Ruang UKM Jujitsu',
    $$Ruang sekretariat dan kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota UKM.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_jujitsu'
),
(
    'Ruang UKM Katolik',
    $$Ruang sekretariat dan kegiatan Unit Kegiatan Mahasiswa di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota UKM.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_katolik'
),
(
    'Ruang UKM MC',
    $$Ruang sekretariat dan kegiatan Unit Kegiatan Mahasiswa (UKM MC) di Gedung Dewi Sartika lantai 1, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_mc'
),
-- Restored dari commit 024ba7a (fasilitas Dewi Sartika yang sebelumnya terpotong)
(
    'Ruang UKM UBV',
    $$Ruang sekretariat dan kegiatan UKM UBV di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_ubv'
),
(
    'Ruang UKM UFO',
    $$Ruang sekretariat dan kegiatan UKM UFO di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_ufo'
),
(
    'Ruang UKM Seni Tari',
    $$Ruang sekretariat dan kegiatan UKM Seni Tari di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_seni_tari'
),
(
    'Ruang UKM Voli',
    $$Ruang sekretariat dan kegiatan UKM Voli di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_voli'
),
(
    'Ruang UKM Pencak Silat',
    $$Ruang sekretariat dan kegiatan UKM Pencak Silat di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_pencak_silat'
),
(
    'Ruang UKM Paduan Suara',
    $$Ruang sekretariat dan kegiatan UKM Paduan Suara di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_paduan_suara'
),
(
    'Ruang UKM Protestan',
    $$Ruang sekretariat dan kegiatan UKM Protestan di Gedung Dewi Sartika, menjadi tempat berkumpul, berlatih, dan berkoordinasi bagi anggota.$$,
    'Ruang Kegiatan Mahasiswa',
    1,
    NULL,
    13,
    'ds_ukm_protestan'
),
(
    'Ruang Kuliah 201',
    $$Ruang perkuliahan di lantai 2 Gedung Dewi Sartika untuk kegiatan belajar mengajar mahasiswa Fakultas Ilmu Komputer, dilengkapi proyektor dan papan tulis.$$,
    'Ruang Kuliah',
    2,
    NULL,
    13,
    'ds_201'
),
(
    'Ruang Kuliah 202',
    $$Ruang perkuliahan di lantai 2 Gedung Dewi Sartika untuk kegiatan belajar mengajar mahasiswa Fakultas Ilmu Komputer, dilengkapi proyektor dan papan tulis.$$,
    'Ruang Kuliah',
    2,
    NULL,
    13,
    'ds_202'
),
(
    'Ruang Kuliah 203',
    $$Ruang perkuliahan di lantai 2 Gedung Dewi Sartika untuk kegiatan belajar mengajar mahasiswa Fakultas Ilmu Komputer, dilengkapi proyektor dan papan tulis.$$,
    'Ruang Kuliah',
    2,
    NULL,
    13,
    'ds_203'
),
(
    'Ruang Kuliah 301',
    $$Ruang perkuliahan di lantai 3 Gedung Dewi Sartika untuk kegiatan belajar mengajar mahasiswa Fakultas Ilmu Komputer, dilengkapi proyektor dan papan tulis.$$,
    'Ruang Kuliah',
    3,
    NULL,
    13,
    'ds_301'
),
(
    'Ruang Kuliah 302',
    $$Ruang perkuliahan di lantai 3 Gedung Dewi Sartika untuk kegiatan belajar mengajar mahasiswa Fakultas Ilmu Komputer, dilengkapi proyektor dan papan tulis.$$,
    'Ruang Kuliah',
    3,
    NULL,
    13,
    'ds_302'
),
(
    'Ruang Kuliah 303',
    $$Ruang perkuliahan di lantai 3 Gedung Dewi Sartika untuk kegiatan belajar mengajar mahasiswa Fakultas Ilmu Komputer, dilengkapi proyektor dan papan tulis.$$,
    'Ruang Kuliah',
    3,
    NULL,
    13,
    'ds_303'
),
(
    'Ruang Kuliah 401',
    $$Ruang perkuliahan di lantai 4 Gedung Dewi Sartika untuk kegiatan belajar mengajar mahasiswa Fakultas Ilmu Komputer, dilengkapi proyektor dan papan tulis.$$,
    'Ruang Kuliah',
    4,
    NULL,
    13,
    'ds_401'
),
(
    'Ruang Kuliah 402',
    $$Ruang perkuliahan di lantai 4 Gedung Dewi Sartika untuk kegiatan belajar mengajar mahasiswa Fakultas Ilmu Komputer, dilengkapi proyektor dan papan tulis.$$,
    'Ruang Kuliah',
    4,
    NULL,
    13,
    'ds_402'
),
(
    'Ruang Kuliah 403',
    $$Ruang perkuliahan di lantai 4 Gedung Dewi Sartika untuk kegiatan belajar mengajar mahasiswa Fakultas Ilmu Komputer, dilengkapi proyektor dan papan tulis.$$,
    'Ruang Kuliah',
    4,
    NULL,
    13,
    'ds_403_mesh'
)
;


-- Gedung 17: Gedung Soetomo
INSERT INTO public.fasilitas (nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, lantai, id_gedung, unity_object_name) VALUES
('TechnoWater Water Station', 'Fasilitas penyediaan air minum gratis (water station) TechnoWater pada lantai 1 Gedung Soetomo.', 'Lainnya', 1, 17, 'stm_technowater'),
('Ruang Majelis Permusyawaratan Mahasiswa (MPM)', 'Ruang organisasi Majelis Permusyawaratan Mahasiswa (MPM) pada lantai 1 Gedung Soetomo. Dikenal juga sebagai MPM UPNVJ.', 'Ruang Kegiatan Mahasiswa', 1, 17, 'stm_mpm'),
('Ruang Badan Perwakilan Mahasiswa (BPM)', 'Ruang organisasi Badan Perwakilan Mahasiswa (BPM) pada lantai 1 Gedung Soetomo. Dikenal juga sebagai BPM UPNVJ.', 'Ruang Kegiatan Mahasiswa', 1, 17, 'stm_bpm'),
('Ruang Teater', 'Ruang teater pada lantai 1 Gedung Soetomo untuk kegiatan pertunjukan seni, latihan, dan aktivitas kemahasiswaan.', 'Auditorium & Aula', 1, 17, 'stm_ruang_teater'),
('Studio Latihan Tari', 'Studio latihan tari pada lantai 1 Gedung Soetomo untuk kegiatan seni tari dan latihan Unit Kegiatan Mahasiswa.', 'Laboratorium', 1, 17, 'stm_studio_latihan_tari'),
('Lobby Perpustakaan', 'Area lobby perpustakaan pada lantai 1 Gedung Soetomo sebagai area penerima dan akses utama menuju fasilitas perpustakaan.', 'Administrasi & Layanan', 1, 17, 'stm_lobby_perpustakaan'),
('Ruang Diskusi', 'Ruang diskusi pada lantai 1 Gedung Soetomo untuk kegiatan belajar kelompok dan diskusi mahasiswa.', 'Ruang Kuliah', 1, 17, 'stm_ruang_diskusi_l1'),
('Ruang UKM Girigahana', 'Ruang sekretariat Unit Kegiatan Mahasiswa Girigahana pada lantai 1 area Ekstension Gedung Soetomo.', 'Ruang Kegiatan Mahasiswa', 1, 17, 'stm_ukm_girigahana'),
('Ruang Aspirasi', 'Ruang pada lantai 1 area Ekstension Gedung Soetomo dengan tulisan "Aspirasi". Fungsi spesifik perlu dikonfirmasi (kemungkinan organisasi atau media mahasiswa).', 'Ruang Kegiatan Mahasiswa', 1, 17, 'stm_aspirasi'),
('Ruang UKM Mapala', 'Ruang sekretariat Unit Kegiatan Mahasiswa Mapala pada lantai 1 area Ekstension Gedung Soetomo.', 'Ruang Kegiatan Mahasiswa', 1, 17, 'stm_ukm_mapala'),
('Ruang Akses Digital', 'Ruang akses digital pada lantai 2 Gedung Soetomo untuk pemanfaatan layanan digital dan akses informasi akademik perpustakaan.', 'Administrasi & Layanan', 2, 17, 'stm_ruang_akses_digital'),
('Ruang Multimedia', 'Ruang multimedia pada lantai 2 Gedung Soetomo untuk kegiatan pembelajaran, presentasi, dan akses media digital.', 'Laboratorium', 2, 17, 'stm_ruang_multimedia'),
('Ruang UKM Pencak Silat Veteran Jakarta (PSVJ)', 'Ruang sekretariat Unit Kegiatan Mahasiswa Pencak Silat Veteran Jakarta (PSVJ) pada lantai 2 area Ekstension Gedung Soetomo. Berbeda dari Ruang UKM Pencak Silat di Gedung Dewi Sartika.', 'Ruang Kegiatan Mahasiswa', 2, 17, 'stm_ukm_psvj'),
('Ruang UKM Tae Kwon Do', 'Ruang sekretariat Unit Kegiatan Mahasiswa Tae Kwon Do pada lantai 2 area Ekstension Gedung Soetomo.', 'Ruang Kegiatan Mahasiswa', 2, 17, 'stm_ukm_taekwondo'),
('Ruang UKM KSR PMI', 'Ruang sekretariat Unit Kegiatan Mahasiswa Korps Sukarela Palang Merah Indonesia (KSR PMI) pada lantai 2 area Ekstension Gedung Soetomo.', 'Ruang Kegiatan Mahasiswa', 2, 17, 'stm_ukm_ksr_pmi'),
('Ruang UKM Bulutangkis', 'Ruang sekretariat Unit Kegiatan Mahasiswa Bulutangkis pada lantai 2 area Ekstension Gedung Soetomo. Berbeda dari Ruang UKM Bulu Tangkis di Gedung Dewi Sartika.', 'Ruang Kegiatan Mahasiswa', 2, 17, 'stm_ukm_bulutangkis'),
('Perpustakaan Utama Kampus', 'Perpustakaan utama kampus pada lantai 3 Gedung Soetomo. Mencakup area: Pojok Bela Negara, Kazakhstan Corner, German Corner, Ruang Selasar, Ruang Komputer, Komputer E-paper, Ruang Diskusi, dan Rak Koleksi. Seluruh area ini merupakan bagian integral dari satu fasilitas perpustakaan.', 'Perpustakaan & Ruang Baca', 3, 17, 'stm_perpustakaan_utama')
-- ,('Perpustakaan Lantai 4', 'Area perpustakaan yang menempati keseluruhan lantai 4 Gedung Soetomo.', 'Perpustakaan & Ruang Baca', 4, 17, 'stm_perpustakaan_l4')
;
-- =============================================================================
-- DATA FASILITAS GEDUNG REKTORAT (id_gedung = 1)
-- =============================================================================
-- DATA FASILITAS GEDUNG REKTORAT (id_gedung = 1)
-- =============================================================================
INSERT INTO public.fasilitas (nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, lantai, id_gedung, unity_object_name) VALUES
-- Lantai 1
('Ruangan Senat Universitas Lembaga Konsultasi dan Bantuan Hukum', 'Ruangan Senat Universitas Lembaga Konsultasi dan Bantuan Hukum pada Lantai 1 Gedung Rektorat.', 'Administrasi & Layanan', 1, 1, 'rt_senat_univ'),
('Ruangan Mata Kuliah Wajib Kurikulum (MKWK)', 'Ruangan Mata Kuliah Wajib Kurikulum (MKWK) pada Lantai 1 Gedung Rektorat.', 'Administrasi & Layanan', 1, 1, 'rt_mkwk'),
('Ruangan Kantor Urusan Internasional', 'Ruangan Kantor Urusan Internasional (KUI) pada Lantai 1 Gedung Rektorat.', 'Administrasi & Layanan', 1, 1, 'rt_kui'),
('Ruangan Kepala Pusat Pemeringkatan & Kepala Pusat MKWU', 'Ruangan Kepala Pusat Pemeringkatan & Kepala Pusat MKWU pada Lantai 1 Gedung Rektorat.', 'Administrasi & Layanan', 1, 1, 'rt_kep_pemeringkatan'),
('Ruang Tamu Bersama', 'Ruang Tamu Bersama pada Lantai 1 Gedung Rektorat.', 'Administrasi & Layanan', 1, 1, 'rt_ruang_tamu_bersama'),
('Ruangan HUMAS', 'Ruangan Hubungan Masyarakat (HUMAS) pada Lantai 1 Gedung Rektorat.', 'Administrasi & Layanan', 1, 1, 'rt_humas'),
('Ruang Dewan Pengawas', 'Ruang Dewan Pengawas pada Lantai 1 Gedung Rektorat.', 'Administrasi & Layanan', 1, 1, 'rt_dewas'),
('Ruang Pusat Kajian Bela Negara', 'Ruang Pusat Kajian Bela Negara pada Lantai 1 Gedung Rektorat.', 'Administrasi & Layanan', 1, 1, 'rt_puska'),
('Ruangan unit Layanan Terpadu & Informasi Publik', 'Ruangan unit Layanan Terpadu & Informasi Publik pada Lantai 1 Gedung Rektorat.', 'Administrasi & Layanan', 1, 1, 'rt_layanan_terpadu'),
('Bank BNI', 'Fasilitas perbankan BNI pada Lantai 1 Gedung Rektorat.', 'Administrasi & Layanan', 1, 1, 'rt_bni'),
('Plaza Penmaru Wardiman', 'Plaza Penmaru Wardiman pada Lantai 1 Gedung Rektorat.', 'Administrasi & Layanan', 1, 1, 'rt_wardiman'),

-- Lantai 2
('Ruangan Rapat Nusantara 1', 'Ruangan Rapat Nusantara 1 pada Lantai 2 Gedung Rektorat.', 'Administrasi & Layanan', 2, 1, 'rt_rapat_nusantara_1'),
('Ruangan Rapat Nusantara 2', 'Ruangan Rapat Nusantara 2 pada Lantai 2 Gedung Rektorat.', 'Administrasi & Layanan', 2, 1, 'rt_rapat_nusantara_2'),
('Ruangan Wakil Rektor 1', 'Ruangan Wakil Rektor 1 pada Lantai 2 Gedung Rektorat.', 'Administrasi & Layanan', 2, 1, 'rt_warek_1'),
('Ruangan Wakil Rektor 3', 'Ruangan Wakil Rektor 3 pada Lantai 2 Gedung Rektorat.', 'Administrasi & Layanan', 2, 1, 'rt_warek_3'),
('Ruangan Rapat Nusantara dan Ruangan Wakil Rektor 2', 'Ruangan Rapat Nusantara dan Ruangan Wakil Rektor 2 pada Lantai 2 Gedung Rektorat.', 'Administrasi & Layanan', 2, 1, 'rt_warek_2'),
('Ruang Kepegawaian', 'Ruang Kepegawaian pada Lantai 2 Gedung Rektorat.', 'Administrasi & Layanan', 2, 1, 'rt_kepegawaian'),
('UPA TIK', 'Unit Penunjang Akademik Teknologi Informasi dan Komunikasi (UPA TIK) pada Lantai 2 Gedung Rektorat.', 'Administrasi & Layanan', 2, 1, 'rt_upa_tik'),
('Ruangan Rektor', 'Ruangan Rektor pada Lantai 2 Gedung Rektorat.', 'Administrasi & Layanan', 2, 1, 'rt_rektorat'),
('Bagian Hukum & Tata Laksana', 'Bagian Hukum & Tata Laksana pada Lantai 2 Gedung Rektorat.', 'Administrasi & Layanan', 2, 1, 'rt_hukum_tata_laksana'),
('Ruang Staff', 'Ruang Staff pada Lantai 2 Gedung Rektorat.', 'Administrasi & Layanan', 2, 1, 'rt_staff'),

-- Lantai 3
('Ruangan Biro Perencanaan Umum Keuangan Dan Umum', 'Ruangan Biro Perencanaan Umum Keuangan Dan Umum pada Lantai 3 Gedung Rektorat.', 'Administrasi & Layanan', 3, 1, 'rt_ruku'),
('Ruangan Biro AKPK', 'Ruangan Biro Akademik, Kemahasiswaan, Perencanaan, dan Kerjasama (AKPK) pada Lantai 3 Gedung Rektorat.', 'Administrasi & Layanan', 3, 1, 'rt_akpk'),
('Pusat Pelayanan Keuangan Mahasiswa', 'Pusat Pelayanan Keuangan Mahasiswa pada Lantai 3 Gedung Rektorat.', 'Administrasi & Layanan', 3, 1, 'rt_pusat_keuangan'),
('Bagian Keuangan Biro Umum & Keuangan', 'Bagian Keuangan Biro Umum & Keuangan pada Lantai 3 Gedung Rektorat.', 'Administrasi & Layanan', 3, 1, 'rt_biro_umum_keuangan'),
('Ruangan Rapat Nusantara 4', 'Ruangan Rapat Nusantara 4 pada Lantai 3 Gedung Rektorat.', 'Administrasi & Layanan', 3, 1, 'rt_rapat_nusantara_4'),
('Ruang Tax Center', 'Ruang Tax Center pada Lantai 3 Gedung Rektorat.', 'Administrasi & Layanan', 3, 1, 'rt_tax_center'),
('Ruangan Pusat Kajian Bela Negara', 'Ruangan Pusat Kajian Bela Negara pada Lantai 3 Gedung Rektorat.', 'Administrasi & Layanan', 3, 1, 'rt_pkbn'),
('Ruangan Bidang Kemahasiswaan', 'Ruangan Bidang Kemahasiswaan pada Lantai 3 Gedung Rektorat.', 'Administrasi & Layanan', 3, 1, 'rt_kemahasiswaan'),
('Ruang Kelas Bank Mini 302', 'Ruang Kelas Bank Mini 302 pada Lantai 3 Gedung Rektorat.', 'Ruang Kuliah', 3, 1, 'rt_302'),

-- Lantai 4
('Ruang UPA LUK/LSP', 'Ruang UPA LUK/LSP (Lembaga Sertifikasi Profesi) pada Lantai 4 Gedung Rektorat.', 'Administrasi & Layanan', 4, 1, 'rt_upa_luk'),
('Ruangan Sub Bagian Pendanaan Barang dan Jasa', 'Ruangan Sub Bagian Pendanaan Barang dan Jasa pada Lantai 4 Gedung Rektorat.', 'Administrasi & Layanan', 4, 1, 'rt_pendanaan'),
('Ruangan Simulasi Bank Mini', 'Ruangan Simulasi Bank Mini pada Lantai 4 Gedung Rektorat.', 'Laboratorium', 4, 1, 'rt_simulasi_bank_mini'),
('Ruangan LPPM', 'Ruangan Lembaga Penelitian dan Pengabdian kepada Masyarakat (LPPM) pada Lantai 4 Gedung Rektorat.', 'Administrasi & Layanan', 4, 1, 'rt_lppm'),
('Lembaga Penjaminan Mutu dan Pengembangan Pembelajaran (LPMPP)', 'Ruangan Lembaga Penjaminan Mutu dan Pengembangan Pembelajaran (LPMPP) pada Lantai 4 Gedung Rektorat.', 'Administrasi & Layanan', 4, 1, 'rt_lpmpp'),
('Auditorium Bhineka Tunggal Ika', 'Auditorium Bhineka Tunggal Ika pada Lantai 4 Gedung Rektorat.', 'Auditorium & Aula', 4, 1, 'rt_auditorium_bki');
-- =============================================================================
-- DATA FASILITAS GEDUNG REKTORAT (id_gedung = 1)
-- =============================================================================
-- =============================================================================
-- DATA FASILITAS GEDUNG MOH. HUSNI THAMRIN (id_gedung = 7)
-- =============================================================================
INSERT INTO public.fasilitas (nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, lantai, id_gedung, unity_object_name) VALUES
-- Lantai 1
('Ruang Baca dan BI Corner', 'Ruang baca dan BI Corner pada lantai 1 Gedung Moh. Husni Thamrin (FEB).', 'Administrasi & Layanan', 1, 7, 'mt_bi_corner'),
('Ruang Jurusan Ilmu Ekonomi S1 dan Akuntansi', 'Ruang jurusan Ilmu Ekonomi S1 dan Akuntansi pada lantai 1 Gedung Moh. Husni Thamrin.', 'Administrasi & Layanan', 1, 7, 'mt_ekonomi_akutansi'),
('HMJ S1 Manajemen', 'Ruang Himpunan Mahasiswa Jurusan (HMJ) S1 Manajemen pada lantai 1 Gedung Moh. Husni Thamrin.', 'Ruang Kegiatan Mahasiswa', 1, 7, 'mt_hmj_manajemen'),
('HMJ S1 Akuntansi', 'Ruang Himpunan Mahasiswa Jurusan (HMJ) S1 Akuntansi pada lantai 1 Gedung Moh. Husni Thamrin.', 'Ruang Kegiatan Mahasiswa', 1, 7, 'mt_hmj_akutansi'),
('Ruang Tunggu Dosen FEB', 'Ruang tunggu dosen Fakultas Ekonomi dan Bisnis (FEB) pada lantai 1 Gedung Moh. Husni Thamrin.', 'Administrasi & Layanan', 1, 7, 'mt_ruang_dosen_feb'),
('Ruang LKEB dan Guru Besar', 'Ruang LKEB dan Guru Besar pada lantai 1 Gedung Moh. Husni Thamrin.', 'Administrasi & Layanan', 1, 7, 'mt_lkeb_guru_besar'),
('Ruangan Layanan Akademik dan Kemahasiswaan FEB', 'Ruangan layanan akademik dan kemahasiswaan Fakultas Ekonomi dan Bisnis pada lantai 1 Gedung Moh. Husni Thamrin.', 'Administrasi & Layanan', 1, 7, 'mt_layanan_mahasiswa'),
('Selasar FEB', 'Selasar Fakultas Ekonomi dan Bisnis pada lantai 1 Gedung Moh. Husni Thamrin.', 'Administrasi & Layanan', 1, 7, 'mt_selasar'),
('Ruang HIMA Akuntansi, Manajemen & Perbankan', 'Ruang Himpunan Mahasiswa (Hima) Akuntansi S1 & D3, Manajemen S1, Perbankan dan Keuangan D3 pada lantai 1 Gedung Moh. Husni Thamrin.', 'Ruang Kegiatan Mahasiswa', 1, 7, 'mt_hima'),

-- Lantai 2
('Ruang Sekretariat Program Magister Manajemen dan Akuntansi', 'Ruang sekretariat program Magister Manajemen dan Akuntansi pada lantai 2 Gedung Moh. Husni Thamrin.', 'Administrasi & Layanan', 2, 7, 'mt_sekretariat'),
('Ruang Kuliah Program Magister (1)', 'Ruang kuliah program magister (1) pada lantai 2 Gedung Moh. Husni Thamrin.', 'Ruang Kuliah', 2, 7, 'mt_kuliah_magister_1'),
('Ruang Jurusan Ilmu Ekonomi S1 dan Akuntansi', 'Ruang jurusan Ilmu Ekonomi S1 dan ruangan jurusan Akuntansi pada lantai 2 Gedung Moh. Husni Thamrin.', 'Administrasi & Layanan', 2, 7, 'mt_ekonomi_akuntansi'),
('Ruang Kuliah Program Magister (2)', 'Ruang kuliah program magister (2) pada lantai 2 Gedung Moh. Husni Thamrin.', 'Ruang Kuliah', 2, 7, 'mt_kuliah_magister_2'),
('Ruang Kelas 205', 'Ruang perkuliahan 205 di lantai 2 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 2, 7, 'mt_205'),
('Ruang Kelas 206', 'Ruang perkuliahan 206 di lantai 2 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 2, 7, 'mt_206'),
('Ruang Kelas 207', 'Ruang perkuliahan 207 di lantai 2 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 2, 7, 'mt_207'),
('Ruang Kelas 208', 'Ruang perkuliahan 208 di lantai 2 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 2, 7, 'mt_208'),
('Ruang Kelas 209', 'Ruang perkuliahan 209 di lantai 2 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 2, 7, 'mt_209'),
('Ruang Kelas 210', 'Ruang perkuliahan 210 di lantai 2 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 2, 7, 'mt_210'),

-- Lantai 3
('Ruang Mini Company (301)', 'Ruang Mini Company (Kelas 301) pada lantai 3 Gedung Moh. Husni Thamrin.', 'Laboratorium', 3, 7, 'mt_mini_company'),
('Mesh Classroom (302)', 'Mesh Classroom (Kelas 302) pada lantai 3 Gedung Moh. Husni Thamrin.', 'Ruang Kuliah', 3, 7, 'mt_mesh'),
('Ruang Kelas 303', 'Ruang perkuliahan 303 di lantai 3 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 7, 'mt_303'),
('Ruang Kelas 304', 'Ruang perkuliahan 304 di lantai 3 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 7, 'mt_304'),
('Ruang Kelas 305', 'Ruang perkuliahan 305 di lantai 3 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 7, 'mt_305'),
('Ruang Kelas 306', 'Ruang perkuliahan 306 di lantai 3 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 7, 'mt_306'),
('Ruang Kelas 307', 'Ruang perkuliahan 307 di lantai 3 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 7, 'mt_307'),
('Ruang Kelas 308', 'Ruang perkuliahan 308 di lantai 3 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 7, 'mt_308'),
('Ruang Kelas 309', 'Ruang perkuliahan 309 di lantai 3 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 7, 'mt_309'),
('Ruang Kelas 310', 'Ruang perkuliahan 310 di lantai 3 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 7, 'mt_310'),
('Ruang Kelas 311', 'Ruang perkuliahan 311 di lantai 3 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 7, 'mt_311'),

-- Lantai 4
('Mushola FEB', 'Fasilitas ibadah Mushola FEB pada lantai 4 Gedung Moh. Husni Thamrin.', 'Fasilitas Ibadah', 4, 7, 'mt_mushola'),
('Ruang Kelas 402', 'Ruang perkuliahan 402 di lantai 4 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 4, 7, 'mt_402'),
('Ruang Kelas 403', 'Ruang perkuliahan 403 di lantai 4 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 4, 7, 'mt_403'),
('Ruang Kelas 404', 'Ruang perkuliahan 404 di lantai 4 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 4, 7, 'mt_404'),
('Ruang Kelas 405', 'Ruang perkuliahan 405 di lantai 4 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 4, 7, 'mt_405'),
('Ruang Kelas 406', 'Ruang perkuliahan 406 di lantai 4 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 4, 7, 'mt_406'),
('Ruang Kelas 407', 'Ruang perkuliahan 407 di lantai 4 Gedung Moh. Husni Thamrin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 4, 7, 'mt_407');
-- =============================================================================
-- DATA FASILITAS GEDUNG MOH. HUSNI THAMRIN (id_gedung = 7)
-- =============================================================================
-- =============================================================================
-- DATA FASILITAS GEDUNG DR. SOEPOMO (id_gedung = 2)
-- =============================================================================
INSERT INTO public.fasilitas (nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, lantai, id_gedung, unity_object_name) VALUES
-- Lantai 1
('BEM FEB', 'Ruang organisasi Badan Eksekutif Mahasiswa (BEM) FEB pada lantai 1 Gedung DR. Soepomo.', 'Ruang Kegiatan Mahasiswa', 1, 2, 'spm_bem'),
('HIMA Ekonomi Syariah', 'Ruang Himpunan Mahasiswa (Hima) Ekonomi Syariah pada lantai 1 Gedung DR. Soepomo.', 'Ruang Kegiatan Mahasiswa', 1, 2, 'spm_hima_ekonomi_syariah'),
('HIMA Perbankan Syariah', 'Ruang Himpunan Mahasiswa (Hima) Ekonomi Perbankan pada lantai 1 Gedung DR. Soepomo.', 'Ruang Kegiatan Mahasiswa', 1, 2, 'spm_hima_ekonomi_perbankan'),
('KSPM dan Galeri Investasi', 'Kelompok Studi Pasar Modal (KSPM) dan Galeri Investasi pada lantai 1 Gedung DR. Soepomo.', 'Administrasi & Layanan', 1, 2, 'spm_kspm'),
('Ruang Dekanat FEB', 'Ruang Dekanat Fakultas Ekonomi dan Bisnis (FEB) pada lantai 1 Gedung DR. Soepomo.', 'Administrasi & Layanan', 1, 2, 'spm_dekanat'),
('Ruangan Tata Usaha FEB', 'Ruangan Tata Usaha FEB pada lantai 1 Gedung DR. Soepomo.', 'Administrasi & Layanan', 1, 2, 'spm_tu'),
('Ruang Rapat', 'Ruang Rapat utama pada lantai 1 Gedung DR. Soepomo.', 'Administrasi & Layanan', 1, 2, 'spm_ruang_rapat'),

-- Lantai 2
('Ruang Dosen Manajemen Program Sarjana', 'Ruang Dosen Manajemen Program Sarjana pada lantai 2 Gedung DR. Soepomo.', 'Administrasi & Layanan', 2, 2, 'spm_dosen_manajemen'),
('Ruang Komputasi 1', 'Laboratorium Komputasi 1 pada lantai 2 Gedung DR. Soepomo.', 'Laboratorium', 2, 2, 'spm_komputasi_1'),
('Ruangan Dosen FEB', 'Ruangan Dosen Fakultas Ekonomi dan Bisnis (FEB) pada lantai 2 Gedung DR. Soepomo.', 'Administrasi & Layanan', 2, 2, 'spm_dosen'),
('Ruang Kelas D 201', 'Ruang kelas D 201 pada lantai 2 Gedung DR. Soepomo.', 'Ruang Kuliah', 2, 2, 'spm_d_201'),
('Ruang Kelas D 202', 'Ruang kelas D 202 pada lantai 2 Gedung DR. Soepomo.', 'Ruang Kuliah', 2, 2, 'spm_d_202'),


-- Lantai 3
('Ruang Komputasi 1 (Lt 3)', 'Laboratorium Komputasi 1 pada lantai 3 Gedung DR. Soepomo.', 'Laboratorium', 3, 2, 'spm_komputasi_2'), -- di-suffix agar unik
('Ruang Komputasi 2 (Lt 3)', 'Laboratorium Komputasi 2 pada lantai 3 Gedung DR. Soepomo.', 'Laboratorium', 3, 2, 'spm_komputasi_3'),
('Ruang Kelas D 301', 'Ruang kelas D 301 pada lantai 3 Gedung DR. Soepomo.', 'Ruang Kuliah', 3, 2, 'spm_d_301'),
('Ruang Kelas D 302', 'Ruang kelas D 302 pada lantai 3 Gedung DR. Soepomo.', 'Ruang Kuliah', 3, 2, 'spm_d_302'),
('Ruang Kelas D 303', 'Ruang kelas D 303 pada lantai 3 Gedung DR. Soepomo.', 'Ruang Kuliah', 3, 2, 'spm_d_303'),
('Ruang Kelas D 304', 'Ruang kelas D 304 pada lantai 3 Gedung DR. Soepomo.', 'Ruang Kuliah', 3, 2, 'spm_d_304'),


-- Lantai 4
('Ruang Kelas D 401', 'Ruang kelas D 401 pada lantai 4 Gedung DR. Soepomo.', 'Ruang Kuliah', 4, 2, 'spm_d_401'),
('Ruang Kelas D 402', 'Ruang kelas D 402 pada lantai 4 Gedung DR. Soepomo.', 'Ruang Kuliah', 4, 2, 'spm_d_402'),
('Ruang Kelas D 403', 'Ruang kelas D 403 pada lantai 4 Gedung DR. Soepomo.', 'Ruang Kuliah', 4, 2, 'spm_d_403'),
('Ruang Kelas D 404', 'Ruang kelas D 404 pada lantai 4 Gedung DR. Soepomo.', 'Ruang Kuliah', 4, 2, 'spm_d_404'),

('Ruang Bursa Efek Jakarta 1', 'Laboratorium/Ruang Bursa Efek Jakarta 1 pada lantai 4 Gedung DR. Soepomo.', 'Laboratorium', 4, 2, 'spm_bursa_efek_1'),
('Ruang Bursa Efek Jakarta 2', 'Laboratorium/Ruang Bursa Efek Jakarta 2 pada lantai 4 Gedung DR. Soepomo.', 'Laboratorium', 4, 2, 'spm_bursa_efek_2');
-- =============================================================================
-- DATA FASILITAS GEDUNG MUHAMMAD YAMIN (id_gedung = 8)
-- Gedung FISIP (Fakultas Ilmu Sosial dan Ilmu Politik)
-- jumlah_lantai: 4
-- =============================================================================
INSERT INTO public.fasilitas (nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, lantai, id_gedung, unity_object_name) VALUES
-- Lantai 1
('Lobby dan Pelayanan Mahasiswa FISIP', 'Lobby utama dan area pelayanan mahasiswa Fakultas Ilmu Sosial dan Ilmu Politik pada lantai 1 Gedung Muhammad Yamin.', 'Administrasi & Layanan', 1, 8, 'ymn_lobby'),
('Auditorium FISIP', 'Auditorium Fakultas Ilmu Sosial dan Ilmu Politik untuk seminar, kuliah umum, dan kegiatan akademik pada lantai 1 Gedung Muhammad Yamin.', 'Auditorium & Aula', 1, 8, 'ymn_auditorium'),

-- Lantai 2
('Ruangan Staff Program Studi FISIP', 'Ruangan staff program studi Fakultas Ilmu Sosial dan Ilmu Politik pada lantai 2 Gedung Muhammad Yamin.', 'Administrasi & Layanan', 2, 8, 'ymn_staff'),
('Ruangan Dosen FISIP', 'Ruangan dosen Fakultas Ilmu Sosial dan Ilmu Politik pada lantai 2 Gedung Muhammad Yamin.', 'Administrasi & Layanan', 2, 8, 'ymn_dosen'),
('Ruang Guru Besar', 'Ruang Guru Besar Fakultas Ilmu Sosial dan Ilmu Politik pada lantai 2 Gedung Muhammad Yamin.', 'Administrasi & Layanan', 2, 8, 'ymn_guru_besar'),

-- Lantai 3
('Ruang Kelas 301', 'Ruang perkuliahan 301 di lantai 3 Gedung Muhammad Yamin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 8, 'ymn_301'),
('Lab Politik (302)', 'Laboratorium politik (ruang 302) untuk pembelajaran dan penelitian di bidang ilmu politik pada lantai 3 Gedung Muhammad Yamin.', 'Laboratorium', 3, 8, 'ymn_302'),
('Ruang Kelas 303', 'Ruang perkuliahan 303 di lantai 3 Gedung Muhammad Yamin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 8, 'ymn_303'),
('Ruang Kelas 304', 'Ruang perkuliahan 304 di lantai 3 Gedung Muhammad Yamin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 8, 'ymn_304'),
('Ruang Kelas 305', 'Ruang perkuliahan 305 di lantai 3 Gedung Muhammad Yamin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 8, 'ymn_305'),
('Ruang Kelas 306', 'Ruang perkuliahan 306 di lantai 3 Gedung Muhammad Yamin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 8, 'ymn_306'),
('Ruang Kelas 307', 'Ruang perkuliahan 307 di lantai 3 Gedung Muhammad Yamin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 8, 'ymn_307'),
('Ruang Kelas 308', 'Ruang perkuliahan 308 di lantai 3 Gedung Muhammad Yamin, digunakan untuk kegiatan belajar mengajar dan dilengkapi proyektor, papan tulis, serta pendingin ruangan.', 'Ruang Kuliah', 3, 8, 'ymn_308'),

('Mushola FISIP', 'Fasilitas ibadah Mushola FISIP pada lantai 3 Gedung Muhammad Yamin.', 'Fasilitas Ibadah', 3, 8, 'ymn_mushola'),
('Ruang Podcast FISIP', 'Ruang podcast FISIP untuk produksi konten audio digital dan broadcasting pada lantai 3 Gedung Muhammad Yamin.', 'Laboratorium', 3, 8, 'ymn_podcast'),

-- Lantai 4
('Lab Fotografi', 'Laboratorium fotografi untuk praktikum dan pengembangan keterampilan fotografi mahasiswa pada lantai 4 Gedung Muhammad Yamin.', 'Laboratorium', 4, 8, 'ymn_fotografi'),
('Lab Sinematografi', 'Laboratorium sinematografi untuk produksi film dan konten visual pada lantai 4 Gedung Muhammad Yamin.', 'Laboratorium', 4, 8, 'ymn_sinematografi'),
('Ruangan Lab Televisi & Radio', 'Laboratorium produksi televisi dan radio pada lantai 4 Gedung Muhammad Yamin.', 'Laboratorium', 4, 8, 'ymn_televisi'),
('Lab Multimedia FISIP', 'Laboratorium multimedia FISIP untuk praktikum dan pengembangan konten digital pada lantai 4 Gedung Muhammad Yamin.', 'Laboratorium', 4, 8, 'ymn_multimedia'),
('Lab Big Data FISIP', 'Laboratorium big data FISIP untuk praktikum dan penelitian analisis data pada lantai 4 Gedung Muhammad Yamin.', 'Laboratorium', 4, 8, 'ymn_big_data');
WITH cipto AS (
    SELECT id FROM public.gedung WHERE nama_gedung ILIKE '%Cipto%' LIMIT 1
)
INSERT INTO public.fasilitas (id_gedung, nama_fasilitas, lantai, unity_object_name, deskripsi_fasilitas)
SELECT cipto.id, data.nama, data.lt, data.unity, data.deskripsi
FROM cipto, (VALUES
    -- Lantai 1
    ('Perpustakaan', 1, 'cpt_perpustakaan', NULL),
    ('Laboratorium Histologi & Patologi', 1, 'cpt_histologi_patologi', NULL),
    ('Laboratorium Komputer', 1, 'cpt_komputer', NULL),
    ('Ruang Medical Information and Technology Education, and Communication (MITECH)', 1, 'cpt_mitech', NULL),
    ('Kepala Laboratorium Histologi & Patologi', 1, 'cpt_kalab_histologi_patologi', NULL),
    ('Ruangan Laboratorium Farmakologi & Farmasi Klinik', 1, 'cpt_lab_farmakologi_farmasi_klinik', NULL),
    ('Student Lounge', 1, 'cpt_student_lounge', NULL),

    -- Lantai 2
    ('Ruangan Medical Education Unit', 2, 'cpt_medical_education_unit', NULL),
    ('Tutor Meeting', 2, 'cpt_tutor', NULL),
('Ruang Tutorial A1', 2, 'cpt_tutorial_a_1', NULL),
    ('Ruang Tutorial A2', 2, 'cpt_tutorial_a_2', NULL),
    ('Ruang Tutorial A3', 2, 'cpt_tutorial_a_3', NULL),
    ('Ruang Tutorial A4', 2, 'cpt_tutorial_a_4', NULL),
('Ruang Tutorial B1', 2, 'cpt_tutorial_b_1', NULL),
    ('Ruang Tutorial B2', 2, 'cpt_tutorial_b_2', NULL),
    ('Ruang Tutorial B3', 2, 'cpt_tutorial_b_3', NULL),
    ('Ruang Tutorial B4', 2, 'cpt_tutorial_b_4', NULL),
('Ruang Tutorial C1', 2, 'cpt_tutorial_c_1', NULL),
    ('Ruang Tutorial C2', 2, 'cpt_tutorial_c_2', NULL),
    ('Ruang Tutorial C3', 2, 'cpt_tutorial_c_3', NULL),
    ('Ruang Tutorial C4', 2, 'cpt_tutorial_c_4', NULL),
('Ruang Tutorial D1', 2, 'cpt_tutorial_d_1', NULL),
    ('Ruang Tutorial D2', 2, 'cpt_tutorial_d_2', NULL),
    ('Ruang Tutorial D3', 2, 'cpt_tutorial_d_3', NULL),
    ('Ruang Tutorial D4', 2, 'cpt_tutorial_d_4', NULL),
    ('Ruangan prodi Biologi & ruangan Redaksi jurnal profesi medika', 2, 'cpt_biologi_jurnal', NULL),

    -- Lantai 3
    ('Ruangan (Objective Structured Clinical Examination) OSCE CENTER/ LAB Keterampilan Klinis B', 3, 'cpt_osce', NULL),
    ('Ruang Penyimpanan Manekin 1', 3, 'cpt_penyimpanan_manekin_1', NULL),
    ('Ruang Penyimpanan Manekin 2', 3, 'cpt_penyimpanan_manekin_2', NULL),
    ('Ruangan Instruktur keterampilan klinis', 3, 'cpt_instruktur_keterampilan', NULL),
    ('Ruang Manekin', 3, 'cpt_manekin', NULL),
    ('Ruangan LAB Keterampilan klinis A (Skills Lab)', 3, 'cpt_skills', NULL),

    -- Lantai 4
    ('CBT (Computer Based Test) Center', 4, 'cpt_cbt', NULL),
    ('Ruang Lecture A', 4, 'cpt_lecture_a', NULL),
    ('Ruang Lecture B', 4, 'cpt_lecture_b', NULL),
    ('Aula', 4, 'cpt_aula', 'Biasa dipakai sidang'),
    ('Ruang Mini Lecture 2', 4, 'cpt_mini_lecture_2', NULL),
    ('Ruang Mini Lecture 3', 4, 'cpt_mini_lecture_3', NULL)
) AS data(nama, lt, unity, deskripsi);

-- =============================================================================
-- STANDARDISASI TIPE FASILITAS GEDUNG DR. CIPTO MANGUNKUSUMO (id_gedung = 4)
-- Baris Cipto di atas di-insert tanpa tipe_fasilitas (NULL). Kita tetapkan
-- tipe yang dikenali dashboard berdasarkan nama fasilitas.
-- =============================================================================
UPDATE public.fasilitas
SET tipe_fasilitas = CASE
    WHEN nama_fasilitas ILIKE '%CBT%'                                   THEN 'Ruang Kuliah'
    WHEN nama_fasilitas ILIKE '%Lecture%'                               THEN 'Ruang Kuliah'
    WHEN nama_fasilitas ILIKE 'Aula%'                                   THEN 'Auditorium & Aula'
    WHEN nama_fasilitas ILIKE '%Tutorial%' OR nama_fasilitas ILIKE 'Tutor Meeting%' THEN 'Ruang Kuliah'
    WHEN nama_fasilitas ILIKE 'Student Lounge%'                         THEN 'Administrasi & Layanan'
    WHEN nama_fasilitas ILIKE 'Perpustakaan%'                           THEN 'Perpustakaan & Ruang Baca'
    WHEN nama_fasilitas ILIKE '%MITECH%'                                THEN 'Laboratorium'
    WHEN nama_fasilitas ILIKE '%Lab%'
      OR nama_fasilitas ILIKE 'Laboratorium%'
      OR nama_fasilitas ILIKE '%OSCE%'
      OR nama_fasilitas ILIKE '%Manekin%'
      OR nama_fasilitas ILIKE '%Skills%'
      OR nama_fasilitas ILIKE '%keterampilan klinis%'                   THEN 'Laboratorium'
    ELSE 'Lainnya'
END
WHERE id_gedung = (SELECT id FROM public.gedung WHERE nama_gedung ILIKE '%Cipto%' LIMIT 1)
  AND tipe_fasilitas IS NULL;
