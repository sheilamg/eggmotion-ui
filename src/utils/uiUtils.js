export function surfaceStyle(border = true) {
  return {
    backgroundColor: 'var(--surface)',
    border: border ? '1px solid var(--border)' : 'none',
    borderRadius: 8,
  };
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 17) return 'Buenas tardes';
  return 'Buenas noches';
}

export function formatDateEs(date = new Date()) {
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function toDateKey(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isSameDay(a, b) {
  return toDateKey(a) === toDateKey(b);
}
