#!/bin/bash
# Rebuild and deploy dashboard script

echo "🔨 Building dashboard..."
npm run build

echo "📦 Decompressing Unity files..."
cd dist/unity-builds/downloads/Build
brotli -d -f Downloads.framework.js.br -o Downloads.framework.js
brotli -d -f Downloads.data.br -o Downloads.data
brotli -d -f Downloads.wasm.br -o Downloads.wasm

echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deploy complete! Visit http://43.134.171.102/dashboard-upnvj/"
