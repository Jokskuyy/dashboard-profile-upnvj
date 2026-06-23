/**
 * extract-null-unity.js — Skrip utilitas ad-hoc (read-only terhadap seed; MENULIS file referensi).
 *
 * Mengekstrak fasilitas yang `unity_object_name`-nya NULL dari
 * `database/002_seed_data.sql`, dikelompokkan per gedung, lalu menulisnya ke
 * `scratch/reference-null-unity/` sebagai bahan referensi saat mengisi ulang
 * data gedung dari prefab Unity.
 *
 * Baris dengan unity_object_name NULL umumnya = data lama (dari internet) yang
 * BELUM direkonsiliasi dengan prefab. File ini TIDAK mengubah seed asli.
 *
 * Jalankan dari root proyek: `node scratch/extract-null-unity.js`
 */
import fs from 'fs';
import path from 'path';

const SEED_PATH = 'database/002_seed_data.sql';
const OUT_DIR = 'scratch/reference-null-unity';

/**
 * Pisahkan teks menjadi tuple-tuple `(...)` di level atas, menghormati string
 * kutip tunggal ('...') dan dollar-quote ($$...$$). Mengembalikan array isi
 * dalam tuple (tanpa kurung terluar).
 */
function splitTuples(body) {
    const tuples = [];
    let depth = 0;
    let inSingle = false;
    let inDollar = false;
    let start = -1;
    for (let i = 0; i < body.length; i++) {
        const c = body[i];
        const next2 = body.slice(i, i + 2);
        if (inDollar) {
            if (next2 === '$$') { inDollar = false; i++; }
            continue;
        }
        if (inSingle) {
            if (c === "'") inSingle = false;
            continue;
        }
        if (next2 === '$$') { inDollar = true; i++; continue; }
        if (c === "'") { inSingle = true; continue; }
        if (c === '(') {
            if (depth === 0) start = i + 1;
            depth++;
        } else if (c === ')') {
            depth--;
            if (depth === 0 && start !== -1) {
                tuples.push(body.slice(start, i));
                start = -1;
            }
        }
    }
    return tuples;
}

/**
 * Pecah satu isi tuple menjadi field-field berdasarkan koma di level atas,
 * menghormati kutip tunggal dan dollar-quote.
 */
