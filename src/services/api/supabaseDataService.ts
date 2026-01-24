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

    const faculties: FacultyInfo[] = data.map((fak: any) => {
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

    return data.map((dosen: any) => {
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

    return data.map((prodi: any) => {
      const now = new Date();
      const expiry = prodi.akreditasi?.tgl_kadaluarsa
        ? new Date(prodi.akreditasi.tgl_kadaluarsa)
        : null;
      let status: "active" | "expired" | "pending" = "pending";

      if (expiry) {
        status = expiry > now ? "active" : "expired";
      }

      return {
        id: prodi.id.toString(),
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

    data.forEach((mhs: any) => {
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
 * Fetch programs data from Supabase
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

    return data.map((prodi: any) => {
      const faculty = prodi.fakultas?.nama_fakultas || "Unknown";
      const facultyInfo = FACULTY_MAPPING[faculty];

      return {
        id: prodi.id.toString(),
        name: prodi.nama_prodi,
        level: prodi.jenjang as "D3" | "S1" | "S2",
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

    return data.map((prodi: any) => {
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
    const typeMap = new Map<string, any[]>();

    data.forEach((fasilitas: any) => {
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
      details: facilities.map((f: any) => ({
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
        console.log(
          `Retrying dashboard data fetch (attempt ${attempt}):`,
          error.message,
        );
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

// Helper functions for assets data
export const getAssetsByCategory = (
  assets: AssetCategory[],
  categoryId: string,
) => {
  return assets.find((category) => category.id === categoryId);
};

// Helper functions for program data
export const getProgramsByFacultyId = (
  programs: ProgramData[],
  facultyId: string,
  faculties: FacultyInfo[],
) => {
  const faculty = faculties.find((f) => f.id === facultyId);
  if (!faculty) return [];
  return programs.filter((program) => program.faculty === faculty.name);
};

// Helper functions for department data
export const getDepartmentsByFacultyId = (
  departments: DepartmentData[],
  facultyId: string,
  faculties: FacultyInfo[],
) => {
  const faculty = faculties.find((f) => f.id === facultyId);
  if (!faculty) return [];
  return departments.filter((dept) => dept.faculty === faculty.name);
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
      kompetensi: professor.kompetensi || (professor.expertise ? JSON.stringify(professor.expertise) : null),
    })
    .select(`
      *,
      program_studi (
        nama_prodi,
        jenjang,
        fakultas (
          nama_fakultas
        )
      )
    `)
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

  const updateData: any = {};
  if (professor.nidn) updateData.nidn = professor.nidn;
  if (professor.nama_dosen || professor.name) updateData.nama_dosen = professor.nama_dosen || professor.name;
  if (professor.email) updateData.email = professor.email;
  if (professor.jabatan_fungsional || professor.title) updateData.jabatan_fungsional = professor.jabatan_fungsional || professor.title;
  if (professor.id_prodi) updateData.id_prodi = professor.id_prodi;
  if (professor.id_scopus !== undefined) updateData.id_scopus = professor.id_scopus;
  if (professor.id_gs !== undefined) updateData.id_gs = professor.id_gs;
  if (professor.id_sinta !== undefined) updateData.id_sinta = professor.id_sinta;
  if (professor.kompetensi !== undefined) {
    updateData.kompetensi = professor.kompetensi;
  } else if (professor.expertise) {
    updateData.kompetensi = JSON.stringify(professor.expertise);
  }

  const { data, error } = await supabase
    .from("dosen")
    .update(updateData)
    .eq("id", parseInt(id))
    .select(`
      *,
      program_studi (
        nama_prodi,
        jenjang,
        fakultas (
          nama_fakultas
        )
      )
    `)
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

  // First create akreditasi record
  const { data: akrData, error: akrError } = await supabase
    .from("akreditasi")
    .insert({
      status: accreditation.level,
      tgl_berlaku: new Date().toISOString().split("T")[0],
      tgl_kadaluarsa: accreditation.validUntil,
      keterangan: `Akreditasi ${accreditation.level} oleh ${accreditation.accreditor}`,
    })
    .select()
    .single();

  if (akrError) throw akrError;

  // Then create program_studi
  const { data: prodiData, error: prodiError } = await supabase
    .from("program_studi")
    .insert({
      nama_prodi: accreditation.program.split(" (")[0],
      jenjang: "S1",
      id_fakultas: 1, // Default to first faculty
      id_akreditasi: akrData.id,
    })
    .select()
    .single();

  if (prodiError) throw prodiError;

  return {
    id: prodiData.id.toString(),
    program: accreditation.program,
    level: accreditation.level,
    accreditor: accreditation.accreditor,
    validUntil: accreditation.validUntil,
    status: accreditation.status,
  };
};

export const updateAccreditation = async (
  id: string,
  accreditation: Partial<Accreditation>,
): Promise<Accreditation> => {
  clearCache();

  const { data, error } = await supabase
    .from("program_studi")
    .select("*, akreditasi(*)")
    .eq("id", parseInt(id))
    .single();

  if (error) throw error;

  // Update akreditasi if it exists
  if (data.id_akreditasi && accreditation.validUntil) {
    await supabase
      .from("akreditasi")
      .update({
        tgl_kadaluarsa: accreditation.validUntil,
        status: accreditation.level || data.akreditasi.status,
      })
      .eq("id", data.id_akreditasi);
  }

  return {
    id: data.id.toString(),
    program: accreditation.program || data.nama_prodi,
    level: accreditation.level || data.akreditasi?.status || "",
    accreditor: accreditation.accreditor || "BAN-PT",
    validUntil:
      accreditation.validUntil || data.akreditasi?.tgl_kadaluarsa || "",
    status: accreditation.status || "pending",
  };
};

export const deleteAccreditation = async (id: string): Promise<void> => {
  clearCache();
  const { error } = await supabase
    .from("program_studi")
    .delete()
    .eq("id", parseInt(id));

  if (error) throw error;
};

// ===== STUDENTS CRUD =====

export const createStudentData = async (
  student: Omit<StudentData, "facultyId">,
): Promise<StudentData> => {
  clearCache();
  // This would require creating individual mahasiswa records
  // For simplicity, we return the input data
  return {
    ...student,
    totalStudents:
      student.undergraduate + student.graduate + student.postgraduate,
  };
};

export const updateStudentData = async (
  _facultyId: string,
  student: Partial<StudentData>,
): Promise<StudentData> => {
  clearCache();
  // This would require updating mahasiswa records
  // For simplicity, we return the updated data
  return student as StudentData;
};

export const deleteStudentData = async (_facultyId: string): Promise<void> => {
  clearCache();
  // This would require deleting mahasiswa records by faculty
};

// ===== PROGRAMS CRUD =====

export const createProgram = async (
  program: Omit<ProgramData, "id">,
): Promise<ProgramData> => {
  clearCache();

  // Get faculty id from name
  const { data: fakultas, error: fakultasError } = await supabase
    .from("fakultas")
    .select("id")
    .eq("nama_fakultas", program.faculty)
    .single();

  if (fakultasError) throw fakultasError;

  const { data, error } = await supabase
    .from("program_studi")
    .insert({
      nama_prodi: program.name,
      jenjang: program.level,
      id_fakultas: fakultas.id,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id.toString(),
    name: data.nama_prodi,
    level: data.jenjang as "D3" | "S1" | "S2",
    faculty: program.faculty,
    students: 0,
    color: program.color,
  };
};

export const updateProgram = async (
  id: string,
  program: Partial<ProgramData>,
): Promise<ProgramData> => {
  clearCache();

  const updateData: any = {};
  if (program.name) updateData.nama_prodi = program.name;
  if (program.level) updateData.jenjang = program.level;

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
    id: data.id.toString(),
    name: data.nama_prodi,
    level: data.jenjang as "D3" | "S1" | "S2",
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

// ===== DEPARTMENTS CRUD =====

export const createDepartment = async (
  department: Omit<DepartmentData, "id">,
): Promise<DepartmentData> => {
  clearCache();
  // Departments are same as programs in this schema
  const program = await createProgram({
    name: department.name,
    level: "S1",
    faculty: department.faculty,
    students: 0,
    color: department.color,
  });

  return {
    id: program.id,
    name: program.name,
    faculty: program.faculty,
    professors: 0,
    color: department.color,
    description: department.description,
  };
};

export const updateDepartment = async (
  id: string,
  department: Partial<DepartmentData>,
): Promise<DepartmentData> => {
  clearCache();
  const program = await updateProgram(id, {
    name: department.name,
    level: "S1",
    faculty: department.faculty,
    color: department.color,
  });

  return {
    id: program.id,
    name: program.name,
    faculty: program.faculty,
    professors: department.professors || 0,
    color: department.color,
    description: department.description,
  };
};

export const deleteDepartment = async (id: string): Promise<void> => {
  clearCache();
  await deleteProgram(id);
};

// ===== ASSETS CRUD =====

export const createAssetCategory = async (
  category: Omit<AssetCategory, "id">,
): Promise<AssetCategory> => {
  clearCache();
  // This would require creating a new type of fasilitas
  return {
    id: Date.now().toString(),
    ...category,
  };
};

export const updateAssetCategory = async (
  _id: string,
  category: Partial<AssetCategory>,
): Promise<AssetCategory> => {
  clearCache();
  // This would require updating fasilitas records
  return category as AssetCategory;
};

export const deleteAssetCategory = async (_id: string): Promise<void> => {
  clearCache();
  // This would require deleting fasilitas records by type
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
  detail: Omit<AssetDetail, "id">,
): Promise<AssetDetail> => {
  clearCache();

  // Get or create gedung
  let { data: gedung, error: gedungError } = await supabase
    .from("gedung")
    .select("id")
    .eq("nama_gedung", detail.building)
    .single();

  if (gedungError || !gedung) {
    const { data: newGedung, error: createError } = await supabase
      .from("gedung")
      .insert({ nama_gedung: detail.building })
      .select()
      .single();

    if (createError) throw createError;
    gedung = newGedung;
  }

  const { data, error } = await supabase
    .from("fasilitas")
    .insert({
      nama_fasilitas: detail.name,
      tipe_fasilitas: categoryId.replace(/-/g, " "),
      id_gedung: gedung?.id || 0,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id.toString(),
    name: data.nama_fasilitas,
    room: detail.room,
    building: detail.building,
    capacity: detail.capacity,
  };
};

export const updateAssetDetail = async (
  _categoryId: string,
  detailId: string,
  detail: Partial<AssetDetail>,
): Promise<AssetDetail> => {
  clearCache();

  const updateData: any = {};
  if (detail.name) updateData.nama_fasilitas = detail.name;

  const { data, error } = await supabase
    .from("fasilitas")
    .update(updateData)
    .eq("id", parseInt(detailId))
    .select(
      `
      *,
      gedung (
        nama_gedung
      )
    `,
    )
    .single();

  if (error) throw error;

  return {
    id: data.id.toString(),
    name: data.nama_fasilitas,
    room: detail.room || data.nama_fasilitas,
    building: data.gedung?.nama_gedung || "",
    capacity: detail.capacity,
  };
};

export const deleteAssetDetail = async (
  _categoryId: string,
  detailId: string,
): Promise<void> => {
  clearCache();
  const { error } = await supabase
    .from("fasilitas")
    .delete()
    .eq("id", parseInt(detailId));

  if (error) throw error;
};
