import { create } from "zustand";
import { User } from "@/types";
import { apiClient } from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  authenticate: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  refreshOnStartup: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isRefreshing: false,

  authenticate: (user: User, token: string) => {
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setToken: (token: string) => {
    set({
      token,
    });
  },

  refreshOnStartup: async () => {
    const state = get();
    if (state.token || !state.user) return;
    if (state.isRefreshing) return;

    set({ isRefreshing: true });
    try {
      const response = await apiClient.post<{ token: string; user: User }>("/api/auth/refresh");
      if (response.token) {
        set({
          token: response.token,
          isAuthenticated: true,
          user: response.user,
        });
      }
    } catch {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isRefreshing: false });
    }
  },

  logout: async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch {
      // Ignore logout errors
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
