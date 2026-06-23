// @vitest-environment node
import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import express from "express";
import type { Application } from "express";
import type { Server } from "node:http";

/** Callback type for the thenable Supabase query mocks. */
type ThenCallback = (value: { data: unknown; error: unknown }) => unknown;

// 1. Setup mock data
const mockRooms = [
  {
    id: 1,
    nama_fasilitas: "Laboratorium Komputer",
    deskripsi_fasilitas: "Lab Komputer 1",
    tipe_fasilitas: "Laboratorium",
    id_gedung: 10,
    gedung: {
      nama_gedung: "Gedung FIK",
      lokasi: "Kampus Limo",
    },
  },
];

const mockBuildings = [
  {
    id: 10,
    nama_gedung: "Gedung FIK",
    deskripsi_gedung: "Fakultas Ilmu Komputer",
    lokasi: "Kampus Limo",
    fasilitas: [
      {
        id: 1,
        nama_fasilitas: "Laboratorium Komputer",
        deskripsi_fasilitas: "Lab Komputer 1",
        tipe_fasilitas: "Laboratorium",
        id_gedung: 10,
      },
    ],
  },
];

// 2. Intercept Express listen BEFORE importing the server
let serverInstance: Server | undefined;
const originalListen = express.application.listen;

express.application.listen = function (this: Application, ...args: unknown[]): Server {
  // Force ephemeral port
  args[0] = 0;
  serverInstance = (originalListen as (...a: unknown[]) => Server).apply(this, args);
  return serverInstance;
} as typeof express.application.listen;

// 3. Mock Supabase
vi.mock("@supabase/supabase-js", () => {
  const mockSingle = vi.fn().mockImplementation(async () => {
    return { data: mockRooms[0], error: null };
  });

  const mockEq = vi.fn().mockImplementation((col, val) => {
    if (col === "id" && val === 999) {
      return {
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
      };
    }
    return {
      single: mockSingle,
      eq: mockEq,
      then: (cb: ThenCallback) => Promise.resolve({ data: mockRooms, error: null }).then(cb),
    };
  });

  const mockSelect = vi.fn().mockImplementation((_query) => {
    return {
      eq: mockEq,
      single: mockSingle,
      then: (cb: ThenCallback) => {
        return Promise.resolve({ data: mockRooms, error: null }).then(cb);
      },
    };
  });

  const mockFrom = vi.fn().mockImplementation((table) => {
    if (table === "gedung") {
      return {
        select: vi.fn().mockImplementation(() => ({
          then: (cb: ThenCallback) => Promise.resolve({ data: mockBuildings, error: null }).then(cb),
        })),
      };
    }
    return {
      select: mockSelect,
    };
  });

  return {
    createClient: () => ({
      from: mockFrom,
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      },
    }),
  };
});

// Mock Umami Client to avoid connection attempts in test
vi.mock("@umami/api-client", () => {
  return {
    UmamiApiClient: class {
      login = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    },
  };
});

describe("Express API Server", () => {
  let baseUrl: string;

  beforeAll(async () => {
    // Set dummy env variables required by server
    process.env.PORT = "0";
    process.env.SUPABASE_URL = "http://localhost:54321";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "dummy-service-role-key";

    // Dynamically import to ensure overrides take effect
    await import("../../server/index.js");

    if (!serverInstance) {
      throw new Error("Server instance failed to start during import");
    }
    const address = serverInstance.address();
    const port = typeof address === "string" ? address : address?.port;
    baseUrl = `http://localhost:${port}`;
  });

  afterAll(() => {
    if (serverInstance) {
      serverInstance.close();
    }
  });

  test("GET /api/health returns status OK", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe("OK");
  });

  test("GET /api/rooms returns list of rooms formatted correctly", async () => {
    const res = await fetch(`${baseUrl}/api/rooms`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeInstanceOf(Array);
    expect(json.data[0].name).toBe("Laboratorium Komputer");
    expect(json.data[0].building).toBe("Gedung FIK");
  });

  test("GET /api/rooms/:id returns single room on valid ID", async () => {
    const res = await fetch(`${baseUrl}/api/rooms/1`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.name).toBe("Laboratorium Komputer");
  });

  test("GET /api/rooms/:id returns 400 on invalid room ID", async () => {
    const res = await fetch(`${baseUrl}/api/rooms/abc`);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.data.error).toBe("Invalid room ID");
  });

  test("GET /api/rooms/:id returns 500 when database error occurs", async () => {
    const res = await fetch(`${baseUrl}/api/rooms/999`);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  test("GET /api/buildings returns buildings and their nested rooms", async () => {
    const res = await fetch(`${baseUrl}/api/buildings`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data[0].name).toBe("Gedung FIK");
    expect(json.data[0].rooms[0].name).toBe("Laboratorium Komputer");
  });

  test("GET /api/buildings/:id/rooms returns rooms by building ID", async () => {
    const res = await fetch(`${baseUrl}/api/buildings/10/rooms`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data[0].name).toBe("Laboratorium Komputer");
  });

  test("GET /api/nonexistent-route returns 404", async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent-route`);
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.data.error).toBe("Endpoint not found");
  });
});
