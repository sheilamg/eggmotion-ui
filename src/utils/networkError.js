export function isNetworkError(err) {
  if (!err) return false;
  return !err.response || err.code === 'ERR_NETWORK' || err.message === 'Network Error';
}

export function getRequestErrorMessage(err, fallback = 'Ocurrió un error. Intentá de nuevo.') {
  if (isNetworkError(err)) {
    return 'Sin conexión. Verificá tu red e intentá de nuevo.';
  }
  const message = err.response?.data?.message;
  if (Array.isArray(message)) return message[0] || fallback;
  if (typeof message === 'string') return message;
  return fallback;
}
