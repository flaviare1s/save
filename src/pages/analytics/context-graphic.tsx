import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const NOMES_CONTEXTO = {
  pos_trabalho_exaustivo: "Pós-trabalho",
  fomo_social: "FOMO Social",
  ansiedade_futuro: "Ansiedade",
  busca_validacao: "Validação",
  tedio_noturno: "Tédio Noturno",
};

const CORES_CONTEXTO = {
  pos_trabalho_exaustivo: "var(--primary)",
  fomo_social: "var(--secondary)",
  ansiedade_futuro: "var(--tertiary)",
  busca_validacao: "#c084fc",
  tedio_noturno: "#32d6ff",
};

interface ContextData {
  [key: string]: {
    valorTotal: number;
    percentualValor: number;
  };
}

interface FormattedData {
  name: string;
  valor: number;
  percentual: number;
  cor: string;
}

interface GraficoContextoProps {
  dados: ContextData;
}

const CustomTooltip = (props: { active?: boolean; payload?: Array<{ payload: FormattedData }> }) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload as FormattedData;
    return (
      <div className="bg-bg border border-tertiary rounded-lg p-3 shadow-lg">
        <p className="font-medium text-text-strong">{data.name}</p>
        <p className="text-sm text-text">
          {data.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <p className="text-xs font-medium text-tertiary">
          {data.percentual.toFixed(1)}% do total
        </p>
      </div>
    );
  }
  return null;
};

export function GraficoContexto({ dados }: GraficoContextoProps) {
  const dadosFormatados: FormattedData[] = Object.entries(dados).map(
    ([contexto, info]) => ({
      name: NOMES_CONTEXTO[contexto as keyof typeof NOMES_CONTEXTO] || contexto,
      valor: info.valorTotal,
      percentual: info.percentualValor,
      cor: CORES_CONTEXTO[contexto as keyof typeof CORES_CONTEXTO] || "#888888",
    }),
  );

  return (
    <div className="bg-bg border border-tertiary rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-lg text-text-strong mb-2">
        Gastos por Contexto Emocional
      </h3>
      <p className="text-sm text-text mb-4">
        Entenda o que motiva suas compras
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dadosFormatados}
            layout="vertical"
            margin={{ left: 120 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="var(--tertiary)"
              opacity={0.2}
            />
            <XAxis
              type="number"
              tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
              tick={{ fill: "var(--text)", fontSize: 12 }}
              stroke="var(--text)"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fill: "var(--text)", fontSize: 12 }}
              stroke="var(--text)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="valor" radius={[0, 8, 8, 0]} fill="var(--primary)">
              {dadosFormatados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.cor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
