import { Link } from 'react-router-dom';
import GrainOverlay from '../../components/ui/GrainOverlay';
import NeonButton from '../../components/ui/NeonButton';
import EggAvatar from '../../components/ui/EggAvatar';
import Eyebrow from '../../components/ui/Eyebrow';

export default function Welcome() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-6 text-center"
      style={{
        background:
          'radial-gradient(circle at 50% 18%, rgba(160,32,240,0.35), transparent 60%), linear-gradient(180deg, var(--bg) 0%, #2A003F 140%)',
        color: 'var(--text)',
      }}
    >
      <GrainOverlay />
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
        <div className="animate-float">
          <EggAvatar size={120} glow="#00F5D4" />
        </div>
        <div>
          <Eyebrow color="#00F5D4">EGGMOTION</Eyebrow>
          <h1
            className="font-display text-4xl font-bold mt-2"
            style={{
              background: 'linear-gradient(95deg, #00F5D4, #39FF14 35%, #FEE440 55%, #FF1E73 75%, #9B5DE5)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            eggmotion
          </h1>
          <p className="font-pixel text-[10px] mt-4 tracking-wider" style={{ color: 'var(--text2)' }}>
            INCUBÁ LO QUE SENTÍS
          </p>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
          Un espacio para registrar cómo te sentís, escribir libremente y entenderte un poco mejor con el tiempo.
        </p>
        <div className="flex flex-col gap-3 w-full mt-2">
          <Link to="/register">
            <NeonButton color="#9B5DE5" className="w-full">
              CREAR CUENTA
            </NeonButton>
          </Link>
          <Link to="/login">
            <button
              type="button"
              className="w-full font-pixel text-[8px] py-3 press-effect"
              style={{
                color: 'var(--text2)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              INICIAR SESIÓN
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
