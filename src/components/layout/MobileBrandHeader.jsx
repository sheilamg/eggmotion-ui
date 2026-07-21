import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

export default function MobileBrandHeader() {
  return (
    <header
      className="lg:hidden flex items-center justify-between px-5 py-4 shrink-0"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div>
        <span
          className="font-pixel text-[11px]"
          style={{
            color: '#00F5D4',
            textShadow: '0 0 10px #00F5D4, 0 0 20px #00F5D480',
            letterSpacing: '0.05em',
          }}
        >
          eggmotion
        </span>
        <p
          className="font-pixel text-[6px] mt-1"
          style={{ color: 'var(--text2)', letterSpacing: '0.12em' }}
        >
          INCUBÁ LO QUE SENTÍS
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/settings"
          className="press-effect flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            border: '1px solid var(--border)',
            color: 'var(--text2)',
            textDecoration: 'none',
            fontSize: 18,
          }}
          aria-label="Configuración"
        >
          ⚙
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
