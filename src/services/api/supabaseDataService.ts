import { supabase } from "../../lib/supabase";
import { retryWithBackoff } from "../../utils/retry";
import type {
  Professor,
  Accreditation,
  StudentData,
  AssetCategory,
  ProgramData,
  DepartmentData,
} from "../../types";

// ===== Supabase Row Types (query results with joins) =====

interface FakultasRow {
  id: number;
  nama_fakultas: string;
  deskripsi_fakultas?: string;
  email?: string;
  website?: string;
  id_gedung_utama?: number;
}

interface ProdiRow {
  id: number;
  nama_prodi: string;
  jenjang: string;
  id_fakultas: number;
  fakultas?: {
    nama_fakultas: string;
  };
}

interface FasilitasRow {
  id: number;
  nama_fasilitas: string;
  deskripsi_fasilitas?: string;
  tipe_fasilitas?: string;
  id_gedung: number;
  color?: string;
  gedung?: {
    nama_gedung: string;
    lokasi?: string;
  };
}

// ===== Update Data Types (for CRUD operations) =====

interface ProgramStudiUpdateData {
  nama_prodi?: string;
  jenjang?: string;
  id_fakultas?: number;
}

// ===== Export Types =====

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

// Cache untuk menghindari multiple fetch
let dataCache: DashboardData | null = null;
let facultiesCache: FacultyInfo[] | null = null;

// Mapping fakultas dari database ke format aplikasi (Data Statis)
const FACULTY_MAPPING: Record<string, FacultyInfo> = {
  "Fakultas Ilmu Komputer": {
    id: "fik",
    name: "Fakultas Ilmu Komputer",
    shortName: "FIK",
    color: "#3B82F6",
  },
  "Fakultas Teknik": {
    id: "ft",
    name: "Fakultas Teknik",
    shortName: "FT",
    color: "#10B981",
  },
  "Fakultas Ekonomi dan Bisnis": {
    id: "feb",
    name: "Fakultas Ekonomi dan Bisnis",
    shortName: "FEB",
    color: "#F59E0B",
  },
  "Fakultas Kedokteran": {
    id: "fk",
    name: "Fakultas Kedokteran",
    shortName: "FK",
    color: "#EF4444",
  },
  "Fakultas Ilmu Sosial dan Ilmu Politik": {
    id: "fisip",
    name: "Fakultas Ilmu Sosial dan Ilmu Politik",
    shortName: "FISIP",
    color: "#8B5CF6",
  },
  // Alias untuk variasi nama yang mungkin ada di database
  "Fakultas Ilmu Sosial dan Politik": {
    id: "fisip",
    name: "Fakultas Ilmu Sosial dan Ilmu Politik",
    shortName: "FISIP",
    color: "#8B5CF6",
  },
  "Fakultas Hukum": {
    id: "fh",
    name: "Fakultas Hukum",
    shortName: "FH",
    color: "#EC4899",
  },
};

const unsupportedLegacyTableError = (feature: string) =>
  new Error(`${feature} tidak tersedia pada schema database saat ini.`);

/**
 * Fetch faculties data from Supabase
 */
export const fetchFaculties = async (): Promise<FacultyInfo[]> => {
  if (facultiesCache) {
    return facultiesCache;
  }

  try {
    const { data, error } = await supabase
      .from("fakultas")
      .select("*")
      .order("nama_fakultas", { ascending: true });

    if (error) throw error;

    const faculties: FacultyInfo[] = data.map((fak: FakultasRow) => {
      // Gunakan mapping statis, jika tidak ada fallback ke data default
      const mapped = FACULTY_MAPPING[fak.nama_fakultas];
      return (
        mapped || {
          id: fak.id.toString(),
          name: fak.nama_fakultas,
          shortName: "UNKNOWN",
          color: "#6B7280",
        }
      );
    });

    facultiesCache = faculties;
    return faculties;
  } catch (error) {
    console.error("Error fetching faculties:", error);
    return Object.values(FACULTY_MAPPING);
  }
};

