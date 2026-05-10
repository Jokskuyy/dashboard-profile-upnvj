// GET /api/unity/data — Data untuk Unity (format mentah Supabase)
import { getSupabase, setCors } from "../_shared.js";

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const supabase = getSupabase();

    const [gedungResult, fasilitasResult] = await Promise.all([
      supabase
        .from("gedung")
        .select("id, nama_gedung, deskripsi_gedung, lokasi, jumlah_lantai")
        .order("id", { ascending: true }),
      supabase
        .from("fasilitas")
        .select("id, nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, id_gedung, lantai, foto_url")
        .order("id_gedung", { ascending: true })
        .order("lantai", { ascending: true }),
    ]);

    if (gedungResult.error) throw gedungResult.error;
    if (fasilitasResult.error) throw fasilitasResult.error;

    const result = {
      gedung: (gedungResult.data || []).map((g) => ({
        id: g.id,
        nama_gedung: g.nama_gedung || "",
        deskripsi_gedung: g.deskripsi_gedung || "",
        lokasi: g.lokasi || "",
        jumlah_lantai: g.jumlah_lantai || 1,
      })),
      fasilitas: (fasilitasResult.data || []).map((f) => ({
        id: f.id,
        nama_fasilitas: f.nama_fasilitas || "",
        deskripsi_fasilitas: f.deskripsi_fasilitas || "",
        tipe_fasilitas: f.tipe_fasilitas || "Lainnya",
        id_gedung: f.id_gedung,
        lantai: f.lantai || 1,
        foto_url: f.foto_url || "",
      })),
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching unity data:", error);
    return res.status(500).json({ error: error.message });
  }
}
