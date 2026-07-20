export const CAMPUS_MAP_WIDTH = 1662;
export const CAMPUS_MAP_HEIGHT = 946;

export type CampusMapNodeType = "path" | "building_entrance" | "gate";

export interface CampusMapDefinition {
  id: number;
  name: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
}

export interface CampusMapNode {
  id: number;
  mapId: number;
  label: string | null;
  type: CampusMapNodeType;
  x: number;
  y: number;
}

export interface CampusMapEdge {
  id: number;
  mapId: number;
  fromNodeId: number;
  toNodeId: number;
  bidirectional: boolean;
  accessible: boolean;
  weight: number | null;
}

export interface CampusBuildingPoint {
  id: number;
  mapId: number;
  buildingId: number;
  buildingName: string;
  markerX: number;
  markerY: number;
  entranceNodeId: number | null;
}

export interface CampusMapData {
  map: CampusMapDefinition;
  nodes: CampusMapNode[];
  edges: CampusMapEdge[];
  buildings: CampusBuildingPoint[];
}

export interface CampusBuildingOption {
  id: number;
  name: string;
}
