# UPNVJ Dashboard API Server

Backend API server untuk UPNVJ Dashboard dengan fitur analytics dan authentication.

## 📁 Struktur Direktori

```
server/
├── src/
│   ├── controllers/         # Business logic
│   │   ├── authController.js
│   │   └── analyticsController.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   └── analytics.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── utils/              # Utility functions
│   │   ├── auth.js
│   │   └── analytics.js
│   └── index.js            # Main entry point
├── data/                   # Data storage (JSON files)
│   ├── admin.json
│   └── analytics.json
├── package.json
└── README.md
```

## 🚀 Cara Menjalankan

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode
npm run dev
```

Server akan berjalan di: http://localhost:3001

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin
- `POST /api/auth/logout` - Logout admin  
- `GET /api/auth/verify` - Verify session
- `GET /api/auth/profile` - Get admin profile (protected)

### Analytics
- `POST /api/track/pageview` - Track page view
- `POST /api/track/event` - Track custom event
- `GET /api/stats` - Get statistics
- `GET /api/analytics` - Get detailed analytics

### Health Check
- `GET /health` - Server health status

## 🔐 Default Login

```
Username: admin
Password: admin123
```

## ⚙️ Environment Variables

Saat ini menggunakan hardcoded values. Untuk production, gunakan `.env`:

```env
PORT=3001
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5174
```

## 🗄️ Data Storage

Data disimpan dalam file JSON di folder `data/`:
- `admin.json` - Admin users & sessions
- `analytics.json` - Analytics data (visitors, pageviews, events)

## 📝 Notes

- Data analytics otomatis cleanup (keep 30 days)
- Sessions menggunakan JWT tokens
- Passwords di-hash menggunakan bcrypt
- CORS enabled untuk frontend development
