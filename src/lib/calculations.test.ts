import { describe, expect, it } from 'vitest'

import {
  bucketBalance,
  type ExpenseForTotal,
  totalsByCategory,
  totalSpent,
  type TransactionForBalance,
} from './calculations'

describe('totalSpent', () => {
  it('returns 0 for empty list', () => {
    expect(totalSpent([])).toBe(0)
  })

  it('sums expense amounts', () => {
    const expenses: ExpenseForTotal[] = [
      { amount: '100.50', categoryId: 'cat1' },
      { amount: '50.25', categoryId: 'cat2' },
      { amount: '25', categoryId: null },
    ]
    expect(totalSpent(expenses)).toBe(175.75)
  })
})

describe('totalsByCategory', () => {
  it('returns empty object for empty list', () => {
    expect(totalsByCategory([])).toEqual({})
  })

  it('groups by category and sums', () => {
    const expenses: ExpenseForTotal[] = [
      { amount: '100', categoryId: 'food' },
      { amount: '50', categoryId: 'food' },
      { amount: '30', categoryId: 'transport' },
      { amount: '20', categoryId: null },
    ]
    expect(totalsByCategory(expenses)).toEqual({
      food: 150,
      transport: 30,
      uncategorized: 20,
    })
  })
})

describe('bucketBalance', () => {
  it('returns 0 for empty list', () => {
    expect(bucketBalance([])).toBe(0)
  })

  it('sums deposits and subtracts withdraws', () => {
    const transactions: TransactionForBalance[] = [
      { type: 'deposit', amount: '100' },
      { type: 'deposit', amount: '50' },
      { type: 'withdraw', amount: '30' },
    ]
    expect(bucketBalance(transactions)).toBe(120)
  })

  it('handles only withdraws', () => {
    const transactions: TransactionForBalance[] = [
      { type: 'withdraw', amount: '25' },
      { type: 'withdraw', amount: '10' },
    ]
    expect(bucketBalance(transactions)).toBe(-35)
  })
})
