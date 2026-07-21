import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuote, toggleQuoteFavorite } from '../../api/quotes';
import Eyebrow from '../../components/ui/Eyebrow';
import SurfaceCard from '../../components/ui/SurfaceCard';
import NeonButton from '../../components/ui/NeonButton';

export default function DailyQuoteView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState('');

  const loadQuote = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getQuote(id);
      setQuote(res.data);
    } catch {
      setError('No pudimos cargar esta frase.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const handleToggleFavorite = async () => {
    if (!quote) return;
    try {
      setToggling(true);
      const res = await toggleQuoteFavorite(quote.id);
      setQuote((prev) => ({ ...prev, isFavorite: res.data.isFavorite }));
    } catch {
      setError('No pudimos actualizar favoritos.');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--text2)' }}>
        Cargando frase...
      </div>
    );
  }

  if (error && !quote) {
    return (
      <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col items-center gap-4">
        <SurfaceCard className="p-8 max-w-md text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>{error}</p>
          <NeonButton color="#9B5DE5" onClick={() => navigate('/home')}>
            VOLVER AL INICIO
          </NeonButton>
        </SurfaceCard>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-5 max-w-2xl mx-auto">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="font-pixel text-[8px] press-effect self-start min-h-[44px] px-2"
        style={{ color: 'var(--text2)' }}
      >
        ← VOLVER
      </button>

      <SurfaceCard className="p-8 lg:p-10" borderLeft="#9B5DE5">
        <Eyebrow color="#9B5DE5">✦ PENSAMIENTO DEL DÍA</Eyebrow>
        <blockquote
          className="font-display text-2xl lg:text-3xl italic mt-6 mb-6"
          style={{ color: 'var(--text)', lineHeight: 1.5 }}
        >
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        {quote.author && (
          <p className="text-sm" style={{ color: 'var(--text2)' }}>
            — {quote.author}
          </p>
        )}
      </SurfaceCard>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={toggling}
          className="flex-1 font-pixel text-[8px] py-3 min-h-[44px] press-effect"
          style={{
            color: quote.isFavorite ? '#FF1E73' : 'var(--text2)',
            border: `1px solid ${quote.isFavorite ? '#FF1E7340' : 'var(--border)'}`,
            borderRadius: 4,
            background: 'transparent',
            cursor: 'pointer',
          }}
          aria-pressed={quote.isFavorite}
        >
          {quote.isFavorite ? '♥ QUITAR DE FAVORITAS' : '♡ GUARDAR EN FAVORITAS'}
        </button>
        <NeonButton color="#9B5DE5" className="flex-1" onClick={() => navigate('/quotes/favorites')}>
          VER FAVORITAS
        </NeonButton>
      </div>

      {error && (
        <p className="text-sm text-center" style={{ color: '#FF1E73' }}>{error}</p>
      )}
    </div>
  );
}
