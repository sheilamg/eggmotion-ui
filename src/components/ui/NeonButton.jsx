export default function NeonButton({
  children,
  color = '#9B5DE5',
  onClick,
  type = 'button',
  className = '',
  small = false,
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`press-effect font-pixel min-h-[44px] ${small ? 'text-[8px] px-3 py-2' : 'text-[10px] px-5 py-3'} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        backgroundColor: 'transparent',
        border: `2px solid ${color}`,
        borderRadius: 4,
        color,
        boxShadow: `0 0 10px ${color}60, 0 0 20px ${color}30`,
        letterSpacing: '0.08em',
        transition: 'box-shadow 0.15s, transform 0.1s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.boxShadow = `0 0 18px ${color}90, 0 0 36px ${color}50`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 10px ${color}60, 0 0 20px ${color}30`;
      }}
    >
      {children}
    </button>
  );
}
