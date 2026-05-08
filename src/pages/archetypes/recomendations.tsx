type RecomendationsProps = {
  numero: string | number
  texto: string
  cor: string
}

export function Recomendations({ numero, texto, cor }: RecomendationsProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-all hover:scale-[1.01]">
      <div className="flex items-start gap-4">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ backgroundColor: cor }}
        >
          {numero}
        </div>
        <p className="text-sm text-foreground leading-relaxed">{texto}</p>
      </div>
    </div>
  )
}
