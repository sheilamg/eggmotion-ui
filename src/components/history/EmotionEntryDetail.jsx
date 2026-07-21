import { useState } from 'react';
import { getEmotionNeonColor, getIntensityOptions } from '../../utils/emotionUtils';
import Eyebrow from '../ui/Eyebrow';
import NeonButton from '../ui/NeonButton';
import EggAvatar from '../ui/EggAvatar';
import { useCheckIn } from '../../context/CheckInContext';
import { useUserEmotions } from '../../hooks/useUserEmotions';

export default function EmotionEntryDetail({ entry, onClose, onDeleted }) {
  const { openCheckInForEdit, notifySaved } = useCheckIn();
  const { removeEmotion, saving } = useUserEmotions();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  if (!entry) return null;

  const label = entry.emotion?.emotion || entry.emotion?.name || 'Emoción';
  const color = getEmotionNeonColor(label);
  const intensityLabel = getIntensityOptions().find((opt) => opt.value === entry.intensity)?.label;
  const date = new Date(entry.creationDate).toLocaleString('es-AR');

  const handleDelete = async () => {
    try {
      setError('');
      await removeEmotion(entry.id);
      notifySaved();
      onDeleted?.();
      onClose();
    } catch {
      setError('No pudimos eliminar este registro.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="emotion-detail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <EggAvatar size={56} glow={color} />
            <div>
              <Eyebrow color={color}>DETALLE</Eyebrow>
              <h3 id="emotion-detail-title" className="font-display text-2xl font-bold" style={{ color }}>{label}</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>{date}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-pixel text-[8px] px-3 py-2 min-h-[44px] min-w-[44px]"
            style={{ color: 'var(--text2)' }}
            aria-label="Cerrar detalle"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="font-pixel text-[7px] mb-2" style={{ color: 'var(--text2)' }}>INTENSIDAD</p>
            <p className="font-display font-semibold" style={{ color }}>{intensityLabel}</p>
          </div>

          {entry.note && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="font-pixel text-[7px] mb-2" style={{ color: 'var(--text2)' }}>NOTAS</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{entry.note}</p>
            </div>
          )}

          {entry.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-pixel text-[7px] px-2 py-1"
                  style={{
                    border: '1px solid #00F5D480',
                    borderRadius: 4,
                    color: '#00F5D4',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm mt-4" style={{ color: '#FF1E73' }}>{error}</p>}

        {!confirmDelete ? (
          <div className="flex gap-3 mt-6">
            <NeonButton
              color="#9B5DE5"
              className="flex-1"
              onClick={() => {
                onClose();
                openCheckInForEdit(entry);
              }}
            >
              EDITAR
            </NeonButton>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex-1 font-pixel text-[8px] py-3 press-effect"
              style={{
                color: '#FF1E73',
                border: '1px solid #FF1E7340',
                borderRadius: 4,
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              ELIMINAR
            </button>
          </div>
        ) : (
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FF1E7310', border: '1px solid #FF1E7340' }}>
            <p className="text-sm mb-4" style={{ color: 'var(--text)' }}>
              ¿Seguro que querés eliminar este registro? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <NeonButton color="#FF1E73" className="flex-1" disabled={saving} onClick={handleDelete}>
                {saving ? 'ELIMINANDO...' : 'ELIMINAR'}
              </NeonButton>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 font-pixel text-[8px] py-3"
                style={{ color: 'var(--text2)' }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
