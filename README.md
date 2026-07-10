# Masjid Al Ikhlas CGV Digital Ecosystem

React + Vite foundation for migrating the existing static ecosystem into a
maintainable application.

## Phase 1 Scope

- React + Vite project scaffold.
- Placeholder routes only:
  - `/` public website
  - `/transparansi` transparency portal
  - `/app` DKM dashboard
  - `/tpq` TPQ module
- Legacy files remain untouched in `Legacy/`.
- No Google Apps Script integration.
- No authentication.
- No page migration yet.

## Commands

```bash
npm install
npm run dev
npm run build
```

## Deployment

The project is configured for seamless deployment to Netlify via `netlify.toml`. 

1. Link your repository to Netlify.
2. Netlify will automatically detect the settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. SPA redirects (`/* -> /index.html`) are natively handled by the config.
4. Add your `.env` variables (`VITE_GAS_URL` and `VITE_ADMIN_PIN`) in the Netlify Environment Variables settings.

## Legacy Source

The legacy source files remain available under `Legacy/` and should continue to
be treated as the source of truth for later migration phases.
