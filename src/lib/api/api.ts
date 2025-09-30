import axios from "axios";
import { useAuthStore } from "@/shared/store/auth.store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
