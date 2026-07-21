export default function Eyebrow({ children, color = '#00F5D4', className = '' }) {
  return (
    <p
      className={`font-pixel text-[8px] tracking-widest mb-2 ${className}`}
      style={{ color }}
    >
      {children}
    </p>
  );
}
