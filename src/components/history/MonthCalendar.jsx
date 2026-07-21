import { getEmotionNeonColor, buildCalendarDays } from '../../utils/emotionUtils';
import { toDateKey } from '../../utils/uiUtils';
import Eyebrow from '../ui/Eyebrow';
import SurfaceCard from '../ui/SurfaceCard';

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function MonthCalendar({ userEmotions }) {
  const today = new Date();
  const monthName = today.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  const calendarDays = buildCalendarDays(userEmotions);

  return (
    <SurfaceCard className="p-5">
      <Eyebrow color="#FEE440">■ CALENDARIO</Eyebrow>
      <h3 className="font-display text-lg font-bold mb-4 capitalize" style={{ color: 'var(--text)' }}>
        {monthName}
      </h3>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="font-pixel text-center text-[7px] pb-1"
            style={{ color: 'var(--text2)' }}
          >
            {d.slice(0, 1)}
          </div>
        ))}
        {calendarDays.map((day) => {
          const isToday = day.iso === toDateKey(today);
          const emotionName = day.entry?.emotion?.emotion || day.entry?.emotion?.name;
          const color = emotionName ? getEmotionNeonColor(emotionName) : null;
          return (
            <div
              key={day.iso}
              className="flex flex-col items-center gap-0.5 p-1 min-h-[40px]"
              style={{
                borderRadius: 6,
                opacity: day.isCurrentMonth ? 1 : 0.3,
                border: isToday ? '2px solid #9B5DE5' : '2px solid transparent',
                boxShadow: isToday ? '0 0 10px #9B5DE560' : 'none',
              }}
            >
              <span
                className="font-pixel text-[7px]"
                style={{ color: isToday ? '#9B5DE5' : 'var(--text2)' }}
              >
                {day.date.getDate()}
              </span>
              {color && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: color,
                    boxShadow: `0 0 6px ${color}`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
