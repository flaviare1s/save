import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../../contexts/auth-context'
import { getDashboardData, updateDashboardSettings } from '../../firebase/dashboard'
import type { CategorySpend, DashboardData } from '../../firebase/dashboard-types'
import { ROUTE_PATHS } from '../../routes/paths'

type FormState = {
  income: string
  monthlyBudget: string
  savingsGoal: string
  categories: CategorySpend[]
}

const inputClassName =
  'w-full rounded-2xl border-0 bg-white/6 px-4 py-3 text-[var(--text-strong)] outline-none ring-1 ring-white/8 placeholder:text-[var(--text)] focus:ring-[var(--primary)]'

const toFormState = (data: DashboardData): FormState => ({
  income: String(data.income),
  monthlyBudget: String(data.monthlyBudget),
  savingsGoal: String(data.savingsGoal),
  categories: data.categories,
})

export const Profile = () => {
  const { user, firstName, loading: authLoading } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [form, setForm] = useState<FormState | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setMessage('')

      if (!user) {
        setDashboardData(null)
        setForm(null)
        setLoading(false)
        return
      }

      try {
        const data = await getDashboardData(user.uid)
        setDashboardData(data)
        setForm(data ? toFormState(data) : null)
      } catch {
        setMessage('Não foi possível carregar suas configurações.')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      void loadDashboard()
    }
  }, [authLoading, user])

  const handleBaseChange =
    (field: 'income' | 'monthlyBudget' | 'savingsGoal') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!form) {
        return
      }

      setForm({ ...form, [field]: event.target.value })
    }

  const handleCategoryChange =
    (index: number, field: 'amount' | 'budget') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!form) {
        return
      }

      const categories = form.categories.map((category, currentIndex) => {
        if (currentIndex !== index) {
          return category
        }

        return {
          ...category,
          [field]: Number(event.target.value) || 0,
        }
      })

      setForm({ ...form, categories })
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user || !dashboardData || !form) {
      return
    }

    setSaving(true)
    setMessage('')

    try {
      await updateDashboardSettings(user.uid, dashboardData, {
        income: Number(form.income) || 0,
        monthlyBudget: Number(form.monthlyBudget) || 0,
        savingsGoal: Number(form.savingsGoal) || 0,
        categories: form.categories,
      })

      const nextData = {
        ...dashboardData,
        income: Number(form.income) || 0,
        monthlyBudget: Number(form.monthlyBudget) || 0,
        savingsGoal: Number(form.savingsGoal) || 0,
        totalSpent: form.categories.reduce((sum, category) => sum + category.amount, 0),
        categories: form.categories,
      }

      setDashboardData(nextData)
      setForm(toFormState(nextData))
      setMessage('Configurações salvas com sucesso.')
    } catch {
      setMessage('Não foi possível salvar suas configurações.')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-4xl items-center justify-center px-4 py-10 sm:px-6">
        <p className="text-sm text-(--text)">Carregando perfil...</p>
      </main>
    )
  }

  if (!form) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full rounded-3xl bg-white/5 p-6 text-center ring-1 ring-white/8">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-(--text-strong)">
            Defina seus dados primeiro
          </h1>
          <p className="mt-3 text-sm text-(--text)">
            Complete o onboarding para criar suas preferências, metas e valores
            iniciais do dashboard.
          </p>
          <Link
            to={ROUTE_PATHS.onboarding}
            className="mt-5 inline-flex rounded-2xl bg-(--primary) px-5 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
          >
            Ir para onboarding
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm text-(--secondary)">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-(--text-strong)">
          {firstName ? `${firstName}, ajuste suas metas` : 'Metas e valores'}
        </h1>
        <p className="mt-3 text-sm text-(--text)">
          Ajuste sua renda, seu orçamento mensal, sua meta de economia e os
          valores de cada categoria.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <section className="grid gap-4 rounded-3xl bg-white/5 p-5 ring-1 ring-white/8 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm text-(--text)">Renda mensal</span>
            <input
              type="number"
              min="0"
              value={form.income}
              onChange={handleBaseChange('income')}
              className={inputClassName}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-(--text)">Orçamento mensal</span>
            <input
              type="number"
              min="0"
              value={form.monthlyBudget}
              onChange={handleBaseChange('monthlyBudget')}
              className={inputClassName}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-(--text)">Meta de economia</span>
            <input
              type="number"
              min="0"
              value={form.savingsGoal}
              onChange={handleBaseChange('savingsGoal')}
              className={inputClassName}
            />
          </label>
        </section>

        <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/8">
          <h2 className="text-lg font-semibold text-(--text-strong)">
            Categorias
          </h2>
          <div className="mt-4 space-y-4">
            {form.categories.map((category, index) => (
              <div
                key={category.name}
                className="grid gap-4 rounded-2xl bg-white/4 p-4 md:grid-cols-[1fr_1fr_1fr]"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-(--text-strong)">
                    {category.name}
                  </p>
                  <p className="text-xs text-(--text)">
                    Ajuste gasto atual e limite da categoria.
                  </p>
                </div>

                <label className="space-y-2">
                  <span className="text-sm text-(--text)">Gasto</span>
                  <input
                    type="number"
                    min="0"
                    value={category.amount}
                    onChange={handleCategoryChange(index, 'amount')}
                    className={inputClassName}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm text-(--text)">Meta</span>
                  <input
                    type="number"
                    min="0"
                    value={category.budget}
                    onChange={handleCategoryChange(index, 'budget')}
                    className={inputClassName}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        {message ? (
          <p
            className={`text-sm ${
              message.includes('sucesso') ? 'text-emerald-300' : 'text-red-300'
            }`}
          >
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer rounded-2xl bg-(--primary) px-5 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </form>
    </main>
  )
}
