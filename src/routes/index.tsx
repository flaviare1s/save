import { Navigate, Route, Routes } from 'react-router-dom'

import { Dashboard } from '../pages/dashboard'
import { Home } from '../pages/home'
import { Login } from '../pages/login'
import { Onboarding } from '../pages/onboarding'
import { Profile } from '../pages/profile'
import { Register } from '../pages/register'
import { AppLayout } from '../layouts/app-layout'
import { ROUTE_PATHS } from './paths'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTE_PATHS.home} element={<Home />} />
        <Route path={ROUTE_PATHS.onboarding} element={<Onboarding />} />
        <Route path={ROUTE_PATHS.dashboard} element={<Dashboard />} />
        <Route path={ROUTE_PATHS.profile} element={<Profile />} />
      </Route>

      <Route path={ROUTE_PATHS.login} element={<Login />} />
      <Route path={ROUTE_PATHS.register} element={<Register />} />

      <Route path="*" element={<Navigate to={ROUTE_PATHS.home} replace />} />
    </Routes>
  )
}
