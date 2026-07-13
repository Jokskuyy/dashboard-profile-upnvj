const fs = require('fs');
let sql = fs.readFileSync('scratch/draft_thamrin.sql', 'utf8');

// Pisahkan 303-311
let lantai3 = "";
for(let i = 303; i <= 311; i++) {
    lantai3 += `('Ruang Kelas ${i}', 'Ruang kelas ${i} pada lantai 3 Gedung Moh. Husni Thamrin.', 'Ruang Kelas', 3, 7, 'mt_${i}'),\n`;
}

// Pisahkan 402-407 
let lantai4 = "";
for(let i = 402; i <= 407; i++) {
    lantai4 += `('Ruang Kelas ${i}', 'Ruang kelas ${i} pada lantai 4 Gedung Moh. Husni Thamrin.', 'Ruang Kelas', 4, 7, 'mt_${i}')${i === 407 ? ';' : ','}\n`;
}

sql = sql.replace("('Ruang Kelas 303 - 311', 'Ruang kelas 303 sampai 311 pada lantai 3 Gedung Moh. Husni Thamrin.', 'Ruang Kelas', 3, 7, 'mt_303-311'),\n", lantai3);
sql = sql.replace("('Ruang Kelas 402 - 407', 'Ruang kelas 402 sampai 407 pada lantai 4 Gedung Moh. Husni Thamrin.', 'Ruang Kelas', 4, 7, 'mt_402-407');\n", lantai4);
sql = sql.replace("('Ruang Kelas 402 - 407', 'Ruang kelas 402 sampai 407 pada lantai 4 Gedung Moh. Husni Thamrin.', 'Ruang Kelas', 4, 7, 'mt_402-407');", lantai4);

fs.writeFileSync('scratch/draft_thamrin.sql', sql);
