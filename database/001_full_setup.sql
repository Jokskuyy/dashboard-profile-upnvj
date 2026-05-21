-- ============================================
-- FULL DATABASE SETUP (CLEAN)
-- PROYEK: DASHBOARD PROFIL UPNVJ
-- ============================================
-- Jalankan SELURUH file ini di Supabase SQL Editor.
-- File ini menggantikan semua file SQL sebelumnya:
--   schema.sql, rls-policies.sql, rls-public-insert.sql,
--   add-color-to-fasilitas.sql, add-lantai-foto-to-fasilitas.sql,
--   audit-logs.sql, setup-analytics.sql
--
-- PENTING: File ini akan DROP semua tabel lama!
-- ============================================

-- ==================================================
-- PHASE 1: DROP EXISTING (clean slate)
-- ==================================================

-- Drop policies dulu (agar tidak bentrok saat drop table)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
    )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Drop tables (cascade)
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.web_analytics_log CASCADE;
DROP TABLE IF EXISTS public.program_studi CASCADE;
DROP TABLE IF EXISTS public.fasilitas CASCADE;
DROP TABLE IF EXISTS public.fakultas CASCADE;
DROP TABLE IF EXISTS public.gedung CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;


-- ==================================================
-- PHASE 2: CREATE TABLES
-- ==================================================

-- Tabel Independen --

CREATE TABLE public.gedung (
    id SERIAL PRIMARY KEY,
    nama_gedung VARCHAR(255) NOT NULL UNIQUE,
    deskripsi_gedung TEXT,
    lokasi TEXT,
    jumlah_lantai INT DEFAULT 1,
    foto_url VARCHAR(255),
    unity_object_name TEXT UNIQUE
);
COMMENT ON TABLE public.gedung IS 'Data gedung/bangunan di kampus UPNVJ';

CREATE TABLE public.admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nama_lengkap VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE public.admin_users IS 'Pengguna admin untuk mengelola dashboard';

-- Tabel Dependen Level 1 --

CREATE TABLE public.fakultas (
    id SERIAL PRIMARY KEY,
    nama_fakultas VARCHAR(255) NOT NULL UNIQUE,
    deskripsi_fakultas TEXT,
    email VARCHAR(255),
    website VARCHAR(255),
    id_gedung_utama INT REFERENCES public.gedung(id) ON DELETE SET NULL
);
COMMENT ON TABLE public.fakultas IS 'Data fakultas di UPNVJ';

CREATE TABLE public.fasilitas (
    id SERIAL PRIMARY KEY,
    nama_fasilitas VARCHAR(255) NOT NULL,
    deskripsi_fasilitas TEXT,
    tipe_fasilitas VARCHAR(100),
    color VARCHAR(50) DEFAULT 'gray',
    lantai INT DEFAULT 1,
    foto_url TEXT,
    id_gedung INT REFERENCES public.gedung(id) ON DELETE SET NULL,
    unity_object_name TEXT UNIQUE
);
COMMENT ON TABLE public.fasilitas IS 'Fasilitas kampus (lab, perpustakaan, dll)';

CREATE TABLE public.program_studi (
    id SERIAL PRIMARY KEY,
    nama_prodi VARCHAR(255) NOT NULL,
    jenjang VARCHAR(10) NOT NULL,
    id_fakultas INT NOT NULL REFERENCES public.fakultas(id) ON DELETE CASCADE,
    akreditasi VARCHAR(50),
    UNIQUE(nama_prodi, jenjang, id_fakultas)
);
COMMENT ON TABLE public.program_studi IS 'Program studi yang ada di setiap fakultas';

-- Tabel Pendukung --

