/**
 * Tracking helper functions for specific UI events.
 * 
 * These are convenience wrappers around trackEvent() for common interactions.
 * Import these directly — they do NOT depend on the Analytics component.
 */
import { trackEvent } from '../../services/analytics/trackingService';

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
