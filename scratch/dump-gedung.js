/**
 * dump-gedung.js — Skrip utilitas ad-hoc (read-only).
 *
 * Dump seluruh isi tabel `gedung` sebagai JSON ke stdout.
 *
 * Jalankan dari root proyek: `node scratch/dump-gedung.js`
 * Memerlukan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di `.env`.
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('gedung')
    .select('*');
    
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

main();
