import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Finance from './pages/Finance.jsx';
import ProgramAdmin from './pages/ProgramAdmin.jsx';
import AgendaAdmin from './pages/AgendaAdmin.jsx';
import DonationAdmin from './pages/DonationAdmin.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Home from './pages/Home.jsx';
import TPQ from './pages/TPQ.jsx';
import Transparency from './pages/Transparency.jsx';

export default function App() {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route path="/" element={<Home />} />
      <Route path="/transparansi" element={<Transparency />} />
      <Route path="/login" element={<Login />} />

      {/* ── Protected routes (PIN gate) ── */}
      {/*
       * /app:           Dashboard owns its own DashboardLayout shell — render directly.
       * /app/keuangan:  Finance module (Phase 5) — read-only, own DashboardLayout.
       * /tpq:           Still a placeholder; wrapped in PlaceholderShell until migrated.
       */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/keuangan"
        element={
          <ProtectedRoute>
            <Finance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/program"
        element={
          <ProtectedRoute>
            <ProgramAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/agenda"
        element={
          <ProtectedRoute>
            <AgendaAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/donasi"
        element={
          <ProtectedRoute>
            <DonationAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tpq"
        element={
          <ProtectedRoute>
            <PlaceholderShell page={<TPQ />} />
          </ProtectedRoute>
        }
      />

      {/* ── 404 catch-all ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/**
 * Temporary shell wrapper for pages that don't yet have their own layout.
 * Will be removed as each module gets its own layout.
 */
function PlaceholderShell({ page }) {
  return (
    <div className="app-shell">
      <main className="app-main">{page}</main>
    </div>
  );
}
