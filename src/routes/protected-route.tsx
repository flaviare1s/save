import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../contexts/auth-context'
import { ROUTE_PATHS } from './paths'

export const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <p className="text-sm text-[var(--text)]">Carregando...</p>
      </main>
    )
  }

  if (!user) {
    return <Navigate to={ROUTE_PATHS.login} replace />
  }

  return <Outlet />
}
