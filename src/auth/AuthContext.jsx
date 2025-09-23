import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../hooks/useAuth';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const authState = useAuthState();

  const login = async (credentials) => {
    try {
      console.log('🚀 Iniciando proceso de login...');
      
      // 1. Hacer login
      const res = await axios.post('/auth/login', credentials);
      const token = res.data.access_token;
      
      console.log('✅ Login exitoso, token obtenido:', token ? 'Sí' : 'No');
      
      // 2. Guardar token inmediatamente (sin perfil)
      authState.login(null, token);
      
      // 3. Esperar un momento para que el token se procese
      console.log('⏳ Esperando procesamiento del token...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 4. Ahora obtener el perfil
      console.log('👤 Obteniendo perfil del usuario...');
      const profile = await axios.get('/users/profile');
      
      // 5. Actualizar el estado con el perfil
      authState.updateUser(profile.data);
      
      console.log('🎉 Login completo, redirigiendo...');
      navigate('/home');
    } catch (error) {
      console.error('❌ Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Iniciando logout...');
    authState.logout();
    navigate('/login');
  };

  const value = {
    user: authState.user,
    login,
    logout,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    checkAuthStatus: authState.checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};