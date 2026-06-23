import { describe, it, expect } from "vitest";
import { processFacilityLine } from "./facility-filler.js";

// Each case mirrors the original ad-hoc assertions: a raw SQL facility insert
// line and the expected output after processFacilityLine() normalizes the
// description ($$...$$) and re-categorizes the facility type.
const testCases = [
    {
        name: "fills description and categorizes a lab as Laboratorium",
        input: `('Lab Komputer 1', '', 'Lantai 1', NULL, NULL, 6, 'Belum Jelas'),`,
        expected: `('Lab Komputer 1', $$Laboratorium komputer untuk kegiatan praktikum dan riset$$, 'Lantai 1', NULL, NULL, 6, 'Laboratorium'),`
    },
    {
        name: "categorizes a lecturer room as Ruang Dosen",
        input: `('Ruang Dosen SI', '', 'Lantai 2', NULL, NULL, 6, 'Lainnya'),`,
        expected: `('Ruang Dosen SI', $$Ruang kerja dan transit untuk Dosen SI$$, 'Lantai 2', NULL, NULL, 6, 'Ruang Dosen'),`
    },
    {
        name: "categorizes a BEM room as Ruang Kegiatan Mahasiswa",
        input: `('Ruang BEM FIK', '', 'Lantai 1', NULL, NULL, 6, 'Fasilitas Umum'),`,
        expected: `('Ruang BEM FIK', $$Ruang sekretariat dan pusat kegiatan mahasiswa untuk BEM FIK$$, 'Lantai 1', NULL, NULL, 6, 'Ruang Kegiatan Mahasiswa'),`
    },
    {
        name: "leaves non-facility lines (comments/short lines) unchanged",
        input: `-- INSERT FASILITAS`,
        expected: `-- INSERT FASILITAS`
    }
];

describe("processFacilityLine", () => {
    testCases.forEach((tc) => {
        it(tc.name, () => {
            expect(processFacilityLine(tc.input)).toBe(tc.expected);
        });
    });
});
