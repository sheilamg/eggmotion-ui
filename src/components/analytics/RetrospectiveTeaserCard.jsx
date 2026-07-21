import { useNavigate } from 'react-router-dom';
import Eyebrow from '../ui/Eyebrow';
import NeonButton from '../ui/NeonButton';
import SurfaceCard from '../ui/SurfaceCard';

export default function RetrospectiveTeaserCard({ data, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <SurfaceCard className="p-5" borderLeft="#B067F5">
        <Eyebrow color="#B067F5">◆ RETROSPECTIVA ANUAL</Eyebrow>
        <p className="text-sm mt-2" style={{ color: 'var(--text2)' }}>
          Cargando…
        </p>
      </SurfaceCard>
    );
  }

  const unlocked = data?.unlocked === true;

  return (
    <SurfaceCard className="p-5" borderLeft="#B067F5">
      <Eyebrow color="#B067F5">◆ RETROSPECTIVA ANUAL</Eyebrow>
      <p className="font-display text-base font-semibold mt-2 mb-2" style={{ color: 'var(--text)' }}>
        Tu año en emociones
      </p>
      {unlocked ? (
        <>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text2)' }}>
            Reviví {data.year} con tus emociones más frecuentes, rachas y una frase generada por IA.
          </p>
          <NeonButton
            color="#B067F5"
            className="w-full sm:w-auto"
            onClick={() => navigate('/analytics/retrospective')}
          >
            VER RETROSPECTIVA
          </NeonButton>
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
            {data?.message ||
              'Se desbloquea con 365+ check-ins en total o un año desde tu registro.'}
          </p>
          <p className="text-xs mt-3" style={{ color: 'var(--text2)' }}>
            {data?.currentCheckIns ?? 0} de {data?.minCheckIns || 365} check-ins ·{' '}
            {data?.accountAgeDays ?? 0} días en la app
          </p>
        </>
      )}
    </SurfaceCard>
  );
}
