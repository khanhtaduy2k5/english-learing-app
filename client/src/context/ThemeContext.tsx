"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  // On mount, load from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    if (saved && ["light", "dark", "system"].includes(saved)) {
      setThemeState(saved);
    }
  }, []);

  // Resolve actual theme based on mode + system preference
  useEffect(() => {
    if (!mounted) return;

    const applyTheme = (mode: ThemeMode) => {
      if (typeof window === "undefined") return;
      const root = document.documentElement;
      let resolved: "light" | "dark";

      if (mode === "system") {
        resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      } else {
        resolved = mode;
      }

      setResolvedTheme(resolved);

      if (resolved === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    };

    applyTheme(theme);

    // Listen to system preference changes when mode is "system"
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }

    return () => {}; // Always return a cleanup function or nothing consistently
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeMode) => {
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
