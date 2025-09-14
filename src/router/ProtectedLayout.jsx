import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedLayout;