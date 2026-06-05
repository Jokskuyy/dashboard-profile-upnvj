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
