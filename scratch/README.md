# scratch/ — Skrip Utilitas Ad-hoc

Folder ini berisi **skrip utilitas/ad-hoc** (Scratch_Script) yang dipakai untuk
tugas pemeliharaan data sekali jalan: inspeksi database Supabase, pengisian
deskripsi/kategori fasilitas pada berkas seed SQL, seeding ulang database, dan
pengecekan kompresi build Unity.

Skrip-skrip ini **bukan** bagian dari aplikasi runtime (tidak diimpor oleh
`src/`, tidak ikut di-build oleh Vite, dan tidak dijalankan saat deploy). Skrip
ini **dipertahankan sebagai aset kerja** — boleh dirapikan/ditingkatkan, tetapi
tidak dihapus.

## Cara Menjalankan

Skrip adalah ES module Node (`"type": "module"` di `package.json`). Jalankan
dari **root proyek** (bukan dari dalam `scratch/`) karena beberapa skrip memakai
path relatif seperti `database/002_seed_data.sql`:

```bash
node scratch/<nama-skrip>.js
```

Skrip yang mengakses Supabase membaca kredensial dari `.env` di root
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, dan/atau
`SUPABASE_SERVICE_ROLE_KEY`). Jangan commit nilai rahasia.

> ⚠️ **Perhatian:** Beberapa skrip **menulis** (memodifikasi `database/002_seed_data.sql`)
> atau **mengubah database** (`parse-and-seed.js` menghapus lalu mengisi ulang
> tabel). Tinjau dampaknya sebelum menjalankan, dan pastikan ada cadangan.

## Daftar Skrip

| Skrip | Tujuan | Efek samping |
| --- | --- | --- |
| `check-db.js` | Cek koneksi Supabase; tampilkan jumlah `gedung` & `fasilitas` dan gedung yang punya `unity_object_name`. | Read-only |
| `check-ars.js` | Tampilkan fasilitas pada Gedung "Abdul Rahman Saleh" (nama, deskripsi, unity object). | Read-only |
| `dump-gedung.js` | Dump seluruh isi tabel `gedung` sebagai JSON ke stdout. | Read-only |
| `check-compression.js` | Deteksi apakah berkas `.wasm.unityweb` build Unity dikompres GZIP atau Brotli. | Read-only (baca file) |
| `facility-filler.js` | **Modul** (bukan skrip jalan langsung): util kategorisasi & generator deskripsi fasilitas. Mengekspor `processFacilityLine`, `categorizeFacility`, `generateDescription`. Diuji oleh `facility-filler.test.js` (bagian Test_Gate). | Tidak ada (pure) |
| `apply-filler.js` | Terapkan `categorizeFacility`/`generateDescription` ke tuple INSERT pada `database/002_seed_data.sql` (isi deskripsi kosong/terlalu pendek + perbaiki tipe). | **Menulis** `database/002_seed_data.sql` |
| `fill-desc.js` | Isi deskripsi & tipe untuk daftar fasilitas spesifik (mis. ruang kelas F.30x/F.40x) pada seed SQL. | **Menulis** `database/002_seed_data.sql` |
| `fix-type.js` | Koreksi tipe fasilitas tertentu (mis. "Ruang Dosen", "Gugus Kendali Mutu") pada seed SQL. | **Menulis** `database/002_seed_data.sql` |
| `parse-and-seed.js` | Parse statement `INSERT` dari seed SQL lalu hapus & isi ulang tabel Supabase sesuai urutan foreign key. | **Mengubah DB** (delete + insert) + perlu `SUPABASE_SERVICE_ROLE_KEY` |

## Catatan

- `facility-filler.test.js` adalah suite vitest dan **ikut dijalankan** oleh
  `npm run test` (Test_Gate). Jangan ubah kontrak ekspor `facility-filler.js`
  tanpa memperbarui test-nya.
- Keluaran `parse-and-seed`/anonymisasi yang tertulis ke `scratch/anonymized/`
  diabaikan git (`.gitignore`).
- `check-compression.js` memakai path build Unity yang mungkin perlu disesuaikan
  dengan versi build terbaru di `public/unity-builds/`.
