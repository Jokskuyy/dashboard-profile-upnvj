/**
 * facility-autofill.js — Modul util autofill fasilitas (pure, testable).
 *
 * Tujuan: ketika kamu hanya mengisi `nama_fasilitas`, `lantai`, `id_gedung`,
 * dan `unity_object_name`, modul ini melengkapi `tipe_fasilitas` dan
 * `deskripsi_fasilitas` secara otomatis berdasarkan nama fasilitas.
 *
 * Ini modul terpisah dari `facility-filler.js` (yang lama tetap dipertahankan
 * beserta kontrak test-nya). Fungsi di sini murni / tanpa efek samping.
 *
 * Ekspor:
 *   - TIPE_FASILITAS        : daftar nilai baku tipe_fasilitas (controlled vocab)
 *   - categorizeFacility    : (nama) -> tipe baku
 *   - generateDescription   : (nama, tipe) -> deskripsi
 *   - autofillFacility      : ({nama_fasilitas, ...}) -> {tipe_fasilitas, deskripsi_fasilitas}
 *
 * Jalankan dari root proyek bila ingin uji manual: `node scratch/facility-autofill.js`
 */

/**
 * Daftar nilai baku (controlled vocabulary) untuk tipe_fasilitas.
 * Disusun mengikuti nilai yang sudah dipakai di database/002_seed_data.sql.
 * Gunakan HANYA nilai dari daftar ini agar tidak ada lagi tipe yang tidak konsisten.
 */
const TIPE_FASILITAS = [
    'Ruang Kuliah',
    'Ruang Dosen',
    'Laboratorium',
    'Auditorium & Aula',
    'Studio & Produksi Media',
    'Perpustakaan & Ruang Baca',
    'Ruang Kegiatan Mahasiswa',
    'Administrasi & Layanan',
    'Fasilitas Ibadah',
    'Fasilitas Olahraga',
    'Fasilitas Umum',
    'Lainnya',
];

/**
 * Aturan kategorisasi — DIEVALUASI BERURUTAN (yang lebih spesifik di atas).
 * Urutan penting: mis. "Ruang Wakil Dekan Bidang Akademik" harus kena aturan
 * 'dekan' (Administrasi & Layanan) SEBELUM aturan 'akademik' (Ruang Kuliah).
 *
 * Setiap aturan: { tipe, keywords: [substring lowercase] }.
 */
const RULES = [
    // Ibadah — cek paling awal (kata kunci sangat khas)
    { tipe: 'Fasilitas Ibadah', keywords: ['masjid', 'musholla', 'mushola', 'mushalla', 'ibadah'] },

    // Olahraga
    { tipe: 'Fasilitas Olahraga', keywords: ['olahraga', 'lapangan', 'senam', 'gym', 'fitness', 'futsal', 'basket court'] },

    // Laboratorium (termasuk skills lab & OSCE) — sebelum studio/multimedia
    { tipe: 'Laboratorium', keywords: ['laboratorium', 'lab ', 'skills lab', 'skill lab', 'osce', 'kalab', 'kepala lab'] },

    // Perpustakaan
    { tipe: 'Perpustakaan & Ruang Baca', keywords: ['perpustakaan', 'ruang baca', 'digital library', 'library', 'e-library'] },

    // Auditorium / aula / hall
    { tipe: 'Auditorium & Aula', keywords: ['auditorium', 'aula', 'teater', 'theater', 'hall'] },

    // Studio & produksi media
    { tipe: 'Studio & Produksi Media', keywords: ['studio', 'podcast', 'siaran', 'broadcast', 'radio', 'fotografi', 'film dan televisi'] },

    // Pimpinan & administrasi — SEBELUM 'dosen' dan 'akademik'
    {
        tipe: 'Administrasi & Layanan',
        keywords: [
            'dekan', 'wakil dekan', 'wadek', 'rektor', 'wakil rektor',
            'tata usaha', 'administrasi', 'sekretariat', 'keuangan',
            'akreditasi', 'gugus kendali mutu', 'layanan', 'loket', 'pbu',
            'rapat', 'meeting', 'pimpinan', 'upt ', 'upa ',
        ],
    },

    // Ruang dosen / pengajar
    { tipe: 'Ruang Dosen', keywords: ['dosen', 'kaprodi', 'kajur', 'guru besar', 'pengajar', 'instruktur'] },

    // Kegiatan mahasiswa / organisasi
    {
        tipe: 'Ruang Kegiatan Mahasiswa',
        keywords: ['bem', 'hima', 'himasifo', 'senat', 'ukm', ' eos', 'organisasi mahasiswa', 'kegiatan mahasiswa', 'alumni'],
    },

    // Ruang kuliah / kelas / akademik
    { tipe: 'Ruang Kuliah', keywords: ['ruang kelas', 'ruang kuliah', 'kelas ', 'kuliah', 'smartclass', 'smart class', 'tutorial', 'akademik', 'introduction', 'lecture', 'seminar'] },

    // Fasilitas umum / infrastruktur
    {
        tipe: 'Fasilitas Umum',
        keywords: ['gudang', 'toilet', 'server', 'panel', 'pantry', 'lift', 'selasar', 'lounge', 'parkir', 'wifi', 'reagent', 'kandang', 'mitek'],
    },
];

/**
 * categorizeFacility — petakan nama fasilitas ke salah satu nilai TIPE_FASILITAS.
 * @param {string} name
 * @returns {string} salah satu dari TIPE_FASILITAS
 */
