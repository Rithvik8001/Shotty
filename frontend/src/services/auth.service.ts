import { api } from "./api";
import type { SignupRequest, LoginRequest, AuthResponse } from "@/types";

export const authService = {
  signup: async (data: SignupRequest) => {
    return api.post<AuthResponse>("/auth/signup", data);
  },

  login: async (data: LoginRequest) => {
    return api.post<AuthResponse>("/auth/login", data);
  },

  logout: async () => {
    return api.post<void>("/auth/logout");
  },

  // Check if user is authenticated by attempting to fetch their URLs
  // If it fails with 401, user is not authenticated
  checkAuth: async (): Promise<boolean> => {
    try {
      await api.get("/url/all");
      return true;
    } catch {
      return false;
    }
  },
};
