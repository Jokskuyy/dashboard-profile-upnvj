import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Kredensial Supabase tidak lengkap di file .env (VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY/VITE_SUPABASE_ANON_KEY).');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

/**
 * Tabel yang berisi data pribadi/sensitif beserta aturan anonimisasinya.
 * Mengikuti skema di database/001_full_setup.sql.
 *
 * Aturan per kolom:
 *  - 'name'    : ganti dengan nama generik
 *  - 'email'   : mask domain dipertahankan, bagian lokal diacak
 *  - 'phone'   : ganti dengan placeholder
 *  - 'address' : ganti dengan placeholder
 *  - 'redact'  : hilangkan field sepenuhnya (mis. hash kredensial)
 */
const TABLE_RULES = {
  admin_users: {
    username: 'name',
    nama_lengkap: 'name',
    password_hash: 'redact'
  },
  fakultas: {
    email: 'email'
  },
  audit_logs: {
    actor_email: 'email'
  }
};

/**
 * Anonimisasi satu nilai sesuai jenis aturan.
 * Mencerminkan logika `anonymizePersonalData` di src/utils/dataProtection.ts.
 */
function anonymizeValue(kind, value) {
  switch (kind) {
    case 'name':
      return `User ${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    case 'email': {
      if (typeof value === 'string' && value.includes('@')) {
        const [, domain] = value.split('@');
        return `user${Math.floor(Math.random() * 9999)}@${domain}`;
      }
      return value;
    }
    case 'phone':
      return '+62 XXX-XXXX-XXXX';
    case 'address':
      return '[Address Hidden]';
    default:
      return value;
  }
}

/**
 * Terapkan aturan anonimisasi ke satu baris (objek).
 * Field dengan aturan 'redact' dihapus dari salinan.
 */
function anonymizeRow(row, rules) {
  const anonymized = { ...row };
  for (const [field, kind] of Object.entries(rules)) {
    if (!(field in anonymized)) continue;
    if (kind === 'redact') {
      delete anonymized[field];
      continue;
    }
    anonymized[field] = anonymizeValue(kind, anonymized[field]);
  }
  return anonymized;
}

async function main() {
  const outDir = path.resolve(__dirname, '../scratch/anonymized');
  fs.mkdirSync(outDir, { recursive: true });

  console.log('=== ANONIMISASI DATA (EKSPOR SNAPSHOT NON-DESTRUKTIF) ===\n');
  console.log(`Output akan ditulis ke: ${outDir}\n`);

  let totalRows = 0;

  for (const [table, rules] of Object.entries(TABLE_RULES)) {
    console.log(`Mengambil data dari tabel "${table}"...`);
    const { data, error } = await supabase.from(table).select('*');

    if (error) {
      console.error(`  Gagal membaca "${table}": ${error.message}`);
      continue;
    }

    const rows = Array.isArray(data) ? data : [];
    const anonymizedRows = rows.map((row) => anonymizeRow(row, rules));
    totalRows += anonymizedRows.length;

    const outFile = path.join(outDir, `${table}.anonymized.json`);
    fs.writeFileSync(outFile, JSON.stringify(anonymizedRows, null, 2), 'utf8');
    console.log(`  ✔ ${anonymizedRows.length} baris dianonimkan -> ${path.relative(process.cwd(), outFile)}`);
  }

  console.log(`\n[Sukses] Total ${totalRows} baris dianonimkan. Database asli TIDAK diubah (ekspor snapshot saja).`);
}

main().catch((err) => {
  console.error('Gagal menjalankan anonimisasi:', err.message);
  process.exit(1);
});
