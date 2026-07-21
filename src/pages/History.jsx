import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useUserEmotionsCalendar } from '../hooks/useUserEmotionsCalendar';
import { useCheckIn } from '../context/CheckInContext';
import {
  filterEntriesByDateRange,
  filterEntriesByEmotion,
  getUniqueEmotionLabels,
} from '../utils/historyUtils';
import { getEmotionNeonColor } from '../utils/emotionUtils';
import BrandedLoadingScreen from '../components/ui/BrandedLoadingScreen';
import Eyebrow from '../components/ui/Eyebrow';
import NeonButton from '../components/ui/NeonButton';
import SurfaceCard from '../components/ui/SurfaceCard';
import MonthCalendar from '../components/history/MonthCalendar';
import RecentEntriesList from '../components/history/RecentEntriesList';
import CalendarSection from '../components/history/CalendarSection';
import EmotionEntryDetail from '../components/history/EmotionEntryDetail';

export default function History() {
  const { entryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userEmotions, loading, refetch } = useUserEmotionsCalendar();
  const { openCheckIn } = useCheckIn();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [emotionFilter, setEmotionFilter] = useState('');
  const initializedFromUrl = useRef(false);

  useEffect(() => {
    if (initializedFromUrl.current) return;
    initializedFromUrl.current = true;

    const emotion = searchParams.get('emotion');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (emotion) setEmotionFilter(emotion);
    if (from) setDateFrom(from);
    if (to) setDateTo(to);
  }, [searchParams]);

  const emotionOptions = useMemo(
    () => getUniqueEmotionLabels(userEmotions),
    [userEmotions],
  );

  const filteredEmotions = useMemo(() => {
    const byDate = filterEntriesByDateRange(userEmotions, dateFrom, dateTo);
    return filterEntriesByEmotion(byDate, emotionFilter);
  }, [userEmotions, dateFrom, dateTo, emotionFilter]);

  const selectedEntry = useMemo(
    () => (entryId ? userEmotions.find((entry) => entry.id === entryId) : null),
    [entryId, userEmotions],
  );

  const monthName = new Date().toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  });

  const hasActiveFilters = Boolean(dateFrom || dateTo || emotionFilter);

  if (loading) {
    return <BrandedLoadingScreen message="Cargando historial..." />;
  }

  if (entryId && !selectedEntry) {
    return (
      <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col items-center text-center gap-5">
        <SurfaceCard className="p-8 max-w-md">
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Esa entrada ya no existe
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--text2)' }}>
            Puede haber sido eliminada o el enlace no es válido.
          </p>
          <NeonButton color="#9B5DE5" onClick={() => navigate('/history')}>
            VOLVER AL INICIO
          </NeonButton>
        </SurfaceCard>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-5">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <Eyebrow color="#FEE440">■ 002 — HISTORIAL</Eyebrow>
          <h2 className="font-display text-2xl font-bold capitalize" style={{ color: 'var(--text)' }}>
            {monthName}
          </h2>
          {hasActiveFilters && (
            <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
              Filtros activos desde estadísticas o búsqueda manual
            </p>
          )}
        </div>
        <NeonButton color="#9B5DE5" onClick={() => openCheckIn()} className="hidden lg:inline-flex">
          + REGISTRAR EMOCIÓN
        </NeonButton>
      </div>

      <SurfaceCard className="p-4">
        <p className="font-pixel text-[7px] mb-3" style={{ color: 'var(--text2)' }}>
          FILTRAR POR FECHA
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            aria-label="Desde"
            className="w-full p-3 rounded-lg text-sm outline-none min-h-[44px]"
            style={{
              backgroundColor: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            aria-label="Hasta"
            className="w-full p-3 rounded-lg text-sm outline-none min-h-[44px]"
            style={{
              backgroundColor: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
      </SurfaceCard>

      {emotionOptions.length > 0 && (
        <SurfaceCard className="p-4">
          <p className="font-pixel text-[7px] mb-3" style={{ color: 'var(--text2)' }}>
            FILTRAR POR EMOCIÓN
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEmotionFilter('')}
              className="font-pixel text-[7px] px-3 py-2 min-h-[44px] press-effect"
              style={{
                color: !emotionFilter ? '#9B5DE5' : 'var(--text2)',
                border: `1px solid ${!emotionFilter ? '#9B5DE580' : 'var(--border)'}`,
                borderRadius: 4,
                backgroundColor: !emotionFilter ? '#9B5DE515' : 'transparent',
              }}
              aria-pressed={!emotionFilter}
            >
              TODAS
            </button>
            {emotionOptions.map((label) => {
              const color = getEmotionNeonColor(label);
              const active = emotionFilter === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setEmotionFilter(active ? '' : label)}
                  className="font-pixel text-[7px] px-3 py-2 min-h-[44px] press-effect"
                  style={{
                    color: active ? color : 'var(--text2)',
                    border: `1px solid ${active ? `${color}80` : 'var(--border)'}`,
                    borderRadius: 4,
                    backgroundColor: active ? `${color}15` : 'transparent',
                  }}
                  aria-pressed={active}
                >
                  {label.toUpperCase()}
                </button>
              );
            })}
          </div>
        </SurfaceCard>
      )}

      {!userEmotions.length ? (
        <RecentEntriesList userEmotions={[]} onOpenCheckIn={() => openCheckIn()} />
      ) : !filteredEmotions.length ? (
        <SurfaceCard className="p-6 text-center">
          <p style={{ color: 'var(--text2)' }}>No hay registros con esos filtros.</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setDateFrom('');
                setDateTo('');
                setEmotionFilter('');
                navigate('/history', { replace: true });
              }}
              className="font-pixel text-[7px] mt-3 press-effect min-h-[44px] px-3"
              style={{ color: '#00F5D4' }}
            >
              LIMPIAR FILTROS
            </button>
          )}
        </SurfaceCard>
      ) : (
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
          <MonthCalendar userEmotions={filteredEmotions} />
          <RecentEntriesList
            userEmotions={filteredEmotions}
            onOpenCheckIn={() => openCheckIn()}
          />
        </div>
      )}

      <CalendarSection />

      <EmotionEntryDetail
        entry={selectedEntry}
        onClose={() => navigate('/history')}
        onDeleted={() => {
          navigate('/history');
          refetch();
        }}
      />
    </div>
  );
}
