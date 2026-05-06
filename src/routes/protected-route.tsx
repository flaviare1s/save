import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/auth-context";
import { getNextRouteForUserStatus } from "./flow";
import { ROUTE_PATHS } from "./paths";

export const ProtectedRoute = () => {
  const { user, loading, userStatus, statusLoading } = useAuth();
  const location = useLocation();

  if (loading || statusLoading) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <p className="text-sm text-[var(--text)]">Carregando...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to={ROUTE_PATHS.login} replace />;
  }

  const nextRoute = getNextRouteForUserStatus(userStatus);

  if (nextRoute !== ROUTE_PATHS.dashboard && location.pathname !== nextRoute) {
    return <Navigate to={nextRoute} replace />;
  }

  if (
    nextRoute === ROUTE_PATHS.dashboard &&
    location.pathname === ROUTE_PATHS.onboarding
  ) {
    return <Navigate to={ROUTE_PATHS.dashboard} replace />;
  }

  return <Outlet />;
};
