import { useState, useEffect } from 'react'

interface ProgressProps {
  nomeReserva: string
  meta: number
  atual?: number
  cor?: string
}

export function Progress({ nomeReserva, meta, atual = 0, cor }: ProgressProps) {
  const [progresso, setProgresso] = useState(0)
  const percentual = Math.min((atual / meta) * 100, 100)
  
  useEffect(() => {
    const timer = setTimeout(() => setProgresso(percentual), 300)
    return () => clearTimeout(timer)
  }, [percentual])
  
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{nomeReserva}</h3>
        <span className="text-sm font-medium" style={{ color: cor}}>
          {percentual.toFixed(0)}%
        </span>
      </div>
      
      {/* Barra de progresso */}
      <div className="h-4 bg-muted rounded-full overflow-hidden mb-4">
  <div 
    className="h-full rounded-full transition-all duration-1000 ease-out"
    style={{ 
      width: `${progresso}%`,
      backgroundColor: cor // ADICIONE ESTA LINHA
    }}
  />
</div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Atual: <span className="font-medium text-foreground">
            {atual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </span>
        <span className="text-muted-foreground">
          Meta: <span className="font-medium text-foreground">
            {meta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </span>
      </div>
      
      {/* Dica motivacional */}
      <div className="mt-4 p-3 rounded-xl bg-muted/50">
        <p className="text-xs text-muted-foreground">
          💡 Dica: Automatize uma transferência de <span className="font-medium" style={{ color: cor }}>
            {(meta * 0.1).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span> por semana para alcançar sua meta mais rápido!
        </p>
      </div>
    </div>
  )
}
