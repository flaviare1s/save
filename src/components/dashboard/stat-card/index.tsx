type StatCardProps = {
  label: string
  value: string
  detail: string
}

export const StatCard = ({ label, value, detail }: StatCardProps) => {
  return (
    <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/8">
      <p className="text-sm text-(--text)">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-(--text-strong)">
        {value}
      </p>
      <p className="mt-2 text-sm text-(--text)">{detail}</p>
    </div>
  )
}
