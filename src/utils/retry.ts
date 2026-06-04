/**
 * Retry utility for API calls with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Omit<Required<RetryOptions>, 'shouldRetry'> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  onRetry: () => {},
};

/**
 * Sleep utility
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate delay with exponential backoff and jitter
 */
const calculateDelay = (
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  multiplier: number
): number => {
  const exponentialDelay = initialDelay * Math.pow(multiplier, attempt - 1);
  const delayWithJitter = exponentialDelay * (0.5 + Math.random() * 0.5);
  return Math.min(delayWithJitter, maxDelay);
};

/**
 * Retry a function with exponential backoff
 * 
 * @param fn - The async function to retry
 * @param options - Retry options
 * @returns The result of the function if successful
 * @throws The last error if all retries fail
 * 
 * @example
 * const data = await retryWithBackoff(
 *   async () => await fetchData(),
 *   { maxRetries: 3, onRetry: (attempt) => console.log(`Retry ${attempt}`) }
 * );
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;

  for (let attempt = 1; attempt <= opts.maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on the last attempt
      if (attempt > opts.maxRetries) {
        break;
      }

      // Stop retrying if shouldRetry is provided and returns false
      if (opts.shouldRetry && !opts.shouldRetry(lastError)) {
        break;
      }

      // Call onRetry callback
      opts.onRetry(attempt, lastError);

      // Calculate and wait for delay
      const delay = calculateDelay(
        attempt,
        opts.initialDelay,
        opts.maxDelay,
        opts.backoffMultiplier
      );
      
      if (import.meta.env.DEV) {
        console.log(
          `Retry attempt ${attempt}/${opts.maxRetries} after ${Math.round(delay)}ms`,
          lastError.message
        );
      }

      await sleep(delay);
    }
  }

  throw lastError!;
}

/**
 * Determine if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  // Network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return true;
  }

  // Narrow error to access potential message/status properties
  const err = error as { message?: string; status?: number };

  // Timeout errors
  if (err.message?.includes("timeout")) {
    return true;
  }

  // HTTP status codes that are retryable
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  if (err.status && retryableStatuses.includes(err.status)) {
    return true;
  }

  // Supabase specific errors
  if (err.message?.includes("connection")) {
    return true;
  }

  return false;
}

/**
 * Retry function with conditional retry logic
 */
export async function retryIf<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: Error) => boolean,
  options: RetryOptions = {}
): Promise<T> {
  return retryWithBackoff(fn, { ...options, shouldRetry });
}

/**
 * Create a retryable version of a function
 */
export function withRetry<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  options: RetryOptions = {}
): (...args: A) => Promise<R> {
  return (...args: A) =>
    retryWithBackoff(() => fn(...args), options);
}
