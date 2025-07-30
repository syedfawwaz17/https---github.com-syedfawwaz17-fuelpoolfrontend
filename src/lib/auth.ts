import api from "./api";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export async function login(data: LoginInput) {
  const response = await api.post("/auth/login", data);
  if (response.data.token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", response.data.token);
      // Store user data as well
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
  }
  return response.data;
}

export async function registerUser(data: RegisterInput) {
  const response = await api.post("/users/register", data);
  return response.data;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // We use window.location.href to ensure a full page reload which clears all state.
    window.location.href = '/login';
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function getUser() {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
    return null;
}
