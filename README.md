# 🎓 Dashboard Profile UPNVJ

> Dashboard interaktif untuk menampilkan profil dan data institusional Universitas Pembangunan Nasional Veteran Jakarta (UPNVJ)

![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.x-purple?logo=vite)

## 🌟 Fitur Utama

- 📊 **Interactive Bar Charts** - Visualisasi data fakultas dengan drill-down capability
- 🌐 **Multilingual Support** - Bahasa Indonesia & English dengan toggle beranimasi
- 📱 **Responsive Design** - Optimal untuk desktop, tablet, dan mobile
- 🎨 **Modern UI/UX** - Desain modern dengan smooth animations
- 🏛️ **Faculty Analytics** - Data dosen dan mahasiswa per fakultas
- 🔄 **Real-time Language Switch** - Toggle bahasa dengan persistent storage
- 🔐 **Admin Authentication** - Sistem login JWT dengan bcrypt password hashing
- 📈 **Web Analytics** - Custom self-hosted analytics untuk traffic monitoring
- ⚡ **Data Synchronization** - Single source of truth antara admin dan public dashboard

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Jokskuyy/dashboard-profile-upnvj.git
cd dashboard-profile-upnvj

# Install frontend dependencies
npm install

# Install backend dependencies
cd proxy-server
npm install
cd ..

# Start backend server (port 3001)
cd proxy-server
node server.js

# Start frontend (port 5173) - in new terminal
npm run dev

# Build untuk production
npm run build
```

### Default Admin Credentials

- Username: `admin`
- Password: `admin123`
- URL: http://localhost:5173/login

## 📊 Data Overview

### Fakultas (6 Fakultas)

- **FT** - Fakultas Teknik
- **FEB** - Fakultas Ekonomi dan Bisnis
- **FIK** - Fakultas Ilmu Komputer
- **FH** - Fakultas Hukum
- **FISIP** - Fakultas Ilmu Sosial dan Politik
- **FIKES** - Fakultas Ilmu Kesehatan

### Statistik

- 👨‍🏫 **33 Dosen** tersebar di 6 fakultas
- 🎓 **12,030 Mahasiswa** (S1: 10,500 | S2: 1,410 | S3: 120)
- 🏆 **6 Program Terakreditasi** oleh BAN-PT
- 🏢 **6 Fakultas** dengan beragam program studi

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Context API
- **Routing**: React Router v6
- **Language**: Multi-language dengan localStorage

### Backend

- **Server**: Express.js (ES6 modules)
- **Authentication**: JWT + bcrypt
- **Session**: HTTP-only cookies
- **Database**: JSON file-based storage
- **Analytics**: Custom self-hosted tracking

## 📁 Struktur Project

```
dashboard-profile-upnvj/
├── proxy-server/           # Backend Express server
│   ├── server.js          # Main server dengan auth & analytics endpoints
│   ├── auth.js            # Authentication logic (JWT, bcrypt)
│   ├── admin-data.json    # Admin users & sessions
│   └── analytics-data.json # Web traffic analytics
├── public/
│   └── data/              # Static JSON data files
│       ├── dashboard-data.json  # Main dashboard data
│       └── faculties.json      # Faculty information
├── src/
│   ├── components/        # React Components
│   │   ├── Dashboard.tsx       # Main public dashboard
│   │   ├── AdminDashboard.tsx  # Admin management panel
│   │   ├── Login.tsx           # Authentication page
│   │   ├── ProtectedRoute.tsx  # Route guard
│   │   ├── Analytics.tsx       # Analytics tracking
│   │   └── TrafficOverview.tsx # Traffic visualization
│   ├── contexts/          # React Contexts
│   │   ├── AuthContext.tsx     # Auth state management
│   │   └── LanguageContext.tsx # Language management
│   ├── services/          # API Services
│   │   ├── dataService.ts      # Data fetching & caching
│   │   └── api.ts             # API configuration
│   ├── utils/             # Utilities & translations
│   └── types/             # TypeScript definitions
└── vite.config.ts         # Vite configuration
```

## 🎯 Komponen Utama

### 1. Interactive Bar Charts

- Vertical bars dengan X/Y axis yang jelas
- Hover tooltips untuk informasi detail
- Click untuk drill-down ke detail fakultas
- Color coding unik per fakultas

### 2. Language Toggle

- Toggle beranimasi dengan bendera 🇮🇩/🇺🇸
- Smooth sliding animation
- Persistent language preference
- Dynamic content switching

### 3. Faculty Data Management

- **Chart View**: Overview distribusi per fakultas
- **Detail View**: Profile lengkap dosen/mahasiswa
- Navigation breadcrumbs
- Multi-language content

## 🌐 Multi-language Support

### Bahasa yang Didukung

- 🇮🇩 **Bahasa Indonesia** (Default)
- 🇺🇸 **English**

### Fitur Bahasa

- Toggle visual dengan animasi bendera
- Persistent storage (localStorage)
- Dynamic content switching
- Professional translations

## 📱 Responsive Design

- **Mobile First**: Optimized untuk mobile experience
- **Breakpoints**: sm, md, lg, xl untuk berbagai ukuran layar
- **Touch Friendly**: Interactions yang mudah di mobile
- **Performance**: Optimized loading untuk semua device

## 🎨 Design System

### Color Palette

- **FT (Teknik)**: Blue (#3B82F6)
- **FEB (Ekonomi)**: Green (#10B981)
- **FIK (Komputer)**: Purple (#8B5CF6)
- **FH (Hukum)**: Amber (#F59E0B)
- **FISIP (Sosial)**: Red (#EF4444)
- **FIKES (Kesehatan)**: Cyan (#06B6D4)

### Typography

- **Headers**: Font bold dengan hierarchy yang jelas
- **Body**: Font regular dengan good readability
- **Numbers**: Font semibold untuk emphasis

## 🚀 Deployment

### Build Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Static Hosting

Upload folder `dist/` ke hosting provider seperti:

- Netlify
- Vercel
- GitHub Pages
- AWS S3

## 📈 Performance

- **Fast Loading**: Vite untuk build yang cepat
- **Code Splitting**: Lazy loading untuk components besar
- **Asset Optimization**: Optimized images dan assets
- **Smooth Animations**: CSS transforms untuk performa terbaik

## 🔧 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment

- Development server: `http://localhost:5173`
- Hot module replacement (HMR)
- TypeScript type checking
- ESLint code linting

