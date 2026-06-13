import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  // Get ID for Gedung Abdul Rahman Saleh
  const { data: gedung, error: gedungError } = await supabase
    .from('gedung')
    .select('id, nama_gedung')
    .ilike('nama_gedung', '%Abdul Rahman Saleh%')
    .single();

  if (gedungError) {
    console.error("Error finding gedung:", gedungError);
    return;
  }
  
  console.log(`Found Gedung: ${gedung.nama_gedung} (ID: ${gedung.id})`);

  // Get facilities
  const { data: fasilitas, error: fasError } = await supabase
    .from('fasilitas')
    .select('*')
    .eq('id_gedung', gedung.id);

  if (fasError) {
    console.error("Error finding fasilitas:", fasError);
    return;
  }

  console.log(`\nFound ${fasilitas.length} fasilitas:`);
  fasilitas.forEach(f => {
    console.log(`- ID: ${f.id} | Nama: ${f.nama_fasilitas} | Deskripsi: ${f.deskripsi || '[KOSONG]'} | Unity Object: ${f.unity_object_name || '[KOSONG]'}`);
  });
}

main();
