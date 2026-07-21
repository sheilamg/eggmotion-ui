import { getEmotionNeonColor, STATS_PERIODS } from './emotionUtils';

function getDayKey(dateValue) {
  return new Date(dateValue).toISOString().split('T')[0];
}

function groupEntriesByDay(entries) {
  const byDate = {};
  (entries || []).forEach((entry) => {
    const key = getDayKey(entry.creationDate);
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(entry);
  });
  return byDate;
}

export function getStatsUnlockTier(count) {
  if (count <= 2) return 'empty';
  if (count <= 6) return 'basic';
  return 'full';
}

export function getHeatmapDaysForPeriod(periodKey) {
  if (periodKey === 'year') return 364;
  return STATS_PERIODS[periodKey]?.days || 30;
}

export function buildFullEmotionDistribution(entries) {
  const counts = {};
  const total = entries?.length || 0;

  (entries || []).forEach((entry) => {
    const name = entry.emotion?.emotion || entry.emotion?.name || 'Otra';
    counts[name] = (counts[name] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      percent: total ? Math.round((count / total) * 100) : 0,
      color: getEmotionNeonColor(label),
    }))
    .sort((a, b) => b.count - a.count);
}

export function buildEnhancedHeatmapData(entries, days) {
  const byDate = groupEntriesByDay(entries);

  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const iso = getDayKey(date);
    const dayEntries = byDate[iso] || [];
    const intensities = dayEntries.map((entry) => entry.intensity || 0);
    const avgIntensity = intensities.length
      ? intensities.reduce((sum, value) => sum + value, 0) / intensities.length
      : 0;

    const emotionCounts = {};
    dayEntries.forEach((entry) => {
      const label = entry.emotion?.emotion || entry.emotion?.name;
      if (label) emotionCounts[label] = (emotionCounts[label] || 0) + 1;
    });

    const dominant = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
    const primary = dayEntries[dayEntries.length - 1] || null;

    return {
      date: iso,
      entries: dayEntries,
      entry: primary,
      count: dayEntries.length,
      avgIntensity,
      dominantLabel: dominant?.[0] || null,
      intensity: primary?.intensity || 0,
    };
  });
}

export function filterEntriesByYear(entries, year) {
  return (entries || []).filter(
    (entry) => new Date(entry.creationDate).getFullYear() === year,
  );
}

function buildDayHeatmapCell(iso, dayEntries) {
  const intensities = dayEntries.map((entry) => entry.intensity || 0);
  const avgIntensity = intensities.length
    ? intensities.reduce((sum, value) => sum + value, 0) / intensities.length
    : 0;

  const emotionCounts = {};
  dayEntries.forEach((entry) => {
    const label = entry.emotion?.emotion || entry.emotion?.name;
    if (label) emotionCounts[label] = (emotionCounts[label] || 0) + 1;
  });

  const dominant = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
  const primary = dayEntries[dayEntries.length - 1] || null;

  return {
    date: iso,
    entries: dayEntries,
    entry: primary,
    count: dayEntries.length,
    avgIntensity,
    dominantLabel: dominant?.[0] || null,
    intensity: primary?.intensity || 0,
  };
}

export function buildCalendarYearHeatmapData(entries, year) {
  const filtered = filterEntriesByYear(entries, year);
  const byDate = groupEntriesByDay(filtered);
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;

  return Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(year, 0, i + 1);
    const iso = getDayKey(date);
    return buildDayHeatmapCell(iso, byDate[iso] || []);
  });
}

export function buildEvolutionSeries(entries, days, emotionFilter = null) {
  const byDate = groupEntriesByDay(entries);
  const normalizedFilter = emotionFilter?.toLowerCase();

  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const iso = getDayKey(date);
    let dayEntries = byDate[iso] || [];

    if (normalizedFilter) {
      dayEntries = dayEntries.filter((entry) => {
        const label = entry.emotion?.emotion || entry.emotion?.name || '';
        return label.toLowerCase() === normalizedFilter;
      });
    }

    const avgIntensity = dayEntries.length
      ? dayEntries.reduce((sum, entry) => sum + (entry.intensity || 0), 0) / dayEntries.length
      : null;

    const latest = dayEntries[dayEntries.length - 1];

    return {
      date: iso,
      value: avgIntensity,
      entries: dayEntries,
      dominantLabel: latest
        ? latest.emotion?.emotion || latest.emotion?.name
        : null,
      hasData: dayEntries.length > 0,
      primaryEntry: latest || null,
    };
  });
}

