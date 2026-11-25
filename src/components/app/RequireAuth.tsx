import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Gate a route on authentication. While the session is still loading we render
// nothing (no flash of the login page for a logged-in user); once resolved,
// unauthenticated visitors are redirected to /login.
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
