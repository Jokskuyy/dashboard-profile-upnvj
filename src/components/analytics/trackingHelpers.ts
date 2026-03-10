/**
 * Tracking helper functions for specific UI events.
 *
 * Uses Umami Analytics (self-hosted) for event tracking.
 * These are convenience wrappers around window.umami.track() for common interactions.
 * Import these directly — they do NOT depend on the Analytics component.
 *
 * @see https://umami.is/docs/tracker-functions
 */

/**
 * Generic event tracker via Umami.
 * Falls back silently if Umami is not loaded (e.g. ad-blockers).
 */
const trackUmamiEvent = (
  eventName: string,
  data?: Record<string, string | number | boolean>,
) => {
  try {
    if (window.umami) {
      window.umami.track(eventName, data);
    }
  } catch {
    // Silent fail — analytics should never break the app
  }
};

export const trackClick = (elementName: string) => {
  trackUmamiEvent("click", { element: elementName });
};

export const trackNavigation = (to: string) => {
  trackUmamiEvent("navigation", { to });
};

export const trackLanguageChange = (from: string, to: string) => {
  trackUmamiEvent("language-change", { from, to });
};

export const trackSectionView = (sectionName: string) => {
  trackUmamiEvent("section-view", { section: sectionName });
};

export const trackCarousel = (
  action: "next" | "prev" | "indicator",
  slideIndex: number,
) => {
  trackUmamiEvent("carousel-interaction", { action, slide_index: slideIndex });
};

export const trackButtonClick = (buttonName: string, location: string) => {
  trackUmamiEvent("button-click", { button: buttonName, location });
};

export const trackFormSubmit = (formName: string, success: boolean) => {
  trackUmamiEvent("form-submit", { form: formName, success });
};

export const trackDownload = (fileName: string) => {
  trackUmamiEvent("download", { file: fileName });
};

export const trackExternalLink = (url: string) => {
  trackUmamiEvent("external-link-click", { url });
};
