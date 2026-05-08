import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/auth-context";
import { getDashboardData } from "../../firebase/dashboard";
import type {
  DashboardData,
  ExpenseTransaction,
} from "../../firebase/dashboard-types";
import { subscribeUserTransactions } from "../../firebase/transactions";
import { detectarArquetipo, gerarInsights, arquetipos } from "../../utils/arquetipos";
import { calcularReserva, potencialEconomia } from "../../utils/calculos";
import { ROUTE_PATHS } from "../../routes/paths";
import { ArchetypeCard } from "./archetype-card";
import { InsightCard } from "./insight-card";
import { Progress } from "./progress";
import { Recomendations } from "./recomendations";

import theAestheticAlchemist from "../../assets/images/theAestheticAlchemist.png";
import theComfortCurator from "../../assets/images/theComfortCurator.png";
import theConnectionArchitect from "../../assets/images/theConnectionArchitect.png";
import theDigitalRefugee from "../../assets/images/theDigitalRefugee.png";
import thePragmaticVisionary from "../../assets/images/thePragmaticVisionary.png";
import theNerdColleccor from "../../assets/images/theNerdColleccor.png";

const archetypeImages: Record<string, string> = {
  alquimista_estetica: theAestheticAlchemist,
  curadora_conforto: theComfortCurator,
  arquiteta_conexoes: theConnectionArchitect,
  refugiada_digital: theDigitalRefugee,
  visionaria_pragmatica: thePragmaticVisionary,
  nerd_colecionadora: theNerdColleccor,
};

const emptyTransactions: ExpenseTransaction[] = [];

const toArchetypeTransactions = (transactions: ExpenseTransaction[]) => {
  return transactions.map((transaction) => ({
    valor: transaction.amount,
    categoria: transaction.category,
    contextoEmocional: transaction.emotionalContext,
    periodo: transaction.period || undefined,
    diaSemana: transaction.weekday,
  }));
};

export default function ArquetipoPage() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>([]);
  const [transactionsUserId, setTransactionsUserId] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardUserId, setDashboardUserId] = useState("");
  const [error, setError] = useState("");

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
        setError("Não foi possível carregar seu perfil SAVE.");
        setTransactions([]);
        setTransactionsUserId(user.uid);
      },
    );

    void getDashboardData(user.uid)
      .then((nextDashboardData) => {
        setDashboardData(nextDashboardData);
        setDashboardUserId(user.uid);
      })
      .catch(() => {
        setDashboardData(null);
        setDashboardUserId(user.uid);
      });

    return unsubscribe;
  }, [user]);

  const loadingTransactions = Boolean(user && transactionsUserId !== user.uid);
  const loadingDashboard = Boolean(user && dashboardUserId !== user.uid);
  const currentTransactions = loadingTransactions ? emptyTransactions : transactions;
  const currentDashboardData = loadingDashboard ? null : dashboardData;
  const archetypeTransactions = useMemo(
    () => toArchetypeTransactions(currentTransactions),
    [currentTransactions],
  );
  const detectedArquetipo = useMemo(
    () => detectarArquetipo(archetypeTransactions),
    [archetypeTransactions],
  );
  const arquetipo = useMemo(
    () => ({
      ...detectedArquetipo,
      imagem: archetypeImages[detectedArquetipo.id] ?? "",
    }),
    [detectedArquetipo],
  );
  const insights = useMemo(
    () => gerarInsights(arquetipo, archetypeTransactions),
    [archetypeTransactions, arquetipo],
  );
  const income = currentDashboardData?.income ?? 0;
  const reserva = calcularReserva(income);
  const economia = potencialEconomia(archetypeTransactions);
  const reservaAtual =
    income > 0
      ? Math.max(income - (currentDashboardData?.totalSpent ?? 0), 0)
      : economia.economiaSugerida;

  if (authLoading || loadingTransactions || loadingDashboard) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <p className="text-sm text-(--text)">Carregando perfil SAVE...</p>
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

  if (!transactions.length) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full rounded-3xl bg-white/5 p-6 text-center ring-1 ring-white/8">
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-(--text-strong)">
            Seu perfil ainda está em branco
          </h1>
          <p className="mt-3 text-sm text-(--text)">
            Registre gastos com categoria e contexto emocional para descobrir
            seu arquétipo SAVE.
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
    <div className="min-h-screen bg-[#07110c] text-white">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[#32d6ff]">
            Seu resultado
          </p>
          <h1 className="text-3xl font-bold text-[#f5ffe7] md:text-4xl">
            Meu Arquétipo SAVE
          </h1>
        </div>

        <div className="mb-12">
          <ArchetypeCard arquetipo={arquetipo} />
        </div>

        <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h3 className="mb-8 text-center text-lg font-semibold text-[#f5ffe7]">
            Os Arquétipos SAVE
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {arquetipos.map((item) => {
              const isSelected = arquetipo.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 text-center transition-all duration-300 ${
                    isSelected
                      ? "scale-105 border-[#c084fc] bg-[#c084fc]/10 shadow-lg shadow-[#c084fc]/50"
                      : "border-transparent hover:shadow-md hover:shadow-white/20"
                  }`}
                >
                  {archetypeImages[item.id] ? (
                    <img
                      src={archetypeImages[item.id]}
                      alt={item.nome}
                      className="mx-auto mb-2 h-24 w-24 object-contain brightness-100 transition hover:brightness-125"
                    />
                  ) : (
                    <span className="mb-2 block text-5xl">{item.emoji}</span>
                  )}
                  <p className="mt-2 text-[9px] font-bold uppercase leading-tight text-[#9fb0a3]">
                    {item.nome}
                  </p>
                  {isSelected ? (
                    <span className="mt-2 inline-block rounded-full bg-[#c084fc] px-2 py-0.5 text-[8px] font-bold text-[#07110c]">
                      VOCÊ
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-center text-xl font-semibold text-[#f5ffe7]">
            Seus insights personalizados
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {insights.map((insight, index) => (
              <div
                key={`${insight.emoji}-${index}`}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <InsightCard
                  emoji={insight.emoji}
                  texto={insight.texto}
                  destaque={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <Progress
            nomeReserva={arquetipo.nomeDaReserva}
            meta={reserva.valor}
            atual={reservaAtual}
            cor={arquetipo.cor}
          />
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-center text-xl font-semibold text-[#f5ffe7]">
            Recomendações para você
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {arquetipo.recomendacoes.map((recomendacao, index) => (
              <Recomendations
                key={recomendacao}
                numero={index + 1}
                texto={recomendacao}
                cor={arquetipo.cor}
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <p
            className="mb-3 text-lg font-medium"
            style={{ color: arquetipo.cor }}
          >
            {arquetipo.emoji} Lembre-se
          </p>
          <p className="mx-auto max-w-lg text-sm italic leading-relaxed text-[#9fb0a3]">
            Seu arquétipo não é um rótulo. É uma leitura dos padrões que seus
            próprios registros revelam, para você escolher melhor.
          </p>
        </div>
      </main>
    </div>
  );
}
