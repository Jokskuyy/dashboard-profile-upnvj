# 🎮 Panduan Unity WebGL - Dashboard Profile UPNVJ

## 📋 Daftar Isi
1. [Pengenalan](#pengenalan)
2. [Cara Menjalankan](#cara-menjalankan)
3. [Struktur File](#struktur-file)
4. [Cara Penggunaan](#cara-penggunaan)
5. [Troubleshooting](#troubleshooting)
6. [Keterbatasan GitHub Pages](#keterbatasan-github-pages)

---

## 🎯 Pengenalan

Unity WebGL sudah terintegrasi dalam project ini untuk menampilkan **Peta Kampus 3D Interaktif**. Fitur ini memungkinkan pengguna menjelajahi kampus UPNVJ dalam bentuk 3D yang interaktif.

### ✅ Status Saat Ini:
- ✅ **Local Development**: Unity WebGL berfungsi 100%
- ⚠️ **GitHub Pages**: Unity WebGL dinonaktifkan karena keterbatasan teknis (Brotli compression)

---

## 🚀 Cara Menjalankan

### A. Menjalankan di Local Development

#### Langkah 1: Install Dependencies
```bash
npm install
```

#### Langkah 2: Jalankan Development Server
```bash
npm run dev
```

Server akan berjalan di: **http://localhost:5173/** (atau port lain jika 5173 sedang digunakan)

#### Langkah 3: Akses Campus Map
1. Buka browser dan akses **http://localhost:5173/**
2. Scroll ke bawah hingga menemukan section **"Peta Kampus"** atau **"Campus Map"**
3. Klik tombol **"Launch Unity Map"** (tombol merah)
4. Unity WebGL akan dimuat dan siap digunakan

### B. Kontrol Unity WebGL

Saat Unity WebGL sudah terbuka, Anda bisa menggunakan:

**🖱️ Kontrol Mouse:**
- **Drag Mouse (Klik Kiri + Geser)**: Memutar kamera / Melihat sekeliling
- **Scroll Mouse**: Zoom in / Zoom out
- **Klik Kanan + Geser**: Pan kamera (geser ke samping)

**🎮 Kontrol UI:**
- **Tombol Fullscreen**: Mengaktifkan mode layar penuh
- **Tombol Reload**: Memuat ulang Unity
- **Tombol Close**: Menutup viewer Unity

---

## 📁 Struktur File

```
dashboard-profile-upnvj/
│
├── public/
│   └── unity-builds/
│       └── downloads/
│           ├── Build/
│           │   ├── Downloads.data.br          # Data game Unity (14.3 MB)
│           │   ├── Downloads.framework.js.br  # Framework Unity (75 KB)
│           │   ├── Downloads.loader.js        # Loader script (26 KB)
│           │   └── Downloads.wasm.br          # WebAssembly binary (8 MB)
│           └── TemplateData/
│               └── style.css                  # CSS untuk Unity
│
├── src/
│   └── components/
│       ├── campus-map/
│       │   ├── CampusMapViewer.tsx      # Viewer utama dengan kontrol lengkap
│       │   ├── UnityWebGLViewer.tsx     # Komponen Unity reusable
│       │   └── index.ts                 # Export file
│       │
│       └── dashboard/
│           └── sections/
│               └── CampusMapSection.tsx # Integrasi di dashboard
│
└── docs/
    ├── UNITY_WEBGL_INTEGRATION.md       # Dokumentasi bahasa Inggris
    └── UNITY_WEBGL_PANDUAN.md           # Dokumentasi bahasa Indonesia (ini)
```

---

## 💻 Cara Penggunaan

### 1. Menggunakan di Component React

#### Cara A: Import CampusMapViewer (Sudah Siap Pakai)

```tsx
import { CampusMapViewer } from '@/components/campus-map';

function MyComponent() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <CampusMapViewer
      isFullscreen={isFullscreen}
      onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
    />
  );
}
```

#### Cara B: Import UnityWebGLViewer (Custom)

```tsx
import { UnityWebGLViewer } from '@/components/campus-map';

function MyComponent() {
  return (
    <UnityWebGLViewer
      buildPath="/unity-builds/downloads/Build"
      buildName="Downloads"
      height="600px"
      onUnityLoaded={(instance) => {
        console.log('Unity berhasil dimuat!', instance);
      }}
    />
  );
}
```

### 2. Mengirim Perintah ke Unity (React → Unity)

```tsx
const handleButtonClick = () => {
  if (window.unityInstance) {
    // Mengirim pesan ke Unity
    window.unityInstance.SendMessage(
      'GameObjectName',  // Nama GameObject di Unity
      'MethodName',      // Nama method public di script Unity
      'parameter'        // Parameter yang dikirim
    );
  }
};

// Contoh penggunaan:
const zoomIn = () => {
  window.unityInstance?.SendMessage('CameraController', 'ZoomIn');
};

const goToBuilding = (buildingId: string) => {
  window.unityInstance?.SendMessage('MapController', 'FocusBuilding', buildingId);
};
```

### 3. Menerima Data dari Unity (Unity → React)

**Di Unity (C# Script):**
```csharp
// Mengirim data ke React
public void SendLocationToReact(string locationData) {
    Application.ExternalCall("receiveLocationFromUnity", locationData);
}
```

**Di React (TypeScript):**
```tsx
useEffect(() => {
  // Membuat fungsi global untuk menerima data dari Unity
  window.receiveLocationFromUnity = (data: string) => {
    console.log('Data dari Unity:', data);
    // Proses data di sini
  };

  // Cleanup saat component unmount
  return () => {
    delete window.receiveLocationFromUnity;
  };
}, []);
```

---

## 🐛 Troubleshooting

### ❌ Masalah: Unity Tidak Muncul / Loading Terus

**Solusi:**
1. Buka **Browser Console** (F12) dan cek error
2. Pastikan file Unity ada di folder `public/unity-builds/downloads/Build/`
3. Coba **hard refresh**: `Ctrl + Shift + R` (Windows) atau `Cmd + Shift + R` (Mac)
4. Coba **clear browser cache**
5. Pastikan menggunakan **local development**, bukan GitHub Pages

### ❌ Masalah: Layar Hitam

**Solusi:**
1. Tunggu hingga loading bar selesai (Unity memerlukan waktu untuk load)
2. Cek apakah browser mendukung WebGL 2.0: https://get.webgl.org/webgl2/
3. Update driver GPU/graphics card
4. Coba browser lain (Chrome/Edge/Firefox recommended)

### ❌ Masalah: Error "Downloads.data.br failed to parse"

**Penyebab:** Anda mengakses dari GitHub Pages

**Solusi:**
- GitHub Pages **tidak mendukung** Unity WebGL dengan Brotli compression
- Gunakan **local development** untuk menjalankan Unity
- Alternatif: Deploy ke platform lain (Vercel, Netlify, dll) - lihat bagian [Keterbatasan](#keterbatasan-github-pages)

### ❌ Masalah: Lambat / Lag

**Solusi:**
1. Tutup tab browser lain yang berat
2. Pastikan tidak ada aplikasi berat lain yang berjalan
3. Coba kurangi ukuran window Unity (jangan fullscreen)
4. Restart browser

---

## ⚠️ Keterbatasan GitHub Pages

### Mengapa Unity WebGL Tidak Berfungsi di GitHub Pages?

Unity WebGL menggunakan **Brotli compression** (.br files) yang membutuhkan HTTP header khusus:
```
Content-Encoding: br
```

**GitHub Pages tidak mendukung custom HTTP headers**, sehingga browser tidak bisa decompress file Unity dengan benar.

### 📊 Perbandingan Platform

| Platform | Unity WebGL Support | Deployment |
|----------|-------------------|------------|
| **Local Development** | ✅ **Berfungsi 100%** | `npm run dev` |
| **GitHub Pages** | ❌ Tidak support | Otomatis via GitHub Actions |
| **Vercel** | ✅ Berfungsi | Deploy mudah, gratis |
| **Netlify** | ✅ Berfungsi | Deploy mudah, gratis |
| **Custom Server** | ✅ Berfungsi | Perlu konfigurasi Nginx/Apache |

### 🔧 Solusi untuk Production

#### Opsi 1: Decompress File Unity (Paling Mudah)

Hapus Brotli compression:

```bash
# Install brotli CLI
npm install -g brotli-cli

# Decompress semua .br files
cd public/unity-builds/downloads/Build
brotli -d Downloads.data.br
brotli -d Downloads.framework.js.br
brotli -d Downloads.wasm.br

# Hapus file .br
rm *.br
```

Lalu update path di `CampusMapViewer.tsx`:
```typescript
const unityConfig = {
  dataUrl: `${basePath}unity-builds/downloads/Build/Downloads.data`,      // Tanpa .br
  frameworkUrl: `${basePath}unity-builds/downloads/Build/Downloads.framework.js`, // Tanpa .br
  codeUrl: `${basePath}unity-builds/downloads/Build/Downloads.wasm`,      // Tanpa .br
  // ...
};
```

#### Opsi 2: Rebuild Unity dengan Gzip

Di Unity Editor:
1. **File → Build Settings → Player Settings**
2. **Publishing Settings → Compression Format**
3. Pilih **Gzip** (bukan Brotli)
4. **Build** ulang project

#### Opsi 3: Deploy ke Vercel/Netlify

1. **Vercel:**
```bash
npm install -g vercel
vercel deploy
```

2. **Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Kedua platform ini **support Brotli** dan akan berfungsi dengan sempurna.

---

## 🎨 Customisasi

### Mengubah Warna Loading Bar

Edit `CampusMapViewer.tsx`:
```tsx
<div className="bg-blue-600">  {/* Ubah warna di sini */}
  <div
    className="h-full bg-blue-400"  {/* Ubah warna progress */}
    style={{ width: `${loadingProgress}%` }}
  />
</div>
```

### Mengubah Ukuran Canvas

Edit `CampusMapViewer.tsx`:
```tsx
<canvas
  ref={canvasRef}
  style={{
    width: '100%',
    height: isFullscreen ? '100vh' : '600px',  // Ubah 600px sesuai kebutuhan
  }}
/>
```

### Menambah Tombol Custom

```tsx
<button
  onClick={() => window.unityInstance?.SendMessage('Camera', 'ResetView')}
  className="px-4 py-2 bg-green-600 text-white rounded-lg"
>
  Reset Kamera
</button>
```

---

## 📊 Performance Tips

### Optimasi Loading
- File Unity sudah di-compress dengan Brotli (ukuran lebih kecil)
- Gunakan loading indicator agar user tahu progress
- Preload Unity saat halaman dashboard dibuka

### Optimasi Runtime
- Batasi ukuran canvas untuk performa lebih baik
- Gunakan quality settings yang sesuai device user
- Monitor memory usage di production

### Memory Management
```tsx
useEffect(() => {
  // Load Unity
  
  return () => {
    // Cleanup saat component unmount
    if (unityInstanceRef.current) {
      unityInstanceRef.current.Quit();
      unityInstanceRef.current = null;
    }
  };
}, []);
```

---

## 📚 Resources Tambahan

- **Unity WebGL Docs**: https://docs.unity3d.com/Manual/webgl.html
- **React + Unity Guide**: https://docs.unity3d.com/Manual/webgl-interactingwithbrowserscripting.html
- **WebGL Browser Support**: https://caniuse.com/webgl2

---

## 📞 Support

Jika ada pertanyaan atau masalah:

1. Cek **Browser Console** (F12) untuk error messages
2. Review dokumentasi ini dan [UNITY_WEBGL_INTEGRATION.md](./UNITY_WEBGL_INTEGRATION.md)
3. Test di browser lain
4. Cek **Network Tab** di DevTools untuk failed resources

---

## ✅ Checklist Deployment

Sebelum deploy ke production, pastikan:

- [ ] Unity berfungsi di local development
- [ ] Sudah test di berbagai browser (Chrome, Firefox, Edge)
- [ ] Memory leak sudah dicek (buka/tutup Unity berkali-kali)
- [ ] Loading state tampil dengan baik
- [ ] Error handling sudah ada
- [ ] Dokumentasi sudah update
- [ ] Pilih platform deployment yang support Brotli (Vercel/Netlify)
  ATAU decompress file .br untuk GitHub Pages

---

**Status**: ✅ Integration Complete  
**Terakhir Update**: 6 November 2025  
**Versi**: 1.0.0  
**Developer**: UPNVJ Dashboard Team