function categorizeFacility(name) {
    if (!name || typeof name !== 'string') return 'Lainnya';
    const n = name.toLowerCase();
    for (const rule of RULES) {
        if (rule.keywords.some((kw) => n.includes(kw))) {
            return rule.tipe;
        }
    }
    return 'Lainnya';
}

/**
 * generateDescription — hasilkan deskripsi yang wajar berdasarkan tipe & nama.
 * Sengaja deskriptif-umum dan tidak mengarang detail spesifik (kapasitas,
 * jumlah unit, dll) yang tidak kita ketahui — supaya aman dipakai sebelum survei.
 *
 * @param {string} name
 * @param {string} [tipe] - jika tidak diberikan, dihitung dari name
 * @returns {string}
 */
function generateDescription(name, tipe) {
    const t = tipe || categorizeFacility(name);
    const namaBersih = String(name || '').trim();

    switch (t) {
        case 'Laboratorium': {
            // Hilangkan awalan "Lab"/"Laboratorium" dari nama agar tidak dobel.
            const inti = namaBersih.replace(/^(laboratorium|lab)\s+/i, '').trim();
            return inti
                ? `Laboratorium ${inti} untuk kegiatan praktikum dan penelitian mahasiswa.`
                : `Laboratorium untuk kegiatan praktikum dan penelitian mahasiswa.`;
        }
        case 'Ruang Kuliah':
            return `Ruang kelas untuk kegiatan perkuliahan dan pembelajaran mahasiswa.`;
        case 'Ruang Dosen':
            return `Ruang kerja dan transit bagi dosen.`;
        case 'Auditorium & Aula':
            return `Ruang serbaguna untuk seminar, kuliah umum, dan acara akademik.`;
        case 'Studio & Produksi Media':
            return `Studio produksi media untuk kegiatan rekaman, penyiaran, dan produksi konten.`;
        case 'Perpustakaan & Ruang Baca':
            return `Ruang baca dan koleksi referensi untuk menunjang kegiatan akademik.`;
        case 'Ruang Kegiatan Mahasiswa':
            return `Ruang sekretariat dan kegiatan organisasi kemahasiswaan.`;
        case 'Administrasi & Layanan':
            return `Ruang administrasi dan layanan akademik.`;
        case 'Fasilitas Ibadah':
            return `Fasilitas ibadah bagi mahasiswa, staf, dan dosen.`;
        case 'Fasilitas Olahraga':
            return `Fasilitas olahraga untuk kegiatan dan latihan mahasiswa.`;
        case 'Fasilitas Umum':
            return `Fasilitas umum dan infrastruktur pendukung gedung.`;
        default:
            return `Fasilitas penunjang kegiatan akademik dan kemahasiswaan.`;
    }
}

/**
 * autofillFacility — lengkapi tipe & deskripsi dari data parsial.
 *
 * Cocok dengan alur kerjamu: kamu isi nama_fasilitas, lantai, id_gedung,
 * unity_object_name; fungsi ini mengembalikan tipe_fasilitas & deskripsi_fasilitas.
 *
 * @param {Object} f
 * @param {string} f.nama_fasilitas
 * @param {Object} [opts]
 * @param {boolean} [opts.overwrite=false] - jika true, timpa tipe/deskripsi yang sudah ada
 * @returns {{tipe_fasilitas: string, deskripsi_fasilitas: string}}
 */
function autofillFacility(f = {}, opts = {}) {
    const { overwrite = false } = opts;
    const nama = f.nama_fasilitas ?? f.nama ?? '';

    const sudahAdaTipe = typeof f.tipe_fasilitas === 'string' && f.tipe_fasilitas.trim().length > 0;
    const sudahAdaDesk = typeof f.deskripsi_fasilitas === 'string' && f.deskripsi_fasilitas.trim().length >= 10;

    const tipe_fasilitas = (!overwrite && sudahAdaTipe) ? f.tipe_fasilitas : categorizeFacility(nama);
    const deskripsi_fasilitas = (!overwrite && sudahAdaDesk)
        ? f.deskripsi_fasilitas
        : generateDescription(nama, tipe_fasilitas);

    return { tipe_fasilitas, deskripsi_fasilitas };
}

export {
    TIPE_FASILITAS,
    categorizeFacility,
    generateDescription,
    autofillFacility,
};

// Jalankan langsung untuk smoke-test cepat: `node scratch/facility-autofill.js`
import { pathToFileURL } from 'node:url';
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    const contoh = [
        'Lab Software Engineering(201)',
        'Ruang Wakil Dekan Bidang Akademik',
        'Ruang Dosen Patologi Klinik',
        'Musholla FK UPNVJ',
        'Ruang BEM FISIP',
        'Perpustakaan FK UPNVJ',
        'Auditorium Fakultas Kedokteran',
        'Ruang Podcast FIK',
        'Ruang Kelas F.301',
        'Lapangan dan Alat Olahraga FIK',
        'Selasar Lantai 1',
        'Mini Company',
    ];
    for (const nama of contoh) {
        const { tipe_fasilitas, deskripsi_fasilitas } = autofillFacility({ nama_fasilitas: nama });
        console.log(`- ${nama}\n    tipe : ${tipe_fasilitas}\n    desk : ${deskripsi_fasilitas}`);
    }
}
