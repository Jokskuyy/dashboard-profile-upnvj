-- 1. Tambah kolom unity_object_name ke tabel gedung
ALTER TABLE public.gedung ADD COLUMN unity_object_name TEXT UNIQUE;

-- 2. Isi mapping sesuai nama GameObject di Unity Inspector
-- (sesuaikan dengan gedung yang sudah ada di database kamu)
UPDATE public.gedung SET unity_object_name = 'Dewsar' WHERE nama_gedung = 'Dewi Sartika';
UPDATE public.gedung SET unity_object_name = 'Gedung_Rektorat' WHERE nama_gedung = 'Gedung Rektorat';
-- Tambahkan UPDATE lain untuk gedung lainnya...
