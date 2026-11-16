import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import AppShell from "./pages/AppShell";
import { ThemeProvider } from "./hooks/useTheme";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app/*" element={<AppShell />} />
      </Routes>
    </ThemeProvider>
  );
}
