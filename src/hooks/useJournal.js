import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createJournal,
  deleteJournal,
  getJournal,
  getJournals,
  updateJournal,
} from '../api/journal';
import { useToast } from '../context/ToastContext';
import { getRequestErrorMessage } from '../utils/networkError';
import { useAuth } from '../auth/AuthContext';
import {
  clearJournalDraft,
  getJournalDraft,
  setJournalDraft,
} from '../utils/offlineCache';
import {
  EMPTY_BODY,
  buildJournalContent,
  hasEntryContent,
  normalizeSticker,
  normalizeStickers,
  parseJournalBody,
} from '../utils/journalContentUtils';

export function useJournalList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getJournals();
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar el diario');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { entries, loading, error, refetch };
}

export function useJournalEditor(entryId) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const isNew = !entryId || entryId === 'new';

  const [journalId, setJournalId] = useState(isNew ? null : entryId);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState(EMPTY_BODY);
  const [stickers, setStickers] = useState([]);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 16));
  const [linkedCheckIn, setLinkedCheckIn] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [notFound, setNotFound] = useState(false);
  const [saveState, setSaveState] = useState('idle');
  const [isDirty, setIsDirty] = useState(false);

  const draftLoadedRef = useRef(false);
  const latestRef = useRef({
    title: '',
    body: EMPTY_BODY,
    stickers: [],
    entryDate: '',
    journalId: null,
    linkedCheckInId: null,
  });

  useEffect(() => {
    latestRef.current = {
      title,
      body,
      stickers,
      entryDate,
      journalId,
      linkedCheckInId: linkedCheckIn?.id || null,
    };
  }, [title, body, stickers, entryDate, journalId, linkedCheckIn]);

  useEffect(() => {
    if (isNew) {
      setJournalId(null);
      setNotFound(false);
      setLoading(false);

      if (user?.id && !draftLoadedRef.current) {
        const draft = getJournalDraft(user.id);
        if (draft) {
          setTitle(draft.title || '');
          setBody(draft.body ? parseJournalBody({ body: draft.body, bodyFormat: 'tiptap-json' }) : parseJournalBody({ text: draft.text }));
          setStickers(normalizeStickers(draft.stickers));
          setEntryDate(draft.entryDate || new Date().toISOString().slice(0, 16));
          setLinkedCheckIn(draft.linkedCheckIn || null);
        } else {
          setTitle('');
          setBody(EMPTY_BODY);
          setStickers([]);
          setEntryDate(new Date().toISOString().slice(0, 16));
          setLinkedCheckIn(null);
        }
        draftLoadedRef.current = true;
      } else if (!user?.id) {
        setTitle('');
        setBody(EMPTY_BODY);
        setStickers([]);
        setEntryDate(new Date().toISOString().slice(0, 16));
        setLinkedCheckIn(null);
      }
      return;
    }

    draftLoadedRef.current = false;

    const load = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await getJournal(entryId);
        const entry = res.data;
        setJournalId(entry.id);
        setTitle(entry.content?.title || '');
        setBody(parseJournalBody(entry.content));
        setStickers(normalizeStickers(entry.content?.stickers));
        setEntryDate(new Date(entry.createdAt).toISOString().slice(0, 16));
        setLinkedCheckIn(entry.linkedCheckIn || null);
        setIsDirty(false);
      } catch {
        setJournalId(null);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [entryId, isNew, user?.id]);

  useEffect(() => {
    if (!isNew || !user?.id || journalId) return undefined;

    const timer = setTimeout(() => {
      setJournalDraft(user.id, {
        title,
        body,
        stickers,
        entryDate,
        linkedCheckIn,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [isNew, user?.id, journalId, title, body, stickers, entryDate, linkedCheckIn]);

  useEffect(() => {
    if (journalId && user?.id) {
      clearJournalDraft(user.id);
    }
  }, [journalId, user?.id]);

  const persist = useCallback(
    async (nextTitle, nextBody, nextStickers, nextEntryDate, currentId, linkedCheckInId) => {
      if (!hasEntryContent(nextTitle, nextBody, nextStickers)) {
        return null;
      }

      const content = buildJournalContent(nextTitle, nextBody, nextStickers);
      const payload = {
        content,
        createdAt: new Date(nextEntryDate).toISOString(),
        isPrivate: true,
        emotionId: linkedCheckInId,
      };

      if (currentId) {
        const res = await updateJournal(currentId, payload);
        return res.data;
      }

      const res = await createJournal(payload);
      return res.data;
    },
    [],
  );

  const runSave = useCallback(
    async (nextTitle, nextBody, nextStickers, nextEntryDate, currentId, linkedCheckInId) => {
      if (!hasEntryContent(nextTitle, nextBody, nextStickers)) {
        setSaveState('idle');
        return null;
      }

      try {
        const saved = await persist(
          nextTitle,
          nextBody,
          nextStickers,
          nextEntryDate,
          currentId,
          linkedCheckInId,
        );

        if (saved?.id) setJournalId(saved.id);
        if (saved?.linkedCheckIn !== undefined) {
          setLinkedCheckIn(saved.linkedCheckIn || null);
        }

        setSaveState('saved');
        setIsDirty(false);
        setTimeout(() => setSaveState('idle'), 2000);
        return saved?.id;
      } catch (err) {
        setSaveState('error');
        const message = getRequestErrorMessage(err, 'No se pudo guardar el diario.');
        showToast({
          message,
          onRetry: () => {
            setSaveState('saving');
            runSave(nextTitle, nextBody, nextStickers, nextEntryDate, currentId, linkedCheckInId);
          },
        });
        return null;
      }
    },
    [persist, showToast],
  );

  const markDirty = useCallback(() => {
    setIsDirty(true);
    if (saveState === 'saved') setSaveState('idle');
  }, [saveState]);

  const saveNow = useCallback(() => {
    const {
      title: t,
      body: b,
      stickers: st,
      entryDate: ed,
      journalId: jid,
      linkedCheckInId,
    } = latestRef.current;

    if (!hasEntryContent(t, b, st)) return Promise.resolve(null);

    setSaveState('saving');
    return runSave(t, b, st, ed, jid, linkedCheckInId);
  }, [runSave]);

  const updateTitle = useCallback(
    (value) => {
      setTitle(value);
      markDirty();
    },
    [markDirty],
  );

  const updateBody = useCallback(
    (value) => {
      setBody(value);
      markDirty();
    },
    [markDirty],
  );

  const updateEntryDate = useCallback(
    (value) => {
      setEntryDate(value);
      markDirty();
    },
    [markDirty],
  );

  const addSticker = useCallback(
    (sticker) => {
      setStickers((prev) => [...prev, normalizeSticker(sticker, prev.length)]);
      markDirty();
    },
    [markDirty],
  );

  const updateSticker = useCallback(
    (id, patch) => {
      setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
      markDirty();
    },
    [markDirty],
  );

  const removeSticker = useCallback(
    (id) => {
      setStickers((prev) => prev.filter((s) => s.id !== id));
      markDirty();
    },
    [markDirty],
  );

  const updateLinkedCheckIn = useCallback(
    (checkInId, displayData = null) => {
      setLinkedCheckIn(checkInId ? displayData || { id: checkInId } : null);
      markDirty();
    },
    [markDirty],
  );

  const removeEntry = useCallback(async () => {
    if (!journalId) return;
    await deleteJournal(journalId);
  }, [journalId]);

  const canSave =
    hasEntryContent(title, body, stickers) && (isDirty || !journalId);

  return {
    journalId,
    title,
    body,
    stickers,
    entryDate,
    linkedCheckIn,
    loading,
    notFound,
    saveState,
    isDirty,
    canSave,
    updateTitle,
    updateBody,
    updateEntryDate,
    addSticker,
    updateSticker,
    removeSticker,
    updateLinkedCheckIn,
    removeEntry,
    saveNow,
  };
}
