import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database types based on schema.sql
export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: number;
          username: string;
          password_hash: string;
          nama_lengkap: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          username: string;
          password_hash: string;
          nama_lengkap?: string | null;
          role?: string;
        };
        Update: {
          username?: string;
          password_hash?: string;
          nama_lengkap?: string | null;
          role?: string;
        };
      };
      akreditasi: {
        Row: {
          id: number;
          status: string;
          tgl_berlaku: string | null;
          tgl_kadaluarsa: string | null;
          keterangan: string | null;
        };
        Insert: {
          status: string;
          tgl_berlaku?: string | null;
          tgl_kadaluarsa?: string | null;
          keterangan?: string | null;
        };
        Update: {
          status?: string;
          tgl_berlaku?: string | null;
          tgl_kadaluarsa?: string | null;
          keterangan?: string | null;
        };
      };
      gedung: {
        Row: {
          id: number;
          nama_gedung: string;
          deskripsi_gedung: string | null;
          lokasi: string | null;
        };
        Insert: {
          nama_gedung: string;
          deskripsi_gedung?: string | null;
          lokasi?: string | null;
        };
        Update: {
          nama_gedung?: string;
          deskripsi_gedung?: string | null;
          lokasi?: string | null;
        };
      };
      fakultas: {
        Row: {
          id: number;
          nama_fakultas: string;
          deskripsi_fakultas: string | null;
          email: string | null;
          website: string | null;
          id_gedung_utama: number | null;
        };
        Insert: {
          nama_fakultas: string;
          deskripsi_fakultas?: string | null;
          email?: string | null;
          website?: string | null;
          id_gedung_utama?: number | null;
        };
        Update: {
          nama_fakultas?: string;
          deskripsi_fakultas?: string | null;
          email?: string | null;
          website?: string | null;
          id_gedung_utama?: number | null;
        };
      };
      fasilitas: {
        Row: {
          id: number;
          nama_fasilitas: string;
          deskripsi_fasilitas: string | null;
          tipe_fasilitas: string | null;
          id_gedung: number;
        };
        Insert: {
          nama_fasilitas: string;
          deskripsi_fasilitas?: string | null;
          tipe_fasilitas?: string | null;
          id_gedung: number;
        };
        Update: {
          nama_fasilitas?: string;
          deskripsi_fasilitas?: string | null;
          tipe_fasilitas?: string | null;
          id_gedung?: number;
        };
      };
      program_studi: {
        Row: {
          id: number;
          nama_prodi: string;
          jenjang: string;
          id_fakultas: number;
          id_akreditasi: number | null;
        };
        Insert: {
          nama_prodi: string;
          jenjang: string;
          id_fakultas: number;
          id_akreditasi?: number | null;
        };
        Update: {
          nama_prodi?: string;
          jenjang?: string;
          id_fakultas?: number;
          id_akreditasi?: number | null;
        };
      };
      dosen: {
        Row: {
          id: number;
          nidn: string;
          nama_dosen: string;
          email: string | null;
          jabatan_fungsional: string | null;
          id_prodi: number;
        };
        Insert: {
          nidn: string;
          nama_dosen: string;
          email?: string | null;
          jabatan_fungsional?: string | null;
          id_prodi: number;
        };
        Update: {
          nidn?: string;
          nama_dosen?: string;
          email?: string | null;
          jabatan_fungsional?: string | null;
          id_prodi?: number;
        };
      };
      mahasiswa: {
        Row: {
          id: number;
          nim: string;
          nama_mahasiswa: string;
          angkatan: number;
          status: string;
          id_prodi: number;
        };
        Insert: {
          nim: string;
          nama_mahasiswa: string;
          angkatan: number;
          status?: string;
          id_prodi: number;
        };
        Update: {
          nim?: string;
          nama_mahasiswa?: string;
          angkatan?: number;
          status?: string;
          id_prodi?: number;
        };
      };
      web_analytics_log: {
        Row: {
          id: number;
          visitor_hash: string | null;
          page_path: string;
          device_type: string | null;
          visited_at: string;
        };
        Insert: {
          visitor_hash?: string | null;
          page_path: string;
          device_type?: string | null;
        };
        Update: {
          visitor_hash?: string | null;
          page_path?: string;
          device_type?: string | null;
        };
      };
    };
  };
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return {
    success: false,
    message: error.message || 'Terjadi kesalahan pada database',
    error: error,
  };
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
