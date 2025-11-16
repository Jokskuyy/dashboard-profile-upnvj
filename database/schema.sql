-- ============================================
-- SINTAKS SKEMA DATABASE POSTGRESQL (REVISI)
-- PROYEK: DASHBOARD PROFIL UPNVJ
-- ============================================
-- (Constraint UNIQUE pada akreditasi.status telah dihapus)
-- Schema ini disesuaikan dengan kebutuhan akademik UPNVJ

-- Drop tables if exists (untuk development)
DROP TABLE IF EXISTS web_analytics_log CASCADE;
DROP TABLE IF EXISTS mahasiswa CASCADE;
DROP TABLE IF EXISTS dosen CASCADE;
DROP TABLE IF EXISTS program_studi CASCADE;
DROP TABLE IF EXISTS fasilitas CASCADE;
DROP TABLE IF EXISTS fakultas CASCADE;
DROP TABLE IF EXISTS gedung CASCADE;
DROP TABLE IF EXISTS akreditasi CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- ==================================================
-- Tabel Independen (Tidak memiliki Foreign Key)
-- ==================================================

-- Tabel untuk status akreditasi
CREATE TABLE akreditasi (
    id SERIAL PRIMARY KEY,
    -- (REVISI: Constraint UNIQUE dihapus. Status 'A' bisa muncul berkali-kali)
    status VARCHAR(50) NOT NULL, 
    tgl_berlaku DATE,
    tgl_kadaluarsa DATE,
    keterangan TEXT
);

-- Tabel untuk data gedung di kampus
CREATE TABLE gedung (
    id SERIAL PRIMARY KEY,
    -- (Tambahan: Nama gedung logisnya unik)
    nama_gedung VARCHAR(255) NOT NULL UNIQUE,
    deskripsi_gedung TEXT,
    lokasi TEXT 
);

-- Tabel untuk pengguna Admin Dashboard (CRUD)
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, 
    nama_lengkap VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- Tabel Dependen (Memiliki Foreign Key)
-- ==================================================

-- Tabel Fakultas, memiliki relasi ke Gedung (untuk gedung utama)
CREATE TABLE fakultas (
    id SERIAL PRIMARY KEY,
    nama_fakultas VARCHAR(255) NOT NULL UNIQUE,
    deskripsi_fakultas TEXT,
    email VARCHAR(255),
    website VARCHAR(255),
    id_gedung_utama INT,
    FOREIGN KEY (id_gedung_utama) REFERENCES gedung(id)
        ON DELETE SET NULL 
);

-- Tabel Fasilitas, memiliki relasi ke Gedung (Fasilitas ada di dalam Gedung)
CREATE TABLE fasilitas (
    id SERIAL PRIMARY KEY,
    nama_fasilitas VARCHAR(255) NOT NULL,
    deskripsi_fasilitas TEXT,
    tipe_fasilitas VARCHAR(100), 
    id_gedung INT NOT NULL,
    FOREIGN KEY (id_gedung) REFERENCES gedung(id)
        ON DELETE CASCADE 
);

-- Tabel Program Studi, berelasi ke Fakultas dan Akreditasi
CREATE TABLE program_studi (
    id SERIAL PRIMARY KEY,
    nama_prodi VARCHAR(255) NOT NULL,
    jenjang VARCHAR(10) NOT NULL, 
    id_fakultas INT NOT NULL,
    id_akreditasi INT,
    FOREIGN KEY (id_fakultas) REFERENCES fakultas(id)
        ON DELETE CASCADE, 
    FOREIGN KEY (id_akreditasi) REFERENCES akreditasi(id)
        ON DELETE SET NULL,
    -- (Tambahan: Kombinasi nama, jenjang, dan fakultas harus unik)
    UNIQUE(nama_prodi, jenjang, id_fakultas)
);

-- ==================================================
-- Tabel Dependen Level 2
-- ==================================================

