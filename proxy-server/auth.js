import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_DATA_FILE = path.join(__dirname, "admin-data.json");
const JWT_SECRET = "upnvj-dashboard-secret-key-2025"; // In production, use env variable
const JWT_EXPIRES_IN = "24h";

// Read admin data
export const readAdminData = () => {
  try {
    const data = fs.readFileSync(ADMIN_DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading admin data:", error);
    return { admins: [], sessions: [] };
  }
};

// Write admin data
export const writeAdminData = (data) => {
  try {
    fs.writeFileSync(ADMIN_DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing admin data:", error);
    return false;
  }
};

// Hash password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate JWT token
export const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Login admin
export const loginAdmin = async (username, password) => {
  const data = readAdminData();
  const admin = data.admins.find((a) => a.username === username);

  if (!admin) {
    return { success: false, message: "Username tidak ditemukan" };
  }

  const isValidPassword = await comparePassword(password, admin.password);

  if (!isValidPassword) {
    return { success: false, message: "Password salah" };
  }

  // Update last login
  admin.lastLogin = new Date().toISOString();
  writeAdminData(data);

  // Generate token
  const token = generateToken(admin);

  // Create session
  const session = {
    id: `session_${Date.now()}`,
    adminId: admin.id,
    token,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  data.sessions.push(session);
  writeAdminData(data);

  return {
    success: true,
    message: "Login berhasil",
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    },
  };
};

// Logout admin
export const logoutAdmin = (token) => {
  const data = readAdminData();
  data.sessions = data.sessions.filter((s) => s.token !== token);
  writeAdminData(data);
  return { success: true, message: "Logout berhasil" };
};

// Verify session
export const verifySession = (token) => {
  const decoded = verifyToken(token);
  if (!decoded) {
    return { valid: false, message: "Token tidak valid" };
  }

  const data = readAdminData();
  const session = data.sessions.find((s) => s.token === token);

  if (!session) {
    return { valid: false, message: "Session tidak ditemukan" };
  }

  // Check if session expired
  if (new Date(session.expiresAt) < new Date()) {
    return { valid: false, message: "Session expired" };
  }

  const admin = data.admins.find((a) => a.id === decoded.id);

  if (!admin) {
    return { valid: false, message: "Admin tidak ditemukan" };
  }

  return {
    valid: true,
    admin: {
      id: admin.id,
      username: admin.username,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    },
  };
};

// Middleware to protect routes
export const authenticateAdmin = (req, res, next) => {
  const token =
    req.headers.authorization?.replace("Bearer ", "") ||
    req.cookies?.auth_token;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: "Token tidak ditemukan" });
  }

  const session = verifySession(token);

  if (!session.valid) {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: session.message });
  }

  req.admin = session.admin;
  next();
};
