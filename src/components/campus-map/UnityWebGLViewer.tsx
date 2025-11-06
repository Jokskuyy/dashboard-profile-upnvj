import React, { useEffect, useRef, useState } from "react";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Loader2,
} from "lucide-react";

interface UnityWebGLViewerProps {
  buildPath: string;
  buildName: string;
  width?: string;
  height?: string;
  onUnityLoaded?: (unityInstance: any) => void;
  companyName?: string;
  productName?: string;
  productVersion?: string;
  className?: string;
}

declare global {
  interface Window {
    createUnityInstance: (
      canvas: HTMLCanvasElement,
      config: any,
      onProgress?: (progress: number) => void
    ) => Promise<any>;
  }
}

const UnityWebGLViewer: React.FC<UnityWebGLViewerProps> = ({
  buildPath,
  buildName,
  width = "100%",
  height = "600px",
  onUnityLoaded,
  companyName = "DefaultCompany",
  productName = "Unity WebGL",
  productVersion = "1.0",
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [unityInstance, setUnityInstance] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const unityConfig = {
    dataUrl: `${buildPath}/${buildName}.data.br`,
    frameworkUrl: `${buildPath}/${buildName}.framework.js.br`,
    codeUrl: `${buildPath}/${buildName}.wasm.br`,
    streamingAssetsUrl: "StreamingAssets",
    companyName,
    productName,
    productVersion,
    showBanner: (msg: string, type: string) => {
      console.log(`[Unity ${type}]: ${msg}`);
      if (type === "error") {
        setError(msg);
      }
    },
  };

  useEffect(() => {
    const loadUnityBuild = async () => {
      if (!canvasRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Wait for Unity loader
        let attempts = 0;
        while (!window.createUnityInstance && attempts < 100) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.createUnityInstance) {
          throw new Error(
            "Unity WebGL loader not loaded. Please check if the loader script is included."
          );
        }

        // Create Unity instance
        const instance = await window.createUnityInstance(
          canvasRef.current,
          unityConfig,
          (progress: number) => {
            setLoadingProgress(Math.round(progress * 100));
          }
        );

        setUnityInstance(instance);
        setIsLoading(false);

        if (onUnityLoaded) {
          onUnityLoaded(instance);
        }
      } catch (err) {
        console.error("Failed to load Unity WebGL:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load Unity WebGL application"
        );
        setIsLoading(false);
      }
    };

    loadUnityBuild();

    return () => {
      if (unityInstance) {
        try {
          unityInstance.Quit();
        } catch (err) {
          console.error("Error cleaning up Unity instance:", err);
        }
      }
    };
  }, [buildPath, buildName]);

  const toggleFullscreen = () => {
    if (unityInstance) {
      unityInstance.SetFullscreen(isFullscreen ? 0 : 1);
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-2">Failed to Load Unity WebGL</div>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          <button
            onClick={handleReload}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Loading Unity WebGL...</p>
            <div className="w-64 h-2 bg-white/20 rounded-full mx-auto">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-white/80 text-sm mt-2">{loadingProgress}%</p>
          </div>
        </div>
      )}

      {/* Unity Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
        style={{ display: "block" }}
      />

      {/* Control Buttons */}
      {!isLoading && (
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleReload}
            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors"
            title="Reload"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UnityWebGLViewer;
