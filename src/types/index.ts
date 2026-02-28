// Language types
export type Language = "id" | "en";

// KPI data types
export interface Professor {
  id: number;
  nidn: string;
  nama_dosen: string;
  email: string;
  jabatan_fungsional: string;
  id_prodi: number;
  id_scopus?: string;
  id_gs?: string;
  id_sinta?: string;
  kompetensi?: string;
  // Virtual fields for display
  name?: string; // Alias for nama_dosen
  title?: string; // Alias for jabatan_fungsional
  faculty?: string; // From join with program_studi
  expertise?: string[]; // Parsed from kompetensi JSON string
}

export interface Accreditation {
  id: number;
  status: string;
  tgl_berlaku?: Date | string;
  tgl_kadaluarsa?: Date | string;
  keterangan?: string;
  // Virtual fields for display
  program?: string;
  level?: string;
  accreditor?: string;
  validUntil?: string;
}

export interface StudentData {
  id?: number;
  nim?: string;
  nama_mahasiswa?: string;
  angkatan?: number;
  status?: string;
  id_prodi?: number;
  // Virtual fields for aggregation display
  faculty?: string;
  totalStudents?: number;
  undergraduate?: number;
  graduate?: number;
  postgraduate?: number;
}

// Program Study types
export interface ProgramData {
  id: string | number;
  nama_prodi?: string;
  jenjang?: "D3" | "S1" | "S2" | "S3";
  id_fakultas?: number;
  id_akreditasi?: number;
  // Virtual fields for display
  name?: string; // Alias for nama_prodi
  level?: "D3" | "S1" | "S2" | "S3";
  faculty?: string;
  students?: number;
  color?: string;
}

// Database Program Studi type (for Supabase)
export interface ProgramStudi {
  id: number;
  nama_prodi: string;
  jenjang: "D3" | "S1" | "S2" | "S3";
  id_fakultas: number;
  id_akreditasi?: number;
}

// Database Fakultas type (for Supabase)
export interface Fakultas {
  id: number;
  nama_fakultas: string;
  deskripsi_fakultas?: string;
  email?: string;
  website?: string;
  id_gedung_utama?: number;
}

// Database Mahasiswa type (for Supabase)
export interface Mahasiswa {
  id: number;
  nim: string;
  nama_mahasiswa: string;
  angkatan: number;
  status: string;
  id_prodi: number;
}

// Database Akreditasi type (for Supabase)
export interface AkreditasiDB {
  id: number;
  status: string;
  tgl_berlaku?: Date;
  tgl_kadaluarsa?: Date;
  keterangan?: string;
}

// Database Gedung type (for Supabase)
export interface Gedung {
  id: number;
  nama_gedung: string;
  deskripsi_gedung?: string;
  lokasi?: string;
}

// Database Fasilitas type (for Supabase)
export interface Fasilitas {
  id: number;
  nama_fasilitas: string;
  deskripsi_fasilitas?: string;
  tipe_fasilitas?: string;
  id_gedung: number;
  color?: string;
}

// Department/Research Group types for professors
export interface DepartmentData {
  id: string;
  name: string;
  faculty: string;
  professors: number;
  color?: string;
  description?: string;
}

// Assets/Facilities types
export interface AssetDetail {
  id: number | string;
  nama_fasilitas?: string;
  deskripsi_fasilitas?: string;
  tipe_fasilitas?: string;
  id_gedung?: number;
  color?: string;
  // Virtual fields for display
  name?: string; // Alias for nama_fasilitas
  room?: string;
  building?: string;
  capacity?: number;
  equipment?: string[];
  description?: string; // Alias for deskripsi_fasilitas
}

export interface AssetCategory {
  id: string;
  name: string;
  count: number;
  icon: string;
  color: string;
  details: AssetDetail[];
}

// API response types for future MySQL integration
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
