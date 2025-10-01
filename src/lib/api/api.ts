import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: false,
});

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
  interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
}

let authToken: string | null = null;
export const setAuthToken = (t: string | null) => {
  authToken = t;
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authToken;
  if (!token || config.skipAuth) return config;

  const headers = AxiosHeaders.from(config.headers || {});
  if (!headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  config.headers = headers;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err?.response?.status === 401) {
      console.log("401 에러 >> ", err);
    }
    return Promise.reject(err);
  },
);
