import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { login, logout, verifySession, getAdminProfile } from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Data file paths
const DATA_FILE = path.join(__dirname, "analytics-data.json");
const DASHBOARD_DATA_FILE = path.join(
  __dirname,
  "..",
  "public",
  "data",
  "dashboard-data.json"
);

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

// Read dashboard data
const readDashboardData = () => {
  try {
    const data = fs.readFileSync(DASHBOARD_DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading dashboard data:", error);
    return null;
  }
};

// Write dashboard data
const writeDashboardData = (data) => {
  try {
    fs.writeFileSync(DASHBOARD_DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing dashboard data:", error);
    return false;
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

// Calculate bounce rate based on sessions with only 1 unique page
const calculateBounceRate = (data, days) => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recentPageviews = data.pageviews.filter((p) => p.timestamp > cutoff);

  if (recentPageviews.length === 0) return 0;

  // Group pageviews by sessionId
  const sessionPages = {};
  recentPageviews.forEach((p) => {
    const sessionId = p.sessionId || p.visitorId;
    if (!sessionPages[sessionId]) {
      sessionPages[sessionId] = new Set();
    }
    sessionPages[sessionId].add(p.page);
  });

  // Count sessions with only 1 unique page (bounce)
  let bounces = 0;
  Object.values(sessionPages).forEach((pages) => {
    if (pages.size === 1) {
      bounces++;
    }
  });

  const totalSessions = Object.keys(sessionPages).length;
  return totalSessions > 0 ? ((bounces / totalSessions) * 100).toFixed(1) : 0;
};

// Get daily stats for chart (last N days) with average duration
const getDailyStats = (data, days = 7) => {
  const dailyData = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const startOfDay = date.getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

    const dayVisitors = data.visitors.filter(
      (v) => v.timestamp >= startOfDay && v.timestamp < endOfDay
    );
    const dayPageviews = data.pageviews.filter(
      (p) => p.timestamp >= startOfDay && p.timestamp < endOfDay
    );

    dailyData.push({
      date: date.toISOString().split("T")[0],
      visitors: new Set(dayVisitors.map((v) => v.visitorId)).size,
      pageViews: dayPageviews.length,
    });
  }

  return dailyData;
};

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Analytics Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Track pageview - simplified with deduplication
app.post("/api/track/pageview", (req, res) => {
  try {
    const {
      visitorId,
      sessionId,
      page,
      referrer,
      deviceType,
      userAgent,
      screenWidth,
      screenHeight,
      language,
    } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: "visitorId is required" });
    }

    const data = readData();
    if (!data) {
      return res.status(500).json({ error: "Failed to read data" });
    }

    const timestamp = Date.now();
    const currentPage = page || "/";
    const currentSession = sessionId || visitorId;

    // Prevent duplicate pageviews (within 2 seconds)
    const recentDuplicate = data.pageviews.find(
      (p) =>
        (p.sessionId || p.visitorId) === currentSession &&
        p.page === currentPage &&
        timestamp - p.timestamp < 2000
    );

    if (recentDuplicate) {
      return res.json({ success: true, message: "Duplicate skipped" });
    }

    // Store visitor info (only first visit per session)
    const existingVisitor = data.visitors.find(
      (v) => (v.sessionId || v.visitorId) === currentSession
    );

    if (!existingVisitor) {
      data.visitors.push({
        visitorId,
        sessionId: currentSession,
        timestamp,
        page: currentPage,
        referrer: referrer || "",
        deviceType: deviceType || "desktop",
        userAgent: userAgent || "",
        screenWidth: screenWidth || 0,
        screenHeight: screenHeight || 0,
        language: language || "",
      });
    }

    // Store pageview
    data.pageviews.push({
      visitorId,
      sessionId: currentSession,
      timestamp,
      page: currentPage,
    });

    data.stats.totalVisitors = new Set(
      data.visitors.map((v) => v.visitorId)
    ).size;
    data.stats.totalPageviews = data.pageviews.length;

    // Cleanup old data (keep last 30 days)
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
    const { visitorId, sessionId, eventName, eventData } = req.body;

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
      sessionId: sessionId || "",
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
      dailyStats: getDailyStats(data, days),
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

    const days = parseInt(req.query.days) || 7;
    const dailyStats = getDailyStats(data, days);

    // Calculate device statistics
    const recentVisitors = data.visitors.filter(
      (v) => v.timestamp > Date.now() - days * 24 * 60 * 60 * 1000
    );

    const deviceCounts = {
      desktop: 0,
      mobile: 0,
      tablet: 0,
    };

    recentVisitors.forEach((v) => {
      const type = v.deviceType || "desktop";
      deviceCounts[type] = (deviceCounts[type] || 0) + 1;
    });

    const total = recentVisitors.length || 1;
    const deviceStats = {
      desktop: Math.round((deviceCounts.desktop / total) * 100),
      mobile: Math.round((deviceCounts.mobile / total) * 100),
      tablet: Math.round((deviceCounts.tablet / total) * 100),
    };

    res.json({
      success: true,
      dailyStats,
      deviceStats,
      totalVisitors: getUniqueVisitors(data, days),
      totalPageViews: getPageviews(data, days),
      bounceRate: parseFloat(calculateBounceRate(data, days)),
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

// ============================================
// AUTH ENDPOINTS
// ============================================

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi",
      });
    }

    const result = await login(username, password);

    if (result.success) {
      // Set HTTP-only cookie
      res.cookie("auth_token", result.token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.json({
        success: true,
        message: result.message,
        admin: result.admin,
      });
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

// Logout endpoint
app.post("/api/auth/logout", async (req, res) => {
  try {
    const token =
      req.cookies.auth_token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      await logout(token);
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

// Verify session endpoint
app.get("/api/auth/verify", async (req, res) => {
  try {
    const token =
      req.cookies.auth_token ||
      req.headers.authorization?.replace("Bearer ", "");

    const result = await verifySession(token);

    if (result.valid) {
      res.json({
        valid: true,
        admin: result.admin,
      });
    } else {
      res.status(401).json({
        valid: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({
      valid: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Get admin profile endpoint
app.get("/api/auth/profile", async (req, res) => {
  try {
    const token =
      req.cookies.auth_token ||
      req.headers.authorization?.replace("Bearer ", "");

    const sessionCheck = await verifySession(token);

    if (!sessionCheck.valid) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const profile = await getAdminProfile(sessionCheck.admin.id);

    if (profile) {
      res.json({
        success: true,
        admin: profile,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Auth middleware for protected routes
const authenticateAdmin = async (req, res, next) => {
  try {
    const token =
      req.cookies.auth_token ||
      req.headers.authorization?.replace("Bearer ", "");

    const result = await verifySession(token);

    if (result.valid) {
      req.admin = result.admin;
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

// Protected route example
app.get("/api/admin/dashboard", authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to admin dashboard",
    admin: req.admin,
  });
});

// ============================================
// DASHBOARD DATA CRUD ENDPOINTS
// ============================================

// Get dashboard data
app.get("/api/dashboard/data", (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) {
      return res.status(500).json({ error: "Failed to read dashboard data" });
    }
    res.json(data);
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Save entire dashboard data (for bulk updates)
app.post("/api/dashboard/data", authenticateAdmin, (req, res) => {
  try {
    const newData = req.body;
    newData.lastUpdated = new Date().toISOString();

    const success = writeDashboardData(newData);

    if (success) {
      res.json({ success: true, message: "Data berhasil disimpan" });
    } else {
      res.status(500).json({ success: false, message: "Gagal menyimpan data" });
    }
  } catch (error) {
    console.error("Error saving dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== PROFESSORS CRUD =====

// Create professor
app.post("/api/professors", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) {
      return res.status(500).json({ error: "Failed to read data" });
    }

    const newProfessor = {
      id: `prof-${Date.now()}`,
      ...req.body,
    };

    data.professors.push(newProfessor);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: newProfessor });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error creating professor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update professor
app.put("/api/professors/:id", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) {
      return res.status(500).json({ error: "Failed to read data" });
    }

    const index = data.professors.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Professor not found" });
    }

    data.professors[index] = {
      ...data.professors[index],
      ...req.body,
      id: req.params.id, // Preserve ID
    };
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: data.professors[index] });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error updating professor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete professor
app.delete("/api/professors/:id", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) {
      return res.status(500).json({ error: "Failed to read data" });
    }

    const index = data.professors.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Professor not found" });
    }

    data.professors.splice(index, 1);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, message: "Professor deleted" });
    } else {
      res.status(500).json({ success: false, message: "Failed to delete" });
    }
  } catch (error) {
    console.error("Error deleting professor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== ACCREDITATIONS CRUD =====

app.post("/api/accreditations", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const newItem = {
      id: `acc-${Date.now()}`,
      ...req.body,
    };

    data.accreditations.push(newItem);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: newItem });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error creating accreditation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/accreditations/:id", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const index = data.accreditations.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    data.accreditations[index] = {
      ...data.accreditations[index],
      ...req.body,
      id: req.params.id,
    };
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: data.accreditations[index] });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error updating accreditation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/accreditations/:id", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const index = data.accreditations.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    data.accreditations.splice(index, 1);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, message: "Deleted" });
    } else {
      res.status(500).json({ success: false, message: "Failed to delete" });
    }
  } catch (error) {
    console.error("Error deleting accreditation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== STUDENTS CRUD =====

app.post("/api/students", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const newItem = {
      facultyId: `fac-${Date.now()}`,
      ...req.body,
    };

    data.students.push(newItem);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: newItem });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error creating student data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/students/:facultyId", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const index = data.students.findIndex(
      (p) => p.facultyId === req.params.facultyId
    );
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    data.students[index] = {
      ...data.students[index],
      ...req.body,
      facultyId: req.params.facultyId,
    };
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: data.students[index] });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error updating student data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/students/:facultyId", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const index = data.students.findIndex(
      (p) => p.facultyId === req.params.facultyId
    );
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    data.students.splice(index, 1);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, message: "Deleted" });
    } else {
      res.status(500).json({ success: false, message: "Failed to delete" });
    }
  } catch (error) {
    console.error("Error deleting student data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== PROGRAMS CRUD =====

app.post("/api/programs", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const newItem = {
      id: `prog-${Date.now()}`,
      ...req.body,
    };

    data.programs.push(newItem);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: newItem });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error creating program:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/programs/:id", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const index = data.programs.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    data.programs[index] = {
      ...data.programs[index],
      ...req.body,
      id: req.params.id,
    };
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: data.programs[index] });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error updating program:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/programs/:id", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const index = data.programs.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    data.programs.splice(index, 1);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, message: "Deleted" });
    } else {
      res.status(500).json({ success: false, message: "Failed to delete" });
    }
  } catch (error) {
    console.error("Error deleting program:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== DEPARTMENTS CRUD =====

app.post("/api/departments", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const newItem = {
      id: `dept-${Date.now()}`,
      ...req.body,
    };

    data.departments.push(newItem);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: newItem });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/departments/:id", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const index = data.departments.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    data.departments[index] = {
      ...data.departments[index],
      ...req.body,
      id: req.params.id,
    };
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: data.departments[index] });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/departments/:id", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const index = data.departments.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    data.departments.splice(index, 1);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, message: "Deleted" });
    } else {
      res.status(500).json({ success: false, message: "Failed to delete" });
    }
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== ASSETS CRUD =====
// Assets are more complex with categories and details

