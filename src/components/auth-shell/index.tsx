import type { ReactNode } from 'react'

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) => {
  return (
    <main className="flex min-h-[calc(100svh-72px)] items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-(--text-strong)">
            {title}
          </h1>
          <p className="text-sm text-(--text)">{subtitle}</p>
        </div>

        {children}

        <div className="mt-6 text-center text-sm text-(--text)">{footer}</div>
      </section>
    </main>
  )
}
