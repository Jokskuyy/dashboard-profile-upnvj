// Language types
export type Language = "id" | "en";


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
  jumlah_lantai?: number;
  unity_object_name?: string;
  foto_url?: string;
}

// Database Fasilitas type (for Supabase)
export interface Fasilitas {
  id: number;
  nama_fasilitas: string;
  deskripsi_fasilitas: string;
  tipe_fasilitas: string;
  id_gedung: number;
  color: string;
  lantai?: number;
  foto_url?: string;
  unity_object_name?: string;
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
  lantai?: number;
  foto_url?: string;
  unity_object_name?: string;
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
