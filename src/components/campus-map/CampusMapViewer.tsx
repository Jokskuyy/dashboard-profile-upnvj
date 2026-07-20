import React, { useState } from "react";
import { Box, Map, RotateCcw } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import CampusMap2D from "./CampusMap2D";
import UnityCampusMap from "./UnityCampusMap";

interface CampusMapViewerProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onClose?: () => void;
  allow3D?: boolean;
  onPreload3D?: () => void;
}

type MapMode = "2d" | "3d";

const CampusMapViewer: React.FC<CampusMapViewerProps> = ({
  isFullscreen = false,
  onToggleFullscreen,
  onClose,
  allow3D = true,
  onPreload3D,
}) => {
  const { language } = useLanguage();
  const isIndonesian = language === "id";
  const [mode, setMode] = useState<MapMode | null>(null);

  if (!mode) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#173f23] via-[#245b32] to-[#102f1a] p-5 ${
          isFullscreen ? "h-full w-full" : "min-h-[500px] rounded-xl shadow-lg"
        }`}
      >
        <div className="w-full max-w-3xl text-center text-white">
          <img
            src={`${import.meta.env.BASE_URL}logoupnvj.webp`}
            alt="Logo UPNVJ"
            className="mx-auto mb-4 h-16 w-16 object-contain"
          />
          <h2 className="text-2xl font-bold sm:text-3xl">
            {isIndonesian ? "Pilih jenis denah kampus" : "Choose a campus map"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-green-100 sm:text-base">
            {isIndonesian
              ? "Gunakan denah 2D untuk pencarian rute cepat atau jelajahi kampus melalui tampilan 3D."
              : "Use the 2D map for quick directions or explore the campus in 3D."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setMode("2d")}
              className="group rounded-2xl border border-white/20 bg-white/10 p-6 text-left backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/20 hover:shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#2C5F2D]">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{isIndonesian ? "Denah 2D" : "2D Map"}</h3>
              <p className="mt-1 text-sm text-green-100">
                {isIndonesian
                  ? "Pilih gedung awal, cari ruangan, dan lihat jalur menuju gedung tujuan."
                  : "Choose your starting building, search for a room, and view the route to its building."}
              </p>
            </button>

            <button
              onClick={() => {
                if (!allow3D) return;
                onPreload3D?.();
                setMode("3d");
              }}
              onMouseEnter={allow3D ? onPreload3D : undefined}
              onFocus={allow3D ? onPreload3D : undefined}
              disabled={!allow3D}
              className={`group rounded-2xl border border-white/20 bg-white/10 p-6 text-left backdrop-blur-sm transition-all ${
                allow3D
                  ? "hover:-translate-y-1 hover:bg-white/20 hover:shadow-2xl"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#2C5F2D]">
                <Box className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{isIndonesian ? "Denah 3D" : "3D Map"}</h3>
              <p className="mt-1 text-sm text-green-100">
                {allow3D
                  ? isIndonesian
                    ? "Masuk ke pengalaman Unity WebGL dan jelajahi kampus secara langsung."
                    : "Enter the Unity WebGL experience and explore the campus directly."
                  : isIndonesian
                    ? "Mode 3D tidak tersedia pada GitHub Pages, tetapi denah 2D tetap dapat digunakan."
                    : "3D mode is unavailable on GitHub Pages, but the 2D map is still available."}
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? "h-full w-full" : ""}`}>
      {mode === "2d" ? (
        <CampusMap2D isFullscreen={isFullscreen} onToggleFullscreen={onToggleFullscreen} />
      ) : (
        <UnityCampusMap
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          onClose={onClose}
        />
      )}

      <button
        onClick={() => setMode(null)}
        className="absolute left-3 top-3 z-[55] flex items-center gap-2 rounded-lg border border-white/15 bg-black/70 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/90"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {isIndonesian ? "Ganti mode" : "Change mode"}
      </button>
    </div>
  );
};

export default CampusMapViewer;
