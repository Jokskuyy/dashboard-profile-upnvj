import type { CampusMapEdge, CampusMapNode } from "../types/campusMap";

function distance(a: CampusMapNode, b: CampusMapNode): number {
  const dx = (a.x - b.x) * 1662;
  const dy = (a.y - b.y) * 946;
  return Math.hypot(dx, dy);
}

export function findCampusRoute(
  nodes: CampusMapNode[],
  edges: CampusMapEdge[],
  startNodeId: number,
  destinationNodeId: number,
): CampusMapNode[] {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const start = nodeById.get(startNodeId);
  const destination = nodeById.get(destinationNodeId);

  if (!start || !destination) return [];
  if (startNodeId === destinationNodeId) return [start];

  const adjacency = new Map<number, Array<{ nodeId: number; cost: number }>>();
  const connect = (from: number, to: number, edge: CampusMapEdge) => {
    const fromNode = nodeById.get(from);
    const toNode = nodeById.get(to);
    if (!fromNode || !toNode) return;

    const neighbours = adjacency.get(from) ?? [];
    neighbours.push({ nodeId: to, cost: edge.weight ?? distance(fromNode, toNode) });
    adjacency.set(from, neighbours);
  };

  edges.filter((edge) => edge.accessible).forEach((edge) => {
    connect(edge.fromNodeId, edge.toNodeId, edge);
    if (edge.bidirectional) connect(edge.toNodeId, edge.fromNodeId, edge);
  });

  const open = new Set<number>([startNodeId]);
  const cameFrom = new Map<number, number>();
  const gScore = new Map<number, number>([[startNodeId, 0]]);
  const fScore = new Map<number, number>([[startNodeId, distance(start, destination)]]);

  while (open.size > 0) {
    const current = [...open].reduce((best, candidate) =>
      (fScore.get(candidate) ?? Number.POSITIVE_INFINITY) <
      (fScore.get(best) ?? Number.POSITIVE_INFINITY)
        ? candidate
        : best,
    );

    if (current === destinationNodeId) {
      const routeIds = [current];
      let cursor = current;
      while (cameFrom.has(cursor)) {
        cursor = cameFrom.get(cursor)!;
        routeIds.unshift(cursor);
      }
      return routeIds.map((id) => nodeById.get(id)!).filter(Boolean);
    }

    open.delete(current);
    for (const neighbour of adjacency.get(current) ?? []) {
      const tentative =
        (gScore.get(current) ?? Number.POSITIVE_INFINITY) + neighbour.cost;
      if (tentative >= (gScore.get(neighbour.nodeId) ?? Number.POSITIVE_INFINITY)) continue;

      cameFrom.set(neighbour.nodeId, current);
      gScore.set(neighbour.nodeId, tentative);
      const neighbourNode = nodeById.get(neighbour.nodeId)!;
      fScore.set(neighbour.nodeId, tentative + distance(neighbourNode, destination));
      open.add(neighbour.nodeId);
    }
  }

  return [];
}
