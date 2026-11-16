import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

// Round, outline icon button that flips between light/dark. 44px touch target.
export default function ThemeToggle({ label = "Changer de thème" }: { label?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun size={18} strokeWidth={1.75} aria-hidden /> : <Moon size={18} strokeWidth={1.75} aria-hidden />}
      <span className="sr-only">{isDark ? "Passer en clair" : "Passer en sombre"}</span>
    </button>
  );
}
