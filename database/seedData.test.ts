import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const seedSql = readFileSync(new URL("./002_seed_data.sql", import.meta.url), "utf8");

const restoredUnityObjectNames = [
  "khd_ruang_rapat",
  "mht_201",
  "mht_202",
  "mht_203",
  "mht_204",
  "mht_301",
  "yos_ruang_pelayanan_mahasiswa_fh",
  "yos_ruang_transit_dosen",
  "yos_lobby",
  "yos_ruang_bem_dan_senat_fh",
  "yos_ruang_dosen_pidana",
  "yos_ruang_dosen_1",
  "yos_ruang_dosen_2",
  "yos_selasar",
  "yos_ruang_perancangan_kontrak",
  "yos_ruang_dosen_perdata_dan_bisnis",
  "yos_ruang_forum_riset_dan_debat_mahasiswa",
  "yos_kelas_201",
  "yos_kelas_202",
  "yos_kelas_203",
  "yos_kelas_204",
  "yos_kelas_205",
  "yos_perpustakaan_fh",
  "yos_ruang_asosiasi_mahasiswa_hukum_internasional",
  "yos_kelas_301",
  "yos_kelas_302",
  "yos_kelas_303",
  "yos_kelas_304",
  "yos_kelas_305",
  "yos_kelas_306",
  "yos_kelas_307",
  "yos_podcast",
  "yos_praktek_peradilan_semu_1",
  "yos_unit_peradilan_semu",
  "yos_praktek_peradilan_semu_2",
  "ds_lapangan",
  "ds_ukm_sepak_bola",
  "ds_204",
  "ds_304",
  "ds_404",
] as const;

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe("historical Unity-backed seed facilities", () => {
  test.each(restoredUnityObjectNames)(
    "%s tetap ada tepat satu kali sebagai unity_object_name fasilitas",
    (unityObjectName) => {
      const asLastTupleValue = new RegExp(
        `'${escapeRegExp(unityObjectName)}'\\s*\\)`,
        "g",
      );

      expect(seedSql.match(asLastTupleValue) ?? []).toHaveLength(1);
    },
  );
});
