import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import GrainOverlay from '../../components/ui/GrainOverlay';
import NeonButton from '../../components/ui/NeonButton';
import EggAvatar from '../../components/ui/EggAvatar';
import Eyebrow from '../../components/ui/Eyebrow';

const SLIDES = [
  {
    title: 'Hola, soy tu huevo',
    text: 'Te acompaño a registrar emociones sin presión ni juicios.',
  },
  {
    title: 'Check-in rápido',
    text: 'Elegís cómo te sentís en segundos. Podés agregar detalle si querés.',
  },
  {
    title: 'Tu cuaderno',
    text: 'Escribí lo que necesites, cuando lo necesites. Sin obligación diaria.',
  },
  {
    title: 'Con el tiempo, claridad',
    text: 'Tus registros forman un historial para mirarte con más calma.',
  },
];

const COUNTRIES = [
  'Argentina',
  'Chile',
  'Colombia',
  'España',
  'México',
  'Perú',
  'Uruguay',
  'Otro',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [slide, setSlide] = useState(0);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState(
    navigator.language?.startsWith('es') ? 'es' : 'en',
  );
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Argentina/Buenos_Aires',
  );
  const [dailyReminder, setDailyReminder] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isProfileStep = step === 1;
  const isPrefsStep = step === 2;

  const canContinueProfile = useMemo(() => Boolean(country && language && timezone), [country, language, timezone]);

  const finishOnboarding = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post('/users/onboarding/complete', {
        name: name.trim() || undefined,
        country,
        language,
        timezone,
        preferences: {
          dailyReminder,
          dailyQuote,
        },
      });
      updateUser(res.data);
      navigate('/home', { replace: true });
    } catch {
      setError('No pudimos guardar tu perfil. Probá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <GrainOverlay />
      <div
        className="relative w-full max-w-lg p-6 sm:p-8 space-y-6 surface-card"
        style={{ borderRadius: 12 }}
      >
        {step === 0 && (
          <>
            <div className="text-center">
              <div className="animate-float inline-block mb-4">
                <EggAvatar size={80} glow="#9B5DE5" />
              </div>
              <Eyebrow color="#9B5DE5">BIENVENIDA</Eyebrow>
              <h2 className="font-display text-2xl font-bold mt-2">{SLIDES[slide].title}</h2>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text2)' }}>
                {SLIDES[slide].text}
              </p>
            </div>
            <div className="flex justify-center gap-2">
              {SLIDES.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: i === slide ? '#9B5DE5' : 'var(--border)',
                  }}
                />
              ))}
            </div>
            <div className="flex gap-3">
              {slide > 0 && (
                <button
                  type="button"
                  onClick={() => setSlide((s) => s - 1)}
                  className="font-pixel text-[8px] px-4 py-3 press-effect"
                  style={{
                    color: 'var(--text2)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  ATRÁS
                </button>
              )}
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-pixel text-[8px] px-4 py-3 press-effect"
                style={{
                  color: 'var(--text2)',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                SALTAR
              </button>
              {slide < SLIDES.length - 1 ? (
                <NeonButton color="#9B5DE5" onClick={() => setSlide((s) => s + 1)}>
                  SIGUIENTE
                </NeonButton>
              ) : (
                <NeonButton color="#9B5DE5" onClick={() => setStep(1)}>
                  EMPEZAR
                </NeonButton>
              )}
            </div>
          </>
        )}

        {isProfileStep && (
          <>
            <div>
              <Eyebrow color="#00F5D4">TU PERFIL</Eyebrow>
              <h2 className="font-display text-2xl font-bold mt-2">Contanos un poco de vos</h2>
              <p className="text-sm mt-2" style={{ color: 'var(--text2)' }}>
                Tu país nos ayuda a sugerir emociones culturalmente cercanas más adelante.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>NOMBRE (OPCIONAL)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-3 mt-2 rounded-lg text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                  placeholder="¿Cómo te llamamos?"
                />
              </div>
              <div>
                <label className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>PAÍS *</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-3 mt-2 rounded-lg text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  <option value="">Seleccioná un país</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>IDIOMA *</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-3 mt-2 rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>ZONA HORARIA *</label>
                  <input
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-3 mt-2 rounded-lg text-sm outline-none"
                    style={{
                      backgroundColor: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </div>
              </div>
            </div>
            <NeonButton
              color="#9B5DE5"
              className="w-full"
              disabled={!canContinueProfile}
              onClick={() => setStep(2)}
            >
              CONTINUAR
            </NeonButton>
          </>
        )}

        {isPrefsStep && (
          <>
            <div>
              <Eyebrow color="#F15BB5">PREFERENCIAS</Eyebrow>
              <h2 className="font-display text-2xl font-bold mt-2">Últimos toques</h2>
              <p className="text-sm mt-2" style={{ color: 'var(--text2)' }}>
                Podés cambiar esto cuando quieras desde Configuración.
              </p>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="font-display font-semibold text-sm">Recordatorio diario</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>Apagado por defecto</p>
                </div>
                <input
                  type="checkbox"
                  checked={dailyReminder}
                  onChange={(e) => setDailyReminder(e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)' }}>
                <div>
                  <p className="font-display font-semibold text-sm">Frase del día</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>Una frase suave en el inicio</p>
                </div>
                <input
                  type="checkbox"
                  checked={dailyQuote}
                  onChange={(e) => setDailyQuote(e.target.checked)}
                />
              </label>
            </div>
            {error && (
              <p className="text-sm text-center" style={{ color: '#FF1E73' }}>{error}</p>
            )}
            <NeonButton color="#9B5DE5" className="w-full" disabled={loading} onClick={finishOnboarding}>
              {loading ? 'GUARDANDO...' : 'FINALIZAR'}
            </NeonButton>
          </>
        )}
      </div>
    </div>
  );
}
