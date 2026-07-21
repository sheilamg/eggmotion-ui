import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import BrandedLoadingScreen from '../../components/ui/BrandedLoadingScreen';
import GrainOverlay from '../../components/ui/GrainOverlay';
import NeonButton from '../../components/ui/NeonButton';
import ThemeToggle from '../../components/ui/ThemeToggle';

function Register() {
  const { register, isAuthenticated, loading, user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordStrength = useMemo(() => {
    const value = form.password;
    if (!value) return 0;
    if (value.length < 8) return 1;
    if (value.length < 12) return 2;
    return 3;
  }, [form.password]);

  const canSubmit = useMemo(() => {
    return (
      form.email &&
      form.password.length >= 8 &&
      form.password === form.confirmPassword &&
      acceptedTerms
    );
  }, [form, acceptedTerms]);

  if (isAuthenticated && user && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isAuthenticated && user?.onboardingCompleted) {
    return <Navigate to="/home" replace />;
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
    if (!canSubmit) return;

    setSubmitting(true);
    setError('');
    try {
      await register({
        name: form.name.trim() || undefined,
        email: form.email,
        password: form.password,
      });
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Este email ya está registrado');
      } else {
        setError('Error al registrar usuario');
      }
    } finally {
      setSubmitting(false);
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
          <h2 className="font-display text-2xl font-bold">Creá tu cuenta</h2>
        </div>

        {error && (
          <div
            className="p-3 rounded-md text-sm text-center"
            style={{ backgroundColor: '#FF1E7320', color: '#FF1E73', border: '1px solid #FF1E7340' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: 'name', label: 'NOMBRE (OPCIONAL)', type: 'text', placeholder: 'Tu nombre' },
            { name: 'email', label: 'EMAIL', type: 'email', placeholder: 'tu@email.com' },
            { name: 'password', label: 'CONTRASEÑA', type: 'password', placeholder: 'Mínimo 8 caracteres' },
            { name: 'confirmPassword', label: 'CONFIRMAR CONTRASEÑA', type: 'password', placeholder: 'Repetí tu contraseña' },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full px-3 py-3 mt-2 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
                required={field.name !== 'name'}
                disabled={submitting}
              />
              {field.name === 'password' && form.password && (
                <p className="text-xs mt-2" style={{ color: passwordStrength >= 2 ? '#39FF14' : '#FEE440' }}>
                  {passwordStrength === 1 && 'Mínimo 8 caracteres'}
                  {passwordStrength === 2 && 'Contraseña aceptable'}
                  {passwordStrength === 3 && 'Contraseña fuerte'}
                </p>
              )}
              {field.name === 'confirmPassword' && form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs mt-2" style={{ color: '#FF1E73' }}>Las contraseñas no coinciden</p>
              )}
            </div>
          ))}

          <label className="flex items-start gap-3 text-sm" style={{ color: 'var(--text2)' }}>
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1"
            />
            <span>Acepto los términos y la política de privacidad</span>
          </label>

          <NeonButton type="submit" color="#9B5DE5" className="w-full" disabled={submitting || !canSubmit}>
            {submitting ? 'REGISTRANDO...' : 'CREAR CUENTA'}
          </NeonButton>
        </form>

        <p className="text-sm text-center" style={{ color: 'var(--text2)' }}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: '#9B5DE5' }}>
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
