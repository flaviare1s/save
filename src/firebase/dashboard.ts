import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'

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

export const subscribeDashboardData = (
  userId: string,
  onData: (data: DashboardData | null) => void,
  onError: () => void,
) => {
  const dashboardRef = doc(db, 'users', userId, 'dashboard', 'summary')

  return onSnapshot(
    dashboardRef,
    (dashboardSnapshot) => {
      onData(
        dashboardSnapshot.exists()
          ? (dashboardSnapshot.data() as DashboardData)
          : null,
      )
    },
    () => {
      onError()
    },
  )
}

type DashboardSettingsInput = {
  income: number
  monthlyBudget: number
  savingsGoal: number
  categories: Pick<CategorySpend, 'name' | 'amount' | 'budget' | 'idealShare' | 'color'>[]
}

const normalizeMoney = (value: number) => {
  return Number.isFinite(value) && value > 0 ? value : 0
}

const buildDashboardSettingsData = (
  currentData: DashboardData,
  input: DashboardSettingsInput,
) => {
  const categories = input.categories.map((category) => ({
    ...category,
    amount: normalizeMoney(category.amount),
    budget: normalizeMoney(category.budget),
  }))
  const totalSpent = categories.reduce((sum, category) => sum + category.amount, 0)

  return {
    ...currentData,
    income: normalizeMoney(input.income),
    monthlyBudget: normalizeMoney(input.monthlyBudget),
    savingsGoal: normalizeMoney(input.savingsGoal),
    totalSpent,
    categories,
  }
}

export const updateDashboardSettings = async (
  userId: string,
  currentData: DashboardData,
  input: DashboardSettingsInput,
) => {
  const nextData = buildDashboardSettingsData(currentData, input)

  await setDoc(
    doc(db, 'users', userId, 'dashboard', 'summary'),
    nextData,
    { merge: true },
  )

  return nextData
}
