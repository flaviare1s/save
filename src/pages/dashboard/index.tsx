import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { BarChart } from "../../components/dashboard/bar-chart";
import { DonutChart } from "../../components/dashboard/donut-chart";
import { InsightCard } from "../../components/dashboard/insight-card";
import { Panel } from "../../components/dashboard/panel";
import { StatCard } from "../../components/dashboard/stat-card";
import { useAuth } from "../../contexts/auth-context";
import { subscribeDashboardData } from "../../firebase/dashboard";
import type { DashboardData } from "../../firebase/dashboard-types";
import {
  getDashboardInsights,
  getDashboardRecommendations,
  getDashboardSummary,
} from "../../firebase/insights";
import { ROUTE_PATHS } from "../../routes/paths";

type DashboardState = {
  userId: string;
  data: DashboardData | null;
  error: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

export const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [dashboardState, setDashboardState] =
    useState<DashboardState | null>(null);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    const unsubscribe = subscribeDashboardData(
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
          error: "Nao foi possivel carregar o dashboard.",
        });
      },
    );

    return unsubscribe;
  }, [authLoading, user]);

  const isCurrentUserSnapshot = dashboardState?.userId === user?.uid;
  const data = isCurrentUserSnapshot ? (dashboardState?.data ?? null) : null;
  const error = isCurrentUserSnapshot ? (dashboardState?.error ?? "") : "";
  const loading = authLoading || Boolean(user && !isCurrentUserSnapshot);

  const summary = useMemo(() => {
    return data ? getDashboardSummary(data) : null;
  }, [data]);

  const insights = useMemo(() => {
    return data ? getDashboardInsights(data) : [];
  }, [data]);

  const recommendations = useMemo(() => {
    return data ? getDashboardRecommendations(data) : [];
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
            Complete o onboarding para gerar suas preferências e os primeiros
            dados de análise.
          </p>
          <Link
            to={ROUTE_PATHS.onboarding}
            className="mt-5 inline-flex rounded-2xl bg-(--primary) px-5 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
          >
            Ir para onboarding
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
          Análise simples do seu consumo
        </h1>
        <p className="mt-3 text-sm text-(--text)">
          Seus gastos por categoria, padrões principais e algumas ações práticas
          para melhorar o equilíbrio do mês.
        </p>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Gasto total"
          value={formatCurrency(data.totalSpent)}
          detail={`${data.monthLabel} em acompanhamento`}
        />
        <StatCard
          label="Orçamento restante"
          value={formatCurrency(summary.remainingBudget)}
          detail={`Meta mensal de ${formatCurrency(data.monthlyBudget)}`}
        />
        <StatCard
          label="Categoria dominante"
          value={summary.topCategoryName}
          detail={formatCurrency(summary.topCategoryAmount)}
        />
        <StatCard
          label="Projeção do mês"
          value={formatCurrency(summary.projectedMonthEnd)}
          detail={`Receita atual de ${formatCurrency(data.income)}`}
        />
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Distribuição por categoria"
          subtitle="Veja onde seu dinheiro está mais concentrado."
        >
          <DonutChart
            labels={data.categories.map((item) => item.name)}
            values={data.categories.map((item) => item.amount)}
            colors={data.categories.map((item) => item.color)}
          />
        </Panel>

        <Panel
          title="Gastos por semana"
          subtitle="Comparação simples do ritmo ao longo do mês."
        >
          <BarChart
            labels={data.weeklySpending.map((item) => item.label)}
            values={data.weeklySpending.map((item) => item.amount)}
            color="#32d6ff"
          />
        </Panel>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Insights"
          subtitle="Observação, impacto e leitura do seu comportamento."
        >
          <div className="space-y-3">
            {insights.slice(0, 6).map((item) => (
              <InsightCard key={item.title} item={item} />
            ))}
          </div>
        </Panel>

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
      </section>
    </main>
  );
};
