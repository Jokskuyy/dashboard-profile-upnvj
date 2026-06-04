// @vitest-environment jsdom
import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  obfuscateString,
  deobfuscateString,
  obfuscateData,
  deobfuscateData,
  sanitizeData,
  generateDataHash,
  verifyDataIntegrity,
  anonymizePersonalData,
  rateLimiter,
  getSecureData,
  isSecureContext,
} from "./dataProtection";

describe("XOR Obfuscation Utilities", () => {
  test("obfuscates and deobfuscates strings symmetrically", () => {
    const rawText = "Secret UPNVJ Campus Data 2025!";
    const obfuscated = obfuscateString(rawText);
    
    expect(obfuscated).not.toBe(rawText);
    expect(typeof obfuscated).toBe("string");
    
    const deobfuscated = deobfuscateString(obfuscated);
    expect(deobfuscated).toBe(rawText);
  });

  test("handles empty string", () => {
    const obfuscated = obfuscateString("");
    expect(deobfuscateString(obfuscated)).toBe("");
  });

  test("returns empty string on invalid deobfuscation target", () => {
    expect(deobfuscateString("invalid-base64-!!!")).toBe("");
  });

  test("obfuscates and deobfuscates complex JSON objects symmetrically", () => {
    const originalObj = {
      id: 101,
      name: "Gedung Rektorat",
      nested: {
        active: true,
        coords: [12.34, 56.78],
      },
    };
    
    const obfuscated = obfuscateData(originalObj);
    expect(obfuscated).not.toBe(JSON.stringify(originalObj));
    
    const deobfuscated = deobfuscateData<typeof originalObj>(obfuscated);
    expect(deobfuscated).toEqual(originalObj);
  });

  test("returns null on invalid deobfuscated JSON object", () => {
    expect(deobfuscateData("invalid-base64-!!!")).toBeNull();
  });
});

describe("sanitizeData Utility", () => {
  test("masks specified sensitive fields while leaving others untouched", () => {
    const sensitiveRecord = {
      username: "john_doe",
      email: "john.doe@upnvj.ac.id",
      token: "secret-token-12345",
      id: 5,
    };
    
    const sanitized = sanitizeData(sensitiveRecord, ["email", "token"]);
    
    expect(sanitized.id).toBe(5);
    expect(sanitized.username).toBe("john_doe");
    expect(sanitized.email).toBe("j*******@upnvj.ac.id");
    expect(sanitized.token).toBe("se**************45");
  });
});

describe("Data Integrity (Hashing)", () => {
  test("generates consistent hash for same data structures", () => {
    const obj1 = { a: 1, b: [2, 3] };
    const obj2 = { a: 1, b: [2, 3] };
    
    const hash1 = generateDataHash(obj1);
    const hash2 = generateDataHash(obj2);
    
    expect(hash1).toBe(hash2);
    expect(verifyDataIntegrity(obj1, hash2)).toBe(true);
  });

  test("detects tampering when data structures change", () => {
    const original = { amount: 1000, recipient: "Alice" };
    const tampered = { amount: 100000, recipient: "Alice" };
    
    const originalHash = generateDataHash(original);
    expect(verifyDataIntegrity(tampered, originalHash)).toBe(false);
  });
});

describe("anonymizePersonalData", () => {
  test("replaces name, email, phone, and address as configured", () => {
    const personal = {
      name: "Iman Nur",
      email: "iman@domain.com",
      phone: "+62 812-3456-7890",
      address: "Jl. Margonda Raya No. 100",
      other: "constant-field",
    };

    const anonymized = anonymizePersonalData(personal, {
      replaceNames: true,
      maskEmails: true,
      hidePhone: true,
      hideAddress: true,
    });

    expect(anonymized.other).toBe("constant-field");
    expect(anonymized.name).toContain("User ");
    expect(anonymized.name).not.toBe("Iman Nur");
    expect(anonymized.email).not.toBe("iman@domain.com");
    expect(anonymized.email).toContain("@domain.com");
    expect(anonymized.phone).toBe("+62 XXX-XXXX-XXXX");
    expect(anonymized.address).toBe("[Address Hidden]");
  });
});

describe("RateLimiter", () => {
  beforeEach(() => {
    rateLimiter.reset("test-key");
  });

  test("allows requests within bounds and blocks when limit is exceeded", () => {
    // 5 attempts allowed by default
    for (let i = 0; i < 5; i++) {
      expect(rateLimiter.checkLimit("test-key")).toBe(true);
    }
    // 6th attempt should fail
    expect(rateLimiter.checkLimit("test-key")).toBe(false);
  });

  test("respects time window", () => {
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);

    // Fill the rate limit
    for (let i = 0; i < 5; i++) {
      rateLimiter.checkLimit("test-key", 5, 60000);
    }
    expect(rateLimiter.checkLimit("test-key", 5, 60000)).toBe(false);

    // Fast forward 61 seconds
    vi.setSystemTime(now + 61000);
    
    // Now it should allow again
    expect(rateLimiter.checkLimit("test-key", 5, 60000)).toBe(true);

    vi.useRealTimers();
  });
});

describe("Environment Filtering", () => {
  test("returns full data in development and public data in production", () => {
    const full = "dev-only-data";
    const pub = "public-only-data";
    
    expect(getSecureData(full, pub, true)).toBe("dev-only-data");
    expect(getSecureData(full, pub, false)).toBe("public-only-data");
  });
});

describe("Security Context", () => {
  test("detects secure context if window flags match", () => {
    // Save original properties
    const originalSecure = window.isSecureContext;
    
    try {
      // Mock properties on window
      Object.defineProperty(window, "isSecureContext", {
        value: true,
        writable: true,
        configurable: true,
      });
      
      expect(isSecureContext()).toBe(true);
    } finally {
      // Restore
      Object.defineProperty(window, "isSecureContext", {
        value: originalSecure,
        writable: true,
        configurable: true,
      });
    }
  });
});
