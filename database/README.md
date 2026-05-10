# Database Setup — Dashboard Profil UPNVJ

## Quick Start

Jalankan file SQL berikut di **Supabase SQL Editor** secara berurutan:

### 1. Full Setup (Schema + RLS + Indexes)
```
database/001_full_setup.sql
```
- Drop semua tabel & policies lama (clean slate)
- Buat 10 tabel: `akreditasi`, `gedung`, `admin_users`, `fakultas`, `fasilitas`, `program_studi`, `dosen`, `mahasiswa`, `web_analytics_log`, `audit_logs`
- Buat indexes untuk performa
- Enable RLS pada semua tabel
- Buat RLS policies tanpa konflik (naming: `{table}_{role}_{operation}`)

### 2. Seed Data (Opsional)
```
database/002_seed_data.sql
```
- Data kampus UPNVJ Pondok Labu (gedung, fakultas, prodi, fasilitas)
- Jalankan hanya jika ingin data sample

---

## RLS Policy Design

Setiap tabel memiliki policies dengan penamaan konsisten `{table}_{role}_{operation}`:

| Tabel | anon (public) | authenticated (admin) |
|-------|---------------|----------------------|
| Data kampus (7 tabel) | SELECT ✅ | SELECT, INSERT, UPDATE, DELETE ✅ |
| web_analytics_log | INSERT ✅ | SELECT, INSERT ✅ |
| audit_logs | ❌ | SELECT, INSERT ✅ |
| admin_users | ❌ | SELECT, INSERT, UPDATE ✅ |

## Troubleshooting

**Error: "new row violates row-level security policy"**
→ Pastikan sudah login sebagai admin (authenticated role).

**Error: "policy already exists"**
→ Jalankan ulang `001_full_setup.sql` — file ini drop semua policies lama sebelum membuat yang baru.

**Error 403 Forbidden pada public dashboard**
→ Cek apakah policies `*_anon_select` sudah ada via query:
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public' AND roles = '{anon}';
```
