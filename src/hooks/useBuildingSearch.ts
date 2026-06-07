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
}

export function useBuildingSearch() {
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup Fuse.js instance memoized based on allResults
  const fuse = useMemo(() => {
    return new Fuse(allResults, {
      keys: ["label", "sublabel"],
      threshold: 0.3, // Tolerance for typos
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [allResults]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch semua gedung dan fasilitasnya
        const { data, error: fetchError } = await supabase
          .from("gedung")
          .select(`
            nama_gedung,
            unity_object_name,
            fasilitas (
              nama_fasilitas,
              unity_object_name
            )
          `);

        if (fetchError) throw fetchError;

        const results: SearchResult[] = [];

        for (const gedung of data || []) {
          // Tambah gedung sebagai hasil JIKA terdaftar di Unity
          if (gedung.unity_object_name) {
            results.push({
              label: gedung.nama_gedung,
              type: "gedung",
              unityObjectName: gedung.unity_object_name,
            });
          }

          // Tambah setiap fasilitas
          for (const f of gedung.fasilitas || []) {
            // Gunakan unity_object_name milik fasilitas JIKA ada,
            // JIKA TIDAK ada, fallback ke gedung.unity_object_name.
            const targetName = f.unity_object_name || gedung.unity_object_name;
            
            // JIKA targetName ada (fasilitas punya nama di Unity ATAU gedung punya nama di Unity), tambahkan ke search
            if (targetName) {
              results.push({
                label: f.nama_fasilitas,
                sublabel: gedung.nama_gedung,
                type: "fasilitas",
                unityObjectName: targetName,
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
   * Filter hasil berdasarkan query menggunakan Fuse.js dan Abbreviation mapping
   */
  const search = useCallback((query: string): SearchResult[] => {
    if (!query.trim()) return [];
    
    let q = query.toLowerCase().trim();
    
    // Ganti kata-kata tertentu jika query mengandung singkatan, 
    // misal "gedung fik" -> "gedung fakultas ilmu komputer"
    const words = q.split(/\s+/);
    const expandedWords = words.map(w => ABBREVIATIONS[w] || w);
    q = expandedWords.join(" ");

    const results = fuse.search(q);
    return results.map(r => r.item);
  }, [fuse]);

  return { search, loading, error, allResults };
}
