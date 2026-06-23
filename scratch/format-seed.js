/**
 * format-seed.js — Rapikan blok INSERT fasilitas di database/002_seed_data.sql.
 *
 * Apa yang dilakukan:
 *   - Mengurutkan tuple fasilitas: id_gedung -> lantai -> nama_fasilitas (alfabetis).
 *   - Mengelompokkan per gedung dengan komentar header `-- Gedung N: <nama>`.
 *   - Mempertahankan TOKEN DATA ASLI persis (deskripsi $$...$$, NULL, angka,
 *     string) — hanya URUTAN tuple & indentasi yang berubah, isi tidak diubah.
 *   - Hanya menyentuh blok INSERT fasilitas; bagian lain file tidak diubah.
 *
 * Aman: membuat backup ke scratch/_seed_backup.sql sebelum menulis.
 * Jalankan dari root: `node scratch/format-seed.js`
 */
import fs from 'fs';

const SEED = 'database/002_seed_data.sql';

function splitTuples(body) {
    const tuples = [];
    let depth = 0, inSingle = false, inDollar = false, start = -1;
    for (let i = 0; i < body.length; i++) {
        const c = body[i];
        const next2 = body.slice(i, i + 2);
        if (inDollar) { if (next2 === '$$') { inDollar = false; i++; } continue; }
        if (inSingle) { if (c === "'") inSingle = false; continue; }
        if (next2 === '$$') { inDollar = true; i++; continue; }
        if (c === "'") { inSingle = true; continue; }
        if (c === '(') { if (depth === 0) start = i + 1; depth++; }
        else if (c === ')') { depth--; if (depth === 0 && start !== -1) { tuples.push(body.slice(start, i)); start = -1; } }
    }
    return tuples;
}
function splitFields(tuple) {
    const fields = [];
    let inSingle = false, inDollar = false, depth = 0, cur = '';
    for (let i = 0; i < tuple.length; i++) {
        const c = tuple[i];
        const next2 = tuple.slice(i, i + 2);
        if (inDollar) { cur += c; if (next2 === '$$') { cur += tuple[i + 1]; inDollar = false; i++; } continue; }
        if (inSingle) { cur += c; if (c === "'") inSingle = false; continue; }
        if (next2 === '$$') { cur += next2; inDollar = true; i++; continue; }
        if (c === "'") { cur += c; inSingle = true; continue; }
        if (c === '(') { depth++; cur += c; continue; }
        if (c === ')') { depth--; cur += c; continue; }
        if (c === ',' && depth === 0) { fields.push(cur.trim()); cur = ''; continue; }
        cur += c;
    }
    if (cur.trim().length > 0) fields.push(cur.trim());
    return fields;
}
function unquote(raw) {
    if (raw == null) return null;
    const v = raw.trim();
    if (v === 'NULL' || v === 'null') return null;
    if (v.startsWith('$$') && v.endsWith('$$')) return v.slice(2, -2);
    if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
    return v;
}
function num(raw) {
    const v = unquote(raw);
    if (v === null) return Infinity; // NULL diletakkan terakhir
    const n = Number(v);
    return Number.isNaN(n) ? Infinity : n;
}

function main() {
    const sql = fs.readFileSync(SEED, 'utf8');

    // Backup dulu
    fs.writeFileSync('scratch/_seed_backup.sql', sql, 'utf8');

    // --- Peta id_gedung -> nama (urutan SERIAL mulai 1) ---
    const gRe = /INSERT\s+INTO\s+public\.gedung\s*\([^)]*\)\s*VALUES/i;
    const gm = sql.match(gRe);
    const gStart = gm.index + gm[0].length;
    const gEnd = sql.indexOf(';', gStart);
    const gedungName = {};
    splitTuples(sql.slice(gStart, gEnd)).forEach((t, i) => {
        gedungName[i + 1] = unquote(splitFields(t)[0]);
    });

    // --- Lokasi blok INSERT fasilitas ---
    const fRe = /INSERT\s+INTO\s+public\.fasilitas\s*\(([^)]*)\)\s*VALUES/i;
    const fm = sql.match(fRe);
    if (!fm) throw new Error('INSERT fasilitas tidak ditemukan');
    const headerEnd = fm.index + fm[0].length;     // tepat setelah "VALUES"
    const semi = sql.indexOf(';', headerEnd);       // akhir statement
    const before = sql.slice(0, fm.index);          // semua sebelum INSERT fasilitas
    const after = sql.slice(semi + 1);              // semua setelah ';'

    const columns = fm[1].split(',').map((s) => s.trim());
    const idxGedung = columns.indexOf('id_gedung');
    const idxLantai = columns.indexOf('lantai');
    const idxNama = columns.indexOf('nama_fasilitas');

    // --- Parse + urutkan tuple ---
    const block = sql.slice(headerEnd, semi);
    const rows = splitTuples(block).map((t) => {
        const f = splitFields(t);
        return {
            fields: f,
            gedung: num(f[idxGedung]),
            lantai: num(f[idxLantai]),
            nama: (unquote(f[idxNama]) || '').toLowerCase(),
        };
    });

    rows.sort((a, b) =>
        a.gedung - b.gedung ||
        a.lantai - b.lantai ||
        a.nama.localeCompare(b.nama)
    );

    // --- Bangun ulang blok dengan header gedung & indentasi konsisten ---
    const indent = '    ';
    const out = [];
    out.push(`INSERT INTO public.fasilitas (${columns.join(', ')}) VALUES`);

    let lastGedung = Symbol('none');
    const pieces = [];
    for (const r of rows) {
        if (r.gedung !== lastGedung) {
            lastGedung = r.gedung;
            const label = r.gedung === Infinity
                ? 'Tanpa Gedung (id_gedung NULL)'
                : `Gedung ${r.gedung}: ${gedungName[r.gedung] || '(tidak diketahui)'}`;
            pieces.push({ comment: `-- ${label}` });
        }
        const body = r.fields.map((f) => indent + f).join(',\n');
        pieces.push({ tuple: `(\n${body}\n)` });
    }

    // Gabungkan: koma pemisah antar-tuple, komentar berdiri sendiri.
    let body = '';
    for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i];
        if (p.comment) {
            body += (i === 0 ? '' : '\n\n') + p.comment + '\n';
        } else {
            // apakah ada tuple berikutnya (butuh koma)?
            const moreTuplesAfter = pieces.slice(i + 1).some((x) => x.tuple);
            body += p.tuple + (moreTuplesAfter ? ',\n' : '');
        }
    }

    const newBlock = `${out[0]}\n${body};`;
    const newSql = before + newBlock + after;

    fs.writeFileSync(SEED, newSql, 'utf8');

    console.log(`Selesai. ${rows.length} fasilitas ditata ulang (urut: gedung -> lantai -> nama).`);
    console.log('Backup: scratch/_seed_backup.sql');
}

main();
