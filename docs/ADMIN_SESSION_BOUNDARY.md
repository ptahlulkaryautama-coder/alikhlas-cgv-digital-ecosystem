# Phase 0 Admin Session Boundary

This boundary authenticates only the server test endpoint. It does not authorize Google Sheet mutations, does not replace the current frontend PIN UI, and exposes no write route.

## Endpoints

- `POST /api/admin/login`: same-origin credential verification against server-only `ADMIN_PASSWORD_HASH`; returns a short-lived signed session in an HttpOnly cookie.
- `POST /api/admin/logout`: origin-validated cookie expiry.
- `GET /api/admin/session`: returns authenticated user ID, allowlisted role, environment, and expiry.
- `GET /api/admin/integration-health`: protected privacy-safe read and kill-switch status; it exposes no URL, credential, or raw upstream response.

## Server configuration

- `ADMIN_PASSWORD_HASH`: scrypt record `scrypt$N$r$p$saltBase64url$digestBase64url`; never a plaintext password.
- `ADMIN_SESSION_SECRET`: random secret of at least 32 characters, stored only in platform secret management.
- `ADMIN_SESSION_VERSION`: active stateless-session generation; changing it invalidates all existing sessions.
- `ADMIN_ALLOWED_ORIGINS`: optional comma-separated exact origins in addition to the request origin.
- `INTEGRATION_ENV`: optional allowlisted value `local`, `test`, or `production`.

No value is returned to the browser or logged by these functions. These names must never be prefixed for Vite exposure.

## Cookie and request policy

The session lasts 15 minutes and is HMAC-SHA-256 signed. The cookie is `HttpOnly`, `Path=/`, and `SameSite=Strict`; `Secure` is added in production. Strict is appropriate because this internal prototype has no cross-site login callback and benefits from denying cross-site cookie submission. If a future external identity provider requires a top-level callback, changing to `Lax` requires a documented CSRF design and tests.

Login/logout require an exact allowed `Origin`. Session status is read-only and validates the signature, subject, issued-at time, expiry, and maximum TTL. The existing frontend PIN/sessionStorage mechanism is not consulted by any server function.

Before production authentication, add account-specific identities, credential rotation/recovery, login rate limiting, failed-login monitoring, persistent per-session revocation, CSRF review, and an external security review. See `docs/ADMIN_SESSION_SECURITY_MODEL.md` for the implemented global version-revocation mechanism and its stateless limitations.
