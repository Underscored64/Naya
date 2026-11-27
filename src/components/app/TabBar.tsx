import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";
import { NAV_ITEMS } from "./Sidebar";

// The mobile bottom bar (docs/DESIGN.md §6: ".glass-nav", the primary nav in one
// row). It shows the four primary screens; Paramètres is an icon-only button at
// the end (no label) that opens the sheet. Hidden on desktop, where the sidebar
// handles navigation.
export default function TabBar({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { pathname } = useLocation();

  return (
    <nav className="glass-nav" aria-label="Navigation">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.label}
            to={item.to ?? "/"}
            className={`glass-nav__item ${active ? "is-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="icon-pill">
              <item.icon size={18} aria-hidden />
            </span>
            <span className="glass-nav__label">{item.label}</span>
          </Link>
        );
      })}

      <button
        type="button"
        className="glass-nav__item glass-nav__item--icon"
        aria-label="Paramètres"
        onClick={onOpenSettings}
      >
        <span className="icon-pill">
          <Settings size={18} aria-hidden />
        </span>
      </button>
    </nav>
  );
}
