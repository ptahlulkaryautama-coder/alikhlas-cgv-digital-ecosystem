/**
 * ProtectedRoute.jsx
 *
 * Wraps a route element so that it is only accessible to authenticated
 * admin users. Unauthenticated visitors are redirected to /login.
 *
 * ⚠️  PROTOTYPE SECURITY ONLY ⚠️
 * The underlying auth.js uses a client-side sessionStorage flag. This
 * component prevents casual discovery but does NOT enforce server-side
 * access control. Replace with a real auth provider before launch.
 *
 * Usage (in App.jsx):
 *   <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */

import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Preserve the attempted path so Login.jsx can redirect back after
    // a successful PIN entry.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
