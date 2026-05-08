import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChartLine,
  DiamondPlus,
  Drama,
  LayoutDashboard,
  LogIn,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";

import logo from "../../assets/images/logo.png";
import { useAuth } from "../../contexts/auth-context";
import { auth } from "../../firebase/config";
import { ROUTE_PATHS } from "../../routes/paths";

const linkBaseClassName =
  "inline-flex h-11 items-center gap-2 rounded-full px-3 text-[color:var(--text-strong)] transition-colors duration-200";

const brandTitleStyle = {
  backgroundImage: "linear-gradient(90deg, var(--primary), var(--tertiary))",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    linkBaseClassName,
    "bg-transparent hover:bg-white/6",
    isActive ? "bg-white/8 text-white" : "",
  ].join(" ");

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!user) {
      return;
    }

    void signOut(auth).finally(() => {
      navigate(ROUTE_PATHS.login, { replace: true });
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-[rgba(7,17,12,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to={ROUTE_PATHS.home}
          className="flex flex-shrink-0 items-center justify-center gap-3 rounded-full px-3 py-2 transition-colors"
        >
          <img
            src={logo}
            alt="Save"
            className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
          />
          <h1
            className="m-0 text-2xl sm:text-3xl font-semibold leading-none tracking-[-0.04em] mt-1 hidden md:block"
            style={brandTitleStyle}
          >
            Save
          </h1>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to={ROUTE_PATHS.dashboard} className={getNavLinkClassName}>
            <LayoutDashboard className="h-5 w-5" />
            <span className="hidden text-sm font-medium sm:inline">
              Dashboard
            </span>
          </NavLink>

          <NavLink to={ROUTE_PATHS.onboarding} className={getNavLinkClassName}>
            <DiamondPlus className="h-5 w-5" />
            <span className="hidden text-sm font-medium sm:inline">
              Novo Gasto
            </span>
          </NavLink>

          <NavLink to={ROUTE_PATHS.analytics} className={getNavLinkClassName}>
            <ChartLine className="h-5 w-5" />
            <span className="hidden text-sm font-medium sm:inline">
              Análise
            </span>
          </NavLink>

          <NavLink to={ROUTE_PATHS.archetypes} className={getNavLinkClassName}>
            <Drama className="h-5 w-5" />
            <span className="hidden text-sm font-medium sm:inline">
              <span className="hidden lg:inline">Meu</span> Arquétipo
            </span>
          </NavLink>

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`${linkBaseClassName} bg-transparent hover:bg-white/6 cursor-pointer`}
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden text-sm font-medium sm:inline">
                Logout
              </span>
            </button>
          ) : (
            <NavLink to={ROUTE_PATHS.login} className={getNavLinkClassName}>
              <LogIn className="h-5 w-5" />
              <span className="hidden text-sm font-medium sm:inline">
                Login
              </span>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};
