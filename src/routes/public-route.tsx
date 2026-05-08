import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/auth-context";
import { ROUTE_PATHS } from "./paths";

export const PublicRoute = () => {
  const { user, loading, statusLoading } = useAuth();

  if (loading || statusLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <p className="text-sm text-(--text)">Carregando...</p>
      </main>
    );
  }

  if (user) {
    return <Navigate to={ROUTE_PATHS.dashboard} replace />;
  }

  return <Outlet />;
};
