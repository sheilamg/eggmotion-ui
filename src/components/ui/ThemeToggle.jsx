import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((d) => !d)}
      className="font-pixel text-[8px] px-3 py-2 press-effect"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        color: 'var(--text2)',
        cursor: 'pointer',
      }}
    >
      {isDark ? '☀ CLARO' : '☾ OSCURO'}
    </button>
  );
}
