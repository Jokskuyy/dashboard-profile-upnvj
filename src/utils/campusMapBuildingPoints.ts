import type {
  CampusBuildingPoint,
  CampusMapNode,
} from "../types/campusMap";

interface CampusBuildingRecord {
  id: number;
  name: string;
}

const normalizeLocationName = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("id-ID")
    .replace(/^pintu\s+/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export function deriveCampusBuildingPoints(
  mapId: number,
  nodes: CampusMapNode[],
  buildings: CampusBuildingRecord[],
): CampusBuildingPoint[] {
  const entrancesByName = new Map<string, CampusMapNode[]>();

  nodes
    .filter((node) => node.type === "building_entrance" && node.label)
    .forEach((node) => {
      const name = normalizeLocationName(node.label!);
      const entrances = entrancesByName.get(name) ?? [];
      entrances.push(node);
      entrancesByName.set(name, entrances);
    });

  return buildings.flatMap((building) => {
    const entrances = entrancesByName.get(normalizeLocationName(building.name));
    if (!entrances?.length) return [];

    const markerX =
      entrances.reduce((total, entrance) => total + entrance.x, 0) /
      entrances.length;
    const markerY =
      entrances.reduce((total, entrance) => total + entrance.y, 0) /
      entrances.length;
    const primaryEntrance = [...entrances].sort((a, b) => a.id - b.id)[0];

    return [
      {
        id: -building.id,
        mapId,
        buildingId: building.id,
        buildingName: building.name,
        markerX,
        markerY,
        entranceNodeId: primaryEntrance.id,
      },
    ];
  });
}
