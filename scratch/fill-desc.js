/**
 * fill-desc.js — Skrip utilitas ad-hoc (MENULIS berkas seed SQL).
 *
 * Isi deskripsi & tipe untuk daftar fasilitas spesifik (mis. ruang kelas
 * F.30x/F.40x, PBU, Musholla, dll.) yang deskripsinya masih kosong pada
 * `database/002_seed_data.sql`.
 *
 * Jalankan dari root proyek: `node scratch/fill-desc.js`
 * ⚠️ Memodifikasi `database/002_seed_data.sql` di tempat — buat cadangan dulu.
 */
import fs from 'fs';

const sqlPath = 'database/002_seed_data.sql';
let sqlContent = fs.readFileSync(sqlPath, 'utf8');

const replacements = [
  {
    name: 'PBU',
    desc: 'Layanan Pusat Bimbingan Ujian dan Administrasi Terpadu.',
    type: 'Administrasi & Layanan'
  },
  {
    name: 'Ruang Gugus Kendali Mutu',
    desc: 'Ruang operasional Gugus Kendali Mutu untuk penjaminan standar mutu akademik dan pelayanan.',
    type: 'Ruang Kerja'
  },
  {
    name: 'Ruang Kelas F.201',
    desc: 'Fasilitas ruang kelas pembelajaran teori F.201.',
    type: 'Ruang Kelas'
  },
  {
    name: 'Ruang Dosen',
    desc: 'Fasilitas ruang istirahat dan kerja bagi tenaga pendidik atau dosen.',
    type: 'Ruang Kerja'
  },
  {
    name: 'Ruang Server Wifi',
    desc: 'Pusat kontrol dan server jaringan WiFi untuk menjamin konektivitas internet di area gedung.',
    type: 'Fasilitas Umum'
  },
  {
    name: 'Pantry',
    desc: 'Fasilitas dapur kecil untuk kebutuhan konsumsi staf dan dosen.',
    type: 'Fasilitas Umum'
  },
  {
    name: 'Musholla',
    desc: 'Fasilitas tempat ibadah bagi mahasiswa, staf, dan dosen.',
    type: 'Fasilitas Umum'
  },
  {
    name: 'Ruang Konseling dan Bimbingan Karir',
    desc: 'Ruangan khusus untuk memberikan layanan bimbingan konseling dan pengembangan karir mahasiswa.',
    type: 'Layanan Mahasiswa'
  },
  {
    name: 'Ruang HIMASIFO',
    desc: 'Ruang sekretariat operasional Himpunan Mahasiswa Sistem Informasi (HIMASIFO).',
    type: 'Ruang Kegiatan Mahasiswa'
  },
  {
    name: 'Ruang EOS',
    desc: 'Ruang sekretariat unit kegiatan kemahasiswaan EOS.',
    type: 'Ruang Kegiatan Mahasiswa'
  },
  {
    name: 'Ruang BEM FISIP',
    desc: 'Ruang sekretariat Badan Eksekutif Mahasiswa (BEM) Fakultas Ilmu Sosial dan Ilmu Politik.',
    type: 'Ruang Kegiatan Mahasiswa'
  }
];

// Add Ruang Kelas F.301 to F.307
for (let i = 1; i <= 7; i++) {
  replacements.push({
    name: `Ruang Kelas F.30${i}`,
    desc: `Fasilitas ruang kelas pembelajaran teori F.30${i}.`,
    type: 'Ruang Kelas'
  });
}

// Add Ruang Kelas F.401 to F.404
for (let i = 1; i <= 4; i++) {
  replacements.push({
    name: `Ruang Kelas F.40${i}`,
    desc: `Fasilitas ruang kelas pembelajaran teori F.40${i}.`,
    type: 'Ruang Kelas'
  });
}

for (const r of replacements) {
  // Regex to find the block for this facility where description is ''
  const regex = new RegExp(`\\(\\s*'${r.name}',\\s*'',\\s*'[^']*'`, 'g');
  sqlContent = sqlContent.replace(regex, `(\n    '${r.name}',\n    '${r.desc}',\n    '${r.type}'`);
}

fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log('SQL file updated with descriptions and types.');
