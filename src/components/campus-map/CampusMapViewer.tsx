import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  MapPin,
  Maximize2,
  Minimize2,
  Mouse,
  MousePointerClick,
} from "lucide-react";

interface CampusMapViewerProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

/** Minimal type for Unity WebGL instance (no official @types available) */
interface UnityInstance {
  Quit(): Promise<void>;
  SetFullscreen(fullscreen: number): void;
  SendMessage(objectName: string, methodName: string, value?: string | number): void;
}

interface UnityConfig {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl: string;
  companyName: string;
  productName: string;
  productVersion: string;
  showBanner?: (msg: string, type: string) => void;
}

// Unity WebGL integration interface
declare global {
  interface Window {
    unityInstance: UnityInstance | null;
    createUnityInstance: (
      canvas: HTMLCanvasElement,
      config: UnityConfig,
      onProgress?: (progress: number) => void
    ) => Promise<UnityInstance>;
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
  const unityInstanceRef = useRef<UnityInstance | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Unity WebGL configuration - using compressed files
  const basePath = import.meta.env.BASE_URL;
  const unityConfig = useMemo(() => ({
    dataUrl: `${basePath}unity-builds/downloads/prototipe/Build/prototipe.data`,
    frameworkUrl: `${basePath}unity-builds/downloads/prototipe/Build/prototipe.framework.js`,
    codeUrl: `${basePath}unity-builds/downloads/prototipe/Build/prototipe.wasm`,
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "Proposal",
    productVersion: "0.1.0",
    showBanner: unityShowBanner,
    matchWebGLToCanvasSize: true,
  }), [basePath]);

  // Check WebGL support
  const checkWebGLSupport = (): boolean => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  };

  function unityShowBanner(msg: string, type: string) {
    console.log(`[Unity ${type}]: ${msg}`);
    if (type === 'error') {
      setError(msg);
    }
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    const loadUnityBuild = async () => {
      if (!canvasRef.current || !containerRef.current) return;

      // Check WebGL support first
      if (!checkWebGLSupport()) {
        setWebglSupported(false);
        setError("WebGL is not supported on this device. Please use a modern browser with WebGL enabled.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Add timeout for loading
        timeoutId = setTimeout(() => {
          setError("Loading timeout. The file may be too large or your connection is slow. Please try again later.");
          setIsLoading(false);
        }, 60000); // 60 second timeout

        // Set canvas dimensions explicitly
        const canvas = canvasRef.current;
        const container = containerRef.current;
        canvas.width = container.clientWidth || 960;
        canvas.height = container.clientHeight || 600;

        // First, dynamically load the Unity loader script - use BASE_URL for GitHub Pages
        const loaderUrl = `${basePath}unity-builds/downloads/prototipe/Build/prototipe.loader.js`;
        
        if (!window.createUnityInstance) {
          console.log("Loading Unity WebGL loader...");
          
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = loaderUrl;
            script.async = true;
            script.onload = () => {
              console.log("Unity loader loaded successfully");
              setTimeout(() => resolve(), 100);
            };
            script.onerror = () => {
              reject(new Error(`Failed to load Unity loader from ${loaderUrl}`));
            };
            document.body.appendChild(script);
          });
        }

        if (!window.createUnityInstance) {
          throw new Error("Unity WebGL createUnityInstance not available");
        }

        console.log("Creating Unity instance with config:", unityConfig);

        // Load Unity instance with progress tracking
        const instance = await window.createUnityInstance(
          canvas,
          unityConfig,
          (progress: number) => {
            setLoadingProgress(Math.round(progress * 100));
          }
        );

        console.log("Unity instance created successfully");
        if (timeoutId) clearTimeout(timeoutId);
        unityInstanceRef.current = instance;
        window.unityInstance = instance;
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load Unity WebGL build:", err);
        if (timeoutId) clearTimeout(timeoutId);
        
        let errorMessage = "Failed to load campus map";
        if (err instanceof Error) {
          if (err.message.includes('memory')) {
            errorMessage = "Not enough memory to load the map. Please close other tabs and try again.";
          } else if (err.message.includes('network') || err.message.includes('Failed to fetch')) {
            errorMessage = "Network error. Please check your internet connection and try again.";
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    loadUnityBuild();

    return () => {
      // Cleanup Unity instance
      if (unityInstanceRef.current) {
        try {
          unityInstanceRef.current.Quit();
        } catch (err) {
          console.error("Error cleaning up Unity instance:", err);
        }
      }
    };
  }, [basePath, unityConfig]);

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
          
          {!webglSupported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-yellow-800 mb-2">
                ⚠️ WebGL Not Supported
              </h4>
              <p className="text-sm text-yellow-700">
                Your browser or device doesn't support WebGL. Try:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1 text-left mt-2 ml-4 list-disc">
                <li>Update your browser to the latest version</li>
                <li>Enable hardware acceleration in browser settings</li>
                <li>Use Chrome, Firefox, or Edge browser</li>
                <li>Check if your GPU drivers are up to date</li>
              </ul>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              💡 Troubleshooting Tips:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1 text-left ml-4 list-disc">
              <li>Ensure you have a stable internet connection (80+ MB download)</li>
              <li>Close other tabs to free up memory</li>
              <li>Try using a desktop browser instead of mobile</li>
              <li>Clear browser cache and reload the page</li>
            </ul>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Retry Loading
          </button>
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
      <div className="bg-linear-to-r from-blue-600 to-blue-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {t("campusMapTitle")}
              </h3>
              <p className="text-blue-100 text-sm">
                {t("interactive3DCampusLayout")}
              </p>
            </div>
          </div>

          {/* Controls */}
          {onToggleFullscreen && (
            <div className="flex items-center space-x-2">
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
            </div>
          )}
        </div>
      </div>

      {/* Unity WebGL Canvas Container */}
      <div
        id="unity-container"
        ref={containerRef}
        className={`relative ${isFullscreen ? "h-full" : "h-96 lg:h-[500px]"}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">{t("loadingCampusMap")}</p>
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
          id="unity-canvas"
          className={`w-full h-full ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
          style={{
            display: "block",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
          tabIndex={-1}
        />
      </div>

      {/* Info Panel */}
      {!isLoading && !error && (
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MousePointerClick className="w-4 h-4 text-gray-500" />
                <span>{t("clickAndDragToMove")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mouse className="w-4 h-4 text-gray-500" />
                <span>{t("scrollToZoom")}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">{t("unityWebGLBuild")}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusMapViewer;
