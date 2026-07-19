import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  MapPin,
  Maximize2,
  Minimize2,
  Mouse,
  MousePointerClick,
  Hand,
  Gamepad2,
  Headset,
  Phone,
  X,
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
  matchWebGLToBrowser?: boolean;
  devicePixelRatio?: number;
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
  const [loadingMessage, setLoadingMessage] = useState<string>(t("campusMapLoading"));
  const [error, setError] = useState<string | null>(null);
  const unityInstanceRef = useRef<UnityInstance | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    setIsMobileDevice(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || ('ontouchstart' in window) || window.innerWidth <= 768);
  }, []);

  // Prevent Unity WebGL canvas from resizing when virtual keyboard opens on mobile
  // (Resizing the canvas causes Unity to reallocate render buffers, resulting in a black screen flash)
  useEffect(() => {
    if (!isMobileDevice) return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        if (containerRef.current) {
          // Lock height to current pixel height to prevent resize flicker
          containerRef.current.style.height = `${containerRef.current.offsetHeight}px`;
        }
      }
    };
    
    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        // Unlock height after keyboard closes (with a slight delay)
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.height = "";
          }
        }, 300);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [isMobileDevice]);

  /** Estimate download time based on connection speed and return hint string */
  const getDownloadHint = useCallback((): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connection = (navigator as any).connection;
    if (connection?.downlink) {
      // v0.2.15 total: ~45 MB compressed
      const mbps = connection.downlink; // Mbps
      const estimatedSeconds = Math.round((39 * 8) / mbps); // MB × 8 bits / Mbps
      if (estimatedSeconds < 30) return `~${estimatedSeconds} ${t("campusMapSeconds")}`;
      if (estimatedSeconds < 120) return `~${Math.round(estimatedSeconds / 10) * 10} ${t("campusMapSeconds")}`;
      return `~${Math.round(estimatedSeconds / 60)} ${t("campusMapMinutes")}`;
    }
    return "";
  }, [t]);

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
      dataUrl: `${basePath}unity-builds/v0.7.4/Build/v0.7.4.data.unityweb`,
      frameworkUrl: `${basePath}unity-builds/v0.7.4/Build/v0.7.4.framework.js.unityweb`,
      codeUrl: `${basePath}unity-builds/v0.7.4/Build/v0.7.4.wasm.unityweb`,
      streamingAssetsUrl: "StreamingAssets",
      companyName: "DefaultCompany",
      productName: "T_A",
      productVersion: "v0.7.4",
      matchWebGLToBrowser: true,
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
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
    let fakeProgressInterval: ReturnType<typeof setInterval> | undefined;

    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth || 960;
      canvas.height = container.clientHeight || 600;
    };

    const loadUnityBuild = async () => {
      const canvas = canvasRef.current;
      if (!canvas || !containerRef.current) return;

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
            ? `${t("campusMapDownloading")}, ${t("campusMapEstimated")} ${hint}...`
            : `${t("campusMapDownloading")}...`
        );
        setIsLoading(true);
        setError(null);
      }

      try {
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setError(t("campusMapTimeout"));
            setIsLoading(false);
          }
        }, 180000); // 3 minute timeout for 39MB

        // Progressive messages to keep user informed during long download
        msg15s = setTimeout(() => { if (isMounted) setLoadingMessage(t("campusMapStillDownloading")); }, 15000);
        msg45s = setTimeout(() => { if (isMounted) setLoadingMessage(t("campusMapAlmostDone")); }, 45000);
        msg90s = setTimeout(() => { if (isMounted) setLoadingMessage(t("campusMapTakingLonger")); }, 90000);

        // Simulate progress for cached loads (Unity sometimes skips progress events on fast cache hits)
        fakeProgressInterval = setInterval(() => {
          if (!isMounted) return;
          setLoadingProgress((prev) => {
            if (prev >= 90) return prev; // Stop at 90%
            return prev + 1; // 1% every 30ms (~2.7s to 90%)
          });
        }, 30);
        
        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        // First, dynamically load the Unity loader script - use BASE_URL for GitHub Pages
        const loaderUrl = `${basePath}unity-builds/v0.7.4/Build/v0.7.4.loader.js`;
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

        const configWithProgress = {
          ...unityConfig,
          onProgress: (progress: number) => {
            if (isMounted) {
              const pct = typeof progress === 'number' && !Number.isNaN(progress) 
                ? Math.round(progress * 100) 
                : 0;
              setLoadingProgress(prev => Math.max(prev, pct));
            }
          }
        };

        // Pass onProgress both inside config and as 3rd parameter to support different Unity WebGL loader versions
        const instance = await window.createUnityInstance(
          canvas, 
          configWithProgress, 
          configWithProgress.onProgress
        );

        if (!isMounted) {
          instance.Quit();
          return;
        }

        console.log("Unity instance created successfully");
        if (timeoutId) clearTimeout(timeoutId);
        clearTimeout(msg15s);
        clearTimeout(msg45s);
        clearTimeout(msg90s);
        if (fakeProgressInterval) clearInterval(fakeProgressInterval);
        
        setLoadingProgress(100);
        setLoadingMessage(t("campusMapReady"));
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
        if (fakeProgressInterval) clearInterval(fakeProgressInterval);

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
      if (fakeProgressInterval) clearInterval(fakeProgressInterval);
      
      if (unityInstanceRef.current) {
        try {
          unityInstanceRef.current.Quit();
          unityInstanceRef.current = null;
          window.unityInstance = null;
        } catch (err) {
          console.error("Error cleaning up Unity instance:", err);
        }
      }
      
      window.removeEventListener("resize", updateCanvasSize);
      try {
        (screen.orientation as ScreenOrientation & { unlock?: () => void }).unlock?.();
      } catch {
        // ignore
      }
    };
  }, [basePath, getDownloadHint, t, unityConfig]);

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
      className={`bg-white overflow-hidden ${
        isFullscreen || isMobileLandscape ? "w-full h-full flex flex-col rounded-none" : "rounded-xl shadow-lg"
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
        className={`relative ${isFullscreen || isMobileLandscape ? "flex-1 w-full min-h-0" : "h-96 lg:h-[500px]"}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="text-center max-w-sm px-6">
              <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                {/* Circular loader around */}
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#2C5F2D] border-t-transparent rounded-full animate-spin"></div>
                {/* Logo inside */}
                <img src={`${basePath}logoupnvj.webp`} alt="UPNVJ Logo" className="w-16 h-16 object-contain animate-pulse" />
              </div>
              <p className="text-gray-800 font-semibold text-base mb-1">{loadingMessage}</p>
              <div className="w-full max-w-64 h-3 bg-gray-200 rounded-full mx-auto mt-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2C5F2D] to-emerald-500 rounded-full transition-[width] duration-75 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-[#2C5F2D] font-bold text-lg mt-2">{loadingProgress}%</p>
              <p className="text-gray-500 text-xs mt-3">
                {t("campusMapLargeFileWarning")}
              </p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          id="unity-canvas"
          className={`w-full h-full touch-none cursor-grab active:cursor-grabbing ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
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
              <div className="w-full h-full flex flex-row relative">
                {/* Title */}
                <div className="absolute top-[15%] left-0 right-0 flex justify-center w-full z-20">
                    <h3 className="mx-3 text-center text-base min-[390px]:text-xl md:text-2xl font-bold text-white drop-shadow-lg tracking-wide animate-pulse bg-black/40 px-4 min-[390px]:px-6 py-2 rounded-full border border-white/20">
                    {t("campusMapTouchToStart")}
                  </h3>
                </div>
                
                {/* Left Side: Joystick */}
                <div className="flex-1 flex flex-col items-center justify-center border-r border-white/10 px-2 bg-gradient-to-r from-black/40 to-transparent pt-10">
                  <div className="bg-white/20 p-4 rounded-full border border-white/30 mb-4 backdrop-blur-sm">
                    <Gamepad2 className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-white drop-shadow-md mb-1">{t("campusMapMove")}</h4>
                  <p className="text-white/80 text-xs md:text-sm font-medium text-center max-w-[150px]">
                    {t("campusMapUseJoystick")}
                  </p>
                </div>

                {/* Right Side: Swipe */}
                <div className="flex-1 flex flex-col items-center justify-center px-2 bg-gradient-to-l from-black/40 to-transparent pt-10">
                  <div className="bg-white/20 p-4 rounded-full border border-white/30 mb-4 backdrop-blur-sm animate-bounce">
                    <Hand className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-white drop-shadow-md mb-1">{t("campusMapLook")}</h4>
                  <p className="text-white/80 text-xs md:text-sm font-medium text-center max-w-[150px]">
                    {t("campusMapSwipeToLook")}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white/20 p-4 rounded-full border border-white/30 mb-6 animate-bounce">
                  <MousePointerClick className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                
                <div className="flex flex-col items-center">
                  <h3 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide mb-2">{t("campusMapClickToStart")}</h3>
                  <p className="text-white/90 text-base drop-shadow-md font-medium mb-8">{t("campusMapClickToLock")}</p>
                  
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
            className="unity-minimize-button absolute z-20 flex items-center gap-2 px-3 min-[390px]:px-4 py-2.5 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-xl transition-all duration-200 shadow-lg border border-white/10"
            title={t("exitFullscreen")}
          >
            <Minimize2 className="w-4 h-4 text-white" />
              <span className="hidden min-[390px]:inline text-white text-sm font-medium">Minimize</span>
          </button>
        )}

        {/* Floating Help Button */}
        {!isLoading && !error && (
          <button
            onClick={() => setShowHelpModal(true)}
            className="unity-help-button absolute z-[30] flex items-center gap-2.5 px-3 min-[390px]:px-4 py-2.5 lg:px-5 lg:py-3 bg-white hover:bg-gray-50 text-[#2C5F2D] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all hover:scale-105 border border-gray-100 group"
            title="Bantuan & Kontak Darurat"
          >
            <Headset className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="hidden min-[390px]:inline font-bold text-sm lg:text-base pr-1">Butuh Bantuan?</span>
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

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="bg-gradient-to-r from-[#2C5F2D] to-[#3d7a3e] p-5 flex items-center justify-between relative overflow-hidden">
              {/* Decorative circle */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                  <Headset className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">Bantuan & Kontak</h3>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                  <span className="w-1.5 h-1.5 bg-[#2C5F2D] rounded-full mr-2"></span>
                  Panduan Navigasi
                </h4>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  Gunakan <strong className="text-gray-800">Kotak Pencarian</strong> di bagian atas untuk menemukan ruangan atau fasilitas. 
                  Setelah memilih, ikuti garis putus-putus di lantai.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Untuk memutar kamera, <strong className="text-gray-800">klik kiri & tahan</strong> mouse Anda, atau geser layar pada perangkat mobile. Tekan <strong className="text-gray-800 bg-gray-100 px-1 rounded">ESC</strong> untuk melepas kursor.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
                  Kontak Darurat Kampus
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 hover:border-green-200 hover:shadow-md transition-all group">
                    <span className="text-sm font-semibold text-gray-700">Pelayanan Kampus</span>
                    <a href="tel:0217699431" className="text-sm font-bold text-[#2C5F2D] group-hover:text-green-600 transition-colors bg-green-50 px-3 py-1 rounded-lg">021-7699431</a>
                  </div>
                  <div className="flex items-center justify-between bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 hover:border-green-200 hover:shadow-md transition-all group">
                    <span className="text-sm font-semibold text-gray-700">Pelayanan Kampus</span>
                    <a href="tel:0217656971" className="text-sm font-bold text-[#2C5F2D] group-hover:text-green-600 transition-colors bg-green-50 px-3 py-1 rounded-lg">021-7656971</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusMapViewer;
