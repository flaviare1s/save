interface InsightCardProps {
  emoji: string;
  texto?: string;
  titulo?: string;
  descricao?: string;
  destaque?: boolean;
}

export function InsightCard({
  emoji,
  texto,
  titulo,
  descricao,
  destaque = false,
}: InsightCardProps) {
  const borderColor = destaque ? "border-primary" : "border-tertiary";
  const bgColor = destaque ? "bg-primary/10" : "bg-tertiary/5";

  // Suporta ambos os formatos (antigo com texto e novo com titulo/descricao)
  if (texto) {
    return (
      <div
        className={`rounded-2xl p-5 transition-all hover:scale-[1.01] ${
          destaque
            ? "bg-linear-to-r from-primary/10 to-secondary/10 border-2 border-primary/20"
            : "bg-bg border border-tertiary"
        } shadow-sm`}
      >
        <div className="flex items-start gap-4">
          <span className="text-3xl">{emoji}</span>
          <p
            className={`text-sm leading-relaxed ${destaque ? "text-text-strong font-medium" : "text-text"}`}
          >
            {texto}
          </p>
        </div>
      </div>
    );
  }

  // Novo formato com titulo e descricao
  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-text-strong mb-1">{titulo}</h4>
          <p className="text-sm text-text">{descricao}</p>
        </div>
      </div>
    </div>
  );
}
