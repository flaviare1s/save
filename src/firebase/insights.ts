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
  name: "Sem categoria",
  amount: 0,
  budget: 0,
  idealShare: 0,
  color: "#9fb0a3",
};

const getTopCategory = (categories: CategorySpend[]) => {
  return [...categories].sort(
    (first, second) => second.amount - first.amount,
  )[0] ?? fallbackCategory;
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

const getSpendingCategories = (categories: CategorySpend[]) => {
  return [...categories]
    .filter((category) => category.amount > 0)
    .sort((first, second) => second.amount - first.amount);
};

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
  if (weeklySpending.length < 2) {
    return 0;
  }

  const previousWeek = weeklySpending[weeklySpending.length - 2].amount;
  const currentWeek = weeklySpending[weeklySpending.length - 1].amount;

  if (!previousWeek) {
    return 0;
  }

  return ((currentWeek - previousWeek) / previousWeek) * 100;
};

const getWeekendShare = (weekdaySpending: DashboardData["weekdaySpending"]) => {
  const total = weekdaySpending.reduce((sum, item) => sum + item.amount, 0);
  const weekendTotal = weekdaySpending
    .filter((item) => item.label === "Sab" || item.label === "Dom")
    .reduce((sum, item) => sum + item.amount, 0);

  if (!total) {
    return 0;
  }

  return (weekendTotal / total) * 100;
};

const getVariationLevel = (weeklySpending: DashboardData["weeklySpending"]) => {
  if (!weeklySpending.length) {
    return 0;
  }

  const average =
    weeklySpending.reduce((sum, item) => sum + item.amount, 0) /
    weeklySpending.length;

  const variance =
    weeklySpending.reduce(
      (sum, item) => sum + (item.amount - average) ** 2,
      0,
    ) / weeklySpending.length;

  return Math.sqrt(variance);
};

const getProjectedMonthEnd = (data: DashboardData) => {
  const daysElapsed = 24;
  const daysInMonth = 30;
  const dailyAverage = data.totalSpent / daysElapsed;

  return Math.round(dailyAverage * daysInMonth);
};

