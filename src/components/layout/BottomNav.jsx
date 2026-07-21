import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navItems';
import { useCheckIn } from '../../context/CheckInContext';

function NavItem({ item }) {
  const location = useLocation();
  const active = location.pathname === item.to;

  return (
    <NavLink
      to={item.to}
      className="press-effect flex flex-col items-center justify-center gap-1 py-3 no-underline"
    >
      <span
        style={{
          fontSize: 18,
          color: active ? '#9B5DE5' : 'var(--text2)',
          filter: active ? 'drop-shadow(0 0 6px #9B5DE5)' : 'none',
        }}
      >
        {item.icon}
      </span>
      <span
        className="font-pixel"
        style={{
          fontSize: 6,
          color: active ? '#9B5DE5' : 'var(--text2)',
          textShadow: active ? '0 0 8px #9B5DE5' : 'none',
        }}
      >
        {item.label.toUpperCase()}
      </span>
    </NavLink>
  );
}

export default function BottomNav() {
  const { openCheckIn } = useCheckIn();
  const left = NAV_ITEMS.slice(0, 2);
  const right = NAV_ITEMS.slice(2);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 grid grid-cols-[1fr_1fr_72px_1fr_1fr] pb-[max(env(safe-area-inset-bottom),8px)]"
      style={{
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {left.map((item) => (
        <NavItem key={item.id} item={item} />
      ))}

      <div className="flex items-center justify-center relative -top-5">
        <button
          type="button"
          onClick={() => openCheckIn()}
          className="press-effect font-pixel"
          style={{
            width: 56,
            height: 56,
            borderRadius: 8,
            backgroundColor: '#9B5DE5',
            border: '2px solid #9B5DE5',
            color: 'white',
            fontSize: 28,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 0 20px #9B5DE580, 0 0 40px #9B5DE530',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +
        </button>
      </div>

      {right.map((item) => (
        <NavItem key={item.id} item={item} />
      ))}
    </nav>
  );
}
