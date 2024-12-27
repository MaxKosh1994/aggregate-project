import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const DEFAULT_TIMEOUT = 10000;

type ExtendedAxiosRequestConfig = InternalAxiosRequestConfig & {
  sent?: boolean;
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true,
});

let accessToken = '';

export function setAccessToken(token: string): void {
  accessToken = token;
}

axiosInstance.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig): ExtendedAxiosRequestConfig => {
    if (config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const controller = new AbortController();
    config.signal = controller.signal;
    setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    return config;
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    //? Запоминаем информацию о предыдущем запросе.
    const prevRequest: ExtendedAxiosRequestConfig | undefined = error.config;

    //? Проверяем статус ответа и метку повторного запроса.
    if (error.response?.status === 403 && prevRequest && !prevRequest.sent) {
      try {
        // ? Делаем запрос на обновление токенов.
        const response = await axiosInstance.get('/tokens/refresh');

        //? Достаём новый токен из ответа.
        accessToken = response.data.accessToken;

        //? Устанавливаем метку повторного запроса.
        prevRequest.sent = true;

        //? Устанавливаем новый заголовок Authorization.
        if (prevRequest.headers) {
          prevRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        //? Повторно отправляем исходный запрос.
        return await axiosInstance(prevRequest);
      } catch (refreshError) {
        if (refreshError instanceof Error) {
          return Promise.reject(refreshError);
        }

        return Promise.reject(new Error('Unknown error occurred during token refresh.'));
      }
    }

    return Promise.reject(error);
  },
);
