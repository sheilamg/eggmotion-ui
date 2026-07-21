import egg320 from '../../assets/egg320.gif';
import eggCharacter from '../../assets/egg-character.png';

export default function EggAvatar({
  variant = 'idle',
  size = 80,
  glow,
  className = '',
}) {
  const src = variant === 'static' ? eggCharacter : egg320;
  const filter = glow
    ? `drop-shadow(0 0 8px ${glow}) drop-shadow(0 0 20px ${glow}60)`
    : undefined;

  return (
    <img
      src={src}
      alt="Huevo Eggmotion"
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        filter,
      }}
    />
  );
}
