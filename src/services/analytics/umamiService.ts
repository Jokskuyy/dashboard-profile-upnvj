/**
 * Analytics Data Service (Supabase-native)
 *
 * Reads analytics data directly from the `web_analytics_log` table in Supabase.
 * Replaces the previous Umami/Express proxy implementation.
 */

import { supabase } from "../../lib/supabase";

// =============================================
// Types (kept identical to previous interface)
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
// Helpers
// =============================================

/** Format Date as YYYY-MM-DD in LOCAL timezone (avoids UTC shift) */
const toLocalDateStr = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Parse range string (e.g. "7d", "14d", "30d", "90d") to a Date */
const getRangeStart = (range: string): Date => {
  const days =
    range === "90d" ? 90 : range === "30d" ? 30 : range === "14d" ? 14 : 7;
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getDaysFromRange = (range: string): number => {
  return range === "90d" ? 90 : range === "30d" ? 30 : range === "14d" ? 14 : 7;
};

// =============================================
// Public API Functions
// =============================================

/**
 * Get summary analytics for the dashboard.
 * Queries web_analytics_log directly.
 */
export async function getAnalyticsSummary(
  range: string = "14d",
): Promise<AnalyticsSummary | null> {
  try {
    const days = getDaysFromRange(range);
    const startDate = getRangeStart(range);
    const startISO = startDate.toISOString();

    // Previous period for trend calculation
    const prevStart = new Date(startDate);
    prevStart.setDate(prevStart.getDate() - days);
    const prevStartISO = prevStart.toISOString();

    // Fetch all records in the date range
    const { data: currentData, error: currentError } = await supabase
      .from("web_analytics_log")
      .select("visitor_hash, page_path, device_type, visited_at")
      .gte("visited_at", startISO)
      .order("visited_at", { ascending: true });

    if (currentError) {
      console.error("Analytics query error:", currentError);
      return null;
    }

    const records = currentData || [];

    // Fetch previous period for trend
    const { data: prevData } = await supabase
      .from("web_analytics_log")
      .select("visitor_hash")
      .gte("visited_at", prevStartISO)
      .lt("visited_at", startISO);

    const prevRecords = prevData || [];

    // Calculate stats
    const totalPageViews = records.length;
    const uniqueVisitors = new Set(records.map((r) => r.visitor_hash)).size;
    const prevUniqueVisitors = new Set(prevRecords.map((r) => r.visitor_hash)).size;

    // Trend percentage
    let trend = 0;
    if (prevUniqueVisitors > 0) {
      trend =
        ((uniqueVisitors - prevUniqueVisitors) / prevUniqueVisitors) * 100;
    }

    // Daily stats
    const dailyMap = new Map<
      string,
      { pageViews: number; visitors: Set<string> }
    >();

    // Initialize all days in range (from startDate up to today inclusive)
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const cursor = new Date(startDate);
    while (cursor <= today) {
      const key = toLocalDateStr(cursor);
      dailyMap.set(key, { pageViews: 0, visitors: new Set() });
      cursor.setDate(cursor.getDate() + 1);
    }

    records.forEach((r) => {
      const dateKey = toLocalDateStr(new Date(r.visited_at));
      const entry = dailyMap.get(dateKey);
      if (entry) {
        entry.pageViews++;
        if (r.visitor_hash) entry.visitors.add(r.visitor_hash);
      }
    });

    const dailyStats = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      pageViews: data.pageViews,
      visitors: data.visitors.size,
    }));

    // Device stats
    const deviceCount = { desktop: 0, mobile: 0, tablet: 0 };
    records.forEach((r) => {
      const dt = (r.device_type || "").toLowerCase();
      if (dt === "desktop") deviceCount.desktop++;
      else if (dt === "mobile") deviceCount.mobile++;
      else if (dt === "tablet") deviceCount.tablet++;
      else deviceCount.desktop++; // default
    });

    const totalDevices =
      deviceCount.desktop + deviceCount.mobile + deviceCount.tablet || 1;
    const deviceStats = {
      desktop: Math.round((deviceCount.desktop / totalDevices) * 100),
      mobile: Math.round((deviceCount.mobile / totalDevices) * 100),
      tablet: Math.round((deviceCount.tablet / totalDevices) * 100),
    };

    // Group pageviews into sessions to calculate bounce rate and duration
    // Sort records chronologically per visitor
    const sorted = [...records].sort((a, b) => {
      if (a.visitor_hash !== b.visitor_hash) {
        return (a.visitor_hash || "").localeCompare(b.visitor_hash || "");
      }
      return new Date(a.visited_at).getTime() - new Date(b.visited_at).getTime();
    });

    interface Session {
      visitorHash: string;
      pageviews: number;
      startTime: number;
      endTime: number;
    }
    const sessions: Session[] = [];
    let currentSession: Session | null = null;
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in ms

    sorted.forEach((r) => {
      if (!r.visitor_hash) return;
      const t = new Date(r.visited_at).getTime();

      if (
        !currentSession ||
        currentSession.visitorHash !== r.visitor_hash ||
        t - currentSession.endTime > SESSION_TIMEOUT
      ) {
        currentSession = {
          visitorHash: r.visitor_hash,
          pageviews: 1,
          startTime: t,
          endTime: t,
        };
        sessions.push(currentSession);
      } else {
        currentSession.pageviews++;
        currentSession.endTime = t;
      }
    });

    const totalSessions = sessions.length;
    let bounces = 0;
    let totalTime = 0;

    sessions.forEach((s) => {
      const duration = (s.endTime - s.startTime) / 1000; // in seconds
      totalTime += duration;
      if (s.pageviews === 1) {
        bounces++;
      }
    });

    const bounceRate = totalSessions > 0 ? Math.round((bounces / totalSessions) * 100) : 0;
    const avgVisitDuration = totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0;

    return {
      totalVisitors: uniqueVisitors,
      totalPageViews,
      totalVisits: totalSessions || uniqueVisitors,
      bounces,
      totalTime,
      bounceRate,
      avgVisitDuration,
      trend: Math.round(trend * 10) / 10,
      days,
      dailyStats,
      deviceStats,
    };
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return null;
  }
}

