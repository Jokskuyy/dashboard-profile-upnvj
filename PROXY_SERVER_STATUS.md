# 🔧 Status proxy-server & Debugging Guide

## ❌ proxy-server TIDAK DIPAKAI LAGI

**Status**: ✅ Semua sudah migrasi ke Supabase!

---

## 📊 Riwayat Migrasi

### ❌ Sebelum (Pakai proxy-server):
```
Dashboard → http://localhost:3001/api → proxy-server → JSON files
```

**Masalah**:
- Harus jalankan 2 server (Vite + proxy-server)
- Data di JSON files, tidak real-time
- Authentication sederhana (JWT manual)
- Analytics tersimpan lokal

### ✅ Sekarang (Pakai Supabase):
```
Dashboard → Supabase API → PostgreSQL Database
```

**Keuntungan**:
- Hanya 1 server (Vite dev server)
- Data real-time dari PostgreSQL
- Authentication built-in (Supabase Auth)
- Analytics tersimpan di database

---

## 🗂️ File Status

| File/Folder | Status | Keterangan |
|-------------|--------|------------|
| `proxy-server/` | ❌ **DEPRECATED** | Tidak digunakan lagi |
| `proxy-server/server.js` | ❌ **DEPRECATED** | Replaced by Supabase |
| `proxy-server/auth.js` | ❌ **DEPRECATED** | Replaced by Supabase Auth |
| `proxy-server/analytics-data.json` | ❌ **DEPRECATED** | Data now in `web_analytics_log` table |
| `proxy-server/admin-data.json` | ❌ **DEPRECATED** | Not needed (Supabase Auth) |
| `public/data/dashboard-data.json` | ⚠️ **UNUSED** | Replaced by Supabase tables |

---

## 🎯 Komponen yang Sudah Dimigrasi

### ✅ 1. Authentication
**Sebelum**: `proxy-server/auth.js` (JWT manual)
```typescript
// OLD
fetch('http://localhost:3001/api/auth/login', { ... })
```

**Sekarang**: Supabase Auth
```typescript
// NEW
import { supabase } from '../lib/supabase';
await supabase.auth.signInWithPassword({ email, password });
```

**File**: `src/contexts/AuthContext.tsx`

---

### ✅ 2. Dashboard CRUD
**Sebelum**: `proxy-server/server.js` endpoints
```typescript
// OLD
POST http://localhost:3001/api/professors
PUT  http://localhost:3001/api/professors/:id
```

**Sekarang**: Supabase PostgreSQL
```typescript
// NEW
await supabase.from('dosen').insert({ ... })
await supabase.from('dosen').update({ ... })
```

**File**: `src/services/api/supabaseDataService.ts`

---

### ✅ 3. Analytics Tracking
**Sebelum**: `proxy-server/analytics-data.json`
```typescript
// OLD
fetch('http://localhost:3001/api/track/pageview', { ... })
```

**Sekarang**: Supabase `web_analytics_log` table
```typescript
// NEW
await supabase.from('web_analytics_log').insert({ ... })
```

**File**: `src/services/analytics/trackingService.ts`

---

### ✅ 4. TrafficOverview (Terakhir dimigrasi!)
**Sebelum**: Fetch dari proxy-server
```typescript
// OLD - src/components/analytics/TrafficOverview.tsx
const response = await fetch("http://localhost:3001/api/stats");
```

**Sekarang**: Gunakan `getAnalytics()` dari Supabase
```typescript
// NEW
import { getAnalytics } from "../../services/analytics/trackingService";
const data = await getAnalytics(7); // Last 7 days
```

**Status**: ✅ **SELESAI DIMIGRASI** (baru saja!)

---

## 🚀 Cara Running Aplikasi

### ❌ DULU (2 servers):
```bash
# Terminal 1
cd proxy-server
npm start  # Port 3001

# Terminal 2
npm run dev  # Port 5173/5174
```

### ✅ SEKARANG (1 server):
```bash
# Hanya 1 terminal
npm run dev  # Port 5174
```

**Tidak perlu proxy-server lagi!** ❌

---

## 🔍 Debugging Guide

### 1. **Cek Koneksi Supabase**
**URL Test**: http://localhost:5174/test-supabase

```bash
# Buka browser console (F12)
# Klik "Run Tests"
# Lihat hasil:
✅ Supabase Client Init
✅ Environment Variables
✅ Database Read Test
✅ Auth Session Check
✅ Login Test
```

