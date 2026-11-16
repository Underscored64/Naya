import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// Theme: "light" | "dark". Defaults to the system setting
// (prefers-color-scheme); a manual toggle persists to localStorage "naya-theme".
export type Theme = "light" | "dark";

const KEY = "naya-theme";

function systemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Reads the persisted choice, else the system preference.
function initialTheme(): Theme {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* localStorage may be blocked */
  }
  return systemTheme();
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

type ThemeContextValue = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  // Apply the active theme to <html> and persist manual changes.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(KEY, t);
    } catch {
      /* ignore */
    }
  };

  // Follow the system only while the user has not chosen manually.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(KEY);
      } catch {
        /* ignore */
      }
      if (stored === "light" || stored === "dark") return; // manual wins
      setThemeState(mq.matches ? "dark" : "light");
    };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
      setTheme,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
