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
const PublicTPQ = lazy(() => import('./pages/PublicTPQ.jsx'));
const PublicTPQRegister = lazy(() => import('./pages/PublicTPQRegister.jsx'));
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
const TPQPengampu = lazy(() => import('./pages/TPQPengampu.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

import { useEffect } from 'react';
import PageLoader from './components/common/PageLoader.jsx';
import PWAInstallPrompt from './components/common/PWAInstallPrompt.jsx';
import { registerServiceWorker } from './pwaRegister.js';
import { ROUTE_PERMISSIONS } from './services/accessPolicy.js';

export default function App() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <>
      <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public routes ── */}
      <Route path="/" element={<Home />} />
      <Route path="/live" element={<Navigate to="/program" replace />} />
      <Route path="/program" element={<PublicProgram />} />
      <Route path="/agenda" element={<PublicAgenda />} />
      <Route path="/tpq" element={<PublicTPQ />} />
      <Route path="/tpq/daftar" element={<PublicTPQRegister />} />
      <Route path="/kabar" element={<PublicNews />} />
      <Route path="/kabar/:slug" element={<PublicNewsDetail />} />
      <Route path="/donasi" element={<PublicDonation />} />
      <Route path="/kontak" element={<PublicContact />} />
      <Route path="/transparansi" element={<Transparency />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes: Supabase session, active profile, and assigned role */}
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
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/keuangan']}>
            <Finance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/kabar"
        element={
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/kabar']}>
            <NewsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/program"
        element={
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/program']}>
            <ProgramAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/agenda"
        element={
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/agenda']}>
            <AgendaAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/laporan"
        element={
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/laporan']}>
            <ReportsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/donasi"
        element={
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/donasi']}>
            <DonationAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/inventaris"
        element={
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/inventaris']}>
            <InventoryAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/dokumen"
        element={
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/dokumen']}>
            <DocumentsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/pengaturan"
        element={
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/pengaturan']}>
            <SettingsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/tpq"
        element={
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/tpq']}>
            <TPQ />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/tpq/pengampu"
        element={
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/tpq/pengampu']}>
            <TPQPengampu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/tpq/app"
        element={
          <ProtectedRoute requiredPermission={ROUTE_PERMISSIONS['/app/tpq/app']}>
            <TPQPengampu standalone />
          </ProtectedRoute>
        }
      />

      {/* ── 404 catch-all ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
  <PWAInstallPrompt />
</>
  );
}
