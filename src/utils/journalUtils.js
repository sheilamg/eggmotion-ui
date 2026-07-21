import { getEntryPreviewText } from './journalContentUtils';

function getDayKey(dateValue) {
  return new Date(dateValue).toISOString().split('T')[0];
}

export function filterJournalEntries(entries, { query = '', dateFrom = '', dateTo = '' } = {}) {
  let result = entries || [];

  if (query.trim()) {
    const normalized = query.trim().toLowerCase();
    result = result.filter((entry) => {
      const title = entry.content?.title?.toLowerCase() || '';
      const text = getEntryPreviewText(entry).toLowerCase();
      return title.includes(normalized) || text.includes(normalized);
    });
  }

  if (dateFrom || dateTo) {
    result = result.filter((entry) => {
      const dayKey = getDayKey(entry.createdAt);
      if (dateFrom && dayKey < dateFrom) return false;
      if (dateTo && dayKey > dateTo) return false;
      return true;
    });
  }

  return result;
}

export function getCheckInsForLinking(checkIns, entryDateValue) {
  const entryDay = getDayKey(entryDateValue);
  const sameDay = (checkIns || []).filter(
    (entry) => getDayKey(entry.creationDate) === entryDay,
  );

  if (sameDay.length) {
    return [...sameDay].sort(
      (a, b) => new Date(b.creationDate) - new Date(a.creationDate),
    );
  }

  const cutoff = new Date(entryDateValue);
  cutoff.setDate(cutoff.getDate() - 3);
  cutoff.setHours(0, 0, 0, 0);

  return (checkIns || [])
    .filter((entry) => new Date(entry.creationDate) >= cutoff)
    .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
}

export function getFirstStickerEmoji(entry) {
  const stickers = entry?.content?.stickers;
  if (!Array.isArray(stickers) || !stickers.length) return null;
  const first = stickers[0];
  if (first.type === 'drawing' || first.src) return '✏️';
  return first.emoji || null;
}