-- Tabel Dosen, berelasi ke Program Studi
CREATE TABLE dosen (
    id SERIAL PRIMARY KEY,
    nidn VARCHAR(50) UNIQUE NOT NULL,
    nama_dosen VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    jabatan_fungsional VARCHAR(100),
    id_prodi INT NOT NULL,
    FOREIGN KEY (id_prodi) REFERENCES program_studi(id)
        ON DELETE CASCADE 
);

-- Tabel Mahasiswa, berelasi ke Program Studi
CREATE TABLE mahasiswa (
    id SERIAL PRIMARY KEY,
    nim VARCHAR(50) UNIQUE NOT NULL,
    nama_mahasiswa VARCHAR(255) NOT NULL,
    angkatan INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Aktif',
    id_prodi INT NOT NULL,
    FOREIGN KEY (id_prodi) REFERENCES program_studi(id)
        ON DELETE CASCADE 
);

-- ==================================================
-- Tabel Tambahan (Sesuai Scope Fungsional)
-- ==================================================

-- Tabel untuk Web Analytics (Page Views, Visitors, Device)
CREATE TABLE web_analytics_log (
    id SERIAL PRIMARY KEY,
    visitor_hash VARCHAR(255), 
    page_path VARCHAR(255) NOT NULL, 
    device_type VARCHAR(100), 
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- INDEXES FOR PERFORMANCE
-- ==================================================

-- Fakultas & Program Studi Indexes
CREATE INDEX idx_fakultas_nama ON fakultas(nama_fakultas);
CREATE INDEX idx_program_studi_fakultas ON program_studi(id_fakultas);
CREATE INDEX idx_program_studi_akreditasi ON program_studi(id_akreditasi);
CREATE INDEX idx_program_studi_jenjang ON program_studi(jenjang);

-- Dosen & Mahasiswa Indexes
CREATE INDEX idx_dosen_prodi ON dosen(id_prodi);
CREATE INDEX idx_dosen_email ON dosen(email);
CREATE INDEX idx_dosen_nidn ON dosen(nidn);
CREATE INDEX idx_mahasiswa_prodi ON mahasiswa(id_prodi);
CREATE INDEX idx_mahasiswa_nim ON mahasiswa(nim);
CREATE INDEX idx_mahasiswa_angkatan ON mahasiswa(angkatan);
CREATE INDEX idx_mahasiswa_status ON mahasiswa(status);

-- Fasilitas Indexes
CREATE INDEX idx_fasilitas_gedung ON fasilitas(id_gedung);
CREATE INDEX idx_fasilitas_tipe ON fasilitas(tipe_fasilitas);

-- Analytics Indexes
CREATE INDEX idx_analytics_visitor ON web_analytics_log(visitor_hash);
CREATE INDEX idx_analytics_page ON web_analytics_log(page_path);
CREATE INDEX idx_analytics_device ON web_analytics_log(device_type);
CREATE INDEX idx_analytics_timestamp ON web_analytics_log(visited_at);

-- ==================================================
-- COMMENTS FOR DOCUMENTATION
-- ==================================================

COMMENT ON TABLE akreditasi IS 'Status akreditasi program studi dari BAN-PT';
COMMENT ON TABLE gedung IS 'Data gedung/bangunan di kampus UPNVJ';
COMMENT ON TABLE admin_users IS 'Pengguna admin untuk mengelola dashboard';
COMMENT ON TABLE fakultas IS 'Data fakultas di UPNVJ';
COMMENT ON TABLE fasilitas IS 'Fasilitas kampus (lab, perpustakaan, dll)';
COMMENT ON TABLE program_studi IS 'Program studi yang ada di setiap fakultas';
COMMENT ON TABLE dosen IS 'Data dosen/pengajar';
COMMENT ON TABLE mahasiswa IS 'Data mahasiswa per program studi';
COMMENT ON TABLE web_analytics_log IS 'Log kunjungan website untuk analytics';
