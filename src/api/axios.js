import axios from 'axios';
import { getToken, removeToken, isTokenValid } from '../utils/auth';
import { getApiBaseUrl } from '../config/local';
import { debugToken, debugRequest, debugResponse, debugError } from '../utils/tokenDebug';

// URL base de la API
const API_BASE_URL = getApiBaseUrl();

console.log('🚀 Axios instance created with baseURL:', API_BASE_URL);

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
});

instance.interceptors.request.use((config) => {
  const token = getToken();
  
  console.log('🔍 Request interceptor:', {
    url: config.url,
    method: config.method,
    hasToken: !!token,
    tokenValid: token ? isTokenValid(token) : false
  });
  
  if (token && isTokenValid(token)) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token agregado al header:', `Bearer ${token.substring(0, 20)}...`);
    
    // Debug detallado del token
    debugToken(token);
  } else if (token) {
    console.log('❌ Token inválido, removiendo...');
    debugToken(token);
    removeToken();
  } else {
    console.log('⚠️ No hay token disponible');
  }
  
  // Debug detallado de la petición
  debugRequest(config);
  
  // Log de la petición para debug
  console.log('📤 Making request to:', config.baseURL + config.url);
  
  return config;
});

// Interceptor para manejar respuestas y errores de autenticación
instance.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', {
      status: response.status,
      url: response.config.url,
      data: response.data ? 'Data received' : 'No data'
    });
    
    // Debug detallado de la respuesta
    debugResponse(response);
    
    return response;
  },
  (error) => {
    // Debug detallado del error
    debugError(error);
    
    // Log detallado del error para debug
    console.error('❌ API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      fullURL: error.config?.baseURL + error.config?.url,
      message: error.message,
      responseData: error.response?.data
    });
    
    // Solo manejar errores de autenticación si no estamos en la página de login
    if ((error.response?.status === 401 || error.response?.status === 403) && 
        !['/login', '/register'].includes(window.location.pathname)) {
      
      console.log('🚫 Error de autenticación detectado, limpiando token...');
      
      // Limpiar el token inválido
      removeToken();
      
      // Solo redirigir si no estamos ya en proceso de login
      if (!error.config?.url?.includes('/auth/login')) {
        console.log('🔄 Redirigiendo al login...');
        // Usar window.location.href para forzar un refresh completo
        // Esto asegura que el estado de la aplicación se limpie completamente
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance; 