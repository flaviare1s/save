interface Transaction {
  data: string;
  valor: number;
  diaSemana?: string;
}

interface WeeklyHeatmapProps {
  transacoes: Transaction[];
}

export function HeatmapSemanal({ transacoes }: WeeklyHeatmapProps) {
  const diasSemana = [
    "domingo",
    "segunda",
    "terça",
    "quarta",
    "quinta",
    "sexta",
    "sábado",
  ];
  
  // Agrupar transações por dia da semana
  const gastosPorDia: Record<string, number> = {};
  
  transacoes.forEach((transacao) => {
    const date = new Date(transacao.data);
    const diaSemana = diasSemana[date.getDay()];
    gastosPorDia[diaSemana] = (gastosPorDia[diaSemana] || 0) + transacao.valor;
  });

  // Encontrar máximo para normalizar cores
  const maximo = Math.max(...Object.values(gastosPorDia), 1);

  return (
    <div className="bg-bg border border-tertiary rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-lg text-text-strong mb-4">
        Gastos por Dia da Semana
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {diasSemana.map((dia) => {
          const valor = gastosPorDia[dia] || 0;
          const intensidade = valor / maximo;
          const cor = `rgba(192, 132, 252, ${intensidade * 0.8 + 0.2})`; // primary color com opacidade
          
          return (
            <div key={dia} className="text-center">
              <div
                className="w-full aspect-square rounded-lg flex items-center justify-center text-xs font-semibold text-text-strong transition-transform hover:scale-110"
                style={{ backgroundColor: cor }}
              >
                R${(valor / 100).toFixed(0)}
              </div>
              <p className="text-xs text-text mt-2 capitalize">{dia}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
