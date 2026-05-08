/* eslint-disable @typescript-eslint/no-explicit-any */
type Archetype = {
  imagem?: string;
  nome: string;
  nomeIngles?: string;
  percentualMatch?: number;
  emoji?: string;
  cor?: string;
  gatilho?: string;
  comportamento?: string;
  insightEspelho?: string;
  poderDeEscolha?: string;
  corSecundaria?: string;
  nomeDaReserva?: string;
  categoriasDominantes?: string[];
  contextoGatilho?: string;
  recomendacoes?: string[];
  scores?: Record<string, number>;
  detalhes?: any;
};

export function ArchetypeCard({ arquetipo }: { arquetipo: Archetype }) {
  return (
    <div className="rounded-3xl overflow-hidden bg-[#07110c] shadow-2xl border border-white/5 opacity-100 scale-100 transition-all duration-700">
      {/* Topo Roxo com Imagem */}
      <div className="p-10 text-center bg-[#c084fc]">
        <div className="mb-6">
          {arquetipo.imagem ? (
            <img
              src={arquetipo.imagem}
              alt={arquetipo.nome}
              className="w-48 h-48 mx-auto object-contain drop-shadow-2xl"
            />
          ) : (
            <span className="text-8xl block">{arquetipo.emoji}</span>
          )}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#07110c] mb-1">
          {arquetipo.nome}
        </h2>
        <p className="text-[#07110c]/60 text-sm italic mb-4">
          {arquetipo.nomeIngles}
        </p>
        <div className="inline-flex items-center gap-2 bg-[#07110c]/20 rounded-full px-5 py-1.5 text-[#07110c] text-xs font-bold uppercase tracking-widest">
          {arquetipo.percentualMatch?.toFixed(0) || 100}% de match
        </div>
      </div>
      {/* Conteúdo */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Gatilho */}
        <div className="transition-all duration-500 delay-200 opacity-100 translate-y-0">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <span className="text-lg">⚡</span> Seu Gatilho
          </h3>
          <p
            className="text-foreground text-sm leading-relaxed italic pl-7"
            style={{ color: arquetipo.cor }}
          >
            {arquetipo.gatilho}
          </p>
        </div>

        {/* Comportamento */}
        <div className="transition-all duration-500 delay-300 opacity-100 translate-y-0">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <span className="text-lg">🎯</span> Seu Comportamento
          </h3>
          <p
            className="text-foreground text-sm leading-relaxed italic pl-7"
            style={{ color: arquetipo.cor }}
          >
            {arquetipo.comportamento}
          </p>
        </div>

        {/* Espelho (Insight) */}
        <div
          className="transition-all duration-500 delay-300 opacity-100 translate-y-0"
          style={{ borderColor: arquetipo.cor }}
        >
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <span className="text-lg">🪞</span> O Espelho
          </h3>
          <p
            className="text-foreground text-sm leading-relaxed italic pl-7"
            style={{ color: arquetipo.cor }}
          >
            &ldquo;{arquetipo.insightEspelho}&rdquo;
          </p>
        </div>

        {/* Poder de Escolha */}
        <div className="transition-all duration-500 delay-300 opacity-100 translate-y-0">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <span className="text-lg">💪</span> Seu Poder de Escolha
          </h3>
          <p
            className="text-foreground text-sm leading-relaxed italic pl-7"
            style={{ color: arquetipo.cor }}
          >
            {arquetipo.poderDeEscolha}
          </p>
        </div>
      </div>
    </div>
  );
}
