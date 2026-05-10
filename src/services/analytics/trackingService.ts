/**
 * Web Analytics Tracking Service
 *
 * Tracks page views by inserting records into the Supabase `web_analytics_log` table.
 * Each visit records: visitor fingerprint hash, page path, device type, and timestamp.
 */

import { supabase } from "../../lib/supabase";

// Simple device detection
const getDeviceType = (): string => {
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua))
    return "Mobile";
  return "Desktop";
};

// Generate a simple visitor hash (not personally identifiable)
const getVisitorHash = (): string => {
  const raw = [
    navigator.userAgent,
    screen.width + "x" + screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
  ].join("|");

  // Simple hash function (djb2)
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash * 33) ^ raw.charCodeAt(i);
  }
  return "v_" + Math.abs(hash).toString(36);
};

// Debounce: don't track same page within 5 seconds
let lastTrackedPage = "";
let lastTrackedTime = 0;

/**
 * Track a page view — inserts a record into web_analytics_log.
 * Called automatically on route changes.
 */
export const trackPageView = async (pagePath?: string): Promise<void> => {
  try {
    const page = pagePath || window.location.pathname;
    const now = Date.now();

    // Debounce: skip if same page tracked within 5 seconds
    if (page === lastTrackedPage && now - lastTrackedTime < 5000) {
      return;
    }

    lastTrackedPage = page;
    lastTrackedTime = now;

    const { error } = await supabase.from("web_analytics_log").insert({
      visitor_hash: getVisitorHash(),
      page_path: page,
      device_type: getDeviceType(),
    });

    if (error) {
      // Silently fail — tracking should never break the app
      if (import.meta.env.DEV) {
        console.warn("Analytics tracking error:", error.message);
      }
    }
  } catch {
    // Silently fail
  }
};

/**
 * Initialize tracking — call once on app mount.
 * Tracks the initial page load.
 */
export const initTracking = (): void => {
  trackPageView();
};
