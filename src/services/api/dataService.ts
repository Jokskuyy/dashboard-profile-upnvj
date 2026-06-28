// Re-export everything from supabaseDataService
export {
  fetchDashboardData,
  fetchFaculties,
  clearCache,
  createProgram,
  updateProgram,
  deleteProgram,
  createFacility,
  updateFacility,
  deleteFacility,
  createGedung,
  updateGedung,
  deleteGedung,
  getTotalStats,
} from "./supabaseDataService";

export type {
  FacultyInfo,
  DashboardData,
} from "./supabaseDataService";

export type { Gedung, Fasilitas } from "../../types";
