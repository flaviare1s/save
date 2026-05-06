export type CategorySpend = {
  name: string
  amount: number
  budget: number
  idealShare: number
  color: string
}

export type TimePoint = {
  label: string
  amount: number
}

export type DashboardData = {
  monthLabel: string
  income: number
  totalSpent: number
  monthlyBudget: number
  savingsGoal: number
  categories: CategorySpend[]
  weeklySpending: TimePoint[]
  weekdaySpending: TimePoint[]
}

export type InsightTone = 'neutral' | 'warning' | 'positive'

export type InsightItem = {
  title: string
  description: string
  tone: InsightTone
}

export type RecommendationItem = {
  title: string
  description: string
}
