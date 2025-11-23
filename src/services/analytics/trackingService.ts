// Web Tracking Service with Supabase
// Mengumpulkan dan mengirim data analytics ke Supabase

import { supabase } from "../../lib/supabase";

// Generate atau ambil visitor ID dari localStorage
const getVisitorId = (): string => {
  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
};

// Generate session ID (expires after 30 minutes of inactivity)
// Kept for potential future use
// const getSessionId = (): string => {
//   const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
//   const now = Date.now();
//
//   let sessionId = sessionStorage.getItem("sessionId");
//   let lastActivity = sessionStorage.getItem("lastActivity");
//
//   if (
//     !sessionId ||
//     !lastActivity ||
//     now - parseInt(lastActivity) > SESSION_TIMEOUT
//   ) {
//     sessionId = `session_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 9)}`;
//     sessionStorage.setItem("sessionId", sessionId);
//   }
//
//   sessionStorage.setItem("lastActivity", now.toString());
//   return sessionId;
// };

// Get device information with improved detection
const getDeviceInfo = () => {
  const ua = navigator.userAgent.toLowerCase();
  let deviceType = "desktop";

  // Improved device detection
  const isMobile =
    /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTablet = /ipad|android(?!.*mobile)|tablet|kindle|silk|playbook/i.test(
    ua
  );

  if (isTablet) {
    deviceType = "tablet";
  } else if (isMobile) {
    deviceType = "mobile";
  }

  // Additional check using screen size and touch support
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const screenWidth = window.screen.width;

  // Override detection with screen size if needed
  if (deviceType === "desktop" && hasTouch && screenWidth < 768) {
    deviceType = "mobile";
  } else if (
    deviceType === "desktop" &&
    hasTouch &&
    screenWidth >= 768 &&
    screenWidth < 1024
  ) {
    deviceType = "tablet";
  }

  return {
    deviceType,
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    language: navigator.language,
  };
};

// Hash visitor ID for privacy
const hashVisitorId = (visitorId: string): string => {
  try {
    // Simple hash using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(visitorId);
    return Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
  } catch {
    return visitorId.substring(0, 32);
  }
};

// Track page view - simplified without duration
export const trackPageView = async (page: string) => {
  try {
    const visitorId = getVisitorId();
    const deviceInfo = getDeviceInfo();

    // Insert into Supabase
    const { error } = await supabase
      .from("web_analytics_log")
      .insert({
        visitor_hash: hashVisitorId(visitorId),
        page_path: page,
        device_type: deviceInfo.deviceType,
      });

    if (error && process.env.NODE_ENV === "development") {
      console.error("Error tracking page view:", error);
    }
  } catch (error) {
    // Silent fail - don't spam console in production
    if (process.env.NODE_ENV === "development") {
      console.error("Error tracking page view:", error);
    }
  }
};

// Track custom event
export const trackEvent = async (
  eventName: string,
  _eventData?: Record<string, any>
) => {
  try {
    const visitorId = getVisitorId();
    const deviceInfo = getDeviceInfo();

    // Insert into Supabase with event name as page path
    const { error } = await supabase
      .from("web_analytics_log")
      .insert({
        visitor_hash: hashVisitorId(visitorId),
        page_path: `event:${eventName}`,
        device_type: deviceInfo.deviceType,
      });

    if (error && process.env.NODE_ENV === "development") {
      console.error("Error tracking event:", error);
    }
  } catch (error) {
    // Silent fail - don't spam console in production
    if (process.env.NODE_ENV === "development") {
      console.error("Error tracking event:", error);
    }
  }
};

// Get analytics data from Supabase
export const getAnalytics = async (days: number = 7) => {
  try {
    console.log('Fetching analytics for last', days, 'days...');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("web_analytics_log")
      .select("*")
      .gte("visited_at", startDate.toISOString())
      .order("visited_at", { ascending: false });

    console.log('📦 Raw data from Supabase:', data);
    console.log('Error:', error);

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log('No analytics data found');
      return {
        success: false,
        totalVisitors: 0,
        totalPageViews: 0,
        dailyStats: [],
        deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
      };
    }

    // Process analytics data
    const pageViews = new Map<string, number>();
    const deviceTypes = new Map<string, number>();
    const dailyViewsMap = new Map<string, { visitors: Set<string>, pageViews: number }>();
    const allVisitors = new Set<string>();

    data.forEach((log: any) => {
      // Count page views
      const page = log.page_path;
      pageViews.set(page, (pageViews.get(page) || 0) + 1);

      // Count device types
      const device = log.device_type || "unknown";
      deviceTypes.set(device, (deviceTypes.get(device) || 0) + 1);

      // Count unique visitors
      if (log.visitor_hash) {
        allVisitors.add(log.visitor_hash);
      }

      // Count daily views and visitors
      const date = new Date(log.visited_at).toLocaleDateString("id-ID");
      if (!dailyViewsMap.has(date)) {
        dailyViewsMap.set(date, { visitors: new Set(), pageViews: 0 });
      }
      const dailyData = dailyViewsMap.get(date)!;
      dailyData.pageViews++;
      if (log.visitor_hash) {
        dailyData.visitors.add(log.visitor_hash);
      }
    });

    // Calculate device percentages
    const totalViews = data.length;
    const deviceStats = {
      desktop: Math.round(((deviceTypes.get('desktop') || 0) / totalViews) * 100),
      mobile: Math.round(((deviceTypes.get('mobile') || 0) / totalViews) * 100),
      tablet: Math.round(((deviceTypes.get('tablet') || 0) / totalViews) * 100),
    };

    // Convert daily stats to array
    const dailyStats = Array.from(dailyViewsMap.entries())
      .map(([date, data]) => ({
        date,
        visitors: data.visitors.size,
        pageViews: data.pageViews,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const result = {
      success: true,
      totalVisitors: allVisitors.size,
      totalPageViews: totalViews,
      dailyStats,
      deviceStats,
      pageViews: Array.from(pageViews.entries()).map(([page, count]) => ({
        page,
        count,
      })),
    };

    console.log('Processed analytics result:', result);

    return result;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      success: false,
      totalVisitors: 0,
      totalPageViews: 0,
      dailyStats: [],
      deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
    };
  }
};

// Auto-track page view on load
export const initTracking = () => {
  // Track initial page view
  trackPageView(window.location.pathname);

  // Track navigation changes (for SPA)
  let lastPath = window.location.pathname;

  const checkPathChange = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      trackPageView(currentPath);
    }
  };

  // Check for path changes every 500ms (for SPA routing)
  setInterval(checkPathChange, 500);

  // Also track on popstate (back/forward browser buttons)
  window.addEventListener("popstate", () => {
    trackPageView(window.location.pathname);
  });
};
