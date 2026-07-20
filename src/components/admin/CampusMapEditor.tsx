import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  DoorOpen,
  GitBranch,
  Link2,
  MapPin,
  MousePointer2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  addCampusMapEdge,
  addCampusMapNode,
  deleteCampusMapEdge,
  deleteCampusMapNode,
  fetchActiveCampusMap,
  fetchCampusBuildingOptions,
  setBuildingEntrance,
  upsertBuildingMarker,
} from "../../services/campusMapService";
import type {
  CampusBuildingOption,
  CampusMapData,
  CampusMapNode,
} from "../../types/campusMap";

type EditorTool = "marker" | "entrance" | "path" | "connect" | "delete";

const TOOL_HELP: Record<EditorTool, string> = {
  marker: "Pilih gedung lalu klik bagian tengah atap untuk meletakkan pointer.",
  entrance: "Pilih gedung lalu klik pintu masuk yang tersambung ke jalur pejalan kaki.",
  path: "Klik di tengah jalan pada setiap belokan atau persimpangan.",
  connect: "Klik dua titik secara berurutan untuk membuat jalan dua arah.",
  delete: "Klik titik atau garis yang ingin dihapus.",
};

export default function CampusMapEditor() {
  const [mapData, setMapData] = useState<CampusMapData | null>(null);
  const [buildings, setBuildings] = useState<CampusBuildingOption[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [tool, setTool] = useState<EditorTool>("marker");
  const [connectFrom, setConnectFrom] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [map, buildingOptions] = await Promise.all([
        fetchActiveCampusMap(),
        fetchCampusBuildingOptions(),
      ]);
      setMapData(map);
      setBuildings(buildingOptions);
      setSelectedBuildingId((current) => current ?? buildingOptions[0]?.id ?? null);
      if (!map) {
        setError("Tabel denah belum tersedia. Jalankan database/003_campus_map_2d.sql di Supabase terlebih dahulu.");
      }
    } catch (loadError) {
      console.error(loadError);
      setError("Gagal memuat editor denah. Pastikan migrasi database sudah dijalankan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setConnectFrom(null);
  }, [tool]);

  const selectedBuilding = useMemo(
    () => buildings.find((building) => building.id === selectedBuildingId),
    [buildings, selectedBuildingId],
  );

  const runSave = async (operation: () => Promise<void>, successMessage: string) => {
    setSaving(true);
    setError(null);
    try {
      await operation();
      setMessage(successMessage);
      await loadData();
    } catch (saveError) {
      console.error(saveError);
      setError("Perubahan gagal disimpan. Periksa koneksi dan kebijakan Supabase.");
    } finally {
      setSaving(false);
    }
  };

  const getMapPoint = (event: React.MouseEvent<SVGSVGElement>) => {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix || !mapData) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return {
      x: Math.min(1, Math.max(0, point.x / mapData.map.imageWidth)),
      y: Math.min(1, Math.max(0, point.y / mapData.map.imageHeight)),
    };
  };

  const handleMapClick = async (event: React.MouseEvent<SVGSVGElement>) => {
    if (!mapData || saving || tool === "connect" || tool === "delete") return;
    const point = getMapPoint(event);
    if (!point) return;

    if ((tool === "marker" || tool === "entrance") && !selectedBuildingId) {
      setError("Pilih gedung terlebih dahulu.");
      return;
    }

    if (tool === "marker") {
      await runSave(
        () => upsertBuildingMarker(mapData.map.id, selectedBuildingId!, point.x, point.y),
        `Pointer ${selectedBuilding?.name ?? "gedung"} disimpan.`,
      );
      return;
    }

    if (tool === "entrance") {
      await runSave(async () => {
        const nodeId = await addCampusMapNode(
          mapData.map.id,
          "building_entrance",
          point.x,
          point.y,
          `Pintu ${selectedBuilding?.name ?? "gedung"}`,
        );
        const existing = mapData.buildings.find(
          (building) => building.buildingId === selectedBuildingId,
        );
        await setBuildingEntrance(
          mapData.map.id,
          selectedBuildingId!,
          nodeId,
          existing?.markerX ?? point.x,
          existing?.markerY ?? point.y,
        );
      }, `Pintu ${selectedBuilding?.name ?? "gedung"} disimpan.`);
      return;
    }

    await runSave(
      () => addCampusMapNode(mapData.map.id, "path", point.x, point.y).then(() => undefined),
      "Titik jalan ditambahkan.",
    );
  };

  const handleNodeClick = async (
    event: React.MouseEvent<SVGGElement>,
    node: CampusMapNode,
  ) => {
    event.stopPropagation();
    if (!mapData || saving) return;

    if (tool === "delete") {
      await runSave(() => deleteCampusMapNode(node.id), "Titik dihapus.");
      return;
    }

    if (tool !== "connect") return;
    if (connectFrom === null) {
      setConnectFrom(node.id);
      setMessage("Titik pertama dipilih. Klik titik tujuan.");
      return;
    }
    if (connectFrom === node.id) {
      setConnectFrom(null);
      setMessage("Pemilihan titik dibatalkan.");
      return;
    }

    const fromNode = connectFrom;
    setConnectFrom(null);
    await runSave(
      () => addCampusMapEdge(mapData.map.id, fromNode, node.id),
      "Jalur berhasil dihubungkan.",
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center text-slate-500">
        <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Memuat editor denah...
      </div>
    );
  }

  if (!mapData) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        {error}
      </div>
    );
  }

  const toolButtons: Array<{ id: EditorTool; label: string; icon: React.ElementType }> = [
    { id: "marker", label: "Pointer Gedung", icon: Building2 },
    { id: "entrance", label: "Pintu Gedung", icon: DoorOpen },
    { id: "path", label: "Titik Jalan", icon: GitBranch },
    { id: "connect", label: "Hubungkan", icon: Link2 },
    { id: "delete", label: "Hapus", icon: Trash2 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <label className="flex-1 text-sm font-semibold text-slate-700">
          Gedung yang ditandai
          <select
            value={selectedBuildingId ?? ""}
            onChange={(event) => setSelectedBuildingId(Number(event.target.value) || null)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={loadData}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" /> Muat ulang
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {toolButtons.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTool(id)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              tool === id
                ? id === "delete"
                  ? "bg-red-600 text-white"
                  : "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
        <MousePointer2 className="mr-2 inline h-4 w-4" />
        {TOOL_HELP[tool]}
      </div>

      {(message || error) && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#07131d]">
        <svg
          viewBox={`0 0 ${mapData.map.imageWidth} ${mapData.map.imageHeight}`}
          className={`block h-auto w-full ${
            tool === "delete" ? "cursor-not-allowed" : "cursor-crosshair"
          }`}
          onClick={handleMapClick}
          role="application"
          aria-label="Editor titik dan jalur denah kampus"
        >
          <image
            href={mapData.map.imageUrl}
            width={mapData.map.imageWidth}
            height={mapData.map.imageHeight}
          />

          {mapData.edges.map((edge) => {
            const from = mapData.nodes.find((node) => node.id === edge.fromNodeId);
            const to = mapData.nodes.find((node) => node.id === edge.toNodeId);
            if (!from || !to) return null;
            return (
              <line
                key={edge.id}
                x1={from.x * mapData.map.imageWidth}
                y1={from.y * mapData.map.imageHeight}
                x2={to.x * mapData.map.imageWidth}
                y2={to.y * mapData.map.imageHeight}
                stroke={tool === "delete" ? "#ef4444" : "#38bdf8"}
                strokeWidth="5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className={tool === "delete" ? "cursor-pointer" : "pointer-events-none"}
                onClick={(event) => {
                  if (tool !== "delete") return;
                  event.stopPropagation();
                  runSave(() => deleteCampusMapEdge(edge.id), "Jalur dihapus.");
                }}
              />
            );
          })}

          {mapData.nodes.map((node) => {
            const selected = node.id === connectFrom;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x * mapData.map.imageWidth} ${node.y * mapData.map.imageHeight})`}
                onClick={(event) => handleNodeClick(event, node)}
                className="cursor-pointer"
              >
                <circle
                  r={selected ? 13 : 9}
                  fill={
                    selected
                      ? "#facc15"
                      : node.type === "building_entrance"
                        ? "#fb923c"
                        : "#38bdf8"
                  }
                  stroke="#ffffff"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
                <title>{node.label || `Titik jalan #${node.id}`}</title>
              </g>
            );
          })}

          {mapData.buildings.map((building) => (
            <g
              key={building.id}
              transform={`translate(${building.markerX * mapData.map.imageWidth} ${building.markerY * mapData.map.imageHeight})`}
              className="pointer-events-none"
            >
              <circle r="14" fill="#22c55e" stroke="#ffffff" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              <MapPin x="-8" y="-8" width="16" height="16" color="#ffffff" />
              <title>{building.buildingName}</title>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-3">{mapData.buildings.length} gedung ditandai</div>
        <div className="rounded-lg bg-slate-50 p-3">{mapData.nodes.length} titik jalur</div>
        <div className="rounded-lg bg-slate-50 p-3">{mapData.edges.length} sambungan jalan</div>
      </div>
    </div>
  );
}
