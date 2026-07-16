import React, { useState, useEffect } from "react";
import { MapPin, ExternalLink, Navigation, Building, Compass, CheckCircle } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import CampusMapViewer from "../../campus-map/CampusMapViewer";
import {
  getPreloadStatus,
  startUnityPreload,
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
  const sectionRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onPreloadProgress((progress) => {
      setCacheStatus(progress.status);
    });
    return unsubscribe;
  }, []);

  const handleOpenCampusMap = async () => {
    if (isGitHubPages) {
      alert(
        "Unity WebGL campus map is not available on GitHub Pages due to Brotli compression limitations.",
      );
      return;
    }
    
    // Auto-fullscreen trigger directly on user interaction (fixes iOS Safari issue)
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (sectionRef.current) {
      const el = sectionRef.current;
      const elWithWebkit = el as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (elWithWebkit.webkitRequestFullscreen) {
          await elWithWebkit.webkitRequestFullscreen();
        }
        if (isMobile) {
          await (screen.orientation as ScreenOrientation & { lock?: (orientation: string) => Promise<void> }).lock?.("landscape");
        }
      } catch {
        // Fullscreen/orientation lock may fail silently on some iOS devices
      }
    }
    
    setShowViewer(true);
    setIsFullscreen(true);
  };

  /**
   * On hover: start preloading Unity files if not already cached.
   */
  const handleButtonHover = () => {
    const status = getPreloadStatus();
    if (status === "idle") {
      startUnityPreload();
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      try {
        (screen.orientation as ScreenOrientation & { unlock?: () => void }).unlock?.();
      } catch {
        /* empty */
      }
    } else if (!isFullscreen && sectionRef.current) {
      const el = sectionRef.current;
      const elWithWebkit = el as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
      try {
        if (el.requestFullscreen) {
          el.requestFullscreen().catch(() => {});
        } else if (elWithWebkit.webkitRequestFullscreen) {
          elWithWebkit.webkitRequestFullscreen().catch(() => {});
        }
      } catch {
        // ignore
      }
    }
    setIsFullscreen(!isFullscreen);
  };

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
    <div 
      ref={sectionRef} 
      className={showViewer && isFullscreen ? "fixed inset-0 z-50 w-full h-[100dvh] bg-white flex flex-col" : ""}
    >
      {showViewer ? (
        <div className={`flex-1 flex flex-col ${!isFullscreen ? "bg-white rounded-2xl shadow-lg overflow-hidden" : ""}`}>
          <div className="flex-1 relative min-h-0">
            <CampusMapViewer
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              onClose={() => {
                setShowViewer(false);
                setIsFullscreen(false);
              }}
            />
          </div>

          {!isFullscreen && (
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center shrink-0">
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
      ) : (
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
                onMouseEnter={handleButtonHover}
                onFocus={handleButtonHover}
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

              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">{t("unityWebGLBuild")} • ~39 MB</span>
                {_cacheStatus === "cached" && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    File tersimpan di cache — loading lebih cepat
                  </span>
                )}
                {_cacheStatus === "loading" && (
                  <span className="text-xs text-blue-500">Mengunduh ke cache background...</span>
                )}
              </div>
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
      )}
    </div>
  );
};

export default CampusMapSection;
