import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import PageLoader from './PageLoader.jsx';
import AccessDenied from './AccessDenied.jsx';
import { hasPermission } from '../../services/accessPolicy.js';

export default function ProtectedRoute({ children, requiredPermission }) {
  const location = useLocation();
  const { isAuthenticated, isLoading, accessError, permissions } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location, accessError }} replace />;
  }
  if (!hasPermission(permissions, requiredPermission)) return <AccessDenied />;
  return children;
}
