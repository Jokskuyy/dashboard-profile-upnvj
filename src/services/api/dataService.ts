// Re-export everything from supabaseDataService
export {
  fetchDashboardData,
  fetchFaculties,
  fetchPrograms,
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
  createDepartment,
  updateDepartment,
  deleteDepartment,
  createFacility,
  updateFacility,
  deleteFacility,
  createAssetCategory,
  updateAssetCategory,
  deleteAssetCategory,
  addAssetDetail,
  updateAssetDetail,
  deleteAssetDetail,
  getProfessorsByFaculty,
  getStudentsByFaculty,
  getTotalStats,
  getAssetsByCategory,
  getProgramsByFacultyId,
  getDepartmentsByFacultyId,
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
