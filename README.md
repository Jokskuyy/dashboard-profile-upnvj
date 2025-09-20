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

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 atau lebih baru)
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/your-repo/dashboard-profile-upnvj.git
cd dashboard-profile-upnvj

# Install dependencies
npm install

# Start development server
npm run dev

# Build untuk production
npm run build
```

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

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Context API
- **Language**: Multi-language dengan localStorage

## 📁 Struktur Project

```
src/
├── components/          # React Components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Header.tsx       # Sticky header dengan logo
│   ├── FacultyBarChart.tsx  # Reusable bar chart
│   ├── ProfessorsSection.tsx # Data dosen
│   ├── StudentsSection.tsx   # Data mahasiswa
│   └── LanguageToggle.tsx    # Toggle bahasa
├── contexts/            # React Contexts
├── utils/               # Data dan translations
├── types/               # TypeScript definitions
└── assets/              # Static assets
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

### Static Data
Data saat ini menggunakan static files di `src/utils/staticData.ts`:
- Faculty information
- Professor profiles  
- Student statistics
- Accreditation status

### Future: API Integration
Prepared untuk integrasi dengan backend API:
- RESTful endpoints
- Real-time data updates
- Admin panel untuk data management

## 🎯 Roadmap

### v1.1.0 (Planned)
- [ ] Backend API integration
- [ ] Admin panel untuk content management
- [ ] Advanced filtering dan search
- [ ] Export data functionality

### v1.2.0 (Future)
- [ ] Dark mode support
- [ ] PWA features (offline support)
- [ ] Advanced analytics charts
- [ ] User authentication

### v2.0.0 (Long-term)
- [ ] Complete UI redesign
- [ ] More language support
- [ ] Advanced data visualization
- [ ] Integration dengan sistem akademik

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

Untuk dokumentasi lengkap, lihat [DOCUMENTATION.md](DOCUMENTATION.md)

---

<div align="center">

**Dibuat dengan ❤️ untuk UPNVJ**

[Website](https://upnvj.ac.id) • [GitHub](https://github.com) • [Documentation](DOCUMENTATION.md)

</div>