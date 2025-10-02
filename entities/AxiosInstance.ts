import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
// ESM import is a readonly view pointing to the original var
// which provids realtime binding
export let axiosInstance: AxiosInstance = axios;
export const updateAxiosInstance = (options?: AxiosRequestConfig) => {
  axiosInstance = axios.create(options);
}