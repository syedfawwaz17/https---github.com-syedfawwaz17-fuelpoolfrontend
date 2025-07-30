
import api from "./api";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  userType: z.enum(["rider", "driver"]),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  userType: z.enum(["rider", "driver"]),
  gender: z.enum(["male", "female", "other"]),
});







const userCache = new Map();

export async function login(data) {
  const response = await api.post("/auth/login", data);
  if (response.data.token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", response.data.token);
      // After setting token, fetch user data
      const user = await getMe();
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  }
  return response.data;
}

export async function registerUser(data) {
  const response = await api.post("/users/register", data);
  return response.data;
}

export async function getMe() {
    try {
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user data", error);
        return null;
    }
}

export async function getUserById(userId) {
    if (userCache.has(userId)) {
        return userCache.get(userId);
    }
    try {
        // In a real app, you would have an endpoint like /api/users/{id}
        // This part needs a real backend endpoint to be fully functional.
        // For now we will mock this, assuming a real API would be at /api/users/{userId}
        const mockUser = {
            id: userId,
            name: "An anonymous user",
            email: "anonymous@example.com",
            profilePhotoUrl: `https://i.pravatar.cc/150?u=${userId}`
        }
        // In a real implementation:
        // const response = await api.get(`/users/${userId}`);
        // const user = response.data;
        // userCache.set(userId, user);
        // return user;

        userCache.set(userId, mockUser);
        return mockUser;

    } catch (error) {
        console.error(`Failed to fetch user ${userId}`, error);
        return null;
    }
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
        // Ensure user is not null, undefined, or the string "undefined" before parsing
        if (user && user !== "undefined") {
            try {
                return JSON.parse(user);
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                // If parsing fails, remove the invalid item
                localStorage.removeItem("user");
                return null;
            }
        }
    }
    return null;
}
