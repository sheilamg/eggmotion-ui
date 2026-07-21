import { useNavigate } from 'react-router-dom';
import { getEmotionNeonColor } from '../../utils/emotionUtils';
import { groupEntriesByDay } from '../../utils/historyUtils';
import Eyebrow from '../ui/Eyebrow';
import SurfaceCard from '../ui/SurfaceCard';
import EggAvatar from '../ui/EggAvatar';
import NeonButton from '../ui/NeonButton';

export default function RecentEntriesList({ userEmotions, onOpenCheckIn }) {
  const navigate = useNavigate();

  const sorted = [...(userEmotions || [])].sort(
    (a, b) => new Date(b.creationDate) - new Date(a.creationDate),
  );
  const grouped = groupEntriesByDay(sorted);

  if (!sorted.length) {
    return (
      <SurfaceCard className="p-6 text-center flex flex-col items-center gap-4">
        <p style={{ color: 'var(--text2)' }}>
          Todavía no registraste ninguna emoción
        </p>
        <NeonButton color="#9B5DE5" onClick={onOpenCheckIn}>
          REGISTRAR EMOCIÓN
        </NeonButton>
      </SurfaceCard>
    );
  }

  return (
    <div>
      <Eyebrow color="#F15BB5">◎ HISTORIAL</Eyebrow>
      <div className="flex flex-col gap-5 mt-3">
        {grouped.map(({ dayKey, label, entries }) => (
          <div key={dayKey}>
            <p
              className="font-pixel text-[8px] mb-3 capitalize"
              style={{ color: 'var(--text2)' }}
            >
              {label}
            </p>
            <div className="flex flex-col gap-3">
              {entries.map((entry) => {
                const emotionLabel = entry.emotion?.emotion || entry.emotion?.name || 'Emoción';
                const color = getEmotionNeonColor(emotionLabel);
                const time = new Date(entry.creationDate).toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <SurfaceCard
                    key={entry.id}
                    className="flex items-center gap-4 p-4 press-effect cursor-pointer min-h-[44px]"
                    borderLeft={color}
                    onClick={() => navigate(`/history/${entry.id}`)}
                  >
                    <EggAvatar size={40} glow={color} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-pixel text-[9px]" style={{ color }}>
                          {emotionLabel}
                        </span>
                        <span
                          className="font-pixel text-[7px] shrink-0"
                          style={{ color: 'var(--text2)' }}
                        >
                          {time}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-1.5" aria-hidden="true">
                        {Array.from({ length: entry.intensity || 0 }).map((_, n) => (
                          <div
                            key={n}
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 2,
                              backgroundColor: color,
                              opacity: 0.6 + n * 0.08,
                              boxShadow: `0 0 4px ${color}60`,
                            }}
                          />
                        ))}
                      </div>
                      {entry.note && (
                        <p className="text-xs mt-2 truncate" style={{ color: 'var(--text2)' }}>
                          {entry.note}
                        </p>
                      )}
                      {entry.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {entry.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="font-pixel text-[6px] px-2 py-0.5"
                              style={{
                                border: '1px solid #00F5D480',
                                borderRadius: 4,
                                color: '#00F5D4',
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                          {entry.tags.length > 3 && (
                            <span
                              className="font-pixel text-[6px] px-1"
                              style={{ color: 'var(--text2)' }}
                            >
                              +{entry.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </SurfaceCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
