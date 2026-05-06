import type { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
  Saúde: "#ff6b6b",
  Família: "#ffa500",
};

const categoryBudgets: Record<string, number> = {
  Alimentação: 900,
  Moradia: 1100,
  Transporte: 650,
  Lazer: 700,
  Saúde: 400,
  Família: 500,
};

const idealShares: Record<string, number> = {
  Alimentação: 0.25,
  Moradia: 0.3,
  Transporte: 0.14,
  Lazer: 0.18,
  Saúde: 0.08,
  Família: 0.05,
};

const createEmptyDashboardData = (): DashboardData => {
  return {
    monthLabel: "Janeiro",
    income: 0,
    totalSpent: 0,
    monthlyBudget: 0,
    savingsGoal: 0,
    categories: Object.entries(categoryBudgets).map(([name]) => ({
      name,
      amount: 0,
      budget: 0,
      idealShare: idealShares[name],
      color: categoryColors[name],
    })),
    weeklySpending: [
      { label: "Sem 1", amount: 0 },
      { label: "Sem 2", amount: 0 },
      { label: "Sem 3", amount: 0 },
      { label: "Sem 4", amount: 0 },
    ],
    weekdaySpending: [
      { label: "Seg", amount: 0 },
      { label: "Ter", amount: 0 },
      { label: "Qua", amount: 0 },
      { label: "Qui", amount: 0 },
      { label: "Sex", amount: 0 },
      { label: "Sab", amount: 0 },
      { label: "Dom", amount: 0 },
    ],
  };
};

export const saveOnboardingData = async (
  user: User,
  preferences: OnboardingPreferences,
) => {
  const name = user.displayName?.trim() || "Usuário";
  const email = user.email || "";

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

  const dashboardRef = doc(db, "users", user.uid, "dashboard", "summary");
  const dashboardSnapshot = await getDoc(dashboardRef);

  if (!dashboardSnapshot.exists()) {
    await setDoc(
      dashboardRef,
      {
        ...createEmptyDashboardData(),
        ownerName: name,
        createdFromOnboarding: true,
      },
      { merge: true },
    );
  }
};
