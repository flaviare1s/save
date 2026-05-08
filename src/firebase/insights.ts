import type {
  CategorySpend,
  DashboardData,
  InsightItem,
  RecommendationItem,
} from "./dashboard-types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value: number) =>
  `${Number.isFinite(value) ? Math.round(value) : 0}%`;

const formatAbsolutePercent = (value: number) => formatPercent(Math.abs(value));

const fallbackCategory: CategorySpend = {
  id: "sem_categoria",
  name: "Sem categoria",
  amount: 0,
  budget: 0,
  idealShare: 0,
  color: "#9fb0a3",
  isEssential: false,
};

const getSpendingCategories = (categories: CategorySpend[]) => {
  return [...categories]
    .filter((category) => category.amount > 0)
    .sort((first, second) => second.amount - first.amount);
};

const getTopCategory = (categories: CategorySpend[]) => {
  return getSpendingCategories(categories)[0] ?? fallbackCategory;
};

const getSharePercent = (amount: number, total: number) => {
  return total > 0 ? (amount / total) * 100 : 0;
};

const getBudgetVariationPercent = (amount: number, budget: number) => {
  if (budget > 0) {
    return ((amount - budget) / budget) * 100;
  }

  return amount > 0 ? 100 : 0;
};

const concentrationTargetShare = 80;

const getConcentrationGroup = (
  categories: CategorySpend[],
  totalSpent: number,
) => {
  const spendingCategories = getSpendingCategories(categories);
  const concentrationCategories: CategorySpend[] = [];
  let concentrationAmount = 0;

  if (totalSpent <= 0) {
    return {
      categories: concentrationCategories,
      share: 0,
    };
  }

  for (const category of spendingCategories) {
    concentrationCategories.push(category);
    concentrationAmount += category.amount;

    if (getSharePercent(concentrationAmount, totalSpent) >= concentrationTargetShare) {
      break;
    }
  }

  return {
    categories: concentrationCategories,
    share: getSharePercent(concentrationAmount, totalSpent),
  };
};

const formatCategoryQuantity = (count: number) => {
  return count === 1 ? "1 categoria" : `${count} categorias`;
};

const formatCategoryNames = (categories: CategorySpend[]) => {
  const names = categories.map((category) => category.name);

  if (names.length <= 1) {
    return names[0] ?? "sem categoria";
  }

  return `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`;
};

const getConcentrationSubject = (categories: CategorySpend[]) => {
  if (categories.length === 1) {
    return {
      subject: `A categoria ${categories[0].name}`,
      verb: "soma",
    };
  }

  return {
    subject: `As ${formatCategoryQuantity(categories.length)} principais categorias (${formatCategoryNames(categories)})`,
    verb: "somam",
  };
};

const getWeekOverWeekChange = (
  weeklySpending: DashboardData["weeklySpending"],
) => {
  const spendingWeeks = weeklySpending.filter((week) => week.amount > 0);

  if (spendingWeeks.length < 2) {
    return 0;
  }

  const previousWeek = spendingWeeks[spendingWeeks.length - 2].amount;
  const currentWeek = spendingWeeks[spendingWeeks.length - 1].amount;

  if (!previousWeek) {
    return 0;
  }

  return ((currentWeek - previousWeek) / previousWeek) * 100;
};

const getWeekendShare = (weekdaySpending: DashboardData["weekdaySpending"]) => {
  const total = weekdaySpending.reduce((sum, item) => sum + item.amount, 0);
  const weekendTotal = weekdaySpending
    .filter((item) => item.label === "Sáb" || item.label === "Dom")
    .reduce((sum, item) => sum + item.amount, 0);

  return total > 0 ? (weekendTotal / total) * 100 : 0;
};

const getVariationRatio = (weeklySpending: DashboardData["weeklySpending"]) => {
  const values = weeklySpending.map((item) => item.amount);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;

  if (!average) {
    return 0;
  }

  const variance =
    values.reduce((sum, value) => sum + (value - average) ** 2, 0) /
    values.length;

  return Math.sqrt(variance) / average;
};

const parseDateInput = (date: string) => {
  const parsedDate = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getDaysBetweenInclusive = (start: Date, end: Date) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.max(
    1,
    Math.floor((end.getTime() - start.getTime()) / millisecondsPerDay) + 1,
  );
};

const getPeriodMetrics = (data: DashboardData) => {
  const start = parseDateInput(data.periodStart);
  const end = parseDateInput(data.periodEnd);
  const today = new Date();

  if (!start || !end) {
    const fallbackDaysElapsed = today.getDate();
    const fallbackDaysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate();

    return {
      daysElapsed: fallbackDaysElapsed,
      daysInPeriod: fallbackDaysInMonth,
      daysLeft: Math.max(fallbackDaysInMonth - fallbackDaysElapsed, 0),
    };
  }

  const daysInPeriod = getDaysBetweenInclusive(start, end);
  const elapsedDate = today < start ? start : today > end ? end : today;
  const daysElapsed = getDaysBetweenInclusive(start, elapsedDate);

  return {
    daysElapsed,
    daysInPeriod,
    daysLeft: Math.max(daysInPeriod - daysElapsed, 0),
  };
};

