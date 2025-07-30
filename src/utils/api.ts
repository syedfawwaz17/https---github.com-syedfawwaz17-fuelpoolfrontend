// src/utils/api.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

// Add JWT token to every request if present
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Optional: Redirect to login page on 401
api.interceptors.response.use(undefined, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return Promise.reject(err);
});

export default api;
