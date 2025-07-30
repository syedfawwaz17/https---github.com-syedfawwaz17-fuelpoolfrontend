import api from "./api";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
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
