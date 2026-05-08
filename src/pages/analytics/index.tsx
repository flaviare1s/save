import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraficoContexto } from "./context-graphic";
import { HeatmapSemanal } from "./weekly-heatmap";
import { InsightCard } from "./insight-card";
import { useAuth } from "../../contexts/auth-context";
import { mockContextos, mockTransacoes, mockInsights } from "./mock-data";

export function Analytics() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pb-24">
      {/* Titulo da pagina */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-strong">
          Sua jornada de consumo
        </h1>
        <p className="text-text mt-1">
          Entenda os padrões emocionais por trás das suas compras
        </p>
      </div>

      {/* Grafico de contexto emocional */}
      <div className="mb-8">
        <GraficoContexto dados={mockContextos} />
      </div>

      {/* Cards de insights */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-text-strong mb-4">
          Insights sobre seu consumo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockInsights.map((insight, index) => (
            <InsightCard
              key={index}
              emoji={insight.emoji}
              titulo={insight.titulo}
              descricao={insight.descricao}
              destaque={insight.destaque}
            />
          ))}
        </div>
      </div>

      {/* Heatmap semanal */}
      <div className="mb-8">
        <HeatmapSemanal transacoes={mockTransacoes} />
      </div>

      {/* CTA para ver mais */}
      <div className="bg-linear-to-r from-primary to-tertiary rounded-2xl p-8 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-3 text-text-strong">
          Pronta para explorar mais insights?
        </h2>
        <p className="text-black mb-6 max-w-md mx-auto">
          Com base nos seus padrões, temos mais análises para você.
        </p>
        <Link to="/dashboard"
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
        </Link>
      </div>
    </main>
  );
}
