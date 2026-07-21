export function getDayKey(dateValue) {
  return new Date(dateValue).toISOString().split('T')[0];
}

export function formatDayLabel(dayKey) {
  const date = new Date(`${dayKey}T12:00:00`);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (getDayKey(today) === dayKey) return 'Hoy';
  if (getDayKey(yesterday) === dayKey) return 'Ayer';

  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function groupEntriesByDay(entries) {
  const groups = new Map();

  entries.forEach((entry) => {
    const key = getDayKey(entry.creationDate);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  });

  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([dayKey, dayEntries]) => ({
      dayKey,
      label: formatDayLabel(dayKey),
      entries: dayEntries.sort(
        (a, b) => new Date(b.creationDate) - new Date(a.creationDate),
      ),
    }));
}

export function filterEntriesByDateRange(entries, from, to) {
  if (!from && !to) return entries;

  return entries.filter((entry) => {
    const dayKey = getDayKey(entry.creationDate);
    if (from && dayKey < from) return false;
    if (to && dayKey > to) return false;
    return true;
  });
}

export function filterEntriesByEmotion(entries, emotionKey) {
  if (!emotionKey) return entries;

  const normalized = emotionKey.toLowerCase();
  return entries.filter((entry) => {
    const label = entry.emotion?.emotion || entry.emotion?.name || '';
    return label.toLowerCase() === normalized;
  });
}

export function getUniqueEmotionLabels(entries) {
  const labels = new Set();
  (entries || []).forEach((entry) => {
    const label = entry.emotion?.emotion || entry.emotion?.name;
    if (label) labels.add(label);
  });
  return Array.from(labels).sort((a, b) => a.localeCompare(b, 'es'));
}
