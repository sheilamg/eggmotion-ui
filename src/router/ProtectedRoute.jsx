import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getToken, isTokenValid } from '../utils/auth';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  
  // Verificación adicional del token
  const token = getToken();
  const isTokenValidLocal = isTokenValid(token);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }
  
  // Verificar tanto el estado del contexto como la validez del token
  if (!isAuthenticated || !isTokenValidLocal) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}

export default ProtectedRoute;