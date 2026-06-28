// GET /api/unity/names — Returns a clean list of active building object names for Unity
import { getSupabase, setCors } from "../_shared.js";

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const supabase = getSupabase();

    // Fetch valid unity_object_name from gedung
    const { data: gedungData, error: gedungError } = await supabase
      .from("gedung")
      .select("unity_object_name")
      .not("unity_object_name", "is", null);

    if (gedungError) throw gedungError;

    // Fetch valid unity_object_name from fasilitas
    const { data: fasilitasData, error: fasilitasError } = await supabase
      .from("fasilitas")
      .select("unity_object_name")
      .not("unity_object_name", "is", null);

    if (fasilitasError) throw fasilitasError;

    // Helper to extract non-empty names
    const extractNames = (rows) =>
      rows
        ?.map((item) => item.unity_object_name)
        .filter((name) => typeof name === "string" && name.trim().length > 0)
        .sort((a, b) => a.localeCompare(b)) ?? [];

    const gedungNames = extractNames(gedungData);
    const fasilitasNames = extractNames(fasilitasData);

    let resultNames;
    const { type } = req.query;

    if (type === "gedung") {
      resultNames = gedungNames;
    } else if (type === "fasilitas") {
      resultNames = fasilitasNames;
    } else {
      // Return combined list sorted (default)
      resultNames = [...gedungNames, ...fasilitasNames].sort((a, b) => a.localeCompare(b));
    }

    return res.status(200).json({ unityObjectNames: resultNames });
  } catch (error) {
    console.error("Error fetching unity object names:", error);
    return res.status(500).json({ error: error.message });
  }
}
