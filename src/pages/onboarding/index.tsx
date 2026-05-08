import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockData } from "../../data/mockData";
import { ROUTE_PATHS } from "../../routes/paths";
import { useAuth } from "../../contexts/auth-context";
import { saveOnboardingData } from "../../firebase/onboarding";
import { Pencil, Eye, X } from "lucide-react";

export const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshUserStatus } = useAuth();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  
  const [tipoGasto, setTipoGasto] = useState<"essencial" | "nao_essencial" | "">("");

  const [categoria, setCategoria] = useState("");
  const [contextoEmocional, setContextoEmocional] = useState("");
  const [periodo, setPeriodo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // CRUD States
  const [editingId, setEditingId] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [viewingTransaction, setViewingTransaction] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 10;

  const essentialCategories = [
    { id: "contas", icon: "📄", label: "Contas Básicas" },
    { id: "moradia", icon: "🏠", label: "Moradia" },
    { id: "mercado", icon: "🛒", label: "Mercado/Feira" },
    { id: "saude", icon: "💊", label: "Saúde & Farmácia" },
    { id: "filhos", icon: "👶", label: "Filhos" },
    { id: "transporte", icon: "🚌", label: "Transporte" },
    { id: "investimento", icon: "💰", label: "Investimentos/Reserva" }
  ];

  const categories = [
    { id: "alimentacao", icon: "🍔", label: "Alimentação" },
    { id: "moda", icon: "👗", label: "Moda" },
    { id: "beleza", icon: "💄", label: "Beleza" },
    { id: "social", icon: "🥂", label: "Social" },
    { id: "digital", icon: "📱", label: "Digital" },
    { id: "autodesenvolvimento", icon: "📚", label: "Autodesenvolvimento" },
    { id: "conforto", icon: "🛋️", label: "Conforto" }
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

  const resetForm = () => {
    setDescricao("");
    setValor("");
    setData("");
    setTipoGasto("");
    setCategoria("");
    setContextoEmocional("");
    setPeriodo("");
    setEditingId(null);
    setError("");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (transaction: any) => {
    setEditingId(transaction.id);
    setDescricao(transaction.descricao);
    setValor(transaction.valor.toString().replace(".", ","));
    setData(transaction.data);
    
    const isEssential = essentialCategories.some(c => c.id === transaction.categoria);
    setTipoGasto(isEssential ? "essencial" : "nao_essencial");
    
    setCategoria(transaction.categoria);
    setContextoEmocional(transaction.contextoEmocional || "");
    setPeriodo(transaction.periodo || "");
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!descricao || !valor || !data || !tipoGasto || !categoria) {
      setError("Por favor, preencha todos os campos obrigatórios básicos.");
      return;
    }

    if (tipoGasto === "nao_essencial" && (!contextoEmocional || !periodo)) {
      setError("Por favor, preencha o contexto emocional e período para gastos não essenciais.");
      return;
    }

    if (!user) {
      navigate(ROUTE_PATHS.login, { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const parsedValor = parseFloat(valor.replace(",", "."));
      const newTransaction = {
        id: editingId || Date.now(),
        data,
        descricao,
        valor: parsedValor,
        categoria,
        subcategoria: "outros", // fallback
        contextoEmocional: tipoGasto === "nao_essencial" ? contextoEmocional : "",
        diaSemana: new Date(data).toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0],
        periodo: tipoGasto === "nao_essencial" ? periodo : ""
      };

      if (editingId) {
        // Atualiza item existente
        const index = mockData.transacoes.findIndex(t => t.id === editingId);
        if (index !== -1) {
          mockData.transacoes[index] = newTransaction;
        }
      } else {
        // CRUD com mock - cria novo
        mockData.transacoes.push(newTransaction);
      }

      // Lógica de backend original (autenticação e onboarding)
      await saveOnboardingData(user, { 
        category: categoria, 
        priority: tipoGasto === "nao_essencial" ? contextoEmocional : "essencial", 
        view: tipoGasto === "nao_essencial" ? periodo : "na" 
      });
      await refreshUserStatus();

      // Limpa o form mas mantém o usuário na tela para ver a lista
      resetForm();
      setLoading(false);
      
    } catch {
      setError("Não foi possível salvar os dados.");
      setLoading(false);
    }
  };

  const getCategoryDisplay = (catId: string) => {
    return categories.find(c => c.id === catId) || essentialCategories.find(c => c.id === catId);
  };
  const getContextDisplay = (ctxId: string) => emotionalContexts.find(c => c.id === ctxId);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 relative">
      {/* Modal de Visualização */}
      {viewingTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#121214] p-6 ring-1 ring-white/10 relative">
            <button 
              onClick={() => setViewingTransaction(null)}
              className="absolute right-6 top-6 text-(--text) hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Detalhes da Transação</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-(--text)">Descrição</p>
                <p className="text-base font-medium text-white">{viewingTransaction.descricao}</p>
              </div>
              <div>
                <p className="text-xs text-(--text)">Valor</p>
                <p className="text-base font-medium text-red-400">
                  R$ {viewingTransaction.valor.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-(--text)">Data</p>
                  <p className="text-sm text-white">{viewingTransaction.data.split('-').reverse().join('/')}</p>
                </div>
                <div>
                  <p className="text-xs text-(--text)">Dia da semana</p>
                  <p className="text-sm text-white capitalize">{viewingTransaction.diaSemana}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-(--text)">Período</p>
                  <p className="text-sm text-white capitalize">{viewingTransaction.periodo || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-(--text)">Subcategoria</p>
                  <p className="text-sm text-white capitalize">{viewingTransaction.subcategoria || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-(--text)">Categoria</p>
                <div className="mt-1 flex items-center gap-2">
                  <span>{getCategoryDisplay(viewingTransaction.categoria)?.icon}</span>
                  <span className="text-sm text-white">{getCategoryDisplay(viewingTransaction.categoria)?.label}</span>
                </div>
              </div>
              {viewingTransaction.contextoEmocional && (
                <div>
                  <p className="text-xs text-(--text)">Contexto Emocional</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span>{getContextDisplay(viewingTransaction.contextoEmocional)?.icon}</span>
                    <span className="text-sm text-white">{getContextDisplay(viewingTransaction.contextoEmocional)?.title}</span>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => {
                const tx = viewingTransaction;
                setViewingTransaction(null);
                handleEdit(tx);
              }}
              className="mt-8 w-full rounded-2xl bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Pencil size={16} />
              Editar este registro
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <p className="text-sm text-(--secondary)">Onboarding</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-(--text-strong)">
          {editingId ? "Editar gasto" : "Registrar novo gasto"}
        </h1>
        <p className="mt-3 text-sm text-(--text)">
          {editingId 
            ? "Atualize as informações desta transação abaixo."
            : "Este app vai analisar seus padrões de consumo. Escolha suas preferências principais para personalizar a experiência."
          }
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
                placeholder="ex: Conta de Luz, iFood - pizza..."
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
            Natureza do gasto *
          </div>
          <p className="mb-4 text-xs text-(--text)">Isso determina como analisamos o seu consumo.</p>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => {
                setTipoGasto("essencial");
                setCategoria(""); // reset category on switch
              }}
              className={`flex flex-col items-start gap-1 rounded-xl p-4 text-left transition cursor-pointer ${
                tipoGasto === "essencial"
                  ? 'bg-(--primary)/20 ring-1 ring-(--primary)'
                  : 'bg-white/5 ring-1 ring-white/10 hover:bg-white/10'
              }`}
            >
              <span className="text-sm font-semibold text-(--text-strong)">Gasto Essencial</span>
              <span className="text-xs text-(--text)">Contas básicas, moradia, mercado, saúde...</span>
            </button>
            <button
              onClick={() => {
                setTipoGasto("nao_essencial");
                setCategoria(""); // reset category on switch
              }}
              className={`flex flex-col items-start gap-1 rounded-xl p-4 text-left transition cursor-pointer ${
                tipoGasto === "nao_essencial"
                  ? 'bg-(--primary)/20 ring-1 ring-(--primary)'
                  : 'bg-white/5 ring-1 ring-white/10 hover:bg-white/10'
              }`}
            >
              <span className="text-sm font-semibold text-(--text-strong)">Gasto Não Essencial</span>
              <span className="text-xs text-(--text)">Estilo de vida, roupas, ifood, social...</span>
            </button>
          </div>
        </section>

        {/* Step 3 - Categorias */}
        {tipoGasto !== "" && (
          <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">3</span>
              Categoria *
            </div>
            
            <div className="flex flex-wrap gap-3">
              {(tipoGasto === "essencial" ? essentialCategories : categories).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoria(cat.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition cursor-pointer ${
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
        )}

        {/* Step 4 & 5 - Somente para Não Essenciais */}
        {tipoGasto === "nao_essencial" && (
          <>
            <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">4</span>
                Como você estava se sentindo? *
              </div>
              <p className="mb-4 text-xs text-(--text)">Isso nos ajuda a identificar padrões emocionais no seu consumo.</p>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {emotionalContexts.map(ctx => (
                  <button
                    key={ctx.id}
                    onClick={() => setContextoEmocional(ctx.id)}
                    className={`flex flex-col items-start gap-1 rounded-xl p-4 text-left transition cursor-pointer ${
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

            <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">5</span>
                Período do dia *
              </div>
              
              <div className="flex flex-wrap gap-3">
                {periods.map(per => (
                  <button
                    key={per.id}
                    onClick={() => setPeriodo(per.id)}
                    className={`rounded-xl px-6 py-3 text-sm font-medium transition cursor-pointer ${
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
          </>
        )}

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 rounded-2xl bg-(--primary) py-4 text-center text-sm font-bold text-slate-950 transition hover:bg-(--primary)/90 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Salvando..." : editingId ? "Atualizar Transação" : "Salvar Transação"}
          </button>
          
          {editingId && (
            <button
              onClick={resetForm}
              className="rounded-2xl bg-white/5 px-6 py-4 text-center text-sm font-bold text-white transition hover:bg-white/10 ring-1 ring-white/10 cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Seção de Gastos Anteriores */}
      <section className="mt-12 pt-10 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-(--text-strong)">Gastos Anteriores</h2>
          
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por descrição ou categoria..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-(--text-strong) outline-none ring-1 ring-white/10 focus:ring-(--primary)"
            />
          </div>
        </div>
        
        {(() => {
          const filteredTransactions = mockData.transacoes.filter(t => 
            t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
            t.categoria.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          if (filteredTransactions.length === 0) {
            return (
              <p className="text-sm text-(--text) bg-white/5 p-6 rounded-2xl ring-1 ring-white/5 text-center">
                Nenhuma transação encontrada.
              </p>
            );
          }

          const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

          return (
            <div className="flex flex-col gap-4">
              <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10 bg-white/5">
                <table className="w-full text-left text-sm text-(--text)">
                  <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-(--text-strong)">
                    <tr>
                      <th scope="col" className="px-4 py-3">Data</th>
                      <th scope="col" className="px-4 py-3">Descrição</th>
                      <th scope="col" className="px-4 py-3">Categoria</th>
                      <th scope="col" className="px-4 py-3">Contexto</th>
                      <th scope="col" className="px-4 py-3">Valor</th>
                      <th scope="col" className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...filteredTransactions]
                      .reverse()
                      .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                      .map(t => {
                        const categoryInfo = getCategoryDisplay(t.categoria);
                        const emotionalInfo = t.contextoEmocional ? getContextDisplay(t.contextoEmocional) : null;

                        return (
                          <tr key={t.id} className="border-b border-white/5 transition hover:bg-white/5 last:border-0">
                            <td className="px-4 py-3 whitespace-nowrap">{t.data.split('-').reverse().join('/')}</td>
                            <td className="px-4 py-3 font-medium text-white">{t.descricao}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="flex items-center gap-1">
                                {categoryInfo?.icon} {categoryInfo?.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {emotionalInfo ? (
                                <span className="flex items-center gap-1 text-(--text)">
                                  {emotionalInfo.icon} {emotionalInfo.title}
                                </span>
                              ) : (
                                <span className="text-(--text) opacity-50">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-red-400 font-medium">
                              R$ -{t.valor.toFixed(2).replace('.', ',')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => setViewingTransaction(t)}
                                  className="p-1.5 rounded-lg bg-white/5 text-(--text) hover:text-white hover:bg-white/10 transition cursor-pointer"
                                  title="Visualizar"
                                >
                                  <Eye size={16} />
                                </button>
                                <button 
                                  onClick={() => handleEdit(t)}
                                  className="p-1.5 rounded-lg bg-(--primary)/10 text-(--primary) hover:bg-(--primary)/20 transition cursor-pointer"
                                  title="Editar"
                                >
                                  <Pencil size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-(--text)">
                    Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} de {filteredTransactions.length} transações
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white disabled:opacity-30 transition hover:bg-white/10 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white disabled:opacity-30 transition hover:bg-white/10 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </section>
    </main>
  );
};
