import type { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { db } from "./config";
import { ensureDashboardData } from "./dashboard";

export type OnboardingPreferences = {
  category: string;
  priority: string;
  view: string;
};

export const saveOnboardingData = async (
  user: User,
  preferences: OnboardingPreferences,
) => {
  const name = user.displayName?.trim() || "Usuária";
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

  await ensureDashboardData(user.uid, name);
};
