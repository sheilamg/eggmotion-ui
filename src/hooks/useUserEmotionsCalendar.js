import { useState, useEffect, useMemo } from 'react';
import { getUserEmotions } from '../api/emotions';

export const useUserEmotionsCalendar = () => {
  const [userEmotions, setUserEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserEmotions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserEmotions();
        setUserEmotions(response.data);
      } catch (err) {
        console.error('Error fetching user emotions:', err);
        setError(err.message || 'Error al cargar las emociones del usuario');
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchUserEmotions();
  }, []);

  // Convert user emotions to calendar events
  const calendarEvents = useMemo(() => {
    if (!Array.isArray(userEmotions) || userEmotions.length === 0) {
      return [];
    }

    return userEmotions.map((emotion) => {
      const startIso = new Date(emotion.creationDate).toISOString();
      const emotionTime = new Date(emotion.creationDate).toTimeString().slice(0, 5);

      return {
        id: emotion.id,
        title: `${emotion.emotion?.emoji || '😊'} ${emotionTime}`,
        emoji: emotion.emotion?.emoji || '😊',
        start: startIso,
        end: startIso, // Same start and end for point-in-time events
        allDay: false,
        display: 'list-item', // Show as list item instead of block
        extendedProps: {
          emotion: emotion.emotion,
          intensity: emotion.intensity,
          note: emotion.note,
          creationDate: emotion.creationDate,
          id: emotion.id,
          time: emotionTime
        }
      };
    });
  }, [userEmotions]);

  // Group emotions by day for monthly view
  const monthlyEvents = useMemo(() => {
    if (!Array.isArray(userEmotions) || userEmotions.length === 0) {
      return [];
    }

    const dayMap = {};
    
    userEmotions.forEach((emotion) => {
      const date = new Date(emotion.creationDate);
      const dayStr = date.toISOString().split('T')[0];
      
      if (!dayMap[dayStr]) {
        dayMap[dayStr] = [];
      }
      
      dayMap[dayStr].push({
        emoji: emotion.emotion?.emoji || '😊',
        emotion: emotion.emotion?.emotion || emotion.emotion?.name || 'Emoción',
        intensity: emotion.intensity,
        note: emotion.note,
        time: date.toTimeString().split(' ')[0].substring(0, 5),
        id: emotion.id
      });
    });

    // Convert to calendar events - show most frequent emoji for the day
    return Object.entries(dayMap).map(([date, emotions]) => {
      const emojiCount = {};
      emotions.forEach(emotion => {
        emojiCount[emotion.emoji] = (emojiCount[emotion.emoji] || 0) + 1;
      });
      
      const mostFrequentEmoji = Object.entries(emojiCount)
        .sort((a, b) => b[1] - a[1])[0][0];
      
      return {
        id: `day-${date}`,
        title: mostFrequentEmoji,
        start: date,
        allDay: true,
        extendedProps: {
          emotions: emotions,
          emoji: mostFrequentEmoji,
          count: emotions.length
        }
      };
    });
  }, [userEmotions]);

  return {
    userEmotions,
    calendarEvents,
    monthlyEvents,
    loading,
    error,
    refetch: fetchUserEmotions
  };
};
