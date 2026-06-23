import { describe, it, expect } from "vitest";
import {
    TIPE_FASILITAS,
    categorizeFacility,
    generateDescription,
    autofillFacility,
} from "./facility-autofill.js";

describe("categorizeFacility", () => {
    const cases = [
        // [nama, tipe yang diharapkan]
        ["Lab Software Engineering(201)", "Laboratorium"],
        ["Laboratorium Anatomi A.101", "Laboratorium"],
        ["Skills Lab FK", "Laboratorium"],
        ["OSCE Center FKUPN", "Laboratorium"],
        ["Perpustakaan FK UPNVJ", "Perpustakaan & Ruang Baca"],
        ["Digital Library", "Perpustakaan & Ruang Baca"],
        ["Auditorium Fakultas Kedokteran", "Auditorium & Aula"],
        ["Aula BEJ", "Auditorium & Aula"],
        ["Ruang Podcast FIK", "Studio & Produksi Media"],
        ["Masjid", "Fasilitas Ibadah"],
        ["Musholla FK UPNVJ", "Fasilitas Ibadah"],
        ["Lapangan dan Alat Olahraga FIK", "Fasilitas Olahraga"],
        ["Ruang BEM FISIP", "Ruang Kegiatan Mahasiswa"],
        ["Ruang HIMASIFO", "Ruang Kegiatan Mahasiswa"],
        ["Ruang Dosen Patologi Klinik", "Ruang Dosen"],
        ["Ruang Kelas F.301", "Ruang Kuliah"],
        ["Smartclass Yos Sudarso Lantai 3", "Ruang Kuliah"],
        ["Ruang Tutorial FK", "Ruang Kuliah"],
        // Perbaikan klasifikasi yang sebelumnya salah:
        ["Ruang Wakil Dekan Bidang Akademik", "Administrasi & Layanan"],
        ["Ruang Dekan FK UPNVJ", "Administrasi & Layanan"],
        ["Ruang Sekretariat Tata Usaha FK UPNVJ", "Administrasi & Layanan"],
        ["PBU", "Administrasi & Layanan"],
        ["Ruang Server Wifi", "Fasilitas Umum"],
        ["Pantry", "Fasilitas Umum"],
        ["Selasar Lantai 1", "Fasilitas Umum"],
        // Fallback
        ["Mini Company", "Lainnya"],
        ["Medical Education Unit (MEU)", "Lainnya"],
    ];

    cases.forEach(([nama, expected]) => {
        it(`"${nama}" -> ${expected}`, () => {
            expect(categorizeFacility(nama)).toBe(expected);
        });
    });

    it("mengembalikan nilai dari daftar baku TIPE_FASILITAS", () => {
        for (const [nama] of cases) {
            expect(TIPE_FASILITAS).toContain(categorizeFacility(nama));
        }
    });

    it("aman terhadap input kosong/invalid", () => {
        expect(categorizeFacility("")).toBe("Lainnya");
        expect(categorizeFacility(undefined)).toBe("Lainnya");
        expect(categorizeFacility(null)).toBe("Lainnya");
    });
});

describe("generateDescription", () => {
    it("deskripsi minimal 10 karakter untuk setiap tipe", () => {
        for (const tipe of TIPE_FASILITAS) {
            const d = generateDescription("Contoh", tipe);
            expect(d.length).toBeGreaterThanOrEqual(10);
        }
    });

    it("menghitung tipe dari nama bila tipe tidak diberikan", () => {
        const d = generateDescription("Lab Mikrobiologi");
        expect(d.toLowerCase()).toContain("laboratorium");
    });
});

describe("autofillFacility", () => {
    it("melengkapi tipe & deskripsi dari nama saja", () => {
        const out = autofillFacility({
            nama_fasilitas: "Lab Mikrobiologi",
            lantai: 4,
            id_gedung: 3,
            unity_object_name: "wsh_lab_mikrobiologi",
        });
        expect(out.tipe_fasilitas).toBe("Laboratorium");
        expect(out.deskripsi_fasilitas.length).toBeGreaterThanOrEqual(10);
    });

    it("tidak menimpa tipe/deskripsi yang sudah terisi (default)", () => {
        const out = autofillFacility({
            nama_fasilitas: "Lab Mikrobiologi",
            tipe_fasilitas: "Lainnya",
            deskripsi_fasilitas: "Deskripsi khusus yang sudah ditulis manual.",
        });
        expect(out.tipe_fasilitas).toBe("Lainnya");
        expect(out.deskripsi_fasilitas).toBe("Deskripsi khusus yang sudah ditulis manual.");
    });

    it("menimpa bila overwrite=true", () => {
        const out = autofillFacility(
            { nama_fasilitas: "Lab Mikrobiologi", tipe_fasilitas: "Lainnya" },
            { overwrite: true }
        );
        expect(out.tipe_fasilitas).toBe("Laboratorium");
    });
});
