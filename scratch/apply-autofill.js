/**
 * apply-autofill.js — Isi tipe_fasilitas & deskripsi_fasilitas yang KOSONG pada
 * database/002_seed_data.sql memakai facility-autofill.js (kategorisasi + deskripsi).
 *
 * Non-destruktif: hanya mengisi field yang kosong/NULL/terlalu pendek.
 * Nilai yang sudah terisi TIDAK ditimpa. Juga menormalkan foto_url '' -> NULL.
 * Tidak menyentuh unity_object_name, lantai, id_gedung, nama_fasilitas.
 *
 * Aman: backup ke scratch/_seed_backup_autofill.sql sebelum menulis.
 * Jalankan dari root: `node scratch/apply-autofill.js`
 */
import fs from 'fs';
import { categorizeFacility, generateDescription } from './facility-autofill.js';

const SEED = 'database/002_seed_data.sql';

function splitTuples(body) {
    const tuples = [];
    let depth = 0, inSingle = false, inDollar = false, start = -1;
    for (let i = 0; i < body.length; i++) {
        const c = body[i];
        const next2 = body.slice(i, i + 2);
        if (inDollar) { if (next2 === '$$') { inDollar = false; i++; } continue; }
        if (inSingle) { if (c === "'") inSingle = false; continue; }
        // Lewati komentar baris SQL (-- ...), HANYA di luar tuple agar tidak ganggu data
        if (depth === 0 && next2 === '--') { const nl = body.indexOf('\n', i); if (nl === -1) break; i = nl; continue; }
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
const isEmpty = (raw) => {
    const v = unquote(raw);
    return v === null || v.trim() === '';
};

function main() {
    const sql = fs.readFileSync(SEED, 'utf8');
    fs.writeFileSync('scratch/_seed_backup_autofill.sql', sql, 'utf8');

    const fRe = /INSERT\s+INTO\s+public\.fasilitas\s*\(([^)]*)\)\s*VALUES/i;
    const fm = sql.match(fRe);
    if (!fm) throw new Error('INSERT fasilitas tidak ditemukan');
    const headerEnd = fm.index + fm[0].length;
    const semi = sql.indexOf(';', headerEnd);
    const before = sql.slice(0, headerEnd);
    // Buang baris komentar (-- ...) sebelum tokenisasi; baris data tak pernah diawali --
    const block = sql.slice(headerEnd, semi).split('\n').filter((l) => !/^\s*--/.test(l)).join('\n');
    const after = sql.slice(semi); // mulai dari ';'

    const columns = fm[1].split(',').map((s) => s.trim());
    const ci = (name) => columns.indexOf(name);
    const iNama = ci('nama_fasilitas'), iDesk = ci('deskripsi_fasilitas'),
        iTipe = ci('tipe_fasilitas'), iFoto = ci('foto_url');

    let filledTipe = 0, filledDesk = 0, fixedFoto = 0;

    // Pecah block menjadi segmen (komentar & tuple) agar komentar header gedung tetap.
    // Kita rebuild tuple per tuple, mempertahankan komentar di antaranya.
    const tuples = splitTuples(block);
    const rebuilt = tuples.map((t) => {
        const f = splitFields(t);
        if (f.length !== columns.length) return null; // bukan tuple valid
        const nama = unquote(f[iNama]) || '';

        if (iTipe >= 0 && isEmpty(f[iTipe])) {
            f[iTipe] = `'${categorizeFacility(nama)}'`;
            filledTipe++;
        }
        if (iDesk >= 0 && isEmpty(f[iDesk])) {
            const tipe = unquote(f[iTipe]) || categorizeFacility(nama);
            f[iDesk] = `$$${generateDescription(nama, tipe)}$$`;
            filledDesk++;
        }
        if (iFoto >= 0) {
            const v = (f[iFoto] ?? '').trim();
            if (v === "''" || v === '') { f[iFoto] = 'NULL'; fixedFoto++; }
        }
        return '(\n' + f.map((x) => '    ' + x).join(',\n') + '\n)';
    });

    if (rebuilt.some((x) => x === null)) {
        throw new Error('Ada tuple dengan jumlah field tidak sesuai header — batal demi keamanan.');
    }

    const newBlock = '\n' + rebuilt.join(',\n') + '\n';
    fs.writeFileSync(SEED, before + newBlock + after, 'utf8');

    console.log(`Tipe diisi   : ${filledTipe}`);
    console.log(`Deskripsi diisi: ${filledDesk}`);
    console.log(`foto_url '' -> NULL: ${fixedFoto}`);
    console.log('Backup: scratch/_seed_backup_autofill.sql');
}

main();
