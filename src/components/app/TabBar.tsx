import { Home, PenLine, LineChart, Users } from "lucide-react";

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
  return (
    <nav className="app-tabbar" aria-label="Navigation de l'application">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`app-tab${active === tab.id ? " app-tab--active" : ""}`}
          aria-current={active === tab.id ? "page" : undefined}
          onClick={() => onSelect(tab.id)}
        >
          <tab.Icon size={20} aria-hidden />
          <span className="app-tab__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
