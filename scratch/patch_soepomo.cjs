const fs = require('fs');
let sql = fs.readFileSync('scratch/draft_soepomo.sql', 'utf8');

// D 201-202
let l2 = "";
for (let i = 201; i <= 202; i++) {
  l2 += `('Ruang Kelas D ${i}', 'Ruang kelas D ${i} pada lantai 2 Gedung DR. Soepomo.', 'Ruang Kelas', 2, 2, 'spm_d_${i}'),\n`;
}

// D 301-304
let l3 = "";
for (let i = 301; i <= 304; i++) {
  l3 += `('Ruang Kelas D ${i}', 'Ruang kelas D ${i} pada lantai 3 Gedung DR. Soepomo.', 'Ruang Kelas', 3, 2, 'spm_d_${i}'),\n`;
}

// D 401-404
let l4 = "";
for (let i = 401; i <= 404; i++) {
  l4 += `('Ruang Kelas D ${i}', 'Ruang kelas D ${i} pada lantai 4 Gedung DR. Soepomo.', 'Ruang Kelas', 4, 2, 'spm_d_${i}'),\n`;
}

sql = sql.replace("('Ruang Kelas D 201-202', 'Ruang kelas D 201 sampai D 202 pada lantai 2 Gedung DR. Soepomo.', 'Ruang Kelas', 2, 2, 'spm_d_201-202'),", l2);
sql = sql.replace("('Ruang Kelas D 301-304', 'Ruang kelas D 301 sampai D 304 pada lantai 3 Gedung DR. Soepomo.', 'Ruang Kelas', 3, 2, 'spm_d_301-304'),", l3);
sql = sql.replace("('Ruang Kelas D 401-404', 'Ruang kelas D 401 sampai D 404 pada lantai 4 Gedung DR. Soepomo.', 'Ruang Kelas', 4, 2, 'spm_d_401-404'),", l4);

fs.writeFileSync('scratch/draft_soepomo.sql', sql);
