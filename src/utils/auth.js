// Utilidades para manejar la autenticación

export const TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const setTokens = (accessToken, refreshToken) => {
  setToken(accessToken);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = () => {
  removeToken();
  removeRefreshToken();
};

/** @deprecated Use clearTokens */
export const removeTokenOnly = removeToken;

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));

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
