import type { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { db } from "./config";
import type { DashboardData } from "./dashboard-types";

export type OnboardingPreferences = {
  category: string;
  priority: string;
  view: string;
};

const categoryColors: Record<string, string> = {
  Alimentação: "#c084fc",
  Moradia: "#32d6ff",
  Transporte: "#f5ffe7",
  Lazer: "#b6ff00",
};

const categoryBudgets: Record<string, number> = {
  Alimentação: 900,
  Moradia: 1100,
  Transporte: 650,
  Lazer: 700,
};

const idealShares: Record<string, number> = {
  Alimentação: 0.25,
  Moradia: 0.3,
  Transporte: 0.14,
  Lazer: 0.18,
};

const getMariaCategoryAmounts = (favoriteCategory: string) => {
  const amounts: Record<string, number> = {
    Alimentação: 980,
    Moradia: 1120,
    Transporte: 540,
    Lazer: 760,
  };

  if (amounts[favoriteCategory]) {
    amounts[favoriteCategory] += 260;
  }

  return amounts;
};

const createInitialDashboardData = (
  preferences: OnboardingPreferences,
): DashboardData => {
  const amounts = getMariaCategoryAmounts(preferences.category);

  return {
    monthLabel: "Abril",
    income: 5200,
    totalSpent: Object.values(amounts).reduce((sum, amount) => sum + amount, 0),
    monthlyBudget: 4100,
    savingsGoal: 1000,
    categories: Object.entries(amounts).map(([name, amount]) => ({
      name,
      amount,
      budget: categoryBudgets[name],
      idealShare: idealShares[name],
      color: categoryColors[name],
    })),
    weeklySpending: [
      { label: "Sem 1", amount: 760 },
      { label: "Sem 2", amount: 850 },
      { label: "Sem 3", amount: 930 },
      { label: "Sem 4", amount: 1120 },
    ],
    weekdaySpending: [
      { label: "Seg", amount: 190 },
      { label: "Ter", amount: 210 },
      { label: "Qua", amount: 205 },
      { label: "Qui", amount: 225 },
      { label: "Sex", amount: 350 },
      { label: "Sab", amount: 490 },
      { label: "Dom", amount: 420 },
    ],
  };
};

export const saveOnboardingData = async (
  user: User,
  preferences: OnboardingPreferences,
) => {
  const name = user.displayName?.trim() || "Maria de Oliveira";
  const email = user.email || "mariatesteteste@gmail.com";

  await setDoc(
    doc(db, "users", user.uid),
    {
      name,
      email,
      onboardingCompleted: true,
      preferences,
    },
    { merge: true },
  );

  await setDoc(
    doc(db, "users", user.uid, "dashboard", "summary"),
    {
      ...createInitialDashboardData(preferences),
      ownerName: name,
      createdFromOnboarding: true,
    },
    { merge: true },
  );
};
