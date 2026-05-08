import type { CategorySpend } from "./dashboard-types";

export type CategoryDefinition = {
  id: string;
  name: string;
  defaultBudget: number;
  idealShare: number;
  color: string;
  isEssential: boolean;
};

export const essentialCategories: CategoryDefinition[] = [
  {
    id: "contas",
    name: "Contas básicas",
    defaultBudget: 650,
    idealShare: 0.12,
    color: "#32d6ff",
    isEssential: true,
  },
  {
    id: "moradia",
    name: "Moradia",
    defaultBudget: 1400,
    idealShare: 0.28,
    color: "#8b5cf6",
    isEssential: true,
  },
  {
    id: "mercado",
    name: "Mercado e feira",
    defaultBudget: 900,
    idealShare: 0.18,
    color: "#22c55e",
    isEssential: true,
  },
  {
    id: "saude",
    name: "Saúde e farmácia",
    defaultBudget: 450,
    idealShare: 0.08,
    color: "#f43f5e",
    isEssential: true,
  },
  {
    id: "filhos",
    name: "Filhos",
    defaultBudget: 700,
    idealShare: 0.12,
    color: "#f59e0b",
    isEssential: true,
  },
  {
    id: "transporte",
    name: "Transporte",
    defaultBudget: 500,
    idealShare: 0.1,
    color: "#14b8a6",
    isEssential: true,
  },
  {
    id: "investimento",
    name: "Investimentos e reserva",
    defaultBudget: 500,
    idealShare: 0.1,
    color: "#b6ff00",
    isEssential: true,
  },
];

export const lifestyleCategories: CategoryDefinition[] = [
  {
    id: "alimentacao",
    name: "Alimentação fora",
    defaultBudget: 600,
    idealShare: 0.12,
    color: "#c084fc",
    isEssential: false,
  },
  {
    id: "moda",
    name: "Moda",
    defaultBudget: 350,
    idealShare: 0.07,
    color: "#ec4899",
    isEssential: false,
  },
  {
    id: "beleza",
    name: "Beleza",
    defaultBudget: 300,
    idealShare: 0.06,
    color: "#fb7185",
    isEssential: false,
  },
  {
    id: "social",
    name: "Social",
    defaultBudget: 450,
    idealShare: 0.09,
    color: "#f97316",
    isEssential: false,
  },
  {
    id: "digital",
    name: "Digital",
    defaultBudget: 180,
    idealShare: 0.04,
    color: "#38bdf8",
    isEssential: false,
  },
  {
    id: "autodesenvolvimento",
    name: "Autodesenvolvimento",
    defaultBudget: 350,
    idealShare: 0.07,
    color: "#60a5fa",
    isEssential: false,
  },
  {
    id: "conforto",
    name: "Conforto",
    defaultBudget: 300,
    idealShare: 0.06,
    color: "#a78bfa",
    isEssential: false,
  },
];

export const allCategories = [...essentialCategories, ...lifestyleCategories];

const categoryById = new Map(
  allCategories.map((category) => [category.id, category]),
);

export const getCategoryDefinition = (categoryId: string) => {
  return categoryById.get(categoryId);
};

export const getCategoryName = (categoryId: string) => {
  return categoryById.get(categoryId)?.name ?? categoryId;
};

export const isEssentialCategory = (categoryId: string) => {
  return categoryById.get(categoryId)?.isEssential ?? false;
};

export const buildCategorySpends = (
  currentCategories: CategorySpend[] = [],
  amountsByCategory: Record<string, number> = {},
) => {
  const currentById = new Map(
    currentCategories.map((category) => [category.id || category.name, category]),
  );

  const categories = allCategories.map((definition) => {
    const current = currentById.get(definition.id);

    return {
      id: definition.id,
      name: definition.name,
      amount: amountsByCategory[definition.id] ?? 0,
      budget: current?.budget ?? definition.defaultBudget,
      idealShare: current?.idealShare ?? definition.idealShare,
      color: current?.color ?? definition.color,
      isEssential: definition.isEssential,
    };
  });

  const knownIds = new Set(allCategories.map((category) => category.id));
  const customCategories = currentCategories
    .filter((category) => !knownIds.has(category.id))
    .map((category) => ({
      ...category,
      amount: amountsByCategory[category.id] ?? category.amount ?? 0,
    }));

  return [...categories, ...customCategories];
};
