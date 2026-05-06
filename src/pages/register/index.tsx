import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthShell } from '../../components/auth-shell'
import {
  getAuthErrorMessage,
  loginWithGoogle,
  registerWithEmail,
} from '../../firebase/auth'
import { getUserStatus } from '../../firebase/user-status'
import { getNextRouteForUserStatus } from '../../routes/flow'
import { ROUTE_PATHS } from '../../routes/paths'

export const Register = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const goToNextRoute = async (userId: string) => {
    const status = await getUserStatus(userId)
    navigate(getNextRouteForUserStatus(status), { replace: true })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await registerWithEmail(name, email, password)
      await goToNextRoute(result.user.uid)
    } catch (currentError) {
      setError(getAuthErrorMessage(currentError))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await loginWithGoogle()
      await goToNextRoute(result.user.uid)
    } catch (currentError) {
      setError(getAuthErrorMessage(currentError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Comece a organizar sua vida financeira."
      footer={
        <>
          Ja tem conta?{" "}
          <Link to={ROUTE_PATHS.login} className="text-(--secondary)">
            Entrar
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-2xl border-0 bg-white/6 px-4 py-3 text-(--text-strong) outline-none ring-1 ring-white/8 placeholder:text-(--text) focus:ring-(--primary)"
          required
        />
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
          minLength={6}
        />

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-(--primary) px-4 py-3 font-medium text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </button>

        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full rounded-2xl bg-white/6 px-4 py-3 font-medium text-(--text-strong) ring-1 ring-white/8 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          Continuar com Google
        </button>
      </form>
    </AuthShell>
  );
}
