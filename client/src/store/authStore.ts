import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  authenticate: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

const setAuthToken = (token: string | null) => {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; Path=/; SameSite=Lax`;
    return;
  }

  localStorage.removeItem("token");
  document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      authenticate: (user: User, token: string) => {
        setAuthToken(token);
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
        setAuthToken(token);
        set({
          token,
        });
      },

      logout: () => {
        setAuthToken(null);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
