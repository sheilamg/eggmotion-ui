import { useState } from 'react';
import { createUserEmotion } from '../api/emotions';

export const useUserEmotions = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveEmotion = async (emotionData) => {
    try {
      setSaving(true);
      setError(null);
      
      // Format the date as required by the backend
      const payload = {
        emotion: emotionData.emotion,
        creationDate: emotionData.creationDate ? new Date(emotionData.creationDate).toISOString() : new Date().toISOString(),
        intensity: emotionData.intensity,
        note: emotionData.note
      };

      const response = await createUserEmotion(payload);
      return response.data;
    } catch (err) {
      console.error('Error saving emotion:', err);
      setError(err.response?.data?.message || err.message || 'Error al guardar la emoción');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { saveEmotion, saving, error };
};
