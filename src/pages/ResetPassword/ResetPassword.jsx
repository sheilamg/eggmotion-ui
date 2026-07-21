import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../api/axios';
import GrainOverlay from '../../components/ui/GrainOverlay';
import NeonButton from '../../components/ui/NeonButton';
import ThemeToggle from '../../components/ui/ThemeToggle';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(
    () => form.password.length >= 8 && form.password === form.confirmPassword,
    [form],
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('El enlace no es válido. Solicitá uno nuevo.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post('/auth/reset-password', { token, password: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'No pudimos restablecer la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="relative flex items-center justify-center min-h-screen p-4"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
      >
        <GrainOverlay />
        <div className="relative w-full max-w-md p-8 space-y-4 text-center surface-card" style={{ borderRadius: 12 }}>
          <p style={{ color: 'var(--text2)' }}>El enlace no es válido o expiró.</p>
          <Link to="/forgot-password" style={{ color: '#9B5DE5' }}>
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

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
          <h2 className="font-display text-2xl font-bold">Nueva contraseña</h2>
        </div>

        {error && (
          <div
            className="p-3 rounded-md text-sm text-center font-display"
            style={{ backgroundColor: '#FF1E7320', color: '#FF1E73', border: '1px solid #FF1E7340' }}
          >
            {error}
          </div>
        )}

        {success ? (
          <div
            className="p-4 rounded-lg text-sm text-center"
            style={{ backgroundColor: '#00F5D415', border: '1px solid #00F5D440', color: 'var(--text)' }}
          >
            Contraseña actualizada. Redirigiendo al login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
                NUEVA CONTRASEÑA
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-3 mt-2 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
                CONFIRMAR CONTRASEÑA
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repetí la contraseña"
                value={form.confirmPassword}
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

            <NeonButton type="submit" color="#9B5DE5" className="w-full" disabled={isLoading || !canSubmit}>
              {isLoading ? 'GUARDANDO...' : 'RESTABLECER CONTRASEÑA'}
            </NeonButton>
          </form>
        )}

        <p className="text-sm text-center">
          <Link to="/login" style={{ color: 'var(--text2)' }}>
            ← Volver al login
          </Link>
        </p>
      </div>
    </div>
  );
}
