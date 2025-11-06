import type {
  Professor,
  Accreditation,
  StudentData,
  AssetCategory,
  ProgramData,
  DepartmentData,
} from '../../types';

export interface FacultyInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface DashboardData {
  lastUpdated: string;
  professors: Professor[];
  accreditations: Accreditation[];
  students: StudentData[];
  assets: AssetCategory[];
  programs: ProgramData[];
  departments: DepartmentData[];
}

// Use import.meta.env.BASE_URL for correct path on GitHub Pages
const API_BASE_URL = `${import.meta.env.BASE_URL}data`;
const BACKEND_API_URL = "http://localhost:3001/api";
const DATA_FILE = "dashboard-data.json";
const FACULTIES_FILE = "faculties.json";

// Cache untuk menghindari multiple fetch
let dataCache: DashboardData | null = null;
let facultiesCache: FacultyInfo[] | null = null;

/**
 * Fetch dashboard data from JSON
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
  if (dataCache) {
    return dataCache;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/${DATA_FILE}?t=${Date.now()}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: DashboardData = await response.json();
    dataCache = data;
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return empty data structure if fetch fails
    return {
      lastUpdated: new Date().toISOString(),
      professors: [],
      accreditations: [],
      students: [],
      assets: [],
      programs: [],
      departments: [],
    };
  }
};

/**
 * Fetch faculties data from JSON
 */
export const fetchFaculties = async (): Promise<FacultyInfo[]> => {
  if (facultiesCache) {
    return facultiesCache;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/${FACULTIES_FILE}?t=${Date.now()}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: FacultyInfo[] = await response.json();
    facultiesCache = data;
    return data;
  } catch (error) {
    console.error("Error fetching faculties:", error);
    return [];
  }
};

/**
 * Save dashboard data to JSON (simulated - will need backend)
 * For now, we'll use localStorage as a fallback
 */
