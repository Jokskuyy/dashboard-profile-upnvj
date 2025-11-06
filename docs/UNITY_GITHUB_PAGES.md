# Unity WebGL Quick Start Guide

## GitHub Pages Deployment Issue: Brotli Compression

### Problem
Unity WebGL build menggunakan Brotli compression (`.br` files), tapi GitHub Pages tidak otomatis mengirim `Content-Encoding: br` header yang diperlukan browser untuk decompress file tersebut.

### Solutions

#### Option 1: Decompress Files (RECOMMENDED for GitHub Pages)
```powershell
# Install brotli tool
# Windows: Download from https://github.com/google/brotli/releases

# Decompress all .br files
cd public\unity-builds\downloads\Build
brotli -d Downloads.data.br -o Downloads.data
brotli -d Downloads.framework.js.br -o Downloads.framework.js
brotli -d Downloads.wasm.br -o Downloads.wasm

# Update CampusMapViewer.tsx to remove .br extension
```

#### Option 2: Rebuild Unity with Gzip
1. Open Unity project
2. File → Build Settings → Player Settings
3. Publishing Settings → Compression Format → Gzip
4. Rebuild WebGL
5. Replace files in `public/unity-builds/downloads/`

#### Option 3: Use Uncompressed Build
1. Unity → Build Settings → Player Settings
2. Publishing Settings → Compression Format → Disabled
3. Rebuild WebGL
4. Replace files (will be larger ~30-50MB)

### For Local Development
Brotli works fine in local development dengan Vite dev server.

### Current Workaround
App akan attempt to load Brotli files, dan jika gagal akan menampilkan error message yang friendly ke user.
