import { createClient } from '@supabase/supabase-js';
import { env } from '../utils/env';

// Create Supabase client with validated environment variables
export const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
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
          jumlah_lantai: number | null;
        };
        Insert: {
          nama_gedung: string;
          deskripsi_gedung?: string | null;
          lokasi?: string | null;
          jumlah_lantai?: number | null;
        };
        Update: {
          nama_gedung?: string;
          deskripsi_gedung?: string | null;
          lokasi?: string | null;
          jumlah_lantai?: number | null;
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
          color: string | null;
          lantai: number | null;
          foto_url: string | null;
        };
        Insert: {
          nama_fasilitas: string;
          deskripsi_fasilitas?: string | null;
          tipe_fasilitas?: string | null;
          id_gedung: number;
          color?: string | null;
          lantai?: number | null;
          foto_url?: string | null;
        };
        Update: {
          nama_fasilitas?: string;
          deskripsi_fasilitas?: string | null;
          tipe_fasilitas?: string | null;
          id_gedung?: number;
          color?: string | null;
          lantai?: number | null;
          foto_url?: string | null;
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
      audit_logs: {
        Row: {
          id: number;
          actor_id: string | null;
          actor_email: string | null;
          action: string;
          table_name: string;
          record_id: string | null;
          old_data: Record<string, unknown> | null;
          new_data: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          actor_id?: string | null;
          actor_email?: string | null;
          action: string;
          table_name: string;
          record_id?: string | null;
          old_data?: Record<string, unknown> | null;
          new_data?: Record<string, unknown> | null;
        };
        Update: {
          actor_id?: string | null;
          actor_email?: string | null;
          action?: string;
          table_name?: string;
          record_id?: string | null;
          old_data?: Record<string, unknown> | null;
          new_data?: Record<string, unknown> | null;
        };
      };
    };
  };
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: unknown) => {
  console.error('Supabase error:', error);
  const message = error instanceof Error ? error.message : 'Terjadi kesalahan pada database';
  return {
    success: false,
    message,
    error,
  };
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