export function buildPeriodComparison(allEntries, periodDays) {
  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setDate(currentStart.getDate() - periodDays);
  currentStart.setHours(0, 0, 0, 0);

  const previousStart = new Date(currentStart);
  previousStart.setDate(previousStart.getDate() - periodDays);

  const current = (allEntries || []).filter(
    (entry) => new Date(entry.creationDate) >= currentStart,
  );
  const previous = (allEntries || []).filter((entry) => {
    const date = new Date(entry.creationDate);
    return date >= previousStart && date < currentStart;
  });

  const summarize = (list) => {
    const dist = buildFullEmotionDistribution(list);
    const avgIntensity = list.length
      ? list.reduce((sum, entry) => sum + (entry.intensity || 0), 0) / list.length
      : 0;

    return {
      count: list.length,
      topEmotion: dist[0]?.label || null,
      topEmotionCount: dist[0]?.count || 0,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
    };
  };

  const currentSummary = summarize(current);
  const previousSummary = summarize(previous);

  return {
    current: currentSummary,
    previous: previousSummary,
    deltaCount: currentSummary.count - previousSummary.count,
    deltaIntensity:
      Math.round((currentSummary.avgIntensity - previousSummary.avgIntensity) * 10) / 10,
    emotionChanged: currentSummary.topEmotion !== previousSummary.topEmotion,
  };
}

export function buildSimpleCorrelations(entries) {
  if (!entries?.length || entries.length < 7) return [];

  const patterns = [];
  const weekdayCounts = Array(7).fill(0);

  entries.forEach((entry) => {
    weekdayCounts[new Date(entry.creationDate).getDay()] += 1;
  });

  const maxDayIndex = weekdayCounts.indexOf(Math.max(...weekdayCounts));
  const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  if (weekdayCounts[maxDayIndex] >= 2) {
    patterns.push({
      type: 'temporal',
      title: `Más registros los ${dayNames[maxDayIndex]}s`,
      detail: `${weekdayCounts[maxDayIndex]} check-ins caen en ese día de la semana.`,
    });
  }

  const tagCounts = {};
  entries.forEach((entry) => {
    (entry.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
  if (topTag && topTag[1] >= 2) {
    patterns.push({
      type: 'context',
      title: `El contexto "${topTag[0]}" aparece seguido`,
      detail: `Lo usaste en ${topTag[1]} registros del período.`,
    });
  }

  const unique = new Set(
    entries.map((entry) => entry.emotion?.emotion || entry.emotion?.name).filter(Boolean),
  );

  if (unique.size >= 4) {
    patterns.push({
      type: 'variety',
      title: `${unique.size} emociones distintas`,
      detail: 'Tu registro muestra variedad emocional en este período.',
    });
  }

  const avgIntensity =
    entries.reduce((sum, entry) => sum + (entry.intensity || 0), 0) / entries.length;

  patterns.push({
    type: 'intensity',
    title: `Intensidad promedio: ${Math.round(avgIntensity * 10) / 10}`,
    detail: 'Calculada sobre todos tus check-ins del período.',
  });

  return patterns.slice(0, 4);
}

export function buildHistoryUrl({ emotion, from, to, entryId } = {}) {
  if (entryId) return `/history/${entryId}`;

  const params = new URLSearchParams();
  if (emotion) params.set('emotion', emotion);
  if (from) params.set('from', from);
  if (to) params.set('to', to);

  const query = params.toString();
  return query ? `/history?${query}` : '/history';
}

export function intensityHeatColor(intensity) {
  if (!intensity) return null;
  const alpha = Math.min(255, Math.max(0, Math.round(64 + intensity * 18)))
    .toString(16)
    .padStart(2, '0');
  return `#9B5DE5${alpha}`;
}

export function emotionHeatColor(label, intensity) {
  if (!label || !intensity) return null;
  const color = getEmotionNeonColor(label);
  const alpha = Math.min(255, Math.max(0, Math.round(64 + intensity * 18)))
    .toString(16)
    .padStart(2, '0');
  return `${color}${alpha}`;
}
