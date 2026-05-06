import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "./config";

export type UserStatus = {
  onboardingCompleted: boolean;
  profileCompleted: boolean;
};

export const getUserStatus = async (userId: string): Promise<UserStatus> => {
  if (!userId) {
    return {
      onboardingCompleted: false,
      profileCompleted: false,
    };
  }

  try {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      return {
        onboardingCompleted: false,
        profileCompleted: false,
      };
    }

    const data = userSnapshot.data();

    return {
      onboardingCompleted: data.onboardingCompleted || false,
      profileCompleted: data.profileCompleted || false,
    };
  } catch {
    return {
      onboardingCompleted: false,
      profileCompleted: false,
    };
  }
};

export const markProfileAsCompleted = async (userId: string) => {
  if (!userId) return;

  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { profileCompleted: true }, { merge: true });
  } catch (error) {
    console.error("Erro ao marcar profile como completado:", error);
    throw error;
  }
};
