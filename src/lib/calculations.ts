/**
 * Pure calculation helpers for finance aggregations.
 * Used by dashboard (totals per category) and investment balance.
 */

export type ExpenseForTotal = { amount: string; categoryId: string | null }

export function totalSpent(expenses: ExpenseForTotal[]): number {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0)
}

export function totalsByCategory(
  expenses: ExpenseForTotal[],
): Record<string, number> {
  const by: Record<string, number> = {}
  for (const e of expenses) {
    const key = e.categoryId ?? 'uncategorized'
    by[key] = (by[key] ?? 0) + Number(e.amount)
  }
  return by
}

export type TransactionForBalance = {
  type: 'deposit' | 'withdraw'
  amount: string
}

export function bucketBalance(transactions: TransactionForBalance[]): number {
  let balance = 0
  for (const tx of transactions) {
    const amount = Number(tx.amount)
    balance += tx.type === 'deposit' ? amount : -amount
  }
  return balance
}
