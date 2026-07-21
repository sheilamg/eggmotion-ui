import GrainOverlay from './GrainOverlay';
import EggAvatar from './EggAvatar';

export default function BrandedLoadingScreen({ message = 'Cargando...' }) {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <GrainOverlay />
      <div className="relative text-center flex flex-col items-center gap-5 animate-fade-in">
        <div className="animate-float">
          <EggAvatar size={72} glow="#9B5DE5" />
        </div>
        <div>
          <p
            className="font-pixel text-[10px] mb-2"
            style={{
              color: '#00F5D4',
              textShadow: '0 0 10px #00F5D480',
              letterSpacing: '0.08em',
            }}
          >
            eggmotion
          </p>
          <div
            className="rounded-full h-8 w-8 mx-auto mb-3 animate-spin"
            style={{ border: '2px solid var(--border)', borderTopColor: '#9B5DE5' }}
          />
          <p className="font-display text-sm" style={{ color: 'var(--text2)' }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
