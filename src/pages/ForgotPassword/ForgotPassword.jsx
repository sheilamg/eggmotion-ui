import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import GrainOverlay from '../../components/ui/GrainOverlay';
import NeonButton from '../../components/ui/NeonButton';
import ThemeToggle from '../../components/ui/ThemeToggle';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch {
      setError('No pudimos procesar la solicitud. Verificá tu conexión.');
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
          <h2 className="font-display text-2xl font-bold">Recuperar contraseña</h2>
          <p className="text-sm mt-2" style={{ color: 'var(--text2)' }}>
            Te enviaremos un enlace si el email está registrado.
          </p>
        </div>

        {error && (
          <div
            className="p-3 rounded-md text-sm text-center font-display"
            style={{ backgroundColor: '#FF1E7320', color: '#FF1E73', border: '1px solid #FF1E7340' }}
          >
            {error}
          </div>
        )}

        {submitted ? (
          <div
            className="p-4 rounded-lg text-sm text-center"
            style={{ backgroundColor: '#00F5D415', border: '1px solid #00F5D440', color: 'var(--text)' }}
          >
            Si el email existe en nuestra base, recibirás un enlace para restablecer tu contraseña.
          </div>
        ) : (
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <NeonButton type="submit" color="#9B5DE5" className="w-full" disabled={isLoading}>
              {isLoading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
            </NeonButton>
          </form>
        )}

        <p className="text-sm text-center">
          <Link to="/login" style={{ color: '#9B5DE5' }}>
            ← Volver al login
          </Link>
        </p>
      </div>
    </div>
  );
}
