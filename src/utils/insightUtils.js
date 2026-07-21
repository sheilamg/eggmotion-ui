export const INSIGHT_TYPE_LABELS = {
  temporal: 'Patrón temporal',
  contextual: 'Por contexto',
  intensity: 'Intensidad',
  nlp: 'En tus palabras',
  sequential: 'Secuencia',
  general: 'Observación',
};

export const INSIGHT_TYPE_ICONS = {
  temporal: '◷',
  contextual: '◈',
  intensity: '⚡',
  nlp: '✎',
  sequential: '→',
  general: '◆',
};

export function formatWeekRange(periodStart, periodEnd) {
  if (!periodStart || !periodEnd) return '';

  const start = new Date(periodStart);
  const end = new Date(periodEnd);
  const startDay = start
    .toLocaleDateString('es-AR', { weekday: 'short' })
    .replace('.', '');
  const endDay = end
    .toLocaleDateString('es-AR', { weekday: 'short' })
    .replace('.', '');
  const startDate = start.getDate();
  const endDate = end.getDate();
  const endMonth = end
    .toLocaleDateString('es-AR', { month: 'short' })
    .replace('.', '');

  return `entre ${startDay} ${startDate} y ${endDay} ${endDate} ${endMonth}`;
}

export function buildInsightHistoryUrl(insight) {
  const filters = insight?.filters || {};
  const relatedIds = insight?.relatedEntryIds || [];

  if (relatedIds.length === 1) {
    return `/history/${relatedIds[0]}`;
  }

  const params = new URLSearchParams();
  if (filters.emotion) params.set('emotion', filters.emotion);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);

  const query = params.toString();
  return query ? `/history?${query}` : '/history';
}
