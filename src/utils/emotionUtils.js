import HappyIcon from '../components/icons/HappyIcon';
import CalmIcon from '../components/icons/CalmIcon';
import SadIcon from '../components/icons/SadIcon';
import AngryIcon from '../components/icons/AngryIcon';

const NEON_COLORS = {
  happy: '#39FF14',
  feliz: '#39FF14',
  calm: '#00F5D4',
  tranquilo: '#00F5D4',
  calmado: '#00F5D4',
  grateful: '#B067F5',
  agradecido: '#B067F5',
  hopeful: '#8AFF9A',
  esperanzado: '#8AFF9A',
  excited: '#FF9AEE',
  emocionado: '#FF9AEE',
  curious: '#00FFFF',
  curioso: '#00FFFF',
  sad: '#8AFFF5',
  triste: '#8AFFF5',
  anxious: '#FAFF00',
  ansioso: '#FAFF00',
  tired: '#A0A0B0',
  cansado: '#A0A0B0',
  lonely: '#6B78FF',
  solo: '#6B78FF',
  solitario: '#6B78FF',
  angry: '#FF1E73',
  enojado: '#FF1E73',
  overwhelmed: '#FDFF80',
  abrumado: '#FDFF80',
};

export const getEmotionIcon = (emotionName) => {
  const iconMap = {
    happy: HappyIcon,
    calm: CalmIcon,
    sad: SadIcon,
    angry: AngryIcon,
    feliz: HappyIcon,
    tranquilo: CalmIcon,
    triste: SadIcon,
    enojado: AngryIcon,
  };

  return iconMap[emotionName?.toLowerCase()] || HappyIcon;
};

export const getEmotionNeonColor = (emotionName) =>
  NEON_COLORS[emotionName?.toLowerCase()] || '#9B5DE5';

export const getEmotionColor = (emotionName, isSelected = false) => {
  const color = getEmotionNeonColor(emotionName);
  if (isSelected) {
    return { backgroundColor: `${color}30`, borderColor: color, color };
  }
  return {
    backgroundColor: 'var(--surface)',
    borderColor: `${color}40`,
    color,
  };
};

export const getIntensityOptions = () => [
  { value: 1, label: 'Apenas' },
  { value: 2, label: 'Leve' },
  { value: 3, label: 'Moderada' },
  { value: 4, label: 'Bastante' },
  { value: 5, label: 'Profundamente' },
];

export function calculateStreak(userEmotions) {
  if (!userEmotions?.length) return 0;

  const daySet = new Set(
    userEmotions.map((e) => {
      const d = new Date(e.creationDate);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!daySet.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getTodayEmotions(userEmotions) {
  const today = new Date();
  return (userEmotions || []).filter((e) =>
    isSameDay(new Date(e.creationDate), today),
  );
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function buildHeatmapData(userEmotions, days = 84) {
  const byDate = {};
  (userEmotions || []).forEach((entry) => {
    const key = new Date(entry.creationDate).toISOString().split('T')[0];
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(entry);
  });

  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const iso = date.toISOString().split('T')[0];
    const entries = byDate[iso] || [];
    const primary = entries[entries.length - 1] || null;
    return {
      date: iso,
      entry: primary,
      intensity: primary?.intensity || 0,
    };
  });
}

export function filterEntriesByPeriod(entries, days) {
  if (!days || days <= 0) return entries || [];

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);

  return (entries || []).filter((entry) => new Date(entry.creationDate) >= cutoff);
}

export const STATS_PERIODS = {
  week: { label: 'Semana', days: 7 },
  month: { label: 'Mes', days: 30 },
  year: { label: 'Año', days: 365 },
};

export function buildEmotionCounts(userEmotions) {
  const counts = {};
  (userEmotions || []).forEach((entry) => {
    const name = entry.emotion?.emotion || entry.emotion?.name || 'Otra';
    counts[name] = (counts[name] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      color: getEmotionNeonColor(label),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function buildCalendarDays(userEmotions, weeks = 5) {
  const today = new Date();
  const dayOfMonth = today.getDate();
  const startOffset = (today.getDay() + dayOfMonth - 1) % 7;
  const totalDays = weeks * 7;

  const byDate = {};
  (userEmotions || []).forEach((entry) => {
    const iso = new Date(entry.creationDate).toISOString().split('T')[0];
    if (!byDate[iso]) byDate[iso] = entry;
  });

  return Array.from({ length: totalDays }, (_, i) => {
    const offset = i - startOffset;
    const target = new Date(today.getFullYear(), today.getMonth(), offset + 1);
    const iso = target.toISOString().split('T')[0];
    return {
      date: target,
      iso,
      entry: byDate[iso] ?? null,
      isCurrentMonth: target.getMonth() === today.getMonth(),
    };
  });
}