export const saveDashboardData = async (
  data: DashboardData
): Promise<boolean> => {
  try {
    // Update cache
    dataCache = data;
    data.lastUpdated = new Date().toISOString();

    // Save via backend API
    const response = await fetch(`${BACKEND_API_URL}/dashboard/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to save data");
    }

    console.log("Data saved successfully via backend");
    return true;
  } catch (error) {
    console.error("Error saving dashboard data:", error);
    return false;
  }
};

/**
 * Load data from localStorage if available
 */
export const loadFromLocalStorage = (): DashboardData | null => {
  try {
    const stored = localStorage.getItem("dashboard-data");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
  return null;
};

/**
 * Clear cache - useful when data is updated
 */
export const clearCache = () => {
  dataCache = null;
  facultiesCache = null;
};

/**
 * Get professors by faculty
 */
export const getProfessorsByFaculty = (professors: Professor[]) => {
  const facultyMap = new Map<string, number>();

  professors.forEach((prof) => {
    const count = facultyMap.get(prof.faculty) || 0;
    facultyMap.set(prof.faculty, count + 1);
  });

  return Array.from(facultyMap.entries()).map(([faculty, count]) => ({
    faculty,
    count,
  }));
};

/**
 * Get students by faculty
 */
export const getStudentsByFaculty = (students: StudentData[]) => {
  return students;
};

/**
 * Get total statistics
 */
export const getTotalStats = (data: DashboardData) => {
  const totalStudents = data.students.reduce(
    (sum, faculty) =>
      sum + (faculty.undergraduate + faculty.postgraduate + faculty.graduate),
    0
  );

  const totalAssets = data.assets.reduce(
    (sum, category) => sum + category.details.length,
    0
  );

  return {
    totalProfessors: data.professors.length,
    totalStudents,
    activeAccreditations: data.accreditations.filter(
      (a) => a.status === "active"
    ).length,
    totalFaculties: data.students.length,
    totalAssets,
  };
};

// Helper functions for assets data
export const getAssetsByCategory = (
  assets: AssetCategory[],
  categoryId: string
) => {
  return assets.find((category) => category.id === categoryId);
};

// Helper functions for program data
export const getProgramsByFacultyId = (
  programs: ProgramData[],
  facultyId: string,
  faculties: FacultyInfo[]
) => {
  const faculty = faculties.find((f) => f.id === facultyId);
  if (!faculty) return [];
  return programs.filter((program) => program.faculty === faculty.name);
};

// Helper functions for department data
export const getDepartmentsByFacultyId = (
  departments: DepartmentData[],
  facultyId: string,
  faculties: FacultyInfo[]
) => {
  const faculty = faculties.find((f) => f.id === facultyId);
  if (!faculty) return [];
  return departments.filter((dept) => dept.faculty === faculty.name);
};

// ============================================
// CRUD OPERATIONS
// ============================================

// Generic API request helper
const apiRequest = async <T>(
  endpoint: string,
  method: string = "GET",
  body?: any
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BACKEND_API_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// ===== PROFESSORS CRUD =====

export const createProfessor = async (
  professor: Omit<Professor, "id">
): Promise<Professor> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: Professor }>(
    "/professors",
    "POST",
    professor
  );
  return result.data;
};

export const updateProfessor = async (
  id: string,
  professor: Partial<Professor>
): Promise<Professor> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: Professor }>(
    `/professors/${id}`,
    "PUT",
    professor
  );
  return result.data;
};

export const deleteProfessor = async (id: string): Promise<void> => {
  clearCache();
  await apiRequest(`/professors/${id}`, "DELETE");
};

// ===== ACCREDITATIONS CRUD =====

export const createAccreditation = async (
  accreditation: Omit<Accreditation, "id">
): Promise<Accreditation> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: Accreditation }>(
    "/accreditations",
    "POST",
    accreditation
  );
  return result.data;
};

export const updateAccreditation = async (
  id: string,
  accreditation: Partial<Accreditation>
): Promise<Accreditation> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: Accreditation }>(
    `/accreditations/${id}`,
    "PUT",
    accreditation
  );
  return result.data;
};

export const deleteAccreditation = async (id: string): Promise<void> => {
  clearCache();
  await apiRequest(`/accreditations/${id}`, "DELETE");
};

// ===== STUDENTS CRUD =====

export const createStudentData = async (
  student: Omit<StudentData, "facultyId">
): Promise<StudentData> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: StudentData }>(
    "/students",
    "POST",
    student
  );
  return result.data;
};

export const updateStudentData = async (
  facultyId: string,
  student: Partial<StudentData>
): Promise<StudentData> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: StudentData }>(
    `/students/${facultyId}`,
    "PUT",
    student
  );
  return result.data;
};

export const deleteStudentData = async (facultyId: string): Promise<void> => {
  clearCache();
  await apiRequest(`/students/${facultyId}`, "DELETE");
};

// ===== PROGRAMS CRUD =====

export const createProgram = async (
  program: Omit<ProgramData, "id">
): Promise<ProgramData> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: ProgramData }>(
    "/programs",
    "POST",
    program
  );
  return result.data;
};

export const updateProgram = async (
  id: string,
  program: Partial<ProgramData>
): Promise<ProgramData> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: ProgramData }>(
    `/programs/${id}`,
    "PUT",
    program
  );
  return result.data;
};

export const deleteProgram = async (id: string): Promise<void> => {
  clearCache();
  await apiRequest(`/programs/${id}`, "DELETE");
};

// ===== DEPARTMENTS CRUD =====

export const createDepartment = async (
  department: Omit<DepartmentData, "id">
): Promise<DepartmentData> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: DepartmentData }>(
    "/departments",
    "POST",
    department
  );
  return result.data;
};

export const updateDepartment = async (
  id: string,
  department: Partial<DepartmentData>
): Promise<DepartmentData> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: DepartmentData }>(
    `/departments/${id}`,
    "PUT",
    department
  );
  return result.data;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  clearCache();
  await apiRequest(`/departments/${id}`, "DELETE");
};

// ===== ASSETS CRUD =====

export const createAssetCategory = async (
  category: Omit<AssetCategory, "id">
): Promise<AssetCategory> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: AssetCategory }>(
    "/assets",
    "POST",
    category
  );
  return result.data;
};

export const updateAssetCategory = async (
  id: string,
  category: Partial<AssetCategory>
): Promise<AssetCategory> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: AssetCategory }>(
    `/assets/${id}`,
    "PUT",
    category
  );
  return result.data;
};

export const deleteAssetCategory = async (id: string): Promise<void> => {
  clearCache();
  await apiRequest(`/assets/${id}`, "DELETE");
};

// Asset details within a category
export interface AssetDetail {
  id: string;
  name: string;
  room: string;
  building: string;
  capacity?: number;
}

export const addAssetDetail = async (
  categoryId: string,
  detail: Omit<AssetDetail, "id">
): Promise<AssetDetail> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: AssetDetail }>(
    `/assets/${categoryId}/details`,
    "POST",
    detail
  );
  return result.data;
};

export const updateAssetDetail = async (
  categoryId: string,
  detailId: string,
  detail: Partial<AssetDetail>
): Promise<AssetDetail> => {
  clearCache();
  const result = await apiRequest<{ success: boolean; data: AssetDetail }>(
    `/assets/${categoryId}/details/${detailId}`,
    "PUT",
    detail
  );
  return result.data;
};

export const deleteAssetDetail = async (
  categoryId: string,
  detailId: string
): Promise<void> => {
  clearCache();
  await apiRequest(`/assets/${categoryId}/details/${detailId}`, "DELETE");
};
