const EMOTIONS_CACHE_KEY = 'eggmotion_emotions_cache';

export function getEmotionsCache() {
  try {
    const raw = localStorage.getItem(EMOTIONS_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setEmotionsCache(emotions) {
  try {
    localStorage.setItem(
      EMOTIONS_CACHE_KEY,
      JSON.stringify({ data: emotions, cachedAt: Date.now() }),
    );
  } catch {
    // Storage full or unavailable
  }
}

export function getJournalDraftKey(userId) {
  return userId ? `eggmotion_journal_draft_${userId}` : 'eggmotion_journal_draft_guest';
}

export function getJournalDraft(userId) {
  try {
    const raw = localStorage.getItem(getJournalDraftKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setJournalDraft(userId, draft) {
  try {
    localStorage.setItem(getJournalDraftKey(userId), JSON.stringify(draft));
  } catch {
    // Storage full or unavailable
  }
}

export function clearJournalDraft(userId) {
  localStorage.removeItem(getJournalDraftKey(userId));
}
