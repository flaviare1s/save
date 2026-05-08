import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

import { buildCategorySpends } from "./categories";
import { db } from "./config";
import type {
  CategorySpend,
  DashboardData,
  ExpenseTransaction,
  Weekday,
} from "./dashboard-types";

type DashboardSettingsInput = {
  income: number;
  monthlyBudget: number;
  savingsGoal: number;
  categories: Pick<CategorySpend, "id" | "name" | "budget" | "idealShare" | "color" | "isEssential">[];
};

const weekdayLabels: Record<Weekday, string> = {
  segunda: "Seg",
  terca: "Ter",
  quarta: "Qua",
  quinta: "Qui",
  sexta: "Sex",
  sabado: "Sáb",
  domingo: "Dom",
};

const weekdays = Object.keys(weekdayLabels) as Weekday[];

const normalizeMoney = (value: number) => {
  return Number.isFinite(value) && value > 0 ? value : 0;
};

const toDateInput = (date: Date) => {
  return date.toISOString().slice(0, 10);
};

const parseDateInput = (date: string) => {
  const parsedDate = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getMonthPeriod = (referenceDate: Date) => {
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(referenceDate);

  return {
    monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
    periodStart: toDateInput(start),
    periodEnd: toDateInput(end),
  };
};

const getReferenceDate = (transactions: ExpenseTransaction[]) => {
  const newestTransaction = [...transactions]
    .map((transaction) => parseDateInput(transaction.date))
    .filter((date): date is Date => Boolean(date))
    .sort((first, second) => second.getTime() - first.getTime())[0];

  return newestTransaction ?? new Date();
};

const getEmptyWeeklySpending = () => {
  return Array.from({ length: 5 }, (_, index) => ({
    label: `Sem ${index + 1}`,
    amount: 0,
  }));
};

const getEmptyWeekdaySpending = () => {
  return weekdays.map((weekday) => ({
    label: weekdayLabels[weekday],
    amount: 0,
  }));
};

const isInPeriod = (
  transaction: ExpenseTransaction,
  periodStart: string,
  periodEnd: string,
) => {
  return transaction.date >= periodStart && transaction.date <= periodEnd;
};

export const createEmptyDashboardData = (
  referenceDate = new Date(),
  currentData?: DashboardData | null,
): DashboardData => {
  const period = getMonthPeriod(referenceDate);

  return {
    ...period,
    income: currentData?.income ?? 0,
    totalSpent: 0,
    monthlyBudget: currentData?.monthlyBudget ?? 0,
    savingsGoal: currentData?.savingsGoal ?? 0,
    categories: buildCategorySpends(currentData?.categories),
    weeklySpending: getEmptyWeeklySpending(),
    weekdaySpending: getEmptyWeekdaySpending(),
  };
};

export const buildDashboardDataFromTransactions = (
  transactions: ExpenseTransaction[],
  currentData?: DashboardData | null,
): DashboardData => {
  const period = getMonthPeriod(getReferenceDate(transactions));
  const periodTransactions = transactions.filter((transaction) =>
    isInPeriod(transaction, period.periodStart, period.periodEnd),
  );
  const amountsByCategory: Record<string, number> = {};
  const weeklySpending = getEmptyWeeklySpending();
  const weekdaySpending = getEmptyWeekdaySpending();
  const weekdayIndexByLabel = new Map(
    weekdaySpending.map((item, index) => [item.label, index]),
  );

  for (const transaction of periodTransactions) {
    amountsByCategory[transaction.category] =
      (amountsByCategory[transaction.category] ?? 0) + transaction.amount;

    const date = parseDateInput(transaction.date);
    if (date) {
      const weekIndex = Math.min(Math.floor((date.getDate() - 1) / 7), 4);
      weeklySpending[weekIndex].amount += transaction.amount;
    }

    const weekdayLabel = weekdayLabels[transaction.weekday];
    const weekdayIndex = weekdayIndexByLabel.get(weekdayLabel);
    if (weekdayIndex !== undefined) {
      weekdaySpending[weekdayIndex].amount += transaction.amount;
    }
  }

  const categories = buildCategorySpends(
    currentData?.categories,
    amountsByCategory,
  );
  const totalSpent = periodTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  return {
    ...period,
    income: currentData?.income ?? 0,
    totalSpent,
    monthlyBudget: currentData?.monthlyBudget ?? 0,
    savingsGoal: currentData?.savingsGoal ?? 0,
    categories,
    weeklySpending,
    weekdaySpending,
  };
};

export const getDashboardData = async (userId?: string | null) => {
  if (!userId) {
    return null;
  }

  const dashboardRef = doc(db, "users", userId, "dashboard", "summary");
  const dashboardSnapshot = await getDoc(dashboardRef);

  if (!dashboardSnapshot.exists()) {
    return null;
  }

  return dashboardSnapshot.data() as DashboardData;
};

export const ensureDashboardData = async (
  userId: string,
  ownerName?: string,
) => {
  const dashboardRef = doc(db, "users", userId, "dashboard", "summary");
  const dashboardSnapshot = await getDoc(dashboardRef);

  if (dashboardSnapshot.exists()) {
    return dashboardSnapshot.data() as DashboardData;
  }

  const dashboardData = createEmptyDashboardData();
  await setDoc(
    dashboardRef,
    {
      ...dashboardData,
      ownerName: ownerName ?? "",
      createdFromOnboarding: true,
    },
    { merge: true },
  );

  return dashboardData;
};

export const subscribeDashboardData = (
  userId: string,
  onData: (data: DashboardData | null) => void,
  onError: () => void,
) => {
  const dashboardRef = doc(db, "users", userId, "dashboard", "summary");

  return onSnapshot(
    dashboardRef,
    (dashboardSnapshot) => {
      onData(
        dashboardSnapshot.exists()
          ? (dashboardSnapshot.data() as DashboardData)
          : null,
      );
    },
    () => {
      onError();
    },
  );
};

const buildDashboardSettingsData = (
  currentData: DashboardData,
  input: DashboardSettingsInput,
) => {
  const budgetByCategoryId = new Map(
    input.categories.map((category) => [
      category.id,
      {
        budget: normalizeMoney(category.budget),
        idealShare: category.idealShare,
        color: category.color,
        isEssential: category.isEssential,
        name: category.name,
      },
    ]),
  );

  const categories = currentData.categories.map((category) => {
    const nextCategory = budgetByCategoryId.get(category.id);

    return {
      ...category,
      name: nextCategory?.name ?? category.name,
      budget: nextCategory?.budget ?? normalizeMoney(category.budget),
      idealShare: nextCategory?.idealShare ?? category.idealShare,
      color: nextCategory?.color ?? category.color,
      isEssential: nextCategory?.isEssential ?? category.isEssential,
    };
  });

  return {
    ...currentData,
    income: normalizeMoney(input.income),
    monthlyBudget: normalizeMoney(input.monthlyBudget),
    savingsGoal: normalizeMoney(input.savingsGoal),
    categories,
  };
};

export const updateDashboardSettings = async (
  userId: string,
  currentData: DashboardData,
  input: DashboardSettingsInput,
) => {
  const nextData = buildDashboardSettingsData(currentData, input);

  await setDoc(doc(db, "users", userId, "dashboard", "summary"), nextData, {
    merge: true,
  });

  return nextData;
};
