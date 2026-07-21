import { useState } from 'react';
import {
  createUserEmotion,
  deleteUserEmotion,
  updateUserEmotion,
} from '../api/emotions';

export const useUserEmotions = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const buildPayload = (emotionData) => ({
    emotion: emotionData.emotion,
    creationDate: emotionData.creationDate
      ? new Date(emotionData.creationDate).toISOString()
      : new Date().toISOString(),
    intensity: emotionData.intensity,
    note: emotionData.note?.trim() || undefined,
    tags: emotionData.tags || [],
  });

  const saveEmotion = async (emotionData) => {
    try {
      setSaving(true);
      setError(null);
      const response = await createUserEmotion(buildPayload(emotionData));
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error al guardar la emoción';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateEmotion = async (id, emotionData) => {
    try {
      setSaving(true);
      setError(null);
      const response = await updateUserEmotion(id, buildPayload(emotionData));
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error al actualizar la emoción';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const removeEmotion = async (id) => {
    try {
      setSaving(true);
      setError(null);
      await deleteUserEmotion(id);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error al eliminar la emoción';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { saveEmotion, updateEmotion, removeEmotion, saving, error };
};
