import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockData } from "../../data/mockData";
import { ROUTE_PATHS } from "../../routes/paths";
import { useAuth } from "../../contexts/auth-context";
import { saveOnboardingData } from "../../firebase/onboarding";

export const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshUserStatus } = useAuth();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [contextoEmocional, setContextoEmocional] = useState("");
  const [periodo, setPeriodo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!descricao || !valor || !data || !categoria || !contextoEmocional || !periodo) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!user) {
      navigate(ROUTE_PATHS.login, { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newTransaction = {
        id: Date.now(),
        data,
        descricao,
        valor: parseFloat(valor.replace(",", ".")),
        categoria,
        subcategoria: "outros", // fallback
        contextoEmocional,
        diaSemana: new Date(data).toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0],
        periodo
      };

      // CRUD com mock
      mockData.transacoes.push(newTransaction);

      // Lógica de backend original (autenticação e onboarding)
      await saveOnboardingData(user, { 
        category: categoria, 
        priority: contextoEmocional, 
        view: periodo 
      });
      await refreshUserStatus();

      navigate(ROUTE_PATHS.dashboard, { replace: true });
    } catch {
      setError("Não foi possível salvar os dados.");
      setLoading(false);
    }
  };

  const categories = [
    { id: "alimentacao", icon: "🍔", label: "Alimentação" },
    { id: "moda", icon: "👗", label: "Moda" },
    { id: "beleza", icon: "💄", label: "Beleza" },
    { id: "social", icon: "🥂", label: "Social" },
    { id: "digital", icon: "📱", label: "Digital" },
    { id: "autodesenvolvimento", icon: "📚", label: "Autodesenvolvimento" },
    { id: "conforto", icon: "🏠", label: "Conforto" }
  ];

  const emotionalContexts = [
    { id: "pos_trabalho_exaustivo", icon: "😫", title: "Exaustão pós trabalho", subtitle: "Compras após um dia cansativo" },
    { id: "tedio_noturno", icon: "🌙", title: "Tédio noturno", subtitle: "Compras por falta do que fazer à noite" },
    { id: "fomo_social", icon: "🎉", title: "FOMO Social", subtitle: "Medo de ficar de fora" },
    { id: "busca_validacao", icon: "🪞", title: "Busca por validação", subtitle: "Compras para se sentir melhor" },
    { id: "ansiedade_futuro", icon: "🔮", title: "Ansiedade sobre o futuro", subtitle: "Compras para se preparar ou se acalmar" },
  ];

  const periods = [
    { id: "manha", label: "Manhã" },
    { id: "tarde", label: "Tarde" },
    { id: "noite", label: "Noite" }
  ];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm text-(--secondary)">Onboarding</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-(--text-strong)">
          Registrar novo gasto
        </h1>
        <p className="mt-3 text-sm text-(--text)">
          Este app vai analisar seus padrões de consumo. Escolha suas preferências principais para personalizar a experiência, lembre-se: Quanto mais detalhes, melhor entendemos seus padrões.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {error ? <p className="text-sm text-red-300 bg-red-500/10 p-4 rounded-xl ring-1 ring-red-500/20">{error}</p> : null}

        {/* Step 1 */}
        <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">1</span>
            Informações básicas
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-(--text-strong)">O que você comprou? *</label>
              <input 
                type="text" 
                placeholder="ex: iFood - pizza, vestido - Zara"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="rounded-xl bg-white/5 px-4 py-3 text-sm text-(--text-strong) outline-none ring-1 ring-white/10 focus:ring-(--primary)"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-(--text-strong)">Valor (R$) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="rounded-xl bg-white/5 px-4 py-3 text-sm text-(--text-strong) outline-none ring-1 ring-white/10 focus:ring-(--primary)"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-(--text-strong)">Data *</label>
                <input 
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="rounded-xl bg-white/5 px-4 py-3 text-sm text-(--text-strong) outline-none ring-1 ring-white/10 focus:ring-(--primary) [color-scheme:dark]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">2</span>
            Categoria *
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoria(cat.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  categoria === cat.id 
                    ? 'bg-(--primary) text-slate-950' 
                    : 'bg-white/5 text-(--text-strong) ring-1 ring-white/10 hover:bg-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Step 3 */}
        <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">3</span>
            Como você estava se sentindo? *
          </div>
          <p className="mb-4 text-xs text-(--text)">Isso nos ajuda a identificar padrões emocionais no seu consumo.</p>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {emotionalContexts.map(ctx => (
              <button
                key={ctx.id}
                onClick={() => setContextoEmocional(ctx.id)}
                className={`flex flex-col items-start gap-1 rounded-xl p-4 text-left transition ${
                  contextoEmocional === ctx.id
                    ? 'bg-(--primary)/20 ring-1 ring-(--primary)'
                    : 'bg-white/5 ring-1 ring-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{ctx.icon}</span>
                  <span className="text-sm font-semibold text-(--text-strong)">{ctx.title}</span>
                </div>
                <span className="text-xs text-(--text)">{ctx.subtitle}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 4 */}
        <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">4</span>
            Período do dia *
          </div>
          
          <div className="flex flex-wrap gap-3">
            {periods.map(per => (
              <button
                key={per.id}
                onClick={() => setPeriodo(per.id)}
                className={`rounded-xl px-6 py-3 text-sm font-medium transition ${
                  periodo === per.id 
                    ? 'bg-(--primary) text-slate-950' 
                    : 'bg-white/5 text-(--text-strong) ring-1 ring-white/10 hover:bg-white/10'
                }`}
              >
                {per.label}
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-4 rounded-2xl bg-(--primary) py-4 text-center text-sm font-bold text-slate-950 transition hover:bg-(--primary)/90 disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar Transação"}
        </button>
      </div>
    </main>
  );
};