function splitFields(tuple) {
    const fields = [];
    let inSingle = false;
    let inDollar = false;
    let depth = 0;
    let cur = '';
    for (let i = 0; i < tuple.length; i++) {
        const c = tuple[i];
        const next2 = tuple.slice(i, i + 2);
        if (inDollar) {
            cur += c;
            if (next2 === '$$') { cur += tuple[i + 1]; inDollar = false; i++; }
            continue;
        }
        if (inSingle) {
            cur += c;
            if (c === "'") inSingle = false;
            continue;
        }
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

/** Bersihkan nilai SQL: '...' atau $$...$$ -> teks; NULL -> null. */
function unquote(raw) {
    if (raw == null) return null;
    const v = raw.trim();
    if (v === 'NULL' || v === 'null') return null;
    if (v.startsWith('$$') && v.endsWith('$$')) return v.slice(2, -2);
    if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
    return v;
}

/** Ambil isi VALUES dari sebuah statement INSERT ke tabel tertentu. */
function extractValuesBlock(sql, tableName) {
    const re = new RegExp(`INSERT\\s+INTO\\s+public\\.${tableName}\\s*\\([^)]*\\)\\s*VALUES`, 'i');
    const m = sql.match(re);
    if (!m) return null;
    const startIdx = m.index + m[0].length;
    const endIdx = sql.indexOf(';', startIdx);
    return sql.slice(startIdx, endIdx === -1 ? sql.length : endIdx);
}

function slugify(s) {
    return String(s)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function main() {
    const sql = fs.readFileSync(SEED_PATH, 'utf8');

    // 1) Peta id_gedung -> nama_gedung (id = urutan SERIAL mulai dari 1).
    const gedungBlock = extractValuesBlock(sql, 'gedung');
    if (!gedungBlock) throw new Error('Tidak menemukan INSERT INTO public.gedung');
    const gedungTuples = splitTuples(gedungBlock);
    const gedungName = {}; // id -> nama
    gedungTuples.forEach((t, idx) => {
        const f = splitFields(t);
        gedungName[idx + 1] = unquote(f[0]); // kolom pertama = nama_gedung
    });

    // 2) Parse fasilitas. Urutan kolom:
    //    (nama, deskripsi, tipe, lantai, foto_url, id_gedung, unity_object_name)
    const fasBlock = extractValuesBlock(sql, 'fasilitas');
    if (!fasBlock) throw new Error('Tidak menemukan INSERT INTO public.fasilitas');
    const fasTuples = splitTuples(fasBlock);

    const grup = {}; // key id_gedung (atau 'tanpa_gedung') -> array fasilitas
    let totalNull = 0;

    for (const t of fasTuples) {
        const f = splitFields(t);
        if (f.length < 7) continue;
        const nama = unquote(f[0]);
        const tipe = unquote(f[2]);
        const lantai = unquote(f[3]);
        const idGedung = unquote(f[5]);
        const unity = unquote(f[6]);

        if (unity === null) {
            totalNull++;
            const key = idGedung === null ? 'tanpa_gedung' : String(idGedung);
            (grup[key] ||= []).push({ nama, tipe, lantai });
        }
    }

    // 3) Tulis output per gedung.
    fs.mkdirSync(OUT_DIR, { recursive: true });

    const keys = Object.keys(grup).sort((a, b) => {
        if (a === 'tanpa_gedung') return 1;
        if (b === 'tanpa_gedung') return -1;
        return Number(a) - Number(b);
    });

    const indexLines = ['# Referensi Fasilitas tanpa unity_object_name (NULL)', '',
        `Sumber: \`${SEED_PATH}\` — dibuat otomatis oleh \`scratch/extract-null-unity.js\`.`,
        'Baris di sini adalah data lama yang belum direkonsiliasi dengan prefab Unity.',
        '', `Total: **${totalNull}** fasilitas.`, '', '| Gedung | Jumlah | File |', '| --- | --- | --- |'];

    for (const key of keys) {
        const namaGedung = key === 'tanpa_gedung' ? 'Tanpa Gedung (id_gedung NULL)' : (gedungName[key] || `Gedung id ${key}`);
        const items = grup[key].sort((a, b) => (a.lantai ?? 0) - (b.lantai ?? 0) || String(a.nama).localeCompare(String(b.nama)));
        const fileName = `${key === 'tanpa_gedung' ? '00_tanpa_gedung' : String(key).padStart(2, '0') + '_' + slugify(namaGedung)}.md`;

        const lines = [
            `# ${namaGedung}`,
            '',
            `Fasilitas tanpa \`unity_object_name\` (NULL): **${items.length}**`,
            '',
            '| # | Nama Fasilitas | Lantai | Tipe (lama) |',
            '| --- | --- | --- | --- |',
            ...items.map((it, i) => `| ${i + 1} | ${it.nama ?? ''} | ${it.lantai ?? ''} | ${it.tipe ?? ''} |`),
            '',
        ];
        fs.writeFileSync(path.join(OUT_DIR, fileName), lines.join('\n'), 'utf8');
        indexLines.push(`| ${namaGedung} | ${items.length} | ${fileName} |`);
    }

    fs.writeFileSync(path.join(OUT_DIR, 'INDEX.md'), indexLines.join('\n'), 'utf8');

    console.log(`Selesai. ${totalNull} fasilitas NULL-unity dari ${fasTuples.length} fasilitas total.`);
    console.log(`Output ditulis ke: ${OUT_DIR}/ (lihat INDEX.md)`);
}

main();
