import { supabase } from "../../lib/supabase";
import { retryWithBackoff } from "../../utils/retry";
import { logCreate, logUpdate, logDelete } from "./auditLogService";
import type {
  Accreditation,
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
  akreditasi?: string | null;
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
  accreditations: Accreditation[];
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
 * Fetch accreditations - schema terbaru tidak memiliki tabel akreditasi
 */
const fetchAccreditations = async (): Promise<Accreditation[]> => {
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
        id: prodi.id,
        nama_prodi: prodi.nama_prodi,
        jenjang: prodi.jenjang as "D3" | "S1" | "S2" | "S3",
        id_fakultas: prodi.id_fakultas,
        akreditasi: (prodi as unknown as Record<string, unknown>).akreditasi as string | undefined,
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
 * Fetch departments from programs data — REUSES fetchPrograms to avoid duplicate Supabase query.
 * Both functions query the identical `program_studi` table with the same select+order.
 * This eliminates 1 redundant network request per page load.
 */
const fetchDepartments = async (programsData?: ProgramData[]): Promise<DepartmentData[]> => {
  try {
    // Reuse provided programs data or fetch once
    const programs = programsData ?? (await fetchPrograms());

    return programs.map((prog) => {
      const facultyInfo = FACULTY_MAPPING[prog.faculty ?? ""];
      return {
        id: prog.id.toString(),
        name: prog.name ?? prog.nama_prodi ?? "",
        faculty: prog.faculty ?? "",
        professors: 0,
        color: facultyInfo?.color || prog.color || "#6B7280",
        description: `Program Studi ${prog.name ?? prog.nama_prodi ?? ""}`,
      };
    });
  } catch (error) {
    console.error("Error mapping departments:", error);
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
      // Fetch programs first so departments can reuse the same data (no duplicate query)
      const [accreditations, assets, programs] = await Promise.all([
        fetchAccreditations(),
        fetchAssets(),
        fetchPrograms(),
      ]);

      // departments derived from programs — avoids duplicate program_studi query
      const departments = await fetchDepartments(programs);

      return {
        lastUpdated: new Date().toISOString(),
        accreditations,
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
      accreditations: [],
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
  const totalAssets = data.assets.reduce(
    (sum, category) => sum + category.details.length,
    0,
  );

  const facultyNames = new Set(
    [...data.programs, ...data.departments]
      .map((item) => item.faculty)
      .filter((faculty): faculty is string => Boolean(faculty)),
  );

  return {
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

  const insertPayload: Record<string, unknown> = {
    nama_prodi: program.nama_prodi || program.name,
    jenjang: program.jenjang || program.level,
    id_fakultas: fakultasId || 1,
  };
  // Include akreditasi if present
  if ((program as Record<string, unknown>).akreditasi !== undefined) {
    insertPayload.akreditasi = (program as Record<string, unknown>).akreditasi;
  }

  // Debug: log the exact payload being sent
  console.log("[createProgram] Input:", JSON.stringify(program));
  console.log("[createProgram] Payload:", JSON.stringify(insertPayload));

  const { data, error } = await supabase
    .from("program_studi")
    .insert(insertPayload)
    .select(
      `
      *,
      fakultas (
        nama_fakultas
      )
    `,
    )
    .single();

  if (error) {
    console.error("[createProgram] Supabase error:", JSON.stringify(error));
    throw error;
  }

  // Audit log (fire-and-forget)
  logCreate("program_studi", data.id.toString(), data);

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

  // Fetch old data for audit log
  const { data: oldData } = await supabase
    .from("program_studi")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  const updateData: ProgramStudiUpdateData = {};
  if (program.nama_prodi || program.name)
    updateData.nama_prodi = program.nama_prodi || program.name;
  if (program.jenjang || program.level)
    updateData.jenjang = program.jenjang || program.level;
  if (program.id_fakultas) updateData.id_fakultas = program.id_fakultas;
  // Include akreditasi if present
  if ((program as Record<string, unknown>).akreditasi !== undefined) {
    updateData.akreditasi = (program as Record<string, unknown>).akreditasi as string | null;
  }

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

  // Audit log (fire-and-forget)
  logUpdate("program_studi", id, oldData || {}, data);

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

  // Fetch old data for audit log before deleting
  const { data: oldData } = await supabase
    .from("program_studi")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  const { error } = await supabase
    .from("program_studi")
    .delete()
    .eq("id", parseInt(id));

  if (error) throw error;

  // Audit log (fire-and-forget)
  logDelete("program_studi", id, oldData || {});
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
  lantai?: number | null;
  foto_url?: string;
  unity_object_name?: string;
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
      unity_object_name: facility.unity_object_name ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  // Audit log (fire-and-forget)
  logCreate("fasilitas", data.id.toString(), data);

  return data;
};

export const updateFacility = async (
  id: number,
  facility: Partial<FacilityData>,
): Promise<FacilityData> => {
  clearCache();

  // Fetch old data for audit log
  const { data: oldData } = await supabase
    .from("fasilitas")
    .select("*")
    .eq("id", id)
    .single();

  // Strip non-column fields (e.g. nested join objects like `gedung`)
  // Only send actual DB column fields to Supabase
  const updatePayload: Record<string, unknown> = {};
  const validColumns = [
    "nama_fasilitas",
    "deskripsi_fasilitas",
    "tipe_fasilitas",
    "id_gedung",
    "color",
    "lantai",
    "foto_url",
    "unity_object_name",
  ];
  for (const key of validColumns) {
    if (key in facility) {
      updatePayload[key] = (facility as Record<string, unknown>)[key];
    }
  }

  const { data, error } = await supabase
    .from("fasilitas")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Audit log (fire-and-forget)
  logUpdate("fasilitas", id.toString(), oldData || {}, data);

  return data;
};

export const deleteFacility = async (id: number): Promise<void> => {
  clearCache();

  // Fetch old data for audit log before deleting
  const { data: oldData } = await supabase
    .from("fasilitas")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("fasilitas").delete().eq("id", id);

  if (error) throw error;

  // Audit log (fire-and-forget)
  logDelete("fasilitas", id.toString(), oldData || {});
};

// ===== GEDUNG CRUD =====

export interface GedungData {
  id?: number;
  nama_gedung: string;
  deskripsi_gedung?: string;
  lokasi?: string;
  jumlah_lantai?: number;
  foto_url?: string;
  unity_object_name?: string;
}

export const createGedung = async (
  gedung: Omit<GedungData, "id">,
): Promise<GedungData> => {
  clearCache();

  const { data, error } = await supabase
    .from("gedung")
    .insert({
      nama_gedung: gedung.nama_gedung,
      deskripsi_gedung: gedung.deskripsi_gedung ?? null,
      lokasi: gedung.lokasi ?? null,
      jumlah_lantai: gedung.jumlah_lantai ?? 1,
      foto_url: gedung.foto_url ?? null,
      unity_object_name: gedung.unity_object_name ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  logCreate("gedung", data.id.toString(), data);

  return data;
};

export const updateGedung = async (
  id: number,
  gedung: Partial<GedungData>,
): Promise<GedungData> => {
  clearCache();

  const { data: oldData } = await supabase
    .from("gedung")
    .select("*")
    .eq("id", id)
    .single();

  const updatePayload: Record<string, unknown> = {};
  const validColumns = [
    "nama_gedung",
    "deskripsi_gedung",
    "lokasi",
    "jumlah_lantai",
    "foto_url",
    "unity_object_name",
  ];
  for (const key of validColumns) {
    if (key in gedung) {
      updatePayload[key] = (gedung as Record<string, unknown>)[key];
    }
  }

  const { data, error } = await supabase
    .from("gedung")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  logUpdate("gedung", id.toString(), oldData || {}, data);

  return data;
};

export const deleteGedung = async (id: number): Promise<void> => {
  clearCache();

  const { data: oldData } = await supabase
    .from("gedung")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("gedung").delete().eq("id", id);

  if (error) throw error;

  logDelete("gedung", id.toString(), oldData || {});
};
