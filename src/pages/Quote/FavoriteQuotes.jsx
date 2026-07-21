import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavoriteQuotes, removeQuoteFavorite } from '../../api/quotes';
import Eyebrow from '../../components/ui/Eyebrow';
import SurfaceCard from '../../components/ui/SurfaceCard';
import NeonButton from '../../components/ui/NeonButton';

export default function FavoriteQuotes() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);
  const [removing, setRemoving] = useState(false);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFavoriteQuotes();
      setFavorites(res.data);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRemove = async (id) => {
    try {
      setRemoving(true);
      await removeQuoteFavorite(id);
      setFavorites((prev) => prev.filter((item) => item.id !== id));
      setConfirmRemoveId(null);
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--text2)' }}>
        Cargando favoritas...
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-5">
      <div>
        <Eyebrow color="#FF1E73">♥ FRASES</Eyebrow>
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Mis frases favoritas
        </h2>
      </div>

      {!favorites.length ? (
        <SurfaceCard className="p-8 text-center flex flex-col items-center gap-4">
          <p className="text-sm" style={{ color: 'var(--text2)' }}>
            Todavía no guardaste ninguna frase. La de hoy está esperándote.
          </p>
          <NeonButton color="#9B5DE5" onClick={() => navigate('/home')}>
            IR AL INICIO
          </NeonButton>
        </SurfaceCard>
      ) : (
        <div className="flex flex-col gap-3">
          {favorites.map((item) => (
            <SurfaceCard key={item.id} className="p-4" borderLeft="#FF1E73">
              <button
                type="button"
                onClick={() => navigate(`/quote/${item.id}`)}
                className="w-full text-left press-effect"
              >
                <p
                  className="font-display text-base italic"
                  style={{ color: 'var(--text)', lineHeight: 1.5 }}
                >
                  &ldquo;{item.text}&rdquo;
                </p>
              </button>
              {confirmRemoveId === item.id ? (
                <div className="mt-3 flex items-center gap-3">
                  <p className="text-xs flex-1" style={{ color: 'var(--text2)' }}>
                    ¿Quitar de favoritas?
                  </p>
                  <button
                    type="button"
                    disabled={removing}
                    onClick={() => handleRemove(item.id)}
                    className="font-pixel text-[7px] min-h-[44px] px-3"
                    style={{ color: '#FF1E73' }}
                  >
                    QUITAR
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmRemoveId(null)}
                    className="font-pixel text-[7px] min-h-[44px] px-3"
                    style={{ color: 'var(--text2)' }}
                  >
                    CANCELAR
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmRemoveId(item.id)}
                  className="font-pixel text-[7px] mt-3 min-h-[44px] press-effect"
                  style={{ color: 'var(--text2)' }}
                >
                  QUITAR DE FAVORITAS
                </button>
              )}
            </SurfaceCard>
          ))}
        </div>
      )}
    </div>
  );
}
