import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, X } from "lucide-react";

import {
  essentialCategories,
  getCategoryDefinition,
  getCategoryName,
  lifestyleCategories,
} from "../../firebase/categories";
import type { ExpensePeriod, ExpenseTransaction } from "../../firebase/dashboard-types";
import { saveOnboardingData } from "../../firebase/onboarding";
import {
  deleteUserTransaction,
  saveUserTransaction,
  subscribeUserTransactions,
} from "../../firebase/transactions";
import { ROUTE_PATHS } from "../../routes/paths";
import { useAuth } from "../../contexts/auth-context";

type ExpenseNature = "essencial" | "nao_essencial" | "";

const emotionalContexts = [
  {
    id: "pos_trabalho_exaustivo",
    title: "Exaustão pós-trabalho",
    subtitle: "Compra após um dia cansativo",
  },
  {
    id: "tedio_noturno",
    title: "Tédio noturno",
    subtitle: "Compra por falta do que fazer à noite",
  },
  {
    id: "fomo_social",
    title: "FOMO social",
    subtitle: "Medo de ficar de fora",
  },
  {
    id: "busca_validacao",
    title: "Busca por validação",
    subtitle: "Compra para se sentir melhor",
  },
  {
    id: "ansiedade_futuro",
    title: "Ansiedade sobre o futuro",
    subtitle: "Compra para se preparar ou se acalmar",
  },
];

const periods: Array<{ id: ExpensePeriod; label: string }> = [
  { id: "manha", label: "Manhã" },
  { id: "tarde", label: "Tarde" },
  { id: "noite", label: "Noite" },
];

const itemsPerPage = 10;
const emptyTransactions: ExpenseTransaction[] = [];

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return year && month && day ? `${day}/${month}/${year}` : date;
};

const parseMoney = (value: string) => {
  const normalizedValue = value.replace(/\./g, "").replace(",", ".");
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0;
};

const getContextDisplay = (contextId: string) => {
  return emotionalContexts.find((context) => context.id === contextId);
};

const getPeriodLabel = (period: string) => {
  return periods.find((item) => item.id === period)?.label ?? "-";
};