## 📝 Data Management

### Data Source

Sistem menggunakan **single source of truth** dengan JSON files:

- **`public/data/dashboard-data.json`** - Main data (professors, students, accreditation, assets)
- **`public/data/faculties.json`** - Faculty information
- **`proxy-server/admin-data.json`** - Admin accounts & sessions
- **`proxy-server/analytics-data.json`** - Web analytics data

### Data Synchronization

- Public dashboard dan Admin dashboard membaca dari file JSON yang sama
- Data service dengan caching untuk performa optimal
- Changes di Admin dashboard langsung terlihat di public dashboard

### Backend API Endpoints

#### Authentication

- `POST /api/auth/login` - Admin login dengan JWT
- `POST /api/auth/logout` - Logout dan clear session
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get admin profile

#### Analytics

- `POST /api/track` - Track page views
- `POST /api/track/click` - Track button clicks
- `POST /api/track/carousel` - Track carousel interactions
- `GET /api/stats` - Get analytics summary

## 🎯 Roadmap

### ✅ v1.0.0 (Current)

- [x] Interactive faculty data visualization
- [x] Multilingual support (ID/EN)
- [x] Responsive design
- [x] Admin authentication system
- [x] Web analytics tracking
- [x] Data synchronization

### v1.1.0 (Planned)

- [ ] Advanced filtering dan search
- [ ] Export data functionality
- [ ] Email notifications
- [ ] User role management

### v1.2.0 (Future)

- [ ] Dark mode support
- [ ] PWA features (offline support)
- [ ] Advanced analytics charts
- [ ] Multi-factor authentication

### v2.0.0 (Long-term)

- [ ] Complete UI redesign
- [ ] More language support
- [ ] Advanced data visualization
- [ ] Integration dengan sistem akademik UPNVJ

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 📞 Support

- **Institution**: Universitas Pembangunan Nasional Veteran Jakarta
- **Website**: [upnvj.ac.id](https://upnvj.ac.id)
- **Email**: info@upnvj.ac.id
- **Address**: Jl. RS. Fatmawati, Pondok Labu, Jakarta Selatan 12450

## 📚 Documentation

### Authentication

- Login: http://localhost:5173/login
- Default admin: `admin` / `admin123`
- Password hash: bcrypt dengan 10 salt rounds
- Session: JWT token di HTTP-only cookie (24h expiration)

### Analytics

- Self-hosted analytics (tidak menggunakan Google Analytics)
- Track: page views, clicks, carousel interactions
- Privacy-focused: no third-party tracking
- Data stored: `proxy-server/analytics-data.json`

### Security

- JWT authentication dengan secret key
- bcrypt password hashing
- HTTP-only cookies untuk session
- CORS protection
- Protected admin routes

---

<div align="center">

**Dibuat dengan ❤️ untuk UPNVJ**

[Website](https://upnvj.ac.id) • [GitHub](https://github.com/Jokskuyy/dashboard-profile-upnvj)

</div>
