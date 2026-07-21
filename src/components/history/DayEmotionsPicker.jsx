import { getEmotionNeonColor } from '../../utils/emotionUtils';
import Eyebrow from '../ui/Eyebrow';
import EggAvatar from '../ui/EggAvatar';
import SurfaceCard from '../ui/SurfaceCard';

export default function DayEmotionsPicker({ date, entries, onSelect, onClose }) {
  if (!entries?.length) return null;

  const formattedDate = new Date(date).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full lg:max-w-md p-6 animate-scale-in max-h-[85vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg2)',
          borderTop: '1px solid var(--border)',
          borderRadius: '16px 16px 0 0',
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <Eyebrow color="#00F5D4">DÍA</Eyebrow>
            <h3 className="font-display text-xl font-bold capitalize" style={{ color: 'var(--text)' }}>
              {formattedDate}
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
              {entries.length} {entries.length === 1 ? 'registro' : 'registros'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-pixel text-[8px] px-2 py-1"
            style={{ color: 'var(--text2)' }}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const label = entry.emotion?.emotion || entry.emotion?.name || 'Emoción';
            const color = getEmotionNeonColor(label);
            const time = new Date(entry.creationDate).toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <SurfaceCard
                key={entry.id}
                className="flex items-center gap-4 p-4 press-effect cursor-pointer"
                borderLeft={color}
                onClick={() => onSelect(entry)}
              >
                <EggAvatar size={40} glow={color} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-pixel text-[9px]" style={{ color }}>
                      {label}
                    </span>
                    <span className="font-pixel text-[7px] shrink-0" style={{ color: 'var(--text2)' }}>
                      {time}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-xs mt-2 truncate" style={{ color: 'var(--text2)' }}>
                      {entry.note}
                    </p>
                  )}
                </div>
              </SurfaceCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
