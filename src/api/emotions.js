import api from './axios';

export const getEmotions = () => api.get('/emotions');
export const getUserEmotions = () => api.get('/emotions-by-user');
export const createUserEmotion = (emotionData) => api.post('/emotions-by-user', emotionData); 