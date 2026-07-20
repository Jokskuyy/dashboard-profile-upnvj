import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  LocateFixed,
  MapPin,
  Maximize2,
  Minimize2,
  Route,
} from "lucide-react";
import { fetchActiveCampusMap } from "../../services/campusMapService";
import type { SearchResult } from "../../hooks/useBuildingSearch";
import type { CampusMapData } from "../../types/campusMap";
import { CAMPUS_MAP_HEIGHT, CAMPUS_MAP_WIDTH } from "../../types/campusMap";
import { findCampusRoute } from "../../utils/campusMapRouting";
import SearchOverlay from "./SearchOverlay";

interface CampusMap2DProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const CampusMap2D: React.FC<CampusMap2DProps> = ({
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [mapData, setMapData] = useState<CampusMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [spawnBuildingId, setSpawnBuildingId] = useState<number | null>(null);
  const [destinationBuildingId, setDestinationBuildingId] = useState<number | null>(null);
  const [status, setStatus] = useState("Pilih gedung awal, lalu cari ruangan atau gedung tujuan.");

  useEffect(() => {
    let active = true;
    fetchActiveCampusMap()
      .then((data) => {
        if (!active) return;
        setMapData(data);
        if (!data) {
          setLoadError("Titik denah belum dikonfigurasi. Admin perlu menjalankan migrasi dan menandai gedung.");
          return;
        }
        const firstSpawn = data.buildings.find((building) => building.entranceNodeId !== null);
        if (firstSpawn) setSpawnBuildingId(firstSpawn.buildingId);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error("[CampusMap2D] Gagal memuat denah:", error);
        setLoadError("Gagal memuat konfigurasi jalur denah 2D.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const spawnOptions = useMemo(
    () => mapData?.buildings.filter((building) => building.entranceNodeId !== null) ?? [],
    [mapData],
  );

  const spawn = mapData?.buildings.find((building) => building.buildingId === spawnBuildingId);
  const destination = mapData?.buildings.find(
    (building) => building.buildingId === destinationBuildingId,
  );

  const routeNodes = useMemo(() => {
    if (!mapData || !spawn?.entranceNodeId || !destination?.entranceNodeId) return [];
    return findCampusRoute(
      mapData.nodes,
      mapData.edges,
      spawn.entranceNodeId,
      destination.entranceNodeId,
    );
  }, [destination, mapData, spawn]);

  useEffect(() => {
    if (!destination) return;
    if (!spawn) {
      setStatus("Pilih gedung awal terlebih dahulu.");
    } else if (!destination.entranceNodeId) {
      setStatus(`Pintu masuk ${destination.buildingName} belum ditandai oleh admin.`);
    } else if (spawn.buildingId === destination.buildingId) {
      setStatus(`Anda sudah berada di ${destination.buildingName}.`);
    } else if (routeNodes.length === 0) {
      setStatus(`Belum ada jalur yang tersambung menuju ${destination.buildingName}.`);
    } else {
      setStatus(`Rute dari ${spawn.buildingName} menuju ${destination.buildingName}.`);
    }
  }, [destination, routeNodes.length, spawn]);

  const handleNavigate = useCallback(
    (result: SearchResult) => {
      const target = mapData?.buildings.find(
        (building) => building.buildingId === result.buildingId,
      );
      if (!target) {
        setDestinationBuildingId(null);
        setStatus(
          `${result.sublabel || result.label} belum memiliki posisi pada denah 2D.`,
        );
        return;
      }
      setDestinationBuildingId(target.buildingId);
    },
    [mapData],
  );

  const clearRoute = useCallback(() => {
    setDestinationBuildingId(null);
    setStatus("Pilih gedung awal, lalu cari ruangan atau gedung tujuan.");
  }, []);

  const mapImageUrl = mapData?.map.imageUrl || `${import.meta.env.BASE_URL}maps/denah-2d.png`;
  const viewBoxWidth = mapData?.map.imageWidth || CAMPUS_MAP_WIDTH;
  const viewBoxHeight = mapData?.map.imageHeight || CAMPUS_MAP_HEIGHT;
  const routePoints = routeNodes
    .map((node) => `${node.x * viewBoxWidth},${node.y * viewBoxHeight}`)
    .join(" ");

  return (
    <div
      className={`relative overflow-hidden bg-[#07131d] ${
        isFullscreen ? "w-full h-full" : "rounded-xl shadow-lg"
      }`}
    >
      <div className={`relative w-full ${isFullscreen ? "h-full" : "aspect-[1662/946] min-h-[420px]"}`}>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Denah 2D kampus UPN Veteran Jakarta"
        >
          <image href={mapImageUrl} width={viewBoxWidth} height={viewBoxHeight} />

          {mapData?.edges.map((edge) => {
            const from = mapData.nodes.find((node) => node.id === edge.fromNodeId);
            const to = mapData.nodes.find((node) => node.id === edge.toNodeId);
            if (!from || !to) return null;
            return (
              <line
                key={edge.id}
                x1={from.x * viewBoxWidth}
                y1={from.y * viewBoxHeight}
                x2={to.x * viewBoxWidth}
                y2={to.y * viewBoxHeight}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {routePoints && (
            <>
              <polyline
                points={routePoints}
                fill="none"
                stroke="rgba(0,0,0,0.65)"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                points={routePoints}
                fill="none"
                stroke="#4ade80"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="16 10"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}

          {mapData?.buildings.map((building) => {
            const selected = building.buildingId === destinationBuildingId;
            const isSpawn = building.buildingId === spawnBuildingId;
            return (
              <g
                key={building.id}
                transform={`translate(${building.markerX * viewBoxWidth} ${building.markerY * viewBoxHeight})`}
                className="cursor-pointer"
                onClick={() => setDestinationBuildingId(building.buildingId)}
              >
                <circle
                  r={selected || isSpawn ? 18 : 13}
                  fill={selected ? "#ef4444" : isSpawn ? "#22c55e" : "#f8fafc"}
                  stroke="#07131d"
                  strokeWidth="4"
                  vectorEffect="non-scaling-stroke"
                />
                <circle r="4" fill="#07131d" />
                <title>{building.buildingName}</title>
              </g>
            );
          })}
        </svg>

        {!loading && <SearchOverlay isUnityLoaded onNavigate={handleNavigate} onCancelNavigation={clearRoute} />}

        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-2 sm:right-auto sm:w-[360px]">
          <div className="rounded-xl border border-white/15 bg-black/75 p-3 text-white shadow-xl backdrop-blur-md">
            <label htmlFor="campus-spawn-building" className="mb-1.5 flex items-center gap-2 text-xs font-semibold">
              <LocateFixed className="h-4 w-4 text-green-400" />
              Mulai dari gedung
            </label>
            <select
              id="campus-spawn-building"
              value={spawnBuildingId ?? ""}
              onChange={(event) => setSpawnBuildingId(Number(event.target.value) || null)}
              className="w-full rounded-lg border border-white/20 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-400"
              disabled={spawnOptions.length === 0}
            >
              <option value="">Pilih posisi awal</option>
              {spawnOptions.map((building) => (
                <option key={building.id} value={building.buildingId}>
                  {building.buildingName}
                </option>
              ))}
            </select>
            <div className="mt-2 flex items-start gap-2 text-xs text-white/80">
              <Route className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />
              <span>{loadError || status}</span>
            </div>
          </div>
        </div>

        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="absolute bottom-4 right-4 z-20 rounded-xl border border-white/15 bg-black/70 p-3 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/90"
            aria-label={isFullscreen ? "Keluar dari layar penuh" : "Buka layar penuh"}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        )}

        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#07131d] text-white">
            <div className="text-center">
              <MapPin className="mx-auto mb-3 h-8 w-8 animate-bounce text-green-400" />
              <p className="text-sm">Memuat denah 2D...</p>
            </div>
          </div>
        )}
      </div>

      {!isFullscreen && (
        <div className="flex items-center gap-2 border-t border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          <Building2 className="h-4 w-4 text-[#2C5F2D]" />
          Pilih gedung awal, lalu gunakan pencarian untuk menampilkan rute.
        </div>
      )}
    </div>
  );
};

export default CampusMap2D;
