import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabase";
import Fuse from "fuse.js";

export const SEARCH_ALIAS_GROUPS = [
  ["fik", "fakultas ilmu komputer"],
  ["feb", "fakultas ekonomi dan bisnis"],
  ["fisip", "fakultas ilmu sosial dan ilmu politik"],
  ["fh", "fakultas hukum"],
  ["fk", "fakultas kedokteran"],
  ["ft", "fakultas teknik"],
  ["fikes", "fakultas ilmu kesehatan"],
  ["faperta", "fakultas pertanian"],
  ["rektor", "rektorat", "gedung rektorat"],
  ["ruang", "ruangan"],
  ["perpus", "perpustakaan", "library"],
  ["lab", "laboratorium"],
  ["kelas", "ruang kelas", "ruang kuliah"],
  ["aula", "auditorium"],
  ["lobi", "lobby"],
  ["musala", "mushola", "musolla"],
  [
    "kajur",
    "kepala jurusan",
    "ketua jurusan",
    "kaprodi",
    "kepala prodi",
    "kepala program studi",
    "korprodi",
    "koorprodi",
    "koordinator prodi",
    "koordinator program studi",
  ],
  ["kadep", "kepala departemen", "departemen"],
  ["sekjur", "sekretaris jurusan", "sekretariat jurusan"],
  ["sekprodi", "sekretaris program studi", "sekretariat program studi"],
  ["kabag", "kepala bagian"],
  ["kasubag", "kepala subbagian"],
  ["wadek", "wakil dekan"],
  ["warek", "wakil rektor"],
  ["kalab", "kepala laboratorium"],
  ["dekanat", "ruang dekan", "dekan"],
  ["dosen", "staf", "staff", "ruang dosen", "ruang staf"],
  [
    "tu",
    "tata usaha",
    "pelayanan mahasiswa",
    "layanan mahasiswa",
    "layanan akademik",
    "administrasi mahasiswa",
  ],
  ["prodi", "program studi"],
  ["bem", "badan eksekutif mahasiswa"],
  ["sema", "senat mahasiswa"],
  ["hima", "himpunan mahasiswa"],
  ["hmj", "himpunan mahasiswa jurusan"],
  ["ukm", "unit kegiatan mahasiswa"],
  ["gkm", "gugus kendali mutu"],
  ["kui", "kantor urusan internasional", "international office"],
  ["humas", "hubungan masyarakat", "public relations"],
  ["akpk", "akademik kemahasiswaan perencanaan dan kerja sama"],
  ["lppm", "lembaga penelitian dan pengabdian kepada masyarakat"],
  ["lpmpp", "lembaga penjaminan mutu dan pengembangan pembelajaran"],
  ["mkwk", "mata kuliah wajib kurikulum"],
  ["mkwu", "mata kuliah wajib umum"],
  ["tik", "teknologi informasi dan komunikasi"],
  ["lsp", "lembaga sertifikasi profesi"],
  ["luk", "lembaga uji kompetensi"],
  ["bmn", "barang milik negara"],
  ["upa", "unit penunjang akademik", "unit pelaksana akademik"],
  ["upt", "unit pengembangan karir", "unit pelaksana teknis"],
  ["cbt", "computer based test", "computer-based test"],
  ["osce", "objective structured clinical examination"],
  ["ai", "artificial intelligence", "kecerdasan buatan"],
  ["iot", "internet of things"],
  ["mqa", "medical quality assurance"],
  ["meu", "medical education unit"],
  ["kspm", "kelompok studi pasar modal"],
  ["pbu", "pusat bimbingan ujian", "administrasi terpadu"],
  ["mpm", "majelis permusyawaratan mahasiswa"],
  ["bpm", "badan perwakilan mahasiswa"],
  ["pmi", "palang merah indonesia"],
  [
    "mitek",
    "medical information and technology education and communication",
  ],
  ["rapat", "ruang rapat", "meeting room"],
  ["selasar", "koridor", "corridor"],
  ["lounge", "ruang tunggu", "ruang santai"],
] as const;

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsAlias = (text: string, alias: string) =>
  new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i").test(text);