export const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshUserStatus } = useAuth();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [tipoGasto, setTipoGasto] = useState<ExpenseNature>("");
  const [categoria, setCategoria] = useState("");
  const [contextoEmocional, setContextoEmocional] = useState("");
  const [periodo, setPeriodo] = useState<ExpensePeriod | "">("");
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>([]);
  const [transactionsUserId, setTransactionsUserId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingTransaction, setViewingTransaction] =
    useState<ExpenseTransaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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
        setError("Não foi possível carregar seus gastos.");
        setTransactions([]);
        setTransactionsUserId(user.uid);
      },
    );

    return unsubscribe;
  }, [user]);

  const transactionsLoading = Boolean(user && transactionsUserId !== user.uid);
  const currentTransactions = transactionsLoading ? emptyTransactions : transactions;

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return currentTransactions;
    }

    return currentTransactions.filter((transaction) => {
      const categoryName = getCategoryName(transaction.category).toLowerCase();

      return (
        transaction.description.toLowerCase().includes(normalizedSearch) ||
        transaction.category.toLowerCase().includes(normalizedSearch) ||
        categoryName.includes(normalizedSearch)
      );
    });
  }, [currentTransactions, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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

  const handleEdit = (transaction: ExpenseTransaction) => {
    setEditingId(transaction.id);
    setDescricao(transaction.description);
    setValor(String(transaction.amount).replace(".", ","));
    setData(transaction.date);
    setTipoGasto(transaction.isEssential ? "essencial" : "nao_essencial");
    setCategoria(transaction.category);
    setContextoEmocional(transaction.emotionalContext);
    setPeriodo(transaction.period);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    const parsedValue = parseMoney(valor);

    if (!descricao.trim() || !valor || !data || !tipoGasto || !categoria) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (parsedValue <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }

    if (tipoGasto === "nao_essencial" && (!contextoEmocional || !periodo)) {
      setError("Preencha o contexto emocional e o período para gastos não essenciais.");
      return;
    }

    if (!user) {
      navigate(ROUTE_PATHS.login, { replace: true });
      return;
    }

    setSaving(true);
    setError("");

    try {
      await saveUserTransaction(
        user.uid,
        {
          date: data,
          description: descricao,
          amount: parsedValue,
          category: categoria,
          emotionalContext:
            tipoGasto === "nao_essencial" ? contextoEmocional : "",
          period: tipoGasto === "nao_essencial" ? periodo : "",
          isEssential: tipoGasto === "essencial",
        },
        editingId,
      );

      await saveOnboardingData(user, {
        category: categoria,
        priority:
          tipoGasto === "nao_essencial" ? contextoEmocional : "essencial",
        view: tipoGasto === "nao_essencial" ? periodo : "sem_periodo",
      });
      await refreshUserStatus();
      resetForm();
    } catch {
      setError("Não foi possível salvar o gasto.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (transaction: ExpenseTransaction) => {
    if (!user) {
      return;
    }

    const confirmed = window.confirm(
      `Excluir "${transaction.description}"? Essa ação não pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await deleteUserTransaction(user.uid, transaction.id);
      if (editingId === transaction.id) {
        resetForm();
      }
    } catch {
      setError("Não foi possível excluir o gasto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      {viewingTransaction ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-[#121214] p-6 ring-1 ring-white/10">
            <button
              onClick={() => setViewingTransaction(null)}
              className="absolute right-6 top-6 cursor-pointer text-(--text) transition hover:text-white"
              aria-label="Fechar detalhes"
            >
              <X size={20} />
            </button>
            <h3 className="mb-6 text-xl font-bold text-white">
              Detalhes da transação
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-(--text)">Descrição</p>
                <p className="text-base font-medium text-white">
                  {viewingTransaction.description}
                </p>
              </div>
              <div>
                <p className="text-xs text-(--text)">Valor</p>
                <p className="text-base font-medium text-red-400">
                  {formatCurrency(viewingTransaction.amount)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-(--text)">Data</p>
                  <p className="text-sm text-white">
                    {formatDate(viewingTransaction.date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-(--text)">Dia da semana</p>
                  <p className="text-sm capitalize text-white">
                    {viewingTransaction.weekday}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-(--text)">Período</p>
                  <p className="text-sm text-white">
                    {getPeriodLabel(viewingTransaction.period)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-(--text)">Natureza</p>
                  <p className="text-sm text-white">
                    {viewingTransaction.isEssential ? "Essencial" : "Não essencial"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-(--text)">Categoria</p>
                <p className="mt-1 text-sm text-white">
                  {getCategoryName(viewingTransaction.category)}
                </p>
              </div>
              {viewingTransaction.emotionalContext ? (
                <div>
                  <p className="text-xs text-(--text)">Contexto emocional</p>
                  <p className="mt-1 text-sm text-white">
                    {getContextDisplay(viewingTransaction.emotionalContext)?.title}
                  </p>
                </div>
              ) : null}
            </div>

            <button
              onClick={() => {
                const transaction = viewingTransaction;
                setViewingTransaction(null);
                handleEdit(transaction);
              }}
              className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <Pencil size={16} />
              Editar este registro
            </button>
          </div>
        </div>
      ) : null}

      <div className="mb-8">
        <p className="text-sm text-(--secondary)">Onboarding</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-(--text-strong)">
          {editingId ? "Editar gasto" : "Registrar novo gasto"}
        </h1>
        <p className="mt-3 text-sm text-(--text)">
          Cada lançamento fica salvo na sua conta e alimenta dashboard, análises
          e perfil SAVE.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {error ? (
          <p className="rounded-xl bg-red-500/10 p-4 text-sm text-red-300 ring-1 ring-red-500/20">
            {error}
          </p>
        ) : null}

        <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">
              1
            </span>
            Informações básicas
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-(--text-strong)">
                O que você comprou? *
              </span>
              <input
                type="text"
                placeholder="ex: Conta de luz, iFood, farmácia..."
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
                className="rounded-xl bg-white/5 px-4 py-3 text-sm text-(--text-strong) outline-none ring-1 ring-white/10 focus:ring-(--primary)"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-(--text-strong)">
                  Valor (R$) *
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={valor}
                  onChange={(event) => setValor(event.target.value)}
                  className="rounded-xl bg-white/5 px-4 py-3 text-sm text-(--text-strong) outline-none ring-1 ring-white/10 focus:ring-(--primary)"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-(--text-strong)">
                  Data *
                </span>
                <input
                  type="date"
                  value={data}
                  onChange={(event) => setData(event.target.value)}
                  className="rounded-xl bg-white/5 px-4 py-3 text-sm text-(--text-strong) outline-none ring-1 ring-white/10 focus:ring-(--primary) [color-scheme:dark]"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">
              2
            </span>
            Natureza do gasto *
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => {
                setTipoGasto("essencial");
                setCategoria("");
                setContextoEmocional("");
                setPeriodo("");
              }}
              className={`cursor-pointer rounded-xl p-4 text-left transition ${
                tipoGasto === "essencial"
                  ? "bg-(--primary)/20 ring-1 ring-(--primary)"
                  : "bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              }`}
            >
              <span className="text-sm font-semibold text-(--text-strong)">
                Gasto essencial
              </span>
              <span className="mt-1 block text-xs text-(--text)">
                Contas, moradia, mercado, saúde e transporte.
              </span>
            </button>
            <button
              onClick={() => {
                setTipoGasto("nao_essencial");
                setCategoria("");
              }}
              className={`cursor-pointer rounded-xl p-4 text-left transition ${
                tipoGasto === "nao_essencial"
                  ? "bg-(--primary)/20 ring-1 ring-(--primary)"
                  : "bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              }`}
            >
              <span className="text-sm font-semibold text-(--text-strong)">
                Gasto não essencial
              </span>
              <span className="mt-1 block text-xs text-(--text)">
                Estilo de vida, delivery, moda, social e digital.
              </span>
            </button>
          </div>
        </section>

        {tipoGasto ? (
          <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">
                3
              </span>
              Categoria *
            </div>

            <div className="flex flex-wrap gap-3">
              {(tipoGasto === "essencial"
                ? essentialCategories
                : lifestyleCategories
              ).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setCategoria(category.id)}
                  className={`cursor-pointer rounded-xl px-4 py-3 text-sm font-medium transition ${
                    categoria === category.id
                      ? "bg-(--primary) text-slate-950"
                      : "bg-white/5 text-(--text-strong) ring-1 ring-white/10 hover:bg-white/10"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {tipoGasto === "nao_essencial" ? (
          <>
            <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">
                  4
                </span>
                Como você estava se sentindo? *
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {emotionalContexts.map((context) => (
                  <button
                    key={context.id}
                    onClick={() => setContextoEmocional(context.id)}
                    className={`cursor-pointer rounded-xl p-4 text-left transition ${
                      contextoEmocional === context.id
                        ? "bg-(--primary)/20 ring-1 ring-(--primary)"
                        : "bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-sm font-semibold text-(--text-strong)">
                      {context.title}
                    </span>
                    <span className="mt-1 block text-xs text-(--text)">
                      {context.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-(--text-strong)">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--primary) text-xs text-slate-950">
                  5
                </span>
                Período do dia *
              </div>

              <div className="flex flex-wrap gap-3">
                {periods.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPeriodo(item.id)}
                    className={`cursor-pointer rounded-xl px-6 py-3 text-sm font-medium transition ${
                      periodo === item.id
                        ? "bg-(--primary) text-slate-950"
                        : "bg-white/5 text-(--text-strong) ring-1 ring-white/10 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : null}

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 cursor-pointer rounded-2xl bg-(--primary) py-4 text-center text-sm font-bold text-slate-950 transition hover:bg-(--primary)/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Salvando..."
              : editingId
                ? "Atualizar transação"
                : "Salvar transação"}
          </button>

          {editingId ? (
            <button
              onClick={resetForm}
              className="cursor-pointer rounded-2xl bg-white/5 px-6 py-4 text-center text-sm font-bold text-white ring-1 ring-white/10 transition hover:bg-white/10"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </div>

      <section className="mt-12 border-t border-white/10 pt-10">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-(--text-strong)">
              Gastos anteriores
            </h2>
            <p className="mt-1 text-xs text-(--text)">
              {currentTransactions.length} registros salvos na sua conta.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por descrição ou categoria..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm text-(--text-strong) outline-none ring-1 ring-white/10 focus:ring-(--primary)"
            />
          </div>
        </div>

        {transactionsLoading ? (
          <p className="rounded-2xl bg-white/5 p-6 text-center text-sm text-(--text) ring-1 ring-white/5">
            Carregando gastos...
          </p>
        ) : filteredTransactions.length === 0 ? (
          <p className="rounded-2xl bg-white/5 p-6 text-center text-sm text-(--text) ring-1 ring-white/5">
            Nenhuma transação encontrada.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="overflow-x-auto rounded-2xl bg-white/5 ring-1 ring-white/10">
              <table className="w-full text-left text-sm text-(--text)">
                <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-(--text-strong)">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Data
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Descrição
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Categoria
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Contexto
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Valor
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction) => {
                    const category = getCategoryDefinition(transaction.category);
                    const context = getContextDisplay(transaction.emotionalContext);

                    return (
                      <tr
                        key={transaction.id}
                        className="border-b border-white/5 transition last:border-0 hover:bg-white/5"
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-4 py-3 font-medium text-white">
                          {transaction.description}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          {category?.name ?? transaction.category}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          {context ? (
                            context.title
                          ) : (
                            <span className="text-(--text) opacity-50">-</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-red-400">
                          -{formatCurrency(transaction.amount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingTransaction(transaction)}
                              className="cursor-pointer rounded-lg bg-white/5 p-1.5 text-(--text) transition hover:bg-white/10 hover:text-white"
                              title="Visualizar"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="cursor-pointer rounded-lg bg-(--primary)/10 p-1.5 text-(--primary) transition hover:bg-(--primary)/20"
                              title="Editar"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => {
                                void handleDelete(transaction);
                              }}
                              className="cursor-pointer rounded-lg bg-red-500/10 p-1.5 text-red-300 transition hover:bg-red-500/20"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 ? (
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-(--text)">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                  {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}{" "}
                  de {filteredTransactions.length} transações
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="cursor-pointer rounded-lg bg-white/5 px-3 py-1.5 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="cursor-pointer rounded-lg bg-white/5 px-3 py-1.5 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
};
