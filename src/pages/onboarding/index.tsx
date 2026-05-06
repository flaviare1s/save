import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { OptionGroup } from "../../components/option-group";
import { useAuth } from "../../contexts/auth-context";
import { saveOnboardingData } from "../../firebase/onboarding";
import { ROUTE_PATHS } from "../../routes/paths";

const categories = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Lazer",
  "Saúde",
  "Família",
];
const priorities = [
  "Economizar mais",
  "Entender excessos",
  "Receber alertas simples",
];
const views = [
  "Categorias principais",
  "Padrões de consumo",
  "Insights rápidos",
];

export const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshUserStatus } = useAuth();
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState(priorities[0]);
  const [view, setView] = useState(views[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!user) {
      navigate(ROUTE_PATHS.login, { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      await saveOnboardingData(user, { category, priority, view });
      await refreshUserStatus();
      navigate(ROUTE_PATHS.profile, { replace: true });
    } catch {
      setError("Não foi possível salvar suas preferências.");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm text-(--secondary)">Onboarding</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-(--text-strong)">
          Vamos começar pelas categorias
        </h1>
        <p className="mt-3 text-sm text-(--text)">
          Este app vai analisar seus padrões de consumo. Escolha suas
          preferências principais para personalizar a experiência.
        </p>
      </div>

      <div className="space-y-4">
        <OptionGroup
          title="Qual categoria você quer acompanhar mais de perto?"
          options={categories}
          value={category}
          onSelect={setCategory}
        />

        <OptionGroup
          title="Que tipo de ajuda você mais espera?"
          options={priorities}
          value={priority}
          onSelect={setPriority}
        />

        <OptionGroup
          title="Como você prefere visualizar seus hábitos?"
          options={views}
          value={view}
          onSelect={setView}
        />
      </div>

      <section className="mt-6 rounded-2xl bg-white/5 p-5 ring-1 ring-white/8">
        <h2 className="text-base font-semibold text-(--text-strong)">Resumo</h2>

        <p className="mt-3 text-sm text-(--text)">
          Categoria principal:{" "}
          <span className="text-(--text-strong)">{category}</span>
        </p>

        <p className="mt-2 text-sm text-(--text)">
          Preferência: <span className="text-(--text-strong)">{priority}</span>
        </p>

        <p className="mt-2 text-sm text-(--text)">
          Visão desejada: <span className="text-(--text-strong)">{view}</span>
        </p>

        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          className="mt-5 cursor-pointer rounded-2xl bg-(--primary) px-5 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Continuar"}
        </button>
      </section>
    </main>
  );
};
