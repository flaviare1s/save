import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTE_PATHS } from '../../routes/paths'

const categories = ['Alimentação', 'Moradia', 'Transporte', 'Lazer']
const priorities = ['Economizar mais', 'Entender excessos', 'Receber alertas simples']
const views = ['Categorias principais', 'Padrões de consumo', 'Insights rápidos']

const cardClassName =
  'rounded-2xl bg-white/5 p-5 ring-1 ring-white/8 backdrop-blur'

type OptionGroupProps = {
  title: string
  options: string[]
  value: string
  onSelect: (option: string) => void
}

const OptionGroup = ({ title, options, value, onSelect }: OptionGroupProps) => {
  return (
    <section className={cardClassName}>
      <h2 className="text-lg font-semibold text-(--text-strong)">{title}</h2>

      <div className="mt-4 flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = value === option

          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm transition ${
                isActive
                  ? 'bg-(--primary) text-slate-950'
                  : 'bg-white/6 text-(--text-strong) hover:bg-white/10'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export const Onboarding = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState(categories[0])
  const [priority, setPriority] = useState(priorities[0])
  const [view, setView] = useState(views[0])

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm text-(--secondary)">Onboarding</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-(--text-strong)">
          Vamos comecar pelas categorias
        </h1>
        <p className="mt-3 text-sm text-(--text)">
          Este app vai analisar seus padrões de consumo. Escolha suas
          preferências principais para personalizar a experiência.
        </p>
      </div>

      <div className="space-y-4">
        <OptionGroup
          title="Qual categoria voce quer acompanhar mais de perto?"
          options={categories}
          value={category}
          onSelect={setCategory}
        />

        <OptionGroup
          title="Que tipo de ajuda voce mais espera?"
          options={priorities}
          value={priority}
          onSelect={setPriority}
        />

        <OptionGroup
          title="Como voce prefere visualizar seus habitos?"
          options={views}
          value={view}
          onSelect={setView}
        />
      </div>

      <section className="mt-6 rounded-2xl bg-white/5 p-5 ring-1 ring-white/8">
        <h2 className="text-base font-semibold text-(--text-strong)">
          Resumo
        </h2>

        <p className="mt-3 text-sm text-(--text)">
          Categoria principal:{' '}
          <span className="text-(--text-strong)">{category}</span>
        </p>

        <p className="mt-2 text-sm text-(--text)">
          Preferência:{' '}
          <span className="text-(--text-strong)">{priority}</span>
        </p>

        <p className="mt-2 text-sm text-(--text)">
          Visão desejada: <span className="text-(--text-strong)">{view}</span>
        </p>

        <button
          type="button"
          onClick={() => navigate(ROUTE_PATHS.dashboard)}
          className="mt-5 cursor-pointer rounded-2xl bg-(--primary) px-5 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
        >
          Continuar
        </button>
      </section>
    </main>
  )
}
