import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserEmotionsCalendar } from '../hooks/useUserEmotionsCalendar';
import { filterEntriesByPeriod, STATS_PERIODS } from '../utils/emotionUtils';
import {
  buildFullEmotionDistribution,
  buildPeriodComparison,
  buildSimpleCorrelations,
  getHeatmapDaysForPeriod,
  getStatsUnlockTier,
} from '../utils/statsUtils';
import { getUniqueEmotionLabels } from '../utils/historyUtils';
import Eyebrow from '../components/ui/Eyebrow';
import NeonButton from '../components/ui/NeonButton';
import SurfaceCard from '../components/ui/SurfaceCard';
import EmotionDistribution from '../components/analytics/EmotionDistribution';
import EmotionEvolutionChart from '../components/analytics/EmotionEvolutionChart';
import InteractiveHeatmap from '../components/analytics/InteractiveHeatmap';
import PeriodComparison from '../components/analytics/PeriodComparison';
import StatsUnlockBanner, { LockedSection } from '../components/analytics/StatsUnlockBanner';

function PeriodSelector({ period, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(STATS_PERIODS).map(([key, config]) => {
        const active = period === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="font-pixel text-[8px] px-4 py-2 min-h-[44px] press-effect"
            style={{
              color: active ? '#9B5DE5' : 'var(--text2)',
              border: `1px solid ${active ? '#9B5DE580' : 'var(--border)'}`,
              borderRadius: 4,
              backgroundColor: active ? '#9B5DE515' : 'transparent',
              cursor: 'pointer',
            }}
            aria-pressed={active}
          >
            {config.label.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export default function Analytics() {
  const navigate = useNavigate();
  const { userEmotions, loading } = useUserEmotionsCalendar();
  const [period, setPeriod] = useState('month');

  const periodConfig = STATS_PERIODS[period];
  const periodEntries = useMemo(
    () => filterEntriesByPeriod(userEmotions, periodConfig.days),
    [userEmotions, periodConfig.days],
  );
  const distribution = useMemo(
    () => buildFullEmotionDistribution(periodEntries),
    [periodEntries],
  );
  const emotionOptions = useMemo(
    () => getUniqueEmotionLabels(periodEntries),
    [periodEntries],
  );
  const comparison = useMemo(
    () => buildPeriodComparison(userEmotions, periodConfig.days),
    [userEmotions, periodConfig.days],
  );
  const patterns = useMemo(
    () => buildSimpleCorrelations(periodEntries),
    [periodEntries],
  );
  const tier = getStatsUnlockTier(periodEntries.length);
  const heatmapDays = getHeatmapDaysForPeriod(period);
  const totalEntries = periodEntries.length;

  if (loading) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--text2)' }}>
        Cargando estadísticas...
      </div>
    );
  }

  if (tier === 'empty') {
    return (
      <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-5">
        <div>
          <Eyebrow color="#9B5DE5">■ 003 — ESTADÍSTICAS</Eyebrow>
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Tu paisaje emocional
          </h2>
        </div>
        <StatsUnlockBanner tier="empty" totalEntries={totalEntries} />
        <SurfaceCard className="p-8 text-center flex flex-col items-center gap-4">
          <p className="text-sm max-w-sm" style={{ color: 'var(--text2)' }}>
            Cada check-in alimenta tu mapa. Empezá con uno hoy — toma menos de un minuto.
          </p>
          <NeonButton color="#9B5DE5" onClick={() => navigate('/home')}>
            REGISTRAR EMOCIÓN
          </NeonButton>
        </SurfaceCard>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-5">
      <div>
        <Eyebrow color="#9B5DE5">■ 003 — ESTADÍSTICAS</Eyebrow>
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Tu paisaje emocional
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>
          {totalEntries} entradas en {periodConfig.label.toLowerCase()}
        </p>
      </div>

      <PeriodSelector period={period} onChange={setPeriod} />

      <StatsUnlockBanner tier={tier} totalEntries={totalEntries} patterns={patterns} />

      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <EmotionDistribution distribution={distribution} />
        <InteractiveHeatmap
          entries={periodEntries}
          days={heatmapDays}
          showModeToggle
        />
      </div>

      {tier === 'full' ? (
        <>
          <EmotionEvolutionChart
            entries={periodEntries}
            days={periodConfig.days}
            emotionOptions={emotionOptions}
          />
          <PeriodComparison comparison={comparison} periodLabel={periodConfig.label} />
        </>
      ) : (
        <LockedSection
          message="Evolución temporal y comparativas se desbloquean con más registros"
          minEntries={7}
          currentEntries={totalEntries}
        />
      )}
    </div>
  );
}
