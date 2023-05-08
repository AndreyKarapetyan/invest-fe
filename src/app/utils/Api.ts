import axios, { AxiosInstance, AxiosPromise } from 'axios';
import qs from 'qs';
import { BASE_API_URL, USER_REFRESH_TOKEN_URL } from '../../config';
import { getAuth, LOCAL_STORAGE_KEYS, setAuth } from './auth';

const setTokenInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config) => {
      const { accessToken } = getAuth();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        !originalRequest.retry &&
        originalRequest.url !== USER_REFRESH_TOKEN_URL
      ) {
        const { refreshToken: refresh_token } = getAuth();
        if (refresh_token) {
          const { data } = await instance.post(USER_REFRESH_TOKEN_URL, {
            refreshToken: refresh_token,
          });
          const { accessToken, refreshToken } = data;
          setAuth(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          setAuth(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return instance(originalRequest);
        }
      }
      throw error;
    }
  );
};

export class Api {
  static instance: Api;

  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_API_URL,
      timeout: 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    setTokenInterceptors(this.axiosInstance);
  }

  static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  static getAxios(): AxiosInstance {
    return Api.getInstance().axiosInstance;
  }

  static get<T = any>(url: string, params: any = {}): AxiosPromise<T> {
    if (params && params.qs) {
      const { qs: queryParams } = params;
      const stringified = qs.stringify(queryParams);
      url = `${url}?${stringified}`;
    }
    return Api.getAxios().get(url);
  }

  static delete<T = any>(
    url: string,
    params?: Record<string, any>
  ): AxiosPromise<T> {
    return Api.getAxios().delete(url, {
      data: params,
    });
  }

  static post<T = any>(
    url: string,
    data?: Record<string, any>
  ): AxiosPromise<T> {
    return Api.getAxios().post(url, data);
  }

  static put<T = any>(
    url: string,
    data?: Record<string, any>
  ): AxiosPromise<T> {
    return Api.getAxios().put(url, data);
  }
}
