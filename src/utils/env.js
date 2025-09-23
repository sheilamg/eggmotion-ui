// Utilidades para manejar variables de entorno y debug

export const getEnvVar = (key, defaultValue = '') => {
  const value = import.meta.env[key];
  console.log(`Getting env var ${key}:`, value);
  return value || defaultValue;
};

export const isDevelopment = () => import.meta.env.DEV;
export const isProduction = () => import.meta.env.PROD;

export const logEnvironmentInfo = () => {
  console.log('=== Environment Information ===');
  console.log('MODE:', import.meta.env.MODE);
  console.log('DEV:', import.meta.env.DEV);
  console.log('PROD:', import.meta.env.PROD);
  console.log('BASE_URL:', import.meta.env.BASE_URL);
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('VITE_APP_TITLE:', import.meta.env.VITE_APP_TITLE);
  console.log('VITE_APP_VERSION:', import.meta.env.VITE_APP_VERSION);
  console.log('==============================');
};

export const getApiBaseUrl = () => {
  const apiUrl = getEnvVar('VITE_API_URL', 'http://localhost:3000');
  console.log('API Base URL resolved to:', apiUrl);
  return apiUrl;
};


