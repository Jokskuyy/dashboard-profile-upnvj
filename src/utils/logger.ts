/**
 * Development-only logger utility
 * 
 * Wraps console methods to only output in development mode.
 * In production builds, all log/warn/debug calls are no-ops.
 * console.error is always preserved for critical error tracking.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args);
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  /** Log only in dev, with a specific label prefix */
  labeled: (label: string, ...args: unknown[]) => {
    if (isDev) console.log(`[${label}]`, ...args);
  },
};

export default logger;
