import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { UmamiApiClient } from "@umami/api-client";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);
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
    return res
      .status(429)
      .json(
        createResponse(
          { error: "Too many requests. Please try again later." },
          false,
        ),
      );
  }

  next();
};

app.use(rateLimit);

// Initialize Supabase client — use SUPABASE_* (non-VITE_ prefix) for server
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

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
    res
      .status(500)
      .json(createResponse({ error: "Failed to fetch rooms" }, false));
  }
});

// GET /api/rooms/:id - Get room by ID
app.get("/api/rooms/:id", async (req, res) => {
  try {
    const roomId = validateId(req.params.id);

    if (roomId === null) {
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
    res
      .status(500)
      .json(createResponse({ error: "Failed to fetch room" }, false));
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
    res
      .status(500)
      .json(createResponse({ error: "Failed to fetch buildings" }, false));
  }
});

// GET /api/unity/names - Get active building and facility object names for Unity
app.get("/api/unity/names", async (req, res) => {
  try {
    const { data: gedungData, error: gedungError } = await supabase
      .from("gedung")
      .select("unity_object_name")
      .not("unity_object_name", "is", null);

    if (gedungError) throw gedungError;

    const { data: fasilitasData, error: fasilitasError } = await supabase
      .from("fasilitas")
      .select("unity_object_name")
      .not("unity_object_name", "is", null);

    if (fasilitasError) throw fasilitasError;

    const combinedData = [...(gedungData || []), ...(fasilitasData || [])];
    const unityObjectNames = combinedData
      .map((item) => item.unity_object_name)
      .filter((name) => typeof name === "string" && name.trim().length > 0);

    res.json({ unityObjectNames });
  } catch (error) {
    console.error("Error fetching unity object names:", error);
    res.status(500).json({ error: "Failed to fetch unity object names" });
  }
});

// GET /api/unity/data - Get all building and facility data for Unity
app.get("/api/unity/data", async (req, res) => {
  try {
    const [gedungResult, fasilitasResult] = await Promise.all([
      supabase
        .from("gedung")
        .select("id, nama_gedung, deskripsi_gedung, lokasi, jumlah_lantai, unity_object_name")
        .order("id", { ascending: true }),
      supabase
        .from("fasilitas")
        .select("id, nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, id_gedung, lantai, foto_url, unity_object_name")
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
        unity_object_name: g.unity_object_name || "",
      })),
      fasilitas: (fasilitasResult.data || []).map((f) => ({
        id: f.id,
        nama_fasilitas: f.nama_fasilitas || "",
        deskripsi_fasilitas: f.deskripsi_fasilitas || "",
        tipe_fasilitas: f.tipe_fasilitas || "Lainnya",
        id_gedung: f.id_gedung,
        lantai: f.lantai || 1,
        foto_url: f.foto_url || "",
        unity_object_name: f.unity_object_name || "",
      })),
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching unity data:", error);
    res.status(500).json({ error: "Failed to fetch unity data" });
  }
});

