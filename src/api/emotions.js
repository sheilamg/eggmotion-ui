import api from './axios';

export const getEmotions = () => api.get('/emotions');
// export const getEmotion = (id) => api.get(`/emotions/${id}`);
// export const createEmotion = (emotion) => api.post('/emotions', emotion);
// export const updateEmotion = (id, emotion) => api.patch(`/emotions/${id}`, emotion);
// export const deleteEmotion = (id) => api.delete(`/emotions/${id}`); 