# UPNVJ Dashboard - Deployment Guide

## 🚀 Quick Deploy to GitHub Pages

### Prerequisites
- GitHub account
- Repository already exists: `dashboard-profile-upnvj`

### Steps:

1. **Enable GitHub Pages**
   - Go to your GitHub repository
   - Settings → Pages
   - Source: GitHub Actions
   - Save

2. **Add base path to vite.config.ts**
   Already configured in the workflow, but make sure your vite.config has:
   ```typescript
   base: '/dashboard-profile-upnvj/'
   ```

3. **Push to GitHub**
   ```bash
   git push origin main
   ```

4. **Access Your Site**
   After ~2-5 minutes:
   ```
   https://jokskuyy.github.io/dashboard-profile-upnvj/
   ```

### ⚠️ Limitations (GitHub Pages Only):
- No backend/API endpoints
- No real authentication
- No database operations
- Unity WebGL works perfectly ✅
- All JSON data works ✅

---

## 🔥 Recommended: Full-Stack Deployment

### Option A: Vercel (Recommended)

**Why Vercel?**
- ✅ Free for personal projects
- ✅ Frontend + Backend in one place
- ✅ PostgreSQL database included
- ✅ Automatic HTTPS
- ✅ Edge functions globally

**Setup:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy Frontend**
   ```bash
   vercel
   ```

4. **Deploy Backend (proxy-server)**
   ```bash
   cd proxy-server
   vercel
   ```

5. **Add PostgreSQL**
   - Go to Vercel dashboard
   - Storage → Add Database → Postgres
   - Copy connection string

6. **Environment Variables**
   Add in Vercel dashboard:
   ```
   DATABASE_URL=your_postgres_url
   JWT_SECRET=your_secret
   NODE_ENV=production
   ```

### Option B: Supabase + Vercel

**Best for:**
- Need authentication
- Need database
- Need real-time features

**Setup:**

1. **Create Supabase Project**
   - Go to supabase.com
   - Create new project (Free tier)
   - Get API keys

2. **Update Frontend**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Replace Auth with Supabase**
   No need for Express backend!

4. **Deploy Frontend to Vercel**
   ```bash
   vercel
   ```

---

## 📊 Feature Matrix

| Feature | GitHub Pages | Vercel | Vercel + Supabase |
|---------|-------------|---------|-------------------|
| Static Frontend | ✅ | ✅ | ✅ |
| Unity WebGL | ✅ | ✅ | ✅ |
| JSON Data | ✅ | ✅ | ✅ |
| Authentication | ❌ | ✅ | ✅ (Built-in) |
| Database | ❌ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Real-time | ❌ | Partial | ✅ |
| Cost | Free | Free | Free |
| Custom Domain | Limited | ✅ | ✅ |

---

## 🎯 My Recommendation:

### For Portfolio/Demo (Now):
**Use GitHub Pages** - Quick, free, shows your work

### For Production (Future):
**Use Vercel + Supabase** - Full features, still free

---

## 🚀 Next Steps

### Phase 1: Deploy to GitHub Pages (Today)
1. Push code to GitHub ✅ (Already done!)
2. Enable GitHub Pages
3. Wait 2-5 minutes
4. Share your link: `https://jokskuyy.github.io/dashboard-profile-upnvj/`

### Phase 2: Add Backend (When needed)
1. Create Supabase account
2. Setup database tables
3. Replace auth system
4. Update API calls
5. Deploy to Vercel

### Phase 3: Database Migration (When ready)
1. Use provided SQL schema in `/database/schema.sql`
2. Import to Supabase/Vercel Postgres
3. Update API endpoints
4. Test thoroughly

---

## 📝 Important Notes

### GitHub Pages Deployment:
- Build output goes to `/dist`
- Base path: `/dashboard-profile-upnvj/`
- All assets must use relative paths
- Unity files work perfectly
- JSON data files accessible

### Environment Variables:
For production, you'll need:
```env
VITE_API_BASE_URL=your_backend_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Unity WebGL:
- Files are large (~50MB)
- GitHub Pages supports large files
- Brotli compression works
- Loading may be slow on first visit

---

## 🔧 Troubleshooting

### Unity not loading on GitHub Pages:
- Check base path in config
- Verify files are in `/public/unity-builds/downloads/`
- Check browser console for 404 errors

### Images not showing:
- Use relative paths
- Check `base` in vite.config.ts
- Verify files are in `/public/`

### 404 on page refresh:
- Add 404.html redirecting to index.html
- Or use hash router instead of browser router

---

## 📞 Support

If you need help:
1. Check GitHub Actions logs
2. Verify build succeeded
3. Check browser console
4. Test locally: `npm run build && npm run preview`

---

## 🎉 You're Ready!

Your project is already configured for GitHub Pages deployment.
Just enable it in repository settings and you're live! 🚀
