import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { toast } from 'sonner';
import { VITE_REACT_APP_API_URL } from './Env';
import { useLoaderStore } from '../store/Store';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: VITE_REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    useLoaderStore.getState().showLoader();
    return config;
  },
  (error) => {
    useLoaderStore.getState().hideLoader();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    useLoaderStore.getState().hideLoader();
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    toast.error(message);
    useLoaderStore.getState().hideLoader();
    // Important: must reject, not resolve, so callers' try/catch and
    // react-query's onError actually fire instead of treating this as success.
    return Promise.reject(error);
  }
);

export default axiosInstance;