// GET /api/buildings/:id/rooms - Get rooms by building ID
app.get("/api/buildings/:id/rooms", async (req, res) => {
  try {
    const buildingId = validateId(req.params.id);

    if (buildingId === null) {
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
    res
      .status(500)
      .json(createResponse({ error: "Failed to fetch rooms" }, false));
  }
});

// ============================================
// UMAMI ANALYTICS CLIENT
// ============================================
const UMAMI_API_URL = process.env.UMAMI_API_URL || "http://localhost:3000";
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;
const UMAMI_API_USER = process.env.UMAMI_API_USER || "admin";
const UMAMI_API_PASSWORD = process.env.UMAMI_API_PASSWORD || "umami";
const UMAMI_APP_SECRET =
  process.env.UMAMI_APP_SECRET || "replace-me-with-a-random-string";

let umamiClient = null;
let umamiAuthenticated = false;

/**
 * Initialize and authenticate the Umami API client.
 * Uses login-based auth with token caching.
 */
const getUmamiClient = async () => {
  if (umamiClient && umamiAuthenticated) {
    return umamiClient;
  }

  try {
    umamiClient = new UmamiApiClient({
      apiEndpoint: UMAMI_API_URL + "/api",
      secret: UMAMI_APP_SECRET,
    });

    const loginResult = await umamiClient.login(
      UMAMI_API_USER,
      UMAMI_API_PASSWORD,
    );

    if (loginResult.ok) {
      umamiAuthenticated = true;
      console.log("✅ Umami API client authenticated");
    } else {
      console.error(
        "❌ Umami login failed:",
        loginResult.error || loginResult.status,
      );
      umamiAuthenticated = false;
    }

    return umamiClient;
  } catch (error) {
    console.error("❌ Failed to connect to Umami:", error.message);
    umamiAuthenticated = false;
    return null;
  }
};

// Try to authenticate on startup (non-blocking)
if (UMAMI_WEBSITE_ID) {
  getUmamiClient().catch(() => {
    console.log(
      "⚠️  Umami not available at startup — will retry on first request",
    );
  });
} else {
  console.log("⚠️  UMAMI_WEBSITE_ID not set — analytics endpoints disabled");
}

// Helper: parse time range from query params
const parseTimeRange = (range = "7d") => {
  const now = Date.now();
  const days =
    range === "90d" ? 90 : range === "30d" ? 30 : range === "14d" ? 14 : 7;
  return {
    startAt: now - days * 24 * 60 * 60 * 1000,
    endAt: now,
    days,
  };
};

// ============================================
// ANALYTICS API ENDPOINTS
// ============================================

/**
 * GET /api/analytics/stats
 * Returns: total pageviews, visitors, visits, bounces, totaltime
 * Query: ?range=7d|14d|30d|90d
 */
app.get("/api/analytics/stats", async (req, res) => {
  try {
    if (!UMAMI_WEBSITE_ID) {
      return res
        .status(503)
        .json(createResponse({ error: "Analytics not configured" }, false));
    }

    const client = await getUmamiClient();
    if (!client) {
      return res
        .status(503)
        .json(
          createResponse({ error: "Analytics service unavailable" }, false),
        );
    }

    const { startAt, endAt } = parseTimeRange(req.query.range);
    const result = await client.getWebsiteStats(UMAMI_WEBSITE_ID, {
      startAt,
      endAt,
    });

    if (!result.ok) {
      return res
        .status(502)
        .json(
          createResponse({ error: "Failed to fetch stats from Umami" }, false),
        );
    }

    res.json(createResponse(result.data));
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    res
      .status(500)
      .json(createResponse({ error: "Internal server error" }, false));
  }
});

/**
 * GET /api/analytics/pageviews
 * Returns: time-series data for pageviews and sessions
 * Query: ?range=7d|14d|30d|90d&unit=day|hour
 */
app.get("/api/analytics/pageviews", async (req, res) => {
  try {
    if (!UMAMI_WEBSITE_ID) {
      return res
        .status(503)
        .json(createResponse({ error: "Analytics not configured" }, false));
    }

    const client = await getUmamiClient();
    if (!client) {
      return res
        .status(503)
        .json(
          createResponse({ error: "Analytics service unavailable" }, false),
        );
    }

    const { startAt, endAt } = parseTimeRange(req.query.range);
    const unit = req.query.unit || "day";
    const timezone = req.query.timezone || "Asia/Jakarta";

    const result = await client.getWebsitePageviews(UMAMI_WEBSITE_ID, {
      startAt,
      endAt,
      unit,
      timezone,
    });

    if (!result.ok) {
      return res
        .status(502)
        .json(
          createResponse(
            { error: "Failed to fetch pageviews from Umami" },
            false,
          ),
        );
    }

    res.json(createResponse(result.data));
  } catch (error) {
    console.error("Error fetching analytics pageviews:", error);
    res
      .status(500)
      .json(createResponse({ error: "Internal server error" }, false));
  }
});

/**
 * GET /api/analytics/active
 * Returns: number of active visitors in last 5 minutes
 */
app.get("/api/analytics/active", async (req, res) => {
  try {
    if (!UMAMI_WEBSITE_ID) {
      return res
        .status(503)
        .json(createResponse({ error: "Analytics not configured" }, false));
    }

    const client = await getUmamiClient();
    if (!client) {
      return res
        .status(503)
        .json(
          createResponse({ error: "Analytics service unavailable" }, false),
        );
    }

    const result = await client.getWebsiteActive(UMAMI_WEBSITE_ID);

    if (!result.ok) {
      return res
        .status(502)
        .json(
          createResponse(
            { error: "Failed to fetch active visitors from Umami" },
            false,
          ),
        );
    }

    res.json(createResponse({ visitors: result.data?.x || 0 }));
  } catch (error) {
    console.error("Error fetching active visitors:", error);
    res
      .status(500)
      .json(createResponse({ error: "Internal server error" }, false));
  }
});

/**
 * GET /api/analytics/metrics
 * Returns: breakdown by type (device, browser, os, country, url, referrer, event)
 * Query: ?type=device&range=7d|14d|30d|90d&limit=10
 */
app.get("/api/analytics/metrics", async (req, res) => {
  try {
    if (!UMAMI_WEBSITE_ID) {
      return res
        .status(503)
        .json(createResponse({ error: "Analytics not configured" }, false));
    }

    const client = await getUmamiClient();
    if (!client) {
      return res
        .status(503)
        .json(
          createResponse({ error: "Analytics service unavailable" }, false),
        );
    }

    const { startAt, endAt } = parseTimeRange(req.query.range);
    const type = req.query.type || "device";
    const limit = parseInt(req.query.limit) || 10;

    const allowedTypes = [
      "url",
      "referrer",
      "browser",
      "os",
      "device",
      "country",
      "region",
      "city",
      "event",
      "query",
      "title",
    ];
    if (!allowedTypes.includes(type)) {
      return res
        .status(400)
        .json(
          createResponse(
            { error: `Invalid type. Allowed: ${allowedTypes.join(", ")}` },
            false,
          ),
        );
    }

    const result = await client.getWebsiteMetrics(UMAMI_WEBSITE_ID, {
      startAt,
      endAt,
      type,
      limit,
    });

    if (!result.ok) {
      return res
        .status(502)
        .json(
          createResponse(
            { error: "Failed to fetch metrics from Umami" },
            false,
          ),
        );
    }

    res.json(createResponse(result.data));
  } catch (error) {
    console.error("Error fetching analytics metrics:", error);
    res
      .status(500)
      .json(createResponse({ error: "Internal server error" }, false));
  }
});

/**
 * GET /api/analytics/events
 * Returns: custom events data
 * Query: ?range=7d|14d|30d|90d
 */
app.get("/api/analytics/events", async (req, res) => {
  try {
    if (!UMAMI_WEBSITE_ID) {
      return res
        .status(503)
        .json(createResponse({ error: "Analytics not configured" }, false));
    }

    const client = await getUmamiClient();
    if (!client) {
      return res
        .status(503)
        .json(
          createResponse({ error: "Analytics service unavailable" }, false),
        );
    }

    const { startAt, endAt } = parseTimeRange(req.query.range);

    const result = await client.getWebsiteEvents(UMAMI_WEBSITE_ID, {
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(endAt).toISOString(),
    });

    if (!result.ok) {
      return res
        .status(502)
        .json(
          createResponse({ error: "Failed to fetch events from Umami" }, false),
        );
    }

    res.json(createResponse(result.data));
  } catch (error) {
    console.error("Error fetching analytics events:", error);
    res
      .status(500)
      .json(createResponse({ error: "Internal server error" }, false));
  }
});

/**
 * GET /api/analytics/summary
 * Returns: combined summary for public dashboard (no auth required)
 * Includes: stats + pageviews for the last 14 days
 * Query: ?range=14d
 */
app.get("/api/analytics/summary", async (req, res) => {
  try {
    if (!UMAMI_WEBSITE_ID) {
      return res
        .status(503)
        .json(createResponse({ error: "Analytics not configured" }, false));
    }

    const client = await getUmamiClient();
    if (!client) {
      return res
        .status(503)
        .json(
          createResponse({ error: "Analytics service unavailable" }, false),
        );
    }

    const { startAt, endAt, days } = parseTimeRange(req.query.range || "14d");
    const timezone = "Asia/Jakarta";

    // Fetch stats and pageviews in parallel
    const [statsResult, pageviewsResult, deviceResult] = await Promise.all([
      client.getWebsiteStats(UMAMI_WEBSITE_ID, { startAt, endAt }),
      client.getWebsitePageviews(UMAMI_WEBSITE_ID, {
        startAt,
        endAt,
        unit: "day",
        timezone,
      }),
      client.getWebsiteMetrics(UMAMI_WEBSITE_ID, {
        startAt,
        endAt,
        type: "device",
        limit: 10,
      }),
    ]);

    if (!statsResult.ok || !pageviewsResult.ok) {
      return res
        .status(502)
        .json(
          createResponse({ error: "Failed to fetch analytics summary" }, false),
        );
    }

    const stats = statsResult.data;
    const pageviews = pageviewsResult.data;

    // Calculate device percentages
    const deviceData = deviceResult.ok
      ? deviceResult.data?.data || deviceResult.data || []
      : [];
    const totalDeviceHits = deviceData.reduce((sum, d) => sum + (d.y || 0), 0);
    const deviceStats = {
      desktop: 0,
      mobile: 0,
      tablet: 0,
    };
    deviceData.forEach((d) => {
      const name = (d.x || "").toLowerCase();
      const pct =
        totalDeviceHits > 0 ? Math.round((d.y / totalDeviceHits) * 100) : 0;
      if (name === "desktop" || name === "laptop") deviceStats.desktop += pct;
      else if (name === "mobile") deviceStats.mobile += pct;
      else if (name === "tablet") deviceStats.tablet += pct;
    });

    // Calculate trend (compare current period vs previous period)
    const prevStartAt = startAt - (endAt - startAt);
    let trend = 0;
    try {
      const prevStats = await client.getWebsiteStats(UMAMI_WEBSITE_ID, {
        startAt: prevStartAt,
        endAt: startAt,
      });
      if (prevStats.ok && prevStats.data?.visitors?.value > 0) {
        trend =
          ((stats.visitors.value - prevStats.data.visitors.value) /
            prevStats.data.visitors.value) *
          100;
      }
    } catch {
      // Trend calculation is non-critical
    }

    // Build daily stats array from Umami pageviews data
    const dailyStats = (pageviews.pageviews || []).map((pv, index) => ({
      date: pv.t,
      pageViews: pv.y,
      visitors: pageviews.sessions?.[index]?.y || 0,
    }));

    const summary = {
      totalVisitors: stats.visitors?.value || 0,
      totalPageViews: stats.pageviews?.value || 0,
      totalVisits: stats.visits?.value || 0,
      bounces: stats.bounces?.value || 0,
      totalTime: stats.totaltime?.value || 0,
      // Calculate bounce rate
      bounceRate:
        stats.visits?.value > 0
          ? Math.round((stats.bounces.value / stats.visits.value) * 100)
          : 0,
      // Average visit duration in seconds
      avgVisitDuration:
        stats.visits?.value > 0
          ? Math.round(stats.totaltime.value / stats.visits.value)
          : 0,
      trend: Math.round(trend * 10) / 10,
      days,
      dailyStats,
      deviceStats,
    };

    res.json(createResponse(summary));
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    res
      .status(500)
      .json(createResponse({ error: "Internal server error" }, false));
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json(createResponse({ error: "Endpoint not found" }, false));
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
  console.log(`   - GET /api/analytics/stats`);
  console.log(`   - GET /api/analytics/pageviews`);
  console.log(`   - GET /api/analytics/active`);
  console.log(`   - GET /api/analytics/metrics`);
  console.log(`   - GET /api/analytics/events`);
  console.log(`   - GET /api/analytics/summary`);
});

export default app;
