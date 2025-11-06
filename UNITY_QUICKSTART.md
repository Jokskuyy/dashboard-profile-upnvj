# 🎮 Quick Start: Unity WebGL Integration

## ✅ Setup Complete!

File WebGL Anda sudah berhasil diintegrasikan ke dalam dashboard!

## 📍 Lokasi File
- **Source**: `WebGL/` → **Destination**: `public/unity-builds/downloads/`
- **Loader**: Sudah ditambahkan di `index.html`

## 🚀 Cara Menggunakan

### Option 1: Demo Sederhana (Recommended untuk Testing)
```tsx
// Di App.tsx atau file komponen lain
import SimpleUnityDemo from './components/campus-map/SimpleUnityDemo';

function App() {
  return <SimpleUnityDemo />;
}
```

### Option 2: Komponen Reusable
```tsx
import { UnityWebGLViewer } from './components/campus-map';

function MyComponent() {
  return (
    <div>
      <h1>My Unity App</h1>
      <UnityWebGLViewer
        buildPath="/unity-builds/downloads/Build"
        buildName="Downloads"
        height="600px"
      />
    </div>
  );
}
```

### Option 3: Full Featured (Sudah ada di Dashboard)
```tsx
import { CampusMapViewer } from './components/campus-map';

// Sudah terintegrasi di:
// src/components/dashboard/sections/CampusMapSection.tsx
```

## 🧪 Test Integrasi

1. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

2. **Buka Browser**
   ```
   http://localhost:5173
   ```

3. **Navigasi ke Campus Map**
   - Klik menu "Campus Map" di dashboard
   - Atau klik tombol "Launch Unity Map"

## 🎯 Fitur yang Tersedia

### ✨ Komponen UnityWebGLViewer
- ✅ Auto-loading dengan progress bar
- ✅ Error handling
- ✅ Fullscreen support
- ✅ Reload button
- ✅ Responsive design
- ✅ Event callbacks

### 🎮 Controls
- **Mouse Drag**: Rotate/Pan
- **Mouse Scroll**: Zoom
- **Fullscreen Button**: Toggle fullscreen
- **Reload Button**: Restart Unity

## 📡 Komunikasi React ↔️ Unity

### Kirim Pesan ke Unity
```tsx
const handleClick = () => {
  if (window.unityInstance) {
    window.unityInstance.SendMessage(
      'CameraController',  // GameObject name
      'ZoomIn',           // Method name
      ''                  // Parameter (optional)
    );
  }
};
```

### Terima Pesan dari Unity
```tsx
useEffect(() => {
  window.receiveFromUnity = (data: string) => {
    console.log('From Unity:', data);
  };
  
  return () => delete window.receiveFromUnity;
}, []);
```

## 🔍 Troubleshooting

### Issue: Unity tidak load
**Cek:**
1. Browser console untuk error
2. File ada di `/public/unity-builds/downloads/Build/`
3. Loader script di `index.html`

**Solusi:**
```bash
# Restart dev server
npm run dev
```

### Issue: Black screen
**Tunggu loading selesai** - Build Brotli compressed butuh waktu

### Issue: Error MIME type
**Sudah dikonfigurasi di `vite.config.ts`** - Restart server jika perlu

## 📊 File Structure
```
dashboard-profile-upnvj/
├── public/unity-builds/downloads/     ✅ Unity files here
│   ├── Build/
│   │   ├── Downloads.data.br
│   │   ├── Downloads.framework.js.br
│   │   ├── Downloads.loader.js
│   │   └── Downloads.wasm.br
│   └── TemplateData/
├── src/components/campus-map/
│   ├── CampusMapViewer.tsx           ✅ Full-featured
│   ├── UnityWebGLViewer.tsx          ✅ Reusable
│   ├── SimpleUnityDemo.tsx           ✅ Quick demo
│   └── index.ts
└── index.html                         ✅ Loader included
```

## 🎨 Customization

### Ubah Ukuran
```tsx
<UnityWebGLViewer
  height="800px"    // Custom height
  width="100%"      // Custom width
/>
```

### Custom Styling
```tsx
<UnityWebGLViewer
  className="shadow-2xl rounded-xl border-4 border-blue-500"
/>
```

### Callback saat Load
```tsx
<UnityWebGLViewer
  onUnityLoaded={(instance) => {
    console.log('Unity ready!', instance);
    // Do something with Unity instance
  }}
/>
```

## 📚 Dokumentasi Lengkap
Lihat: `docs/UNITY_WEBGL_INTEGRATION.md`

## ✨ Next Steps

1. **Test di Browser**
   ```bash
   npm run dev
   ```

2. **Customize UI**
   - Edit `CampusMapViewer.tsx` untuk kontrol tambahan
   - Tambah styling sesuai brand

3. **Add Interactivity**
   - Implement SendMessage untuk kontrol Unity
   - Tambah event handlers

4. **Deploy**
   ```bash
   npm run build
   npm run preview  # Test production build
   ```

## 🎉 Selesai!

Unity WebGL Anda sekarang sudah terintegrasi dengan dashboard React!

**Butuh bantuan?** Cek dokumentasi lengkap atau console browser untuk error messages.

---

**Status**: ✅ Ready to Use
**Created**: November 6, 2025
