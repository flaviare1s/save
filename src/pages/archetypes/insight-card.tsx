export function InsightCard({ emoji, texto, destaque = false }) {
  return (
    <div 
      className={`rounded-2xl p-5 transition-all hover:scale-[1.01] ${
        destaque 
          ? 'bg-gradient-to-r from-[#7B2D8B]/10 to-[#E91E8C]/10 border-2 border-[#7B2D8B]/20' 
          : 'bg-card border border-border'
      } shadow-sm`}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{emoji}</span>
        <p className={`text-sm leading-relaxed ${destaque ? 'text-foreground font-medium' : 'text-foreground'}`}>
          {texto}
        </p>
      </div>
    </div>
  )
}
