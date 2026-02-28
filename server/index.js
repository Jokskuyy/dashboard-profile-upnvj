import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // max requests per window

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - record.start > RATE_LIMIT_WINDOW) {
    record.count = 1;
    record.start = now;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);

  if (record.count > RATE_LIMIT_MAX) {
    return res.status(429).json(createResponse({ error: 'Too many requests. Please try again later.' }, false));
  }

  next();
};

app.use(rateLimit);

// Initialize Supabase client — use SUPABASE_* (non-VITE_ prefix) for server
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
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

// Input validation helper
const validateId = (id) => {
  const parsed = parseInt(id);
  if (isNaN(parsed) || parsed <= 0 || parsed > 2147483647) {
    return null;
  }
  return parsed;
};

// ============================================
// API ENDPOINTS
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json(createResponse({ status: 'OK', message: 'Server is running' }));
});

// GET /api/rooms - Get all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('fasilitas')
      .select(`
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
      description: room.deskripsi_fasilitas || '',
      building: room.gedung?.nama_gedung || 'Unknown',
      buildingId: room.id_gedung,
      type: room.tipe_fasilitas || 'Lainnya',
      location: room.gedung?.lokasi || '',
    }));

    res.json(createResponse(rooms));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json(createResponse({ error: 'Failed to fetch rooms' }, false));
  }
});

// GET /api/rooms/:id - Get room by ID
app.get('/api/rooms/:id', async (req, res) => {
  try {
    const roomId = validateId(req.params.id);

    if (roomId === null) {
      return res.status(400).json(createResponse({ error: 'Invalid room ID' }, false));
    }

    const { data, error } = await supabase
      .from('fasilitas')
      .select(`
        id,
        nama_fasilitas,
        deskripsi_fasilitas,
        tipe_fasilitas,
        id_gedung,
        gedung (
          nama_gedung,
          lokasi
        )
      `)
      .eq('id', roomId)
      .single();

    if (error) throw error;

    const room = {
      id: data.id,
      name: data.nama_fasilitas,
      description: data.deskripsi_fasilitas || '',
      building: data.gedung?.nama_gedung || 'Unknown',
      buildingId: data.id_gedung,
      type: data.tipe_fasilitas || 'Lainnya',
      location: data.gedung?.lokasi || '',
    };

    res.json(createResponse(room));
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json(createResponse({ error: 'Failed to fetch room' }, false));
  }
});

// GET /api/buildings - Get all buildings with rooms
app.get('/api/buildings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gedung')
      .select(`
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
      description: building.deskripsi_gedung || '',
      location: building.lokasi || '',
      rooms: (building.fasilitas || []).map((room) => ({
        id: room.id,
        name: room.nama_fasilitas,
        description: room.deskripsi_fasilitas || '',
        building: building.nama_gedung,
        buildingId: room.id_gedung,
        type: room.tipe_fasilitas || 'Lainnya',
      })),
    }));

    res.json(createResponse(buildings));
  } catch (error) {
    console.error('Error fetching buildings:', error);
    res.status(500).json(createResponse({ error: 'Failed to fetch buildings' }, false));
  }
});

// GET /api/buildings/:id/rooms - Get rooms by building ID
app.get('/api/buildings/:id/rooms', async (req, res) => {
  try {
    const buildingId = validateId(req.params.id);

    if (buildingId === null) {
      return res.status(400).json(createResponse({ error: 'Invalid building ID' }, false));
    }

    const { data, error } = await supabase
      .from('fasilitas')
      .select(`
        id,
        nama_fasilitas,
        deskripsi_fasilitas,
        tipe_fasilitas,
        id_gedung,
        gedung (
          nama_gedung,
          lokasi
        )
      `)
      .eq('id_gedung', buildingId);

    if (error) throw error;

    const rooms = data.map((room) => ({
      id: room.id,
      name: room.nama_fasilitas,
      description: room.deskripsi_fasilitas || '',
      building: room.gedung?.nama_gedung || 'Unknown',
      buildingId: room.id_gedung,
      type: room.tipe_fasilitas || 'Lainnya',
      location: room.gedung?.lokasi || '',
    }));

    res.json(createResponse(rooms));
  } catch (error) {
    console.error('Error fetching rooms by building:', error);
    res.status(500).json(createResponse({ error: 'Failed to fetch rooms' }, false));
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json(createResponse({ error: 'Endpoint not found' }, false));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📍 API endpoints:`);
  console.log(`   - GET /api/health`);
  console.log(`   - GET /api/rooms`);
  console.log(`   - GET /api/rooms/:id`);
  console.log(`   - GET /api/buildings`);
  console.log(`   - GET /api/buildings/:id/rooms`);
});

export default app;
