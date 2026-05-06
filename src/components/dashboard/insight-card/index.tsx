import type { InsightItem } from '../../../firebase/dashboard-types'

const toneClassName: Record<InsightItem['tone'], string> = {
  neutral: 'bg-white/5 text-[var(--text-strong)]',
  warning: 'bg-[rgba(192,132,252,0.14)] text-[var(--text-strong)]',
  positive: 'bg-[rgba(50,214,255,0.14)] text-[var(--text-strong)]',
}

type InsightCardProps = {
  item: InsightItem
}

export const InsightCard = ({ item }: InsightCardProps) => {
  return (
    <article className={`rounded-2xl p-4 ring-1 ring-white/8 ${toneClassName[item.tone]}`}>
      <h3 className="text-sm font-semibold">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--text)]">{item.description}</p>
    </article>
  )
}
