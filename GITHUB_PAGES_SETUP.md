# 🚀 GitHub Pages Deployment Guide

## Langkah-langkah Deploy ke GitHub Pages

### 1. Setup GitHub Secrets

Tambahkan environment variables berikut di GitHub Repository:

1. Buka: `https://github.com/Jokskuyy/dashboard-profile-upnvj/settings/secrets/actions`
2. Klik: **New repository secret**
3. Tambahkan 2 secrets berikut:

#### Secret 1: VITE_SUPABASE_URL
```
Name: VITE_SUPABASE_URL
Value: https://aaysacqsibquiulpdzwz.supabase.co
```

#### Secret 2: VITE_SUPABASE_ANON_KEY
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFheXNhY3FzaWJxdWl1bHBkend6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzMyODUsImV4cCI6MjA3ODg0OTI4NX0._oUNMA5Txnuig2glrKFiDH34pakF8AD4iAQx2id4VFw
```

### 2. Aktifkan GitHub Pages

1. Buka: `https://github.com/Jokskuyy/dashboard-profile-upnvj/settings/pages`
2. **Source**: Pilih **GitHub Actions** (bukan Deploy from a branch)
3. Klik **Save**

### 3. Deploy

Push perubahan ke GitHub:

```bash
git add .
git commit -m "Fix: Configure GitHub Pages deployment"
git push origin main
```

### 4. Monitor Deployment

1. Buka: `https://github.com/Jokskuyy/dashboard-profile-upnvj/actions`
2. Tunggu workflow "Deploy to GitHub Pages" selesai (sekitar 2-3 menit)
3. Status **✓** = Deployment berhasil

### 5. Akses Website

URL: **https://jokskuyy.github.io/dashboard-profile-upnvj/**

---

## Troubleshooting

### Blank Page / 404 Error
- ✅ Pastikan GitHub Secrets sudah ditambahkan
- ✅ Pastikan Source Pages = "GitHub Actions"
- ✅ Cek workflow logs untuk error

### Supabase Connection Error
- ✅ Verifikasi URL dan Anon Key di GitHub Secrets
- ✅ Pastikan tidak ada typo atau spasi

### Assets Not Loading
- ✅ Sudah fixed dengan base path: `/dashboard-profile-upnvj/`
- ✅ Clear browser cache (Ctrl+Shift+R)

---

## File Changes Summary

### Modified Files:
1. `.github/workflows/deploy.yml` - Added Supabase secrets
2. `vite.config.ts` - Fixed base path to `/dashboard-profile-upnvj/`
3. `.env.production` - Production environment template

### Current Configuration:
- Base URL: `/dashboard-profile-upnvj/`
- Build command: `npm run build`
- Deploy folder: `./dist`
- Node version: 20

---

## Next Steps

1. Add GitHub Secrets (paling penting!)
2. Enable GitHub Pages dengan source "GitHub Actions"
3. Push code ke GitHub
4. Wait for deployment
5. Access: https://jokskuyy.github.io/dashboard-profile-upnvj/

**Good luck! 🚀**
