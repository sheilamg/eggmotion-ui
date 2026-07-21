import { useNavigate } from 'react-router-dom';
import Eyebrow from '../ui/Eyebrow';
import NeonButton from '../ui/NeonButton';
import SurfaceCard from '../ui/SurfaceCard';
import {
  buildInsightHistoryUrl,
  INSIGHT_TYPE_ICONS,
  INSIGHT_TYPE_LABELS,
} from '../../utils/insightUtils';

export default function AiPatternCard({ insight, variant = 'pattern' }) {
  const navigate = useNavigate();
  const type = insight?.type || 'general';
  const icon = INSIGHT_TYPE_ICONS[type] || INSIGHT_TYPE_ICONS.general;
  const label = INSIGHT_TYPE_LABELS[type] || INSIGHT_TYPE_LABELS.general;
  const historyUrl = buildInsightHistoryUrl(insight);
  const showRelatedButton =
    variant === 'pattern' &&
    (insight?.filters || (insight?.relatedEntryIds || []).length > 0);

  return (
    <SurfaceCard className="p-5 h-full flex flex-col" borderLeft="#FEE440">
      <Eyebrow color="#FEE440">
        {icon} {label.toUpperCase()}
      </Eyebrow>
      <p className="font-display text-base font-semibold mt-2 mb-2" style={{ color: 'var(--text)' }}>
        {insight?.title}
      </p>
      <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text2)' }}>
        {insight?.insight}
      </p>
      {insight?.reflectiveQuestion && (
        <p className="text-sm mt-4 italic" style={{ color: 'var(--text)' }}>
          {insight.reflectiveQuestion}
        </p>
      )}
      {showRelatedButton && (
        <NeonButton
          color="#FEE440"
          className="w-full sm:w-auto mt-4"
          onClick={() => navigate(historyUrl)}
        >
          VER REGISTROS RELACIONADOS
        </NeonButton>
      )}
      <p className="text-xs mt-4" style={{ color: 'var(--text2)' }}>
        Generado con IA a partir de tus check-ins. No es un diagnóstico médico.
      </p>
    </SurfaceCard>
  );
}
