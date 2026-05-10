// GET /api/rooms/[id] — Get room by ID
import { getSupabase, setCors, createResponse } from "../_shared.js";

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json(createResponse({ error: "Method not allowed" }, false));

  try {
    const { id } = req.query;
    const roomId = parseInt(id);
    if (isNaN(roomId)) {
      return res.status(400).json(createResponse({ error: "Invalid room ID" }, false));
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("fasilitas")
      .select(`id, nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, id_gedung, gedung ( nama_gedung, lokasi )`)
      .eq("id", roomId)
      .single();
    if (error) throw error;

    const room = {
      id: data.id,
      name: data.nama_fasilitas,
      description: data.deskripsi_fasilitas || "",
      building: data.gedung?.nama_gedung || "Unknown",
      buildingId: data.id_gedung,
      type: data.tipe_fasilitas || "Lainnya",
      location: data.gedung?.lokasi || "",
    };

    return res.status(200).json(createResponse(room));
  } catch (error) {
    console.error("Error fetching room:", error);
    return res.status(500).json(createResponse({ error: error.message }, false));
  }
}
