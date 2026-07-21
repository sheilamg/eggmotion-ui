import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import Eyebrow from '../../components/ui/Eyebrow';
import NeonButton from '../../components/ui/NeonButton';
import SurfaceCard from '../../components/ui/SurfaceCard';
import ThemeToggle from '../../components/ui/ThemeToggle';
import DeleteAccountModal from '../../components/settings/DeleteAccountModal';

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    country: user?.country || '',
    language: user?.language || 'es',
    timezone: user?.timezone || '',
    dailyReminder: user?.preferences?.dailyReminder || false,
    dailyQuote: user?.preferences?.dailyQuote !== false,
    aiAnalysis: user?.preferences?.aiAnalysis === true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [privacyMessage, setPrivacyMessage] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      const res = await axios.patch('/users/profile', {
        name: form.name.trim() || undefined,
        country: form.country,
        language: form.language,
        timezone: form.timezone,
        preferences: {
          dailyReminder: form.dailyReminder,
          dailyQuote: form.dailyQuote,
          aiAnalysis: form.aiAnalysis,
        },
      });
      updateUser(res.data);
      setMessage('Cambios guardados');
    } catch {
      setMessage('No pudimos guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordMessage('');
      await axios.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      logout();
    } catch (err) {
      setPasswordMessage(err.response?.data?.message || 'No pudimos cambiar la contraseña');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setPrivacyMessage('');
      const res = await axios.get('/users/export');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `eggmotion-export-${date}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setPrivacyMessage('Exportación descargada');
    } catch {
      setPrivacyMessage('No pudimos exportar tus datos');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="animate-fade-in p-5 lg:p-8 pb-28 lg:pb-8 flex flex-col gap-5">
      <div>
        <Eyebrow color="#9B5DE5">⚙ CONFIGURACIÓN</Eyebrow>
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Tu cuenta
        </h2>
      </div>

      <SurfaceCard className="p-5 space-y-4">
        <p className="font-pixel text-[8px]" style={{ color: 'var(--text2)' }}>MI CUENTA</p>
        <p className="text-sm" style={{ color: 'var(--text2)' }}>{user?.email}</p>
        {['name', 'country', 'language', 'timezone'].map((field) => (
          <div key={field}>
            <label htmlFor={`settings-${field}`} className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
              {field.toUpperCase()}
            </label>
            <input
              id={`settings-${field}`}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full px-3 py-3 mt-2 rounded-lg text-sm outline-none min-h-[44px]"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>
        ))}

        {message && (
          <p className="text-sm" style={{ color: message.includes('guardados') ? '#39FF14' : '#FF1E73' }}>
            {message}
          </p>
        )}

        <NeonButton color="#9B5DE5" className="w-full" disabled={saving} onClick={handleSave}>
          {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
        </NeonButton>
      </SurfaceCard>

      <SurfaceCard className="p-5 space-y-4">
        <p className="font-pixel text-[8px]" style={{ color: 'var(--text2)' }}>CAMBIAR CONTRASEÑA</p>
        {[
          { key: 'currentPassword', label: 'CONTRASEÑA ACTUAL' },
          { key: 'newPassword', label: 'NUEVA CONTRASEÑA' },
          { key: 'confirmPassword', label: 'CONFIRMAR CONTRASEÑA' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label htmlFor={`pwd-${key}`} className="font-pixel text-[7px]" style={{ color: 'var(--text2)' }}>
              {label}
            </label>
            <input
              id={`pwd-${key}`}
              type="password"
              value={passwordForm[key]}
              onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
              className="w-full px-3 py-3 mt-2 rounded-lg text-sm outline-none min-h-[44px]"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>
        ))}
        {passwordMessage && (
          <p className="text-sm" style={{ color: '#FF1E73' }}>{passwordMessage}</p>
        )}
        <NeonButton
          color="#00F5D4"
          className="w-full"
          disabled={changingPassword}
          onClick={handleChangePassword}
        >
          {changingPassword ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA'}
        </NeonButton>
      </SurfaceCard>

      <SurfaceCard className="p-5 space-y-4">
        <p className="font-pixel text-[8px]" style={{ color: 'var(--text2)' }}>PRIVACIDAD Y DATOS</p>

        <button
          type="button"
          onClick={() => navigate('/privacy')}
          className="w-full text-left press-effect min-h-[44px]"
        >
          <span className="text-sm" style={{ color: 'var(--text)' }}>Política de privacidad</span>
          <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
            Cómo tratamos y protegemos tu información
          </p>
        </button>

        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="w-full text-left press-effect min-h-[44px]"
        >
          <span className="text-sm" style={{ color: 'var(--text)' }}>
            {exporting ? 'Exportando...' : 'Exportar mis datos'}
          </span>
          <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
            Descarga un archivo JSON con check-ins, diario y preferencias
          </p>
        </button>

        <label className="flex items-start justify-between gap-4 min-h-[44px]">
          <div>
            <span className="text-sm">Análisis con IA</span>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text2)' }}>
              {form.aiAnalysis
                ? 'Tus check-ins (notas y tags) pueden enviarse a Google Gemini para generar insights. No es un diagnóstico médico.'
                : 'Desactivado: no enviamos texto de check-ins ni journal a proveedores de IA. Los insights existentes se ocultan.'}
            </p>
          </div>
          <input
            type="checkbox"
            checked={form.aiAnalysis}
            onChange={(e) => setForm({ ...form, aiAnalysis: e.target.checked })}
            aria-label="Análisis con IA"
            className="mt-1 shrink-0"
          />
        </label>

        {privacyMessage && (
          <p
            className="text-sm"
            style={{ color: privacyMessage.includes('descargada') ? '#39FF14' : '#FF1E73' }}
          >
            {privacyMessage}
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="w-full font-pixel text-[8px] py-3 press-effect min-h-[44px]"
          style={{
            color: '#FF1E73',
            border: '1px solid #FF1E7340',
            borderRadius: 4,
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          ELIMINAR MI CUENTA
        </button>
      </SurfaceCard>

      <SurfaceCard className="p-5 space-y-4">
        <p className="font-pixel text-[8px]" style={{ color: 'var(--text2)' }}>FRASES</p>
        <button
          type="button"
          onClick={() => navigate('/quotes/favorites')}
          className="w-full text-left press-effect min-h-[44px]"
        >
          <span className="text-sm" style={{ color: 'var(--text)' }}>Mis frases favoritas</span>
          <p className="text-xs mt-1" style={{ color: 'var(--text2)' }}>
            Frases que guardaste desde Home
          </p>
        </button>
      </SurfaceCard>

      <SurfaceCard className="p-5 space-y-4">
        <p className="font-pixel text-[8px]" style={{ color: 'var(--text2)' }}>NOTIFICACIONES</p>
        <label className="flex items-center justify-between min-h-[44px]">
          <span className="text-sm">Recordatorio diario</span>
          <input
            type="checkbox"
            checked={form.dailyReminder}
            onChange={(e) => setForm({ ...form, dailyReminder: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between min-h-[44px]">
          <span className="text-sm">Frase del día</span>
          <input
            type="checkbox"
            checked={form.dailyQuote}
            onChange={(e) => setForm({ ...form, dailyQuote: e.target.checked })}
          />
        </label>
        <p className="text-xs" style={{ color: 'var(--text2)' }}>
          Las notificaciones push estarán disponibles próximamente.
        </p>
      </SurfaceCard>

      <SurfaceCard className="p-5 space-y-4">
        <p className="font-pixel text-[8px]" style={{ color: 'var(--text2)' }}>APARIENCIA</p>
        <div className="flex items-center justify-between min-h-[44px]">
          <span className="text-sm">Tema claro / oscuro</span>
          <ThemeToggle />
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-5">
        <p className="font-pixel text-[8px] mb-4" style={{ color: 'var(--text2)' }}>SESIÓN</p>
        {!showLogoutConfirm ? (
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full font-pixel text-[8px] py-3 press-effect min-h-[44px]"
            style={{
              color: '#FF1E73',
              border: '1px solid #FF1E7340',
              borderRadius: 4,
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            CERRAR SESIÓN
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm" style={{ color: 'var(--text2)' }}>¿Querés cerrar sesión?</p>
            <div className="flex gap-3">
              <NeonButton color="#FF1E73" className="flex-1" onClick={logout}>
                CERRAR SESIÓN
              </NeonButton>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 font-pixel text-[8px] min-h-[44px]"
                style={{ color: 'var(--text2)' }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        )}
      </SurfaceCard>

      <DeleteAccountModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
