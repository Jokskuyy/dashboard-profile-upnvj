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

interface DosenRow {
  id: number;
  nidn: string;
  nama_dosen: string;
  email?: string;
  jabatan_fungsional?: string;
  id_prodi: number;
  id_scopus?: string;
  id_gs?: string;
  id_sinta?: string;
  kompetensi?: string;
  program_studi?: {
    nama_prodi: string;
    jenjang: string;
    fakultas?: {
      nama_fakultas: string;
    };
  };
}

interface ProdiRow {
  id: number;
  nama_prodi: string;
  jenjang: string;
  id_fakultas: number;
  id_akreditasi?: number;
  akreditasi?: {
    status: string;
    tgl_berlaku?: string;
    tgl_kadaluarsa?: string;
    keterangan?: string;
  };
  fakultas?: {
    nama_fakultas: string;
  };
  mahasiswa?: { count: number }[];
  dosen?: { count: number }[];
}

interface MahasiswaRow {
  id: number;
  nim: string;
  nama_mahasiswa: string;
  angkatan: number;
  status: string;
  id_prodi: number;
  program_studi?: {
    jenjang: string;
    fakultas?: {
      nama_fakultas: string;
    };
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

interface DosenUpdateData {
  nidn?: string;
  nama_dosen?: string;
  email?: string;
  jabatan_fungsional?: string;
  id_prodi?: number;
  id_scopus?: string;
  id_gs?: string;
  id_sinta?: string;
  kompetensi?: string;
}

interface AkreditasiUpdateData {
  status?: string;
  tgl_berlaku?: Date | string;
  tgl_kadaluarsa?: Date | string;
  keterangan?: string;
}

interface MahasiswaUpdateData {
  nim?: string;
  nama_mahasiswa?: string;
  angkatan?: number;
  status?: string;
  id_prodi?: number;
}

interface ProgramStudiUpdateData {
  nama_prodi?: string;
  jenjang?: string;
  id_fakultas?: number;
  id_akreditasi?: number;
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
  try {
    const { data, error } = await supabase
      .from("dosen")
      .select(
        `
        *,
        program_studi (
          nama_prodi,
          jenjang,
          fakultas (
            nama_fakultas
          )
        )
      `,
      )
      .order("nama_dosen", { ascending: true });

    if (error) throw error;

    return data.map((dosen: DosenRow) => {
      // Parse kompetensi safely
      let expertiseArray: string[] = [];
      try {
        if (dosen.kompetensi) {
          expertiseArray = JSON.parse(dosen.kompetensi);
        } else {
          expertiseArray = [dosen.program_studi?.nama_prodi || ""];
        }
      } catch (e) {
        // If not valid JSON, use program studi name as fallback
        expertiseArray = [dosen.program_studi?.nama_prodi || ""];
      }

      return {
        id: dosen.id,
        nidn: dosen.nidn,
        nama_dosen: dosen.nama_dosen,
        email: dosen.email || "",
        jabatan_fungsional: dosen.jabatan_fungsional || "Dosen",
        id_prodi: dosen.id_prodi,
        id_scopus: dosen.id_scopus || undefined,
        id_gs: dosen.id_gs || undefined,
        id_sinta: dosen.id_sinta || undefined,
        kompetensi: dosen.kompetensi || undefined,
        // Virtual fields for display compatibility
        name: dosen.nama_dosen,
        title: dosen.jabatan_fungsional || "Dosen",
        faculty: dosen.program_studi?.fakultas?.nama_fakultas || "Unknown",
        expertise: expertiseArray,
      };
    });
  } catch (error) {
    console.error("Error fetching professors:", error);
    return [];
  }
};

/**
 * Fetch accreditations from Supabase
 */
const fetchAccreditations = async (): Promise<Accreditation[]> => {
  try {
    const { data, error } = await supabase
      .from("program_studi")
      .select(
        `
        *,
        akreditasi (
          status,
          tgl_berlaku,
          tgl_kadaluarsa,
          keterangan
        ),
        fakultas (
          nama_fakultas
        )
      `,
      )
      .not("id_akreditasi", "is", null)
      .order("nama_prodi", { ascending: true });

    if (error) throw error;

    return data.map((prodi: ProdiRow) => {
      const now = new Date();
      const expiry = prodi.akreditasi?.tgl_kadaluarsa
        ? new Date(prodi.akreditasi.tgl_kadaluarsa)
        : null;
      let status: "active" | "expired" | "pending" = "pending";

      if (expiry) {
        status = expiry > now ? "active" : "expired";
      }

      return {
        id: prodi.id,
        program: `${prodi.nama_prodi} (${prodi.jenjang})`,
        level: prodi.akreditasi?.status || "Belum Akreditasi",
        accreditor: "BAN-PT",
        validUntil: prodi.akreditasi?.tgl_kadaluarsa || "",
        status,
      };
    });
  } catch (error) {
    console.error("Error fetching accreditations:", error);
    return [];
  }
};

/**
 * Fetch students data by faculty from Supabase
 */
const fetchStudents = async (): Promise<StudentData[]> => {
  try {
    const { data, error } = await supabase
      .from("mahasiswa")
      .select(
        `
        *,
        program_studi (
          jenjang,
          fakultas (
            nama_fakultas
          )
        )
      `,
      )
      .eq("status", "Aktif");

    if (error) throw error;

    // Group by faculty
    const facultyMap = new Map<
      string,
      { s1: number; s2: number; s3: number }
    >();

    data.forEach((mhs: MahasiswaRow) => {
      const faculty = mhs.program_studi?.fakultas?.nama_fakultas;
      const level = mhs.program_studi?.jenjang;

      if (!faculty) return;

      if (!facultyMap.has(faculty)) {
        facultyMap.set(faculty, { s1: 0, s2: 0, s3: 0 });
      }

      const counts = facultyMap.get(faculty)!;
      if (level === "S1" || level === "D3" || level === "D4") {
        counts.s1++;
      } else if (level === "S2") {
        counts.s2++;
      } else if (level === "S3") {
        counts.s3++;
      }
    });

    return Array.from(facultyMap.entries()).map(([faculty, counts]) => ({
      faculty,
      totalStudents: counts.s1 + counts.s2 + counts.s3,
      undergraduate: counts.s1,
      graduate: counts.s2,
      postgraduate: counts.s3,
    }));
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
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
        ),
        mahasiswa (count)
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
        students: prodi.mahasiswa?.length || 0,
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
        ),
        dosen (count)
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
        professors: prodi.dosen?.length || 0,
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

  return {
    totalProfessors: data.professors.length,
    totalStudents,
    activeAccreditations: data.accreditations.filter(
      (a) => a.status === "active",
    ).length,
    totalFaculties: data.students.length,
    totalAssets,
  };
};

// ============================================
// CRUD OPERATIONS
// ============================================

// ===== PROFESSORS CRUD =====

export const createProfessor = async (
  professor: Omit<Professor, "id">,
): Promise<Professor> => {
  clearCache();

  const { data, error } = await supabase
    .from("dosen")
    .insert({
      nidn: professor.nidn || `NIDN-${Date.now()}`,
      nama_dosen: professor.nama_dosen || professor.name,
      email: professor.email,
      jabatan_fungsional: professor.jabatan_fungsional || professor.title,
      id_prodi: professor.id_prodi,
      id_scopus: professor.id_scopus || null,
      id_gs: professor.id_gs || null,
      id_sinta: professor.id_sinta || null,
      kompetensi:
        professor.kompetensi ||
        (professor.expertise ? JSON.stringify(professor.expertise) : null),
    })
    .select(
      `
      *,
      program_studi (
        nama_prodi,
        jenjang,
        fakultas (
          nama_fakultas
        )
      )
    `,
    )
    .single();

  if (error) throw error;

  let expertiseArray: string[] = [];
  try {
    if (data.kompetensi) {
      expertiseArray = JSON.parse(data.kompetensi);
    }
  } catch (e) {
    expertiseArray = [];
  }

  return {
    id: data.id,
    nidn: data.nidn,
    nama_dosen: data.nama_dosen,
    email: data.email || "",
    jabatan_fungsional: data.jabatan_fungsional || "Dosen",
    id_prodi: data.id_prodi,
    id_scopus: data.id_scopus,
    id_gs: data.id_gs,
    id_sinta: data.id_sinta,
    kompetensi: data.kompetensi,
    name: data.nama_dosen,
    title: data.jabatan_fungsional || "Dosen",
    faculty: data.program_studi?.fakultas?.nama_fakultas || "Unknown",
    expertise: expertiseArray,
  };
};

export const updateProfessor = async (
  id: string,
  professor: Partial<Professor>,
): Promise<Professor> => {
  clearCache();

  const updateData: DosenUpdateData = {};
  if (professor.nidn) updateData.nidn = professor.nidn;
  if (professor.nama_dosen || professor.name)
    updateData.nama_dosen = professor.nama_dosen || professor.name;
  if (professor.email) updateData.email = professor.email;
  if (professor.jabatan_fungsional || professor.title)
    updateData.jabatan_fungsional =
      professor.jabatan_fungsional || professor.title;
  if (professor.id_prodi) updateData.id_prodi = professor.id_prodi;
  if (professor.id_scopus !== undefined)
    updateData.id_scopus = professor.id_scopus;
  if (professor.id_gs !== undefined) updateData.id_gs = professor.id_gs;
  if (professor.id_sinta !== undefined)
    updateData.id_sinta = professor.id_sinta;
  if (professor.kompetensi !== undefined) {
    updateData.kompetensi = professor.kompetensi;
  } else if (professor.expertise) {
    updateData.kompetensi = JSON.stringify(professor.expertise);
  }

  const { data, error } = await supabase
    .from("dosen")
    .update(updateData)
    .eq("id", parseInt(id))
    .select(
      `
      *,
      program_studi (
        nama_prodi,
        jenjang,
        fakultas (
          nama_fakultas
        )
      )
    `,
    )
    .single();

  if (error) throw error;

  let expertiseArray: string[] = [];
  try {
    if (data.kompetensi) {
      expertiseArray = JSON.parse(data.kompetensi);
    }
  } catch (e) {
    expertiseArray = [];
  }

  return {
    id: data.id,
    nidn: data.nidn,
    nama_dosen: data.nama_dosen,
    email: data.email || "",
    jabatan_fungsional: data.jabatan_fungsional || "Dosen",
    id_prodi: data.id_prodi,
    id_scopus: data.id_scopus,
    id_gs: data.id_gs,
    id_sinta: data.id_sinta,
    kompetensi: data.kompetensi,
    name: data.nama_dosen,
    title: data.jabatan_fungsional || "Dosen",
    faculty: data.program_studi?.fakultas?.nama_fakultas || "Unknown",
    expertise: expertiseArray,
  };
};

export const deleteProfessor = async (id: string): Promise<void> => {
  clearCache();
  const { error } = await supabase
    .from("dosen")
    .delete()
    .eq("id", parseInt(id));

  if (error) throw error;
};

// ===== ACCREDITATIONS CRUD =====

export const createAccreditation = async (
  accreditation: Omit<Accreditation, "id">,
): Promise<Accreditation> => {
  clearCache();

  // Create akreditasi record dengan field database
  const { data: akrData, error: akrError } = await supabase
    .from("akreditasi")
    .insert({
      status: accreditation.status || accreditation.level || "Belum Akreditasi",
      tgl_berlaku:
        accreditation.tgl_berlaku || new Date().toISOString().split("T")[0],
      tgl_kadaluarsa: accreditation.tgl_kadaluarsa || accreditation.validUntil,
      keterangan:
        accreditation.keterangan ||
        `Akreditasi ${accreditation.level || accreditation.status} oleh ${accreditation.accreditor || "BAN-PT"}`,
    })
    .select()
    .single();

  if (akrError) throw akrError;

  // Return dengan format yang include database fields
  return {
    id: akrData.id,
    status: akrData.status,
    tgl_berlaku: akrData.tgl_berlaku,
    tgl_kadaluarsa: akrData.tgl_kadaluarsa,
    keterangan: akrData.keterangan,
    // Virtual fields
    program: accreditation.program,
    level: akrData.status,
    accreditor: accreditation.accreditor || "BAN-PT",
    validUntil: akrData.tgl_kadaluarsa,
  };
};

export const updateAccreditation = async (
  id: string,
  accreditation: Partial<Accreditation>,
): Promise<Accreditation> => {
  clearCache();

  const updateData: AkreditasiUpdateData = {};
  if (accreditation.status) updateData.status = accreditation.status;
  if (accreditation.tgl_berlaku)
    updateData.tgl_berlaku = accreditation.tgl_berlaku;
  if (accreditation.tgl_kadaluarsa)
    updateData.tgl_kadaluarsa = accreditation.tgl_kadaluarsa;
  if (accreditation.validUntil)
    updateData.tgl_kadaluarsa = accreditation.validUntil;
  if (accreditation.keterangan)
    updateData.keterangan = accreditation.keterangan;
  if (accreditation.level) updateData.status = accreditation.level;

  const { data, error } = await supabase
    .from("akreditasi")
    .update(updateData)
    .eq("id", parseInt(id))
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    status: data.status,
    tgl_berlaku: data.tgl_berlaku,
    tgl_kadaluarsa: data.tgl_kadaluarsa,
    keterangan: data.keterangan,
    // Virtual fields
    program: accreditation.program,
    level: data.status,
    accreditor: accreditation.accreditor || "BAN-PT",
    validUntil: data.tgl_kadaluarsa,
  };
};