CREATE TABLE public.web_analytics_log (
    id SERIAL PRIMARY KEY,
    visitor_hash VARCHAR(255),
    page_path VARCHAR(255) NOT NULL,
    device_type VARCHAR(100),
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE public.web_analytics_log IS 'Log kunjungan website (legacy, digantikan Umami)';

CREATE TABLE public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID,
    actor_email TEXT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE public.audit_logs IS 'Log audit untuk mencatat aktivitas CRUD admin';


-- ==================================================
-- PHASE 3: INDEXES
-- ==================================================

-- Fakultas & Program Studi
CREATE INDEX idx_fakultas_nama ON public.fakultas(nama_fakultas);
CREATE INDEX idx_fakultas_gedung ON public.fakultas(id_gedung_utama);
CREATE INDEX idx_prodi_fakultas ON public.program_studi(id_fakultas);
CREATE INDEX idx_prodi_jenjang ON public.program_studi(jenjang);

-- Fasilitas
CREATE INDEX idx_fasilitas_gedung ON public.fasilitas(id_gedung);
CREATE INDEX idx_fasilitas_tipe ON public.fasilitas(tipe_fasilitas);
CREATE INDEX idx_fasilitas_lantai ON public.fasilitas(lantai);

-- Analytics (legacy)
CREATE INDEX idx_analytics_visitor ON public.web_analytics_log(visitor_hash);
CREATE INDEX idx_analytics_page ON public.web_analytics_log(page_path);
CREATE INDEX idx_analytics_timestamp ON public.web_analytics_log(visited_at);

-- Audit Logs
CREATE INDEX idx_audit_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_action ON public.audit_logs(action);
CREATE INDEX idx_audit_table ON public.audit_logs(table_name);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_record ON public.audit_logs(record_id);


-- ==================================================
-- PHASE 4: ENABLE RLS ON ALL TABLES
-- ==================================================

ALTER TABLE public.gedung ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fakultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fasilitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_studi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_analytics_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;


-- ==================================================
-- PHASE 5: RLS POLICIES (no conflicts)
-- ==================================================
-- Naming convention: {table}_{role}_{operation}
-- This ensures unique names and no duplicates.

-- === GEDUNG ===
CREATE POLICY gedung_anon_select ON public.gedung
    FOR SELECT TO anon USING (true);
CREATE POLICY gedung_auth_select ON public.gedung
    FOR SELECT TO authenticated USING (true);
CREATE POLICY gedung_auth_insert ON public.gedung
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY gedung_auth_update ON public.gedung
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY gedung_auth_delete ON public.gedung
    FOR DELETE TO authenticated USING (true);

-- === FAKULTAS ===
CREATE POLICY fakultas_anon_select ON public.fakultas
    FOR SELECT TO anon USING (true);
CREATE POLICY fakultas_auth_select ON public.fakultas
    FOR SELECT TO authenticated USING (true);
CREATE POLICY fakultas_auth_insert ON public.fakultas
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY fakultas_auth_update ON public.fakultas
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY fakultas_auth_delete ON public.fakultas
    FOR DELETE TO authenticated USING (true);

-- === FASILITAS ===
CREATE POLICY fasilitas_anon_select ON public.fasilitas
    FOR SELECT TO anon USING (true);
CREATE POLICY fasilitas_auth_select ON public.fasilitas
    FOR SELECT TO authenticated USING (true);
CREATE POLICY fasilitas_auth_insert ON public.fasilitas
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY fasilitas_auth_update ON public.fasilitas
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY fasilitas_auth_delete ON public.fasilitas
    FOR DELETE TO authenticated USING (true);

-- === PROGRAM STUDI ===
CREATE POLICY prodi_anon_select ON public.program_studi
    FOR SELECT TO anon USING (true);
CREATE POLICY prodi_auth_select ON public.program_studi
    FOR SELECT TO authenticated USING (true);
CREATE POLICY prodi_auth_insert ON public.program_studi
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY prodi_auth_update ON public.program_studi
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY prodi_auth_delete ON public.program_studi
    FOR DELETE TO authenticated USING (true);

-- === WEB ANALYTICS LOG ===
-- Siapa saja bisa insert (tracking) dan baca (public dashboard)
CREATE POLICY analytics_anon_insert ON public.web_analytics_log
    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY analytics_anon_select ON public.web_analytics_log
    FOR SELECT TO anon USING (true);
CREATE POLICY analytics_auth_insert ON public.web_analytics_log
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY analytics_auth_select ON public.web_analytics_log
    FOR SELECT TO authenticated USING (true);

-- === AUDIT LOGS ===
-- Hanya admin (authenticated) yang bisa insert dan baca
CREATE POLICY audit_auth_select ON public.audit_logs
    FOR SELECT TO authenticated USING (true);
CREATE POLICY audit_auth_insert ON public.audit_logs
    FOR INSERT TO authenticated WITH CHECK (true);

-- === ADMIN USERS ===
-- Hanya authenticated yang bisa akses
CREATE POLICY admin_users_auth_select ON public.admin_users
    FOR SELECT TO authenticated USING (true);
CREATE POLICY admin_users_auth_insert ON public.admin_users
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY admin_users_auth_update ON public.admin_users
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


-- ==================================================
-- PHASE 6: ADMIN AUTH FUNCTIONS (pgcrypto)
-- ==================================================

-- Enable pgcrypto for bcrypt hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function: Hash a plain-text password (untuk seed/insert admin baru)
-- Usage: SELECT hash_password('mypassword123');
CREATE OR REPLACE FUNCTION public.hash_password(plain_password TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT crypt(plain_password, gen_salt('bf', 10));
$$;

-- Function: Verify a password against stored hash (untuk login)
-- Usage: SELECT verify_admin_login('admin', 'mypassword123');
-- Returns: admin row jika valid, empty jika salah
CREATE OR REPLACE FUNCTION public.verify_admin_login(
  input_username TEXT,
  input_password TEXT
)
RETURNS TABLE(
  id INT,
  username VARCHAR,
  nama_lengkap VARCHAR,
  role VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.username,
    a.nama_lengkap,
    a.role
  FROM public.admin_users a
  WHERE a.username = input_username
    AND a.password_hash = crypt(input_password, a.password_hash);
END;
$$;

-- Grant execute to anon (needed for login before auth)
GRANT EXECUTE ON FUNCTION public.hash_password(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_login(TEXT, TEXT) TO anon, authenticated;


-- ==================================================
-- PHASE 7: VERIFY
-- ==================================================

-- Cek RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Cek semua policies
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
