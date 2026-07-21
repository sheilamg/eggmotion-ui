import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navItems';
import { useAuth } from '../../auth/AuthContext';
import { useCheckIn } from '../../context/CheckInContext';
import NeonButton from '../ui/NeonButton';

function SidebarLink({ item }) {
  const location = useLocation();
  const isActive = location.pathname === item.to;

  return (
    <NavLink
      to={item.to}
      className={`press-effect flex items-center gap-3 px-4 py-3 rounded-lg font-display text-sm no-underline transition-colors ${
        isActive ? 'font-semibold' : ''
      }`}
      style={{
        backgroundColor: isActive ? 'rgba(155, 93, 229, 0.15)' : 'transparent',
        color: isActive ? '#9B5DE5' : 'var(--text2)',
      }}
    >
      <span style={{ fontSize: 18 }}>{item.icon}</span>
      {item.label}
    </NavLink>
  );
}

export default function SidebarNav() {
  const { user, logout } = useAuth();
  const { openCheckIn } = useCheckIn();

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0 w-60 min-h-screen sticky top-0"
      style={{
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <p
          className="font-pixel text-[11px] neon-text-cyan"
          style={{ color: '#00F5D4', letterSpacing: '0.05em' }}
        >
          eggmotion
        </p>
        <p
          className="font-pixel text-[6px] mt-2"
          style={{ color: 'var(--text2)', letterSpacing: '0.15em' }}
        >
          INCUBÁ LO QUE SENTÍS
        </p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.id} item={item} />
        ))}
        <NavLink
          to="/settings"
          className="press-effect flex items-center gap-3 px-4 py-3 rounded-lg font-display text-sm no-underline"
          style={{ color: 'var(--text2)' }}
        >
          <span style={{ fontSize: 18 }}>⚙</span>
          Configuración
        </NavLink>
      </nav>

      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <NeonButton color="#9B5DE5" onClick={() => openCheckIn()} className="w-full mb-4">
          + REGISTRAR
        </NeonButton>
        {user && (
          <div>
            <p className="text-xs truncate mb-2" style={{ color: 'var(--text2)' }}>
              {user.email}
            </p>
            <button
              type="button"
              onClick={logout}
              className="font-pixel text-[7px] px-3 py-2 press-effect w-full"
              style={{
                color: '#FF1E73',
                border: '1px solid #FF1E7340',
                borderRadius: 4,
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              CERRAR SESIÓN
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