export const deleteAccreditation = async (id: string): Promise<void> => {
  clearCache();
  const { error } = await supabase
    .from("akreditasi")
    .delete()
    .eq("id", parseInt(id));

  if (error) throw error;
};

// ===== STUDENTS CRUD =====

export const createStudentData = async (
  student: Omit<StudentData, "id">,
): Promise<StudentData> => {
  clearCache();

  const { data, error } = await supabase
    .from("mahasiswa")
    .insert({
      nim: student.nim || `MHS-${Date.now()}`,
      nama_mahasiswa: student.nama_mahasiswa || "Mahasiswa Baru",
      angkatan: student.angkatan || new Date().getFullYear(),
      status: student.status || "Aktif",
      id_prodi: student.id_prodi || 1,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nim: data.nim,
    nama_mahasiswa: data.nama_mahasiswa,
    angkatan: data.angkatan,
    status: data.status,
    id_prodi: data.id_prodi,
  };
};

export const updateStudentData = async (
  id: string,
  student: Partial<StudentData>,
): Promise<StudentData> => {
  clearCache();

  const updateData: MahasiswaUpdateData = {};
  if (student.nim) updateData.nim = student.nim;
  if (student.nama_mahasiswa)
    updateData.nama_mahasiswa = student.nama_mahasiswa;
  if (student.angkatan) updateData.angkatan = student.angkatan;
  if (student.status) updateData.status = student.status;
  if (student.id_prodi) updateData.id_prodi = student.id_prodi;

  const { data, error } = await supabase
    .from("mahasiswa")
    .update(updateData)
    .eq("id", parseInt(id))
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nim: data.nim,
    nama_mahasiswa: data.nama_mahasiswa,
    angkatan: data.angkatan,
    status: data.status,
    id_prodi: data.id_prodi,
  };
};

export const deleteStudentData = async (id: string): Promise<void> => {
  clearCache();
  const { error } = await supabase
    .from("mahasiswa")
    .delete()
    .eq("id", parseInt(id));

  if (error) throw error;
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
      id_akreditasi: program.id_akreditasi || null,
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
    id_akreditasi: data.id_akreditasi,
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
  if (program.id_akreditasi !== undefined)
    updateData.id_akreditasi = program.id_akreditasi;

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
    id_akreditasi: data.id_akreditasi,
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
