# Database Setup — Dashboard Profil UPNVJ

## Quick Start

Jalankan file SQL berikut di **Supabase SQL Editor** secara berurutan:

### 1. Full Setup (Schema + RLS + Indexes)
```
database/001_full_setup.sql
```
- Drop semua tabel & policies lama (clean slate)
- Buat 7 tabel: `gedung`, `admin_users`, `fakultas`, `fasilitas`, `program_studi`, `web_analytics_log`, `audit_logs`
- Buat indexes untuk performa
- Enable RLS pada semua tabel
- Buat RLS policies tanpa konflik (naming: `{table}_{role}_{operation}`)

### 2. Seed Data (Opsional)
```
database/002_seed_data.sql
```
- Data kampus UPNVJ Pondok Labu (gedung, fakultas, prodi, fasilitas)
- Jalankan hanya jika ingin data sample

### 3. Schema Denah 2D
```
database/003_campus_map_2d.sql
```
- Membuat tabel map, node, edge, dan pointer gedung
- Aman dijalankan ulang tanpa menghapus konfigurasi yang sudah ada

### 4. Seed Konfigurasi Denah 2D
```
database/004_campus_map_config_seed.sql
```
- Memuat 63 node, 96 edge, dan 18 posisi gedung hasil editor
- Jalankan setelah master gedung dari `002_seed_data.sql` tersedia
- Idempotent: hanya konfigurasi map `pondok-labu-2d` yang diganti

### 5. Update Background Denah (Database Lama)
```
database/005_update_campus_map_background.sql
```
- Diperlukan hanya untuk database yang sudah menjalankan migrasi denah sebelumnya
- Mengarahkan map aktif ke aset background rumput tanpa mengubah koordinat navigasi

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
