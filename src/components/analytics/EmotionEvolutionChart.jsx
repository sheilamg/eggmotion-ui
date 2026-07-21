import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Eyebrow from '../ui/Eyebrow';
import SurfaceCard from '../ui/SurfaceCard';
import { getEmotionNeonColor } from '../../utils/emotionUtils';
import { buildEvolutionSeries, buildHistoryUrl } from '../../utils/statsUtils';

const CHART_HEIGHT = 160;
const CHART_PADDING = { top: 16, right: 12, bottom: 28, left: 28 };

function formatShortDate(iso) {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

export default function EmotionEvolutionChart({ entries, days, emotionOptions }) {
  const navigate = useNavigate();
  const [emotionFilter, setEmotionFilter] = useState('');
  const [activePoint, setActivePoint] = useState(null);

  const series = useMemo(
    () => buildEvolutionSeries(entries, days, emotionFilter || null),
    [entries, days, emotionFilter],
  );

  const dataPoints = series.filter((point) => point.hasData && point.value != null);

  const chart = useMemo(() => {
    const width = Math.max(320, days * 12);
    const innerWidth = width - CHART_PADDING.left - CHART_PADDING.right;
    const innerHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

    if (!dataPoints.length) {
      return { width, points: [], path: '', labels: [] };
    }

    const xStep = innerWidth / Math.max(series.length - 1, 1);
    const points = series.map((point, index) => {
      const x = CHART_PADDING.left + index * xStep;
      const y = point.value
        ? CHART_PADDING.top + innerHeight - ((point.value - 1) / 4) * innerHeight
        : null;
      return { ...point, x, y };
    });

    const visiblePoints = points.filter((point) => point.y != null);
    const path = visiblePoints
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    const labelIndexes = [0, Math.floor(series.length / 2), series.length - 1];

    return {
      width,
      points,
      path,
      labels: labelIndexes.map((index) => ({
        x: points[index]?.x,
        text: formatShortDate(series[index].date),
      })),
    };
  }, [series, dataPoints.length, days]);

  const lineColor = emotionFilter
    ? getEmotionNeonColor(emotionFilter)
    : '#00F5D4';

  return (
    <SurfaceCard className="p-5">
      <Eyebrow color="#00F5D4">◠ EVOLUCIÓN</Eyebrow>
      <p className="text-xs mt-2 mb-3" style={{ color: 'var(--text2)' }}>
        Intensidad promedio por día
      </p>

      {emotionOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => setEmotionFilter('')}
            className="font-pixel text-[7px] px-3 py-2 min-h-[44px] press-effect"
            style={{
              color: !emotionFilter ? '#00F5D4' : 'var(--text2)',
              border: `1px solid ${!emotionFilter ? '#00F5D480' : 'var(--border)'}`,
              borderRadius: 4,
              backgroundColor: !emotionFilter ? '#00F5D415' : 'transparent',
            }}
            aria-pressed={!emotionFilter}
          >
            TODAS
          </button>
          {emotionOptions.map((label) => {
            const color = getEmotionNeonColor(label);
            const active = emotionFilter === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setEmotionFilter(active ? '' : label)}
                className="font-pixel text-[7px] px-3 py-2 min-h-[44px] press-effect"
                style={{
                  color: active ? color : 'var(--text2)',
                  border: `1px solid ${active ? `${color}80` : 'var(--border)'}`,
                  borderRadius: 4,
                  backgroundColor: active ? `${color}15` : 'transparent',
                }}
                aria-pressed={active}
              >
                {label.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}

      {!dataPoints.length ? (
        <p className="text-sm py-8 text-center" style={{ color: 'var(--text2)' }}>
          {emotionFilter
            ? `No hay registros de "${emotionFilter}" en este período.`
            : 'Todavía no hay datos para graficar.'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${chart.width} ${CHART_HEIGHT}`}
            className="w-full"
            style={{ minWidth: chart.width }}
            role="img"
            aria-label="Gráfico de evolución emocional"
          >
            {[1, 2, 3, 4, 5].map((level) => {
              const y =
                CHART_PADDING.top +
                (CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom) -
                ((level - 1) / 4) *
                  (CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom);
              return (
                <g key={level}>
                  <line
                    x1={CHART_PADDING.left}
                    x2={chart.width - CHART_PADDING.right}
                    y1={y}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth="1"
                  />
                  <text
                    x={8}
                    y={y + 4}
                    fill="var(--text2)"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {level}
                  </text>
                </g>
              );
            })}

            {chart.path && (
              <path
                d={chart.path}
                fill="none"
                stroke={lineColor}
                strokeWidth="2"
                strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 6px ${lineColor}80)` }}
              />
            )}

            {chart.points.map((point) =>
              point.y != null ? (
                <circle
                  key={point.date}
                  cx={point.x}
                  cy={point.y}
                  r={activePoint?.date === point.date ? 6 : 4}
                  fill={lineColor}
                  stroke="var(--bg2)"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => {
                    setActivePoint(point);
                    if (point.primaryEntry?.id) {
                      navigate(buildHistoryUrl({ entryId: point.primaryEntry.id }));
                    }
                  }}
                  onMouseEnter={() => setActivePoint(point)}
                  onMouseLeave={() => setActivePoint(null)}
                />
              ) : null,
            )}

            {chart.labels.map((label) => (
              <text
                key={label.text + label.x}
                x={label.x}
                y={CHART_HEIGHT - 6}
                fill="var(--text2)"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {label.text}
              </text>
            ))}
          </svg>
        </div>
      )}

      {activePoint && (
        <div
          className="mt-3 p-3 rounded-lg text-sm"
          style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)' }}
        >
          <p style={{ color: 'var(--text)' }}>
            {formatShortDate(activePoint.date)} · intensidad {activePoint.value?.toFixed(1)}
          </p>
          {activePoint.dominantLabel && (
            <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
              {activePoint.dominantLabel}
              {activePoint.entries.length > 1
                ? ` · ${activePoint.entries.length} registros`
                : ''}
            </p>
          )}
          {activePoint.primaryEntry?.note && (
            <p className="text-xs mt-1 truncate" style={{ color: 'var(--text2)' }}>
              {activePoint.primaryEntry.note}
            </p>
          )}
        </div>
      )}
    </SurfaceCard>
  );
}
