import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  trackPageView,
  initTracking,
} from '../../services/analytics/trackingService';
import logger from '../../utils/logger';

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
} from './trackingHelpers';

// Main Analytics Component
const Analytics: React.FC = () => {
  const location = useLocation();

  // Initialize tracking on component mount
  useEffect(() => {
    initTracking();
    logger.log("Analytics tracking initialized");
  }, []);

  // Track page view on route change
  useEffect(() => {
    trackPageView(location.pathname);
    logger.log("Page view tracked:", location.pathname);
  }, [location]);

  return null;
};

export default Analytics;
