// Re-export everything from supabaseDataService
export {
  fetchDashboardData,
  fetchFaculties,
  clearCache,
  createProfessor,
  updateProfessor,
  deleteProfessor,
  createAccreditation,
  updateAccreditation,
  deleteAccreditation,
  createStudentData,
  updateStudentData,
  deleteStudentData,
  createProgram,
  updateProgram,
  deleteProgram,
  createFacility,
  updateFacility,
  deleteFacility,
  getTotalStats,
} from "./supabaseDataService";

export type {
  FacultyInfo,
  DashboardData,
  FacilityData,
} from "./supabaseDataService";

import type { DashboardData } from "./supabaseDataService";

/**
 * Save dashboard data (for backward compatibility)
 * Data is automatically saved to Supabase via CRUD operations
 */
export const saveDashboardData = async (
  _data: DashboardData,
): Promise<boolean> => {
  try {
    // With Supabase, data is saved automatically via CRUD operations
    // This function is kept for backward compatibility
    console.log("Dashboard data saved to Supabase via CRUD operations");
    return true;
  } catch (error) {
    console.error("Error in saveDashboardData:", error);
    return false;
  }
};
