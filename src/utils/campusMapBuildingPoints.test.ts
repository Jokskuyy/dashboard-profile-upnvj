import { describe, expect, it } from "vitest";
import type { CampusMapNode } from "../types/campusMap";
import { deriveCampusBuildingPoints } from "./campusMapBuildingPoints";

const entrance = (
  id: number,
  label: string,
  x: number,
  y: number,
): CampusMapNode => ({
  id,
  mapId: 1,
  label,
  type: "building_entrance",
  x,
  y,
});

describe("deriveCampusBuildingPoints", () => {
  it("membuat marker dari rata-rata semua pintu gedung yang cocok", () => {
    const points = deriveCampusBuildingPoints(
      1,
      [
        entrance(8, "Pintu Gedung Ki Hadjar Dewantara", 0.2, 0.4),
        entrance(9, "Pintu Gedung Ki Hadjar Dewantara", 0.4, 0.6),
      ],
      [{ id: 6, name: "Gedung Ki Hadjar Dewantara" }],
    );

    expect(points).toHaveLength(1);
    expect(points[0]).toEqual(
      expect.objectContaining({
        id: -6,
        buildingId: 6,
        markerY: 0.5,
        entranceNodeId: 8,
      }),
    );
    expect(points[0].markerX).toBeCloseTo(0.3);
  });

  it("mencocokkan nama dengan kapitalisasi dan tanda baca berbeda", () => {
    const points = deriveCampusBuildingPoints(
      1,
      [entrance(5, "Pintu Gedung DR. Soepomo", 0.7, 0.6)],
      [{ id: 2, name: "Gedung Dr Soepomo" }],
    );

    expect(points[0]?.entranceNodeId).toBe(5);
  });

  it("tidak membuat marker jika gedung belum memiliki titik pintu", () => {
    expect(
      deriveCampusBuildingPoints(1, [], [
        { id: 15, name: "Gedung Kuliah dan Kegiatan Mahasiswa" },
      ]),
    ).toEqual([]);
  });
});
