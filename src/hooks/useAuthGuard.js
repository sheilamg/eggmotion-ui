import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getToken, isTokenValid } from '../utils/auth';

export const useAuthGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();

  useEffect(() => {
    // Solo verificar si no está cargando
    if (!loading) {
      const token = getToken();
      const isTokenValidLocal = isTokenValid(token);
      
      // Si no hay token válido y no estamos en una ruta pública, redirigir al login
      if (!isTokenValidLocal && !isAuthenticated) {
        const publicRoutes = ['/login', '/register'];
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login', { replace: true });
        }
      }
      
      // Si hay token válido pero no está autenticado, verificar el estado
      if (isTokenValidLocal && !isAuthenticated) {
        checkAuthStatus();
      }
    }
  }, [location.pathname, isAuthenticated, loading, navigate, checkAuthStatus]);

  return { isAuthenticated, loading };
};
