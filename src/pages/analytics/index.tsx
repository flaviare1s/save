import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraficoContexto } from "./context-graphic";
import { useAuth } from "../../contexts/auth-context";
import { getDashboardData } from "../../firebase/dashboard";
import type { DashboardData } from "../../firebase/dashboard-types";

export function Analytics() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      getDashboardData(user.uid).then(setDashboardData);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !dashboardData) {
    return null;
  }

  // Dados de contextos emocionais (mockado por enquanto)
  const contextos = {
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

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pb-24">
      {/* Titulo da pagina */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-strong">
          Sua jornada de consumo
        </h1>
        <p className="text-text mt-1">
          Entenda os padroes emocionais por tras das suas compras
        </p>
      </div>

      {/* Grafico de contexto emocional */}
      <div className="mb-8">
        <GraficoContexto dados={contextos} />
      </div>

      {/* CTA para ver mais */}
      <div className="bg-linear-to-r from-primary to-secondary rounded-2xl p-8 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-strong">
          Pronta para explorar mais insights?
        </h2>
        <p className="text-text mb-6 max-w-md mx-auto">
          Com base nos seus padroes, temos mais analises para voce.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 bg-text-strong text-bg font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Voltar ao Dashboard
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </main>
  );
}
