/**
 * Umami Analytics Service
 *
 * Fetches analytics data from the Express API proxy (/api/analytics/*),
 * which in turn queries the self-hosted Umami instance.
 *
 * Replaces the old Supabase-based trackingService for data retrieval.
 * Tracking (pageviews, events) is now handled by the Umami script automatically.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// =============================================
// Types matching Umami API responses
// =============================================

export interface AnalyticsStats {
  pageviews: { value: number; prev: number };
  visitors: { value: number; prev: number };
  visits: { value: number; prev: number };
  bounces: { value: number; prev: number };
  totaltime: { value: number; prev: number };
}

export interface AnalyticsPageviews {
  pageviews: Array<{ t: string; y: number }>;
  sessions: Array<{ t: string; y: number }>;
}

export interface AnalyticsMetric {
  x: string;
  y: number;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  totalVisits: number;
  bounces: number;
  totalTime: number;
  bounceRate: number;
  avgVisitDuration: number;
  trend: number;
  days: number;
  dailyStats: Array<{
    date: string;
    visitors: number;
    pageViews: number;
  }>;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

// =============================================
// API Fetch Helpers
// =============================================

async function fetchApi<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<T | null> {
  try {
    const url = new URL(`${API_BASE}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      if (import.meta.env.DEV) {
        console.error(
          `Analytics API error: ${response.status} ${response.statusText}`,
        );
      }
      return null;
    }

    const json: ApiResponse<T> = await response.json();
    return json.success ? json.data : null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`Analytics API fetch failed:`, error);
    }
    return null;
  }
}

// =============================================
// Public API Functions
// =============================================

/**
 * Get summary analytics for the public dashboard.
 * Includes: stats, daily trends, device breakdown, bounce rate, trend %.
 */
export async function getAnalyticsSummary(
  range: string = "14d",
): Promise<AnalyticsSummary | null> {
  return fetchApi<AnalyticsSummary>("/api/analytics/summary", { range });
}

/**
 * Get detailed stats (pageviews, visitors, visits, bounces, totaltime).
 * Each stat includes current value and previous period value for comparison.
 */
export async function getAnalyticsStats(
  range: string = "7d",
): Promise<AnalyticsStats | null> {
  return fetchApi<AnalyticsStats>("/api/analytics/stats", { range });
}

/**
 * Get time-series pageviews and sessions data.
 */
export async function getAnalyticsPageviews(
  range: string = "7d",
  unit: string = "day",
): Promise<AnalyticsPageviews | null> {
  return fetchApi<AnalyticsPageviews>("/api/analytics/pageviews", {
    range,
    unit,
  });
}

/**
 * Get number of currently active visitors.
 */
export async function getActiveVisitors(): Promise<number> {
  const data = await fetchApi<{ visitors: number }>("/api/analytics/active");
  return data?.visitors || 0;
}

/**
 * Get metrics breakdown by type.
 * @param type - 'device' | 'browser' | 'os' | 'country' | 'url' | 'referrer' | 'event'
 */
export async function getAnalyticsMetrics(
  type: string = "device",
  range: string = "7d",
  limit: string = "10",
): Promise<AnalyticsMetric[] | null> {
  const data = await fetchApi<{ data: AnalyticsMetric[] } | AnalyticsMetric[]>(
    "/api/analytics/metrics",
    { type, range, limit },
  );

  // Handle both wrapped and unwrapped responses
  if (Array.isArray(data)) return data;
  if (data && "data" in data) return data.data;
  return null;
}

/**
 * Get custom events data.
 */
export async function getAnalyticsEvents(range: string = "7d") {
  return fetchApi("/api/analytics/events", { range });
}
