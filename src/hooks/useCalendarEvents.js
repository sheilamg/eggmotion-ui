import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

export const getMostFrequentEmojiPerDay = (events) => {
  // Validar que events sea un array y no esté vacío
  if (!Array.isArray(events) || events.length === 0) {
    console.log('📅 No hay eventos para procesar o events no es un array válido');
    return [];
  }

  const dayMap = {};
  
  events.forEach((event, index) => {
    // Validar que el evento tenga las propiedades necesarias
    if (!event || typeof event !== 'object') {
      console.warn(`⚠️ Evento inválido en índice ${index}:`, event);
      return; // Saltar este evento
    }

    const { start, emoji } = event;
    
    // Validar que start exista y sea un string
    if (!start || typeof start !== 'string') {
      console.warn(`⚠️ Evento sin fecha válida en índice ${index}:`, { start, emoji });
      return; // Saltar este evento
    }

    // Validar que emoji exista
    if (!emoji) {
      console.warn(`⚠️ Evento sin emoji en índice ${index}:`, { start, emoji });
      return; // Saltar este evento
    }

    try {
      // Intentar dividir la fecha
      const day = start.split('T')[0];
      
      // Validar que day sea una fecha válida (formato YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
        console.warn(`⚠️ Formato de fecha inválido en índice ${index}:`, { start, day });
        return; // Saltar este evento
      }

      if (!dayMap[day]) dayMap[day] = {};
      dayMap[day][emoji] = (dayMap[day][emoji] || 0) + 1;
      
    } catch (error) {
      console.error(`❌ Error procesando evento en índice ${index}:`, error, { start, emoji });
      return; // Saltar este evento
    }
  });

  // Convertir el mapa a eventos del calendario
  return Object.entries(dayMap).map(([date, emojis]) => {
    try {
      const emoji = Object.entries(emojis).sort((a, b) => b[1] - a[1])[0][0];
      return {
        title: emoji,
        start: date,
        allDay: true,
        emoji,
        note: '',
      };
    } catch (error) {
      console.error(`❌ Error creando evento para fecha ${date}:`, error);
      return null;
    }
  }).filter(Boolean); // Filtrar eventos nulos
};

export const useCalendarEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📅 Fetching emotions...');
        const response = await axios.get('/api/emotions');
        
        console.log('📅 Emotions recibidas:', response.data);
        
        // Validar que la respuesta tenga la estructura esperada
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          console.warn('⚠️ Respuesta de emotions no es un array:', response.data);
          setEvents([]);
        }
        
      } catch (error) {
        console.error('❌ Error fetching events:', error);
        setError(error.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const monthlyEvents = useMemo(() => {
    console.log('📅 Procesando eventos para calendario:', events);
    return getMostFrequentEmojiPerDay(events);
  }, [events]);

  return { events, monthlyEvents, loading, error };
};