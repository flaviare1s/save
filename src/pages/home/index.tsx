import { Link } from 'react-router-dom'

import { ROUTE_PATHS } from '../../routes/paths'

export const Home = () => {
  return (
    <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-4xl items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-2xl rounded-4xl bg-white/5 p-8 text-center ring-1 ring-white/8 backdrop-blur sm:p-10">
        <p className="text-sm text-(--secondary)">Home</p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tighter text-(--text-strong) sm:text-5xl">
          Página em construção
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-(--text) sm:text-base">
          A tela inicial do app ainda está sendo montada. Enquanto isso, você já
          pode criar sua conta ou entrar para configurar categorias, metas e
          acompanhar seus padrões de consumo.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={ROUTE_PATHS.register}
            className="inline-flex rounded-2xl bg-(--primary) px-5 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
          >
            Criar conta
          </Link>
        </div>
      </section>
    </main>
  );
}
