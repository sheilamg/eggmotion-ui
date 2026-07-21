import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useUserEmotionsCalendar } from '../../hooks/useUserEmotionsCalendar';
import EmotionEventContent from '../calendar/EmotionEventContent';
import { useCheckIn } from '../../context/CheckInContext';
import Eyebrow from '../ui/Eyebrow';
import SurfaceCard from '../ui/SurfaceCard';
import DayEmotionsPicker from './DayEmotionsPicker';

export default function CalendarSection() {
  const navigate = useNavigate();
  const { openCheckIn } = useCheckIn();
  const { userEmotions, calendarEvents, monthlyEvents, loading, error } =
    useUserEmotionsCalendar();

  const [dayPicker, setDayPicker] = useState(null);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [expanded, setExpanded] = useState(false);

  const entriesById = useMemo(() => {
    const map = new Map();
    userEmotions.forEach((entry) => map.set(entry.id, entry));
    return map;
  }, [userEmotions]);

  const currentEvents = useMemo(() => {
    if (currentView === 'dayGridMonth') return monthlyEvents;
    return calendarEvents;
  }, [currentView, monthlyEvents, calendarEvents]);

  const handleDatesSet = useCallback((dateInfo) => {
    setCurrentView(dateInfo.view.type);
  }, []);

  const openEntry = useCallback(
    (entry) => {
      if (entry?.id) navigate(`/history/${entry.id}`);
    },
    [navigate],
  );

  const handleEventClick = useCallback(
    (clickInfo) => {
      const event = clickInfo.event;
      const { extendedProps } = event;

      if (currentView === 'dayGridMonth' && extendedProps.emotions) {
        const dayEntries = extendedProps.emotions
          .map((item) => entriesById.get(item.id))
          .filter(Boolean)
          .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

        if (dayEntries.length === 1) {
          openEntry(dayEntries[0]);
          return;
        }

        setDayPicker({ date: event.start, entries: dayEntries });
        return;
      }

      const entry = entriesById.get(extendedProps.id);
      if (entry) openEntry(entry);
    },
    [currentView, entriesById, openEntry],
  );

  const handleDateClick = useCallback(
    (info) => {
      openCheckIn(info.date);
    },
    [openCheckIn],
  );

  if (loading) {
    return (
      <SurfaceCard className="p-6">
        <p style={{ color: 'var(--text2)' }}>Cargando calendario...</p>
      </SurfaceCard>
    );
  }

  if (error) {
    return (
      <SurfaceCard className="p-6">
        <p style={{ color: '#FF1E73' }}>{error}</p>
      </SurfaceCard>
    );
  }

  return (
    <>
      <SurfaceCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <Eyebrow color="#00F5D4">◎ VISTA COMPLETA</Eyebrow>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="font-pixel text-[8px] px-3 py-2 press-effect min-h-[44px]"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 4,
              color: 'var(--text2)',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            {expanded ? 'OCULTAR' : 'MOSTRAR'}
          </button>
        </div>

        {!userEmotions?.length ? (
          <p style={{ color: 'var(--text2)' }}>
            Registrá emociones para verlas en el calendario.
          </p>
        ) : (
          expanded && (
            <div className="history-calendar [&_.fc]:text-[var(--text)] [&_.fc-button]:bg-[var(--surface)] [&_.fc-button]:border-[var(--border)] [&_.fc-button]:text-[var(--text)]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="es"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                selectable
                events={currentEvents}
                eventContent={EmotionEventContent}
                datesSet={handleDatesSet}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                height="auto"
              />
            </div>
          )
        )}
      </SurfaceCard>

      {dayPicker && (
        <DayEmotionsPicker
          date={dayPicker.date}
          entries={dayPicker.entries}
          onClose={() => setDayPicker(null)}
          onSelect={(entry) => {
            setDayPicker(null);
            openEntry(entry);
          }}
        />
      )}
    </>
  );
}
