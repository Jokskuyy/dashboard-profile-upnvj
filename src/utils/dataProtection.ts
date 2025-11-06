/**
 * Data Protection Utilities
 * 
 * Provides basic obfuscation for sensitive data in public repositories.
 * Note: This is NOT cryptographic security, just obfuscation to prevent casual browsing.
 * For real security, use proper backend with authentication.
 */

// Simple XOR cipher for obfuscation (NOT for real security!)
const XOR_KEY = "UPNVJ2025Dashboard"; // Change this to your own key

/**
 * Obfuscate string data
 */
export function obfuscateString(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length)
    );
  }
  return btoa(result); // Base64 encode
}

/**
 * Deobfuscate string data
 */
export function deobfuscateString(obfuscated: string): string {
  try {
    const decoded = atob(obfuscated); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length)
      );
    }
    return result;
  } catch (error) {
    console.error('Failed to deobfuscate data');
    return '';
  }
}

/**
 * Obfuscate JSON object
 */
export function obfuscateData<T>(data: T): string {
  const jsonString = JSON.stringify(data);
  return obfuscateString(jsonString);
}

/**
 * Deobfuscate JSON object
 */
export function deobfuscateData<T>(obfuscated: string): T | null {
  try {
    const jsonString = deobfuscateString(obfuscated);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse deobfuscated data');
    return null;
  }
}

/**
 * Sanitize sensitive data before display
 * Removes or masks sensitive information
 */
export function sanitizeData<T extends Record<string, any>>(
  data: T,
  sensitiveFields: string[]
): T {
  const sanitized: Record<string, any> = { ...data };
  
  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      // Mask sensitive data
      const value = sanitized[field];
      if (typeof value === 'string') {
        // Mask email: j***@example.com
        if (value.includes('@')) {
          const [name, domain] = value.split('@');
          sanitized[field] = `${name[0]}${'*'.repeat(name.length - 1)}@${domain}`;
        } else {
          // Mask other strings
          sanitized[field] = `${value.substring(0, 2)}${'*'.repeat(Math.max(value.length - 4, 0))}${value.substring(value.length - 2)}`;
        }
      }
    }
  });
  
  return sanitized as T;
}

/**
 * Generate hash for data integrity check
 */
export function generateDataHash(data: any): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Verify data hasn't been tampered with
 */
export function verifyDataIntegrity(data: any, expectedHash: string): boolean {
  return generateDataHash(data) === expectedHash;
}

/**
 * Create anonymized/mock data for public display
 */
export function anonymizePersonalData<T extends Record<string, any>>(
  data: T,
  config: {
    replaceNames?: boolean;
    maskEmails?: boolean;
    hidePhone?: boolean;
    hideAddress?: boolean;
  } = {}
): T {
  const anonymized: Record<string, any> = { ...data };
  
  if (config.replaceNames && 'name' in anonymized) {
    // Replace with generic name
    anonymized.name = `User ${Math.random().toString(36).substring(7).toUpperCase()}`;
  }
  
  if (config.maskEmails && 'email' in anonymized) {
    const email = anonymized.email as string;
    if (email && email.includes('@')) {
      const [, domain] = email.split('@');
      anonymized.email = `user${Math.floor(Math.random() * 9999)}@${domain}`;
    }
  }
  
  if (config.hidePhone && 'phone' in anonymized) {
    anonymized.phone = '+62 XXX-XXXX-XXXX';
  }
  
  if (config.hideAddress && 'address' in anonymized) {
    anonymized.address = '[Address Hidden]';
  }
  
  return anonymized as T;
}

/**
 * Rate limiting helper for sensitive operations
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  checkLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Filter out old attempts
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
  
  reset(key: string) {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Environment-based data filtering
 * Only show full data in development
 */
export function getSecureData<T>(
  fullData: T,
  publicData: T,
  isDevelopment: boolean = import.meta.env.DEV
): T {
  return isDevelopment ? fullData : publicData;
}

/**
 * Check if running in secure context
 */
export function isSecureContext(): boolean {
  return window.isSecureContext && (
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost'
  );
}

/**
 * Simple permission check based on localStorage token
 * For production, use proper backend authentication
 */
export function hasViewPermission(requiredLevel: 'public' | 'restricted' | 'admin'): boolean {
  if (requiredLevel === 'public') return true;
  
  // Check if user has auth token (from localStorage)
  const authToken = localStorage.getItem('auth_token');
  if (!authToken) return false;
  
  // Simple check - in production, verify with backend
  try {
    const payload = JSON.parse(atob(authToken.split('.')[1]));
    const userLevel = payload.role || 'public';
    
    const levels = ['public', 'restricted', 'admin'];
    return levels.indexOf(userLevel) >= levels.indexOf(requiredLevel);
  } catch {
    return false;
  }
}
