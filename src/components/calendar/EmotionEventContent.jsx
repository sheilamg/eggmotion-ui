import React from 'react';

const EmotionEventContent = (eventInfo) => {
  const { emoji, time, note } = eventInfo.event.extendedProps;
  const viewType = eventInfo.view.type;

  // For monthly view, show just the emoji
  if (viewType === 'dayGridMonth') {
    return (
      <div className="text-center text-lg">
        {emoji}
      </div>
    );
  }

  // For week and day views, show compact format
  return (
    <div className="flex items-center space-x-1 text-sm">
      <span className="text-lg">{emoji}</span>
      <span className="text-xs text-gray-600 font-mono">{time}</span>
      {note && (
        <span className="text-xs text-gray-500 truncate max-w-20" title={note}>
          {note}
        </span>
      )}
    </div>
  );
};

export default EmotionEventContent;


