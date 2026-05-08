export type ExpensePeriod = "manha" | "tarde" | "noite";

export type Weekday =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado"
  | "domingo";

export type CategorySpend = {
  id: string;
  name: string;
  amount: number;
  budget: number;
  idealShare: number;
  color: string;
  isEssential: boolean;
};

export type TimePoint = {
  label: string;
  amount: number;
};

export type ExpenseTransaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  subcategory: string;
  emotionalContext: string;
  weekday: Weekday;
  period: ExpensePeriod | "";
  isEssential: boolean;
};

export type DashboardData = {
  monthLabel: string;
  periodStart: string;
  periodEnd: string;
  income: number;
  totalSpent: number;
  monthlyBudget: number;
  savingsGoal: number;
  categories: CategorySpend[];
  weeklySpending: TimePoint[];
  weekdaySpending: TimePoint[];
};

export type InsightTone = "neutral" | "warning" | "positive";

export type InsightItem = {
  title: string;
  description: string;
  tone: InsightTone;
};

export type RecommendationItem = {
  title: string;
  description: string;
};
