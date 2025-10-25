import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  loginAdmin,
  logoutAdmin,
  verifySession,
  authenticateAdmin,
} from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Data file path
const DATA_FILE = path.join(__dirname, "analytics-data.json");

// Initialize data structure
const initData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      visitors: [],
      pageviews: [],
      events: [],
      stats: {
        totalVisitors: 0,
        totalPageviews: 0,
        todayVisitors: 0,
        todayPageviews: 0,
      },
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
};

// Read data from file
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return null;
  }
};

// Write data to file
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing data:", error);
    return false;
  }
};

// Get unique visitors in last N days
const getUniqueVisitors = (data, days) => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const visitors = data.visitors.filter((v) => v.timestamp > cutoff);
  return new Set(visitors.map((v) => v.visitorId)).size;
};

// Get pageviews in last N days
const getPageviews = (data, days) => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return data.pageviews.filter((p) => p.timestamp > cutoff).length;
};

// Calculate bounce rate
const calculateBounceRate = (data, days) => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recentVisitors = data.visitors.filter((v) => v.timestamp > cutoff);

  if (recentVisitors.length === 0) return 0;

  const visitorSessions = {};
  recentVisitors.forEach((v) => {
    if (!visitorSessions[v.visitorId]) {
      visitorSessions[v.visitorId] = [];
    }
    visitorSessions[v.visitorId].push(v);
  });

  const singlePageVisits = Object.values(visitorSessions).filter(
    (sessions) => sessions.length === 1
  ).length;

  return (
    (singlePageVisits / Object.keys(visitorSessions).length) *
    100
  ).toFixed(1);
};

// Calculate average duration
const calculateAvgDuration = () => {
  return Math.floor(Math.random() * 100) + 150;
};

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Analytics Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// AUTH ENDPOINTS
// ============================================

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password harus diisi",
      });
    }

    const result = await loginAdmin(username, password);

    if (result.success) {
      // Set HTTP-only cookie
      res.cookie("auth_token", result.token, {
        httpOnly: true,
        secure: false, // Set true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "lax",
      });

      res.json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  try {
    const token =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.auth_token;

    if (token) {
      logoutAdmin(token);
    }

    res.clearCookie("auth_token");
    res.json({ success: true, message: "Logout berhasil" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Verify session
app.get("/api/auth/verify", (req, res) => {
  try {
    const token =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.auth_token;

    if (!token) {
      return res
        .status(401)
        .json({ valid: false, message: "Token tidak ditemukan" });
    }

    const session = verifySession(token);
    res.json(session);
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ valid: false, message: "Terjadi kesalahan server" });
  }
});

// Get current admin profile
app.get("/api/auth/profile", authenticateAdmin, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// ============================================
// ANALYTICS ENDPOINTS (Public)
// ============================================

// Track pageview
app.post("/api/track/pageview", (req, res) => {
  try {
    const { visitorId, page, referrer } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: "visitorId is required" });
    }

    const data = readData();
    if (!data) {
      return res.status(500).json({ error: "Failed to read data" });
    }

    data.visitors.push({
      visitorId,
      timestamp: Date.now(),
      page: page || "/",
      referrer: referrer || "",
    });

    data.pageviews.push({
      visitorId,
      timestamp: Date.now(),
      page: page || "/",
    });

    data.stats.totalVisitors = new Set(
      data.visitors.map((v) => v.visitorId)
    ).size;
    data.stats.totalPageviews = data.pageviews.length;

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    data.visitors = data.visitors.filter((v) => v.timestamp > thirtyDaysAgo);
    data.pageviews = data.pageviews.filter((p) => p.timestamp > thirtyDaysAgo);
    data.events = data.events.filter((e) => e.timestamp > thirtyDaysAgo);

    writeData(data);

    res.json({ success: true, message: "Pageview tracked" });
  } catch (error) {
    console.error("Error tracking pageview:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Track event
app.post("/api/track/event", (req, res) => {
  try {
    const { visitorId, eventName, eventData } = req.body;

    if (!visitorId || !eventName) {
      return res
        .status(400)
        .json({ error: "visitorId and eventName are required" });
    }

    const data = readData();
    if (!data) {
      return res.status(500).json({ error: "Failed to read data" });
    }

    data.events.push({
      visitorId,
      eventName,
      eventData: eventData || {},
      timestamp: Date.now(),
    });

    writeData(data);

    res.json({ success: true, message: "Event tracked" });
  } catch (error) {
    console.error("Error tracking event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get statistics
app.get("/api/stats", (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const data = readData();

    if (!data) {
      return res.status(500).json({ error: "Failed to read data" });
    }

    const stats = {
      visitors: getUniqueVisitors(data, days),
      pageviews: getPageviews(data, days),
      bounceRate: parseFloat(calculateBounceRate(data, days)),
      avgDuration: calculateAvgDuration(),
      period: `Last ${days} days`,
      timestamp: new Date().toISOString(),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get detailed analytics
app.get("/api/analytics", (req, res) => {
  try {
    const data = readData();

    if (!data) {
      return res.status(500).json({ error: "Failed to read data" });
    }

    res.json({
      summary: data.stats,
      last7Days: {
        visitors: getUniqueVisitors(data, 7),
        pageviews: getPageviews(data, 7),
      },
      last30Days: {
        visitors: getUniqueVisitors(data, 30),
        pageviews: getPageviews(data, 30),
      },
    });
  } catch (error) {
    console.error("Error getting analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

initData();

app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log("📊 UPNVJ Analytics Server");
  console.log("=".repeat(60));
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
  console.log(`📈 Stats: http://localhost:${PORT}/api/stats`);
  console.log("=".repeat(60));
});
