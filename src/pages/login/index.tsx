import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthShell } from "../../components/auth-shell";
import {
  getAuthErrorMessage,
  loginWithEmail,
  loginWithGoogle,
} from "../../firebase/auth";
import { ROUTE_PATHS } from "../../routes/paths";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const goToDashboard = () => {
    console.log("[Login] Navigating to dashboard");
    navigate(ROUTE_PATHS.dashboard);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    console.log("[Login] Form submit with email:", email);

    try {
      const result = await loginWithEmail(email, password);
      console.log("[Login] Email login success:", result.user.uid);
      goToDashboard();
    } catch (currentError) {
      const msg = getAuthErrorMessage(currentError);
      console.log("[Login] Email login error:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    console.log("[Login] Google login button clicked");

    try {
      const result = await loginWithGoogle();
      console.log("[Login] Google login success:", result.user.uid);
      goToDashboard();
    } catch (currentError) {
      const msg = getAuthErrorMessage(currentError);
      console.log("[Login] Google login error:", msg);
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Entrar"
      subtitle="Acesse sua conta para continuar."
      footer={
        <>
          Não tem conta?{" "}
          <Link to={ROUTE_PATHS.register} className="text-(--secondary)">
            Criar conta
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border-0 bg-white/6 px-4 py-3 text-(--text-strong) outline-none ring-1 ring-white/8 placeholder:text-(--text) focus:ring-(--primary)"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border-0 bg-white/6 px-4 py-3 text-(--text-strong) outline-none ring-1 ring-white/8 placeholder:text-(--text) focus:ring-(--primary)"
          required
        />

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-(--primary) px-4 py-3 font-medium text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full rounded-2xl bg-white/6 px-4 py-3 font-medium text-(--text-strong) ring-1 ring-white/8 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          Entrar com Google
        </button>
      </form>
    </AuthShell>
  );
};
