import { useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import BrandedLoadingScreen from '../../components/ui/BrandedLoadingScreen';
import GrainOverlay from '../../components/ui/GrainOverlay';
import NeonButton from '../../components/ui/NeonButton';
import ThemeToggle from '../../components/ui/ThemeToggle';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectTo = useMemo(() => {
    const fromState = location.state?.from;
    const fromQuery = searchParams.get('redirect');
    const candidate = fromState || fromQuery;
    if (!candidate || candidate.startsWith('/welcome') || candidate.startsWith('/login')) {
      return '/home';
    }
    return candidate;
  }, [location.state, searchParams]);

  const sessionExpired = searchParams.get('session') === 'expired';

  if (isAuthenticated && user?.onboardingCompleted) {
    return <Navigate to={redirectTo} replace />;
  }

  if (isAuthenticated && user && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  if (loading) {
    return <BrandedLoadingScreen message="Verificando sesión..." />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(form, redirectTo);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Email o contraseña incorrectos');
      } else if (err.response?.status >= 500) {
        setError('Error del servidor. Intentalo más tarde.');
      } else {
        setError('Error al iniciar sesión. Verificá tu conexión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <GrainOverlay />
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div
        className="relative w-full max-w-md p-8 space-y-6 animate-fade-in-down surface-card"
        style={{ borderRadius: 12 }}
      >
        <div className="text-center">
          <p className="font-pixel text-[10px] neon-text-cyan mb-2" style={{ color: '#00F5D4' }}>
            eggmotion
          </p>
          <h2 className="font-display text-2xl font-bold">Bienvenido de vuelta</h2>
        </div>

        {sessionExpired && (
          <div
            className="p-3 rounded-md text-sm text-center font-display"
            style={{ backgroundColor: '#FEE44020', color: '#FEE440', border: '1px solid #FEE44040' }}
            role="status"
          >
            Tu sesión expiró. Iniciá sesión de nuevo para continuar.
          </div>
        )}

        {error && (
          <div
            className="p-3 rounded-md text-sm text-center font-display"
            style={{ backgroundColor: '#FF1E7320', color: '#FF1E73', border: '1px solid #FF1E7340' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
              EMAIL
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-3 mt-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
              CONTRASEÑA
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-3 mt-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
              required
              disabled={isLoading}
            />
            <p className="text-right mt-2">
              <Link to="/forgot-password" className="text-xs" style={{ color: '#00F5D4' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>

          <NeonButton type="submit" color="#9B5DE5" className="w-full min-h-[44px]" disabled={isLoading}>
            {isLoading ? 'INICIANDO...' : 'INICIAR SESIÓN'}
          </NeonButton>
        </form>

        <p className="text-sm text-center" style={{ color: 'var(--text2)' }}>
          ¿No tenés cuenta?{' '}
          <Link to="/register" style={{ color: '#9B5DE5' }}>
            Registrate
          </Link>
        </p>
        <p className="text-sm text-center">
          <Link to="/welcome" style={{ color: 'var(--text2)' }}>
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
