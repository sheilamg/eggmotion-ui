import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { getToken, setToken, removeToken, isTokenValid } from '../utils/auth';

export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const token = getToken();
      
      console.log('🔍 Checking auth status...', { hasToken: !!token });
      
      if (!token) {
        console.log('❌ No token found');
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Verificar token localmente primero
      if (!isTokenValid(token)) {
        console.log('❌ Token inválido localmente, removiendo...');
        removeToken();
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Token válido localmente, verificar con el servidor
      console.log('✅ Token válido localmente, verificando con servidor...');
      const response = await axios.get('/users/profile');
      console.log('✅ Profile obtenido del servidor:', response.data);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      if (error.response?.status === 401) {
        console.log('🚫 Token rechazado por el servidor, removiendo...');
        removeToken();
      }
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const logout = () => {
    console.log('🚪 Logging out...');
    removeToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  const login = (userData, token) => {
    console.log('🔑 Logging in...', { hasUserData: !!userData, hasToken: !!token });
    setToken(token);
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      // Solo token, el usuario se establecerá después
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    console.log('👤 Updating user data:', userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateUser,
    checkAuthStatus
  };
};