**Jika gagal**, cek:
- `.env` file ada `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
- Database tables sudah di-create (`schema.sql`)
- RLS policies sudah di-setup (`setup-analytics.sql`)

---

### 2. **Cek Dashboard Data**
**Test**: Buka http://localhost:5174/

```bash
# Browser Console (F12) → Network tab
# Filter: "supabase.co"
# Harus ada requests ke:
GET https://aaysacqsibquiulpdzwz.supabase.co/rest/v1/dosen
GET https://aaysacqsibquiulpdzwz.supabase.co/rest/v1/mahasiswa
GET https://aaysacqsibquiulpdzwz.supabase.co/rest/v1/fasilitas
```

**Jika data tidak muncul**:
1. Cek console untuk error
2. Verify data ada di Supabase Table Editor
3. Cek RLS policies allow SELECT

---

### 3. **Cek Analytics Tracking**
**Test**: Navigate ke berbagai halaman

```bash
# Console (F12) → Network tab
# Setiap page change harus ada:
POST https://aaysacqsibquiulpdzwz.supabase.co/rest/v1/web_analytics_log
```

**Verify di Supabase**:
```sql
-- Di Supabase SQL Editor
SELECT * FROM web_analytics_log 
ORDER BY visited_at DESC 
LIMIT 10;
```

---

### 4. **Cek Admin Login**
**URL**: http://localhost:5174/admin/login

```bash
# Login: admin / admin123
# Console harus show:
🔐 Attempting login with email: admin@admin.upnvj.ac.id
✅ Login successful
```

**Jika gagal login**:
1. Cek user di Supabase → Authentication → Users
2. Email harus: `admin@admin.upnvj.ac.id`
3. Status harus: "Confirmed" ✅
4. Cek console untuk error message

---

### 5. **Cek Admin CRUD**
**URL**: http://localhost:5174/admin (setelah login)

**Test Create**:
```bash
# Klik "Tambah Dosen"
# Isi form
# Submit
# Console → Network:
POST https://aaysacqsibquiulpdzwz.supabase.co/rest/v1/dosen
```

**Test Update/Delete**: Same pattern

---

## 🐛 Common Issues & Fixes

### Issue 1: "Tidak ada data analytics"
**Symptom**: TrafficOverview menunjukkan 0 visitors/pageviews

**Debug**:
```javascript
// Console
import { getAnalytics } from './services/analytics/trackingService';
const data = await getAnalytics(7);
console.log(data);
```

**Fix**:
1. Pastikan RLS policy allow SELECT: `setup-analytics.sql`
2. Cek ada data: `SELECT * FROM web_analytics_log;`
3. Clear cache & refresh

---

### Issue 2: "RLS Policy Error"
**Symptom**: Error 406 atau "new row violates row-level security"

**Fix**:
```sql
-- Jalankan di Supabase SQL Editor
ALTER TABLE web_analytics_log ENABLE ROW LEVEL SECURITY;

-- Allow public INSERT
CREATE POLICY "Allow public insert on analytics"
ON web_analytics_log FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated READ
CREATE POLICY "Allow authenticated read on analytics"
ON web_analytics_log FOR SELECT
TO authenticated
USING (true);
```

---

### Issue 3: "Login gagal tapi user sudah ada"
**Symptom**: Error "Invalid login credentials"

**Check**:
1. Email format di Supabase harus EXACT: `admin@admin.upnvj.ac.id`
2. User status harus "Confirmed"
3. Password yang diset benar

**Fix**:
```bash
# Di Supabase Dashboard
1. Authentication → Users
2. Klik user "admin@admin.upnvj.ac.id"
3. Reset password jika perlu
4. Pastikan "Confirmed" ✅
```

---

## 📝 Environment Variables Check

**File**: `.env`

```bash
# Harus ada 2 variables ini:
VITE_SUPABASE_URL=https://aaysacqsibquiulpdzwz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Check di code:
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**Jika undefined**:
1. Pastikan nama file EXACT: `.env` (bukan `.env.local`)
2. Restart dev server: `npm run dev`
3. Clear cache

---

## 🗑️ Cleanup (Optional)

Setelah confirm semua berjalan baik, bisa hapus:

```bash
# AMAN untuk dihapus:
rm -rf proxy-server/
rm public/data/dashboard-data.json
rm src/services/api/api.ts  # jika tidak terpakai
```

**BACKUP dulu sebelum hapus!**

---

## ✅ Final Checklist

- [ ] proxy-server **TIDAK** berjalan
- [ ] Hanya `npm run dev` yang running
- [ ] Dashboard publik load data
- [ ] Login admin berhasil
- [ ] CRUD operations works
- [ ] Analytics tracking berfungsi
- [ ] TrafficOverview menampilkan data
- [ ] Tidak ada error di console

---

## 🎉 Status Akhir

**100% Migrasi ke Supabase! proxy-server officially deprecated.** ✅

Semua data sekarang real-time dari PostgreSQL via Supabase API.
