const fs = require('fs');

// Patch YAMIN (Lantai 3: 303 - 308)
let yamin = fs.readFileSync('scratch/draft_yamin.sql', 'utf8');
let ymn_l3 = "";
for (let i = 303; i <= 308; i++) {
  ymn_l3 += `('Ruang Kelas ${i}', 'Ruang kelas ${i} pada lantai 3 Gedung Muhammad Yamin.', 'Ruang Kelas', 3, 8, 'ymn_${i}'),\n`;
}
yamin = yamin.replace("('Ruang Kelas 303 - 308', 'Ruang kelas 303 sampai 308 pada lantai 3 Gedung Muhammad Yamin.', 'Ruang Kelas', 3, 8, 'ymn_303-308'),", ymn_l3);
fs.writeFileSync('scratch/draft_yamin.sql', yamin);

// Patch CIPTO (Lantai 2: Tutorial A1-4, B1-4, C1-4, D1-4. Lantai 3: Penyimpanan Manekin 1-2. Lantai 4: Mini Lecture 2-3)
let cipto = fs.readFileSync('scratch/draft_cipto.sql', 'utf8');

// A1-A4
let tut_a = "";
for (let i = 1; i <= 4; i++) {
  tut_a += `    ('Ruang Tutorial A${i}', 2, 'cpt_tutorial_a_${i}', NULL),\n`;
}
cipto = cipto.replace("    ('Ruang Tutorial A1-4', 2, 'cpt_tutorial_a_1-4', NULL),", tut_a.trim());

// B1-B4
let tut_b = "";
for (let i = 1; i <= 4; i++) {
  tut_b += `    ('Ruang Tutorial B${i}', 2, 'cpt_tutorial_b_${i}', NULL),\n`;
}
cipto = cipto.replace("    ('Ruang Tutorial B1-4', 2, 'cpt_tutorial_b_1-4', NULL),", tut_b.trim());

// C1-C4
let tut_c = "";
for (let i = 1; i <= 4; i++) {
  tut_c += `    ('Ruang Tutorial C${i}', 2, 'cpt_tutorial_c_${i}', NULL),\n`;
}
cipto = cipto.replace("    ('Ruang Tutorial C1-4', 2, 'cpt_tutorial_c_1-4', NULL),", tut_c.trim());

// D1-D4
let tut_d = "";
for (let i = 1; i <= 4; i++) {
  tut_d += `    ('Ruang Tutorial D${i}', 2, 'cpt_tutorial_d_${i}', NULL),\n`;
}
cipto = cipto.replace("    ('Ruang Tutorial D1-4', 2, 'cpt_tutorial_d_1-4', NULL),", tut_d.trim());

// Manekin 1-2
let manekin = `    ('Ruang Penyimpanan Manekin 1', 3, 'cpt_penyimpanan_manekin_1', NULL),\n    ('Ruang Penyimpanan Manekin 2', 3, 'cpt_penyimpanan_manekin_2', NULL),`;
cipto = cipto.replace("    ('Ruang Penyimpanan Manekin 1-2', 3, 'cpt_penyimpanan_manekin_1-2', NULL),", manekin);

// Mini Lecture 2-3
let mini = `    ('Ruang Mini Lecture 2', 4, 'cpt_mini_lecture_2', NULL),\n    ('Ruang Mini Lecture 3', 4, 'cpt_mini_lecture_3', NULL)`;
cipto = cipto.replace("    ('Ruang mini lecture 2 - 3', 4, 'cpt_mini_lecture_2-3', NULL)", mini);

fs.writeFileSync('scratch/draft_cipto.sql', cipto);
