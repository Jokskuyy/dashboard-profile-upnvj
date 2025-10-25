import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Generate simple visitor ID
const getVisitorId = () => {
  let visitorId = localStorage.getItem('analytics_visitor_id');
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_visitor_id', visitorId);
  }
  return visitorId;
};

const API_URL = 'http://localhost:3001/api/track';

// Track pageview
const trackPageview = async (page: string) => {
  try {
    await fetch(`${API_URL}/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        page,
        referrer: document.referrer
      })
    });
    console.log('📊 Pageview tracked:', page);
  } catch (error) {
    console.warn('Analytics server not available');
  }
};

// Track custom event
export const trackEvent = async (eventName: string, eventData?: Record<string, any>) => {
  try {
    await fetch(`${API_URL}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        eventName,
        eventData
      })
    });
    console.log('📊 Event tracked:', eventName, eventData);
  } catch (error) {
    console.warn('Analytics server not available');
  }
};

// Helper functions
export const trackClick = (elementName: string) => {
  trackEvent('click', { element: elementName });
};

export const trackNavigation = (to: string) => {
  trackEvent('navigation', { to });
};

export const trackLanguageChange = (from: string, to: string) => {
  trackEvent('language_change', { from, to });
};

export const trackSectionView = (sectionName: string) => {
  trackEvent('section_view', { section: sectionName });
};

export const trackCarousel = (action: 'next' | 'prev' | 'indicator', slideIndex: number) => {
  trackEvent('carousel_interaction', { action, slideIndex });
};

// Main Analytics Component
const Analytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageview(location.pathname);
  }, [location]);

  return null;
};

export default Analytics;
