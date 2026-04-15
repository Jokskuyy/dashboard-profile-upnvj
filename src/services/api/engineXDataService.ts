import type { Accreditation, Professor, ProgramData, StudentData } from "../../types";
import type { DataProvider } from "./dataProvider";
import type { DashboardData, FacultyInfo, FacilityData } from "./supabaseDataService";

let dashboardCache: DashboardData | null = null;
let facultiesCache: FacultyInfo[] | null = null;

const getApiBase = (): string => {
  const apiBase = import.meta.env.VITE_API_URL;
  if (!apiBase) {
    throw new Error(
      "VITE_API_URL is required when VITE_DATA_BACKEND is set to 'enginex'.",
    );
  }

  return apiBase;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${getApiBase()}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Engine X API error (${response.status}): ${errorText || response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
};

const computeTotals = (data: DashboardData) => {
  const totalStudents = data.students.reduce(
    (sum, faculty) =>
      sum +
      ((faculty.undergraduate || 0) +
        (faculty.postgraduate || 0) +
        (faculty.graduate || 0)),
    0,
  );

  const totalAssets = data.assets.reduce(
    (sum, category) => sum + category.details.length,
    0,
  );

  return {
    totalProfessors: data.professors.length,
    totalStudents,
    activeAccreditations: data.accreditations.filter((a) => a.status === "active")
      .length,
    totalFaculties: data.students.length,
    totalAssets,
  };
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  if (dashboardCache) return dashboardCache;
  const data = await request<DashboardData>("/api/dashboard");
  dashboardCache = data;
  return data;
};

export const fetchFaculties = async (): Promise<FacultyInfo[]> => {
  if (facultiesCache) return facultiesCache;
  const data = await request<FacultyInfo[]>("/api/faculties");
  facultiesCache = data;
  return data;
};

export const clearCache = () => {
  dashboardCache = null;
  facultiesCache = null;
};

export const createProfessor = async (
  professor: Omit<Professor, "id">,
): Promise<Professor> => {
  clearCache();
  return request<Professor>("/api/admin/professors", {
    method: "POST",
    body: JSON.stringify(professor),
  });
};

export const updateProfessor = async (
  id: string,
  professor: Partial<Professor>,
): Promise<Professor> => {
  clearCache();
  return request<Professor>(`/api/admin/professors/${id}`, {
    method: "PUT",
    body: JSON.stringify(professor),
  });
};

export const deleteProfessor = async (id: string): Promise<void> => {
  clearCache();
  await request<void>(`/api/admin/professors/${id}`, { method: "DELETE" });
};

export const createAccreditation = async (
  accreditation: Omit<Accreditation, "id">,
): Promise<Accreditation> => {
  clearCache();
  return request<Accreditation>("/api/admin/accreditations", {
    method: "POST",
    body: JSON.stringify(accreditation),
  });
};

export const updateAccreditation = async (
  id: string,
  accreditation: Partial<Accreditation>,
): Promise<Accreditation> => {
  clearCache();
  return request<Accreditation>(`/api/admin/accreditations/${id}`, {
    method: "PUT",
    body: JSON.stringify(accreditation),
  });
};

export const deleteAccreditation = async (id: string): Promise<void> => {
  clearCache();
  await request<void>(`/api/admin/accreditations/${id}`, { method: "DELETE" });
};

export const createStudentData = async (
  student: Omit<StudentData, "id">,
): Promise<StudentData> => {
  clearCache();
  return request<StudentData>("/api/admin/students", {
    method: "POST",
    body: JSON.stringify(student),
  });
};

export const updateStudentData = async (
  id: string,
  student: Partial<StudentData>,
): Promise<StudentData> => {
  clearCache();
  return request<StudentData>(`/api/admin/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(student),
  });
};

export const deleteStudentData = async (id: string): Promise<void> => {
  clearCache();
  await request<void>(`/api/admin/students/${id}`, { method: "DELETE" });
};

export const createProgram = async (
  program: Omit<ProgramData, "id">,
): Promise<ProgramData> => {
  clearCache();
  return request<ProgramData>("/api/admin/programs", {
    method: "POST",
    body: JSON.stringify(program),
  });
};

export const updateProgram = async (
  id: string,
  program: Partial<ProgramData>,
): Promise<ProgramData> => {
  clearCache();
  return request<ProgramData>(`/api/admin/programs/${id}`, {
    method: "PUT",
    body: JSON.stringify(program),
  });
};

export const deleteProgram = async (id: string): Promise<void> => {
  clearCache();
  await request<void>(`/api/admin/programs/${id}`, { method: "DELETE" });
};

export const createFacility = async (
  facility: Omit<FacilityData, "id">,
): Promise<FacilityData> => {
  clearCache();
  return request<FacilityData>("/api/admin/facilities", {
    method: "POST",
    body: JSON.stringify(facility),
  });
};

export const updateFacility = async (
  id: number,
  facility: Partial<FacilityData>,
): Promise<FacilityData> => {
  clearCache();
  return request<FacilityData>(`/api/admin/facilities/${id}`, {
    method: "PUT",
    body: JSON.stringify(facility),
  });
};

export const deleteFacility = async (id: number): Promise<void> => {
  clearCache();
  await request<void>(`/api/admin/facilities/${id}`, { method: "DELETE" });
};

export const getTotalStats = computeTotals;

export const engineXDataProvider: DataProvider = {
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
};
