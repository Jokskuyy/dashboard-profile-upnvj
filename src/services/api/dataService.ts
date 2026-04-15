import type { DashboardData, FacilityData, FacultyInfo } from "./supabaseDataService";
import type { DataBackend, DataProvider } from "./dataProvider";
import { engineXDataProvider } from "./engineXDataService";
import * as supabaseProvider from "./supabaseDataService";

const DATA_BACKEND = import.meta.env.VITE_DATA_BACKEND || "supabase";

const supabaseDataProvider: DataProvider = {
  fetchDashboardData: supabaseProvider.fetchDashboardData,
  fetchFaculties: supabaseProvider.fetchFaculties,
  clearCache: supabaseProvider.clearCache,
  createProfessor: supabaseProvider.createProfessor,
  updateProfessor: supabaseProvider.updateProfessor,
  deleteProfessor: supabaseProvider.deleteProfessor,
  createAccreditation: supabaseProvider.createAccreditation,
  updateAccreditation: supabaseProvider.updateAccreditation,
  deleteAccreditation: supabaseProvider.deleteAccreditation,
  createStudentData: supabaseProvider.createStudentData,
  updateStudentData: supabaseProvider.updateStudentData,
  deleteStudentData: supabaseProvider.deleteStudentData,
  createProgram: supabaseProvider.createProgram,
  updateProgram: supabaseProvider.updateProgram,
  deleteProgram: supabaseProvider.deleteProgram,
  createFacility: supabaseProvider.createFacility,
  updateFacility: supabaseProvider.updateFacility,
  deleteFacility: supabaseProvider.deleteFacility,
  getTotalStats: supabaseProvider.getTotalStats,
};

const resolveProvider = (): { backend: DataBackend; provider: DataProvider } => {
  if (DATA_BACKEND === "enginex") {
    return { backend: "enginex", provider: engineXDataProvider };
  }

  return { backend: "supabase", provider: supabaseDataProvider };
};

const { backend: activeBackend, provider } = resolveProvider();

if (import.meta.env.DEV) {
  console.info(`[dataService] Active data backend: ${activeBackend}`);
}

export const fetchDashboardData = provider.fetchDashboardData;
export const fetchFaculties = provider.fetchFaculties;
export const clearCache = provider.clearCache;
export const createProfessor = provider.createProfessor;
export const updateProfessor = provider.updateProfessor;
export const deleteProfessor = provider.deleteProfessor;
export const createAccreditation = provider.createAccreditation;
export const updateAccreditation = provider.updateAccreditation;
export const deleteAccreditation = provider.deleteAccreditation;
export const createStudentData = provider.createStudentData;
export const updateStudentData = provider.updateStudentData;
export const deleteStudentData = provider.deleteStudentData;
export const createProgram = provider.createProgram;
export const updateProgram = provider.updateProgram;
export const deleteProgram = provider.deleteProgram;
export const createFacility = provider.createFacility;
export const updateFacility = provider.updateFacility;
export const deleteFacility = provider.deleteFacility;
export const getTotalStats = provider.getTotalStats;

export type { FacilityData, FacultyInfo, DashboardData };

/**
 * Save dashboard data (for backward compatibility)
 * Data is automatically saved via backend CRUD operations.
 */
export const saveDashboardData = async (_data: DashboardData): Promise<boolean> => {
  return true;
};
