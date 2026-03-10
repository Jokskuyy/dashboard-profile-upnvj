// Global type declarations for Umami Analytics
// This file augments the Window interface with the Umami tracker

export {};

interface UmamiTracker {
  track(event: string, data?: Record<string, string | number | boolean>): void;
  track(
    callback: (props: Record<string, unknown>) => {
      url?: string;
      title?: string;
      name?: string;
      data?: Record<string, string | number | boolean>;
    },
  ): void;
  identify(sessionData?: Record<string, string | number | boolean>): void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}
