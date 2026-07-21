import { useEffect, useMemo, useState } from 'react';
import { STICKER_CATEGORIES, searchStickers } from '../../constants/stickerCatalog';

function StickerGrid({ filteredStickers, onSelect }) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
      {filteredStickers.map((item) => (
        <button
          key={`${item.categoryId}-${item.emoji}`}
          type="button"
          onClick={() => onSelect(item.emoji)}
          className="press-effect text-2xl p-2 min-h-[44px] rounded-lg"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
          aria-label={`Elegir sticker ${item.emoji}`}
        >
          {item.emoji}
        </button>
      ))}
      {!filteredStickers.length && (
        <p className="col-span-full text-sm text-center py-4" style={{ color: 'var(--text2)' }}>
          No encontramos stickers con esa búsqueda.
        </p>
      )}
    </div>
  );
}

function PickerContent({ onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState(STICKER_CATEGORIES[0].id);
  const [search, setSearch] = useState('');

  const filteredStickers = useMemo(() => {
    if (search.trim()) return searchStickers(search);
    const category = STICKER_CATEGORIES.find((item) => item.id === activeCategory);
    return (category?.stickers || []).map((emoji) => ({
      emoji,
      categoryId: category.id,
      categoryLabel: category.label,
    }));
  }, [activeCategory, search]);

  const handleSelect = (emoji) => {
    onSelect(emoji);
    setSearch('');
    onClose();
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="font-pixel text-[8px]" style={{ color: '#F15BB5' }}>
          ✨ ELEGÍ UN STICKER
        </p>
        <button
          type="button"
          onClick={onClose}
          className="font-pixel text-[8px] min-h-[44px] min-w-[44px] press-effect"
          style={{ color: 'var(--text2)' }}
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar stickers..."
        aria-label="Buscar stickers"
        className="w-full p-3 rounded-lg text-sm outline-none min-h-[44px] mb-3"
        style={{
          backgroundColor: 'var(--surface2)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
      />

      {!search.trim() && (
        <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
          {STICKER_CATEGORIES.map((category) => {
            const active = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className="font-pixel text-[7px] px-3 py-2 min-h-[44px] shrink-0 press-effect"
                style={{
                  color: active ? '#F15BB5' : 'var(--text2)',
                  border: `1px solid ${active ? '#F15BB580' : 'var(--border)'}`,
                  borderRadius: 4,
                  backgroundColor: active ? '#F15BB515' : 'transparent',
                }}
                aria-pressed={active}
              >
                {category.label.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}

      <StickerGrid filteredStickers={filteredStickers} onSelect={handleSelect} />
    </>
  );
}

export default function StickerPicker({ open, anchorRef, onClose, onSelectSticker }) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  if (isMobile) {
    return (
      <div
        className="fixed inset-x-0 bottom-0 z-[60] flex flex-col pointer-events-none lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Selector de stickers"
      >
        <div className="flex-1" onClick={onClose} aria-hidden="true" />
        <div
          className="pointer-events-auto w-full p-4 animate-fade-in"
          style={{
            backgroundColor: 'var(--bg2)',
            borderTop: '1px solid var(--border)',
            borderRadius: '16px 16px 0 0',
            maxHeight: '35vh',
            overflowY: 'auto',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.35)',
          }}
        >
          <PickerContent onSelect={onSelectSticker} onClose={onClose} />
        </div>
      </div>
    );
  }

  const rect = anchorRef?.current?.getBoundingClientRect();
  const top = rect ? rect.bottom + 8 : 80;
  const right = rect ? Math.max(16, window.innerWidth - rect.right) : 16;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[59] hidden lg:block"
        style={{ background: 'transparent' }}
        aria-label="Cerrar selector de stickers"
        onClick={onClose}
      />
      <div
        className="fixed z-[60] hidden lg:block w-[320px] p-4 animate-fade-in"
        style={{
          top,
          right,
          backgroundColor: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          maxHeight: 'min(420px, 60vh)',
          overflowY: 'auto',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Selector de stickers"
      >
        <PickerContent onSelect={onSelectSticker} onClose={onClose} />
      </div>
    </>
  );
}
