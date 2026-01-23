// File ini untuk membuat endpoint public yang bisa diakses Unity
import { getAllRooms, getRoomById, getAllBuildings } from "./roomsApi";

// Fungsi helper untuk response
const createResponse = (data: any, success: boolean = true) => {
  return {
    success,
    data,
    timestamp: new Date().toISOString(),
  };
};

// Export fungsi untuk digunakan di routing
export const publicRoomsAPI = {
  // GET /api/rooms - Semua ruangan
  getAllRooms: async () => {
    try {
      const rooms = await getAllRooms();
      return createResponse(rooms);
    } catch (error) {
      return createResponse({ error: (error as Error).message }, false);
    }
  },

  // GET /api/rooms/:id - Ruangan by ID
  getRoomById: async (id: number) => {
    try {
      const room = await getRoomById(id);
      return createResponse(room);
    } catch (error) {
      return createResponse({ error: (error as Error).message }, false);
    }
  },

  // GET /api/buildings - Semua gedung dengan ruangan
  getAllBuildings: async () => {
    try {
      const buildings = await getAllBuildings();
      return createResponse(buildings);
    } catch (error) {
      return createResponse({ error: (error as Error).message }, false);
    }
  },
};
