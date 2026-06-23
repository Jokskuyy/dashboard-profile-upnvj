/**
 * check-unity-deletions.js — Skrip utilitas ad-hoc (read-only terhadap DB).
 *
 * Melacak apakah `unity_object_name` pernah HILANG dari fasilitas/gedung,
 * dengan menganalisis tabel `audit_logs` di Supabase:
 *   - UPDATE yang mengubah unity_object_name dari ADA -> kosong/null
 *   - DELETE terhadap baris yang punya unity_object_name
 *
 * Membaca audit_logs butuh hak baca (RLS: hanya 'authenticated'). Karena itu
 * skrip ini memakai SUPABASE_SERVICE_ROLE_KEY bila tersedia (bypass RLS).
 * Jika tidak ada, fallback ke VITE_SUPABASE_ANON_KEY (mungkin TIDAK bisa baca
 * audit_logs karena RLS).
 *
 * Jalankan dari root proyek: `node scratch/check-unity-deletions.js`
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const key = serviceKey || anonKey;

if (!url || !key) {
    console.error('Kredensial Supabase tidak ditemukan di .env (perlu URL + key).');
    process.exit(1);
}
if (!serviceKey) {
    console.warn('⚠  SUPABASE_SERVICE_ROLE_KEY tidak ada — pakai ANON key. audit_logs mungkin tidak terbaca karena RLS.\n');
}

const supabase = createClient(url, key);

/** Ambil nilai unity dari objek data audit (toleran terhadap key hilang). */
function unityOf(obj) {
    if (!obj || typeof obj !== 'object') return undefined; // tidak tercatat
    if (!('unity_object_name' in obj)) return undefined;   // kolom tidak ada di snapshot
    const v = obj.unity_object_name;
    return v === null ? '' : String(v);
}

function isEmpty(v) {
    return v === '' || v === null || v === undefined;
}

async function main() {
    // 1) Ambil audit logs untuk fasilitas & gedung.
    const { data: logs, error } = await supabase
        .from('audit_logs')
        .select('*')
        .in('table_name', ['fasilitas', 'gedung'])
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Gagal membaca audit_logs:', error.message);
        console.error('Kemungkinan RLS memblokir (butuh service role key).');
        process.exit(1);
    }

    console.log(`Total audit log fasilitas/gedung: ${logs.length}\n`);

    const lostByUpdate = [];   // unity ADA -> hilang via update
    const deletedWithUnity = []; // baris ber-unity dihapus
    const createdWithUnity = []; // baris dibuat dengan unity (info)

    for (const log of logs) {
        const oldUnity = unityOf(log.old_data);
        const newUnity = unityOf(log.new_data);

        if (log.action === 'update') {
            // old ada isinya, new jadi kosong
            if (!isEmpty(oldUnity) && oldUnity !== undefined && isEmpty(newUnity)) {
                lostByUpdate.push({
                    waktu: log.created_at,
                    tabel: log.table_name,
                    record_id: log.record_id,
                    nama: log.old_data?.nama_fasilitas || log.old_data?.nama_gedung || '(?)',
                    unity_lama: oldUnity,
                    oleh: log.actor_email || log.actor_id || '(?)',
                });
            }
        } else if (log.action === 'delete') {
            if (!isEmpty(oldUnity) && oldUnity !== undefined) {
                deletedWithUnity.push({
                    waktu: log.created_at,
                    tabel: log.table_name,
                    record_id: log.record_id,
                    nama: log.old_data?.nama_fasilitas || log.old_data?.nama_gedung || '(?)',
                    unity_lama: oldUnity,
                    oleh: log.actor_email || log.actor_id || '(?)',
                });
            }
        } else if (log.action === 'create') {
            if (!isEmpty(newUnity) && newUnity !== undefined) {
                createdWithUnity.push({
                    waktu: log.created_at,
                    nama: log.new_data?.nama_fasilitas || log.new_data?.nama_gedung || '(?)',
                    unity_baru: newUnity,
                });
            }
        }
    }

    const fmt = (rows) => rows.map((r) =>
        `  [${r.waktu}] ${r.tabel || ''} #${r.record_id || ''} "${r.nama}" unity="${r.unity_lama ?? r.unity_baru}" oleh ${r.oleh || ''}`
    ).join('\n');

    console.log('=== UPDATE yang MENGHAPUS unity_object_name (ADA -> kosong) ===');
    console.log(lostByUpdate.length ? fmt(lostByUpdate) : '  (tidak ada)');
    console.log(`  Subtotal: ${lostByUpdate.length}\n`);

    console.log('=== DELETE baris yang PUNYA unity_object_name ===');
    console.log(deletedWithUnity.length ? fmt(deletedWithUnity) : '  (tidak ada)');
    console.log(`  Subtotal: ${deletedWithUnity.length}\n`);

    console.log('=== CREATE baris dengan unity_object_name (info) ===');
    console.log(`  Subtotal: ${createdWithUnity.length}\n`);

    // 2) Bandingkan jumlah unity saat ini di DB live vs seed (227 total, 133 ber-unity).
    const { count: totalFas } = await supabase
        .from('fasilitas').select('*', { count: 'exact', head: true });
    const { count: withUnity } = await supabase
        .from('fasilitas').select('*', { count: 'exact', head: true })
        .not('unity_object_name', 'is', null);

    console.log('=== KONDISI SAAT INI (DB live) ===');
    console.log(`  fasilitas total          : ${totalFas ?? '(?)'}`);
    console.log(`  fasilitas punya unity     : ${withUnity ?? '(?)'}`);
    console.log(`  (acuan seed: 227 total, 133 ber-unity)`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
