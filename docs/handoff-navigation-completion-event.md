# Handoff: Integrasi Navigation Completion Unity ke React

> Status: implementasi React selesai
>
> Tanggal: 21 Juli 2026
>
> Repo: `dashboard-profile-upnvj`

## Tujuan

Memastikan popup **Tiba di Tujuan** hanya muncul ketika Unity menyelesaikan navigasi ke `unity_object_name` yang sama dengan item yang sedang dipilih di React.

## Kontrak Event

Nama browser event:

```text
OnNavigationCompleted
```

`CustomEvent.detail` harus berupa string JSON:

```json
{
  "unity_object_name": "yos_sudarso"
}
```

Payload lama berupa string kosong tidak diterima lagi oleh dashboard.

## Perubahan React

File utama: `src/components/campus-map/SearchOverlay.tsx`

- Menambahkan tipe `NavigationCompletedPayload` dengan field `unity_object_name`.
- Memisahkan listener completion dari listener shortcut keyboard.
- Memastikan `CustomEvent.detail` bertipe string, tidak kosong, dan dapat di-parse sebagai JSON.
- Menormalisasi key Unity dan key selected item dengan `trim().toLowerCase()`.
- Menggunakan field React yang aktual, yaitu `selectedItem.unityObjectName`.
- Mengabaikan event jika navigasi tidak aktif, selected item kosong, key kosong, atau key berbeda.
- Menampilkan popup hanya untuk payload yang cocok dengan tujuan aktif.
- Membersihkan listener pada cleanup `useEffect`, termasuk pada siklus React Strict Mode.
- Menyimpan timeout popup dalam ref dan membersihkannya saat cancel, memilih tujuan baru, dependency effect berubah, atau component unmount.
- Mereset status kedatangan saat navigasi baru dimulai agar tujuan yang sama dapat digunakan kembali.

Tidak ada jalur cancel, tombol kembali, penutupan search, atau pemilihan spawn di React yang secara langsung membuka popup kedatangan.

## Perilaku yang Diharapkan

| Kondisi | Hasil React |
|---|---|
| Payload cocok dengan tujuan aktif | Popup tampil satu kali sesuai event Unity |
| Payload berbeda | Diabaikan |
| Payload kosong | Diabaikan |
| JSON rusak | Diabaikan dan menulis warning |
| Field `unity_object_name` hilang/kosong | Diabaikan |
| Belum ada selected item | Diabaikan |
| Navigasi sudah dicancel | Diabaikan |
| Navigasi kedua ke tujuan yang sama | Bisa menampilkan popup setelah completion baru |

## Test Otomatis

File: `src/components/campus-map/SearchOverlay.test.tsx`

Suite baru berisi 9 test:

1. Payload cocok setelah normalisasi case dan whitespace.
2. Payload tujuan berbeda.
3. Payload kosong.
4. JSON tidak valid.
5. Key hanya whitespace.
6. Field key hilang.
7. Event tanpa selected item.
8. Cancel tidak memunculkan popup dan navigasi kedua ke tujuan sama tetap berhasil.
9. Seluruh listener completion dilepas ketika component Strict Mode di-unmount.

Hasil verifikasi saat handoff:

- Full test suite: **13 file, 127 test lulus**.
- Production build: **lulus**.
- ESLint: **lulus tanpa error**.
- TypeScript build: **lulus**.

## Checklist Integrasi Manual

- [ ] Tiba normal menghasilkan tepat satu popup untuk tujuan aktif.
- [ ] Cancel navigasi tidak menghasilkan popup.
- [ ] Ganti spawn ketika navigasi aktif tidak menghasilkan popup.
- [ ] Target Unity tidak ditemukan tidak menghasilkan popup.
- [ ] Payload target berbeda dari item React diabaikan.
- [ ] Navigasi kedua ke tujuan yang sama tetap menghasilkan popup setelah tiba.
- [ ] Jalankan dengan build WebGL yang benar-benar sudah memakai payload JSON baru.

## Dependency dan Batas Scope

- Dashboard mengasumsikan Unity hanya mengirim `OnNavigationCompleted` dari `CompleteNavigation()` normal.
- `StopNavigation()`, pergantian spawn, dan target tidak ditemukan harus tetap tidak mengirim completion event.
- Plugin `ReactBridge.jslib` tidak memerlukan perubahan selama meneruskan string payload ke `CustomEvent.detail`.
- Folder `src/unity-scripts/` di repo dashboard adalah script referensi dan masih dapat tertinggal dari repo Unity utama. Perubahan pada listener ini tidak mengubah file Unity atau binary WebGL.
- Sebelum rilis, pastikan build Unity yang dipublikasikan di `public/unity-builds/` berasal dari source Unity dengan kontrak baru.

## File yang Berubah

- `src/components/campus-map/SearchOverlay.tsx`
- `src/components/campus-map/SearchOverlay.test.tsx`
- `docs/AI_HANDOFF.md`
- `docs/handoff-navigation-completion-event.md`
