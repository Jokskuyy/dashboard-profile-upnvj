/// <reference types="vite/client" />

// Umami Analytics global type declarations
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

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_UMAMI_URL: string;
  readonly VITE_UMAMI_WEBSITE_ID: string;
  readonly VITE_API_URL?: string;
  readonly VITE_DATA_BACKEND?: "supabase" | "enginex";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
