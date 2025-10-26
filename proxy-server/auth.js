import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_DATA_FILE = path.join(__dirname, "admin-data.json");
const JWT_SECRET = "upnvj-dashboard-secret-key-2025"; // In production, use environment variable
const JWT_EXPIRES_IN = "24h";

// Read admin data
const readAdminData = () => {
  try {
    const data = fs.readFileSync(ADMIN_DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading admin data:", error);
    return { admins: [], sessions: [] };
  }
};

// Write admin data
const writeAdminData = (data) => {
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

// Login function
export const login = async (username, password) => {
  const data = readAdminData();

  // Find admin by username
  const admin = data.admins.find((a) => a.username === username);

  if (!admin) {
    return { success: false, message: "Username atau password salah" };
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, admin.password);

  if (!isPasswordValid) {
    return { success: false, message: "Username atau password salah" };
  }

  // Generate token
  const token = generateToken(admin);

  // Create session
  const session = {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    adminId: admin.id,
    token,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: null, // Will be set from request
    userAgent: null, // Will be set from request
  };

  // Save session
  data.sessions.push(session);

  // Update last login
  admin.lastLogin = new Date().toISOString();
  writeAdminData(data);

  // Return admin data without password
  const { password: _, ...adminWithoutPassword } = admin;

  return {
    success: true,
    message: "Login berhasil",
    admin: adminWithoutPassword,
    token,
  };
};

// Logout function
export const logout = async (token) => {
  const data = readAdminData();

  // Remove session
  data.sessions = data.sessions.filter((s) => s.token !== token);

  writeAdminData(data);

  return { success: true, message: "Logout berhasil" };
};

// Verify session
export const verifySession = async (token) => {
  if (!token) {
    return { valid: false, message: "Token tidak ditemukan" };
  }

  // Verify JWT
  const decoded = verifyToken(token);

  if (!decoded) {
    return { valid: false, message: "Token tidak valid" };
  }

  // Check session in database
  const data = readAdminData();
  const session = data.sessions.find((s) => s.token === token);

  if (!session) {
    return { valid: false, message: "Session tidak ditemukan" };
  }

  // Check if session expired
  if (new Date(session.expiresAt) < new Date()) {
    // Remove expired session
    data.sessions = data.sessions.filter((s) => s.token !== token);
    writeAdminData(data);
    return { valid: false, message: "Session telah expired" };
  }

  // Get admin data
  const admin = data.admins.find((a) => a.id === session.adminId);

  if (!admin) {
    return { valid: false, message: "Admin tidak ditemukan" };
  }

  const { password: _, ...adminWithoutPassword } = admin;

  return {
    valid: true,
    admin: adminWithoutPassword,
  };
};

// Get admin profile
export const getAdminProfile = async (adminId) => {
  const data = readAdminData();
  const admin = data.admins.find((a) => a.id === adminId);

  if (!admin) {
    return null;
  }

  const { password: _, ...adminWithoutPassword } = admin;
  return adminWithoutPassword;
};
