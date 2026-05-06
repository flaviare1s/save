import { doc, getDoc, setDoc } from 'firebase/firestore'

import { db } from './config'
import type { CategorySpend, DashboardData } from './dashboard-types'

export const getDashboardData = async (userId?: string | null) => {
  if (!userId) {
    return null
  }

  const dashboardRef = doc(db, 'users', userId, 'dashboard', 'summary')
  const dashboardSnapshot = await getDoc(dashboardRef)

  if (!dashboardSnapshot.exists()) {
    return null
  }

  return dashboardSnapshot.data() as DashboardData
}

type DashboardSettingsInput = {
  income: number
  monthlyBudget: number
  savingsGoal: number
  categories: Pick<CategorySpend, 'name' | 'amount' | 'budget' | 'idealShare' | 'color'>[]
}

export const updateDashboardSettings = async (
  userId: string,
  currentData: DashboardData,
  input: DashboardSettingsInput,
) => {
  const totalSpent = input.categories.reduce((sum, category) => sum + category.amount, 0)

  await setDoc(
    doc(db, 'users', userId, 'dashboard', 'summary'),
    {
      ...currentData,
      income: input.income,
      monthlyBudget: input.monthlyBudget,
      savingsGoal: input.savingsGoal,
      totalSpent,
      categories: input.categories,
    },
    { merge: true },
  )
}
