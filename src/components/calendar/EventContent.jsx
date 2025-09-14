import React from 'react';

const EventContent = (eventInfo) => {
  const { emoji, note } = eventInfo.event.extendedProps;
  return (
    <div className="text-center text-xl">
      {emoji}
      {eventInfo.view.type === 'timeGridDay' && note && (
        <div className="text-xs mt-1 text-gray-600">{note}</div>
      )}
    </div>
  );
};

export default EventContent; 