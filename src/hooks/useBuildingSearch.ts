import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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
   * Filter hasil berdasarkan query.
   * Cocok ke nama gedung dan nama fasilitas.
   */
  function search(query: string): SearchResult[] {
    if (!query.trim()) return [];
    const clean = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    const q = clean(query);
    return allResults.filter(
      (r) =>
        clean(r.label).includes(q) ||
        (r.sublabel && clean(r.sublabel).includes(q))
    );
  }

  return { search, loading, error, allResults };
}
