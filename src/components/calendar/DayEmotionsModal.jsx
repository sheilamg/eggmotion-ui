import React from 'react';
import { getIntensityOptions } from '../../utils/emotionUtils';

const DayEmotionsModal = ({ isOpen, onClose, emotions, date }) => {
  if (!isOpen || !emotions || emotions.length === 0) return null;

  const intensityOptions = getIntensityOptions();

  const formatTime = (timeString) => {
    return timeString || 'Sin hora';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Emociones del día</h2>
              <p className="text-gray-600">{formatDate(date)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Emotions List */}
          <div className="space-y-4">
            {emotions.map((emotion, index) => {
              const intensityLabel = intensityOptions.find(opt => opt.value === emotion.intensity)?.label || 'N/A';
              
              return (
                <div key={emotion.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    {/* Emoji */}
                    <div className="text-3xl">{emotion.emoji}</div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{emotion.emotion}</h3>
                        <span className="text-sm text-gray-500">{formatTime(emotion.time)}</span>
                      </div>
                      
                      {/* Intensity */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600">Intensidad:</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                level <= emotion.intensity
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              {level}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{intensityLabel}</span>
                      </div>
                      
                      {/* Note */}
                      {emotion.note && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {emotion.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

export default DayEmotionsModal;