app.post("/api/assets", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const newItem = {
      id: `asset-cat-${Date.now()}`,
      ...req.body,
      details: req.body.details || [],
    };

    data.assets.push(newItem);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: newItem });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error creating asset category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/assets/:id", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const index = data.assets.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    data.assets[index] = {
      ...data.assets[index],
      ...req.body,
      id: req.params.id,
    };
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: data.assets[index] });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error updating asset category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/assets/:id", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const index = data.assets.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    data.assets.splice(index, 1);
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, message: "Deleted" });
    } else {
      res.status(500).json({ success: false, message: "Failed to delete" });
    }
  } catch (error) {
    console.error("Error deleting asset category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add asset detail to category
app.post("/api/assets/:categoryId/details", authenticateAdmin, (req, res) => {
  try {
    const data = readDashboardData();
    if (!data) return res.status(500).json({ error: "Failed to read data" });

    const categoryIndex = data.assets.findIndex(
      (p) => p.id === req.params.categoryId
    );
    if (categoryIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const newDetail = {
      id: `asset-detail-${Date.now()}`,
      ...req.body,
    };

    data.assets[categoryIndex].details.push(newDetail);
    data.assets[categoryIndex].count =
      data.assets[categoryIndex].details.length;
    data.lastUpdated = new Date().toISOString();

    if (writeDashboardData(data)) {
      res.json({ success: true, data: newDetail });
    } else {
      res.status(500).json({ success: false, message: "Failed to save" });
    }
  } catch (error) {
    console.error("Error adding asset detail:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update asset detail
app.put(
  "/api/assets/:categoryId/details/:detailId",
  authenticateAdmin,
  (req, res) => {
    try {
      const data = readDashboardData();
      if (!data) return res.status(500).json({ error: "Failed to read data" });

      const categoryIndex = data.assets.findIndex(
        (p) => p.id === req.params.categoryId
      );
      if (categoryIndex === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      const detailIndex = data.assets[categoryIndex].details.findIndex(
        (d) => d.id === req.params.detailId
      );
      if (detailIndex === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Detail not found" });
      }

      data.assets[categoryIndex].details[detailIndex] = {
        ...data.assets[categoryIndex].details[detailIndex],
        ...req.body,
        id: req.params.detailId,
      };
      data.lastUpdated = new Date().toISOString();

      if (writeDashboardData(data)) {
        res.json({
          success: true,
          data: data.assets[categoryIndex].details[detailIndex],
        });
      } else {
        res.status(500).json({ success: false, message: "Failed to save" });
      }
    } catch (error) {
      console.error("Error updating asset detail:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete asset detail
app.delete(
  "/api/assets/:categoryId/details/:detailId",
  authenticateAdmin,
  (req, res) => {
    try {
      const data = readDashboardData();
      if (!data) return res.status(500).json({ error: "Failed to read data" });

      const categoryIndex = data.assets.findIndex(
        (p) => p.id === req.params.categoryId
      );
      if (categoryIndex === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      const detailIndex = data.assets[categoryIndex].details.findIndex(
        (d) => d.id === req.params.detailId
      );
      if (detailIndex === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Detail not found" });
      }

      data.assets[categoryIndex].details.splice(detailIndex, 1);
      data.assets[categoryIndex].count =
        data.assets[categoryIndex].details.length;
      data.lastUpdated = new Date().toISOString();

      if (writeDashboardData(data)) {
        res.json({ success: true, message: "Deleted" });
      } else {
        res.status(500).json({ success: false, message: "Failed to delete" });
      }
    } catch (error) {
      console.error("Error deleting asset detail:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

initData();

app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log("📊 UPNVJ Analytics & Auth Server");
  console.log("=".repeat(60));
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
  console.log(`📈 Stats: http://localhost:${PORT}/api/stats`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/*`);
  console.log("=".repeat(60));
  console.log("🔑 Default Login: admin / admin123");
  console.log("=".repeat(60));
});
