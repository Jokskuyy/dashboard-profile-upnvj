import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  MapPin,
  Maximize2,
  Minimize2,
  Mouse,
  MousePointerClick,
} from "lucide-react";
import SearchOverlay from "./SearchOverlay";

// NOTE: unityKeyboardPatch is dynamically imported inside loadUnityBuild()
// to avoid patching EventTarget.prototype on initial page load (TBT reduction)

interface CampusMapViewerProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onClose?: () => void;
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
  const [loadingMessage, setLoadingMessage] = useState<string>("Memuat Denah Virtual...");
  const [error, setError] = useState<string | null>(null);
  const unityInstanceRef = useRef<UnityInstance | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || ('ontouchstart' in window) || window.innerWidth <= 768);
  }, []);

  /** Estimate download time based on connection speed and return hint string */
  function getDownloadHint(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connection = (navigator as any).connection;
    if (connection?.downlink) {
      // v0.2.15 total: ~45 MB compressed
      const mbps = connection.downlink; // Mbps
      const estimatedSeconds = Math.round((39 * 8) / mbps); // MB × 8 bits / Mbps
      if (estimatedSeconds < 30) return `~${estimatedSeconds} detik`;
      if (estimatedSeconds < 120) return `~${Math.round(estimatedSeconds / 10) * 10} detik`;
      return `~${Math.round(estimatedSeconds / 60)} menit`;
    }
    return "";
  }

  // Exit mobile fullscreen
  const exitMobileFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      (screen.orientation as ScreenOrientation & { unlock?: () => void }).unlock?.();
    } catch {
      // ignore
    }
    setIsMobileLandscape(false);
  };

  // Listen for fullscreen exit (back button, etc.)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isMobileLandscape) {
        setIsMobileLandscape(false);
        try {
          (screen.orientation as ScreenOrientation & { unlock?: () => void }).unlock?.();
        } catch {
          // ignore
        }
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isMobileLandscape]);

  // Unity WebGL configuration
  const basePath = import.meta.env.BASE_URL;
  const unityConfig = useMemo(
    () => ({
      dataUrl: `${basePath}unity-builds/v0.6.2/Build/v0.6.2.data.unityweb`,
      frameworkUrl: `${basePath}unity-builds/v0.6.2/Build/v0.6.2.framework.js.unityweb`,
      codeUrl: `${basePath}unity-builds/v0.6.2/Build/v0.6.2.wasm.unityweb`,
      streamingAssetsUrl: "StreamingAssets",
      companyName: "DefaultCompany",
      productName: "T_A",
      productVersion: "v0.6.2",
      showBanner: unityShowBanner,
    }),
    [basePath],
  );

  /** Check WebGL2 first, fallback to WebGL1 */
  const checkWebGLSupport = (): boolean => {
    try {
      const canvas = document.createElement("canvas");
      // Prefer WebGL2 for better performance
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) return false;

      // Log GPU info for diagnostics (not user-facing)
      const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        console.log(`[Unity] GPU: ${renderer}`);
      }
      return true;
    } catch {
      return false;
    }
  };

  function unityShowBanner(msg: string, type: string) {
    console.log(`[Unity ${type}]: ${msg}`);
    if (type === "error") {
      setError(msg);
    }
  }

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    let msg15s: NodeJS.Timeout | undefined;
    let msg45s: NodeJS.Timeout | undefined;
    let msg90s: NodeJS.Timeout | undefined;

    const loadUnityBuild = async () => {
      if (!canvasRef.current || !containerRef.current) return;

      if (!checkWebGLSupport()) {
        if (isMounted) {
          setWebglSupported(false);
          setError("WebGL is not supported on this device. Please use a modern browser with WebGL enabled.");
          setIsLoading(false);
        }
        return;
      }

      // Dynamically import keyboard patch here (not at module top-level)
      // This avoids monkey-patching EventTarget.prototype on initial page load
      await import("../../utils/unityKeyboardPatch");

      if (!isMounted) return;

      // Set initial loading message with download estimate
      const hint = getDownloadHint();
      if (isMounted) {
        setLoadingMessage(
          hint
            ? `Mengunduh Denah Virtual (~39 MB, estimasi ${hint})...`
            : "Mengunduh Denah Virtual (~39 MB)..."
        );
        setIsLoading(true);
        setError(null);
      }

      try {
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setError("Loading timeout. Ukuran file sangat besar (~39 MB). Periksa koneksi internet Anda dan coba lagi.");
            setIsLoading(false);
          }
        }, 180000); // 3 minute timeout for 39MB

        // Progressive messages to keep user informed during long download
        msg15s = setTimeout(() => { if (isMounted) setLoadingMessage("Masih mengunduh... Unity WebGL memerlukan waktu beberapa menit pada koneksi lambat."); }, 15000);
        msg45s = setTimeout(() => { if (isMounted) setLoadingMessage("Hampir selesai... File besar sedang diproses."); }, 45000);
        msg90s = setTimeout(() => { if (isMounted) setLoadingMessage("Proses lebih lama dari biasanya. Periksa koneksi internet Anda."); }, 90000);

        const canvas = canvasRef.current;
        const container = containerRef.current;
        canvas.width = container.clientWidth || 960;
        canvas.height = container.clientHeight || 600;

        // First, dynamically load the Unity loader script - use BASE_URL for GitHub Pages
        const loaderUrl = `${basePath}unity-builds/v0.6.2/Build/v0.6.2.loader.js`;
        if (!window.createUnityInstance) {
          console.log("Loading Unity WebGL loader...");
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
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

        if (!isMounted) return;

        if (!window.createUnityInstance) {
          throw new Error("Unity WebGL createUnityInstance not available");
        }

        console.log("Creating Unity instance with config:", unityConfig);

        const instance = await window.createUnityInstance(canvas, unityConfig, (progress: number) => {
          if (isMounted) setLoadingProgress(Math.round(progress * 100));
        });

        if (!isMounted) {
          instance.Quit();
          return;
        }

        console.log("Unity instance created successfully");
        if (timeoutId) clearTimeout(timeoutId);
        clearTimeout(msg15s);
        clearTimeout(msg45s);
        clearTimeout(msg90s);
        
        setLoadingMessage("Denah Virtual siap!");
        unityInstanceRef.current = instance;
        window.unityInstance = instance;
        
        // --- Sync Device Platform to Unity ---
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
        try {
          instance.SendMessage("WebPlatformSync", "SetDevice", isMobile ? "mobile" : "desktop");
        } catch (e) {
          console.warn("Could not send SetDevice message to Unity, maybe GameObject 'WebPlatformSync' doesn't exist yet", e);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load Unity WebGL build:", err);
        if (!isMounted) return;
        
        if (timeoutId) clearTimeout(timeoutId);
        clearTimeout(msg15s);
        clearTimeout(msg45s);
        clearTimeout(msg90s);

        let errorMessage = "Failed to load campus map";
        if (err instanceof Error) {
          if (err.message.includes("memory")) {
            errorMessage = "Not enough memory to load the map. Please close other tabs and try again.";
          } else if (err.message.includes("network") || err.message.includes("Failed to fetch")) {
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
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(msg15s);
      clearTimeout(msg45s);
      clearTimeout(msg90s);
      
      if (unityInstanceRef.current) {
        try {
          unityInstanceRef.current.Quit();
          unityInstanceRef.current = null;
          window.unityInstance = null;
        } catch (err) {
          console.error("Error cleaning up Unity instance:", err);
        }
      }
      try {
        (screen.orientation as ScreenOrientation & { unlock?: () => void }).unlock?.();
      } catch {
        // ignore
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("campusMapUnavailable")}</h3>
          <p className="text-gray-600 mb-4">{error}</p>

          {!webglSupported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ WebGL Not Supported</h4>
              <p className="text-sm text-yellow-700">Your browser or device doesn't support WebGL. Try:</p>
              <ul className="text-sm text-yellow-700 space-y-1 text-left mt-2 ml-4 list-disc">
                <li>Update your browser to the latest version</li>
                <li>Enable hardware acceleration in browser settings</li>
                <li>Use Chrome, Firefox, or Edge browser</li>
                <li>Check if your GPU drivers are up to date</li>
              </ul>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">💡 Troubleshooting Tips:</h4>
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
        isFullscreen || isMobileLandscape ? "fixed inset-0 z-50 rounded-none" : ""
      }`}
    >
      {/* Header - hidden in fullscreen */}
      {!isFullscreen && !isMobileLandscape && (
        <div className="bg-gradient-to-r from-[#2C5F2D] to-[#3d7a3e] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t("campusMapTitle")}</h3>
                <p className="text-green-100 text-sm">{t("interactive3DCampusLayout")}</p>
              </div>
            </div>
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title={t("enterFullscreen")}
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Unity WebGL Canvas Container */}
      <div
        id="unity-container"
        className={`relative ${isFullscreen || isMobileLandscape ? "h-full" : "h-96 lg:h-[500px]"}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="text-center max-w-sm px-6">
              <div className="w-14 h-14 border-4 border-[#2C5F2D] border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>
              <p className="text-white font-semibold text-base mb-1">{loadingMessage}</p>
              <div className="w-64 h-3 bg-gray-700 rounded-full mx-auto mt-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2C5F2D] to-[#4ade80] rounded-full transition-all duration-500"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-[#4ade80] font-bold text-lg mt-2">{loadingProgress}%</p>
              <p className="text-gray-500 text-xs mt-3">
                File besar (~39 MB). Kunjungan berikutnya akan lebih cepat karena file tersimpan di cache browser.
              </p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          id="unity-canvas"
          className={`w-full h-full ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
          style={{
            display: "block",
            background: "linear-gradient(135deg, #2C5F2D 0%, #3d7a3e 100%)",
          }}
          tabIndex={-1}
        />

        {/* Interaction Overlay (Tap to Start) */}
        {!isLoading && !error && !hasInteracted && (
          <div 
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer transition-all hover:bg-black/60"
            onClick={() => {
              setHasInteracted(true);
              canvasRef.current?.focus();
              try {
                // Request pointer lock directly from frontend to guarantee it works immediately
                canvasRef.current?.requestPointerLock?.();
              } catch (e) {
                console.error("Pointer lock failed:", e);
              }
            }}
          >
            {isMobileDevice ? (
              <div className="flex flex-col items-center text-center px-6">
                <h3 className="text-2xl font-bold text-white drop-shadow-lg tracking-wide mb-2">Sentuh untuk Mulai</h3>
                <p className="text-white/90 text-sm drop-shadow-md font-medium">Gunakan joystick virtual untuk berkeliling kampus</p>
              </div>
            ) : (
              <>
                <div className="bg-white/20 p-4 rounded-full border border-white/30 mb-6 animate-bounce">
                  <MousePointerClick className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                
                <div className="flex flex-col items-center">
                  <h3 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide mb-2">Klik untuk Mulai Eksplorasi</h3>
                  <p className="text-white/90 text-base drop-shadow-md font-medium mb-8">Klik pada area ini untuk mengunci kursor dan mulai</p>
                  
                  <div className="flex items-center space-x-10 p-6 bg-black/40 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl">
                    {/* Move */}
                    <div className="flex flex-col items-center">
                      <div className="flex flex-col items-center space-y-1.5">
                        <kbd className="w-10 h-10 flex items-center justify-center bg-white/10 border-b-4 border-white/30 rounded-lg text-white font-mono font-bold text-base shadow-sm">W</kbd>
                        <div className="flex space-x-1.5">
                          <kbd className="w-10 h-10 flex items-center justify-center bg-white/10 border-b-4 border-white/30 rounded-lg text-white font-mono font-bold text-base shadow-sm">A</kbd>
                          <kbd className="w-10 h-10 flex items-center justify-center bg-white/10 border-b-4 border-white/30 rounded-lg text-white font-mono font-bold text-base shadow-sm">S</kbd>
                          <kbd className="w-10 h-10 flex items-center justify-center bg-white/10 border-b-4 border-white/30 rounded-lg text-white font-mono font-bold text-base shadow-sm">D</kbd>
                        </div>
                      </div>
                      <span className="text-white/80 text-xs mt-4 font-bold uppercase tracking-widest">Bergerak</span>
                    </div>

                    {/* Jump */}
                    <div className="flex flex-col items-center">
                      <div className="h-[86px] flex items-end">
                        <kbd className="w-40 h-10 flex items-center justify-center bg-white/10 border-b-4 border-white/30 rounded-lg text-white font-mono font-bold text-base shadow-sm px-4">Space</kbd>
                      </div>
                      <span className="text-white/80 text-xs mt-4 font-bold uppercase tracking-widest">Lompat</span>
                    </div>

                    {/* Run */}
                    <div className="flex flex-col items-center">
                      <div className="h-[86px] flex items-end">
                        <kbd className="w-24 h-10 flex items-center justify-center bg-white/10 border-b-4 border-white/30 rounded-lg text-white font-mono font-bold text-base shadow-sm px-4">Shift</kbd>
                      </div>
                      <span className="text-white/80 text-xs mt-4 font-bold uppercase tracking-widest">Lari</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Search overlay */}
        <SearchOverlay isUnityLoaded={!isLoading && !error} />

        {/* Floating minimize button in fullscreen */}
        {(isFullscreen || isMobileLandscape) && !isLoading && (
          <button
            onClick={() => {
              if (isMobileLandscape) {
                exitMobileFullscreen();
              }
              if (onToggleFullscreen) {
                onToggleFullscreen();
              }
            }}
            className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-xl transition-all duration-200 shadow-lg border border-white/10"
            title={t("exitFullscreen")}
          >
            <Minimize2 className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Minimize</span>
          </button>
        )}
      </div>

      {/* Info Panel */}
      {!isLoading && !error && !isMobileLandscape && (
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
