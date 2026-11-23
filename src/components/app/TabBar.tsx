import { Home, PenLine, LineChart, Users } from "lucide-react";
import type { CSSProperties } from "react";

export type TabId = "accueil" | "saisie" | "prevision" | "dettes";

interface Tab {
  id: TabId;
  label: string;
  Icon: typeof Home;
}

export const TABS: Tab[] = [
  { id: "accueil", label: "Accueil", Icon: Home },
  { id: "saisie", label: "Saisie", Icon: PenLine },
  { id: "prevision", label: "Prévision", Icon: LineChart },
  { id: "dettes", label: "Dettes", Icon: Users },
];

export default function TabBar({
  active,
  onSelect,
}: {
  active: TabId;
  onSelect: (id: TabId) => void;
}) {
  const index = Math.max(0, TABS.findIndex((tab) => tab.id === active));

  return (
    <nav className="app-tabbar" aria-label="Navigation de l'application">
      {/* Sliding active background: moves via translateX instead of flashing. */}
      <span
        className="app-tabbar__indicator"
        style={{ "--tab-count": TABS.length, "--tab-index": index } as CSSProperties}
        aria-hidden
      />
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`app-tab${isActive ? " app-tab--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onSelect(tab.id)}
          >
            <span className={`icon-pill${isActive ? " icon-pill--active" : ""}`}>
              <tab.Icon size={20} aria-hidden />
            </span>
            <span className="app-tab__label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
