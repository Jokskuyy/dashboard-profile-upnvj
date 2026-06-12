import fs from 'fs';

const sqlPath = 'database/002_seed_data.sql';
let sqlContent = fs.readFileSync(sqlPath, 'utf8');

// Replace Ruang Dosen type from 'Ruang Kerja' to 'Ruang Dosen'
sqlContent = sqlContent.replace(
  /\(\s*'Ruang Dosen',\s*'Fasilitas ruang istirahat dan kerja bagi tenaga pendidik atau dosen.',\s*'Ruang Kerja'/g,
  "(\n    'Ruang Dosen',\n    'Fasilitas ruang istirahat dan kerja bagi tenaga pendidik atau dosen.',\n    'Ruang Dosen'"
);

// Replace Gugus Kendali Mutu type from 'Ruang Kerja' to 'Administrasi & Layanan'
sqlContent = sqlContent.replace(
  /\(\s*'Ruang Gugus Kendali Mutu',\s*'Ruang operasional Gugus Kendali Mutu untuk penjaminan standar mutu akademik dan pelayanan.',\s*'Ruang Kerja'/g,
  "(\n    'Ruang Gugus Kendali Mutu',\n    'Ruang operasional Gugus Kendali Mutu untuk penjaminan standar mutu akademik dan pelayanan.',\n    'Administrasi & Layanan'"
);

fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log('Fixed facility types in SQL file.');
