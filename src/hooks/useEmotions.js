import { useState, useEffect } from 'react';
import { getEmotions } from '../api/emotions';

export const useEmotions = () => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getEmotions();
        setEmotions(response.data);
      } catch (err) {
        console.error('Error fetching emotions:', err);
        setError(err.message || 'Error al cargar las emociones');
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, []);

  return { emotions, loading, error };
};


