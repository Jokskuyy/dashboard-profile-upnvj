import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from root .env
dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function for response
const createResponse = (data, success = true) => {
  return {
    success,
    data,
    timestamp: new Date().toISOString(),
  };
};

// ============================================
// API ENDPOINTS
// ============================================

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json(createResponse({ status: "OK", message: "Server is running" }));
});

// GET /api/rooms - Get all rooms
app.get("/api/rooms", async (req, res) => {
  try {
    const { data, error } = await supabase.from("fasilitas").select(`
        id,
        nama_fasilitas,
        deskripsi_fasilitas,
        tipe_fasilitas,
        id_gedung,
        gedung (
          nama_gedung,
          lokasi
        )
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

    res.json(createResponse(rooms));
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json(createResponse({ error: error.message }, false));
  }
});

// GET /api/rooms/:id - Get room by ID
app.get("/api/rooms/:id", async (req, res) => {
  try {
    const roomId = parseInt(req.params.id);

    if (isNaN(roomId)) {
      return res
        .status(400)
        .json(createResponse({ error: "Invalid room ID" }, false));
    }

    const { data, error } = await supabase
      .from("fasilitas")
      .select(
        `
        id,
        nama_fasilitas,
        deskripsi_fasilitas,
        tipe_fasilitas,
        id_gedung,
        gedung (
          nama_gedung,
          lokasi
        )
      `,
      )
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

    res.json(createResponse(room));
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json(createResponse({ error: error.message }, false));
  }
});

// GET /api/buildings - Get all buildings with rooms
app.get("/api/buildings", async (req, res) => {
  try {
    const { data, error } = await supabase.from("gedung").select(`
        id,
        nama_gedung,
        deskripsi_gedung,
        lokasi,
        fasilitas (
          id,
          nama_fasilitas,
          deskripsi_fasilitas,
          tipe_fasilitas,
          id_gedung
        )
      `);

    if (error) throw error;

    const buildings = data.map((building) => ({
      id: building.id,
      name: building.nama_gedung,
      description: building.deskripsi_gedung || "",
      location: building.lokasi || "",
      rooms: (building.fasilitas || []).map((room) => ({
        id: room.id,
        name: room.nama_fasilitas,
        description: room.deskripsi_fasilitas || "",
        building: building.nama_gedung,
        buildingId: room.id_gedung,
        type: room.tipe_fasilitas || "Lainnya",
      })),
    }));

    res.json(createResponse(buildings));
  } catch (error) {
    console.error("Error fetching buildings:", error);
    res.status(500).json(createResponse({ error: error.message }, false));
  }
});

// GET /api/buildings/:id/rooms - Get rooms by building ID
app.get("/api/buildings/:id/rooms", async (req, res) => {
  try {
    const buildingId = parseInt(req.params.id);

    if (isNaN(buildingId)) {
      return res
        .status(400)
        .json(createResponse({ error: "Invalid building ID" }, false));
    }

    const { data, error } = await supabase
      .from("fasilitas")
      .select(
        `
        id,
        nama_fasilitas,
        deskripsi_fasilitas,
        tipe_fasilitas,
        id_gedung,
        gedung (
          nama_gedung,
          lokasi
        )
      `,
      )
      .eq("id_gedung", buildingId);

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

    res.json(createResponse(rooms));
  } catch (error) {
    console.error("Error fetching rooms by building:", error);
    res.status(500).json(createResponse({ error: error.message }, false));
  }
});

// GET /api/unity/data - Data khusus untuk Unity (format mentah Supabase)
// Unity fetch langsung ke endpoint ini via UnityWebRequest
app.get("/api/unity/data", async (req, res) => {
  try {
    // Fetch gedung
    const { data: gedungData, error: gedungError } = await supabase
      .from("gedung")
      .select("id, nama_gedung, deskripsi_gedung, lokasi, jumlah_lantai")
      .order("id", { ascending: true });

    if (gedungError) throw gedungError;

    // Fetch fasilitas (tanpa color)
    const { data: fasilitasData, error: fasilitasError } = await supabase
      .from("fasilitas")
      .select(
        "id, nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, id_gedung, lantai, foto_url",
      )
      .order("id_gedung", { ascending: true })
      .order("lantai", { ascending: true });

    if (fasilitasError) throw fasilitasError;

    // Format langsung match dengan C# data classes di Unity
    const result = {
      gedung: (gedungData || []).map((g) => ({
        id: g.id,
        nama_gedung: g.nama_gedung || "",
        deskripsi_gedung: g.deskripsi_gedung || "",
        lokasi: g.lokasi || "",
        jumlah_lantai: g.jumlah_lantai || 1,
      })),
      fasilitas: (fasilitasData || []).map((f) => ({
        id: f.id,
        nama_fasilitas: f.nama_fasilitas || "",
        deskripsi_fasilitas: f.deskripsi_fasilitas || "",
        tipe_fasilitas: f.tipe_fasilitas || "Lainnya",
        id_gedung: f.id_gedung,
        lantai: f.lantai || 1,
        foto_url: f.foto_url || "",
      })),
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching unity data:", error);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json(createResponse({ error: "Endpoint not found" }, false));
});
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📍 API endpoints:`);
  console.log(`   - GET /api/health`);
  console.log(`   - GET /api/rooms`);
  console.log(`   - GET /api/rooms/:id`);
  console.log(`   - GET /api/buildings`);
  console.log(`   - GET /api/buildings/:id/rooms`);
  console.log(`   - GET /api/unity/data          (Unity integration)`);
});

export default app;
