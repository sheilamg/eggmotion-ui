import React from 'react';
import { getIntensityOptions } from '../../utils/emotionUtils';

const EmotionDetailsModal = ({ isOpen, onClose, emotionData }) => {
  if (!isOpen || !emotionData) return null;

  const intensityOptions = getIntensityOptions();
  const intensityLabel = intensityOptions.find(opt => opt.value === emotionData.intensity)?.label || 'N/A';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Detalles de la Emoción</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Emotion Info */}
          <div className="space-y-4">
            {/* Emoji and Name */}
            <div className="text-center">
              <div className="text-6xl mb-2">{emotionData.emoji}</div>
              <h3 className="text-2xl font-semibold text-gray-800">{emotionData.emotion}</h3>
            </div>

            {/* Intensity */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Intensidad</h4>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        level <= emotionData.intensity
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {level}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">{intensityLabel}</span>
              </div>
            </div>

            {/* Note */}
            {emotionData.note && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Nota</h4>
                <p className="text-gray-600">{emotionData.note}</p>
              </div>
            )}

            {/* Date and Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Fecha y Hora</h4>
              <p className="text-gray-600">{formatDate(emotionData.creationDate)}</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionDetailsModal;
