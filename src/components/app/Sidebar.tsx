import { Link, useLocation } from "react-router-dom";
import { Home, PenLine, Users, TrendingUp, Settings } from "lucide-react";

// The primary screens. `to` is undefined for the "Paramètres" item, which opens a
// sheet instead of navigating (handled by the shell). Icons live in .icon-pills,
// never bare (docs/DESIGN.md §4, §6).
export interface NavItem {
  label: string;
  to?: string;
  icon: typeof Home;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Accueil", to: "/", icon: Home },
  { label: "Saisie", to: "/saisie", icon: PenLine },
  { label: "Dettes", to: "/dettes", icon: Users },
  { label: "Prévision", to: "/prevision", icon: TrendingUp },
];

// The desktop left sidebar (>= 768px). Brand on top, the primary nav in the
// middle, Paramètres pinned at the bottom as a button that opens the sheet.
export default function Sidebar({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { pathname } = useLocation();

  return (
    <aside className="app-sidebar" aria-label="Navigation">
      <div className="app-sidebar__brand">
        <span className="app-sidebar__mark">N</span>
        <span className="app-sidebar__wordmark">Naya</span>
      </div>

      <nav className="app-sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to ?? "/"}
              className={`app-navitem ${active ? "is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className={`icon-pill ${active ? "icon-pill--active" : ""}`}>
                <item.icon size={20} aria-hidden />
              </span>
              <span className="app-navitem__label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="app-navitem app-navitem--settings"
        onClick={onOpenSettings}
      >
        <span className="icon-pill">
          <Settings size={20} aria-hidden />
        </span>
        <span className="app-navitem__label">Paramètres</span>
      </button>
    </aside>
  );
}
