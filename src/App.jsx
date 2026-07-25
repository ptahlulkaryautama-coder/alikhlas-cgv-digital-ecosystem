import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';

// ── Lazy-loaded Page Components ──────────────────────────────────────────────
const PublicLive = lazy(() => import('./pages/PublicLive.jsx'));
const PublicProgram = lazy(() => import('./pages/PublicProgram.jsx'));
const PublicAgenda = lazy(() => import('./pages/PublicAgenda.jsx'));
const PublicNews = lazy(() => import('./pages/PublicNews.jsx'));
const PublicNewsDetail = lazy(() => import('./pages/PublicNewsDetail.jsx'));
const PublicDonation = lazy(() => import('./pages/PublicDonation.jsx'));
const PublicContact = lazy(() => import('./pages/PublicContact.jsx'));
const Transparency = lazy(() => import('./pages/Transparency.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Finance = lazy(() => import('./pages/Finance.jsx'));
const NewsAdmin = lazy(() => import('./pages/NewsAdmin.jsx'));
const ProgramAdmin = lazy(() => import('./pages/ProgramAdmin.jsx'));
const AgendaAdmin = lazy(() => import('./pages/AgendaAdmin.jsx'));
const ReportsAdmin = lazy(() => import('./pages/ReportsAdmin.jsx'));
const DonationAdmin = lazy(() => import('./pages/DonationAdmin.jsx'));
const InventoryAdmin = lazy(() => import('./pages/InventoryAdmin.jsx'));
const DocumentsAdmin = lazy(() => import('./pages/DocumentsAdmin.jsx'));
const SettingsAdmin = lazy(() => import('./pages/SettingsAdmin.jsx'));
const TPQ = lazy(() => import('./pages/TPQ.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

import PageLoader from './components/common/PageLoader.jsx';

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public routes ── */}
      <Route path="/" element={<Home />} />
      <Route path="/live" element={<PublicLive />} />
      <Route path="/program" element={<PublicProgram />} />
      <Route path="/agenda" element={<PublicAgenda />} />
      <Route path="/kabar" element={<PublicNews />} />
      <Route path="/kabar/:slug" element={<PublicNewsDetail />} />
      <Route path="/donasi" element={<PublicDonation />} />
      <Route path="/kontak" element={<PublicContact />} />
      <Route path="/transparansi" element={<Transparency />} />
      <Route path="/login" element={<Login />} />

      {/* ── Protected routes (PIN gate) ── */}
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
        path="/app/kabar"
        element={
          <ProtectedRoute>
            <NewsAdmin />
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
        path="/app/laporan"
        element={
          <ProtectedRoute>
            <ReportsAdmin />
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
        path="/app/inventaris"
        element={
          <ProtectedRoute>
            <InventoryAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/dokumen"
        element={
          <ProtectedRoute>
            <DocumentsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/pengaturan"
        element={
          <ProtectedRoute>
            <SettingsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/tpq"
        element={
          <ProtectedRoute>
            <TPQ />
          </ProtectedRoute>
        }
      />

      {/* ── Canonical route redirect for legacy /tpq alias ── */}
      <Route path="/tpq" element={<Navigate to="/app/tpq" replace />} />

      {/* ── 404 catch-all ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
  );
}
