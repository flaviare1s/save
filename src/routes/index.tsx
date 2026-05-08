import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../layouts/app-layout";
import { Dashboard } from "../pages/dashboard";
import { Login } from "../pages/login";
import { Onboarding } from "../pages/onboarding";
import { Profile } from "../pages/profile";
import { Register } from "../pages/register";
import { ProtectedRoute } from "./protected-route";
import { PublicRoute } from "./public-route";
import { ROUTE_PATHS } from "./paths";
import { Analytics } from "../pages/analytics";
import ArquetipoPage from "../pages/archetypes";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTE_PATHS.onboarding} element={<Onboarding />} />
          <Route path={ROUTE_PATHS.dashboard} element={<Dashboard />} />
          <Route path={ROUTE_PATHS.profile} element={<Profile />} />
          <Route path={ROUTE_PATHS.analytics} element={<Analytics />} />
          <Route path={ROUTE_PATHS.archetypes} element={<ArquetipoPage />} />
        </Route>
      </Route>

      <Route element={<PublicRoute />}>
        <Route path={ROUTE_PATHS.login} element={<Login />} />
        <Route path={ROUTE_PATHS.register} element={<Register />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTE_PATHS.login} replace />} />
    </Routes>
  );
};
