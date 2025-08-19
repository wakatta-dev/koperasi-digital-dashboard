import axios, { AxiosError, AxiosRequestConfig } from 'axios';

let accessToken: string | null = null;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  if (accessToken) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && error.config && !error.config.headers?.['x-retry']) {
      try {
        const refresh = await axios.post(
          '/api/auth/refresh',
          { refresh_token: getRefreshTokenFromCookie() },
          { baseURL: api.defaults.baseURL }
        );
        accessToken = refresh.data.access_token;
        error.config.headers = {
          ...(error.config.headers || {}),
          Authorization: `Bearer ${accessToken}`,
          'x-retry': 'true',
        };
        return api(error.config);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export function setAccessToken(token: string) {
  accessToken = token;
}

function getRefreshTokenFromCookie(): string {
  // Implementasi mendapatkan refresh token dari cookie sesuai kebutuhan
  return '';
}