const getProjectedMonthEnd = (data: DashboardData) => {
  if (data.totalSpent <= 0) {
    return 0;
  }

  const { daysElapsed, daysInPeriod } = getPeriodMetrics(data);
  const dailyAverage = data.totalSpent / daysElapsed;

  return Math.round(dailyAverage * daysInPeriod);
};

const getBudgetRunoutDays = (data: DashboardData) => {
  if (data.monthlyBudget <= 0 || data.totalSpent <= 0) {
    return null;
  }

  const { daysElapsed, daysLeft } = getPeriodMetrics(data);
  const remainingBudget = data.monthlyBudget - data.totalSpent;
  const dailyAverage = data.totalSpent / daysElapsed;

  if (remainingBudget <= 0) {
    return 0;
  }

  return Math.min(daysLeft, Math.floor(remainingBudget / dailyAverage));
};

export const getDashboardInsights = (data: DashboardData): InsightItem[] => {
  const topCategory = getTopCategory(data.categories);
  const topCategoryShare = getSharePercent(topCategory.amount, data.totalSpent);
  const topCategoryVsIdeal = topCategoryShare - topCategory.idealShare * 100;
  const topCategoryVsBudget = getBudgetVariationPercent(
    topCategory.amount,
    topCategory.budget,
  );
  const weekOverWeekChange = getWeekOverWeekChange(data.weeklySpending);
  const weekendShare = getWeekendShare(data.weekdaySpending);
  const concentrationGroup = getConcentrationGroup(
    data.categories,
    data.totalSpent,
  );
  const concentrationSubject = getConcentrationSubject(
    concentrationGroup.categories,
  );
  const hasSpending = data.totalSpent > 0;
  const variationRatio = getVariationRatio(data.weeklySpending);
  const projectedMonthEnd = getProjectedMonthEnd(data);
  const projectedBalance = data.income - projectedMonthEnd;
  const budgetRunoutDays = getBudgetRunoutDays(data);
  const budgetUsage = getSharePercent(data.totalSpent, data.monthlyBudget);
  const isHighlyConcentrated =
    concentrationGroup.categories.length > 0 &&
    concentrationGroup.categories.length <= 2 &&
    concentrationGroup.share >= concentrationTargetShare;

  const budgetInsight: InsightItem =
    data.monthlyBudget <= 0
      ? {
          title: "Orçamento do mês",
          description:
            "Cadastre seu orçamento mensal para o sistema medir margem, ritmo e risco de estouro com precisão.",
          tone: "neutral",
        }
      : {
          title: "Orçamento do mês",
          description: hasSpending
            ? `Você já usou ${formatPercent(budgetUsage)} do orçamento de ${data.monthLabel}.`
            : "Ainda não há gastos no período atual para comparar com o orçamento.",
          tone:
            budgetUsage >= 100 ? "warning" : budgetUsage >= 80 ? "warning" : "positive",
        };

  const runoutInsight: InsightItem =
    budgetRunoutDays === null
      ? {
          title: "Previsão de estouro",
          description:
            "Defina um orçamento mensal e registre alguns gastos para estimar quando sua margem acaba.",
          tone: "neutral",
        }
      : {
          title: "Previsão de estouro",
          description:
            budgetRunoutDays > 0
              ? `Mantendo esse ritmo, sua margem cobre aproximadamente mais ${budgetRunoutDays} dias.`
              : "Seu orçamento mensal já está no limite ou acima dele.",
          tone: budgetRunoutDays > 6 ? "neutral" : "warning",
        };

  return [
    {
      title: "Categoria dominante",
      description: hasSpending
        ? `Você gastou ${formatCurrency(topCategory.amount)} com ${topCategory.name} (${formatPercent(topCategoryShare)} do total).`
        : "Ainda não há gastos registrados para identificar uma categoria dominante.",
      tone: hasSpending && topCategoryShare > 30 ? "warning" : "neutral",
    },
    {
      title: "Limite da categoria",
      description:
        !hasSpending || topCategory.budget <= 0
          ? `${topCategory.name} ainda não tem limite suficiente para comparação.`
          : topCategoryVsBudget > 0
            ? `${topCategory.name} ficou ${formatPercent(topCategoryVsBudget)} acima do limite cadastrado.`
            : topCategoryVsBudget < 0
              ? `${topCategory.name} está ${formatAbsolutePercent(topCategoryVsBudget)} abaixo do limite cadastrado.`
              : `${topCategory.name} está exatamente no limite definido.`,
      tone:
        !hasSpending || topCategory.budget <= 0
          ? "neutral"
          : topCategoryVsBudget > 0
            ? "warning"
            : "positive",
    },
    budgetInsight,
    {
      title: "Distribuição ideal",
      description: !hasSpending
        ? "Registre gastos para comparar sua distribuição real com o plano."
        : topCategoryVsIdeal > 0
          ? `${topCategory.name} está ${formatPercent(topCategoryVsIdeal)} acima da distribuição planejada.`
          : topCategoryVsIdeal < 0
            ? `${topCategory.name} está ${formatAbsolutePercent(topCategoryVsIdeal)} abaixo da distribuição planejada.`
            : `${topCategory.name} está alinhada com a distribuição planejada.`,
      tone: !hasSpending ? "neutral" : topCategoryVsIdeal > 0 ? "warning" : "positive",
    },
    {
      title: "Ritmo semanal",
      description:
        weekOverWeekChange > 0
          ? `Seus gastos aumentaram ${formatPercent(weekOverWeekChange)} em relação à semana anterior com movimento.`
          : weekOverWeekChange < 0
            ? `Seus gastos caíram ${formatAbsolutePercent(weekOverWeekChange)} em relação à semana anterior com movimento.`
            : "Ainda não há variação semanal relevante.",
      tone:
        weekOverWeekChange > 0
          ? "warning"
          : weekOverWeekChange < 0
            ? "positive"
            : "neutral",
    },
    {
      title: "Concentração",
      description: hasSpending
        ? `${concentrationSubject.subject} ${concentrationSubject.verb} ${formatPercent(concentrationGroup.share)} dos gastos. ${
            isHighlyConcentrated
              ? "Poucas categorias explicam quase todo o mês."
              : "A distribuição está menos dependente de uma única frente."
          }`
        : "Ainda não há gastos por categoria para avaliar concentração.",
      tone: isHighlyConcentrated ? "warning" : "neutral",
    },
    {
      title: "Fim de semana",
      description:
        weekendShare >= 35
          ? `Você concentra ${formatPercent(weekendShare)} dos gastos no fim de semana.`
          : weekendShare > 0
            ? `O fim de semana representa ${formatPercent(weekendShare)} dos seus gastos.`
            : "Não há gastos registrados no fim de semana.",
      tone: weekendShare >= 35 ? "warning" : "neutral",
    },
    {
      title: "Consistência",
      description:
        variationRatio > 0.6
          ? "Seus gastos variam bastante entre as semanas, o que dificulta previsão."
          : "Seu ritmo semanal está relativamente estável.",
      tone: variationRatio > 0.6 ? "warning" : "positive",
    },
    {
      title: "Projeção do mês",
      description:
        !hasSpending
          ? "A projeção aparece depois dos primeiros lançamentos."
          : data.income > 0
            ? projectedBalance >= 0
              ? `Mantendo esse ritmo, você termina o período com ${formatCurrency(projectedBalance)} disponíveis.`
              : `Mantendo esse ritmo, você termina o período com déficit de ${formatCurrency(Math.abs(projectedBalance))}.`
            : `Mantendo esse ritmo, o gasto projetado fica em ${formatCurrency(projectedMonthEnd)}.`,
      tone: !hasSpending ? "neutral" : projectedBalance >= 0 ? "positive" : "warning",
    },
    runoutInsight,
  ];
};

