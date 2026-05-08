import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { BarChart } from "../../components/dashboard/bar-chart";
import { DonutChart } from "../../components/dashboard/donut-chart";
import { InsightCard } from "../../components/dashboard/insight-card";
import { Panel } from "../../components/dashboard/panel";
import { StatCard } from "../../components/dashboard/stat-card";
import { useAuth } from "../../contexts/auth-context";
import { subscribeDashboardData } from "../../firebase/dashboard";
import type {
  DashboardData,
  ExpenseTransaction,
} from "../../firebase/dashboard-types";
import {
  getDashboardInsights,
  getDashboardRecommendations,
  getDashboardSummary,
} from "../../firebase/insights";
import { subscribeUserTransactions } from "../../firebase/transactions";
import { ROUTE_PATHS } from "../../routes/paths";

type DashboardState = {
  userId: string;
  data: DashboardData | null;
  error: string;
};

type TransactionsState = {
  userId: string;
  data: ExpenseTransaction[];
  error: string;
};

const emptyTransactions: ExpenseTransaction[] = [];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

const formatCurrencyWithCents = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return year && month && day ? `${day}/${month}/${year}` : date;
};

const getPeriodTransactions = (
  transactions: ExpenseTransaction[],
  data: DashboardData | null,
) => {
  if (!data) {
    return [];
  }

  return transactions.filter(
    (transaction) =>
      transaction.date >= data.periodStart && transaction.date <= data.periodEnd,
  );
};

