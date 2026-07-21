import Eyebrow from '../ui/Eyebrow';
import SurfaceCard from '../ui/SurfaceCard';
import { getEmotionNeonColor } from '../../utils/emotionUtils';

function DeltaBadge({ value, suffix = '' }) {
  if (value === 0) {
    return (
      <span className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
        = 0{suffix}
      </span>
    );
  }

  const positive = value > 0;
  return (
    <span
      className="font-pixel text-[7px]"
      style={{ color: positive ? '#39FF14' : '#FF1E73' }}
    >
      {positive ? '+' : ''}
      {value}
      {suffix}
    </span>
  );
}

export default function PeriodComparison({ comparison, periodLabel }) {
  const { current, previous, deltaCount, deltaIntensity, emotionChanged } = comparison;

  if (!current.count && !previous.count) {
    return null;
  }

  return (
    <SurfaceCard className="p-5" borderLeft="#FEE440">
      <Eyebrow color="#FEE440">⇄ COMPARATIVA</Eyebrow>
      <p className="text-xs mt-2 mb-4" style={{ color: 'var(--text2)' }}>
        {periodLabel} actual vs anterior
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="font-pixel text-[7px] mb-1" style={{ color: 'var(--text2)' }}>
            REGISTROS
          </p>
          <p className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
            {current.count}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
            antes: {previous.count}
          </p>
          <div className="mt-2">
            <DeltaBadge value={deltaCount} />
          </div>
        </div>

        <div>
          <p className="font-pixel text-[7px] mb-1" style={{ color: 'var(--text2)' }}>
            INTENSIDAD PROM.
          </p>
          <p className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
            {current.avgIntensity || '—'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
            antes: {previous.avgIntensity || '—'}
          </p>
          <div className="mt-2">
            <DeltaBadge value={deltaIntensity} />
          </div>
        </div>

        <div>
          <p className="font-pixel text-[7px] mb-1" style={{ color: 'var(--text2)' }}>
            EMOCIÓN TOP
          </p>
          {current.topEmotion ? (
            <>
              <p
                className="font-display text-lg font-bold"
                style={{ color: getEmotionNeonColor(current.topEmotion) }}
              >
                {current.topEmotion}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
                antes: {previous.topEmotion || '—'}
              </p>
              {emotionChanged && previous.topEmotion && (
                <p className="font-pixel text-[7px] mt-2" style={{ color: '#00F5D4' }}>
                  CAMBIÓ vs período anterior
                </p>
              )}
            </>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text2)' }}>
              Sin datos
            </p>
          )}
        </div>
      </div>
    </SurfaceCard>
  );
}
