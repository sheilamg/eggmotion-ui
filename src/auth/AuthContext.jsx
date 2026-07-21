import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../hooks/useAuth';
import axios from '../api/axios';

const AuthContext = createContext();

function resolveRedirect(redirectTo, profile) {
  if (!redirectTo || redirectTo === '/welcome' || redirectTo === '/login') {
    return profile.onboardingCompleted ? '/home' : '/onboarding';
  }
  if (!profile.onboardingCompleted) {
    return '/onboarding';
  }
  return redirectTo;
}

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const authState = useAuthState();

  const afterAuth = (profile, redirectTo) => {
    authState.updateUser(profile);
    navigate(resolveRedirect(redirectTo, profile), { replace: true });
  };

  const login = async (credentials, redirectTo) => {
    const res = await axios.post('/auth/login', credentials);
    authState.login(null, res.data.access_token, res.data.refresh_token);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const profile = await axios.get('/users/profile');
    afterAuth(profile.data, redirectTo);
  };

  const register = async (payload, redirectTo) => {
    const res = await axios.post('/auth/register', payload);
    authState.login(null, res.data.access_token, res.data.refresh_token);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const profile = await axios.get('/users/profile');
    afterAuth(profile.data, redirectTo);
  };

  const logout = () => {
    authState.logout();
    navigate('/welcome');
  };

  const value = {
    user: authState.user,
    login,
    register,
    logout,
    updateUser: authState.updateUser,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    checkAuthStatus: authState.checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
