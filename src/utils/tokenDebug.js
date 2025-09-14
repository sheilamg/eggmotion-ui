// Utilidades para debug del token y autenticación

export const debugToken = (token) => {
  if (!token) {
    console.log('🔍 Token Debug: No hay token');
    return;
  }

  try {
    // Decodificar el JWT
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('🔍 Token Debug: Formato inválido (no es JWT)');
      return;
    }

    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    console.log('🔍 Token Debug:', {
      header: {
        alg: header.alg,
        typ: header.typ
      },
      payload: {
        sub: payload.sub,
        email: payload.email,
        exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No exp',
        iat: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'No iat',
        ...payload
      },
      tokenLength: token.length,
      tokenStart: token.substring(0, 20) + '...',
      tokenEnd: '...' + token.substring(token.length - 20)
    });

    // Verificar expiración
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - now;
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);
      
      if (timeUntilExpiry <= 0) {
        console.log('❌ Token Debug: Token expirado');
      } else if (minutesUntilExpiry <= 5) {
        console.log(`⚠️ Token Debug: Token expira en ${minutesUntilExpiry} minutos`);
      } else {
        console.log(`✅ Token Debug: Token válido por ${minutesUntilExpiry} minutos`);
      }
    }

  } catch (error) {
    console.error('🔍 Token Debug: Error decodificando token:', error);
  }
};

export const debugAuthState = () => {
  const token = localStorage.getItem('access_token');
  
  console.log('🔍 Auth State Debug:', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    currentPath: window.location.pathname,
    timestamp: new Date().toISOString()
  });

  if (token) {
    debugToken(token);
  }
};

export const debugRequest = (config) => {
  console.log('🔍 Request Debug:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: config.baseURL + config.url,
    hasAuthHeader: !!config.headers.Authorization,
    authHeader: config.headers.Authorization ? 
      config.headers.Authorization.substring(0, 30) + '...' : 
      'No Authorization header',
    headers: Object.keys(config.headers),
    timestamp: new Date().toISOString()
  });
};

export const debugResponse = (response) => {
  console.log('🔍 Response Debug:', {
    status: response.status,
    statusText: response.statusText,
    url: response.config.url,
    method: response.config.method?.toUpperCase(),
    hasData: !!response.data,
    dataType: response.data ? typeof response.data : 'No data',
    timestamp: new Date().toISOString()
  });
};

export const debugError = (error) => {
  console.log('🔍 Error Debug:', {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
    hasResponse: !!error.response,
    responseData: error.response?.data,
    isNetworkError: !error.response,
    timestamp: new Date().toISOString()
  });
};
