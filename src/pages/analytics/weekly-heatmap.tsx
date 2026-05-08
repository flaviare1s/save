interface Transaction {
  data: string;
  valor: number;
  diaSemana: string;
  periodo: string;
}

interface WeeklyHeatmapProps {
  transacoes: Transaction[];
}

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const DIAS_KEYS = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
];
const PERIODOS = ["Manhã", "Tarde", "Noite"];
const PERIODOS_KEYS = ["manha", "tarde", "noite"];

function getIntensidade(valor: number, max: number): string {
  if (valor === 0 || max === 0) return "bg-tertiary/10";
  const ratio = valor / max;
  if (ratio < 0.25) return "bg-primary/20";
  if (ratio < 0.5) return "bg-primary/40";
  if (ratio < 0.75) return "bg-primary/60";
  return "bg-primary/90";
}

export function HeatmapSemanal({ transacoes }: WeeklyHeatmapProps) {
  // Criar matriz de gastos por dia e período
  const matriz: Record<string, Record<string, number>> = {};
  let maxValor = 0;

  DIAS_KEYS.forEach((dia) => {
    matriz[dia] = {};
    PERIODOS_KEYS.forEach((periodo) => {
      matriz[dia][periodo] = 0;
    });
  });

  transacoes.forEach((t) => {
    if (matriz[t.diaSemana] && matriz[t.diaSemana][t.periodo] !== undefined) {
      matriz[t.diaSemana][t.periodo] += t.valor;
      maxValor = Math.max(maxValor, matriz[t.diaSemana][t.periodo]);
    }
  });

  return (
    <div className="bg-bg border border-tertiary rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-lg text-text-strong mb-2">
        Mapa de Gastos
      </h3>
      <p className="text-sm text-text mb-4">Quando você mais gasta na semana</p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 text-xs text-text font-medium"></th>
              {DIAS.map((dia, i) => (
                <th
                  key={i}
                  className="p-2 text-xs text-text font-medium text-center"
                >
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODOS.map((periodo, pi) => (
              <tr key={pi}>
                <td className="p-2 text-xs text-text font-medium">{periodo}</td>
                {DIAS_KEYS.map((dia, di) => {
                  const valor = matriz[dia][PERIODOS_KEYS[pi]];
                  return (
                    <td key={di} className="p-1">
                      <div
                        className={`w-full aspect-square rounded-lg ${getIntensidade(valor, maxValor)} 
                          flex items-center justify-center transition-all hover:scale-110 cursor-default`}
                        title={
                          valor > 0 ? `R$ ${valor.toFixed(2)}` : "Sem gastos"
                        }
                      >
                        {valor > 0 && (
                          <span className="text-[10px] font-medium text-text-strong">
                            {valor >= 100 ? Math.round(valor / 100) : ""}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="text-xs text-text">Menos</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-tertiary/10"></div>
          <div className="w-4 h-4 rounded bg-primary/20"></div>
          <div className="w-4 h-4 rounded bg-primary/40"></div>
          <div className="w-4 h-4 rounded bg-primary/60"></div>
          <div className="w-4 h-4 rounded bg-primary/90"></div>
        </div>
        <span className="text-xs text-text">Mais</span>
      </div>
    </div>
  );
}
