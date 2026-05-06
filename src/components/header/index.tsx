import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, LogIn, LogOut, UserRound } from 'lucide-react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'

import logo from '../../assets/images/logo.png'
import { auth } from '../../firebase/config'
import { ROUTE_PATHS } from '../../routes/paths'

const linkBaseClassName =
  'inline-flex h-11 items-center gap-2 rounded-full px-3 text-[color:var(--text-strong)] transition-colors duration-200'

const brandTitleStyle = {
  backgroundImage: 'linear-gradient(90deg, var(--primary), var(--tertiary))',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    linkBaseClassName,
    'bg-transparent hover:bg-white/6',
    isActive ? 'bg-white/8 text-white' : '',
  ].join(' ')

export const Header = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    return onAuthStateChanged(auth, setUser)
  }, [])

  const handleLogout = () => {
    if (!user) {
      return
    }

    void signOut(auth)
  }

  return (
    <header className="sticky top-0 z-30 bg-[rgba(7,17,12,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to={ROUTE_PATHS.home}
          className="flex items-center justify-center gap-3 rounded-full px-3 py-2 transition-colors"
        >
          <img
            src={logo}
            alt="Save"
            className="h-12 w-12 rounded-full object-cover"
          />
          <h1
            className="m-0 text-2xl sm:text-3xl font-semibold leading-none tracking-[-0.04em] mt-1"
            style={brandTitleStyle}
          >
            Save
          </h1>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to={ROUTE_PATHS.dashboard} className={getNavLinkClassName}>
            <LayoutDashboard className="h-5 w-5" />
            <span className="hidden text-sm font-medium sm:inline">Dashboard</span>
          </NavLink>

          <NavLink to={ROUTE_PATHS.profile} className={getNavLinkClassName}>
            <UserRound className="h-5 w-5" />
            <span className="hidden text-sm font-medium sm:inline">Profile</span>
          </NavLink>

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`${linkBaseClassName} bg-transparent hover:bg-white/6`}
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden text-sm font-medium sm:inline">Logout</span>
            </button>
          ) : (
            <NavLink to={ROUTE_PATHS.login} className={getNavLinkClassName}>
              <LogIn className="h-5 w-5" />
              <span className="hidden text-sm font-medium sm:inline">Login</span>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
