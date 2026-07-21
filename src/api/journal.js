import api from './axios';

export const getJournals = () => api.get('/journal');
export const getJournal = (id) => api.get(`/journal/${id}`);
export const createJournal = (data) => api.post('/journal', data);
export const updateJournal = (id, data) => api.patch(`/journal/${id}`, data);
export const deleteJournal = (id) => api.delete(`/journal/${id}`);