import { useNavigate } from 'react-router-dom';
import Eyebrow from '../ui/Eyebrow';
import NeonButton from '../ui/NeonButton';
import SurfaceCard from '../ui/SurfaceCard';
import AiPatternCard from './AiPatternCard';
import { formatWeekRange } from '../../utils/insightUtils';

const MIN_TOTAL_PATTERNS = 30;
const MIN_WEEKLY_ENTRIES = 7;

function LockedCard({ title, message, progressLine, eyebrow = '◆ PATRONES E IA' }) {
  return (
    <SurfaceCard className="p-5" borderLeft="#FEE440">
      <Eyebrow color="#FEE440">{eyebrow}</Eyebrow>
      <p className="font-display text-base font-semibold mt-2 mb-2" style={{ color: 'var(--text)' }}>
        {title}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
        {message}
      </p>
      {progressLine && (
        <p className="text-xs mt-3" style={{ color: 'var(--text2)' }}>
          {progressLine}
        </p>
      )}
    </SurfaceCard>
  );
}

function ErrorBanner({ message }) {
  return (
    <SurfaceCard className="p-4" borderLeft="#FF1E73">
      <p className="text-sm" style={{ color: 'var(--text2)' }}>
        {message}
      </p>
    </SurfaceCard>
  );
}

export default function AiInsightsSection({
  patternsData,
  patternsLoading,
  patternsError,
  weeklyData,
  weeklyLoading,
  weeklyError,
  aiEnabled,
}) {
  const navigate = useNavigate();

  const insightsLoading =
    (patternsLoading || weeklyLoading) && !patternsData && !weeklyData;

  if (insightsLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Eyebrow color="#FEE440">◆ INSIGHTS IA</Eyebrow>
        <SurfaceCard className="p-5" borderLeft="#FEE440">
          <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>
            Analizando tus registros de la semana...
          </p>
        </SurfaceCard>
      </div>
    );
  }

  if (!aiEnabled) {
    return (
      <div className="flex flex-col gap-3">
        <Eyebrow color="#FEE440">◆ INSIGHTS IA</Eyebrow>
        <SurfaceCard className="p-5" borderLeft="#FEE440">
          <p className="font-display text-base font-semibold mt-2 mb-2" style={{ color: 'var(--text)' }}>
            Insights personalizados
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text2)' }}>
            {patternsData?.message ||
              weeklyData?.message ||
              'Activá el análisis con IA en Configuración para recibir observaciones sobre tus patrones emocionales.'}
          </p>
          <NeonButton color="#FEE440" className="w-full sm:w-auto" onClick={() => navigate('/settings')}>
            IR A CONFIGURACIÓN
          </NeonButton>
        </SurfaceCard>
      </div>
    );
  }

  const periodStart = patternsData?.periodStart || weeklyData?.periodStart;
  const periodEnd = patternsData?.periodEnd || weeklyData?.periodEnd;
  const weekRange = formatWeekRange(periodStart, periodEnd);
  const totalEntries =
    patternsData?.currentTotalEntries ?? weeklyData?.currentTotalEntries ?? 0;
  const weeklyEntries =
    patternsData?.currentWeeklyEntries ?? weeklyData?.currentEntries ?? 0;
  const patternsUnlocked = patternsData?.unlocked === true;
  const weeklyUnlocked = weeklyData?.unlocked === true;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Eyebrow color="#FEE440">◆ INSIGHTS IA</Eyebrow>
        <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>
          Insight semanal y patrones avanzados a partir de tus check-ins.
        </p>
      </div>

      {weeklyError && <ErrorBanner message={weeklyError} />}

      {!weeklyUnlocked && weeklyData && (
        <LockedCard
          eyebrow="◆ INSIGHT SEMANAL"
          title="Tu insight de la semana"
          message={
            weeklyData.message ||
            `Registrá al menos ${MIN_WEEKLY_ENTRIES} check-ins esta semana para desbloquear un insight generado por IA.`
          }
          progressLine={
            weekRange
              ? `${weeklyEntries} de ${MIN_WEEKLY_ENTRIES} ${weekRange}`
              : `${weeklyEntries} de ${MIN_WEEKLY_ENTRIES} check-ins esta semana`
          }
        />
      )}

      {weeklyUnlocked && weeklyData?.insight && (
        <div className="flex flex-col gap-3">
          <p className="font-pixel text-[8px]" style={{ color: 'var(--text2)' }}>
            INSIGHT SEMANAL
            {weekRange ? ` · ${weekRange}` : ''}
          </p>
          {(weeklyData.summary || weeklyData.insight?.summary) && (
            <SurfaceCard className="p-5" borderLeft="#FEE440">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                {weeklyData.summary || weeklyData.insight.summary}
              </p>
            </SurfaceCard>
          )}
          <AiPatternCard insight={weeklyData.insight} variant="weekly" />
        </div>
      )}

      <div className="flex flex-col gap-3 pt-1">
        <Eyebrow color="#FEE440">◆ PATRONES E IA</Eyebrow>
        {patternsError && <ErrorBanner message={patternsError} />}

        {!patternsUnlocked && !patternsError && totalEntries < MIN_TOTAL_PATTERNS && (
          <LockedCard
            title="Patrones avanzados"
            message={
              patternsData?.message ||
              `Necesitás al menos ${MIN_TOTAL_PATTERNS} check-ins en total para desbloquear insights de IA avanzados.`
            }
            progressLine={`${totalEntries} de ${MIN_TOTAL_PATTERNS} check-ins en total`}
          />
        )}

        {!patternsUnlocked &&
          !patternsError &&
          totalEntries >= MIN_TOTAL_PATTERNS &&
          weeklyEntries < MIN_WEEKLY_ENTRIES && (
            <LockedCard
              title="Patrones de esta semana"
              message={
                patternsData?.message ||
                `Registrá al menos ${MIN_WEEKLY_ENTRIES} check-ins esta semana para generar patrones.`
              }
              progressLine={
                weekRange
                  ? `${weeklyEntries} de ${MIN_WEEKLY_ENTRIES} ${weekRange}`
                  : `${weeklyEntries} de ${MIN_WEEKLY_ENTRIES} check-ins esta semana`
              }
            />
          )}

        {patternsUnlocked && (
          <>
            {patternsData?.summary && (
              <SurfaceCard className="p-5" borderLeft="#FEE440">
                <p className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
                  RESUMEN SEMANAL
                </p>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text)' }}>
                  {patternsData.summary}
                </p>
                {weekRange && (
                  <p className="text-xs mt-3" style={{ color: 'var(--text2)' }}>
                    Semana {weekRange}
                  </p>
                )}
              </SurfaceCard>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(patternsData?.insights || []).map((insight) => (
                <AiPatternCard key={insight.id || insight.title} insight={insight} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