/**
 * Fetch professors from Supabase
 */
const fetchProfessors = async (): Promise<Professor[]> => {
  // Schema terbaru tidak memiliki tabel `dosen`.
  return [];
};

/**
 * Fetch accreditations from Supabase
 */
const fetchAccreditations = async (): Promise<Accreditation[]> => {
  // Schema terbaru tidak memiliki tabel `akreditasi` atau kolom `id_akreditasi`.
  return [];
};

/**
 * Fetch students data by faculty from Supabase
 */
const fetchStudents = async (): Promise<StudentData[]> => {
  // Schema terbaru tidak memiliki tabel `mahasiswa`.
  return [];
};

/**
 * Fetch programs data from Supabase (internal use only)
 */
const fetchPrograms = async (): Promise<ProgramData[]> => {
  try {
    const { data, error } = await supabase
      .from("program_studi")
      .select(
        `
        *,
        fakultas (
          nama_fakultas
        )
      `,
      )
      .order("nama_prodi", { ascending: true });

    if (error) throw error;

    return data.map((prodi: ProdiRow) => {
      const faculty = prodi.fakultas?.nama_fakultas || "Unknown";
      const facultyInfo = FACULTY_MAPPING[faculty];

      return {
        id: prodi.id.toString(),
        name: prodi.nama_prodi,
        level: prodi.jenjang as "D3" | "S1" | "S2" | "S3",
        faculty,
        students: 0,
        color: facultyInfo?.color || "#6B7280",
      };
    });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
};

/**
 * Fetch departments/research groups from Supabase
 */
const fetchDepartments = async (): Promise<DepartmentData[]> => {
  try {
    const { data, error } = await supabase
      .from("program_studi")
      .select(
        `
        *,
        fakultas (
          nama_fakultas
        )
      `,
      )
      .order("nama_prodi", { ascending: true });

    if (error) throw error;

    return data.map((prodi: ProdiRow) => {
      const faculty = prodi.fakultas?.nama_fakultas || "Unknown";
      const facultyInfo = FACULTY_MAPPING[faculty];

      return {
        id: prodi.id.toString(),
        name: prodi.nama_prodi,
        faculty,
        professors: 0,
        color: facultyInfo?.color || "#6B7280",
        description: `Program Studi ${prodi.nama_prodi}`,
      };
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};

/**
 * Fetch assets/facilities from Supabase
 */
const fetchAssets = async (): Promise<AssetCategory[]> => {
  try {
    const { data, error } = await supabase
      .from("fasilitas")
      .select(
        `
        *,
        gedung (
          nama_gedung,
          lokasi
        )
      `,
      )
      .order("tipe_fasilitas", { ascending: true });

    if (error) throw error;

    // Group by type
    const typeMap = new Map<string, FasilitasRow[]>();

    data.forEach((fasilitas: FasilitasRow) => {
      const type = fasilitas.tipe_fasilitas || "Lainnya";
      if (!typeMap.has(type)) {
        typeMap.set(type, []);
      }
      typeMap.get(type)!.push(fasilitas);
    });

    const categoryIcons: Record<string, string> = {
      Laboratorium: "LAB",
      Perpustakaan: "LIB",
      "Ruang Kuliah": "CLS",
      Aula: "AUD",
      Lapangan: "FLD",
      Lainnya: "OTH",
    };

    const categoryColors: Record<string, string> = {
      Laboratorium: "blue",
      Perpustakaan: "green",
      "Ruang Kuliah": "orange",
      Aula: "purple",
      Lapangan: "indigo",
      Lainnya: "gray",
    };

    return Array.from(typeMap.entries()).map(([type, facilities]) => ({
      id: type.toLowerCase().replace(/\s+/g, "-"),
      name: type,
      count: facilities.length,
      icon: categoryIcons[type] || "OTH",
      color: facilities[0]?.color || categoryColors[type] || "gray",
      details: facilities.map((f: FasilitasRow) => ({
        id: f.id.toString(),
        name: f.nama_fasilitas,
        room: f.nama_fasilitas,
        building: f.gedung?.nama_gedung || "Unknown",
        description: f.deskripsi_fasilitas || "",
      })),
    }));
  } catch (error) {
    console.error("Error fetching assets:", error);
    return [];
  }
};

/**
 * Fetch dashboard data from Supabase with retry mechanism
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
  if (dataCache) {
    return dataCache;
  }

  try {
    const fetchWithRetry = async () => {
      const [
        professors,
        accreditations,
        students,
        assets,
        programs,
        departments,
      ] = await Promise.all([
        fetchProfessors(),
        fetchAccreditations(),
        fetchStudents(),
        fetchAssets(),
        fetchPrograms(),
        fetchDepartments(),
      ]);

      return {
        lastUpdated: new Date().toISOString(),
        professors,
        accreditations,
        students,
        assets,
        programs,
        departments,
      };
    };

    const data = await retryWithBackoff(fetchWithRetry, {
      maxRetries: 3,
      initialDelay: 1000,
      onRetry: (attempt, error) => {
        if (import.meta.env.DEV) {
          console.log(
            `Retrying dashboard data fetch (attempt ${attempt}):`,
            error.message,
          );
        }
      },
    });

    dataCache = data;
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data after retries:", error);

    // Return empty data structure if all retries fail
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
 * Clear cache - useful when data is updated
 */
export const clearCache = () => {
  dataCache = null;
  facultiesCache = null;
};

/**
 * Get total statistics
 */
export const getTotalStats = (data: DashboardData) => {
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

  const facultyNames = new Set(
    [...data.students, ...data.programs, ...data.departments]
      .map((item) => item.faculty)
      .filter((faculty): faculty is string => Boolean(faculty)),
  );

  return {
    totalProfessors: data.professors.length,
    totalStudents,
    activeAccreditations: data.accreditations.filter(
      (a) => a.status === "active",
    ).length,
    totalFaculties: facultyNames.size,
    totalAssets,
  };
};

// ============================================
// CRUD OPERATIONS
// ============================================

// ===== PROFESSORS CRUD =====

export const createProfessor = async (
  _professor: Omit<Professor, "id">,
): Promise<Professor> => {
  clearCache();
  throw unsupportedLegacyTableError("Data dosen");
};

export const updateProfessor = async (
  _id: string,
  _professor: Partial<Professor>,
): Promise<Professor> => {
  clearCache();
  throw unsupportedLegacyTableError("Data dosen");
};

export const deleteProfessor = async (_id: string): Promise<void> => {
  clearCache();
  throw unsupportedLegacyTableError("Data dosen");
};

// ===== ACCREDITATIONS CRUD =====

export const createAccreditation = async (
  _accreditation: Omit<Accreditation, "id">,
): Promise<Accreditation> => {
  clearCache();
  throw unsupportedLegacyTableError("Data akreditasi");
};

export const updateAccreditation = async (
  _id: string,
  _accreditation: Partial<Accreditation>,
): Promise<Accreditation> => {
  clearCache();
  throw unsupportedLegacyTableError("Data akreditasi");
};

export const deleteAccreditation = async (_id: string): Promise<void> => {
  clearCache();
  throw unsupportedLegacyTableError("Data akreditasi");
};

// ===== STUDENTS CRUD =====

export const createStudentData = async (
  _student: Omit<StudentData, "id">,
): Promise<StudentData> => {
  clearCache();
  throw unsupportedLegacyTableError("Data mahasiswa");
};

export const updateStudentData = async (
  _id: string,
  _student: Partial<StudentData>,
): Promise<StudentData> => {
  clearCache();
  throw unsupportedLegacyTableError("Data mahasiswa");
};

export const deleteStudentData = async (_id: string): Promise<void> => {
  clearCache();
  throw unsupportedLegacyTableError("Data mahasiswa");
};

// ===== PROGRAMS CRUD =====

export const createProgram = async (
  program: Omit<ProgramData, "id">,
): Promise<ProgramData> => {
  clearCache();

  let fakultasId = program.id_fakultas;

  // If faculty name provided, get faculty id
  if (!fakultasId && program.faculty) {
    const { data: fakultas, error: fakultasError } = await supabase
      .from("fakultas")
      .select("id")
      .eq("nama_fakultas", program.faculty)
      .single();

    if (fakultasError) throw fakultasError;
    fakultasId = fakultas.id;
  }

  const { data, error } = await supabase
    .from("program_studi")
    .insert({
      nama_prodi: program.nama_prodi || program.name,
      jenjang: program.jenjang || program.level,
      id_fakultas: fakultasId || 1,
    })
    .select(
      `
      *,
      fakultas (
        nama_fakultas
      )
    `,
    )
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nama_prodi: data.nama_prodi,
    jenjang: data.jenjang as "D3" | "S1" | "S2" | "S3",
    id_fakultas: data.id_fakultas,
    // Virtual fields
    name: data.nama_prodi,
    level: data.jenjang as "D3" | "S1" | "S2" | "S3",
    faculty: data.fakultas?.nama_fakultas || "",
    students: 0,
    color: program.color,
  };
};

export const updateProgram = async (
  id: string,
  program: Partial<ProgramData>,
): Promise<ProgramData> => {
  clearCache();

  const updateData: ProgramStudiUpdateData = {};
  if (program.nama_prodi || program.name)
    updateData.nama_prodi = program.nama_prodi || program.name;
  if (program.jenjang || program.level)
    updateData.jenjang = program.jenjang || program.level;
  if (program.id_fakultas) updateData.id_fakultas = program.id_fakultas;

  const { data, error } = await supabase
    .from("program_studi")
    .update(updateData)
    .eq("id", parseInt(id))
    .select(
      `
      *,
      fakultas (
        nama_fakultas
      )
    `,
    )
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nama_prodi: data.nama_prodi,
    jenjang: data.jenjang as "D3" | "S1" | "S2" | "S3",
    id_fakultas: data.id_fakultas,
    // Virtual fields
    name: data.nama_prodi,
    level: data.jenjang as "D3" | "S1" | "S2" | "S3",
    faculty: data.fakultas?.nama_fakultas || "Unknown",
    students: program.students || 0,
    color: program.color,
  };
};

export const deleteProgram = async (id: string): Promise<void> => {
  clearCache();
  const { error } = await supabase
    .from("program_studi")
    .delete()
    .eq("id", parseInt(id));

  if (error) throw error;
};

// ===== ASSETS CRUD =====
// New facility-based CRUD operations (replacing category-based approach)

export interface FacilityData {
  id?: number;
  nama_fasilitas: string;
  deskripsi_fasilitas: string;
  tipe_fasilitas: string;
  id_gedung: number;
  color: string;
  lantai?: number;
  foto_url?: string;
}

export const createFacility = async (
  facility: Omit<FacilityData, "id">,
): Promise<FacilityData> => {
  clearCache();

  const { data, error } = await supabase
    .from("fasilitas")
    .insert({
      nama_fasilitas: facility.nama_fasilitas,
      deskripsi_fasilitas: facility.deskripsi_fasilitas,
      tipe_fasilitas: facility.tipe_fasilitas,
      id_gedung: facility.id_gedung,
      color: facility.color || "gray",
      lantai: facility.lantai ?? null,
      foto_url: facility.foto_url ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateFacility = async (
  id: number,
  facility: Partial<FacilityData>,
): Promise<FacilityData> => {
  clearCache();

  const { data, error } = await supabase
    .from("fasilitas")
    .update(facility)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteFacility = async (id: number): Promise<void> => {
  clearCache();

  const { error } = await supabase.from("fasilitas").delete().eq("id", id);

  if (error) throw error;
};
