# Admin Session Security Model

## Implemented now

The Netlify boundary provides four JSON-only endpoints:

- `POST /api/admin/login`
- `GET /api/admin/session`
- `POST /api/admin/logout`
- `GET /api/admin/integration-health`

Login verifies a password server-side against `ADMIN_PASSWORD_HASH`, encoded as `scrypt$N$r$p$saltBase64url$digestBase64url`. Production plaintext passwords are never stored or compared. `ADMIN_SESSION_SECRET` signs a 15-minute HMAC-SHA-256 session token using Node crypto.

The signed payload contains `uid`, `role`, `iat`, `exp`, and `ver`. The only accepted role is `super_admin_trial`. The frontend PIN/sessionStorage flag is a **Prototype navigation gate** and is never read by a Netlify function.

The cookie is `HttpOnly`, `Path=/`, `SameSite=Strict`, and has explicit `Max-Age` and `Expires`; production adds `Secure`. Strict is appropriate because no external identity callback exists and cross-site cookie submission is unnecessary. Login and logout require an exact allowed Origin. Read-only session/health requests reject an invalid Origin or cross-site fetch context.

Responses use `application/json`, `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy: no-referrer`. Login has a 4096-byte body limit. No stack trace or secret value is returned.

## Session-version revocation

`ADMIN_SESSION_VERSION` controls the active stateless session generation; absent/blank means `1`. The value is embedded in every token and compared on every protected request. To revoke all sessions in an emergency:

1. Change `ADMIN_SESSION_VERSION` to a new unpredictable operational value in server configuration.
2. Redeploy/restart functions so every instance receives it.
3. Confirm old cookies receive `401` and a new login receives the new version.
4. Rotate `ADMIN_SESSION_SECRET` as well if signing-key compromise is suspected.

Logout expires the current browser cookie. There is no persistent session store, so logout cannot centrally revoke a copied token before expiry. Version rotation revokes all sessions, not one user/session.

## Environment variables

- `ADMIN_PASSWORD_HASH`: server-only scrypt record.
- `ADMIN_SESSION_SECRET`: server-only, at least 32 characters.
- `ADMIN_SESSION_VERSION`: server-only active session generation.
- `ADMIN_USER_ID`: server-derived trial actor ID; defaults to `trial_admin`.
- `ADMIN_ALLOWED_ORIGINS`: optional comma-separated exact additional origins.
- `INTEGRATION_ENV`: `local`, `test`, or `production`.
- `PROGRAM_TRIAL_WRITES_ENABLED`: server-only future kill switch; absent is false.
- `ADMIN_LOGIN_RATE_LIMIT_MAX_FAILURES`: optional per-client failed-login threshold; defaults to `5`.
- `ADMIN_LOGIN_RATE_LIMIT_WINDOW_SECONDS`: optional failed-login window; defaults to `900` seconds.

The login function applies a bounded, best-effort in-memory limiter and returns `429` with `Retry-After` after repeated failures. This limits abuse within a warm function instance, but serverless instances do not share memory. Production rollout still requires a shared durable rate-limit store and centralized failed-login monitoring.

None may use a `VITE_` prefix.

## Limitations and production requirements

This is a bounded trial foundation, not production identity management. Before production: adopt individual identities or an approved identity provider, credential recovery and rotation, per-account/session revocation, MFA, login rate limiting, abuse monitoring, persistent audit events, security review, CSRF review if cookie policy changes, and a tested incident-response procedure.

No Sheet write capability exists in this phase.
