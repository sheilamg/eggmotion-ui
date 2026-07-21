import api from './axios';

const INSIGHTS_TIMEOUT_MS = 45000;

export const getWeeklyInsight = () =>
  api.get('/insights/weekly', { timeout: INSIGHTS_TIMEOUT_MS });

export const getPatternInsights = () =>
  api.get('/insights/patterns', { timeout: INSIGHTS_TIMEOUT_MS });

export const getEntryInsight = (entryId) =>
  api.get(`/insights/entry/${entryId}`, { timeout: INSIGHTS_TIMEOUT_MS });

export const getRetrospective = (year) =>
  api.get('/insights/retrospective', {
    params: year ? { year } : undefined,
    timeout: INSIGHTS_TIMEOUT_MS,
  });
