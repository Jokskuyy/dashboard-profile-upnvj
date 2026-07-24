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
import { useLanguage } from "../../contexts/LanguageContext";
import SearchOverlay from "./SearchOverlay";

interface CampusMap2DProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

type MapLoadError = "notConfigured" | "loadFailed";

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
  const { language } = useLanguage();
  const isIndonesian = language === "id";
  const copy = useMemo(
    () =>
      isIndonesian
        ? {
            initialStatus: "Pilih gedung awal, lalu cari ruangan atau gedung tujuan.",
            notConfigured:
              "Titik denah belum dikonfigurasi. Admin perlu menjalankan migrasi dan menandai gedung.",
            loadFailed: "Gagal memuat konfigurasi jalur denah 2D.",
            chooseStartFirst: "Pilih gedung awal terlebih dahulu.",
            entranceMissing: (name: string) => `Pintu masuk ${name} belum ditandai oleh admin.`,
            alreadyThere: (name: string) => `Anda sudah berada di ${name}.`,
            routeMissing: (name: string) => `Belum ada jalur yang tersambung menuju ${name}.`,
            routeFromTo: (from: string, to: string) => `Rute dari ${from} menuju ${to}.`,
            noMapPosition: (name: string) => `${name} belum memiliki posisi pada denah 2D.`,
            startPosition: (name: string) => `Posisi awal: ${name}. Cari lokasi tujuan.`,
          }
        : {
            initialStatus: "Choose a starting building, then search for a room or destination building.",
            notConfigured:
              "Map points have not been configured. An admin must run the migration and mark the buildings.",
            loadFailed: "Failed to load the 2D map route configuration.",
            chooseStartFirst: "Choose a starting building first.",
            entranceMissing: (name: string) => `The entrance to ${name} has not been marked by an admin.`,
            alreadyThere: (name: string) => `You are already at ${name}.`,
            routeMissing: (name: string) => `No connected route to ${name} is available yet.`,
            routeFromTo: (from: string, to: string) => `Route from ${from} to ${to}.`,
            noMapPosition: (name: string) => `${name} does not have a position on the 2D map yet.`,
            startPosition: (name: string) => `Starting position: ${name}. Search for a destination.`,
          },
    [isIndonesian],
  );
  const [mapData, setMapData] = useState<CampusMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<MapLoadError | null>(null);
  const [spawnBuildingId, setSpawnBuildingId] = useState<number | null>(null);
  const [destinationBuildingId, setDestinationBuildingId] = useState<number | null>(null);
  const [status, setStatus] = useState(copy.initialStatus);

  useEffect(() => {
    let active = true;
    fetchActiveCampusMap()
      .then((data) => {
        if (!active) return;
        setMapData(data);
        if (!data) {
          setLoadError("notConfigured");
          return;
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error("[CampusMap2D] Gagal memuat denah:", error);
        setLoadError("loadFailed");
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
    if (!destination) {
      setStatus(spawn ? copy.startPosition(spawn.buildingName) : copy.initialStatus);
      return;
    }
    if (!spawn) {
      setStatus(copy.chooseStartFirst);
    } else if (!destination.entranceNodeId) {
      setStatus(copy.entranceMissing(destination.buildingName));
    } else if (spawn.buildingId === destination.buildingId) {
      setStatus(copy.alreadyThere(destination.buildingName));
    } else if (routeNodes.length === 0) {
      setStatus(copy.routeMissing(destination.buildingName));
    } else {
      setStatus(copy.routeFromTo(spawn.buildingName, destination.buildingName));
    }
  }, [copy, destination, routeNodes.length, spawn]);

  const handleNavigate = useCallback(
    (result: SearchResult) => {
      const target = mapData?.buildings.find(
        (building) => building.buildingId === result.buildingId,
      );
      if (!target) {
        setDestinationBuildingId(null);
        setStatus(copy.noMapPosition(result.sublabel || result.label));
        return;
      }
      setDestinationBuildingId(target.buildingId);
    },
    [copy, mapData],
  );

  const clearRoute = useCallback(() => {
    setDestinationBuildingId(null);
    setStatus(spawn ? copy.startPosition(spawn.buildingName) : copy.initialStatus);
  }, [copy, spawn]);

  const selectBuildingFromMap = useCallback(
    (buildingId: number) => {
      if (spawnBuildingId === null) {
        const selectedBuilding = spawnOptions.find(
          (building) => building.buildingId === buildingId,
        );
        if (!selectedBuilding) return;
        setSpawnBuildingId(buildingId);
        setDestinationBuildingId(null);
        setStatus(copy.startPosition(selectedBuilding.buildingName));
        return;
      }

      setDestinationBuildingId(buildingId);
    },
    [copy, spawnBuildingId, spawnOptions],
  );

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
          aria-label={isIndonesian ? "Denah 2D kampus UPN Veteran Jakarta" : "UPN Veteran Jakarta 2D campus map"}
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
                className="cursor-pointer outline-none"
                role="button"
                tabIndex={0}
                aria-label={
                  spawnBuildingId === null
                    ? isIndonesian
                      ? `Pilih ${building.buildingName} sebagai titik awal`
                      : `Choose ${building.buildingName} as the starting point`
                    : isIndonesian
                      ? `Pilih ${building.buildingName} sebagai tujuan`
                      : `Choose ${building.buildingName} as the destination`
                }
                onClick={() => selectBuildingFromMap(building.buildingId)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  selectBuildingFromMap(building.buildingId);
                }}
              >
                {(selected || isSpawn) && (
                  <circle
                    r="31"
                    fill="none"
                    stroke={selected ? "#ef4444" : "#22c55e"}
                    strokeWidth="5"
                    opacity="0.8"
                    vectorEffect="non-scaling-stroke"
                    pointerEvents="none"
                  />
                )}
                <circle
                  r={selected || isSpawn ? 23 : 18}
                  fill={selected ? "#ef4444" : isSpawn ? "#22c55e" : "#f8fafc"}
                  stroke="#07131d"
                  strokeWidth="5"
                  vectorEffect="non-scaling-stroke"
                />
                <circle r="6" fill="#07131d" pointerEvents="none" />
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
            pinToViewport={isFullscreen}
          />
        )}

        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-2 sm:right-auto sm:w-[360px]">
          <div className="rounded-xl border border-white/15 bg-black/75 p-3 text-white shadow-xl backdrop-blur-md">
            <label htmlFor="campus-spawn-building" className="mb-1.5 flex items-center gap-2 text-xs font-semibold">
              <LocateFixed className="h-4 w-4 text-green-400" />
              {isIndonesian ? "Mulai dari gedung" : "Start from building"}
            </label>
            <select
              id="campus-spawn-building"
              value={spawnBuildingId ?? ""}
              onChange={(event) => {
                const nextBuildingId = Number(event.target.value) || null;
                setSpawnBuildingId(nextBuildingId);
                setDestinationBuildingId(null);
              }}
              className="w-full rounded-lg border border-white/20 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-400"
              disabled={spawnOptions.length === 0}
            >
              <option value="">{isIndonesian ? "Pilih posisi awal" : "Choose starting position"}</option>
              {spawnOptions.map((building) => (
                <option key={building.id} value={building.buildingId}>
                  {building.buildingName}
                </option>
              ))}
            </select>
            <div className="mt-2 flex items-start gap-2 text-xs text-white/80">
              <Route className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />
              <span>{loadError ? copy[loadError] : status}</span>
            </div>
          </div>
        </div>

        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="absolute bottom-4 right-4 z-20 rounded-xl border border-white/15 bg-black/70 p-3 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/90"
            aria-label={
              isFullscreen
                ? isIndonesian
                  ? "Keluar dari layar penuh"
                  : "Exit fullscreen"
                : isIndonesian
                  ? "Buka layar penuh"
                  : "Enter fullscreen"
            }
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        )}

        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#315f35] text-white">
            <div className="text-center">
              <MapPin className="mx-auto mb-3 h-8 w-8 animate-bounce text-green-400" />
              <p className="text-sm">{isIndonesian ? "Memuat denah 2D..." : "Loading 2D map..."}</p>
            </div>
          </div>
        )}
      </div>

      {!isFullscreen && (
        <div className="flex items-center gap-2 border-t border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          <Building2 className="h-4 w-4 text-[#2C5F2D]" />
          {isIndonesian
            ? "Pilih gedung awal, lalu gunakan pencarian untuk menampilkan rute."
            : "Choose a starting building, then use search to display a route."}
        </div>
      )}
    </div>
  );
};

export default CampusMap2D;
