import { useEffect, useMemo, useState } from 'react';
import { getEmotionNeonColor } from '../../utils/emotionUtils';
import { getCheckInsForLinking } from '../../utils/journalUtils';
import Eyebrow from '../ui/Eyebrow';
import NeonButton from '../ui/NeonButton';
import SurfaceCard from '../ui/SurfaceCard';

export default function LinkCheckInModal({
  open,
  onClose,
  checkIns,
  entryDate,
  selectedId,
  onConfirm,
}) {
  const [choice, setChoice] = useState(selectedId || '');

  useEffect(() => {
    if (open) {
      setChoice(selectedId || '');
    }
  }, [open, selectedId]);

  const options = useMemo(
    () => getCheckInsForLinking(checkIns, entryDate),
    [checkIns, entryDate],
  );

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm(choice || null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-checkin-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="w-full lg:max-w-md p-6 animate-scale-in"
        style={{
          backgroundColor: 'var(--bg2)',
          borderTop: '1px solid var(--border)',
          borderRadius: '16px 16px 0 0',
        }}
      >
        <Eyebrow color="#9B5DE5">◎ VINCULAR</Eyebrow>
        <h3 id="link-checkin-title" className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          Vincular check-in
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>
          Elegí un registro emocional relacionado con esta entrada.
        </p>

        {!options.length ? (
          <SurfaceCard className="p-4 mb-4">
            <p className="text-sm" style={{ color: 'var(--text2)' }}>
              No hay check-ins del mismo día ni de los últimos 3 días.
            </p>
          </SurfaceCard>
        ) : (
          <div className="flex flex-col gap-2 mb-4 max-h-[320px] overflow-y-auto">
            {options.map((entry) => {
              const label = entry.emotion?.emotion || entry.emotion?.name || 'Emoción';
              const color = getEmotionNeonColor(label);
              const time = new Date(entry.creationDate).toLocaleString('es-AR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });
              const active = choice === entry.id;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setChoice(active ? '' : entry.id)}
                  className="w-full text-left p-4 press-effect min-h-[44px]"
                  style={{
                    backgroundColor: active ? `${color}15` : 'var(--surface)',
                    border: `1px solid ${active ? `${color}80` : 'var(--border)'}`,
                    borderRadius: 8,
                  }}
                  aria-pressed={active}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-pixel text-[8px]" style={{ color }}>
                      {entry.emotion?.emoji} {label}
                    </span>
                    <span className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
                      {time}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <NeonButton color="#9B5DE5" className="w-full" onClick={handleConfirm}>
            {choice ? 'VINCULAR' : 'GUARDAR SIN VÍNCULO'}
          </NeonButton>
          {selectedId && (
            <button
              type="button"
              onClick={() => {
                onConfirm(null);
                onClose();
              }}
              className="font-pixel text-[8px] min-h-[44px] press-effect"
              style={{ color: '#FF1E73' }}
            >
              DESVINCULAR CHECK-IN
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="font-pixel text-[8px] min-h-[44px] press-effect"
            style={{ color: 'var(--text2)' }}
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}
