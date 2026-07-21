import { useNavigate } from 'react-router-dom';
import Eyebrow from '../ui/Eyebrow';
import SurfaceCard from '../ui/SurfaceCard';
import { buildHistoryUrl } from '../../utils/statsUtils';

export default function EmotionDistribution({ distribution }) {
  const navigate = useNavigate();
  const maxCount = Math.max(...distribution.map((item) => item.count), 1);

  if (!distribution.length) {
    return (
      <SurfaceCard className="p-5">
        <Eyebrow color="#F15BB5">▣ DISTRIBUCIÓN</Eyebrow>
        <p className="text-sm mt-3" style={{ color: 'var(--text2)' }}>
          Registrá emociones para ver la distribución.
        </p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="p-5">
      <Eyebrow color="#F15BB5">▣ DISTRIBUCIÓN</Eyebrow>
      <p className="text-xs mt-2 mb-4" style={{ color: 'var(--text2)' }}>
        Tocá una emoción para verla en el historial
      </p>

      <div className="flex flex-col gap-3">
        {distribution.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(buildHistoryUrl({ emotion: item.label }))}
            className="w-full text-left press-effect min-h-[44px]"
            aria-label={`Ver historial de ${item.label}`}
          >
            <div className="flex items-center justify-between mb-1 gap-2">
              <span className="font-pixel text-[8px]" style={{ color: item.color }}>
                {item.label}
              </span>
              <span className="font-pixel text-[7px] shrink-0" style={{ color: 'var(--text2)' }}>
                {item.count}× · {item.percent}%
              </span>
            </div>
            <div
              style={{
                height: 10,
                backgroundColor: 'var(--surface2)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(item.count / maxCount) * 100}%`,
                  backgroundColor: item.color,
                  borderRadius: 4,
                  boxShadow: `0 0 8px ${item.color}80`,
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </SurfaceCard>
  );
}