export function enrichBuildingSearchText(baseText: string) {
  const normalizedText = baseText.toLowerCase();
  const aliases = SEARCH_ALIAS_GROUPS.flatMap((group) =>
    group.some((alias) => containsAlias(normalizedText, alias)) ? group : [],
  );

  return [...new Set([normalizedText, ...aliases])].join(" ");
}

export interface SearchResult {
  /** Label yang ditampilkan di dropdown */
  label: string;
  /** Sub-label (nama gedung jika ini adalah fasilitas) */
  sublabel?: string;
  /** Nama unik yang dikirim ke Unity via SendMessage */
  unityObjectName: string;
  /** Gedung tujuan untuk navigasi denah 2D */
  buildingId: number;
  /** Tipe hasil untuk ikon dan styling */
  type: "gedung" | "fasilitas";
  /** Gabungan teks untuk pencarian fuzzy yang lebih optimal */
  searchText?: string;
}

export function useBuildingSearch() {
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup Fuse.js instance memoized based on allResults
  const fuse = useMemo(() => {
    return new Fuse(allResults, {
      keys: ["label", "sublabel", "searchText"],
      threshold: 0.3, // Kembalikan ke 0.3 karena kita pakai extended search
      ignoreLocation: true,
      minMatchCharLength: 2,
      useExtendedSearch: true,
    });
  }, [allResults]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch semua gedung dan fasilitasnya, beserta deskripsi dan lokasi untuk pencarian
        const { data, error: fetchError } = await supabase
          .from("gedung")
          .select(`
            id,
            nama_gedung,
            deskripsi_gedung,
            lokasi,
            unity_object_name,
            fasilitas (
              nama_fasilitas,
              deskripsi_fasilitas,
              unity_object_name
            )
          `);

        if (fetchError) throw fetchError;

        const results: SearchResult[] = [];

        for (const gedung of data || []) {
          // Tambah gedung sebagai hasil JIKA terdaftar di Unity
          if (gedung.unity_object_name) {
            const baseSearch = `${gedung.nama_gedung} ${gedung.deskripsi_gedung || ""} ${gedung.lokasi || ""}`;
            results.push({
              label: gedung.nama_gedung,
              type: "gedung",
              unityObjectName: gedung.unity_object_name,
              buildingId: gedung.id,
              searchText: enrichBuildingSearchText(baseSearch),
            });
          }

          // Tambah setiap fasilitas
          for (const f of gedung.fasilitas || []) {
            const targetName = f.unity_object_name || gedung.unity_object_name;
            
            if (targetName) {
              const baseSearch = `${f.nama_fasilitas} ${f.deskripsi_fasilitas || ""} ${gedung.nama_gedung} ${gedung.deskripsi_gedung || ""} ${gedung.lokasi || ""}`;
              results.push({
                label: f.nama_fasilitas,
                sublabel: gedung.nama_gedung,
                type: "fasilitas",
                unityObjectName: targetName,
                buildingId: gedung.id,
                searchText: enrichBuildingSearchText(baseSearch),
              });
            }
          }
        }

        setAllResults(results);
      } catch (err) {
        console.error("[useBuildingSearch] Error fetching:", err);
        setError("Gagal memuat data gedung");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /**
   * Filter hasil berdasarkan query menggunakan Fuse.js
   */
  const search = useCallback((query: string): SearchResult[] => {
    if (!query.trim()) return [];
    
    // Hapus karakter non-alfanumerik/spasi/dash untuk sanitasi
    const q = query.toLowerCase().replace(/[^\w\s-]/g, "").trim();
    
    // Gunakan extended search format: "'word1 'word2" (artinya includes word1 AND includes word2)
    const words = q.split(/\s+/).filter(w => w.length > 0);
    const extendedQuery = words.map(w => `'${w}`).join(" ");

    const results = fuse.search(extendedQuery);
    return results.map(r => r.item);
  }, [fuse]);

  return { search, loading, error, allResults };
}
