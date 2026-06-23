/**
 * check-db.js — Skrip utilitas ad-hoc (read-only).
 *
 * Cek koneksi Supabase dan tampilkan jumlah baris tabel `gedung` & `fasilitas`,
 * serta daftar gedung yang memiliki `unity_object_name`.
 *
 * Jalankan dari root proyek: `node scratch/check-db.js`
 * Memerlukan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di `.env`.
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Kredensial Supabase tidak lengkap.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  console.log('Menghubungkan ke Supabase:', supabaseUrl);
  
  // 1. Cek tabel gedung
  const { data: gedung, error: gError } = await supabase
    .from('gedung')
    .select('id, nama_gedung, unity_object_name');
    
  if (gError) {
    console.error('Error fetching gedung:', gError.message);
  } else {
    console.log(`Berhasil memuat ${gedung.length} gedung.`);
    console.log('Gedung dengan unity_object_name tidak null:');
    console.log(gedung.filter(g => g.unity_object_name !== null));
  }

  // 2. Cek tabel fasilitas
  const { data: fasilitas, error: fError } = await supabase
    .from('fasilitas')
    .select('id, nama_fasilitas, unity_object_name, id_gedung');
    
  if (fError) {
    console.error('Error fetching fasilitas:', fError.message);
  } else {
    console.log(`Berhasil memuat ${fasilitas.length} fasilitas.`);
  }
}

checkDb();
