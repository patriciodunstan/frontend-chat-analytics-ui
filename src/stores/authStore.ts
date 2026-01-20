/**
 * Auth store using Zustand.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, ApiError } from "../types";
import { authApi } from "../services/api";
import { AxiosError } from "axios";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          const { access_token, user } = response.data;

          localStorage.setItem("token", access_token);

          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          const error = err as AxiosError<ApiError>;
          set({
            error: error.response?.data?.detail || "Error al iniciar sesión",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (email: string, password: string, fullName: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(email, password, fullName);
          const { access_token, user } = response.data;

          localStorage.setItem("token", access_token);

          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          const error = err as AxiosError<ApiError>;
          set({
            error: error.response?.data?.detail || "Error al registrarse",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await authApi.getMe();
          set({
            user: response.data,
            token,
            isAuthenticated: true,
          });
        } catch {
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
      }),
    },
  ),
);
