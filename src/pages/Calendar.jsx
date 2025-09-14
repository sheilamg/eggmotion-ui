import React, { useMemo, useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { getMostFrequentEmojiPerDay } from '../hooks/useCalendarEvents';
import EventContent from '../components/calendar/EventContent';
import { getEmotions } from '../api/emotions';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Procesar eventos de manera segura
  const monthlyEvents = useMemo(() => {
    try {
      console.log('📅 Calendar: Procesando eventos:', events);
      return getMostFrequentEmojiPerDay(events);
    } catch (error) {
      console.error('❌ Calendar: Error procesando eventos:', error);
      return [];
    }
  }, [events]);
  
  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📅 Calendar: Fetching emotions...');
        const response = await getEmotions();
        
        console.log('📅 Calendar: Emotions recibidas:', response.data);
        
        // Validar que la respuesta tenga la estructura esperada
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          console.warn('⚠️ Calendar: Respuesta de emotions no es un array:', response.data);
          setEvents([]);
        }
        
      } catch (error) {
        console.error('❌ Calendar: Error fetching emotions:', error);
        setError(error.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, []);

  useEffect(() => {
    try {
      console.log('📅 Calendar: Actualizando currentEvents con monthlyEvents:', monthlyEvents);
      setCurrentEvents(monthlyEvents);
    } catch (error) {
      console.error('❌ Calendar: Error actualizando currentEvents:', error);
      setCurrentEvents([]);
    }
  }, [monthlyEvents]);

  const handleDatesSet = useCallback((dateInfo) => {
    try {
      if (dateInfo.view.type === 'dayGridMonth') {
        console.log('📅 Calendar: Vista mensual, usando monthlyEvents');
        setCurrentEvents(monthlyEvents);
      } else {
        console.log('📅 Calendar: Vista detallada, usando events originales');
        setCurrentEvents(events);
      }
    } catch (error) {
      console.error('❌ Calendar: Error en handleDatesSet:', error);
      setCurrentEvents([]);
    }
  }, [monthlyEvents, events]);

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Calendario de Emociones</h1>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando calendario...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si algo salió mal
  if (error) {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Calendario de Emociones</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar el calendario</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no hay eventos
  if (!events || events.length === 0) {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Calendario de Emociones</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">No hay emociones registradas</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Registra algunas emociones para verlas en el calendario.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calendario de Emociones</h1>
      
      {/* Debug info en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md text-sm">
          <p><strong>Debug:</strong> {events.length} eventos cargados, {currentEvents.length} eventos procesados</p>
        </div>
      )}
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={currentEvents}
        eventContent={EventContent}
        datesSet={handleDatesSet}
        height="auto"
      />
    </div>
  );
};

export default Calendar;
