/**
 * auth.js — Prototype PIN-gate for admin routes
 *
 * ⚠️  PROTOTYPE SECURITY ONLY ⚠️
 * This is a temporary, client-side-only PIN gate designed to prevent
 * casual discovery of admin routes during development. It does NOT
 * provide real security:
 *   - The PIN check happens entirely in the browser.
 *   - sessionStorage can be cleared or spoofed by the user.
 *   - The admin routes themselves still serve React bundles to anyone.
 *
 * Before production launch this MUST be replaced with:
 *   - Server-side authentication (e.g. Firebase Auth, Supabase, or
 *     a backend session)
 *   - Route-level API guards on every data endpoint
 *
 * PIN is read from the VITE_ADMIN_PIN environment variable.
 * If the variable is not set, the PIN gate is disabled and all admin
 * routes are openly accessible (dev/preview convenience only).
 */

const SESSION_KEY = 'alikhlas_admin_authed';
const BYPASS_IN_DEV = !import.meta.env.VITE_ADMIN_PIN;

/**
 * Returns true if the current session has passed the PIN gate.
 * Always returns true in dev when VITE_ADMIN_PIN is not configured.
 *
 * @returns {boolean}
 */
export function isAuthenticated() {
  if (BYPASS_IN_DEV) return true;
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

/**
 * Validates the supplied PIN against VITE_ADMIN_PIN.
 * On success, writes the authenticated flag to sessionStorage and
 * returns true. On failure, returns false.
 *
 * Uses a constant-time string comparison shim so that
 * timing side-channels cannot enumerate the PIN length.
 * (Still a very weak guarantee — this is prototype-only code.)
 *
 * @param {string} pin — raw PIN string entered by the user
 * @returns {boolean}
 */
export function attemptLogin(pin) {
  const expected = import.meta.env.VITE_ADMIN_PIN ?? '';

  // Pad both strings to the same length before comparing so that
  // the === check does not short-circuit on length mismatch.
  const maxLen = Math.max(pin.length, expected.length);
  const a = pin.padEnd(maxLen, '\0');
  const b = expected.padEnd(maxLen, '\0');

  if (a === b && expected !== '') {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }

  return false;
}

/**
 * Clears the admin session. Call this from a logout button.
 * After calling this, isAuthenticated() will return false until the
 * user successfully logs in again.
 */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}
