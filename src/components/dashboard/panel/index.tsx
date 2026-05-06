import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export const Panel = ({ title, subtitle, children }: PanelProps) => {
  return (
    <section className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/8 backdrop-blur">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-(--text-strong)">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-(--text)">{subtitle}</p> : null}
      </div>

      {children}
    </section>
  )
}
