// Utilidades para manejar la autenticación

export const TOKEN_KEY = 'access_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Verificar si el token tiene el formato correcto (JWT básico)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decodificar el payload del JWT
    const payload = JSON.parse(atob(parts[1]));
    
    // Verificar si el token ha expirado
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime >= payload.exp) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const getTokenExpiration = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

export const isTokenExpiringSoon = (token, minutes = 5) => {
  if (!token) return false;
  
  const expiration = getTokenExpiration(token);
  if (!expiration) return false;
  
  const now = new Date();
  const timeUntilExpiration = expiration.getTime() - now.getTime();
  const minutesUntilExpiration = timeUntilExpiration / (1000 * 60);
  
  return minutesUntilExpiration <= minutes;
};

