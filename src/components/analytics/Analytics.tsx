import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  trackPageView,
  trackEvent,
  initTracking,
} from '../../services/analytics/trackingService';

// Helper functions for tracking specific events
export const trackClick = (elementName: string) => {
  trackEvent("click", { element: elementName });
};

export const trackNavigation = (to: string) => {
  trackEvent("navigation", { to });
};

export const trackLanguageChange = (from: string, to: string) => {
  trackEvent("language_change", { from, to });
};

export const trackSectionView = (sectionName: string) => {
  trackEvent("section_view", { section: sectionName });
};

export const trackCarousel = (
  action: "next" | "prev" | "indicator",
  slideIndex: number
) => {
  trackEvent("carousel_interaction", { action, slideIndex });
};

export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent("button_click", { button: buttonName, location });
};

export const trackFormSubmit = (formName: string, success: boolean) => {
  trackEvent("form_submit", { form: formName, success });
};

export const trackDownload = (fileName: string) => {
  trackEvent("download", { file: fileName });
};

export const trackExternalLink = (url: string) => {
  trackEvent("external_link_click", { url });
};

// Main Analytics Component
const Analytics: React.FC = () => {
  const location = useLocation();

  // Initialize tracking on component mount
  useEffect(() => {
    initTracking();
    console.log("📊 Analytics tracking initialized");
  }, []);

  // Track page view on route change
  useEffect(() => {
    trackPageView(location.pathname);
    console.log("📊 Page view tracked:", location.pathname);
  }, [location]);

  return null;
};

export default Analytics;
