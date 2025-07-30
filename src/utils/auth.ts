// src/utils/auth.ts
import api from "./api";

// Login
export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
}

// Register
export async function registerUser(userObj: any) {
  const res = await api.post("/users/register", userObj);
  return res.data;
}

// Logout
export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
