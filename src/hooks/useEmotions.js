import { useState, useEffect } from 'react';
import { getEmotions } from '../api/emotions';
import { getEmotionsCache, setEmotionsCache } from '../utils/offlineCache';

export const useEmotions = () => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        setLoading(true);
        setError(null);
        setFromCache(false);
        const response = await getEmotions();
        setEmotions(response.data);
        setEmotionsCache(response.data);
      } catch (err) {
        console.error('Error fetching emotions:', err);
        const cached = getEmotionsCache();
        if (cached?.data?.length) {
          setEmotions(cached.data);
          setFromCache(true);
          setError(null);
        } else {
          setError(err.message || 'Error al cargar las emociones');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, []);

  return { emotions, loading, error, fromCache };
};
