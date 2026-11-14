import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Settings } from "lucide-react";
import { AppStateProvider, useAppState } from "../data/state";
import TabBar, { type TabId } from "../components/app/TabBar";
import Accueil from "../components/app/Accueil";
import NeedsList from "../components/app/NeedsList";
import SettingsSheet from "../components/app/SettingsSheet";
import Placeholder from "../components/app/Placeholder";
import "../components/app/app.css";

function Screen({ tab }: { tab: TabId }) {
  switch (tab) {
    case "accueil":
      return (
        <>
          <Accueil />
          <NeedsList />
        </>
      );
    case "saisie":
      return <Placeholder title="Saisie" message="À venir (tâche 07) : dictez vos ventes et dettes, puis validez." />;
    case "prevision":
      return <Placeholder title="Prévision" message="À venir (tâche 08) : votre solde jour par jour, avec les zones rouges." />;
    case "dettes":
      return <Placeholder title="Dettes" message="À venir (tâche 10) : relancez vos clients par WhatsApp." />;
  }
}

function Shell() {
  const [tab, setTab] = useState<TabId>("accueil");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { reset } = useAppState();

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <Link to="/" className="app-topbar__brand">
          <Sparkles size={18} aria-hidden /> Naya
        </Link>
        <button
          type="button"
          className="app-iconbtn"
          aria-label="Réglages"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings size={20} aria-hidden />
        </button>
      </header>

      <main className="container app-content">
        <Screen tab={tab} />
      </main>

      <TabBar active={tab} onSelect={setTab} />
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} onReset={reset} />
    </div>
  );
}

export default function AppShell() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
