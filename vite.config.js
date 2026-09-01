import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Expose only explicit, non-backend client configuration. This prevents
  // obsolete or accidental VITE_* values in a developer .env from entering JS.
  envPrefix: [
    'VITE_DATA_SOURCE',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
  ],
  server: {
    // Serve index.html for all routes so React Router handles navigation on refresh
    historyApiFallback: true,
  },
});
