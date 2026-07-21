import axios from 'axios';
import { getApiBaseUrl } from '../config/local';

const refreshClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
});

export async function refreshAccessToken(refreshToken) {
  const res = await refreshClient.post('/auth/refresh', {
    refresh_token: refreshToken,
  });
  return res.data;
}
