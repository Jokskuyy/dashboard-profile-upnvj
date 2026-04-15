# Unity API Server

Backend API server untuk integrasi Unity WebGL, analytics, dan jalur migrasi backend on-prem UPNVJ.

## Struktur File

```
server/
├── index.js          # Main server file dengan Express endpoints
└── .env.example      # Template environment variables
```

## Quick Start

1. **Install dependencies** (dari root project):
   ```bash
   npm install
   ```

2. **Jalankan server**:
   ```bash
   npm run dev:api
   ```

Server akan running di `http://localhost:3001`

## Endpoints

- `GET /api/health` - Health check
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `GET /api/buildings` - Get all buildings with rooms
- `GET /api/buildings/:id/rooms` - Get rooms by building ID

## Deployment UPNVJ (Tanpa Vercel)

1. Build frontend dari root project:
   ```bash
   npm run build
   ```
2. Serve folder `dist/` via Nginx/Apache.
3. Jalankan API server ini sebagai service terpisah di server UPNVJ.
4. Atur reverse proxy:
   - `/` ke static frontend
   - `/api/*` ke service Node.js ini
5. Set `VITE_API_URL` pada frontend ke URL API internal UPNVJ.

## Dokumentasi Lengkap

Lihat [UNITY_INTEGRATION.md](../UNITY_INTEGRATION.md) untuk dokumentasi lengkap integrasi Unity.

## Environment Variables

Server menggunakan environment variables yang sama dengan aplikasi utama (dari root `.env`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_DATA_BACKEND` (`supabase`/`enginex`, default `supabase`)
- `VITE_API_URL` (wajib saat mode `enginex`)
- `PORT` (opsional, default: 3001)
