import { supabase } from "../lib/supabase";
import type {
  CampusBuildingOption,
  CampusBuildingPoint,
  CampusMapData,
  CampusMapEdge,
  CampusMapNode,
  CampusMapNodeType,
} from "../types/campusMap";

interface RawCampusMap {
  id: number;
  nama: string;
  image_url: string;
  image_width: number;
  image_height: number;
}

interface RawNode {
  id: number;
  map_id: number;
  label: string | null;
  node_type: CampusMapNodeType;
  x: number;
  y: number;
}

interface RawEdge {
  id: number;
  map_id: number;
  from_node_id: number;
  to_node_id: number;
  bidirectional: boolean;
  accessible: boolean;
  weight: number | null;
}

interface RawBuildingPoint {
  id: number;
  map_id: number;
  gedung_id: number;
  marker_x: number;
  marker_y: number;
  entrance_node_id: number | null;
}

const toNode = (node: RawNode): CampusMapNode => ({
  id: node.id,
  mapId: node.map_id,
  label: node.label,
  type: node.node_type,
  x: Number(node.x),
  y: Number(node.y),
});

const toEdge = (edge: RawEdge): CampusMapEdge => ({
  id: edge.id,
  mapId: edge.map_id,
  fromNodeId: edge.from_node_id,
  toNodeId: edge.to_node_id,
  bidirectional: edge.bidirectional,
  accessible: edge.accessible,
  weight: edge.weight === null ? null : Number(edge.weight),
});

export async function fetchActiveCampusMap(): Promise<CampusMapData | null> {
  const { data: mapRow, error: mapError } = await supabase
    .from("campus_maps")
    .select("id,nama,image_url,image_width,image_height")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (mapError) {
    console.warn("[CampusMap2D] Tabel denah belum tersedia:", mapError.message);
    return null;
  }
  if (!mapRow) return null;

  const map = mapRow as RawCampusMap;
  const [nodesResult, edgesResult, pointsResult, buildingsResult] = await Promise.all([
    supabase.from("campus_map_nodes").select("id,map_id,label,node_type,x,y").eq("map_id", map.id),
    supabase
      .from("campus_map_edges")
      .select("id,map_id,from_node_id,to_node_id,bidirectional,accessible,weight")
      .eq("map_id", map.id),
    supabase
      .from("campus_map_building_points")
      .select("id,map_id,gedung_id,marker_x,marker_y,entrance_node_id")
      .eq("map_id", map.id),
    supabase.from("gedung").select("id,nama_gedung"),
  ]);

  const firstError = nodesResult.error || edgesResult.error || pointsResult.error || buildingsResult.error;
  if (firstError) throw firstError;

  const buildingNameById = new Map(
    (buildingsResult.data ?? []).map((building) => [building.id, building.nama_gedung]),
  );
  const buildingPoints: CampusBuildingPoint[] = (
    (pointsResult.data ?? []) as RawBuildingPoint[]
  ).map((point) => ({
    id: point.id,
    mapId: point.map_id,
    buildingId: point.gedung_id,
    buildingName: buildingNameById.get(point.gedung_id) ?? `Gedung #${point.gedung_id}`,
    markerX: Number(point.marker_x),
    markerY: Number(point.marker_y),
    entranceNodeId: point.entrance_node_id,
  }));

  return {
    map: {
      id: map.id,
      name: map.nama,
      imageUrl: map.image_url,
      imageWidth: map.image_width,
      imageHeight: map.image_height,
    },
    nodes: ((nodesResult.data ?? []) as RawNode[]).map(toNode),
    edges: ((edgesResult.data ?? []) as RawEdge[]).map(toEdge),
    buildings: buildingPoints,
  };
}

export async function fetchCampusBuildingOptions(): Promise<CampusBuildingOption[]> {
  const { data, error } = await supabase
    .from("gedung")
    .select("id,nama_gedung")
    .order("nama_gedung");
  if (error) throw error;
  return (data ?? []).map((building) => ({ id: building.id, name: building.nama_gedung }));
}

export async function upsertBuildingMarker(
  mapId: number,
  buildingId: number,
  x: number,
  y: number,
): Promise<void> {
  const { error } = await supabase.from("campus_map_building_points").upsert(
    { map_id: mapId, gedung_id: buildingId, marker_x: x, marker_y: y },
    { onConflict: "map_id,gedung_id" },
  );
  if (error) throw error;
}

export async function addCampusMapNode(
  mapId: number,
  type: CampusMapNodeType,
  x: number,
  y: number,
  label?: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("campus_map_nodes")
    .insert({ map_id: mapId, node_type: type, x, y, label: label || null })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function setBuildingEntrance(
  mapId: number,
  buildingId: number,
  nodeId: number,
  fallbackX: number,
  fallbackY: number,
): Promise<void> {
  const { error } = await supabase.from("campus_map_building_points").upsert(
    {
      map_id: mapId,
      gedung_id: buildingId,
      entrance_node_id: nodeId,
      marker_x: fallbackX,
      marker_y: fallbackY,
    },
    { onConflict: "map_id,gedung_id" },
  );
  if (error) throw error;
}

export async function addCampusMapEdge(
  mapId: number,
  fromNodeId: number,
  toNodeId: number,
): Promise<void> {
  const { error } = await supabase.from("campus_map_edges").upsert(
    {
      map_id: mapId,
      from_node_id: fromNodeId,
      to_node_id: toNodeId,
      bidirectional: true,
      accessible: true,
    },
    { onConflict: "map_id,from_node_id,to_node_id" },
  );
  if (error) throw error;
}

export async function deleteCampusMapNode(nodeId: number): Promise<void> {
  const { error } = await supabase.from("campus_map_nodes").delete().eq("id", nodeId);
  if (error) throw error;
}

export async function deleteCampusMapEdge(edgeId: number): Promise<void> {
  const { error } = await supabase.from("campus_map_edges").delete().eq("id", edgeId);
  if (error) throw error;
}
