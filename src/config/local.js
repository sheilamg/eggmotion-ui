// Configuración local para desarrollo
// Este archivo se puede modificar directamente sin necesidad de variables de entorno

export const LOCAL_CONFIG = {
  // Configuración de la API
  API: {
    BASE_URL: 'http://localhost:3000', // URL de tu backend
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },
  
  // Configuración de autenticación
  AUTH: {
    TOKEN_KEY: 'access_token',
    TOKEN_EXPIRY_WARNING_MINUTES: 5,
    AUTO_LOGOUT_ON_EXPIRY: true,
  },
  
  // Configuración de la interfaz
  UI: {
    THEME: 'dark',
    LANGUAGE: 'es',
    LOADING_TIMEOUT: 5000,
  },
  
  // Configuración de rutas
  ROUTES: {
    PUBLIC: ['/login', '/register'],
    DEFAULT_REDIRECT: '/emotions',
    LOGIN_REDIRECT: '/login',
  },
  
  // Configuración de errores
  ERRORS: {
    SHOW_DETAILS_IN_DEV: true,
    LOG_TO_CONSOLE: true,
    RETRY_ON_ERROR: true,
  }
};

// Función para obtener la configuración
export const getLocalConfig = (key) => {
  const keys = key.split('.');
  let value = LOCAL_CONFIG;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }
  
  return value;
};

// Función para obtener la URL de la API
export const getApiBaseUrl = () => {
  return LOCAL_CONFIG.API.BASE_URL;
};
