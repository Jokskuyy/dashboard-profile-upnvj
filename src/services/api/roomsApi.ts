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
}

export interface BuildingData {
  id: number;
  name: string;
  description: string;
  location: string;
  rooms: RoomData[];
}

/**
 * Mengambil semua data ruangan dengan informasi gedung
 */
export const getAllRooms = async (): Promise<RoomData[]> => {
  try {
    const { data, error } = await supabase
      .from("fasilitas")
      .select(`
        id,
        nama_fasilitas,
        deskripsi_fasilitas,
        tipe_fasilitas,
        id_gedung,
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
      .select(`
        id,
        nama_fasilitas,
        deskripsi_fasilitas,
        tipe_fasilitas,
        id_gedung,
        gedung (
          nama_gedung,
          lokasi
        )
      `)
      .eq("id", roomId)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.nama_fasilitas,
      description: data.deskripsi_fasilitas || "",
      building: data.gedung?.nama_gedung || "Unknown",
      buildingId: data.id_gedung,
      type: data.tipe_fasilitas || "Lainnya",
      location: data.gedung?.lokasi || "",
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
    const { data, error } = await supabase
      .from("gedung")
      .select(`
        id,
        nama_gedung,
        deskripsi_gedung,
        lokasi,
        fasilitas (
          id,
          nama_fasilitas,
          deskripsi_fasilitas,
          tipe_fasilitas,
          id_gedung
        )
      `);

    if (error) throw error;

    return data.map((building: any) => ({
      id: building.id,
      name: building.nama_gedung,
      description: building.deskripsi_gedung || "",
      location: building.lokasi || "",
      rooms: (building.fasilitas || []).map((room: any) => ({
        id: room.id,
        name: room.nama_fasilitas,
        description: room.deskripsi_fasilitas || "",
        building: building.nama_gedung,
        buildingId: room.id_gedung,
        type: room.tipe_fasilitas || "Lainnya",
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
  buildingId: number
): Promise<RoomData[]> => {
  try {
    const { data, error } = await supabase
      .from("fasilitas")
      .select(`
        id,
        nama_fasilitas,
        deskripsi_fasilitas,
        tipe_fasilitas,
        id_gedung,
        gedung (
          nama_gedung,
          lokasi
        )
      `)
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
    }));
  } catch (error) {
    console.error("Error fetching rooms by building:", error);
    throw error;
  }
};
