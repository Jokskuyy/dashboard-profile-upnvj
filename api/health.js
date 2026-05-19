// GET /api/health — Health check
import { setCors, createResponse } from "./_shared.js";

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  return res.status(200).json(
    createResponse({ status: "OK", message: "Server is running" })
  );
}
