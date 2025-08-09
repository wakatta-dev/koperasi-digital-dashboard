/** @format */

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = (session as any)?.accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("accessToken");
      // Optional: redirect to login page
    }
    return Promise.reject(err);
  }
);

export default api;
