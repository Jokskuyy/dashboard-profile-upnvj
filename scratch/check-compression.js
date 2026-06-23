/**
 * check-compression.js — Skrip utilitas ad-hoc (read-only).
 *
 * Deteksi apakah berkas `.wasm.unityweb` pada build Unity dikompres dengan
 * GZIP atau Brotli (dengan mencoba dekompresi).
 *
 * Jalankan dari root proyek: `node scratch/check-compression.js`
 * Catatan: sesuaikan `filePath` dengan versi build terbaru di
 * `public/unity-builds/` bila perlu.
 */
import fs from 'fs';
import zlib from 'zlib';

const filePath = 'public/unity-builds/v0.2.05/build/v0.0.15.wasm.unityweb';

if (fs.existsSync(filePath)) {
  const buffer = fs.readFileSync(filePath);
  
  try {
    // Attempt gzip decompression
    zlib.gunzipSync(buffer);
    console.log('Successfully decompressed with GZIP!');
  } catch (err) {
    console.log('Failed to decompress with GZIP:', err.message);
  }

  try {
    // Attempt brotli decompression
    zlib.brotliDecompressSync(buffer);
    console.log('Successfully decompressed with BROTLI!');
  } catch (err) {
    console.log('Failed to decompress with BROTLI:', err.message);
  }
} else {
  console.log('File not found:', filePath);
}
