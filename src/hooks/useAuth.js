import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { refreshAccessToken } from '../api/auth';
import {
  getToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  isTokenValid,
} from '../utils/auth';

export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      let token = getToken();

      if (!token && !getRefreshToken()) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      if (!isTokenValid(token)) {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearTokens();
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }

        try {
          const data = await refreshAccessToken(refreshToken);
          setTokens(data.access_token, data.refresh_token);
          token = data.access_token;
        } catch {
          clearTokens();
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }
      }

      const response = await axios.get('/users/profile');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response?.status === 401) {
        clearTokens();
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
    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  const login = (userData, accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
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
    checkAuthStatus,
  };
};