/**
 * Get detailed stats.
 */
export async function getAnalyticsStats(
  range: string = "7d",
): Promise<AnalyticsStats | null> {
  const summary = await getAnalyticsSummary(range);
  if (!summary) return null;

  return {
    pageviews: { value: summary.totalPageViews, prev: 0 },
    visitors: { value: summary.totalVisitors, prev: 0 },
    visits: { value: summary.totalVisits, prev: 0 },
    bounces: { value: summary.bounces, prev: 0 },
    totaltime: { value: summary.totalTime, prev: 0 },
  };
}

/**
 * Get time-series pageviews and sessions data.
 */
export async function getAnalyticsPageviews(
  range: string = "7d",
  _unit: string = "day",
): Promise<AnalyticsPageviews | null> {
  const summary = await getAnalyticsSummary(range);
  if (!summary) return null;

  return {
    pageviews: summary.dailyStats.map((d) => ({ t: d.date, y: d.pageViews })),
    sessions: summary.dailyStats.map((d) => ({ t: d.date, y: d.visitors })),
  };
}

/**
 * Get number of currently active visitors (visited in last 5 minutes).
 */
export async function getActiveVisitors(): Promise<number> {
  try {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("web_analytics_log")
      .select("visitor_hash")
      .gte("visited_at", fiveMinAgo);

    if (error) return 0;

    const unique = new Set((data || []).map((r) => r.visitor_hash));
    return unique.size;
  } catch {
    return 0;
  }
}

/**
 * Get metrics breakdown by type.
 */
export async function getAnalyticsMetrics(
  type: string = "device",
  range: string = "7d",
  limit: string = "10",
): Promise<AnalyticsMetric[] | null> {
  try {
    const startISO = getRangeStart(range).toISOString();
    const limitNum = parseInt(limit) || 10;

    const { data, error } = await supabase
      .from("web_analytics_log")
      .select("page_path, device_type, visitor_hash")
      .gte("visited_at", startISO);

    if (error || !data) return null;

    const countMap = new Map<string, number>();

    data.forEach((r) => {
      let key = "";
      if (type === "url") key = r.page_path || "/";
      else if (type === "device") key = r.device_type || "Desktop";
      else if (type === "event") return; // no events in this model
      else key = r.page_path || "/";

      countMap.set(key, (countMap.get(key) || 0) + 1);
    });

    const sorted = Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limitNum)
      .map(([x, y]) => ({ x, y }));

    return sorted;
  } catch {
    return null;
  }
}

/**
 * Get custom events data (placeholder — not applicable for Supabase-native).
 */
export async function getAnalyticsEvents(_range: string = "7d") {
  return [];
}
