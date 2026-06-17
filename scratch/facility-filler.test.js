import { processFacilityLine, categorizeFacility, generateDescription } from './facility-filler.js';

const testCases = [
    {
        input: `('Lab Komputer 1', '', 'Lantai 1', NULL, NULL, 6, 'Belum Jelas'),`,
        expected: `('Lab Komputer 1', $$Laboratorium komputer untuk kegiatan praktikum dan riset$$, 'Lantai 1', NULL, NULL, 6, 'Laboratorium'),`
    },
    {
        input: `('Ruang Dosen SI', '', 'Lantai 2', NULL, NULL, 6, 'Lainnya'),`,
        expected: `('Ruang Dosen SI', $$Ruang kerja dan transit untuk Dosen SI$$, 'Lantai 2', NULL, NULL, 6, 'Ruang Dosen'),`
    },
    {
        input: `('Ruang BEM FIK', '', 'Lantai 1', NULL, NULL, 6, 'Fasilitas Umum'),`,
        expected: `('Ruang BEM FIK', $$Ruang sekretariat dan pusat kegiatan mahasiswa untuk BEM FIK$$, 'Lantai 1', NULL, NULL, 6, 'Ruang Kegiatan Mahasiswa'),`
    },
    {
        // Should not modify lines that are not valid facility inserts (e.g. comments or short lines)
        input: `-- INSERT FASILITAS`,
        expected: `-- INSERT FASILITAS`
    }
];

let failed = 0;
testCases.forEach((tc, i) => {
    const result = processFacilityLine(tc.input);
    if (result !== tc.expected) {
        console.error(`Test ${i + 1} Failed!`);
        console.error(`Expected: ${tc.expected}`);
        console.error(`Got     : ${result}`);
        failed++;
    } else {
        console.log(`Test ${i + 1} Passed.`);
    }
});

if (failed === 0) {
    console.log("All tests passed! (GREEN)");
} else {
    console.error(`${failed} tests failed. (RED)`);
    process.exit(1);
}
