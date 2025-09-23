import React, { useState } from 'react';
import eggCharacter from '../assets/egg-character.png';
import { useEmotions } from '../hooks/useEmotions';
import { useUserEmotions } from '../hooks/useUserEmotions';
import { getEmotionColor, getIntensityOptions } from '../utils/emotionUtils';

const Emotions = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState(3); // Default to medium intensity
  const [showSuccess, setShowSuccess] = useState(false);

  const { emotions, loading, error } = useEmotions();
  const { saveEmotion, saving, error: saveError } = useUserEmotions();
  const intensityOptions = getIntensityOptions();

  const handleEmotionClick = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleSave = async () => {
    if (selectedEmotion) {
      try {
        await saveEmotion({
          emotion: selectedEmotion.id,
          note,
          intensity
        });
        
        // Show success feedback
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Reset form
        setSelectedEmotion(null);
        setNote('');
        setIntensity(3);
      } catch (err) {
        console.error('Error saving emotion:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-white bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl">Cargando emociones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-white bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 text-center text-white bg-gray-900 min-h-screen flex flex-col items-center">
      <div className="my-8">
        <img src={eggCharacter} alt="Egg Character" className="w-48 h-48 mx-auto" />
      </div>
      <h2 className="text-2xl mb-8">¿Cómo te sientes hoy?</h2>
      
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-600 text-white rounded-lg">
          ¡Emoción guardada exitosamente!
        </div>
      )}

      {/* Error Message */}
      {saveError && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-lg">
          Error: {saveError}
        </div>
      )}

      {/* Emotions Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md my-8">
        {emotions.map((emotion) => {
          const label = emotion.emotion || emotion.name;
          const emoji = emotion.emoji;
          const isSelected = selectedEmotion?.id === emotion.id;

          return (
            <div
              key={emotion.id}
              onClick={() => handleEmotionClick(emotion)}
              className={`cursor-pointer p-4 rounded-full transition-all duration-200 ${
                isSelected ? `${getEmotionColor(label, true)} scale-110` : getEmotionColor(label, false)
              }`}
            >
              <div className="text-3xl">{emoji || '🙂'}</div>
              <p className="mt-2 text-sm">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Intensity Selector */}
      {selectedEmotion && (
        <div className="my-6 w-full max-w-md">
          <label className="block text-lg mb-3">Intensidad:</label>
          <div className="flex justify-between">
            {intensityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setIntensity(option.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  intensity === option.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option.value}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {intensityOptions.find(opt => opt.value === intensity)?.label}
          </div>
        </div>
      )}

      {/* Note Input */}
      <div className="my-8 w-full max-w-md">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="¿Qué te hizo sentir así? (opcional)"
          className="w-full min-h-[100px] bg-gray-800 border-none text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!selectedEmotion || saving}
        className={`font-bold py-3 px-6 rounded-lg cursor-pointer transition-colors duration-300 ${
          selectedEmotion && !saving
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  );
};

export default Emotions; 