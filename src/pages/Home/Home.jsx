import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useUserEmotionsCalendar } from '../../hooks/useUserEmotionsCalendar';
import { useCheckIn } from '../../context/CheckInContext';
import {
  calculateStreak,
  getEmotionNeonColor,
  getTodayEmotions,
} from '../../utils/emotionUtils';
import { getDailyQuote, toggleQuoteFavorite } from '../../api/quotes';
import { formatDateEs, getGreeting, surfaceStyle } from '../../utils/uiUtils';
import Eyebrow from '../../components/ui/Eyebrow';
import SurfaceCard from '../../components/ui/SurfaceCard';
import EggAvatar from '../../components/ui/EggAvatar';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openCheckIn } = useCheckIn();
  const { userEmotions, loading } = useUserEmotionsCalendar();
  const [dailyQuote, setDailyQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  const showDailyQuote = user?.preferences?.dailyQuote !== false;
  const today = new Date();
  const todayEntries = useMemo(() => getTodayEmotions(userEmotions), [userEmotions]);
  const latestToday = todayEntries[todayEntries.length - 1];
  const streak = useMemo(() => calculateStreak(userEmotions), [userEmotions]);
  const previewEmotions = userEmotions.slice(0, 4);
  const isEmpty = userEmotions.length === 0;

  const todayColor = latestToday
    ? getEmotionNeonColor(latestToday.emotion?.emotion || latestToday.emotion?.name)
    : undefined;
  const todayLabel = latestToday?.emotion?.emotion || latestToday?.emotion?.name;

  useEffect(() => {
    if (!showDailyQuote) return;

    let cancelled = false;
    (async () => {
      try {
        setQuoteLoading(true);
        const res = await getDailyQuote();
        if (!cancelled) setDailyQuote(res.data);
      } catch {
        if (!cancelled) setDailyQuote(null);
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [showDailyQuote, user?.timezone, user?.language]);

  const handleToggleFavorite = async (event) => {
    event.stopPropagation();
    if (!dailyQuote || togglingFavorite) return;

    try {
      setTogglingFavorite(true);
      const res = await toggleQuoteFavorite(dailyQuote.id);
      setDailyQuote((prev) => ({ ...prev, isFavorite: res.data.isFavorite }));
    } catch {
      // silent — card remains usable
    } finally {
      setTogglingFavorite(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--text2)' }}>
        Cargando inicio...
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between lg:justify-start lg:gap-8">
            <div>
              <Eyebrow>■ EGGMOTION</Eyebrow>
              <h1
                className="font-display text-2xl lg:text-3xl font-bold"
                style={{ color: 'var(--text)', lineHeight: 1.2 }}
              >
                {user?.name ? `${getGreeting()}, ${user.name}` : getGreeting()}
              </h1>
              <p className="text-sm mt-1 capitalize" style={{ color: 'var(--text2)' }}>
                {formatDateEs(today)}
              </p>
            </div>
            <div className="animate-float shrink-0">
              <EggAvatar size={72} glow={todayColor} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => openCheckIn()}
            className="press-effect w-full text-left"
            style={{
              ...surfaceStyle(false),
              background: 'linear-gradient(135deg, #1E1E3A 0%, #252545 100%)',
              border: '2px solid #9B5DE580',
              borderRadius: 12,
              padding: '20px',
              boxShadow: '0 0 24px #9B5DE530',
              cursor: 'pointer',
            }}
          >
            <Eyebrow color="#9B5DE5">◆ REGISTRAR</Eyebrow>
            <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>
              ¿Cómo te sentís ahora?
            </h2>
            <p className="text-sm" style={{ color: 'var(--text2)' }}>
              Tocá para registrar tu emoción — toma 30 segundos
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {previewEmotions.map((entry) => {
                const label = entry.emotion?.emotion || entry.emotion?.name;
                const color = getEmotionNeonColor(label);
                return (
                  <span
                    key={entry.id}
                    className="font-pixel text-[7px] px-2 py-1"
                    style={{
                      border: `1px solid ${color}80`,
                      borderRadius: 4,
                      color,
                      backgroundColor: `${color}15`,
                    }}
                  >
                    {label}
                  </span>
                );
              })}
              {userEmotions.length > 4 && (
                <span
                  className="font-pixel text-[7px] px-2 py-1"
                  style={{
                    color: 'var(--text2)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                  }}
                >
                  +{userEmotions.length - 4} más
                </span>
              )}
            </div>
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-4 lg:mt-0">
          <div className="grid grid-cols-2 gap-3">
            {!isEmpty ? (
              <SurfaceCard className="p-4">
                <Eyebrow color="#FEE440">🔥 RACHA</Eyebrow>
                <p
                  className="font-display text-3xl font-bold"
                  style={{ color: '#FEE440', textShadow: '0 0 16px #FEE44080' }}
                >
                  {streak}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
                  días seguidos
                </p>
              </SurfaceCard>
            ) : (
              <SurfaceCard className="p-4 col-span-2">
                <Eyebrow color="#9B5DE5">◆ EMPEZÁ ACÁ</Eyebrow>
                <p className="font-display text-base font-semibold" style={{ color: 'var(--text)' }}>
                  Registrá tu primera emoción para empezar tu historial
                </p>
                <p className="text-xs mt-2" style={{ color: 'var(--text2)' }}>
                  Toma menos de un minuto. Sin presión.
                </p>
              </SurfaceCard>
            )}
            {!isEmpty && (
            <SurfaceCard className="p-4">
              <Eyebrow color={todayColor || 'var(--text2)'}>◎ HOY</Eyebrow>
              {latestToday ? (
                <>
                  <p
                    className="font-display text-lg font-bold"
                    style={{
                      color: todayColor,
                      textShadow: `0 0 12px ${todayColor}80`,
                    }}
                  >
                    {todayLabel}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
                    registrado hoy
                  </p>
                </>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text2)' }}>
                  Aún no registraste
                </p>
              )}
            </SurfaceCard>
            )}
          </div>

          {showDailyQuote && (
            <SurfaceCard
              className="p-4 lg:p-5 press-effect cursor-pointer"
              borderLeft="#9B5DE5"
              onClick={() => dailyQuote && navigate(`/quote/${dailyQuote.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <Eyebrow color="#9B5DE5">✦ PENSAMIENTO DEL DÍA</Eyebrow>
                {dailyQuote && (
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={togglingFavorite}
                    className="font-pixel text-sm min-h-[44px] min-w-[44px] shrink-0 press-effect"
                    style={{ color: dailyQuote.isFavorite ? '#FF1E73' : 'var(--text2)' }}
                    aria-label={dailyQuote.isFavorite ? 'Quitar de favoritas' : 'Guardar en favoritas'}
                    aria-pressed={dailyQuote.isFavorite}
                  >
                    {dailyQuote.isFavorite ? '♥' : '♡'}
                  </button>
                )}
              </div>
              <p
                className="font-display text-base italic mt-2"
                style={{ color: 'var(--text)', lineHeight: 1.6 }}
              >
                {quoteLoading ? (
                  <span style={{ color: 'var(--text2)' }}>Cargando frase...</span>
                ) : dailyQuote ? (
                  <> &ldquo;{dailyQuote.text}&rdquo;</>
                ) : (
                  <span style={{ color: 'var(--text2)' }}>No hay frase disponible hoy.</span>
                )}
              </p>
            </SurfaceCard>
          )}

          <SurfaceCard
            className="flex items-center justify-between p-4 press-effect cursor-pointer"
            onClick={() => navigate('/journal')}
          >
            <div>
              <Eyebrow color="#F15BB5">✎ DIARIO</Eyebrow>
              <p className="font-display text-base font-semibold" style={{ color: 'var(--text)' }}>
                Abrí tu cuaderno
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>
                Escribí libremente, stickers y más
              </p>
            </div>
            <span style={{ fontSize: 28 }}>📓</span>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
