// Configuración de la aplicación
export const APP_CONFIG = {
  // Configuración de la API
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    TIMEOUT: 10000, // 10 segundos
    RETRY_ATTEMPTS: 3,
  },
  
  // Configuración de autenticación
  AUTH: {
    TOKEN_KEY: 'access_token',
    TOKEN_EXPIRY_WARNING_MINUTES: 5, // Advertir 5 minutos antes de expirar
    AUTO_LOGOUT_ON_EXPIRY: true,
  },
  
  // Configuración de la interfaz
  UI: {
    THEME: 'dark',
    LANGUAGE: 'es',
    LOADING_TIMEOUT: 5000, // 5 segundos máximo de loading
  },
  
  // Configuración de rutas
  ROUTES: {
    PUBLIC: ['/login', '/register'],
    DEFAULT_REDIRECT: '/emotions',
    LOGIN_REDIRECT: '/login',
  },
  
  // Configuración de errores
  ERRORS: {
    SHOW_DETAILS_IN_DEV: import.meta.env.DEV || false,
    LOG_TO_CONSOLE: true,
    RETRY_ON_ERROR: true,
  }
};

// Función para obtener la configuración según el entorno
export const getConfig = (key) => {
  const keys = key.split('.');
  let value = APP_CONFIG;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }
  
  return value;
};

// Función para validar la configuración
export const validateConfig = () => {
  const required = [
    'API.BASE_URL',
    'AUTH.TOKEN_KEY',
    'ROUTES.DEFAULT_REDIRECT'
  ];
  
  const missing = required.filter(key => !getConfig(key));
  
  if (missing.length > 0) {
    console.error('Missing required configuration:', missing);
    return false;
  }
  
  return true;
};

// Función para obtener información del entorno
export const getEnvironmentInfo = () => {
  return {
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    mode: import.meta.env.MODE,
    apiUrl: import.meta.env.VITE_API_URL,
    appTitle: import.meta.env.VITE_APP_TITLE,
    appVersion: import.meta.env.VITE_APP_VERSION,
  };
};
