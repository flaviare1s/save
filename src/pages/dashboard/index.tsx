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
import { mockData } from "../../data/mockData";

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
  const totalSpentMock = mockData.transacoes.reduce((acc, curr) => acc + curr.valor, 0);

  const categoryCounts = mockData.transacoes.reduce((acc, curr) => {
    acc[curr.categoria] = (acc[curr.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategoryKey = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);
  const categoryNamesMap: Record<string, string> = {
    alimentacao: "Alimentação",
    moda: "Moda",
    social: "Social",
    autodesenvolvimento: "Autodesenvolvimento",
    beleza: "Beleza",
    digital: "Digital",
    conforto: "Conforto"
  };
  const topCategoryNameMock = categoryNamesMap[topCategoryKey] || topCategoryKey;

  const impulseSumMock = mockData.transacoes
    .filter(t => t.subcategoria === "impulso")
    .reduce((acc, curr) => acc + curr.valor, 0);

  const categorySums = mockData.transacoes.reduce((acc, curr) => {
    const catName = categoryNamesMap[curr.categoria] || curr.categoria;
    acc[catName] = (acc[catName] || 0) + curr.valor;
    return acc;
  }, {
    "Alimentação": 0,
    "Moda": 0,
    "Social": 0,
    "Autodesenvolvimento": 0,
    "Beleza": 0,
    "Digital": 0,
    "Conforto": 0
  } as Record<string, number>);

  const donutLabels = Object.keys(categorySums);
  const donutValues = Object.values(categorySums);
  const defaultColors = ["#32d6ff", "#ff32d6", "#d6ff32", "#32ff32", "#ff8832", "#8832ff", "#ff3232"];
  const donutColors = donutLabels.map((_, i) => defaultColors[i % defaultColors.length]);

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

  // if (!data || !summary) {
  //   return (
  //     <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-6">
  //       <section className="w-full rounded-3xl bg-white/5 p-6 text-center ring-1 ring-white/8">
  //         <h1 className="text-2xl font-semibold tracking-[-0.04em] text-(--text-strong)">
  //           Seu dashboard ainda não foi criado
  //         </h1>
  //         <p className="mt-3 text-sm text-(--text)">
  //           Complete o onboarding para gerar suas preferências e os primeiros
  //           dados de análise.
  //         </p>
  //         <Link
  //           to={ROUTE_PATHS.onboarding}
  //           className="mt-5 inline-flex rounded-2xl bg-(--primary) px-5 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
  //         >
  //           Ir para onboarding
  //         </Link>
  //       </section>
  //     </main>
  //   );
  // }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm text-(--secondary)">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-(--text-strong)">
          Olá, {mockData.usuario.nome}!
        </h1>
        <p className="mt-3 text-sm text-(--text)">
          Seus gastos por categoria, padrões principais e algumas ações práticas
          para melhorar o equilíbrio do mês.
        </p>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total gasto"
          value={formatCurrency(totalSpentMock)}
          detail={`De ${formatCurrency(mockData.usuario.rendaMensal)} de renda`}
        />
        <StatCard
          label="Maior categoria"
          value={topCategoryNameMock}
          detail="Mais frequente nas transações"
        />
        <StatCard
          label="Compras por impulso"
          value={formatCurrency(impulseSumMock)}
          detail="Soma de itens 'impulso'"
        />
      </section>

      <section className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Distribuição por categoria"
          subtitle="Veja onde seu dinheiro está mais concentrado."
        >
          <DonutChart
            labels={donutLabels}
            values={donutValues}
            colors={donutColors}
          />
        </Panel>

        <Panel
          title="Ultimas Transacoes"
          subtitle="Veja suas últimas transações realizadas."
        >
          <div className="flex flex-col gap-3 mt-4">
            {[...mockData.transacoes].reverse().slice(0, 7).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-(--text-strong)">{t.descricao}</span>
                  <span className="mt-1 text-xs text-(--text)">{t.data.split('-').reverse().join('/')} • {t.periodo}</span>
                </div>
                <span className="text-sm font-semibold text-red-400">
                  R$ -{t.valor.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      {/* <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Insights"
          subtitle="Observação, impacto e leitura do seu comportamento."
        >
          <div className="space-y-3">
            {insights.slice(0, 4).map((item) => (
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
      </section> */}
      <section className="mt-8">
        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-(--text-strong)">
              Descubra seu perfil SAVE
            </h2>
            <p className="text-(--text) max-w-xl text-sm leading-relaxed">
              Entenda os padrões emocionais por trás do seu consumo e transforme sua relação com o dinheiro.
            </p>
          </div>
          <Link
            to={ROUTE_PATHS.archetypes}
            className="whitespace-nowrap rounded-2xl bg-(--primary) px-6 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90"
          >
            Meu Arquétipo
          </Link>
        </div>
      </section>

    </main>
  );
};
