import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, initTracking } from "../../services/analytics/trackingService";

// Re-export tracking helpers for backwards compatibility
export {
  trackClick,
  trackNavigation,
  trackLanguageChange,
  trackSectionView,
  trackCarousel,
  trackButtonClick,
  trackFormSubmit,
  trackDownload,
  trackExternalLink,
} from "./trackingHelpers";

/**
 * Analytics Component — Supabase-native page tracking.
 * Inserts a record into web_analytics_log on every route change.
 */
const Analytics: React.FC = () => {
  const location = useLocation();
  const initialized = useRef(false);

  // Track initial page load
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initTracking();
  }, []);

  // Track route changes
  useEffect(() => {
    if (initialized.current) {
      trackPageView(location.pathname);
    }
  }, [location.pathname]);

  return null;
};

export default Analytics;
