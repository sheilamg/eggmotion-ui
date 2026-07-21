import api from './axios';

export const getEmotions = () => api.get('/emotions');
export const getUserEmotions = () => api.get('/emotions-by-user');
export const createUserEmotion = (emotionData) => api.post('/emotions-by-user', emotionData);
export const updateUserEmotion = (id, emotionData) => api.patch(`/emotions-by-user/${id}`, emotionData);
export const deleteUserEmotion = (id) => api.delete(`/emotions-by-user/${id}`);