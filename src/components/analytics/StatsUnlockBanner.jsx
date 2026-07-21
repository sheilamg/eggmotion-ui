import Eyebrow from '../ui/Eyebrow';
import SurfaceCard from '../ui/SurfaceCard';
import EggAvatar from '../ui/EggAvatar';

const TIER_COPY = {
  empty: {
    title: 'Tu espejo emocional está esperando datos',
    detail: 'Registrá al menos 3 emociones para empezar a ver patrones básicos.',
    next: 'Con 7 registros se desbloquean correlaciones simples.',
  },
  basic: {
    title: 'Estás construyendo tu mapa',
    detail: 'Ya podés ver distribución y actividad. Seguí registrando para más profundidad.',
    next: 'Faltan pocos registros para correlaciones y comparativas completas.',
  },
  full: {
    title: 'Tu paisaje emocional toma forma',
    detail: 'Tenés suficientes datos para explorar tendencias y comparar períodos.',
    next: 'Los insights con IA llegarán en una fase posterior.',
  },
};

export default function StatsUnlockBanner({ tier, totalEntries, patterns = [] }) {
  const copy = TIER_COPY[tier] || TIER_COPY.empty;

  return (
    <div className="flex flex-col gap-5">
      <SurfaceCard className="p-5" borderLeft="#9B5DE5">
        <Eyebrow color="#9B5DE5">◆ ESTADO</Eyebrow>
        <p className="font-display text-base font-semibold mt-2 mb-2" style={{ color: 'var(--text)' }}>
          {copy.title}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
          {copy.detail}
        </p>
        <p className="text-xs mt-3" style={{ color: 'var(--text2)' }}>
          {totalEntries} registros · {copy.next}
        </p>
      </SurfaceCard>

      {tier === 'full' && patterns.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {patterns.map((pattern) => (
            <SurfaceCard key={pattern.title} className="p-5" borderLeft="#00F5D4">
              <Eyebrow color="#00F5D4">◆ PATRÓN</Eyebrow>
              <p className="font-display text-base font-semibold mt-2 mb-2" style={{ color: 'var(--text)' }}>
                {pattern.title}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
                {pattern.detail}
              </p>
            </SurfaceCard>
          ))}
        </div>
      )}

      {tier !== 'full' && (
        <div className="flex flex-col items-center gap-3 py-2 opacity-80">
          <EggAvatar size={56} />
          <p className="font-pixel text-[8px] text-center" style={{ color: 'var(--text2)' }}>
            {tier === 'empty'
              ? 'registrá 3 check-ins para desbloquear stats básicas'
              : 'llegá a 7 registros para correlaciones y comparativas'}
          </p>
        </div>
      )}
    </div>
  );
}

export function LockedSection({ message, minEntries = 7, currentEntries }) {
  return (
    <SurfaceCard className="p-5 text-center">
      <p className="font-display text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>
        {message}
      </p>
      <p className="text-sm" style={{ color: 'var(--text2)' }}>
        Tenés {currentEntries} de {minEntries} registros necesarios en este período.
      </p>
    </SurfaceCard>
  );
}
