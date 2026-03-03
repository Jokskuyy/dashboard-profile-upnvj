import { useEffect, useRef } from "react";
import logger from "../../utils/logger";

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
 * Injects the Umami Analytics script tag into the document head.
 * Uses VITE_UMAMI_URL and VITE_UMAMI_WEBSITE_ID from environment variables.
 * Umami auto-tracks pageviews (including SPA route changes via History API).
 */
const injectUmamiScript = (): (() => void) => {
  const umamiUrl = import.meta.env.VITE_UMAMI_URL;
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;

  if (!umamiUrl || !websiteId) {
    logger.log(
      "Umami Analytics: Missing VITE_UMAMI_URL or VITE_UMAMI_WEBSITE_ID — tracking disabled",
    );
    return () => {};
  }

  // Prevent duplicate injection
  const existingScript = document.querySelector("script[data-website-id]");
  if (existingScript) {
    return () => {};
  }

  const script = document.createElement("script");
  script.defer = true;
  script.src = `${umamiUrl}/script.js`;
  script.setAttribute("data-website-id", websiteId);
  // Only track on these domains (prevents tracking in unintended environments)
  if (import.meta.env.PROD) {
    script.setAttribute("data-domains", "upnvj.ac.id");
  }
  document.head.appendChild(script);

  logger.log("Umami Analytics: Script injected from", umamiUrl);

  return () => {
    script.remove();
  };
};

// Main Analytics Component
// Umami handles all pageview tracking automatically (SPA-aware via History API).
// This component only needs to inject the script on mount.
const Analytics: React.FC = () => {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current) return;
    injected.current = true;

    const cleanup = injectUmamiScript();
    logger.log("Umami Analytics: Tracking initialized");

    return cleanup;
  }, []);

  return null;
};

export default Analytics;
