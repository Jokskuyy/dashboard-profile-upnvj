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
  FacilityData,
  GedungData,
} from "./supabaseDataService";

import type { DashboardData } from "./supabaseDataService";

/**
 * Save dashboard data (for backward compatibility)
 * Data is automatically saved to Supabase via CRUD operations
 */
export const saveDashboardData = async (
  _data: DashboardData,
): Promise<boolean> => {
  // With Supabase, data is saved automatically via CRUD operations
  // This function is kept for backward compatibility
  return true;
};
