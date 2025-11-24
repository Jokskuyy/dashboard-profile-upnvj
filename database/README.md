# Database Setup - Urutan Eksekusi SQL

Jalankan file SQL berikut di **Supabase SQL Editor** dengan urutan yang benar:

## 1. Schema Database (Pertama Kali Setup)

```bash
database/schema.sql
```

Membuat semua tabel dari awal (akreditasi, gedung, fakultas, fasilitas, program_studi, dosen, mahasiswa, dll.)

## 2. Insert Dummy Data (Opsional - untuk testing)

```bash
database/insert-dummy-data.sql
```

Menambahkan data sample untuk testing dashboard.

## 3. Migration: Tambah Kolom Color (Jika sudah ada data)

```bash
database/add-color-to-fasilitas.sql
```

**Jalankan ini jika tabel fasilitas sudah ada data tetapi belum punya kolom color.**

- Menambahkan kolom `color` ke tabel `fasilitas`
- Update data existing dengan warna yang sesuai berdasarkan `tipe_fasilitas`

## 4. Row-Level Security Policies (Wajib)

```bash
database/rls-policies.sql
```

**Wajib dijalankan untuk memperbaiki error 403 Forbidden.**

- Enable RLS pada semua tabel
- Buat policy untuk public read access
- Buat policy untuk admin full access (INSERT, UPDATE, DELETE)

---

## Color Scheme untuk Fasilitas

| Tipe Fasilitas | Color Code | Warna   |
| -------------- | ---------- | ------- |
| Laboratorium   | `blue`     | Biru    |
| Perpustakaan   | `green`    | Hijau   |
| Ruang Kuliah   | `orange`   | Orange  |
| Aula           | `purple`   | Ungu    |
| Lapangan       | `indigo`   | Indigo  |
| Lainnya        | `gray`     | Abu-abu |

---

## Troubleshooting

### Error: "new row violates row-level security policy"

- **Solusi**: Jalankan `database/rls-policies.sql`
- Pastikan Anda sudah login sebagai admin

### Warna aset masih abu-abu semua

- **Solusi**: Jalankan `database/add-color-to-fasilitas.sql`
- Kolom `color` akan ditambahkan dan data akan diupdate

### Table does not exist

- **Solusi**: Jalankan `database/schema.sql` terlebih dahulu
- Buat database schema dari awal
