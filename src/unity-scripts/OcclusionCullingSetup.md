# Panduan Setup Occlusion Culling (Unity WebGL)

Selain **Distance Culling** yang sudah kita buat dinamis (berdasarkan Tag "Cullable"), disarankan untuk mengaktifkan **Occlusion Culling** bawaan Unity agar performa WebGL lebih maksimal.

## Beda Distance Culling & Occlusion Culling
- **Distance Culling (BuildingCulling.cs)**: Menonaktifkan gedung yang jaraknya *sangat jauh* dari player (berapapun sudut pandang kameranya).
- **Occlusion Culling (Unity)**: Menonaktifkan gedung yang tertutup gedung lain (contoh: Pos Satpam di balik Rektorat tidak akan dirender, meskipun jaraknya dekat).

## Langkah-langkah Setup di Unity Editor

### 1. Set Object Static
Agar Unity bisa mengkalkulasi Occlusion, object gedung harus ditandai sebagai statis (tidak bergerak).
1. Buka scene kampus.
2. Select semua gedung (baik root maupun mesh child-nya).
3. Di Inspector (pojok kanan atas), klik dropdown di sebelah tulisan **Static**.
4. Centang **Occluder Static** dan **Occludee Static**.
   - *Occluder*: Object besar yang bisa menutupi object lain (contoh: Gedung Rektorat).
   - *Occludee*: Object yang bisa ditutupi oleh object lain (contoh: semua gedung).
5. Jika ada prompt *"Change for children?"*, pilih **Yes, change children**.

> **Tips:** Object kecil seperti tiang listrik atau pohon kecil sebaiknya hanya di-centang `Occludee Static` saja (jangan `Occluder`), agar Unity tidak repot menghitung apakah tiang listrik menutupi gunung di belakangnya.

### 2. Bake Occlusion Data
1. Buka window Occlusion Culling lewat menu: **Window > Rendering > Occlusion Culling**.
2. Akan muncul tab *Occlusion* di sebelah Inspector.
3. Masuk ke tab **Bake**.
4. Atur parameternya:
   - **Smallest Occluder**: Ukuran terkecil object yang bisa menutupi object lain (default: 5). Untuk skala kampus, biarkan 5, atau perbesar jika ingin bake lebih cepat.
   - **Smallest Hole**: Ukuran celah terkecil (default: 0.25).
5. Klik tombol **Bake** di bagian bawah.
6. Tunggu proses komputasi selesai (bisa makan waktu tergantung kompleksitas scene).

### 3. Test & Preview
1. Di tab *Occlusion*, pindah ke bagian **Visualization**.
2. Pastikan Scene View dalam mode **Shaded** (bukan wireframe).
3. Gerakkan kamera di Scene View.
4. Anda akan melihat garis biru dan kotak-kotak sel. Saat kamera bergerak atau terhalang dinding, gedung-gedung di baliknya akan otomatis hilang (tidak dirender).

### 4. Performa di WebGL
Data hasil bake occlusion akan tersimpan di dalam folder scene dan sedikit menambah ukuran build `.data`, namun **sangat menghemat Draw Calls dan GPU memory** saat dijalankan di browser (WebGL). Ini adalah kombinasi terbaik dengan Distance Culling yang sudah kita pasang!
