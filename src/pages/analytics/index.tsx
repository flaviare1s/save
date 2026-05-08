import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/auth-context";
import type { ExpenseTransaction } from "../../firebase/dashboard-types";
import { subscribeUserTransactions } from "../../firebase/transactions";
import { detectarArquetipo, gerarInsights } from "../../utils/arquetipos";
import { GraficoContexto } from "./context-graphic";
import { HeatmapSemanal } from "./weekly-heatmap";
import { InsightCard } from "./insight-card";

type ContextData = Record<
  string,
  {
    valorTotal: number;
    percentualValor: number;
  }
>;

const emptyTransactions: ExpenseTransaction[] = [];

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

const buildContextData = (transactions: ExpenseTransaction[]): ContextData => {
  const total = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  return transactions.reduce<ContextData>((acc, transaction) => {
    if (!transaction.emotionalContext) {
      return acc;
    }

    const current = acc[transaction.emotionalContext] ?? {
      valorTotal: 0,
      percentualValor: 0,
    };

    current.valorTotal += transaction.amount;
    current.percentualValor =
      total > 0 ? (current.valorTotal / total) * 100 : 0;
    acc[transaction.emotionalContext] = current;

    return acc;
  }, {});
};

const toArchetypeTransactions = (transactions: ExpenseTransaction[]) => {
  return transactions.map((transaction) => ({
    valor: transaction.amount,
    categoria: transaction.category,
    contextoEmocional: transaction.emotionalContext,
    periodo: transaction.period || undefined,
    diaSemana: transaction.weekday,
  }));
};

const buildInsights = (transactions: ExpenseTransaction[]) => {
  if (!transactions.length) {
    return [];
  }

  const archetypeTransactions = toArchetypeTransactions(transactions);
  const archetype = detectarArquetipo(archetypeTransactions);
  const totalSpent = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );
  const nightTransactions = transactions.filter(
    (transaction) => transaction.period === "noite",
  );
  const weekendTransactions = transactions.filter(
    (transaction) =>
      transaction.weekday === "sabado" || transaction.weekday === "domingo",
  );
  const archetypeInsights = gerarInsights(archetype, archetypeTransactions);

  return [
    {
      emoji: archetype.emoji,
      titulo: "Perfil mais provável",
      descricao: `${archetype.nome} com ${archetype.percentualMatch.toFixed(0)}% de match.`,
      destaque: true,
    },
    {
      emoji: "🌙",
      titulo: "Padrão noturno",
      descricao: `${nightTransactions.length} transações à noite somam ${formatCurrency(
        nightTransactions.reduce(
          (sum, transaction) => sum + transaction.amount,
          0,
        ),
      )}.`,
      destaque: nightTransactions.length > transactions.length * 0.35,
    },
    {
      emoji: "📅",
      titulo: "Fim de semana",
      descricao: `${weekendTransactions.length} transações no fim de semana representam ${
        totalSpent > 0
          ? (
              (weekendTransactions.reduce(
                (sum, transaction) => sum + transaction.amount,
                0,
              ) /
                totalSpent) *
              100
            ).toFixed(0)
          : 0
      }% do gasto registrado.`,
      destaque: false,
    },
    ...archetypeInsights.slice(0, 2).map((insight, index) => ({
      emoji: insight.emoji,
      titulo: index === 0 ? "Gatilho dominante" : "Leitura de consumo",
      descricao: insight.texto,
      destaque: false,
    })),
  ];
};

export function Analytics() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>([]);
  const [transactionsUserId, setTransactionsUserId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = subscribeUserTransactions(
      user.uid,
      (nextTransactions) => {
        setTransactions(nextTransactions);
        setTransactionsUserId(user.uid);
      },
      () => {
        setError("Não foi possível carregar suas análises.");
        setTransactions([]);
        setTransactionsUserId(user.uid);
      },
    );

    return unsubscribe;
  }, [user]);

  const loadingTransactions = Boolean(user && transactionsUserId !== user.uid);
  const currentTransactions = loadingTransactions ? emptyTransactions : transactions;
  const contextData = useMemo(
    () => buildContextData(currentTransactions),
    [currentTransactions],
  );
  const insights = useMemo(
    () => buildInsights(currentTransactions),
    [currentTransactions],
  );
  const heatmapTransactions = useMemo(
    () =>
      currentTransactions
        .filter((transaction) => transaction.period)
        .map((transaction) => ({
          data: transaction.date,
          valor: transaction.amount,
          diaSemana: transaction.weekday,
          periodo: transaction.period,
        })),
    [currentTransactions],
  );

  if (authLoading || loadingTransactions) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <p className="text-sm text-(--text)">Carregando análises...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <p className="text-sm text-red-300">{error}</p>
      </main>
    );
  }

  if (!currentTransactions.length) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full rounded-3xl bg-white/5 p-6 text-center ring-1 ring-white/8">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-(--text-strong)">
            Sem dados para analisar
          </h1>
          <p className="mt-3 text-sm text-(--text)">
            Registre alguns gastos para visualizar contexto emocional, horários
            e padrões de consumo.
          </p>
          <Link
            to="/onboarding"
            className="mt-5 inline-flex rounded-2xl bg-(--primary) px-5 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
          >
            Registrar gasto
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-strong md:text-3xl">
          Sua jornada de consumo
        </h1>
        <p className="mt-1 text-text">
          Entenda os padrões emocionais por trás das suas compras.
        </p>
      </div>

      {Object.keys(contextData).length > 0 ? (
        <div className="mb-8">
          <GraficoContexto dados={contextData} />
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-tertiary bg-bg p-6 text-sm text-text">
          Registre contexto emocional em gastos não essenciais para liberar este
          gráfico.
        </div>
      )}

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-text-strong">
          Insights sobre seu consumo
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {insights.map((insight) => (
            <InsightCard
              key={insight.titulo}
              emoji={insight.emoji}
              titulo={insight.titulo}
              descricao={insight.descricao}
              destaque={insight.destaque}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <HeatmapSemanal transacoes={heatmapTransactions} />
      </div>

      <div className="rounded-2xl bg-linear-to-r from-primary to-tertiary p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-text-strong md:text-2xl">
          Quer ajustar a rota?
        </h2>
        <p className="mx-auto mb-6 max-w-md text-black">
          O dashboard reúne limites, orçamento e recomendações acionáveis.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-text-strong px-6 py-3 font-semibold text-bg transition-opacity hover:opacity-90"
        >
          Voltar ao dashboard
        </Link>
      </div>
    </main>
  );
}
