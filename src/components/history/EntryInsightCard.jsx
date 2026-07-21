import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getEntryInsight } from '../../api/insights';
import Eyebrow from '../ui/Eyebrow';
import SurfaceCard from '../ui/SurfaceCard';
import AiAnalysisDisclaimer from '../ai/AiAnalysisDisclaimer';
import { INSIGHT_TYPE_ICONS, INSIGHT_TYPE_LABELS } from '../../utils/insightUtils';

const POLL_MS = 3000;

export default function EntryInsightCard({ entryId, entry }) {
  const { user } = useAuth();
  const aiEnabled = user?.preferences?.aiAnalysis === true;
  const hasContent = Boolean(entry?.note?.trim() || entry?.tags?.length);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!entryId || !aiEnabled || !hasContent) {
      setData(null);
      return undefined;
    }

    let cancelled = false;
    let timer;

    const load = async () => {
      try {
        setLoading((prev) => prev || !data);
        setError('');
        const res = await getEntryInsight(entryId);
        if (cancelled) return;

        setData(res.data);
        setLoading(false);

        if (res.data?.status === 'pending') {
          timer = window.setTimeout(load, POLL_MS);
        }
      } catch {
        if (!cancelled) {
          setError('No pudimos cargar el insight de IA.');
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [entryId, aiEnabled, hasContent]);

  if (!aiEnabled || !hasContent) {
    return null;
  }

  if (loading && !data) {
    return (
      <SurfaceCard className="p-4" borderLeft="#FEE440">
        <Eyebrow color="#FEE440">◆ INSIGHT IA</Eyebrow>
        <p className="text-sm mt-2" style={{ color: 'var(--text2)' }}>
          Analizando este registro…
        </p>
      </SurfaceCard>
    );
  }

  if (error) {
    return (
      <SurfaceCard className="p-4" borderLeft="#FF1E73">
        <Eyebrow color="#FF1E73">◆ INSIGHT IA</Eyebrow>
        <p className="text-sm mt-2" style={{ color: 'var(--text2)' }}>{error}</p>
      </SurfaceCard>
    );
  }

  if (data?.status === 'pending') {
    return (
      <SurfaceCard className="p-4" borderLeft="#FEE440">
        <Eyebrow color="#FEE440">◆ INSIGHT IA</Eyebrow>
        <p className="text-sm mt-2" style={{ color: 'var(--text2)' }}>
          {data.message || 'Analizando en segundo plano… Volvé a abrir este detalle en unos segundos.'}
        </p>
      </SurfaceCard>
    );
  }

  if (data?.status === 'failed') {
    return (
      <SurfaceCard className="p-4" borderLeft="#FF1E73">
        <Eyebrow color="#FF1E73">◆ INSIGHT IA</Eyebrow>
        <p className="text-sm mt-2" style={{ color: 'var(--text2)' }}>
          {data.message || 'No pudimos generar el insight para este registro.'}
        </p>
      </SurfaceCard>
    );
  }

  if (data?.status !== 'ready' || !data.insight) {
    return null;
  }

  const insight = data.insight;
  const type = insight.type || 'general';
  const icon = INSIGHT_TYPE_ICONS[type] || INSIGHT_TYPE_ICONS.general;
  const label = INSIGHT_TYPE_LABELS[type] || INSIGHT_TYPE_LABELS.general;

  return (
    <SurfaceCard className="p-4" borderLeft="#FEE440">
      <Eyebrow color="#FEE440">{icon} INSIGHT IA — {label.toUpperCase()}</Eyebrow>
      <p className="font-display text-base font-semibold mt-2 mb-2" style={{ color: 'var(--text)' }}>
        {insight.title}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
        {insight.insight}
      </p>
      {insight.reflectiveQuestion && (
        <p className="text-sm mt-3 italic" style={{ color: 'var(--text)' }}>
          {insight.reflectiveQuestion}
        </p>
      )}
      <AiAnalysisDisclaimer context="checkin" className="mt-3" />
    </SurfaceCard>
  );
}
