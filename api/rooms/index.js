// GET /api/rooms — Get all rooms
import { getSupabase, setCors, createResponse } from "./_shared.js";

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json(createResponse({ error: "Method not allowed" }, false));

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("fasilitas").select(`
      id, nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, id_gedung,
      gedung ( nama_gedung, lokasi )
    `);
    if (error) throw error;

    const rooms = data.map((room) => ({
      id: room.id,
      name: room.nama_fasilitas,
      description: room.deskripsi_fasilitas || "",
      building: room.gedung?.nama_gedung || "Unknown",
      buildingId: room.id_gedung,
      type: room.tipe_fasilitas || "Lainnya",
      location: room.gedung?.lokasi || "",
    }));

    return res.status(200).json(createResponse(rooms));
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json(createResponse({ error: error.message }, false));
  }
}
