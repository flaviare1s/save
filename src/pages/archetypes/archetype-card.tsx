import { useState, useEffect } from 'react'

interface Archetype {
  corSecundaria: string;
  cor: string;
  emoji: string;
  nome: string;
  nomeIngles: string;
  percentualMatch?: number;
  gatilho: string;
  comportamento: string;
  insightEspelho: string;
  poderDeEscolha: string;
}

export function ArchetypeCard({ arquetipo }: { arquetipo: Archetype }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div 
      className={`rounded-3xl overflow-hidden shadow-xl transition-all duration-700 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      style={{ backgroundColor: arquetipo.corSecundaria }}
    >
      {/* Header com gradiente */}
      <div 
        className="p-8 text-center"
        style={{ 
          background: `linear-gradient(135deg, ${arquetipo.cor} 0%, ${arquetipo.cor}CC 100%)` 
        }}
      >
        <div 
          className={`text-7xl mb-4 transition-all duration-500 delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          {arquetipo.emoji}
        </div>
        <h2 
          className={`text-2xl md:text-3xl font-bold text-white mb-2 transition-all duration-500 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {arquetipo.nome}
        </h2>
        <p 
          className={`text-white/80 text-sm italic transition-all duration-500 delay-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {arquetipo.nomeIngles}
        </p>
        <div 
          className={`mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 transition-all duration-500 delay-600 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="text-white text-sm font-medium">
            {arquetipo.percentualMatch?.toFixed(0) || 75}% de match
          </span>
        </div>
      </div>
      
      {/* Conteúdo */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Gatilho */}
        <div 
          className={`transition-all duration-500 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <span className="text-lg">⚡</span> Seu Gatilho
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed pl-7">
            {arquetipo.gatilho}
          </p>
        </div>
        
        {/* Comportamento */}
        <div 
          className={`transition-all duration-500 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <span className="text-lg">🎯</span> Seu Comportamento
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed pl-7">
            {arquetipo.comportamento}
          </p>
        </div>
        
        {/* Espelho (Insight) */}
        <div 
          className={`bg-white rounded-2xl p-5 border-l-4 transition-all duration-500 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ borderColor: arquetipo.cor }}
        >
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <span className="text-lg">🪞</span> O Espelho
          </h3>
          <p className="text-foreground text-sm leading-relaxed italic pl-7" style={{ color: arquetipo.cor }}>
            &ldquo;{arquetipo.insightEspelho}&rdquo;
          </p>
        </div>
        
        {/* Poder de Escolha */}
        <div 
          className={`bg-white rounded-2xl p-5 transition-all duration-500 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <span className="text-lg">💪</span> Seu Poder de Escolha
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed pl-7">
            {arquetipo.poderDeEscolha}
          </p>
        </div>
      </div>
    </div>
  )
}