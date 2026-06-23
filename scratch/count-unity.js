/**
 * count-unity.js — Hitung fasilitas total vs ber-unity dari sebuah berkas seed
 * SQL, dengan MEMBACA HEADER KOLOM secara dinamis (tahan terhadap perubahan
 * urutan/kehadiran kolom antar versi/commit).
 *
 * Jika kolom unity_object_name TIDAK ADA di header, laporkan unity=N/A.
 *
 * Pemakaian:
 *   node scratch/count-unity.js <file.sql>
 *   git show <hash>:database/002_seed_data.sql | node scratch/count-unity.js -
 *
 * Read-only.
 */
import fs from 'fs';

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
function isNull(raw) {
    const v = (raw ?? '').trim();
    return v === 'NULL' || v === 'null' || v === '' || v === "''";
}

/** Ambil daftar nama kolom + blok VALUES dari INSERT fasilitas. */
function parseFasInsert(sql) {
    const re = /INSERT\s+INTO\s+public\.fasilitas\s*\(([^)]*)\)\s*VALUES/i;
    const m = sql.match(re);
    if (!m) return null;
    const columns = m[1].split(',').map((s) => s.trim().toLowerCase());
    const start = m.index + m[0].length;
    const end = sql.indexOf(';', start);
    const block = sql.slice(start, end === -1 ? sql.length : end);
    return { columns, block };
}

function main() {
    const arg = process.argv[2];
    const sql = (!arg || arg === '-') ? fs.readFileSync(0, 'utf8') : fs.readFileSync(arg, 'utf8');

    const parsed = parseFasInsert(sql);
    if (!parsed) { console.log('total=0 unity=N/A (blok fasilitas tidak ditemukan)'); return; }

    const { columns, block } = parsed;
    const unityIdx = columns.indexOf('unity_object_name');
    const tuples = splitTuples(block);

    let total = 0, withUnity = 0;
    for (const t of tuples) {
        const f = splitFields(t);
        if (f.length < columns.length) continue;
        total++;
        if (unityIdx >= 0 && !isNull(f[unityIdx])) withUnity++;
    }

    if (unityIdx < 0) {
        console.log(`total=${total} unity=N/A (kolom unity_object_name TIDAK ADA)`);
    } else {
        console.log(`total=${total} unity=${withUnity} null=${total - withUnity}`);
    }
}

main();
