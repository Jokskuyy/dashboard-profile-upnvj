// GET /api/buildings — Get all buildings with rooms
import { getSupabase, setCors, createResponse } from "./_shared.js";

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json(createResponse({ error: "Method not allowed" }, false));

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("gedung").select(`
      id, nama_gedung, deskripsi_gedung, lokasi,
      fasilitas ( id, nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, id_gedung )
    `);
    if (error) throw error;

    const buildings = data.map((b) => ({
      id: b.id,
      name: b.nama_gedung,
      description: b.deskripsi_gedung || "",
      location: b.lokasi || "",
      rooms: (b.fasilitas || []).map((r) => ({
        id: r.id,
        name: r.nama_fasilitas,
        description: r.deskripsi_fasilitas || "",
        building: b.nama_gedung,
        buildingId: r.id_gedung,
        type: r.tipe_fasilitas || "Lainnya",
      })),
    }));

    return res.status(200).json(createResponse(buildings));
  } catch (error) {
    console.error("Error fetching buildings:", error);
    return res.status(500).json(createResponse({ error: error.message }, false));
  }
}
