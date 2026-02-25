import { supabase } from "../../lib/supabase";

// Interface untuk data ruangan
export interface RoomData {
  id: number;
  name: string;
  description: string;
  building: string;
  buildingId: number;
  type: string;
  location?: string;
  floor?: number;
  photoUrl?: string;
}

export interface BuildingData {
  id: number;
  name: string;
  description: string;
  location: string;
  floorCount: number;
  rooms: RoomData[];
}

/**
 * Mengambil semua data ruangan dengan informasi gedung
 */
export const getAllRooms = async (): Promise<RoomData[]> => {
  try {
    const { data, error } = await supabase.from("fasilitas").select(`
        id,
        nama_fasilitas,
        deskripsi_fasilitas,
        tipe_fasilitas,
        id_gedung,
        lantai,
        foto_url,
        gedung (
          nama_gedung,
          lokasi
        )
      `);

    if (error) throw error;

    return data.map((room: any) => ({
      id: room.id,
      name: room.nama_fasilitas,
      description: room.deskripsi_fasilitas || "",
      building: room.gedung?.nama_gedung || "Unknown",
      buildingId: room.id_gedung,
      type: room.tipe_fasilitas || "Lainnya",
      location: room.gedung?.lokasi || "",
      floor: room.lantai || null,
      photoUrl: room.foto_url || null,
    }));
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

/**
 * Mengambil data ruangan berdasarkan ID
 */
export const getRoomById = async (roomId: number): Promise<RoomData | null> => {
  try {
    const { data, error } = await supabase
      .from("fasilitas")
      .select(
        `
        id,
        nama_fasilitas,
        deskripsi_fasilitas,
        tipe_fasilitas,
        id_gedung,
        gedung (
          nama_gedung,
          lokasi
        )
      `,
      )
      .eq("id", roomId)
      .single();

    if (error) throw error;

    const building = Array.isArray(data.gedung) ? data.gedung[0] : data.gedung;

    return {
      id: data.id,
      name: data.nama_fasilitas,
      description: data.deskripsi_fasilitas || "",
      building: building?.nama_gedung || "Unknown",
      buildingId: data.id_gedung,
      type: data.tipe_fasilitas || "Lainnya",
      location: building?.lokasi || "",
    };
  } catch (error) {
    console.error("Error fetching room:", error);
    return null;
  }
};

/**
 * Mengambil data gedung dengan semua ruangan di dalamnya
 */
export const getAllBuildings = async (): Promise<BuildingData[]> => {
  try {
    const { data, error } = await supabase.from("gedung").select(`
        id,
        nama_gedung,
        deskripsi_gedung,
        lokasi,
        jumlah_lantai,
        fasilitas (
          id,
          nama_fasilitas,
          deskripsi_fasilitas,
          tipe_fasilitas,
          id_gedung,
          lantai,
          foto_url
        )
      `);

    if (error) throw error;

    return data.map((building: any) => ({
      id: building.id,
      name: building.nama_gedung,
      description: building.deskripsi_gedung || "",
      location: building.lokasi || "",
      floorCount: building.jumlah_lantai || 1,
      rooms: (building.fasilitas || []).map((room: any) => ({
        id: room.id,
        name: room.nama_fasilitas,
        description: room.deskripsi_fasilitas || "",
        building: building.nama_gedung,
        buildingId: room.id_gedung,
        type: room.tipe_fasilitas || "Lainnya",
        floor: room.lantai || null,
        photoUrl: room.foto_url || null,
      })),
    }));
  } catch (error) {
    console.error("Error fetching buildings:", error);
    throw error;
  }
};

/**
 * Mengambil ruangan berdasarkan gedung
 */
export const getRoomsByBuilding = async (
  buildingId: number,
): Promise<RoomData[]> => {
  try {
    const { data, error } = await supabase
      .from("fasilitas")
      .select(
        `
        id,
        nama_fasilitas,
        deskripsi_fasilitas,
        tipe_fasilitas,
        id_gedung,
        lantai,
        foto_url,
        gedung (
          nama_gedung,
          lokasi
        )
      `,
      )
      .eq("id_gedung", buildingId);

    if (error) throw error;

    return data.map((room: any) => ({
      id: room.id,
      name: room.nama_fasilitas,
      description: room.deskripsi_fasilitas || "",
      building: room.gedung?.nama_gedung || "Unknown",
      buildingId: room.id_gedung,
      type: room.tipe_fasilitas || "Lainnya",
      location: room.gedung?.lokasi || "",
      floor: room.lantai || null,
      photoUrl: room.foto_url || null,
    }));
  } catch (error) {
    console.error("Error fetching rooms by building:", error);
    throw error;
  }
};

// ============================================
// Unity Integration - Data format untuk SendMessage
// ============================================

/**
 * Interface data mentah untuk Unity (nama kolom asli Supabase)
 * Agar C# [Serializable] class langsung match dengan JSON
 */
export interface UnityGedungData {
  id: number;
  nama_gedung: string;
  deskripsi_gedung: string;
  lokasi: string;
  jumlah_lantai: number;
}

export interface UnityFasilitasData {
  id: number;
  nama_fasilitas: string;
  deskripsi_fasilitas: string;
  tipe_fasilitas: string;
  id_gedung: number;
  lantai: number;
  foto_url: string;
}

export interface UnityBuildingsPayload {
  gedung: UnityGedungData[];
  fasilitas: UnityFasilitasData[];
}

/**
 * Mengambil data gedung + fasilitas dalam format mentah untuk Unity
 * Format JSON langsung match dengan C# data classes di Unity
 */
export const getBuildingsForUnity =
  async (): Promise<UnityBuildingsPayload> => {
    try {
      // Fetch gedung
      const { data: gedungData, error: gedungError } = await supabase
        .from("gedung")
        .select("id, nama_gedung, deskripsi_gedung, lokasi, jumlah_lantai")
        .order("id", { ascending: true });

      if (gedungError) throw gedungError;

      // Fetch fasilitas (tanpa color - tidak dibutuhkan Unity)
      const { data: fasilitasData, error: fasilitasError } = await supabase
        .from("fasilitas")
        .select(
          "id, nama_fasilitas, deskripsi_fasilitas, tipe_fasilitas, id_gedung, lantai, foto_url",
        )
        .order("id_gedung", { ascending: true })
        .order("lantai", { ascending: true });

      if (fasilitasError) throw fasilitasError;

      return {
        gedung: (gedungData || []).map((g: any) => ({
          id: g.id,
          nama_gedung: g.nama_gedung || "",
          deskripsi_gedung: g.deskripsi_gedung || "",
          lokasi: g.lokasi || "",
          jumlah_lantai: g.jumlah_lantai || 1,
        })),
        fasilitas: (fasilitasData || []).map((f: any) => ({
          id: f.id,
          nama_fasilitas: f.nama_fasilitas || "",
          deskripsi_fasilitas: f.deskripsi_fasilitas || "",
          tipe_fasilitas: f.tipe_fasilitas || "Lainnya",
          id_gedung: f.id_gedung,
          lantai: f.lantai || 1,
          foto_url: f.foto_url || "",
        })),
      };
    } catch (error) {
      console.error("Error fetching data for Unity:", error);
      throw error;
    }
  };
