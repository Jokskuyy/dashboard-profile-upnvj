import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  MapPin,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Home,
} from "lucide-react";

interface CampusMapViewerProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

// Unity WebGL integration interface
declare global {
  interface Window {
    unityInstance: any;
    createUnityInstance: (
      canvas: HTMLCanvasElement,
      config: any
    ) => Promise<any>;
  }
}

const CampusMapViewer: React.FC<CampusMapViewerProps> = ({
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [unityInstance, setUnityInstance] = useState<any>(null);

  // Unity WebGL configuration
  const unityConfig = {
    dataUrl: "/unity-builds/denah/Build/denah.data",
    frameworkUrl: "/unity-builds/denah/Build/denah.framework.js",
    codeUrl: "/unity-builds/denah/Build/denah.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "UPN Veteran Jakarta",
    productName: "Campus Map",
    productVersion: "1.0",
    showBanner: false,
    matchWebGLToCanvasSize: true,
  };

  useEffect(() => {
    const loadUnityBuild = async () => {
      if (!canvasRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Check if Unity WebGL files exist
        const response = await fetch(unityConfig.frameworkUrl);
        if (!response.ok) {
          throw new Error(
            "Unity WebGL build files not found. Please build Unity project for WebGL platform."
          );
        }

        // Load Unity instance
        if (window.createUnityInstance) {
          const instance = await window.createUnityInstance(canvasRef.current, {
            ...unityConfig,
            onProgress: (progress: number) => {
              setLoadingProgress(Math.round(progress * 100));
            },
          });

          setUnityInstance(instance);
          window.unityInstance = instance;
        } else {
          throw new Error("Unity WebGL loader not found");
        }
      } catch (err) {
        console.error("Failed to load Unity WebGL build:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load campus map"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadUnityBuild();

    return () => {
      // Cleanup Unity instance
      if (unityInstance) {
        try {
          unityInstance.Quit();
        } catch (err) {
          console.error("Error cleaning up Unity instance:", err);
        }
      }
    };
  }, []);

  const handleResetView = () => {
    if (unityInstance) {
      unityInstance.SendMessage("CameraController", "ResetView");
    }
  };

  const handleZoomIn = () => {
    if (unityInstance) {
      unityInstance.SendMessage("CameraController", "ZoomIn");
    }
  };

  const handleZoomOut = () => {
    if (unityInstance) {
      unityInstance.SendMessage("CameraController", "ZoomOut");
    }
  };

  const handleGoHome = () => {
    if (unityInstance) {
      unityInstance.SendMessage("CameraController", "GoHome");
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {t("campusMapUnavailable")}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              Setup Instructions:
            </h4>
            <ol className="text-sm text-blue-700 space-y-1 text-left">
              <li>1. Build Unity project for WebGL platform</li>
              <li>
                2. Place build files in <code>/public/unity-builds/denah/</code>
              </li>
              <li>3. Ensure Unity WebGL loader is included in index.html</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {t("campusMap")}
              </h3>
              <p className="text-blue-100 text-sm">
                Interactive 3D Campus Layout
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {!isLoading && !error && (
              <>
                <button
                  onClick={handleGoHome}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title={t("home")}
                >
                  <Home className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title={t("zoomIn")}
                >
                  <ZoomIn className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title={t("zoomOut")}
                >
                  <ZoomOut className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleResetView}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title={t("resetView")}
                >
                  <RotateCcw className="w-4 h-4 text-white" />
                </button>
              </>
            )}

            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title={
                  isFullscreen ? t("exitFullscreen") : t("enterFullscreen")
                }
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-white" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-white" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Unity WebGL Canvas Container */}
      <div
        className={`relative ${isFullscreen ? "h-full" : "h-96 lg:h-[500px]"}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading Campus Map...</p>
              <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto mt-2">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{loadingProgress}%</p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={`w-full h-full ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
          style={{
            display: "block",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        />
      </div>

      {/* Info Panel */}
      {!isLoading && !error && (
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>🖱️ Click and drag to move camera</span>
              <span>🔍 Scroll to zoom in/out</span>
            </div>
            <div className="text-xs text-gray-500">Unity WebGL Build</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusMapViewer;
