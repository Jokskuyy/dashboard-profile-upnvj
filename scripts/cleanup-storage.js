import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Kredensial Supabase tidak lengkap di file .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

const BUCKET_NAME = 'Gambar Gedung dan Fasilitas';

// Daftar subfolder gedung sesuai mapping ID Anda
const gedungFolderMap = {
  1: 'rektorat',
  2: 'soepomo',
  3: 'wahidin',
  4: 'cipto',
  5: 'abdul rahman',
  6: 'kihadjar',
  7: 'husni thamrin',
  8: 'yamin',
  9: 'yos sudarso',
  10: 'kartini',
  13: 'dewi sartika'
};
const gedungFolders = Object.values(gedungFolderMap).concat('others');

/**
 * Helper untuk membersihkan nama file lama sesuai dengan logic uploader pertama/lama
 */
function cleanOldBasename(url) {
  try {
    const parsedUrl = new URL(url);
    let fileName = path.basename(parsedUrl.pathname);
    fileName = fileName.replace(/[?#].*$/, '').replace(/[^a-zA-Z0-9.-]/g, '_');
    return fileName;
  } catch (err) {
    return 'unknown';
  }
}

async function main() {
  console.log('=== MEMULAI PEMBERSIHAN STORAGE DENGAN PERBANDINGAN NAMA LAMA & BARU ===\n');

  const originalSeedPath = path.resolve(__dirname, '../database/002_seed_data.sql');
  const updatedSeedPath = path.resolve(__dirname, '../database/002_seed_data_updated.sql');

  if (!fs.existsSync(originalSeedPath) || !fs.existsSync(updatedSeedPath)) {
    console.error('Error: Kedua file seed (original & updated) harus ada di folder database.');
    return;
  }

  console.log('Membaca file seed original dan terupdate...');
  const originalSeed = fs.readFileSync(originalSeedPath, 'utf8');
  const updatedSeed = fs.readFileSync(updatedSeedPath, 'utf8');

  // --- PEMETAAN KATA KUNCI GEDUNG & FASILITAS ---
  
  // A. BAGIAN GEDUNG
  const startGedungOrig = originalSeed.indexOf('INSERT INTO public.gedung');
  const endGedungOrig = originalSeed.indexOf(';', startGedungOrig);
  const startGedungUpd = updatedSeed.indexOf('INSERT INTO public.gedung');
  const endGedungUpd = updatedSeed.indexOf(';', startGedungUpd);

  const gedungSecOrig = originalSeed.substring(startGedungOrig, endGedungOrig);
  const gedungSecUpd = updatedSeed.substring(startGedungUpd, endGedungUpd);

  const gedungUrlRegexOrig = /'(https?:\/\/[^\s"',)]+)'/gi;
  const oldGedungUrls = [...new Set([...gedungSecOrig.matchAll(gedungUrlRegexOrig)].map(m => m[1]))];

  const gedungUrlRegexUpd = /'(https?:\/\/[^\s"',)]+)'/gi;
  const newGedungUrls = [...new Set([...gedungSecUpd.matchAll(gedungUrlRegexUpd)].map(m => m[1]))];

  // B. BAGIAN FASILITAS
  const startFasilitasOrig = originalSeed.indexOf('INSERT INTO public.fasilitas');
  const endFasilitasOrig = originalSeed.indexOf(';', startFasilitasOrig);
  const startFasilitasUpd = updatedSeed.indexOf('INSERT INTO public.fasilitas');
  const endFasilitasUpd = updatedSeed.indexOf(';', startFasilitasUpd);

  const fasilitasSecOrig = originalSeed.substring(startFasilitasOrig, endFasilitasOrig);
  const fasilitasSecUpd = updatedSeed.substring(startFasilitasUpd, endFasilitasUpd);

  // Cocokkan URL dan ID Gedung
  const fasRegexOrig = /'((?:https?):\/\/[^\s"',)]+)'\s*,\s*(\d+)/gi;
  const oldFasMatches = [...fasilitasSecOrig.matchAll(fasRegexOrig)];

  const fasRegexUpd = /'((?:https?):\/\/[^\s"',)]+)'\s*,\s*(\d+)/gi;
  const newFasMatches = [...fasilitasSecUpd.matchAll(fasRegexUpd)];

  // --- PEMBUATAN MAP PERBANDINGAN LAMA -> BARU ---
  const pathComparisonMap = {};
  const validPaths = new Set();

  // 1. Map Gedung
  console.log('Menyusun pemetaan nama gambar Gedung...');
  for (let i = 0; i < oldGedungUrls.length; i++) {
    const oldUrl = oldGedungUrls[i];
    const newUrl = newGedungUrls[i];

    if (newUrl) {
      const oldFilename = cleanOldBasename(oldUrl);
      const newPathname = new URL(newUrl).pathname;
      const newPath = decodeURIComponent(newPathname.substring(newPathname.indexOf(BUCKET_NAME) + BUCKET_NAME.length + 1));
      
      // Jika URL lama tidak memiliki ekstensi, uploader kita memberikan ekstensi dinamis .webp / .jpg
      // Kita daftarkan kedua kemungkinan ekstensi lama agar pasti terdeteksi saat hapus
      const oldPathWithoutExt = `gedung/${oldFilename.replace(/\.[^/.]+$/, "")}`;
      const newPathDecoded = decodeURIComponent(newPath);

      pathComparisonMap[`${oldPathWithoutExt}.webp`] = newPathDecoded;
      pathComparisonMap[`${oldPathWithoutExt}.jpg`] = newPathDecoded;
      pathComparisonMap[`${oldPathWithoutExt}.png`] = newPathDecoded;
      pathComparisonMap[`gedung/${oldFilename}`] = newPathDecoded; // Jika memang ada ekstensi asli

      validPaths.add(newPathDecoded);
    }
  }

  // 2. Map Fasilitas
  console.log('Menyusun pemetaan nama gambar Fasilitas...');
  for (let i = 0; i < oldFasMatches.length; i++) {
    const oldMatch = oldFasMatches[i];
    const newMatch = newFasMatches[i];

    if (oldMatch && newMatch) {
      const oldUrl = oldMatch[1];
      const idGedung = parseInt(oldMatch[2], 10);
      const newUrl = newMatch[1];

      const oldFilename = cleanOldBasename(oldUrl);
      const newPathname = new URL(newUrl).pathname;
      const newPath = decodeURIComponent(newPathname.substring(newPathname.indexOf(BUCKET_NAME) + BUCKET_NAME.length + 1));
      
      const gedungSubfolder = gedungFolderMap[idGedung] || 'others';
      const oldPath = `fasilitas/${gedungSubfolder}/${oldFilename}`;
      const newPathDecoded = decodeURIComponent(newPath);

      pathComparisonMap[oldPath] = newPathDecoded;
      validPaths.add(newPathDecoded);
    }
  }

  // 3. Kumpulkan semua file yang saat ini ada di storage bucket
  const filesInStorage = [];
  console.log('\nMemeriksa file yang ada di Supabase Storage saat ini...');

  // A. List file di folder 'gedung'
  const { data: gedungFiles, error: gError } = await supabase.storage
    .from(BUCKET_NAME)
    .list('gedung', { limit: 100 });

  if (gError) {
    console.error('Gagal memindai folder gedung:', gError.message);
  } else if (gedungFiles) {
    gedungFiles.forEach(f => {
      if (f.name !== '.emptyFolderPlaceholder') {
        filesInStorage.push(`gedung/${f.name}`);
      }
    });
  }

  // B. List file di folder 'fasilitas' secara rekursif per subfolder gedung
  for (const folder of gedungFolders) {
    const folderPath = `fasilitas/${folder}`;
    const { data: fasFiles, error: fError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folderPath, { limit: 100 });

    if (fError) {
      continue;
    }

    if (fasFiles) {
      fasFiles.forEach(f => {
        if (f.name !== '.emptyFolderPlaceholder') {
          filesInStorage.push(`${folderPath}/${f.name}`);
        }
      });
    }
  }

  console.log(`Total file terdeteksi di Storage: ${filesInStorage.length} file.`);

  // 4. Bandingkan dan tentukan file duplikat
  const filesToDelete = filesInStorage.filter(f => !validPaths.has(f));

  if (filesToDelete.length === 0) {
    console.log('\n[Hebat] Tidak ditemukan file duplikat atau file sampah lama di Storage Anda. Semua file sinkron!');
    return;
  }

  console.log(`\nMenemukan ${filesToDelete.length} file duplikat/lama yang tidak digunakan lagi:`);
  
  filesToDelete.forEach(f => {
    // Cari apakah ada pemetaan nama barunya
    // Kita cari secara case-insensitive atau parsial jika ada perbedaan kecil
    const mappedNewPath = pathComparisonMap[f] || pathComparisonMap[f.replace(/\.[^/.]+$/, "")] || 'Tidak ada/File Sampah Lain';
    console.log(` ❌ HAPUS: ${f}`);
    console.log(`    👉 DIGANTIKAN OLEH: ${mappedNewPath}\n`);
  });

  // 5. Lakukan penghapusan file sampah di Supabase secara massal
  console.log('Menghapus file sampah secara otomatis di Supabase...');
  const { data: deleteData, error: deleteError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(filesToDelete);

  if (deleteError) {
    console.error('\nGagal menghapus file sampah:', deleteError.message);
  } else {
    console.log(`\n[Sukses] Berhasil membersihkan ${filesToDelete.length} file duplikat dari Supabase Storage Anda!`);
  }
}

main();
