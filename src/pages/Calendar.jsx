import React, { useMemo, useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { useUserEmotionsCalendar } from '../hooks/useUserEmotionsCalendar';
import EmotionEventContent from '../components/calendar/EmotionEventContent';
import EmotionDetailsModal from '../components/calendar/EmotionDetailsModal';
import DayEmotionsModal from '../components/calendar/DayEmotionsModal';
import EmotionCreateModal from '../components/calendar/EmotionCreateModal';

const Calendar = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedDayEmotions, setSelectedDayEmotions] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createDateTime, setCreateDateTime] = useState(null);

  const { userEmotions, calendarEvents, monthlyEvents, loading, error, refetch } = useUserEmotionsCalendar();

  const handleDatesSet = useCallback((dateInfo) => {
    setCurrentView(dateInfo.view.type);
  }, []);

  const handleEventClick = useCallback((clickInfo) => {
    const event = clickInfo.event;
    const extendedProps = event.extendedProps;

    if (currentView === 'dayGridMonth' && extendedProps.emotions) {
      // Monthly view - show all emotions for the day
      setSelectedDayEmotions(extendedProps.emotions);
      setSelectedDate(event.start);
    } else {
      // Week/Day view - show single emotion details
      setSelectedEmotion({
        emoji: extendedProps.emotion?.emoji || '😊',
        emotion: extendedProps.emotion?.emotion || extendedProps.emotion?.name || 'Emoción',
        intensity: extendedProps.intensity,
        note: extendedProps.note,
        creationDate: extendedProps.creationDate
      });
    }
  }, [currentView]);

  const closeModals = () => {
    setSelectedEmotion(null);
    setSelectedDayEmotions(null);
    setSelectedDate(null);
    setCreateModalOpen(false);
    setCreateDateTime(null);
  };

  // Determine which events to show based on current view
  const currentEvents = useMemo(() => {
    if (currentView === 'dayGridMonth') {
      return monthlyEvents;
    } else {
      return calendarEvents;
    }
  }, [currentView, monthlyEvents, calendarEvents]);

  const handleDateClick = useCallback((info) => {
    // info.dateStr is in local date; prefer the Date object
    setCreateDateTime(info.date);
    setCreateModalOpen(true);
  }, []);

  const handleSelect = useCallback((selectionInfo) => {
    // selectionInfo has start and end as Date objects
    // We'll pass start for creationDate, but also pass end to modal for UI context
    setCreateDateTime({ start: selectionInfo.start, end: selectionInfo.end });
    setCreateModalOpen(true);
  }, []);

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
  if (!userEmotions || userEmotions.length === 0) {
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
          <p><strong>Debug:</strong> {userEmotions.length} emociones cargadas, {currentEvents.length} eventos procesados</p>
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
        selectable={true}
        events={currentEvents}
        eventContent={EmotionEventContent}
        datesSet={handleDatesSet}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        select={handleSelect}
        // Dynamic slot configuration based on view
        slotDuration={currentView === 'timeGridDay' ? '00:30:00' : '01:00:00'}
        slotLabelInterval={currentView === 'timeGridDay' ? '01:00:00' : '02:00:00'}
        slotLabelFormat={{ 
          hour: '2-digit', 
          minute: currentView === 'timeGridDay' ? '2-digit' : undefined,
          hour12: false 
        }}
        // Show only relevant hours for better readability
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // All days
          startTime: '07:00',
          endTime: '22:00',
        }}
        // Better time display
        scrollTime="07:00:00"
        // Event appearance
        eventDisplay="block"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        height="auto"
      />

      {/* Modals */}
      <EmotionDetailsModal
        isOpen={!!selectedEmotion}
        onClose={closeModals}
        emotionData={selectedEmotion}
      />

      <DayEmotionsModal
        isOpen={!!selectedDayEmotions}
        onClose={closeModals}
        emotions={selectedDayEmotions}
        date={selectedDate}
      />

      <EmotionCreateModal
        isOpen={createModalOpen}
        onClose={closeModals}
        initialDateTime={createDateTime}
        onCreated={refetch}
      />
    </div>
  );
};

export default Calendar;
