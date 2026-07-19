import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabase";
import Fuse from "fuse.js";

const ABBREVIATIONS: Record<string, string> = {
  fik: "fakultas ilmu komputer",
  feb: "fakultas ekonomi dan bisnis",
  fisip: "fakultas ilmu sosial dan ilmu politik",
  fh: "fakultas hukum",
  fk: "fakultas kedokteran",
  ft: "fakultas teknik",
  fikes: "fakultas ilmu kesehatan",
  faperta: "fakultas pertanian",
  rektorat: "gedung rektorat",
  perpus: "perpustakaan",
  ruang: "ruangan",
  rektor: "rektorat",
};

export interface SearchResult {
  /** Label yang ditampilkan di dropdown */
  label: string;
  /** Sub-label (nama gedung jika ini adalah fasilitas) */
  sublabel?: string;
  /** Nama unik yang dikirim ke Unity via SendMessage */
  unityObjectName: string;
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

        // Fungsi bantu untuk memperkaya searchText dengan singkatan dan kepanjangannya
        const enrichSearchText = (baseText: string) => {
          let text = baseText.toLowerCase();
          Object.entries(ABBREVIATIONS).forEach(([abbr, full]) => {
            // Jika teks mengandung singkatan, tambahkan kepanjangannya
            if (new RegExp(`\\b${abbr}\\b`, 'i').test(text)) {
              text += ` ${full}`;
            }
            // Jika teks mengandung kepanjangannya, tambahkan singkatannya
            else if (text.includes(full)) {
              text += ` ${abbr}`;
            }
          });
          return text;
        };

        for (const gedung of data || []) {
          // Tambah gedung sebagai hasil JIKA terdaftar di Unity
          if (gedung.unity_object_name) {
            const baseSearch = `${gedung.nama_gedung} ${gedung.deskripsi_gedung || ""} ${gedung.lokasi || ""}`;
            results.push({
              label: gedung.nama_gedung,
              type: "gedung",
              unityObjectName: gedung.unity_object_name,
              searchText: enrichSearchText(baseSearch),
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
                searchText: enrichSearchText(baseSearch),
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
