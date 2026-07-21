import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const dismissToast = useCallback(() => setToast(null), []);

  const showToast = useCallback(({ message, onRetry, type = 'error', duration = 6000 }) => {
    setToast({ message, onRetry, type, id: Date.now() });

    if (!onRetry && duration > 0) {
      setTimeout(() => {
        setToast((current) => (current?.message === message ? null : current));
      }, duration);
    }
  }, []);

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          className="fixed bottom-24 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:max-w-sm z-[70] animate-fade-in"
          role="alert"
        >
          <div
            className="p-4 flex flex-col gap-3"
            style={{
              backgroundColor: 'var(--surface)',
              border: `1px solid ${toast.type === 'error' ? '#FF1E7340' : '#00F5D440'}`,
              borderRadius: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            }}
          >
            <p className="text-sm font-display" style={{ color: 'var(--text)' }}>
              {toast.message}
            </p>
            <div className="flex gap-2">
              {toast.onRetry && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onRetry();
                    dismissToast();
                  }}
                  className="font-pixel text-[8px] px-4 py-2 press-effect"
                  style={{
                    backgroundColor: '#9B5DE5',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  REINTENTAR
                </button>
              )}
              <button
                type="button"
                onClick={dismissToast}
                className="font-pixel text-[8px] px-4 py-2 press-effect"
                style={{
                  color: 'var(--text2)',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return ctx;
}
