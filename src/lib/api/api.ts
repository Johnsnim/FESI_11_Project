import axios from "axios";
import { useAuthStore } from "@/shared/store/auth.store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && !config.url?.includes("signin")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
