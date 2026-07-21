import { surfaceStyle } from '../../utils/uiUtils';

export default function SurfaceCard({
  children,
  className = '',
  style = {},
  border = true,
  onClick,
  borderLeft,
}) {
  return (
    <div
      onClick={onClick}
      className={`${onClick ? 'press-effect cursor-pointer' : ''} ${className}`}
      style={{
        ...surfaceStyle(border),
        ...style,
        ...(borderLeft ? { borderLeft: `3px solid ${borderLeft}` } : {}),
      }}
    >
      {children}
    </div>
  );
}
