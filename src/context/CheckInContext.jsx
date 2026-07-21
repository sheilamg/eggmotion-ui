import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CheckInContext = createContext(null);

export function CheckInProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialDateTime, setInitialDateTime] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const openCheckIn = useCallback((dateTime = null) => {
    setEditEntry(null);
    setInitialDateTime(dateTime);
    setIsOpen(true);
  }, []);

  const openCheckInForEdit = useCallback((entry) => {
    setEditEntry(entry);
    setInitialDateTime(null);
    setIsOpen(true);
  }, []);

  const closeCheckIn = useCallback(() => {
    setIsOpen(false);
    setInitialDateTime(null);
    setEditEntry(null);
  }, []);

  const notifySaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      initialDateTime,
      editEntry,
      isEditMode: Boolean(editEntry),
      openCheckIn,
      openCheckInForEdit,
      closeCheckIn,
      notifySaved,
      refreshKey,
    }),
    [
      isOpen,
      initialDateTime,
      editEntry,
      openCheckIn,
      openCheckInForEdit,
      closeCheckIn,
      notifySaved,
      refreshKey,
    ],
  );

  return <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>;
}

export function useCheckIn() {
  const ctx = useContext(CheckInContext);
  if (!ctx) {
    throw new Error('useCheckIn debe usarse dentro de CheckInProvider');
  }
  return ctx;
}
