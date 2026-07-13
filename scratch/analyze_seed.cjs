const fs = require('fs');

const sql = fs.readFileSync('database/002_seed_data.sql', 'utf8');

// Regex untuk mencocokkan pattern INSERT INTO ... VALUES (...)
const insertRegex = /INSERT INTO public\.fasilitas.*?VALUES\s*([\s\S]*?);/g;

let match;
const data = [];

while ((match = insertRegex.exec(sql)) !== null) {
  const valuesStr = match[1];
  
  // Pisahkan per baris fasilitas menggunakan split dan regex
  const rows = valuesStr.split(/\),\s*\(/);
  
  rows.forEach(row => {
    let cleanRow = row.replace(/^\(|\)$/g, '');
    const parts = cleanRow.match(/('([^']+)'|NULL|\d+)/g);
    
    if (parts && parts.length >= 6) {
      data.push({
        nama: parts[0].replace(/'/g, ''),
        desc: parts[1].replace(/'/g, ''),
        tipe: parts[2].replace(/'/g, ''),
        lantai: parts[3],
        gedung: parts[4],
        pointer: parts[5] ? parts[5].replace(/'/g, '') : null
      });
    }
  });
}

// Analisis Tipe Fasilitas
const tipes = {};
data.forEach(d => {
  tipes[d.tipe] = (tipes[d.tipe] || 0) + 1;
});
console.log("=== TIPE FASILITAS UNIQUE ===");
Object.entries(tipes).sort((a, b) => b[1] - a[1]).forEach(t => console.log(`${t[0]}: ${t[1]}`));

console.log("\n=== TIPE FASILITAS YANG KURANG KONSISTEN ===");
Object.keys(tipes).forEach(t => {
  if (t.includes('/') || t.includes('&') || t.toLowerCase().includes('ruang')) {
     console.log(`- ${t}`);
  }
});
