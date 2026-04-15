import type { Accreditation, Professor, ProgramData, StudentData } from "../../types";
import type { DashboardData, FacultyInfo, FacilityData } from "./supabaseDataService";

export type DataBackend = "supabase" | "enginex";

export interface DataProvider {
  fetchDashboardData: () => Promise<DashboardData>;
  fetchFaculties: () => Promise<FacultyInfo[]>;
  clearCache: () => void;
  createProfessor: (professor: Omit<Professor, "id">) => Promise<Professor>;
  updateProfessor: (id: string, professor: Partial<Professor>) => Promise<Professor>;
  deleteProfessor: (id: string) => Promise<void>;
  createAccreditation: (
    accreditation: Omit<Accreditation, "id">,
  ) => Promise<Accreditation>;
  updateAccreditation: (
    id: string,
    accreditation: Partial<Accreditation>,
  ) => Promise<Accreditation>;
  deleteAccreditation: (id: string) => Promise<void>;
  createStudentData: (student: Omit<StudentData, "id">) => Promise<StudentData>;
  updateStudentData: (
    id: string,
    student: Partial<StudentData>,
  ) => Promise<StudentData>;
  deleteStudentData: (id: string) => Promise<void>;
  createProgram: (program: Omit<ProgramData, "id">) => Promise<ProgramData>;
  updateProgram: (id: string, program: Partial<ProgramData>) => Promise<ProgramData>;
  deleteProgram: (id: string) => Promise<void>;
  createFacility: (facility: Omit<FacilityData, "id">) => Promise<FacilityData>;
  updateFacility: (id: number, facility: Partial<FacilityData>) => Promise<FacilityData>;
  deleteFacility: (id: number) => Promise<void>;
  getTotalStats: (data: DashboardData) => {
    totalProfessors: number;
    totalStudents: number;
    activeAccreditations: number;
    totalFaculties: number;
    totalAssets: number;
  };
}
