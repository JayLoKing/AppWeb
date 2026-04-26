import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { useAuthStore } from "../features/auth/hooks/useAuthStore";

const baseURL:string = "http://localhost:8080/api";

const createAxiosInstance = () : AxiosInstance => {
    return axios.create({baseURL});
}

const setupInterceptors = (httpClient: AxiosInstance) => {
    httpClient.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            config.headers["Content-Type"] = "application/json";
            const { jwt } = useAuthStore.getState();
            if (jwt) {
                config.headers['Authorization'] = `Bearer ${jwt}`;
            }
            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );
}

const initAxios = () : AxiosInstance => {
    const httpClient = createAxiosInstance();
    setupInterceptors(httpClient);
    return httpClient;
}

export const httpClient: AxiosInstance = initAxios();
