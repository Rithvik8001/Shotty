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

  // Get current authenticated user
  me: async () => {
    return api.get<AuthResponse>("/auth/me");
  },
};
