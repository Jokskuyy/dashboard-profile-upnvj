// ============================================
// Vercel Serverless Function — API Handler
// ============================================
// File ini menghandle semua /api/* routes di Vercel
// Tidak perlu Express — pakai native Vercel serverless handler
//
// Endpoints:
//   GET /api/health
//   GET /api/rooms
//   GET /api/rooms/[id]
//   GET /api/buildings
//   GET /api/buildings/[id]/rooms
//   GET /api/unity/data
// ============================================

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials");
  }
  return createClient(supabaseUrl, supabaseKey);
}

// CORS headers — agar Unity Editor bisa fetch dari localhost
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(res, data, status = 200) {
  return res.status(status).json(data);
}

function createResponse(data, success = true) {
  return { success, data, timestamp: new Date().toISOString() };
}

// ============================================
// Route handlers
// ============================================

async function handleHealth(req, res) {
  return json(
    res,
    createResponse({ status: "OK", message: "Server is running" }),
  );
}

async function handleRooms(req, res) {
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
  return json(res, createResponse(rooms));
}

async function handleRoomById(req, res, roomId) {
  const supabase = getSupabase();
  const id = parseInt(roomId);
  if (isNaN(id)) {
    return json(res, createResponse({ error: "Invalid room ID" }, false), 400);
  }

  const { data, error } = await supabase
    .from("fasilitas")
    .select(
      `id, nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, id_gedung, gedung ( nama_gedung, lokasi )`,
    )
    .eq("id", id)
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
  return json(res, createResponse(room));
}

async function handleBuildings(req, res) {
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
  return json(res, createResponse(buildings));
}

async function handleBuildingRooms(req, res, buildingId) {
  const supabase = getSupabase();
  const id = parseInt(buildingId);
  if (isNaN(id)) {
    return json(
      res,
      createResponse({ error: "Invalid building ID" }, false),
      400,
    );
  }

  const { data, error } = await supabase
    .from("fasilitas")
    .select(
      `id, nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, id_gedung, gedung ( nama_gedung, lokasi )`,
    )
    .eq("id_gedung", id);
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
  return json(res, createResponse(rooms));
}

async function handleUnityData(req, res) {
  const supabase = getSupabase();

  const [gedungResult, fasilitasResult] = await Promise.all([
    supabase
      .from("gedung")
      .select("id, nama_gedung, deskripsi_gedung, lokasi, jumlah_lantai")
      .order("id", { ascending: true }),
    supabase
      .from("fasilitas")
      .select(
        "id, nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, id_gedung, lantai, foto_url",
      )
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

  return json(res, result);
}

// ============================================
// Main handler — route matching
// ============================================

export default async function handler(req, res) {
  // CORS
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== "GET") {
    return json(
      res,
      createResponse({ error: "Method not allowed" }, false),
      405,
    );
  }

  try {
    const { url } = req;
    // Remove query string for matching
    const path = url.split("?")[0];

    // Route matching
    if (path === "/api/health") {
      return await handleHealth(req, res);
    }

    if (path === "/api/unity/data") {
      return await handleUnityData(req, res);
    }

    if (path === "/api/rooms") {
      return await handleRooms(req, res);
    }

    // /api/rooms/123
    const roomMatch = path.match(/^\/api\/rooms\/(\d+)$/);
    if (roomMatch) {
      return await handleRoomById(req, res, roomMatch[1]);
    }

    // /api/buildings/123/rooms
    const buildingRoomsMatch = path.match(/^\/api\/buildings\/(\d+)\/rooms$/);
    if (buildingRoomsMatch) {
      return await handleBuildingRooms(req, res, buildingRoomsMatch[1]);
    }

    if (path === "/api/buildings") {
      return await handleBuildings(req, res);
    }

    return json(
      res,
      createResponse({ error: "Endpoint not found" }, false),
      404,
    );
  } catch (error) {
    console.error("API Error:", error);
    return json(res, createResponse({ error: error.message }, false), 500);
  }
}
