import React, { useMemo, useState } from 'react';
import { useEmotions } from '../../hooks/useEmotions';
import { useUserEmotions } from '../../hooks/useUserEmotions';
import { getIntensityOptions } from '../../utils/emotionUtils';

const EmotionCreateModal = ({ isOpen, onClose, initialDateTime, onCreated }) => {
  const { emotions, loading: loadingEmotions, error: emotionsError } = useEmotions();
  const { saveEmotion, saving } = useUserEmotions();
  const [selectedEmotionId, setSelectedEmotionId] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const intensityOptions = getIntensityOptions();

  // Initialize date and time inputs when modal opens
  React.useEffect(() => {
    if (isOpen && initialDateTime) {
      const start = initialDateTime.start ? new Date(initialDateTime.start) : new Date(initialDateTime);
      const dateStr = start.toISOString().slice(0, 10);
      const timeStr = start.toTimeString().slice(0, 5);
      setSelectedDate(dateStr);
      setSelectedTime(timeStr);
    }
  }, [isOpen, initialDateTime]);

  const formattedDateTime = useMemo(() => {
    if (!initialDateTime) return '';
    const start = initialDateTime.start ? new Date(initialDateTime.start) : new Date(initialDateTime);
    const end = initialDateTime.end ? new Date(initialDateTime.end) : null;
    const dateStr = start.toISOString().slice(0, 10);
    const timeStr = start.toTimeString().slice(0, 5);
    const endTimeStr = end ? end.toTimeString().slice(0, 5) : null;
    return endTimeStr ? `${dateStr} ${timeStr} - ${endTimeStr}` : `${dateStr} ${timeStr}`;
  }, [initialDateTime]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmotionId || !selectedDate || !selectedTime) return;
    
    // Combine date and time to create the final datetime
    const creationDate = new Date(`${selectedDate}T${selectedTime}:00`);
    
    await saveEmotion({ emotion: selectedEmotionId, intensity, note, creationDate });
    onCreated?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Agregar emoción</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Fecha y hora</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Seleccionado: {formattedDateTime}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Emoción</label>
            <select
              value={selectedEmotionId || ''}
              onChange={(e) => setSelectedEmotionId(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-2"
              disabled={loadingEmotions}
            >
              <option value="" disabled>Selecciona una emoción</option>
              {emotions.map((em) => (
                <option key={em.id} value={em.id}>
                  {em.emoji ? `${em.emoji} ` : ''}{em.emotion || em.name}
                </option>
              ))}
            </select>
            {emotionsError && <p className="text-sm text-red-600 mt-1">{emotionsError}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Intensidad</label>
            <div className="flex space-x-2">
              {intensityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setIntensity(opt.value)}
                  className={`px-3 py-2 rounded ${intensity === opt.value ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {opt.value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Nota</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-3 py-2"
              placeholder="Opcional"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Cancelar</button>
            <button type="submit" disabled={!selectedEmotionId || !selectedDate || !selectedTime || saving} className="px-4 py-2 rounded bg-purple-600 text-white disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmotionCreateModal;


