import { describe, expect, it } from "vitest";
import type { CampusMapEdge, CampusMapNode } from "../types/campusMap";
import { findCampusRoute } from "./campusMapRouting";

const node = (id: number, x: number, y: number): CampusMapNode => ({
  id,
  mapId: 1,
  label: null,
  type: "path",
  x,
  y,
});

const edge = (
  id: number,
  fromNodeId: number,
  toNodeId: number,
  options: Partial<CampusMapEdge> = {},
): CampusMapEdge => ({
  id,
  mapId: 1,
  fromNodeId,
  toNodeId,
  bidirectional: true,
  accessible: true,
  weight: null,
  ...options,
});

describe("findCampusRoute", () => {
  it("memilih jalur dengan biaya paling rendah", () => {
    const nodes = [node(1, 0, 0), node(2, 0.5, 0), node(3, 1, 0), node(4, 0.5, 1)];
    const edges = [
      edge(1, 1, 2),
      edge(2, 2, 3),
      edge(3, 1, 4, { weight: 2000 }),
      edge(4, 4, 3, { weight: 2000 }),
    ];

    expect(findCampusRoute(nodes, edges, 1, 3).map(({ id }) => id)).toEqual([1, 2, 3]);
  });

  it("mengabaikan jalur nonaktif dan menghormati arah jalan", () => {
    const nodes = [node(1, 0, 0), node(2, 0.5, 0), node(3, 1, 0)];
    const edges = [
      edge(1, 1, 2, { accessible: false }),
      edge(2, 2, 3, { bidirectional: false }),
    ];

    expect(findCampusRoute(nodes, edges, 1, 3)).toEqual([]);
    expect(findCampusRoute(nodes, edges, 3, 2)).toEqual([]);
    expect(findCampusRoute(nodes, edges, 2, 3).map(({ id }) => id)).toEqual([2, 3]);
  });

  it("mengembalikan titik yang sama ketika asal dan tujuan identik", () => {
    const nodes = [node(1, 0.25, 0.25)];
    expect(findCampusRoute(nodes, [], 1, 1)).toEqual(nodes);
  });
});
