export const STICKER_CATEGORIES = [
  {
    id: 'emotions',
    label: 'Emociones',
    keywords: ['emocion', 'cara', 'sentir'],
    stickers: ['😊', '😢', '😠', '😌', '🥺', '🤩', '😰', '😴', '🙏', '🤔'],
  },
  {
    id: 'nature',
    label: 'Naturaleza',
    keywords: ['naturaleza', 'flor', 'mar', 'luna'],
    stickers: ['🌙', '⭐', '🌊', '🌿', '🦋', '🌸', '🌱', '🌈', '☀️', '🍃'],
  },
  {
    id: 'objects',
    label: 'Objetos',
    keywords: ['objeto', 'musica', 'arte'],
    stickers: ['✨', '💫', '🔮', '💎', '🎵', '🎭', '📓', '🕯️', '🎨', '🔥'],
  },
  {
    id: 'food',
    label: 'Comida',
    keywords: ['comida', 'cafe', 'dulce'],
    stickers: ['☕', '🍵', '🍰', '🍓', '🥐', '🍫', '🧁', '🍯', '🥤', '🍜'],
  },
];

export function getAllStickers() {
  return STICKER_CATEGORIES.flatMap((category) =>
    category.stickers.map((emoji) => ({
      emoji,
      categoryId: category.id,
      categoryLabel: category.label,
      keywords: category.keywords,
    })),
  );
}

export function searchStickers(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return getAllStickers();

  return getAllStickers().filter((item) => {
    if (item.categoryLabel.toLowerCase().includes(normalized)) return true;
    return item.keywords.some((keyword) => keyword.includes(normalized));
  });
}
