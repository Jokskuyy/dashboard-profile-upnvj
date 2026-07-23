import { describe, expect, test } from "vitest";
import { enrichBuildingSearchText } from "./useBuildingSearch";

describe("enrichBuildingSearchText", () => {
  test.each([
    [
      "Ruang Kepala Jurusan FIK",
      ["kajur", "kaprodi", "kepala prodi", "kepala program studi"],
    ],
    [
      "Ruang Koordinator Program Studi S1 Informatika",
      ["korprodi", "koorprodi", "kajur", "kaprodi"],
    ],
    ["Ruang Wakil Dekan Bidang Akademik", ["wadek"]],
    ["Ruang Wakil Rektor 2", ["warek"]],
    ["Ruang Kepala Laboratorium Biokimia", ["kalab", "lab"]],
    ["Pelayanan Mahasiswa FIK", ["tu", "tata usaha"]],
    ["Ruang Badan Eksekutif Mahasiswa", ["bem"]],
    ["Ruang Himpunan Mahasiswa Jurusan", ["hima", "hmj"]],
    ["Ruang UPA Bahasa", ["upa", "unit pelaksana akademik"]],
    ["KSPM dan Galeri Investasi", ["kspm", "kelompok studi pasar modal"]],
    ["Ruang Kepala Bagian", ["kabag"]],
    ["Perpustakaan Digital", ["perpus", "library"]],
    ["Lobi Utama", ["lobby"]],
    ["Ruang Rektor", ["rektorat", "gedung rektorat"]],
    ["Pusat Computer-Based Test", ["cbt", "computer based test"]],
  ])("%s memiliki alias pencarian umum", (baseText, expectedAliases) => {
    const enrichedText = enrichBuildingSearchText(baseText);

    for (const alias of expectedAliases) {
      expect(enrichedText).toContain(alias);
    }
  });

  test("tidak menambahkan alias dari potongan kata", () => {
    const enrichedText = enrichBuildingSearchText("Ruang Student Lounge");

    expect(enrichedText.split(" ")).not.toContain("tu");
  });
});
