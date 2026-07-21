import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Eyebrow from '../ui/Eyebrow';
import SurfaceCard from '../ui/SurfaceCard';
import { getEmotionNeonColor } from '../../utils/emotionUtils';
import {
  buildEnhancedHeatmapData,
  buildHistoryUrl,
  emotionHeatColor,
  intensityHeatColor,
} from '../../utils/statsUtils';

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function formatDayLabel(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function InteractiveHeatmap({
  entries,
  days,
  showModeToggle = false,
  heatmapData,
}) {
  const navigate = useNavigate();
  const heatmap = heatmapData || buildEnhancedHeatmapData(entries, days);
  const weekCount = Math.ceil(days / 7);
  const weeks = Array.from({ length: weekCount }, (_, w) => heatmap.slice(w * 7, w * 7 + 7));
  const [mode, setMode] = useState('emotion');
  const [tooltip, setTooltip] = useState(null);
  const lastTapRef = useRef({ time: 0, date: null });

  const getCellFill = (day) => {
    if (!day.count) return null;
    if (mode === 'intensity') {
      return intensityHeatColor(day.avgIntensity);
    }
    return emotionHeatColor(day.dominantLabel, day.avgIntensity);
  };

  const handleCellClick = (day) => {
    const now = Date.now();
    if (lastTapRef.current.date === day.date && now - lastTapRef.current.time < 450) {
      navigate(buildHistoryUrl({ from: day.date, to: day.date }));
      lastTapRef.current = { time: 0, date: null };
      setTooltip(null);
      return;
    }

    lastTapRef.current = { time: now, date: day.date };
    setTooltip(day);
  };

  return (
    <SurfaceCard className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <Eyebrow color="#00F5D4">◎ MAPA EMOCIONAL</Eyebrow>
        {showModeToggle && (
          <div className="flex gap-2">
            {[
              { key: 'emotion', label: 'EMOCIÓN' },
              { key: 'intensity', label: 'INTENSIDAD' },
            ].map(({ key, label }) => {
              const active = mode === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key)}
                  className="font-pixel text-[7px] px-3 py-2 min-h-[44px] press-effect"
                  style={{
                    color: active ? '#00F5D4' : 'var(--text2)',
                    border: `1px solid ${active ? '#00F5D480' : 'var(--border)'}`,
                    borderRadius: 4,
                    backgroundColor: active ? '#00F5D415' : 'transparent',
                  }}
                  aria-pressed={active}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs mb-3" style={{ color: 'var(--text2)' }}>
        Tap para detalle · doble tap para ir al historial del día
      </p>

      <div className="overflow-x-auto">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `16px repeat(${weekCount}, 1fr)`,
            gap: 3,
            minWidth: Math.max(280, weekCount * 14),
          }}
        >
          <div className="flex flex-col gap-[3px]">
            <div style={{ height: 14 }} />
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="font-pixel flex items-center"
                style={{ height: 14, fontSize: 6, color: 'var(--text2)' }}
              >
                {d}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              <div style={{ height: 14 }} />
              {week.map((day) => {
                const fill = getCellFill(day);
                const color = day.dominantLabel
                  ? getEmotionNeonColor(day.dominantLabel)
                  : null;
                const active = tooltip?.date === day.date;

                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => handleCellClick(day)}
                    className="press-effect"
                    style={{
                      width: '100%',
                      height: 14,
                      borderRadius: 3,
                      padding: 0,
                      border: active ? '1px solid #00F5D4' : '1px solid transparent',
                      backgroundColor: fill || 'var(--surface2)',
                      boxShadow: color && day.count ? `0 0 4px ${color}40` : 'none',
                      cursor: 'pointer',
                    }}
                    aria-label={
                      day.count
                        ? `${day.date}: ${day.count} registros`
                        : `${day.date}: sin registros`
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {tooltip?.count > 0 && (
        <div
          className="mt-4 p-4 rounded-lg"
          style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)' }}
        >
          <p className="font-display text-sm font-semibold capitalize" style={{ color: 'var(--text)' }}>
            {formatDayLabel(tooltip.date)}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
            {tooltip.count} registro{tooltip.count !== 1 ? 's' : ''}
            {tooltip.dominantLabel ? ` · dominante: ${tooltip.dominantLabel}` : ''}
            {tooltip.avgIntensity ? ` · intensidad prom. ${tooltip.avgIntensity.toFixed(1)}` : ''}
          </p>
          {tooltip.entry?.note && (
            <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text2)' }}>
              &ldquo;{tooltip.entry.note}&rdquo;
            </p>
          )}
          <button
            type="button"
            onClick={() => navigate(buildHistoryUrl({ from: tooltip.date, to: tooltip.date }))}
            className="font-pixel text-[7px] mt-3 min-h-[44px] press-effect"
            style={{ color: '#00F5D4' }}
          >
            VER EN HISTORIAL
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <span className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
          {mode === 'intensity' ? 'Menos' : 'Sin registro'}
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                backgroundColor:
                  mode === 'intensity'
                    ? intensityHeatColor(level)
                    : emotionHeatColor('calm', level),
              }}
            />
          ))}
        </div>
        <span className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
          Más
        </span>
      </div>
    </SurfaceCard>
  );
}
