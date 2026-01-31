/**
 * Polyfills for browser compatibility
 * 
 * crypto.randomUUID() is not available in non-secure contexts (HTTP instead of HTTPS).
 * This polyfill provides a fallback for environments like HTTP servers.
 */

// Self-executing polyfill - runs immediately when module is imported
if (typeof window !== 'undefined' && typeof crypto !== 'undefined' && !crypto.randomUUID) {
  // @ts-expect-error - Adding polyfill to crypto object
  crypto.randomUUID = function randomUUID(): string {
    // Generate a UUID v4 using Math.random as fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

export function initPolyfills() {
  // Polyfills are now self-executing on import
  // This function exists for explicit initialization if needed
}
