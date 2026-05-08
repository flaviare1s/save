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
};

export function ArchetypeCard({ arquetipo }: { arquetipo: Archetype }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#07110c] opacity-100 shadow-2xl transition-all duration-700">
      <div className="bg-[#c084fc] p-10 text-center">
        <div className="mb-6">
          {arquetipo.imagem ? (
            <img
              src={arquetipo.imagem}
              alt={arquetipo.nome}
              className="mx-auto h-48 w-48 object-contain drop-shadow-2xl"
            />
          ) : (
            <span className="block text-8xl">{arquetipo.emoji}</span>
          )}
        </div>
        <h2 className="mb-1 text-3xl font-bold text-[#07110c] md:text-4xl">
          {arquetipo.nome}
        </h2>
        <p className="mb-4 text-sm italic text-[#07110c]/60">
          {arquetipo.nomeIngles}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#07110c]/20 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#07110c]">
          {arquetipo.percentualMatch?.toFixed(0) ?? 0}% de match
        </div>
      </div>

      <div className="space-y-6 p-6 md:p-8">
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
            <span className="text-lg">⚡</span> Seu gatilho
          </h3>
          <p
            className="pl-7 text-sm italic leading-relaxed"
            style={{ color: arquetipo.cor }}
          >
            {arquetipo.gatilho}
          </p>
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
            <span className="text-lg">🎯</span> Seu comportamento
          </h3>
          <p
            className="pl-7 text-sm italic leading-relaxed"
            style={{ color: arquetipo.cor }}
          >
            {arquetipo.comportamento}
          </p>
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
            <span className="text-lg">🪞</span> O espelho
          </h3>
          <p
            className="pl-7 text-sm italic leading-relaxed"
            style={{ color: arquetipo.cor }}
          >
            &ldquo;{arquetipo.insightEspelho}&rdquo;
          </p>
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
            <span className="text-lg">💪</span> Seu poder de escolha
          </h3>
          <p
            className="pl-7 text-sm italic leading-relaxed"
            style={{ color: arquetipo.cor }}
          >
            {arquetipo.poderDeEscolha}
          </p>
        </div>
      </div>
    </div>
  );
}
