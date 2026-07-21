import { useAuth } from '../../auth/AuthContext';

const CHECKIN_COPY =
  'Si activaste el análisis con IA, las notas y tags de este check-in pueden enviarse a Google Gemini para detectar patrones. Podés desactivarlo en Configuración.';

const JOURNAL_COPY =
  'Si activaste el análisis con IA, el texto de esta entrada puede enviarse a Google Gemini para detectar patrones. Stickers y dibujos no se envían. Podés desactivarlo en Configuración.';

export default function AiAnalysisDisclaimer({ context = 'checkin', className = '' }) {
  const { user } = useAuth();
  const enabled = user?.preferences?.aiAnalysis === true;

  if (!enabled) return null;

  const copy = context === 'journal' ? JOURNAL_COPY : CHECKIN_COPY;

  return (
    <p
      className={`text-xs leading-relaxed ${className}`.trim()}
      style={{ color: 'var(--text2)' }}
      role="note"
    >
      {copy}
    </p>
  );
}