const getBudgetRunoutDays = (data: DashboardData) => {
  const daysElapsed = 24;
  const daysLeft = 30 - daysElapsed;
  const remainingBudget = data.monthlyBudget - data.totalSpent;
  const dailyAverage = data.totalSpent / daysElapsed;

  if (remainingBudget <= 0 || dailyAverage <= 0) {
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
  const variationLevel = getVariationLevel(data.weeklySpending);
  const projectedMonthEnd = getProjectedMonthEnd(data);
  const projectedBalance = data.income - projectedMonthEnd;
  const budgetRunoutDays = getBudgetRunoutDays(data);
  const isHighlyConcentrated =
    concentrationGroup.categories.length > 0 &&
    concentrationGroup.categories.length <= 2 &&
    concentrationGroup.share >= concentrationTargetShare;

  return [
    {
      title: "Categoria dominante",
      description: hasSpending
        ? `Você gastou ${formatCurrency(topCategory.amount)} com ${topCategory.name} (${formatPercent(topCategoryShare)} do total). Essa é sua categoria mais forte no momento.`
        : "Ainda não há gastos registrados para identificar uma categoria dominante.",
      tone: hasSpending && topCategoryShare > 30 ? "warning" : "neutral",
    },
    {
      title: "Comparação com limite",
      description:
        topCategory.budget <= 0
          ? `${topCategory.name} ainda não tem limite cadastrado para comparação.`
          : topCategoryVsBudget > 0
            ? `Seu gasto com ${topCategory.name} ficou ${formatPercent(topCategoryVsBudget)} acima do limite da categoria, o que reduz sua margem para economizar neste mês.`
            : topCategoryVsBudget < 0
              ? `Seu gasto com ${topCategory.name} ficou ${formatAbsolutePercent(topCategoryVsBudget)} abaixo do limite da categoria, mantendo margem para economizar neste mês.`
              : `Seu gasto com ${topCategory.name} está exatamente no limite definido para a categoria.`,
      tone:
        topCategory.budget <= 0
          ? "neutral"
          : topCategoryVsBudget > 0
            ? "warning"
            : "positive",
    },
    {
      title: "Distribuição ideal",
      description: !hasSpending
        ? "Ainda não há gastos suficientes para comparar sua distribuição com o plano."
        : topCategoryVsIdeal > 0
          ? `${topCategory.name} está ${formatPercent(topCategoryVsIdeal)} acima da distribuição planejada. Seu orçamento geral ainda funciona, mas a distribuição está desequilibrada.`
          : topCategoryVsIdeal < 0
            ? `${topCategory.name} está ${formatAbsolutePercent(topCategoryVsIdeal)} abaixo da distribuição planejada. Essa categoria não está pressionando o orçamento no momento.`
            : `${topCategory.name} está alinhada com a distribuição planejada.`,
      tone: !hasSpending ? "neutral" : topCategoryVsIdeal > 0 ? "warning" : "positive",
    },
    {
      title: "Ritmo semanal",
      description:
        weekOverWeekChange > 0
          ? `Seus gastos aumentaram ${formatPercent(weekOverWeekChange)} em relação à semana passada, indicando aceleração recente no consumo.`
          : weekOverWeekChange < 0
            ? `Seus gastos caíram ${formatAbsolutePercent(weekOverWeekChange)} em relação à semana passada, indicando desaceleração no consumo.`
            : "Seus gastos ficaram estáveis em relação à semana passada.",
      tone:
        weekOverWeekChange > 0
          ? "warning"
          : weekOverWeekChange < 0
            ? "positive"
            : "neutral",
    },
    {
      title: "Comportamento de consumo",
      description: hasSpending
        ? `${concentrationSubject.subject} ${concentrationSubject.verb} ${formatPercent(concentrationGroup.share)} dos gastos. ${
            isHighlyConcentrated
              ? "Como poucas categorias explicam quase todo o consumo, uma variação nelas pode desequilibrar o mês."
              : "A distribuição está menos dependente de uma ou duas categorias."
          }`
        : "Ainda não há gastos por categoria para avaliar concentração de consumo.",
      tone: isHighlyConcentrated ? "warning" : "neutral",
    },
    {
      title: "Pico de consumo",
      description:
        weekendShare >= 35
          ? `Você concentra ${formatPercent(weekendShare)} dos gastos no fim de semana. Seu padrão de consumo sugere maior impulsividade entre sexta e domingo.`
          : weekendShare > 0
            ? `O fim de semana representa ${formatPercent(weekendShare)} dos seus gastos, sem sinal forte de concentração nesse período.`
            : "Não há gastos registrados no fim de semana.",
      tone: weekendShare >= 35 ? "warning" : "neutral",
    },
    {
      title: "Consistência",
      description:
        variationLevel > 120
          ? "Seus gastos estão com alta variação entre as semanas, o que torna o comportamento menos previsível."
          : "Seu ritmo de gastos está relativamente estável, o que facilita planejamento.",
      tone: variationLevel > 120 ? "warning" : "positive",
    },
    {
      title: "Projeção do mês",
      description:
        projectedBalance >= 0
          ? `Mantendo esse ritmo, você termina o mês com ${formatCurrency(projectedBalance)} disponíveis.`
          : `Mantendo esse ritmo, você termina o mês com déficit de ${formatCurrency(Math.abs(projectedBalance))}.`,
      tone: projectedBalance >= 0 ? "positive" : "warning",
    },
    {
      title: "Previsão de estouro",
      description:
        budgetRunoutDays > 0
          ? `Se nada mudar, seu orçamento atual será consumido em aproximadamente ${budgetRunoutDays} dias.`
          : "Seu orçamento mensal já está no limite ou acima dele.",
      tone: budgetRunoutDays > 6 ? "neutral" : "warning",
    },
  ];
};

export const getDashboardRecommendations = (
  data: DashboardData,
): RecommendationItem[] => {
  const topCategory = getTopCategory(data.categories);
  const tenPercentSaving = topCategory.amount * 0.1;
  const weekendShare = getWeekendShare(data.weekdaySpending);
  const weekendImpact = data.totalSpent * (weekendShare / 100) * 0.18;
  const goalGap = data.savingsGoal - (data.income - data.totalSpent);

  return [
    {
      title: `Reduza 10% em ${topCategory.name}`,
      description: `Um corte simples nessa categoria geraria cerca de ${formatCurrency(tenPercentSaving)} de economia mensal.`,
    },
    {
      title: "Controle melhor os fins de semana",
      description: `Limitar gastos de lazer e conveniência no fim de semana pode reduzir cerca de ${formatCurrency(weekendImpact)} do total atual.`,
    },
    {
      title: "Aproxime sua distribuição do ideal",
      description: `Mover parte do gasto de ${topCategory.name} para categorias essenciais melhora seu equilíbrio sem exigir mudanças radicais.`,
    },
    {
      title: "Proteja sua meta de economia",
      description:
        goalGap > 0
          ? `No ritmo atual, faltam ${formatCurrency(goalGap)} para atingir sua meta de economia.`
          : "Seu nível atual de gastos permite sustentar sua meta de economia.",
    },
  ];
};

export const getDashboardSummary = (data: DashboardData) => {
  const topCategory = getTopCategory(data.categories);
  const projectedMonthEnd = getProjectedMonthEnd(data);

  return {
    remainingBudget: data.monthlyBudget - data.totalSpent,
    savingsNow: data.income - data.totalSpent,
    topCategoryName: topCategory.name,
    topCategoryAmount: topCategory.amount,
    projectedMonthEnd,
  };
};