export const getDashboardRecommendations = (
  data: DashboardData,
): RecommendationItem[] => {
  const topCategory = getTopCategory(data.categories);
  const weekendShare = getWeekendShare(data.weekdaySpending);
  const weekendImpact = data.totalSpent * (weekendShare / 100) * 0.18;
  const goalGap = data.savingsGoal - (data.income - data.totalSpent);

  if (data.totalSpent <= 0) {
    return [
      {
        title: "Registre seus primeiros gastos",
        description:
          "Com três ou mais lançamentos, o SAVE já consegue apontar padrões por categoria, contexto e dia da semana.",
      },
      {
        title: "Defina seus limites",
        description:
          "Preencha renda, orçamento e metas no perfil para transformar os insights em alertas práticos.",
      },
    ];
  }

  const recommendations: RecommendationItem[] = [
    {
      title: `Teste uma redução de 10% em ${topCategory.name}`,
      description: `Isso liberaria cerca de ${formatCurrency(topCategory.amount * 0.1)} no mês sem mudar todo o orçamento.`,
    },
  ];

  if (weekendImpact > 0) {
    recommendations.push({
      title: "Planeje o fim de semana antes de sexta",
      description: `Um teto simples para lazer e conveniência pode reduzir perto de ${formatCurrency(weekendImpact)} do gasto atual.`,
    });
  }

  recommendations.push({
    title: "Ajuste limites por categoria",
    description:
      "Os gastos vêm das transações; use o perfil apenas para calibrar renda, orçamento e metas.",
  });

  recommendations.push({
    title: "Proteja sua meta de economia",
    description:
      data.savingsGoal > 0 && goalGap > 0
        ? `No ritmo atual, faltam ${formatCurrency(goalGap)} para atingir sua meta.`
        : "Seu nível atual de gastos é compatível com a meta cadastrada.",
  });

  return recommendations;
};

export const getDashboardSummary = (data: DashboardData) => {
  const topCategory = getTopCategory(data.categories);
  const projectedMonthEnd = getProjectedMonthEnd(data);

  return {
    remainingBudget: data.monthlyBudget - data.totalSpent,
    savingsNow: data.income - data.totalSpent,
    topCategoryName: topCategory.amount > 0 ? topCategory.name : "Sem gastos",
    topCategoryAmount: topCategory.amount,
    projectedMonthEnd,
  };
};
