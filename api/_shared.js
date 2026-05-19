// Shared Supabase client for Vercel Serverless Functions
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials in environment variables");
  }
  return createClient(supabaseUrl, supabaseKey);
}

// CORS headers for Unity Editor cross-origin requests
export function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export function createResponse(data, success = true) {
  return { success, data, timestamp: new Date().toISOString() };
}
