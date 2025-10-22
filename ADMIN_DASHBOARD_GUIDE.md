# Admin Dashboard - Panduan Penggunaan

## 🎯 Deskripsi

Admin Dashboard adalah interface untuk mengelola data dashboard UPN Veteran Jakarta secara dinamis melalui file JSON, tanpa perlu mengubah kode sumber.

## 📂 Arsitektur Data

### Struktur Data JSON

Data disimpan di folder `/public/data/`:

1. **faculties.json** - Data fakultas (6 fakultas)
2. **dashboard-data.json** - Data utama dashboard yang berisi:
   - `professors` - Daftar dosen
   - `accreditations` - Data akreditasi program
   - `students` - Data mahasiswa per fakultas
   - `assets` - Data aset/fasilitas
   - `programs` - Data program studi
   - `departments` - Data departemen

### Service Layer

File `src/services/dataService.ts` menyediakan:

- `fetchDashboardData()` - Mengambil data dari JSON
- `fetchFaculties()` - Mengambil data fakultas
- `saveDashboardData()` - Menyimpan data (saat ini ke localStorage)
- Helper functions untuk memproses data

## 🚀 Cara Mengakses

### Dashboard Publik

- URL: `http://localhost:5173/`
- Menampilkan statistik dan informasi UPN Veteran Jakarta

### Admin Dashboard

- URL: `http://localhost:5173/admin`
- Interface untuk mengelola data

## 📊 Fitur Admin Dashboard

### 1. **Overview Statistics**

- Total Dosen
- Total Mahasiswa
- Akreditasi Aktif
- Total Aset
- Total Fakultas

### 2. **Tab Management**

Mengelola data melalui 6 tab utama:

#### a. Dosen (Professors)

- Tambah, edit, hapus data dosen
- Fields: nama, gelar, fakultas, expertise, email

#### b. Akreditasi (Accreditations)

- Manajemen akreditasi program
- Fields: program, level, akreditor, validUntil, status

#### c. Mahasiswa (Students)

- Data mahasiswa per fakultas
- Fields: faculty, totalStudents, undergraduate, graduate, postgraduate

#### d. Aset (Assets)

- Kategori aset dan detailnya
- Fields: name, count, icon, color, details

#### e. Program Studi (Programs)

- Data program studi
- Fields: name, level, faculty, students, color

#### f. Departemen (Departments)

- Data departemen/kelompok riset
- Fields: name, faculty, professors, color, description

### 3. **Actions**

- **Save Changes** - Simpan perubahan ke localStorage
- **Refresh** - Reload data dari JSON
- **Export** - Download data sebagai file JSON

## 💾 Cara Menyimpan Data

### Saat Ini (Development)

Data disimpan di **localStorage** browser karena:

- Frontend tidak bisa menulis file JSON secara langsung
- Bersifat sementara per browser

### Solusi Production

Ada 3 opsi untuk production:

#### **Opsi 1: Backend API (Recommended)**

```
Frontend (React) → Backend API → File System/Database
```

**Keuntungan:**

- Persistent storage
- Multi-user support
- Authentication/authorization
- Data validation

**Tech Stack:**

- Node.js + Express/NestJS
- Database: PostgreSQL/MySQL/MongoDB
- File storage: Local atau Cloud (S3, GCS)

#### **Opsi 2: Static Site + Git**

```
Admin Dashboard → Commit JSON → Push to GitHub → Auto Deploy
```

**Keuntungan:**

- Simple setup
- Version control
- Free hosting (Vercel, Netlify)

**Workflow:**

1. Edit data di admin dashboard
2. Export JSON file
3. Replace file in repo
4. Commit & push
5. Auto-deploy via CI/CD

#### **Opsi 3: CMS Headless**

```
CMS (Strapi/Sanity) → API → Frontend
```

**Keuntungan:**

- Built-in admin interface
- Role-based access
- Content versioning

## 🔧 Implementasi Backend (Node.js + Express)

### Setup Backend

1. **Create Express Server**

```bash
mkdir backend
cd backend
npm init -y
npm install express cors body-parser fs-extra
```

2. **Create API Endpoints**

```javascript
// backend/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, "../public/data");

// GET dashboard data
app.get("/api/dashboard-data", async (req, res) => {
  const data = await fs.readJson(path.join(DATA_DIR, "dashboard-data.json"));
  res.json(data);
});

// POST update dashboard data
app.post("/api/dashboard-data", async (req, res) => {
  try {
    await fs.writeJson(path.join(DATA_DIR, "dashboard-data.json"), req.body, {
      spaces: 2,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => {
  console.log("API server running on http://localhost:3001");
});
```

3. **Update dataService.ts**

```typescript
const API_URL = "http://localhost:3001/api";

export const saveDashboardData = async (
  data: DashboardData
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/dashboard-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error("Error saving data:", error);
    return false;
  }
};
```

## 🔐 Authentication (Opsional)

Untuk mengamankan admin dashboard:

1. **Install JWT**

```bash
npm install jsonwebtoken bcryptjs
```

2. **Add Login Route**

```javascript
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  // Verify credentials
  if (username === "admin" && password === "your-password") {
    const token = jwt.sign({ username }, "secret-key", { expiresIn: "24h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});
```

3. **Add Auth Middleware**

```javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    jwt.verify(token, "secret-key");
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/api/dashboard-data", authMiddleware, async (req, res) => {
  // ... save data
});
```

## 📝 Format Data JSON

### Professors

```json
{
  "id": "1",
  "name": "Prof. Dr. Nama Dosen",
  "title": "Professor",
  "faculty": "Fakultas Teknik",
  "expertise": ["Area 1", "Area 2"],
  "email": "email@upnvj.ac.id"
}
```

### Accreditations

```json
{
  "id": "1",
  "program": "Teknik Sipil",
  "level": "S1",
  "accreditor": "BAN-PT",
  "validUntil": "2026-12-31",
  "status": "active"
}
```

### Students

```json
{
  "faculty": "Fakultas Teknik",
  "totalStudents": 2850,
  "undergraduate": 2450,
  "graduate": 350,
  "postgraduate": 50
}
```

## 🎨 UI Components Status

✅ **Selesai:**

- Layout admin dashboard
- Tab navigation
- Statistics cards
- Data display (read-only)
- Export functionality
- Refresh data

⏳ **Dalam Progress:**

- CRUD operations untuk setiap entity
- Form input/edit
- Delete confirmation modal
- Data validation

📋 **Todo:**

- Pagination untuk data banyak
- Search/filter functionality
- Bulk operations
- Data import dari Excel/CSV
- Role-based permissions

## 🛠️ Development

### Running Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📦 Dependencies Baru

- `react-router-dom` - Routing untuk multi-page

## 🔄 Migration dari staticData.ts

File `src/utils/staticData.ts` masih digunakan oleh komponen existing. Untuk migrasi penuh:

1. Update semua komponen untuk menggunakan `dataService`
2. Replace import dari `staticData` ke `dataService`
3. Handle async data loading (loading states)
4. Implement error handling

## 🎯 Next Steps

1. **Implementasi CRUD lengkap** untuk setiap entity
2. **Setup backend API** untuk persistent storage
3. **Add authentication** untuk keamanan
4. **Migrate existing components** untuk menggunakan JSON data
5. **Add data validation** dan error handling
6. **Implement search/filter** pada tabel data
7. **Add data import/export** features

## 📞 Support

Jika ada pertanyaan atau issue, silakan dokumentasikan di file ini atau buat issue tracker.

---

**Last Updated:** 2024-01-15  
**Version:** 1.0.0  
**Status:** Development
