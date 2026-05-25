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
// PENTING: Untuk melakukan upload via backend/script Node.js tanpa pembatasan RLS,
// disarankan menggunakan SERVICE_ROLE_KEY. Namun, jika RLS mengizinkan anon untuk insert,
// ANON_KEY juga bisa digunakan. Kita coba gunakan VITE_SUPABASE_ANON_KEY jika service key tidak diset.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY harus di-set di .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// NAMA BUCKET YANG SESUAI DENGAN SUPABASE USER
const BUCKET_NAME = 'Gambar Gedung dan Fasilitas';

// Mapping ID Gedung ke folder di bucket sesuai struktur bucket Anda
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

/**
 * Memastikan bucket storage sudah ada dan bersifat publik
 */
async function ensureBucketExists() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Gagal mengecek bucket:', error.message);
    return false;
  }

  const exists = buckets.some(b => b.name.toLowerCase() === BUCKET_NAME.toLowerCase());
  if (!exists) {
    console.log(`Bucket "${BUCKET_NAME}" tidak ditemukan. Membuat bucket baru...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    });

    if (createError) {
      console.error('Gagal membuat bucket:', createError.message);
      console.log(`Mencoba melanjutkan karena kemungkinan bucket "${BUCKET_NAME}" sudah dibuat secara manual dengan akses PUBLIC.`);
      return true; // Lanjutkan karena bucket mungkin sudah dibuat secara manual
    }
    console.log(`Bucket "${BUCKET_NAME}" berhasil dibuat.`);
  } else {
    console.log(`Bucket "${BUCKET_NAME}" siap digunakan.`);
  }
  return true;
}

/**
 * Mengunggah file lokal ke Supabase Storage
 * @param {string} filePath Path lengkap file di lokal
 * @param {string} storagePath Path tujuan di bucket Supabase (termasuk folder, misal: gedung/rektorat.jpg)
 */
async function uploadLocalFile(filePath, storagePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File tidak ditemukan: ${filePath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileExt = path.extname(filePath).toLowerCase();
    let contentType = 'image/jpeg';
    if (fileExt === '.png') contentType = 'image/png';
    else if (fileExt === '.webp') contentType = 'image/webp';

    console.log(`Mengunggah ${path.basename(filePath)} -> [Bucket: ${BUCKET_NAME}]/${storagePath}...`);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      throw error;
    }

    // Dapatkan Public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    console.log(`Sukses! URL: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (err) {
    console.error(`Gagal mengunggah ${filePath}:`, err.message);
    return null;
  }
}

/**
 * Mengunduh gambar dari URL internet lalu mengunggahnya ke Supabase Storage
 * @param {string} url URL gambar eksternal
 * @param {string} storagePath Path tujuan di bucket (misal: fasilitas/husni thamrin/lab.jpg)
 */
async function downloadAndUpload(url, storagePath) {
  try {
    console.log(`Mengunduh dari URL: ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let contentType = response.headers.get('content-type') || 'image/jpeg';

    console.log(`Mengunggah ke [Bucket: ${BUCKET_NAME}]/${storagePath}...`);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType,
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    console.log(`Sukses! URL Baru: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (err) {
    console.error(`Gagal memproses URL ${url}:`, err.message);
    return null;
  }
}

/**
 * Fungsi untuk memproses semua gambar lokal di folder tertentu
 * @param {string} folderPath Path folder lokal berisi gambar
 * @param {string} targetFolder Folder target di dalam bucket (misal: 'gedung' atau 'fasilitas/rektorat')
 */
async function processLocalFolder(folderPath, targetFolder) {
  const absoluteFolder = path.resolve(folderPath);
  if (!fs.existsSync(absoluteFolder)) {
    console.error(`Folder lokal tidak ditemukan: ${absoluteFolder}`);
    return;
  }

  const files = fs.readdirSync(absoluteFolder);
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
  
  console.log(`Menemukan ${files.length} file di ${absoluteFolder}. Mulai mengunggah gambar ke folder "${targetFolder}"...`);
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      const filePath = path.join(absoluteFolder, file);
      
      // Susun path tujuan di storage bucket
      const storagePath = `${targetFolder}/${file}`.replace(/\/+/g, '/');
      await uploadLocalFile(filePath, storagePath);
    }
  }
}

/**
 * Fungsi untuk mendeteksi URL gambar di file Seed SQL,
 * mendownloadnya, menguploadnya ke Supabase, dan membuat file SQL baru yang terupdate.
 */
async function migrateSeedUrls() {
  const seedPath = path.resolve(__dirname, '../database/002_seed_data.sql');
  const outputPath = path.resolve(__dirname, '../database/002_seed_data_updated.sql');

  if (!fs.existsSync(seedPath)) {
    console.error(`File seed tidak ditemukan di: ${seedPath}`);
    return;
  }

  console.log('Membaca file seed...');
  let seedContent = fs.readFileSync(seedPath, 'utf8');

  // Cari seksi Gedung dengan mencari blok INSERT INTO public.gedung hingga akhir pernyataan SQL (titik koma ';')
  const startGedung = seedContent.indexOf('INSERT INTO public.gedung');
  const endGedung = seedContent.indexOf(';', startGedung);

  // Cari seksi Fasilitas dengan mencari blok INSERT INTO public.fasilitas hingga akhir pernyataan SQL (titik koma ';')
  const startFasilitas = seedContent.indexOf('INSERT INTO public.fasilitas');
  const endFasilitas = seedContent.indexOf(';', startFasilitas);

  if (startGedung === -1 || startFasilitas === -1) {
    console.error('Format SQL seed tidak dikenali atau tag INSERT untuk gedung/fasilitas tidak ditemukan.');
    return;
  }

  const gedungSection = seedContent.substring(startGedung, endGedung);
  const fasilitasSection = seedContent.substring(startFasilitas, endFasilitas);

  // Regex pencarian URL gambar umum
  const urlRegex = /https?:\/\/[^\s"',)]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"',)]+)?/gi;

  const urlMap = {};

  // 1. PROSES GEDUNG URLS
  console.log('\n--- Memproses URL Gambar Gedung ---');
  const gedungUrls = [...new Set(gedungSection.match(urlRegex) || [])];
  console.log(`Menemukan ${gedungUrls.length} gambar gedung.`);

  for (let i = 0; i < gedungUrls.length; i++) {
    const url = gedungUrls[i];
    if (url.includes(supabaseUrl)) continue;

    const parsedUrl = new URL(url);
    let fileName = path.basename(parsedUrl.pathname);
    fileName = fileName.replace(/[?#].*$/, '').replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Taruh di folder 'gedung'
    const storagePath = `gedung/${fileName}`;

    console.log(`\n[Gedung ${i + 1}/${gedungUrls.length}]`);
    const newUrl = await downloadAndUpload(url, storagePath);
    if (newUrl) {
      urlMap[url] = newUrl;
    }
  }

  // 2. PROSES FASILITAS URLS
  console.log('\n--- Memproses URL Gambar Fasilitas ---');
  
  // Kita gunakan regex yang mencocokkan URL foto_url diikuti oleh id_gedung untuk mapping subfolder yang tepat
  // Contoh di SQL: 'https://feb.upnvj.ac.id/...jpg', 7
  const fasilitasUrlRegex = /'((?:https?):\/\/[^\s"',)]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"',)]+)?)'\s*,\s*(\d+)/gi;
  const matches = [...fasilitasSection.matchAll(fasilitasUrlRegex)];

  console.log(`Menemukan ${matches.length} baris fasilitas yang memiliki gambar.`);

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const url = match[1];
    const idGedung = parseInt(match[2], 10);

    if (url.includes(supabaseUrl)) continue;

    const parsedUrl = new URL(url);
    let fileName = path.basename(parsedUrl.pathname);
    fileName = fileName.replace(/[?#].*$/, '').replace(/[^a-zA-Z0-9.-]/g, '_');

    // Dapatkan nama subfolder gedung berdasarkan mapping ID
    const gedungSubfolder = gedungFolderMap[idGedung] || 'others';
    
    // Susun path tujuan: fasilitas/[nama_gedung]/[filename]
    const storagePath = `fasilitas/${gedungSubfolder}/${fileName}`;

    console.log(`\n[Fasilitas ${i + 1}/${matches.length}] (Gedung ID: ${idGedung} -> ${gedungSubfolder})`);
    const newUrl = await downloadAndUpload(url, storagePath);
    if (newUrl) {
      urlMap[url] = newUrl;
    }
  }

  // Ganti semua URL lama dengan URL Supabase baru di seluruh file SQL
  let updatedContent = seedContent;
  let replaceCount = 0;
  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    const escapedUrl = oldUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedUrl, 'g');
    updatedContent = updatedContent.replace(regex, newUrl);
    replaceCount++;
  }

  if (replaceCount > 0) {
    fs.writeFileSync(outputPath, updatedContent, 'utf8');
    console.log(`\nSelesai! Berhasil memigrasi ${replaceCount} gambar.`);
    console.log(`File SQL seed terupdate disimpan di: ${outputPath}`);
    console.log('Silakan jalankan file SQL baru ini di Supabase SQL Editor untuk memperbarui database Anda.');
  } else {
    console.log('\nTidak ada URL gambar eksternal yang diubah atau migrasi gagal.');
  }
}

// MAIN EXECUTION
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0]; // 'seed' atau 'lokal'
  const folderParam = args[1]; // path folder jika mode 'lokal'
  const destFolderParam = args[2]; // subfolder di bucket (misal: 'gedung' atau 'fasilitas/rektorat')

  const ok = await ensureBucketExists();
  if (!ok) return;

  if (mode === 'seed') {
    await migrateSeedUrls();
  } else if (mode === 'lokal') {
    if (!folderParam || !destFolderParam) {
      console.log('Cara Penggunaan Upload Lokal:');
      console.log('  node scripts/upload-media.js lokal <path-ke-folder-gambar> <folder-tujuan-bucket>');
      console.log('\nContoh:');
      console.log('  node scripts/upload-media.js lokal ./images/rektorat fasilitas/rektorat');
      console.log('  node scripts/upload-media.js lokal ./images/gedung-baru gedung');
      return;
    }
    await processLocalFolder(folderParam, destFolderParam);
  } else {
    console.log(`=== UTILITY STORAGE UPLOADER - BUCKET: "${BUCKET_NAME}" ===`);
    console.log('Silakan jalankan salah satu perintah berikut:\n');
    console.log('1. Mengunduh semua gambar di seed SQL dan menguploadnya ke folder terstruktur di Supabase:');
    console.log('   node scripts/upload-media.js seed\n');
    console.log('2. Mengunggah folder berisi gambar lokal Anda ke folder spesifik di Supabase:');
    console.log('   node scripts/upload-media.js lokal <path-folder> <folder-tujuan-bucket>');
    console.log('   (Contoh: node scripts/upload-media.js lokal ./my-rektorat-files fasilitas/rektorat)');
  }
}

main();
