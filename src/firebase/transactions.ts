import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { getCategoryDefinition, isEssentialCategory } from "./categories";
import { db } from "./config";
import {
  buildDashboardDataFromTransactions,
  createEmptyDashboardData,
  getDashboardData,
} from "./dashboard";
import type {
  DashboardData,
  ExpensePeriod,
  ExpenseTransaction,
  Weekday,
} from "./dashboard-types";

export type TransactionInput = {
  date: string;
  description: string;
  amount: number;
  category: string;
  subcategory?: string;
  emotionalContext?: string;
  period?: ExpensePeriod | "";
  isEssential?: boolean;
};

const weekdayByDateIndex: Weekday[] = [
  "domingo",
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
];

const transactionsCollection = (userId: string) => {
  return collection(db, "users", userId, "transactions");
};

const parseTransactionDate = (date: string) => {
  const parsedDate = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
};

const getWeekdayFromDate = (date: string): Weekday => {
  return weekdayByDateIndex[parseTransactionDate(date).getDay()];
};

const normalizeMoney = (value: number) => {
  return Number.isFinite(value) && value > 0 ? value : 0;
};

const normalizeTransaction = (
  id: string,
  data: Record<string, unknown>,
): ExpenseTransaction => {
  const date = typeof data.date === "string" ? data.date : "";
  const category = typeof data.category === "string" ? data.category : "";
  const categoryDefinition = getCategoryDefinition(category);
  const rawPeriod = typeof data.period === "string" ? data.period : "";
  const period: ExpenseTransaction["period"] =
    rawPeriod === "manha" || rawPeriod === "tarde" || rawPeriod === "noite"
      ? rawPeriod
      : "";

  return {
    id,
    date,
    description:
      typeof data.description === "string" ? data.description : "Sem descrição",
    amount: normalizeMoney(Number(data.amount)),
    category,
    subcategory:
      typeof data.subcategory === "string" ? data.subcategory : "outros",
    emotionalContext:
      typeof data.emotionalContext === "string" ? data.emotionalContext : "",
    weekday:
      typeof data.weekday === "string"
        ? (data.weekday as Weekday)
        : getWeekdayFromDate(date),
    period,
    isEssential:
      typeof data.isEssential === "boolean"
        ? data.isEssential
        : (categoryDefinition?.isEssential ?? isEssentialCategory(category)),
  };
};

const toFirestoreTransaction = (input: TransactionInput) => {
  const amount = normalizeMoney(input.amount);
  const categoryDefinition = getCategoryDefinition(input.category);
  const isEssential =
    input.isEssential ?? categoryDefinition?.isEssential ?? false;

  return {
    date: input.date,
    description: input.description.trim(),
    amount,
    category: input.category,
    categoryName: categoryDefinition?.name ?? input.category,
    subcategory: input.subcategory?.trim() || "outros",
    emotionalContext: isEssential ? "" : (input.emotionalContext ?? ""),
    weekday: getWeekdayFromDate(input.date),
    period: isEssential ? "" : (input.period ?? ""),
    isEssential,
    updatedAt: serverTimestamp(),
  };
};

const sortTransactions = (transactions: ExpenseTransaction[]) => {
  return [...transactions].sort((first, second) => {
    if (first.date === second.date) {
      return second.id.localeCompare(first.id);
    }

    return second.date.localeCompare(first.date);
  });
};

export const getUserTransactions = async (userId: string) => {
  const transactionsQuery = query(
    transactionsCollection(userId),
    orderBy("date", "desc"),
  );
  const snapshot = await getDocs(transactionsQuery);

  return snapshot.docs.map((transactionDoc) =>
    normalizeTransaction(transactionDoc.id, transactionDoc.data()),
  );
};

export const subscribeUserTransactions = (
  userId: string,
  onData: (transactions: ExpenseTransaction[]) => void,
  onError: () => void,
) => {
  const transactionsQuery = query(
    transactionsCollection(userId),
    orderBy("date", "desc"),
  );

  return onSnapshot(
    transactionsQuery,
    (snapshot) => {
      onData(
        sortTransactions(
          snapshot.docs.map((transactionDoc) =>
            normalizeTransaction(transactionDoc.id, transactionDoc.data()),
          ),
        ),
      );
    },
    () => {
      onError();
    },
  );
};

export const syncDashboardFromTransactions = async (userId: string) => {
  const [currentData, transactions] = await Promise.all([
    getDashboardData(userId),
    getUserTransactions(userId),
  ]);
  const nextDashboardData: DashboardData = transactions.length
    ? buildDashboardDataFromTransactions(transactions, currentData)
    : createEmptyDashboardData(new Date(), currentData);

  await setDoc(
    doc(db, "users", userId, "dashboard", "summary"),
    nextDashboardData,
    { merge: true },
  );

  return nextDashboardData;
};

export const saveUserTransaction = async (
  userId: string,
  input: TransactionInput,
  transactionId?: string | null,
) => {
  const transactionPayload = toFirestoreTransaction(input);

  if (transactionId) {
    await setDoc(
      doc(db, "users", userId, "transactions", transactionId),
      transactionPayload,
      { merge: true },
    );
    await syncDashboardFromTransactions(userId);
    return transactionId;
  }

  const transactionRef = await addDoc(transactionsCollection(userId), {
    ...transactionPayload,
    createdAt: serverTimestamp(),
  });

  await syncDashboardFromTransactions(userId);
  return transactionRef.id;
};

export const deleteUserTransaction = async (
  userId: string,
  transactionId: string,
) => {
  await deleteDoc(doc(db, "users", userId, "transactions", transactionId));
  await syncDashboardFromTransactions(userId);
};
