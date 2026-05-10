import React, { useState, useEffect } from "react";
import { MapPin, ExternalLink, Building, Navigation, CheckCircle, Loader2 } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";
import CampusMapViewer from '../../campus-map/CampusMapViewer';
import { getPreloadStatus, onPreloadProgress, type PreloadStatus } from "../../../utils/unityPreloader";

const CampusMapSection: React.FC = () => {
  const { t } = useLanguage();
  const [showViewer, setShowViewer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<PreloadStatus>(getPreloadStatus());

  // Check if we're on GitHub Pages - Unity WebGL doesn't work there due to Brotli compression
  const isGitHubPages = window.location.hostname.includes('github.io');

  // Subscribe to pre-cache progress
  useEffect(() => {
    const unsubscribe = onPreloadProgress((progress) => {
      setCacheStatus(progress.status);
    });
    return unsubscribe;
  }, []);

  const handleOpenCampusMap = () => {
    if (isGitHubPages) {
      alert('Unity WebGL campus map is not available on GitHub Pages due to Brotli compression limitations. Please view on local development or alternative hosting platform.');
      return;
    }
    setShowViewer(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (showViewer) {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <CampusMapViewer
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />

        {!isFullscreen && (
          <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {t("unity3DInteractiveCampusMap")} - {t("useMouseToNavigate")}
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-red-600" />
            {t("campusMapTitle")}
          </h3>
          <p className="text-gray-600 mt-1">{t("campusMapSubtitle")}</p>
        </div>
      </div>

      <div className="bg-linear-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-red-600" />
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {t("campusMap3D")}
        </h4>

        <p className="text-gray-600 mb-6">
          {t("interactiveUnityWebGLExperience")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-white rounded-lg p-4">
            <Navigation className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">{t("interactiveNavigation")}</p>
            <p className="text-gray-600">{t("navigateThroughCampus3D")}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <Building className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">{t("buildingInformation")}</p>
            <p className="text-gray-600">{t("detailedFacilityInfo")}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">{t("unityWebGL")}</p>
            <p className="text-gray-600">{t("highQuality3DRendering")}</p>
          </div>
        </div>

        <button
          onClick={handleOpenCampusMap}
          disabled={isGitHubPages}
          className={`inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-colors shadow-lg ${
            isGitHubPages
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          {t("launchUnityMap")}
        </button>

        {/* Pre-cache status indicator */}
        {!isGitHubPages && cacheStatus !== "idle" && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs">
            {cacheStatus === "loading" && (
              <>
                <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                <span className="text-blue-600">Mempersiapkan aset 3D...</span>
              </>
            )}
            {cacheStatus === "cached" && (
              <>
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-green-600">Aset 3D siap — loading akan lebih cepat</span>
              </>
            )}
          </div>
        )}

        {isGitHubPages && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              WARNING: Unity WebGL is not available on GitHub Pages due to Brotli compression limitations.
              <br />
              Please view on local development environment.
            </p>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          {t("unityWebGLBuild")}
        </div>
      </div>
    </div>
  );
};

export default CampusMapSection;
