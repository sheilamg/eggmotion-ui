import { useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import NeonButton from '../ui/NeonButton';

const STEPS = ['warning', 'reason', 'password', 'confirm'];

export default function DeleteAccountModal({ open, onClose }) {
  const { logout } = useAuth();
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const reset = () => {
    setStep(0);
    setReason('');
    setPassword('');
    setConfirmText('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');
      await axios.delete('/users/account', {
        data: {
          password,
          reason: reason.trim() || undefined,
        },
      });
      logout();
    } catch (err) {
      setError(err.response?.data?.message || 'No pudimos eliminar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = STEPS[step];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      <div
        className="w-full max-w-md p-6 surface-card max-h-[90vh] overflow-y-auto"
        style={{ borderRadius: 12 }}
      >
        <p id="delete-account-title" className="font-display text-lg font-bold mb-2">
          Eliminar cuenta
        </p>
        <p className="font-pixel text-[7px] mb-4" style={{ color: 'var(--text2)' }}>
          PASO {step + 1} DE {STEPS.length}
        </p>

        {currentStep === 'warning' && (
          <>
            <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>
              Esta acción es permanente. Se borrarán tus check-ins, entradas del diario,
              frases favoritas y preferencias. No podrás recuperar tus datos.
            </p>
            <div className="flex gap-3">
              <NeonButton color="#FF1E73" className="flex-1" onClick={() => setStep(1)}>
                CONTINUAR
              </NeonButton>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 font-pixel text-[8px] min-h-[44px]"
                style={{ color: 'var(--text2)' }}
              >
                CANCELAR
              </button>
            </div>
          </>
        )}

        {currentStep === 'reason' && (
          <>
            <p className="text-sm mb-3" style={{ color: 'var(--text2)' }}>
              ¿Querés contarnos por qué te vas? (opcional)
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Tu feedback nos ayuda a mejorar..."
              className="w-full p-3 rounded-lg text-sm outline-none resize-none mb-4"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
            <div className="flex gap-3">
              <NeonButton color="#9B5DE5" className="flex-1" onClick={() => setStep(2)}>
                SIGUIENTE
              </NeonButton>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex-1 font-pixel text-[8px] min-h-[44px]"
                style={{ color: 'var(--text2)' }}
              >
                ATRÁS
              </button>
            </div>
          </>
        )}

        {currentStep === 'password' && (
          <>
            <p className="text-sm mb-3" style={{ color: 'var(--text2)' }}>
              Confirmá tu contraseña para continuar.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-3 py-3 rounded-lg text-sm outline-none min-h-[44px] mb-4"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
            <div className="flex gap-3">
              <NeonButton
                color="#9B5DE5"
                className="flex-1"
                disabled={!password}
                onClick={() => setStep(3)}
              >
                SIGUIENTE
              </NeonButton>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 font-pixel text-[8px] min-h-[44px]"
                style={{ color: 'var(--text2)' }}
              >
                ATRÁS
              </button>
            </div>
          </>
        )}

        {currentStep === 'confirm' && (
          <>
            <p className="text-sm mb-3" style={{ color: 'var(--text2)' }}>
              Escribí <strong>ELIMINAR</strong> para confirmar el borrado definitivo.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className="w-full px-3 py-3 rounded-lg text-sm outline-none min-h-[44px] mb-4"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
            {error && (
              <p className="text-sm mb-3" style={{ color: '#FF1E73' }}>{error}</p>
            )}
            <div className="flex gap-3">
              <NeonButton
                color="#FF1E73"
                className="flex-1"
                disabled={confirmText !== 'ELIMINAR' || loading}
                onClick={handleDelete}
              >
                {loading ? 'ELIMINANDO...' : 'ELIMINAR MI CUENTA'}
              </NeonButton>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 font-pixel text-[8px] min-h-[44px]"
                style={{ color: 'var(--text2)' }}
              >
                ATRÁS
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
