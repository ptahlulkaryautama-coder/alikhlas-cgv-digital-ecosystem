# Masjid Al Ikhlas CGV Digital Ecosystem

React + Vite foundation for migrating the existing static ecosystem into a
maintainable application.

## Current Scope

- React + Vite project scaffold.
- React public portal and protected read-only DKM prototype.
- Program and Agenda use approved repository fallback in normal Vite development.
- Netlify development and production use the same-origin read proxy when configured.
- Legacy files remain untouched in `Legacy/`.
- No admin Sheet mutations are exposed.
- Finance remains frozen pending source verification; TPQ remains privacy-safe and read-only.

## Commands

```bash
npm install
npm run dev
npm run dev:proxy
npm run build
npm test
```

## Deployment

The project is configured for seamless deployment to Netlify via `netlify.toml`. 

1. Link your repository to Netlify.
2. Netlify will automatically detect the settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. SPA redirects (`/* -> /index.html`) are natively handled by the config.
4. Configure server-only `GAS_URL` for approved reads. Admin session prerequisites are
   `ADMIN_PASSWORD_HASH` (scrypt format) and a strong `ADMIN_SESSION_SECRET`.
   Never expose these through Vite variables or print their values in the UI.

## Legacy Source

The legacy source files remain available under `Legacy/` and should continue to
be treated as the source of truth for later migration phases.
