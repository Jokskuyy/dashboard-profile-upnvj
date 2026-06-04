# 🎓 Dashboard Profile UPNVJ

Dashboard interaktif untuk menampilkan profil dan data institusional Universitas Pembangunan Nasional Veteran Jakarta (UPNVJ).

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.1 (dengan dynamic code splitting & memoized context)
- **TypeScript** 5.8.3
- **Vite** 7.1.5
- **TailwindCSS** 4.1.13
- **React Router** 7.1.3
- **Lucide React** (Icons)

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Row Level Security)
- **Express.js** 4.21.2 (Server API backup/helper)
- **bcryptjs** (Password Hashing)

---

## 🌟 Fitur Utama

- 📊 **Interactive Bar Charts** - Visualisasi data fakultas dengan drill-down capability.
- 🌐 **Multilingual Support** - Bahasa Indonesia & English dengan toggle beranimasi dan fallback language logic.
- 📱 **Responsive Design** - Optimal untuk desktop, tablet, dan mobile.
- 🎨 **Modern UI/UX** - Desain modern dengan smooth animations.
- 🏛️ **Faculty Analytics** - Data dosen dan mahasiswa per fakultas.
- 🔄 **Real-time Language Switch** - Toggle bahasa dengan persistent storage.
- 🔐 **Admin Authentication** - Sistem login admin yang aman terintegrasi dengan Supabase.
- 📈 **Web Analytics** - Custom self-hosted analytics untuk traffic monitoring.
- ⚡ **Data Synchronization** - Single source of truth dengan Supabase.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 atau lebih baru)
- npm atau yarn

### Installation & Run

1. Clone repository:
   ```bash
   git clone https://github.com/Jokskuyy/dashboard-profile-upnvj.git
   cd dashboard-profile-upnvj
   ```

2. Buat file `.env` di root folder dengan kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Jalankan development server:
   ```bash
   npm run dev
   ```

5. Build untuk production:
   ```bash
   npm run build
   ```

---

## 📊 Data Overview

### Fakultas (6 Fakultas)
- **FT** - Fakultas Teknik
- **FEB** - Fakultas Ekonomi dan Bisnis
- **FIK** - Fakultas Ilmu Komputer
- **FH** - Fakultas Hukum
- **FISIP** - Fakultas Ilmu Sosial dan Politik
- **FIKES** - Fakultas Ilmu Kesehatan

---

## 📁 Struktur Project

```
dashboard-profile-upnvj/
├── database/                    # Database files
│   ├── schema.sql              # PostgreSQL/Supabase schema
│   ├── insert-dummy-data.sql   # Data awal & dummy untuk testing
│   └── setup-analytics.sql     # Skema database khusus analytics
├── docs/                        # Project documentation & audits
│   ├── history/                # Dokumen arsip & history
│   │   ├── cleanup-summary-2025.md
│   │   └── optimization-summary-2026.md
│   ├── github-pages-deployment.md
│   ├── security-audit.md
│   └── unity-webgl-optimization.md
├── public/                      # Static assets
│   ├── unity-builds/           # Unity WebGL builds (virtual campus map)
│   ├── logoupnvj.webp          # Logo UPNVJ format WebP
│   └── _headers                # Security & Caching headers
├── server/                      # Express backend helper
│   ├── index.js                # Express app script
│   └── package.json
├── src/                         # Source code frontend React
│   ├── components/              # React Components
│   │   ├── admin/               # Admin panel (CRUD, settings)
│   │   ├── analytics/           # Analytics visualizer
│   │   ├── auth/                # Login page
│   │   ├── campus-map/          # Denah 3D virtual campus loader
│   │   ├── common/              # Common UI (Header, Footer, dll)
│   │   └── dashboard/           # Public Dashboard
│   ├── contexts/                # React Context Providers (Auth, Lang, Toast)
│   ├── services/                # Supabase data services
│   ├── utils/                   # Helper functions & translations
│   ├── types/                   # TypeScript definitions
│   └── main.tsx
├── tailwind.config.js
└── vite.config.ts
```

---

## 📚 Dokumentasi Pendukung

Untuk panduan mendalam mengenai setup, audit keamanan, dan optimasi, silakan baca dokumen berikut:

- 🔒 **[Audit Keamanan & Arsitektur](docs/security-audit.md)** - Hasil analisis menyeluruh terhadap keamanan dan dual data path system.
- 🎮 **[Optimasi Unity WebGL Build](docs/unity-webgl-optimization.md)** - Saran dan rekomendasi optimasi untuk denah virtual kampus 3D.
- 🚀 **[Panduan Deployment GitHub Pages](docs/github-pages-deployment.md)** - Langkah-langkah deploy frontend ke GitHub Pages menggunakan GitHub Actions.
- 🕒 **[History Optimasi (Maret 2026)](docs/history/optimization-summary-2026.md)** - Detail optimasi React 19, lazy loading, dan strict type conversions.
- 🧹 **[History Cleanup (November 2025)](docs/history/cleanup-summary-2025.md)** - Ringkasan cleanup berkas deprecated dan redundan.

---

<div align="center">

**Dibuat dengan ❤️ untuk UPNVJ**

[Website UPNVJ](https://upnvj.ac.id) • [GitHub Repository](https://github.com/Jokskuyy/dashboard-profile-upnvj)

</div>
