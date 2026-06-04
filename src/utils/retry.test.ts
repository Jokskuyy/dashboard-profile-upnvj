import { describe, test, expect, vi } from "vitest";
import { retryWithBackoff, isRetryableError, retryIf, withRetry } from "./retry";

describe("retryWithBackoff", () => {
  test("resolves immediately if successful on first attempt", async () => {
    const fn = vi.fn().mockResolvedValue("success");
    const result = await retryWithBackoff(fn, { maxRetries: 3, initialDelay: 1 });
    
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("retries specified number of times and succeeds if a later attempt resolves", async () => {
    let attempts = 0;
    const fn = vi.fn().mockImplementation(async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error("Temporary error");
      }
      return "success";
    });

    const onRetry = vi.fn();
    const result = await retryWithBackoff(fn, {
      maxRetries: 3,
      initialDelay: 1,
      onRetry,
    });

    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.any(Error));
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.any(Error));
  });

  test("throws last error if all retries fail", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("Persistent error"));
    const onRetry = vi.fn();

    await expect(
      retryWithBackoff(fn, {
        maxRetries: 2,
        initialDelay: 1,
        onRetry,
      })
    ).rejects.toThrow("Persistent error");

    expect(fn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    expect(onRetry).toHaveBeenCalledTimes(2);
  });
});

describe("isRetryableError", () => {
  test("identifies fetch type errors as retryable", () => {
    const fetchError = new TypeError("Failed to fetch");
    expect(isRetryableError(fetchError)).toBe(true);
  });

  test("identifies connection errors as retryable", () => {
    const connError = new Error("connection database timeout");
    expect(isRetryableError(connError)).toBe(true);
  });

  test("identifies timeout messages as retryable", () => {
    const timeoutErr = new Error("request timeout");
    expect(isRetryableError(timeoutErr)).toBe(true);
  });

  test("identifies retryable HTTP statuses", () => {
    expect(isRetryableError({ status: 500 })).toBe(true);
    expect(isRetryableError({ status: 503 })).toBe(true);
    expect(isRetryableError({ status: 429 })).toBe(true);
    expect(isRetryableError({ status: 404 })).toBe(false);
    expect(isRetryableError({ status: 400 })).toBe(false);
  });

  test("returns false for regular errors", () => {
    expect(isRetryableError(new Error("ValidationError"))).toBe(false);
  });
});

describe("retryIf", () => {
  test("retries when shouldRetry returns true", async () => {
    let attempts = 0;
    const fn = vi.fn().mockImplementation(async () => {
      attempts++;
      if (attempts < 2) {
        throw new Error("RetryableError");
      }
      return "done";
    });

    const shouldRetry = (err: Error) => err.message === "RetryableError";
    const result = await retryIf(fn, shouldRetry, { maxRetries: 2, initialDelay: 1 });

    expect(result).toBe("done");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test("stops retrying immediately when shouldRetry returns false", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("FatalError"));
    const shouldRetry = (err: Error) => err.message === "RetryableError";

    await expect(
      retryIf(fn, shouldRetry, { maxRetries: 2, initialDelay: 1 })
    ).rejects.toThrow("FatalError");

    expect(fn).toHaveBeenCalledTimes(1); // Fails and stops immediately
  });
});

describe("withRetry decorator", () => {
  test("decorates function to run with retry", async () => {
    let attempts = 0;
    const originalFn = vi.fn().mockImplementation(async (arg: string) => {
      attempts++;
      if (attempts < 2) throw new Error("Fail");
      return arg + " ok";
    });

    const decoratedFn = withRetry(originalFn, { maxRetries: 2, initialDelay: 1 });
    const result = await decoratedFn("test");

    expect(result).toBe("test ok");
    expect(originalFn).toHaveBeenCalledTimes(2);
  });
});
