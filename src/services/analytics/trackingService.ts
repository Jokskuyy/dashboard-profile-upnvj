/**
 * @deprecated This service is deprecated. Tracking is now handled by Umami Analytics.
 * - Pageviews: Automatically tracked by Umami script (injected in Analytics.tsx)
 * - Custom events: Use trackingHelpers.ts which calls window.umami.track()
 * - Data retrieval: Use umamiService.ts which queries /api/analytics/* endpoints
 *
 * This file is kept for reference only. The Supabase `web_analytics_log` table
 * retains historical data but no new data is inserted.
 */

// Web Tracking Service with Supabase (DEPRECATED - replaced by Umami)

import logger from "../../utils/logger";

/** @deprecated Use Umami auto-tracking instead */
export const trackPageView = async (_page: string) => {
  logger.log(
    "[DEPRECATED] trackPageView called — Umami handles this automatically",
  );
};

/** @deprecated Use trackingHelpers.ts (which uses window.umami.track) instead */
export const trackEvent = async (
  _eventName: string,
  _eventData?: Record<string, unknown>,
) => {
  logger.log("[DEPRECATED] trackEvent called — use trackingHelpers.ts instead");
};

/** @deprecated Use umamiService.ts getAnalyticsSummary() instead */
export const getAnalytics = async (_days: number = 7) => {
  logger.log("[DEPRECATED] getAnalytics called — use umamiService.ts instead");
  return {
    success: false,
    totalVisitors: 0,
    totalPageViews: 0,
    dailyStats: [],
    deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
  };
};

/** @deprecated Umami auto-tracks on script load, no init needed */
export const initTracking = () => {
  logger.log(
    "[DEPRECATED] initTracking called — Umami handles this automatically",
  );
};
