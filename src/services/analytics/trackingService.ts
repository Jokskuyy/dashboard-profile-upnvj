// Web Tracking Service
// Mengumpulkan dan mengirim data analytics ke backend

const BACKEND_API_URL = "http://localhost:3001";

// Check if backend is available (for GitHub Pages deployment)
const isBackendAvailable = async (): Promise<boolean> => {
  // In production (GitHub Pages), backend won't be available
  if (window.location.hostname.includes('github.io')) {
    return false;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout
    
    await fetch(`${BACKEND_API_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
};

// Store analytics locally when backend is not available
const storeLocalAnalytics = (type: string, data: any) => {
  try {
    const storageKey = 'offline_analytics';
    const stored = localStorage.getItem(storageKey);
    const analytics = stored ? JSON.parse(stored) : [];
    
    analytics.push({
      type,
      data,
      timestamp: Date.now()
    });
    
    // Keep only last 100 events
    if (analytics.length > 100) {
      analytics.shift();
    }
    
    localStorage.setItem(storageKey, JSON.stringify(analytics));
  } catch (error) {
    // Silent fail if localStorage is full
  }
};

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
const getSessionId = (): string => {
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const now = Date.now();

  let sessionId = sessionStorage.getItem("sessionId");
  let lastActivity = sessionStorage.getItem("lastActivity");

  if (
    !sessionId ||
    !lastActivity ||
    now - parseInt(lastActivity) > SESSION_TIMEOUT
  ) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    sessionStorage.setItem("sessionId", sessionId);
  }

  sessionStorage.setItem("lastActivity", now.toString());
  return sessionId;
};

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

// Track page view - simplified without duration
export const trackPageView = async (page: string) => {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const deviceInfo = getDeviceInfo();

    const trackingData = {
      visitorId,
      sessionId,
      page,
      referrer: document.referrer,
      timestamp: Date.now(),
      ...deviceInfo,
    };

    // Check if backend is available
    const backendAvailable = await isBackendAvailable();
    
    if (backendAvailable) {
      await fetch(`${BACKEND_API_URL}/api/track/pageview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackingData),
      });
    } else {
      // Store locally when backend is not available
      storeLocalAnalytics('pageview', trackingData);
    }
  } catch (error) {
    // Silent fail - don't spam console in production
    if (process.env.NODE_ENV === 'development') {
      console.error("Error tracking page view:", error);
    }
  }
};

// Track custom event
export const trackEvent = async (
  eventName: string,
  eventData?: Record<string, any>
) => {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    const trackingData = {
      visitorId,
      sessionId,
      eventName,
      eventData,
      timestamp: Date.now(),
    };

    // Check if backend is available
    const backendAvailable = await isBackendAvailable();
    
    if (backendAvailable) {
      await fetch(`${BACKEND_API_URL}/api/track/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackingData),
      });
    } else {
      // Store locally when backend is not available
      storeLocalAnalytics('event', trackingData);
    }
  } catch (error) {
    // Silent fail - don't spam console in production
    if (process.env.NODE_ENV === 'development') {
      console.error("Error tracking event:", error);
    }
  }
};

// Get analytics data
export const getAnalytics = async (days: number = 7) => {
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/api/analytics?days=${days}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch analytics");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
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
