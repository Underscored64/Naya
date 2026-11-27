import { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Sidebar from "../components/app/Sidebar";
import TabBar from "../components/app/TabBar";
import Accueil from "../components/app/Accueil";
import Saisie from "../components/app/Saisie";
import Dettes from "../components/app/Dettes";
import Placeholder from "../components/app/Placeholder";
import SettingsSheet from "../components/app/SettingsSheet";
import RequireAuth from "../components/app/RequireAuth";
import "../components/app/app.css";

// The authenticated shell. Full-screen, not a centered card: a fixed left sidebar
// on desktop (>= 768px) and a floating .glass-nav on mobile, with the content
// filling the rest of the screen. No motion here (that is task 09).
export default function AppShell() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const openSettings = () => setSettingsOpen(true);

  return (
    <RequireAuth>
      <div className="app-shell">
        <Sidebar onOpenSettings={openSettings} />

        <main className="app-main">
          <header className="app-mobile-header">
            <Link to="/" className="app-mobile-header__brand">
              <span className="app-mobile-header__mark">N</span>
              <span className="app-mobile-header__wordmark">Naya</span>
            </Link>
          </header>

          <div className="app-scroll">
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/saisie" element={<Saisie />} />
              <Route path="/dettes" element={<Dettes />} />
              <Route
              path="/prevision"
              element={
                <Placeholder
                  title="Prévision"
                  message="Très bientôt : Naya vous dira, jour par jour, si vous avez de quoi tenir."
                />
              }
            />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        <TabBar onOpenSettings={openSettings} />
        <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </RequireAuth>
  );
}
