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
 */

import logger from "./logger";

/** Status of the pre-loading process */
export type PreloadStatus = "idle" | "loading" | "cached" | "error";

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

/** Get the Unity build file URLs based on current BASE_URL */
function getUnityFileUrls(): string[] {
  const basePath = import.meta.env.BASE_URL || "/";
  const buildPath = `${basePath}unity-builds/v0.2.08/Build`;

  return [
    `${buildPath}/v0.2.08.loader.js`,
    `${buildPath}/v0.2.08.framework.js.br`,
    `${buildPath}/v0.2.08.wasm.br`,
    `${buildPath}/v0.2.08.data.br`,
  ];
}

/** Notify all listeners of progress changes */
function notifyListeners() {
  listeners.forEach((fn) => fn({ ...preloadProgress }));
}

/**
 * Pre-cache a single file using fetch.
 * The browser will store the response in its HTTP cache.
 * Next time Unity requests the same URL, it'll be served from cache.
 */
async function precacheFile(url: string): Promise<void> {
  try {
    const response = await fetch(url, {
      method: "GET",
      // "force-cache" will use cache if available, otherwise download
      cache: "force-cache",
      // Low priority — don't compete with user interactions
      priority: "low",
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

  const urls = getUnityFileUrls();
  preloadStatus = "loading";
  preloadProgress = { total: urls.length, loaded: 0, status: "loading" };
  notifyListeners();

  logger.labeled("UnityPreloader", `Starting background pre-cache of ${urls.length} files...`);

  // Download sequentially to avoid bandwidth saturation
  for (const url of urls) {
    await precacheFile(url);
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
 * Schedule Unity pre-loading after the page is idle.
 * Uses requestIdleCallback for truly non-blocking behavior,
 * with a fallback to setTimeout for browsers that don't support it.
 *
 * @param delayMs - Minimum delay after calling before starting (default: 3000ms)
 */
export function scheduleUnityPreload(delayMs: number = 3000): void {
  // Don't preload on GitHub Pages (Unity doesn't work there anyway)
  if (window.location.hostname.includes("github.io")) {
    logger.labeled("UnityPreloader", "Skipping — GitHub Pages detected");
    return;
  }

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
