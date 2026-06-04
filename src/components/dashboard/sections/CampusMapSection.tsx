import React, { useState, useEffect } from "react";
import { MapPin, ExternalLink, Navigation, Building, Compass } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import CampusMapViewer from "../../campus-map/CampusMapViewer";
import {
  getPreloadStatus,
  onPreloadProgress,
  type PreloadStatus,
} from "../../../utils/unityPreloader";

const CampusMapSection: React.FC = () => {
  const { t } = useLanguage();
  const [showViewer, setShowViewer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [_cacheStatus, setCacheStatus] = useState<PreloadStatus>(
    getPreloadStatus(),
  );

  const isGitHubPages = window.location.hostname.includes("github.io");

  useEffect(() => {
    const unsubscribe = onPreloadProgress((progress) => {
      setCacheStatus(progress.status);
    });
    return unsubscribe;
  }, []);

  const viewerWrapperRef = React.useRef<HTMLDivElement>(null);

  const handleOpenCampusMap = async () => {
    if (isGitHubPages) {
      alert(
        "Unity WebGL campus map is not available on GitHub Pages due to Brotli compression limitations.",
      );
      return;
    }
    setShowViewer(true);
  };

  // Auto-fullscreen saat viewer dibuka (PC & mobile)
  useEffect(() => {
    if (!showViewer) return;

    const isMobile =
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) || window.innerWidth < 768;

    const timer = setTimeout(async () => {
      const el = viewerWrapperRef.current;
      if (!el) return;
      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if ((el as any).webkitRequestFullscreen) {
          await (el as any).webkitRequestFullscreen();
        }
        // Lock landscape hanya untuk mobile
        if (isMobile) {
          await (screen.orientation as any).lock?.("landscape");
        }
      } catch {
        // Fullscreen/orientation lock may fail
      }
      setIsFullscreen(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [showViewer]);

  const toggleFullscreen = () => {
    if (isFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      try {
        (screen.orientation as any).unlock?.();
      } catch {
        /* empty */
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // ── Active viewer mode ──
  if (showViewer) {
    return (
      <div
        ref={viewerWrapperRef}
        className={`bg-white rounded-2xl shadow-lg overflow-hidden ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}`}
      >
        <CampusMapViewer
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onClose={() => {
            setShowViewer(false);
            setIsFullscreen(false);
          }}
        />

        {!isFullscreen && (
          <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {t("unity3DInteractiveCampusMap")} — {t("useMouseToNavigate")}
            </div>
            <button
              onClick={() => setShowViewer(false)}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              {t("closeMap")}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Preview card ──
  const features = [
    {
      icon: Navigation,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      title: t("interactiveNavigation"),
      desc: t("navigateThroughCampus3D"),
    },
    {
      icon: Building,
      color: "text-[#2C5F2D]",
      bg: "bg-green-50",
      border: "border-green-100",
      title: t("buildingInformation"),
      desc: t("detailedFacilityInfo"),
    },
    {
      icon: Compass,
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-100",
      title: t("unityWebGL"),
      desc: t("highQuality3DRendering"),
    },
  ];

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white">
      {/* Card Header — green accent bar */}
      <div className="bg-gradient-to-r from-[#2C5F2D] to-[#3d7a3e] px-6 sm:px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {t("campusMapTitle")}
            </h3>
            <p className="text-sm text-white/70">{t("campusMapSubtitle")}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-8">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          {features.map((f, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 ${f.bg} border ${f.border} hover:shadow-md transition-all duration-300`}
            >
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm">
                <f.icon className={`w-[18px] h-[18px] ${f.color}`} />
              </div>
              <p className="font-semibold text-gray-800 text-sm mb-0.5">
                {f.title}
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={handleOpenCampusMap}
            disabled={isGitHubPages}
            className={`group inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-200 shadow-md ${
              isGitHubPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#2C5F2D] text-white hover:bg-[#245025] hover:shadow-lg hover:shadow-green-900/15 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            <ExternalLink className="w-[18px] h-[18px]" />
            {t("launchUnityMap")}
          </button>

          <span className="text-xs text-gray-400">{t("unityWebGLBuild")}</span>
        </div>

        {isGitHubPages && (
          <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700">
              ⚠️ Unity WebGL is not available on GitHub Pages due to Brotli
              compression limitations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusMapSection;