const getImpulseSpending = (transactions: ExpenseTransaction[]) => {
  const impulseContexts = new Set(["tedio_noturno", "busca_validacao"]);

  return transactions
    .filter((transaction) => impulseContexts.has(transaction.emotionalContext))
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const Dashboard = () => {
  const { user, firstName, loading: authLoading } = useAuth();
  const [dashboardState, setDashboardState] =
    useState<DashboardState | null>(null);
  const [transactionsState, setTransactionsState] =
    useState<TransactionsState | null>(null);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const unsubscribeDashboard = subscribeDashboardData(
      user.uid,
      (dashboardData) => {
        setDashboardState({
          userId: user.uid,
          data: dashboardData,
          error: "",
        });
      },
      () => {
        setDashboardState({
          userId: user.uid,
          data: null,
          error: "Não foi possível carregar o dashboard.",
        });
      },
    );

    const unsubscribeTransactions = subscribeUserTransactions(
      user.uid,
      (transactions) => {
        setTransactionsState({
          userId: user.uid,
          data: transactions,
          error: "",
        });
      },
      () => {
        setTransactionsState({
          userId: user.uid,
          data: [],
          error: "Não foi possível carregar suas transações.",
        });
      },
    );

    return () => {
      unsubscribeDashboard();
      unsubscribeTransactions();
    };
  }, [authLoading, user]);

  const isCurrentDashboard = dashboardState?.userId === user?.uid;
  const isCurrentTransactions = transactionsState?.userId === user?.uid;
  const data = isCurrentDashboard ? (dashboardState?.data ?? null) : null;
  const transactions = isCurrentTransactions
    ? (transactionsState?.data ?? emptyTransactions)
    : emptyTransactions;
  const error =
    (isCurrentDashboard ? dashboardState?.error : "") ||
    (isCurrentTransactions ? transactionsState?.error : "");
  const loading =
    authLoading ||
    Boolean(user && (!isCurrentDashboard || !isCurrentTransactions));

  const periodTransactions = useMemo(
    () => getPeriodTransactions(transactions, data),
    [data, transactions],
  );

  const summary = useMemo(() => {
    return data ? getDashboardSummary(data) : null;
  }, [data]);

  const insights = useMemo(() => {
    return data ? getDashboardInsights(data) : [];
  }, [data]);

  const recommendations = useMemo(() => {
    return data ? getDashboardRecommendations(data) : [];
  }, [data]);

  const essentialCategories = useMemo(() => {
    return data?.categories.filter(
      (category) => category.isEssential && category.amount > 0,
    ) ?? [];
  }, [data]);

  const nonEssentialCategories = useMemo(() => {
    return data?.categories.filter(
      (category) => !category.isEssential && category.amount > 0,
    ) ?? [];
  }, [data]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <p className="text-sm text-(--text)">Carregando dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <p className="text-sm text-red-300">{error}</p>
      </main>
    );
  }

  if (!data || !summary) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full rounded-3xl bg-white/5 p-6 text-center ring-1 ring-white/8">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-(--text-strong)">
            Seu dashboard ainda não foi criado
          </h1>
          <p className="mt-3 text-sm text-(--text)">
            Registre seu primeiro gasto para gerar os dados de análise.
          </p>
          <Link
            to={ROUTE_PATHS.onboarding}
            className="mt-5 inline-flex rounded-2xl bg-(--primary) px-5 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
          >
            Registrar gasto
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm text-(--secondary)">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-(--text-strong)">
          {firstName ? `Olá, ${firstName}!` : "Olá!"}
        </h1>
        <p className="mt-3 text-sm text-(--text)">
          Dados de {data.monthLabel}: gastos por categoria, padrões principais e
          ações práticas para melhorar o equilíbrio do mês.
        </p>
      </div>

      <section className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total gasto"
          value={formatCurrency(data.totalSpent)}
          detail={
            data.income > 0
              ? `De ${formatCurrency(data.income)} de renda`
              : "Renda ainda não cadastrada"
          }
        />
        <StatCard
          label="Maior categoria"
          value={summary.topCategoryName}
          detail={
            summary.topCategoryAmount > 0
              ? `${formatCurrency(summary.topCategoryAmount)} no período`
              : "Registre gastos para calcular"
          }
        />
        <StatCard
          label="Gastos de impulso"
          value={formatCurrency(getImpulseSpending(periodTransactions))}
          detail="Tédio noturno e busca por validação"
        />
      </section>

      <section className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-4">
          <Panel
            title="Gastos essenciais"
            subtitle="Distribuição em categorias básicas e necessárias."
          >
            {essentialCategories.length > 0 ? (
              <DonutChart
                labels={essentialCategories.map((category) => category.name)}
                values={essentialCategories.map((category) => category.amount)}
                colors={essentialCategories.map((category) => category.color)}
              />
            ) : (
              <p className="mt-4 text-center text-sm text-(--text)">
                Nenhum gasto essencial registrado no período.
              </p>
            )}
          </Panel>

          <Panel
            title="Gastos não essenciais"
            subtitle="Distribuição nas categorias de estilo de vida."
          >
            {nonEssentialCategories.length > 0 ? (
              <DonutChart
                labels={nonEssentialCategories.map((category) => category.name)}
                values={nonEssentialCategories.map((category) => category.amount)}
                colors={nonEssentialCategories.map((category) => category.color)}
              />
            ) : (
              <p className="mt-4 text-center text-sm text-(--text)">
                Nenhum gasto não essencial registrado no período.
              </p>
            )}
          </Panel>
        </div>

        <Panel
          title="Últimas transações"
          subtitle="Registros mais recentes salvos na sua conta."
        >
          {transactions.length > 0 ? (
            <div className="mt-4 flex flex-col gap-3">
              {transactions.slice(0, 8).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-(--text-strong)">
                      {transaction.description}
                    </span>
                    <span className="mt-1 text-xs text-(--text)">
                      {formatDate(transaction.date)} ·{" "}
                      {transaction.isEssential ? "Essencial" : "Não essencial"}
                    </span>
                  </div>
                  <span className="whitespace-nowrap text-sm font-semibold text-red-400">
                    -{formatCurrencyWithCents(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-white/5 p-5 text-sm text-(--text) ring-1 ring-white/8">
              Nenhuma transação registrada ainda.
            </div>
          )}
        </Panel>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Ritmo semanal"
          subtitle="Como os gastos se distribuem dentro do período."
        >
          <BarChart
            labels={data.weeklySpending.map((item) => item.label)}
            values={data.weeklySpending.map((item) => item.amount)}
            color="#32d6ff"
          />
        </Panel>

        <Panel
          title="Insights"
          subtitle="Leitura prática do seu comportamento financeiro."
        >
          <div className="space-y-3">
            {insights.slice(0, 4).map((item) => (
              <InsightCard key={item.title} item={item} />
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Recomendações"
          subtitle="Ações simples para melhorar o resultado deste mês."
        >
          <div className="space-y-3">
            {recommendations.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/8"
              >
                <h3 className="text-sm font-semibold text-(--text-strong)">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-(--text)">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </Panel>

        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/8">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-(--text-strong)">
                Descubra seu perfil SAVE
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-(--text)">
                O perfil é calculado a partir das suas transações, categorias e
                contextos emocionais.
              </p>
            </div>
            <Link
              to={ROUTE_PATHS.archetypes}
              className="inline-flex w-fit rounded-2xl bg-(--primary) px-6 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
            >
              Meu arquétipo
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};
