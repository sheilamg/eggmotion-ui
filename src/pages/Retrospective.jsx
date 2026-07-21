import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserEmotionsCalendar } from '../hooks/useUserEmotionsCalendar';
import { useAuth } from '../auth/AuthContext';
import { getRetrospective } from '../api/insights';
import { getEmotionNeonColor } from '../utils/emotionUtils';
import { buildCalendarYearHeatmapData } from '../utils/statsUtils';
import Eyebrow from '../components/ui/Eyebrow';
import NeonButton from '../components/ui/NeonButton';
import SurfaceCard from '../components/ui/SurfaceCard';
import EggAvatar from '../components/ui/EggAvatar';
import InteractiveHeatmap from '../components/analytics/InteractiveHeatmap';

function StatBlock({ label, value, detail }) {
  return (
    <SurfaceCard className="p-5" borderLeft="#B067F5">
      <p className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
        {label}
      </p>
      <p className="font-display text-xl font-bold mt-2" style={{ color: 'var(--text)' }}>
        {value}
      </p>
      {detail && (
        <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text2)' }}>
          {detail}
        </p>
      )}
    </SurfaceCard>
  );
}

export default function Retrospective() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userEmotions, loading: entriesLoading } = useUserEmotionsCalendar();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const year = new Date().getFullYear();
  const aiEnabled = user?.preferences?.aiAnalysis === true;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getRetrospective(year);
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) {
          setError('No pudimos cargar la retrospectiva. Probá de nuevo más tarde.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [year, aiEnabled]);

  const heatmapData = useMemo(
    () => buildCalendarYearHeatmapData(userEmotions, year),
    [userEmotions, year],
  );

  if (loading || entriesLoading) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--text2)' }}>
        Preparando tu retrospectiva…
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-5">
        <SurfaceCard className="p-8 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>{error}</p>
          <NeonButton color="#B067F5" onClick={() => navigate('/analytics')}>
            VOLVER A ESTADÍSTICAS
          </NeonButton>
        </SurfaceCard>
      </div>
    );
  }

  if (!data?.unlocked) {
    return (
      <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-5">
        <button
          type="button"
          onClick={() => navigate('/analytics')}
          className="font-pixel text-[8px] self-start"
          style={{ color: 'var(--text2)' }}
        >
          ← ESTADÍSTICAS
        </button>
        <SurfaceCard className="p-8 text-center flex flex-col items-center gap-4">
          <EggAvatar size={72} glow="#B067F5" />
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Retrospectiva anual
          </h2>
          <p className="text-sm max-w-md" style={{ color: 'var(--text2)' }}>
            {data?.message ||
              'Se desbloquea con 365+ check-ins en total o un año desde tu registro.'}
          </p>
          <p className="text-xs" style={{ color: 'var(--text2)' }}>
            {data?.currentCheckIns ?? 0} de {data?.minCheckIns || 365} check-ins ·{' '}
            {data?.accountAgeDays ?? 0} días en la app
          </p>
        </SurfaceCard>
      </div>
    );
  }

  const stats = data.stats || {};
  const topEmotions = stats.topEmotions || [];

  return (
    <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-5">
      <button
        type="button"
        onClick={() => navigate('/analytics')}
        className="font-pixel text-[8px] self-start"
        style={{ color: 'var(--text2)' }}
      >
        ← ESTADÍSTICAS
      </button>

      <SurfaceCard className="p-6 text-center" borderLeft="#B067F5">
        <div className="flex flex-col items-center gap-4">
          <EggAvatar size={88} glow="#B067F5" />
          <Eyebrow color="#B067F5">◆ RETROSPECTIVA {year}</Eyebrow>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text)' }}>
            Tu año en emociones — {year}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text2)' }}>
            Hiciste {stats.totalCheckIns || 0} check-ins este año
          </p>
        </div>
      </SurfaceCard>

      {topEmotions.length > 0 && (
        <div className="flex flex-col gap-3">
          <Eyebrow color="#B067F5">TOP 3 EMOCIONES</Eyebrow>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topEmotions.map((item) => (
              <SurfaceCard key={item.label} className="p-4" borderLeft={getEmotionNeonColor(item.label)}>
                <p className="font-display text-lg font-bold" style={{ color: getEmotionNeonColor(item.label) }}>
                  {item.label}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>
                  {item.percent}% · {item.count} registros
                </p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stats.mostIntenseMonth && (
          <StatBlock
            label="MES MÁS INTENSO"
            value={stats.mostIntenseMonth.label}
            detail={`Promedio de intensidad ${stats.mostIntenseMonth.avgIntensity} en ${stats.mostIntenseMonth.count} registros.`}
          />
        )}
        {stats.calmestMonth && (
          <StatBlock
            label="MES MÁS TRANQUILO"
            value={stats.calmestMonth.label}
            detail={`Promedio de intensidad ${stats.calmestMonth.avgIntensity} en ${stats.calmestMonth.count} registros.`}
          />
        )}
      </div>

      {stats.longestStreak?.days > 1 && (
        <StatBlock
          label="RACHA MÁS LARGA"
          value={`${stats.longestStreak.days} días seguidos`}
          detail={
            stats.longestStreak.monthLabel
              ? `Tu mayor racha empezó en ${stats.longestStreak.monthLabel}.`
              : null
          }
        />
      )}

      {data.yearPhrase ? (
        <SurfaceCard className="p-6" borderLeft="#FEE440">
          <Eyebrow color="#FEE440">◆ FRASE DEL AÑO</Eyebrow>
          <p className="font-display text-xl font-semibold mt-3 leading-relaxed" style={{ color: 'var(--text)' }}>
            “{data.yearPhrase}”
          </p>
          <p className="text-xs mt-4" style={{ color: 'var(--text2)' }}>
            Generada con IA a partir de tus registros agregados. No es un diagnóstico médico.
          </p>
        </SurfaceCard>
      ) : (
        <SurfaceCard className="p-5" borderLeft="#FEE440">
          <Eyebrow color="#FEE440">◆ FRASE DEL AÑO</Eyebrow>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text2)' }}>
            {data.message ||
              (aiEnabled
                ? 'Todavía no generamos la frase del año para este período.'
                : 'Activá el análisis con IA en Configuración para generar la frase del año.')}
          </p>
          {!aiEnabled && (
            <NeonButton
              color="#FEE440"
              className="mt-4 w-full sm:w-auto"
              onClick={() => navigate('/settings')}
            >
              IR A CONFIGURACIÓN
            </NeonButton>
          )}
        </SurfaceCard>
      )}

      <InteractiveHeatmap
        entries={[]}
        days={heatmapData.length}
        heatmapData={heatmapData}
        showModeToggle
      />
    </div>
  );
}
