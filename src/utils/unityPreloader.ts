/**
 * Unity WebGL Pre-loader
 *
 * Downloads Unity build files into browser cache in the background
 * AFTER the main page has finished rendering. This way, when the user
 * clicks "Launch Unity Map", the files are already cached and loading
 * is near-instant (only initialization time, no download wait).
 *
 * Strategy: "Pre-cache, don't pre-init"
 * - Downloads .wasm, .data, .framework.js, .loader.js
 * - Does NOT initialize Unity (no CPU/GPU/RAM usage until user clicks)
 * - Uses low-priority fetch (requestIdleCallback) to avoid blocking UI
 * - Falls back to setTimeout if requestIdleCallback is unavailable
 * - Skips preload on: mobile, Save-Data mode, 2G connections, GitHub Pages
 * - Priority order: loader (27KB) → framework (81KB) → wasm (9.2MB) → data (29.3MB)
 */

import logger from "./logger";

/** Status of the pre-loading process */
export type PreloadStatus = "idle" | "loading" | "cached" | "error" | "skipped";

/** Progress info for each file */
interface PreloadProgress {
  total: number;
  loaded: number;
  status: PreloadStatus;
}

// Module-level state
let preloadStatus: PreloadStatus = "idle";
let preloadProgress: PreloadProgress = { total: 0, loaded: 0, status: "idle" };
const listeners: Set<(progress: PreloadProgress) => void> = new Set();
let abortController: AbortController | null = null;

/** Get the Unity build file URLs in download-priority order (smallest first) */
function getUnityFileUrls(): string[] {
  const basePath = import.meta.env.BASE_URL || "/";
  const buildPath = `${basePath}unity-builds/v0.7.4/Build`;

  // Priority: loader (118KB) → framework (77KB) → wasm (6.7MB) → data (35.8MB)
  // Smallest first so Unity can start bootstrapping ASAP once user clicks
  return [
    `${buildPath}/v0.7.4.loader.js`,
    `${buildPath}/v0.7.4.framework.js.unityweb`,
    `${buildPath}/v0.7.4.wasm.unityweb`,
    `${buildPath}/v0.7.4.data.unityweb`,
  ];
}

/** Notify all listeners of progress changes */
function notifyListeners() {
  listeners.forEach((fn) => fn({ ...preloadProgress }));
}

/**
 * Check if preloading should be skipped based on connection / device / prefs.
 * Returns { skip: true, reason: string } or { skip: false }
 */
function shouldSkipPreload(): { skip: boolean; reason?: string } {
  // Skip on GitHub Pages (Unity with Brotli doesn't work there)
  if (window.location.hostname.includes("github.io")) {
    return { skip: true, reason: "GitHub Pages detected" };
  }

  // Skip on mobile — Unity WebGL is too heavy for most mobile devices
  const isMobile =
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
  if (isMobile) {
    return { skip: true, reason: "Mobile device detected — Unity WebGL skipped" };
  }

  // Check navigator.connection (Network Information API)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connection = (navigator as any).connection;
  if (connection) {
    // User explicitly requested reduced data usage
    if (connection.saveData) {
      return { skip: true, reason: "Save-Data mode enabled" };
    }
    // Slow connection — don't compete with active page resources
    if (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g") {
      return { skip: true, reason: `Slow connection: ${connection.effectiveType}` };
    }
  }

  return { skip: false };
}

/**
 * Pre-cache a single file using fetch.
 * The browser will store the response in its HTTP cache.
 * Next time Unity requests the same URL, it'll be served from cache.
 */
async function precacheFile(url: string, signal: AbortSignal): Promise<void> {
  try {
    const response = await fetch(url, {
      method: "GET",
      // "force-cache" will use cache if available, otherwise download
      cache: "force-cache",
      // Low priority — don't compete with user interactions
      priority: "low",
      signal,
    } as RequestInit);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    // Consume the body to ensure the full file is downloaded into cache
    await response.blob();

    preloadProgress.loaded++;
    notifyListeners();

    logger.labeled(
      "UnityPreloader",
      `Cached (${preloadProgress.loaded}/${preloadProgress.total}): ${url.split("/").pop()}`
    );
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      logger.labeled("UnityPreloader", `Aborted: ${url.split("/").pop()}`);
      return;
    }
    logger.warn(`[UnityPreloader] Failed to cache: ${url}`, err);
    // Don't throw — one file failing shouldn't stop others
  }
}

/**
 * Start pre-caching Unity files in the background.
 * Should be called after the main page has finished rendering.
 *
 * Files are downloaded sequentially (not in parallel) to minimize
 * bandwidth competition with user-facing API calls.
 */
export async function startUnityPreload(): Promise<void> {
  // Prevent duplicate preloads
  if (preloadStatus !== "idle") {
    logger.labeled("UnityPreloader", `Skipping — already ${preloadStatus}`);
    return;
  }

  const { skip, reason } = shouldSkipPreload();
  if (skip) {
    logger.labeled("UnityPreloader", `Skipping — ${reason}`);
    preloadStatus = "skipped";
    preloadProgress = { total: 0, loaded: 0, status: "skipped" };
    notifyListeners();
    return;
  }

  const urls = getUnityFileUrls();
  preloadStatus = "loading";
  preloadProgress = { total: urls.length, loaded: 0, status: "loading" };
  notifyListeners();

  // Create AbortController so we can cancel on navigation
  abortController = new AbortController();
  const { signal } = abortController;

  logger.labeled("UnityPreloader", `Starting background pre-cache of ${urls.length} files...`);

  // Download sequentially to avoid bandwidth saturation
  for (const url of urls) {
    if (signal.aborted) break;
    await precacheFile(url, signal);
  }

  if (signal.aborted) {
    preloadStatus = "idle";
    preloadProgress = { total: 0, loaded: 0, status: "idle" };
    notifyListeners();
    return;
  }

  if (preloadProgress.loaded === preloadProgress.total) {
    preloadStatus = "cached";
    preloadProgress.status = "cached";
    logger.labeled("UnityPreloader", "All files cached successfully ✓");
  } else {
    preloadStatus = "error";
    preloadProgress.status = "error";
    logger.labeled(
      "UnityPreloader",
      `Partial cache: ${preloadProgress.loaded}/${preloadProgress.total}`
    );
  }

  notifyListeners();
}

/**
 * Cancel an in-progress preload (e.g. when user navigates away).
 */
export function cancelUnityPreload(): void {
  if (abortController) {
    abortController.abort();
    abortController = null;
    logger.labeled("UnityPreloader", "Preload cancelled");
  }
}

/**
 * Schedule Unity pre-loading after the page is idle.
 * Uses requestIdleCallback for truly non-blocking behavior,
 * with a fallback to setTimeout for browsers that don't support it.
 *
 * @param delayMs - Minimum delay after calling before starting (default: 3000ms)
 */
export function scheduleUnityPreload(delayMs: number = 3000): void {
  const startPreload = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => startUnityPreload(), { timeout: 10000 });
    } else {
      // Fallback for Safari and older browsers
      setTimeout(() => startUnityPreload(), 500);
    }
  };

  // Wait for page to settle first
  setTimeout(startPreload, delayMs);
}

/** Get current preload status */
export function getPreloadStatus(): PreloadStatus {
  return preloadStatus;
}

/** Get current preload progress */
export function getPreloadProgress(): PreloadProgress {
  return { ...preloadProgress };
}

/** Subscribe to preload progress changes */
export function onPreloadProgress(
  callback: (progress: PreloadProgress) => void
): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
