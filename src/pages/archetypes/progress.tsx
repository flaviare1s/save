import { useEffect, useState } from "react";

interface ProgressProps {
  nomeReserva: string;
  meta: number;
  atual?: number;
  cor?: string;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export function Progress({ nomeReserva, meta, atual = 0, cor }: ProgressProps) {
  const [progresso, setProgresso] = useState(0);
  const safeMeta = meta > 0 ? meta : Math.max(atual, 1);
  const percentual = Math.min((atual / safeMeta) * 100, 100);
  const weeklySuggestion = safeMeta * 0.1;

  useEffect(() => {
    const timer = window.setTimeout(() => setProgresso(percentual), 300);
    return () => window.clearTimeout(timer);
  }, [percentual]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">{nomeReserva}</h3>
        <span className="text-sm font-medium" style={{ color: cor }}>
          {percentual.toFixed(0)}%
        </span>
      </div>

      <div className="mb-4 h-4 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${progresso}%`,
            backgroundColor: cor,
          }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-[#9fb0a3]">
          Atual:{" "}
          <span className="font-medium text-white">{formatCurrency(atual)}</span>
        </span>
        <span className="text-[#9fb0a3]">
          Meta:{" "}
          <span className="font-medium text-white">{formatCurrency(safeMeta)}</span>
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-white/5 p-3">
        <p className="text-xs text-[#9fb0a3]">
          💡 Dica: automatize uma transferência de{" "}
          <span className="font-medium" style={{ color: cor }}>
            {formatCurrency(weeklySuggestion)}
          </span>{" "}
          por semana para chegar mais rápido.
        </p>
      </div>
    </div>
  );
}
