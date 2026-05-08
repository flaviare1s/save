export function InsightCard({ emoji, texto, destaque = false }: { emoji: string; texto: string; destaque?: boolean }) {
  return (
    <div 
      className={`rounded-2xl p-5 transition-all hover:scale-[1.01] ${
        destaque 
          ? 'bg-primary/10 border-2 border-primary/30 shadow-[0_0_20px_rgba(192,132,252,0.1)]' 
          : 'bg-white/5 border border-white/10'
      } shadow-sm`}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{emoji}</span>
        <p className={`text-sm leading-relaxed ${destaque ? 'text-text-strong font-medium' : 'text-text'}`}>
          {texto}
        </p>
      </div>
    </div>
  )
}