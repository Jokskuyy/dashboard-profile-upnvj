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

const getBuildingLabelLines = (buildingName: string): string[] => {
  const label = buildingName
    .replace(/^Gedung\s+/i, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();

  if (label.length <= 22) return [label];

  const words = label.split(/\s+/);
  let splitAt = 1;
  let smallestDifference = Number.POSITIVE_INFINITY;

  for (let index = 1; index < words.length; index += 1) {
    const firstLength = words.slice(0, index).join(" ").length;
    const secondLength = words.slice(index).join(" ").length;
    const difference = Math.abs(firstLength - secondLength);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      splitAt = index;
    }
  }

  return [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")];
};

const CampusMap2D: React.FC<CampusMap2DProps> = ({
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [mapData, setMapData] = useState<CampusMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [spawnBuildingId, setSpawnBuildingId] = useState<number | null>(null);
  const [pendingSpawnBuildingId, setPendingSpawnBuildingId] = useState<number | null>(null);
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

  const confirmInitialSpawn = useCallback(() => {
    if (!pendingSpawnBuildingId) return;
    const selectedBuilding = spawnOptions.find(
      (building) => building.buildingId === pendingSpawnBuildingId,
    );
    setSpawnBuildingId(pendingSpawnBuildingId);
    setStatus(
      `Posisi awal: ${selectedBuilding?.buildingName ?? "gedung terpilih"}. Cari lokasi tujuan.`,
    );
  }, [pendingSpawnBuildingId, spawnOptions]);

  const configuredImageUrl = mapData?.map.imageUrl;
  const preferredImageUrl =
    !configuredImageUrl ||
    configuredImageUrl === "/maps/denah-2d.png" ||
    configuredImageUrl === "/maps/denah-2d-grass.png"
      ? "/maps/denah-2d-grass-bright.png"
      : configuredImageUrl;
  const mapImageUrl = preferredImageUrl.startsWith("/maps/")
    ? `${import.meta.env.BASE_URL}${preferredImageUrl.slice(1)}`
    : preferredImageUrl;
  const viewBoxWidth = mapData?.map.imageWidth || CAMPUS_MAP_WIDTH;
  const viewBoxHeight = mapData?.map.imageHeight || CAMPUS_MAP_HEIGHT;
  const routePoints = routeNodes
    .map((node) => `${node.x * viewBoxWidth},${node.y * viewBoxHeight}`)
    .join(" ");

  return (
    <div
      className={`relative overflow-hidden bg-[#315f35] ${
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
            const labelLines = getBuildingLabelLines(building.buildingName);
            const labelWidth = Math.min(
              270,
              Math.max(100, Math.max(...labelLines.map((line) => line.length)) * 10 + 24),
            );
            const labelHeight = labelLines.length * 20 + 10;
            const labelTop = -28 - labelHeight;
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
                <rect
                  x={-labelWidth / 2}
                  y={labelTop}
                  width={labelWidth}
                  height={labelHeight}
                  rx="8"
                  fill={
                    selected
                      ? "rgba(153, 27, 27, 0.94)"
                      : isSpawn
                        ? "rgba(20, 83, 45, 0.94)"
                        : "rgba(7, 19, 29, 0.9)"
                  }
                  stroke="rgba(255,255,255,0.75)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                />
                <text
                  x="0"
                  y={labelTop + 19}
                  fill="#ffffff"
                  fontSize="17"
                  fontWeight="700"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {labelLines.map((line, index) => (
                    <tspan key={`${index}-${line}`} x="0" dy={index === 0 ? 0 : 20}>
                      {line}
                    </tspan>
                  ))}
                </text>
                <title>{building.buildingName}</title>
              </g>
            );
          })}
        </svg>

        {!loading && spawnBuildingId !== null && (
          <SearchOverlay
            isUnityLoaded
            onNavigate={handleNavigate}
            onCancelNavigation={clearRoute}
          />
        )}

        {!loading &&
          !loadError &&
          spawnBuildingId === null &&
          spawnOptions.length > 0 && (
            <div
              className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="initial-spawn-title"
            >
              <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white p-5 shadow-2xl sm:p-7">
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-[#2C5F2D]">
                    <LocateFixed className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 id="initial-spawn-title" className="text-xl font-bold text-slate-900">
                      Pilih titik awal
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      Tentukan gedung tempat Anda berada. Posisi ini menjadi titik awal pencarian rute.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="initial-spawn-building"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Saya berada di
                </label>
                <select
                  id="initial-spawn-building"
                  value={pendingSpawnBuildingId ?? ""}
                  onChange={(event) =>
                    setPendingSpawnBuildingId(Number(event.target.value) || null)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  autoFocus
                >
                  <option value="">Pilih gedung tempat mulai</option>
                  {spawnOptions.map((building) => (
                    <option key={building.id} value={building.buildingId}>
                      {building.buildingName}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={confirmInitialSpawn}
                  disabled={pendingSpawnBuildingId === null}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C5F2D] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#234d24] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <MapPin className="h-4 w-4" />
                  Gunakan sebagai titik awal
                </button>
              </div>
            </div>
          )}

        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-2 sm:right-auto sm:w-[360px]">
          <div className="rounded-xl border border-white/15 bg-black/75 p-3 text-white shadow-xl backdrop-blur-md">
            <label htmlFor="campus-spawn-building" className="mb-1.5 flex items-center gap-2 text-xs font-semibold">
              <LocateFixed className="h-4 w-4 text-green-400" />
              Mulai dari gedung
            </label>
            <select
              id="campus-spawn-building"
              value={spawnBuildingId ?? ""}
              onChange={(event) => {
                const nextBuildingId = Number(event.target.value) || null;
                setPendingSpawnBuildingId(nextBuildingId);
                setSpawnBuildingId(nextBuildingId);
              }}
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
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#315f35] text-white">
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
