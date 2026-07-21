import api from './axios';

export const getDailyQuote = () => api.get('/quotes/daily');
export const getQuote = (id) => api.get(`/quotes/${id}`);
export const getFavoriteQuotes = () => api.get('/quotes/favorites');
export const toggleQuoteFavorite = (id) => api.post(`/quotes/${id}/favorite`);
export const removeQuoteFavorite = (id) => api.delete(`/quotes/${id}/favorite`);
