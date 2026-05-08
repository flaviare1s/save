export interface ContextoData {
  valorTotal: number;
  percentualValor: number;
}

export interface Insight {
  emoji: string;
  titulo: string;
  descricao: string;
  destaque: boolean;
}

export interface Transaction {
  data: string;
  valor: number;
  diaSemana: string;
  periodo: string;
}

// Dados mockados de contextos emocionais
export const mockContextos: Record<string, ContextoData> = {
  pos_trabalho_exaustivo: {
    valorTotal: 1200,
    percentualValor: 30,
  },
  fomo_social: {
    valorTotal: 800,
    percentualValor: 20,
  },
  ansiedade_futuro: {
    valorTotal: 600,
    percentualValor: 15,
  },
  busca_validacao: {
    valorTotal: 900,
    percentualValor: 22.5,
  },
  tedio_noturno: {
    valorTotal: 500,
    percentualValor: 12.5,
  },
};

// Dados mockados de transações
export const mockTransacoes: Transaction[] = [
  { data: "2024-01-08", valor: 150, diaSemana: "segunda", periodo: "manha" },
  { data: "2024-01-08", valor: 250, diaSemana: "segunda", periodo: "tarde" },
  { data: "2024-01-08", valor: 180, diaSemana: "segunda", periodo: "noite" },
  { data: "2024-01-09", valor: 120, diaSemana: "terca", periodo: "manha" },
  { data: "2024-01-09", valor: 320, diaSemana: "terca", periodo: "tarde" },
  { data: "2024-01-09", valor: 90, diaSemana: "terca", periodo: "noite" },
  { data: "2024-01-10", valor: 200, diaSemana: "quarta", periodo: "manha" },
  { data: "2024-01-10", valor: 180, diaSemana: "quarta", periodo: "tarde" },
  { data: "2024-01-10", valor: 220, diaSemana: "quarta", periodo: "noite" },
  { data: "2024-01-11", valor: 280, diaSemana: "quinta", periodo: "manha" },
  { data: "2024-01-11", valor: 160, diaSemana: "quinta", periodo: "tarde" },
  { data: "2024-01-11", valor: 140, diaSemana: "quinta", periodo: "noite" },
  { data: "2024-01-12", valor: 110, diaSemana: "sexta", periodo: "manha" },
  { data: "2024-01-12", valor: 290, diaSemana: "sexta", periodo: "tarde" },
  { data: "2024-01-12", valor: 350, diaSemana: "sexta", periodo: "noite" },
  { data: "2024-01-13", valor: 420, diaSemana: "sabado", periodo: "manha" },
  { data: "2024-01-13", valor: 380, diaSemana: "sabado", periodo: "tarde" },
  { data: "2024-01-13", valor: 290, diaSemana: "sabado", periodo: "noite" },
  { data: "2024-01-14", valor: 310, diaSemana: "domingo", periodo: "manha" },
  { data: "2024-01-14", valor: 260, diaSemana: "domingo", periodo: "tarde" },
  { data: "2024-01-14", valor: 180, diaSemana: "domingo", periodo: "noite" },
];

// Insights gerados automaticamente
export const mockInsights: Insight[] = [
  {
    emoji: "🌙",
    titulo: "Gastos noturnos elevados",
    descricao:
      "35% dos seus gastos acontecem à noite. Fique atenta nesse horário!",
    destaque: true,
  },
  {
    emoji: "💭",
    titulo: "Contexto dominante",
    descricao:
      "30% dos gastos por exaustão pós-trabalho. Seu gatilho principal.",
    destaque: true,
  },
  {
    emoji: "⚡",
    titulo: "Categoria impulsiva",
    descricao:
      "Moda é sua categoria mais impulsiva. Fique atenta a esse padrão!",
    destaque: false,
  },
  {
    emoji: "📅",
    titulo: "Padrão de fim de semana",
    descricao:
      "28% dos gastos concentrados no fim de semana. Dias de folga pedem atenção.",
    destaque: false,
  },
];
