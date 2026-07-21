import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getUserEmotions } from '../api/emotions';
import { useCheckIn } from './CheckInContext';

const UserEmotionsContext = createContext(null);

export function UserEmotionsProvider({ children }) {
  const { refreshKey } = useCheckIn();
  const [userEmotions, setUserEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserEmotions();
      setUserEmotions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching user emotions:', err);
      setError(err.message || 'Error al cargar las emociones del usuario');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (refreshKey > 0) {
      refetch();
    }
  }, [refreshKey, refetch]);

  const calendarEvents = useMemo(() => {
    if (!userEmotions.length) return [];

    return userEmotions.map((emotion) => {
      const startIso = new Date(emotion.creationDate).toISOString();
      const emotionTime = new Date(emotion.creationDate).toTimeString().slice(0, 5);

      return {
        id: emotion.id,
        title: `${emotion.emotion?.emoji || '😊'} ${emotionTime}`,
        emoji: emotion.emotion?.emoji || '😊',
        start: startIso,
        end: startIso,
        allDay: false,
        display: 'list-item',
        extendedProps: {
          emotion: emotion.emotion,
          intensity: emotion.intensity,
          note: emotion.note,
          creationDate: emotion.creationDate,
          id: emotion.id,
          time: emotionTime,
        },
      };
    });
  }, [userEmotions]);

  const monthlyEvents = useMemo(() => {
    if (!userEmotions.length) return [];

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
        id: emotion.id,
      });
    });

    return Object.entries(dayMap).map(([date, emotions]) => {
      const emojiCount = {};
      emotions.forEach((item) => {
        emojiCount[item.emoji] = (emojiCount[item.emoji] || 0) + 1;
      });

      const mostFrequentEmoji = Object.entries(emojiCount).sort(
        (a, b) => b[1] - a[1],
      )[0][0];

      return {
        id: `day-${date}`,
        title: mostFrequentEmoji,
        start: date,
        allDay: true,
        extendedProps: {
          emotions,
          emoji: mostFrequentEmoji,
          count: emotions.length,
        },
      };
    });
  }, [userEmotions]);

  const value = useMemo(
    () => ({
      userEmotions,
      calendarEvents,
      monthlyEvents,
      loading,
      error,
      refetch,
    }),
    [userEmotions, calendarEvents, monthlyEvents, loading, error, refetch],
  );

  return (
    <UserEmotionsContext.Provider value={value}>
      {children}
    </UserEmotionsContext.Provider>
  );
}

export function useUserEmotionsCalendar() {
  const ctx = useContext(UserEmotionsContext);
  if (!ctx) {
    throw new Error('useUserEmotionsCalendar debe usarse dentro de UserEmotionsProvider');
  }
  return ctx;
}
