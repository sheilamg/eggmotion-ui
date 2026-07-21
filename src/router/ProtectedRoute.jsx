import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getToken, isTokenValid, getRefreshToken } from '../utils/auth';
import BrandedLoadingScreen from '../components/ui/BrandedLoadingScreen';

function ProtectedRoute() {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  const token = getToken();
  const hasValidSession = isTokenValid(token) || Boolean(getRefreshToken());

  if (loading) {
    return <BrandedLoadingScreen message="Verificando autenticación..." />;
  }

  if (!isAuthenticated || !hasValidSession) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!user?.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (user?.onboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
