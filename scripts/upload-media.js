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
      console.log(`Silakan buat bucket secara manual bernama "${BUCKET_NAME}" dengan akses PUBLIC di Dashboard Supabase.`);
      return false;
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
 * Mengunduh gambar dari URL internet lalu mengunggahnya ke Supabase Storage.
 * Mendeteksi ekstensi file secara dinamis dari header Content-Type jika tidak ada ekstensi di URL.
 * @param {string} url URL gambar eksternal
 * @param {string} storagePathWithoutExt Path tujuan di bucket tanpa ekstensi di ujungnya (misal: 'gedung/gedung_rektorat')
 */
async function downloadAndUpload(url, storagePathWithoutExt) {
  try {
    console.log(`Mengunduh dari URL: ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Deteksi Content-Type secara dinamis
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    let ext = '.jpg';
    if (contentType.includes('image/png')) ext = '.png';
    else if (contentType.includes('image/webp')) ext = '.webp';
    else if (contentType.includes('image/gif')) ext = '.gif';

    // Jika target storagePath sudah memiliki ekstensi gambar di ujungnya, pakai itu.
    // Jika tidak, tambahkan ekstensi yang dideteksi secara dinamis.
    let storagePath = storagePathWithoutExt;
    if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(storagePath)) {
      storagePath += ext;
    }

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
 * Fungsi untuk mendeteksi data di file Seed SQL,
 * mendownload gambar, me-rename file sesuai nama gedung/fasilitas,
 * mengupload ke Supabase, dan membuat file SQL baru yang terupdate.
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

  const urlMap = {};

  // 1. PROSES GEDUNG URLS (DENGAN RE-NAME SESUAI NAMA GEDUNG)
  console.log('\n--- Memproses & Re-name URL Gambar Gedung ---');
  
  // Regex untuk mencocokkan baris gedung: ('Nama Gedung', 'Deskripsi', 'Lokasi', lantai, 'url', 'unity')
  const gedungRowRegex = /\(\s*'([^']+)'\s*,\s*'[^']*'\s*,\s*'[^']*'\s*,\s*(?:\d+|NULL)\s*,\s*'((?:https?):\/\/[^\s"',)]+)'\s*,\s*(?:'[^']*'|NULL)\s*\)/gi;
  const gedungMatches = [...gedungSection.matchAll(gedungRowRegex)];
  
  console.log(`Menemukan ${gedungMatches.length} baris gedung yang memiliki gambar.`);

  for (let i = 0; i < gedungMatches.length; i++) {
    const match = gedungMatches[i];
    const gedungName = match[1];
    const url = match[2];

    if (url.includes(supabaseUrl)) continue;

    // Bersihkan nama gedung untuk dijadikan nama file (lowercase, hilangkan karakter khusus)
    const cleanGedungName = gedungName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    
    const fileName = `gedung_${cleanGedungName}`;
    const storagePath = `gedung/${fileName}`;

    console.log(`\n[Gedung ${i + 1}/${gedungMatches.length}] "${gedungName}"`);
    const newUrl = await downloadAndUpload(url, storagePath);
    if (newUrl) {
      urlMap[url] = newUrl;
    }
  }

  // 2. PROSES FASILITAS URLS (DENGAN RE-NAME SESUAI NAMA FASILITAS)
  console.log('\n--- Memproses & Re-name URL Gambar Fasilitas ---');
  
  // Regex mencocokkan multiline baris fasilitas: ('Nama Fasilitas', 'Deskripsi', 'Tipe', lantai, 'url', id_gedung, 'unity')
  const fasilitasRowRegex = /\(\s*'([^'\n]+)'\s*,\s*'[^']*'\s*,\s*'[^']*'\s*,\s*(?:\d+|NULL)\s*,\s*'((?:https?):\/\/[^\s"',)]+)'\s*,\s*(\d+)/gi;
  const fasilitasMatches = [...fasilitasSection.matchAll(fasilitasRowRegex)];

  console.log(`Menemukan ${fasilitasMatches.length} baris fasilitas yang memiliki gambar.`);

  for (let i = 0; i < fasilitasMatches.length; i++) {
    const match = fasilitasMatches[i];
    const fasilitasName = match[1];
    const url = match[2];
    const idGedung = parseInt(match[3], 10);

    if (url.includes(supabaseUrl)) continue;

    // Bersihkan nama fasilitas untuk nama file
    const cleanFasilitasName = fasilitasName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    // Dapatkan nama subfolder gedung berdasarkan mapping ID
    const gedungSubfolder = gedungFolderMap[idGedung] || 'others';
    
    // Susun path tujuan menggunakan nama fasilitas: fasilitas/[nama_gedung]/[nama_fasilitas]
    const storagePath = `fasilitas/${gedungSubfolder}/${cleanFasilitasName}`;

    console.log(`\n[Fasilitas ${i + 1}/${fasilitasMatches.length}] "${fasilitasName}" (Gedung: ${gedungSubfolder})`);
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
    console.log(`\nSelesai! Berhasil memigrasi ${replaceCount} gambar dengan nama file yang rapi.`);
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
