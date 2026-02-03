import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'

import { db } from '../drizzle/index'
import { financeCategories, financeExpenses } from '../drizzle/schema'

type FinanceExpenseInsert = typeof financeExpenses.$inferInsert
type FinanceExpenseSelect = typeof financeExpenses.$inferSelect

export interface ListExpensesFilters {
  dateFrom?: string
  dateTo?: string
  categoryId?: string
  search?: string
  sort?: 'occurredAt' | 'amount'
  order?: 'asc' | 'desc'
}

export function listExpensesByUserId(
  userId: string,
  filters: ListExpensesFilters = {},
) {
  const {
    dateFrom,
    dateTo,
    categoryId,
    search,
    sort = 'occurredAt',
    order = 'desc',
  } = filters

  const conditions = [eq(financeExpenses.userId, userId)]
  if (dateFrom) {
    conditions.push(
      sql`${financeExpenses.occurredAt} >= ${dateFrom}::timestamptz`,
    )
  }
  if (dateTo) {
    conditions.push(
      sql`${financeExpenses.occurredAt} <= ${dateTo}::timestamptz`,
    )
  }
  if (categoryId) {
    conditions.push(eq(financeExpenses.categoryId, categoryId))
  }
  if (search) {
    const pattern = `%${search}%`
    conditions.push(
      or(
        ilike(financeExpenses.description, pattern),
        ilike(financeExpenses.merchant, pattern),
      )!,
    )
  }

  return db
    .select({
      id: financeExpenses.id,
      userId: financeExpenses.userId,
      categoryId: financeExpenses.categoryId,
      amount: financeExpenses.amount,
      description: financeExpenses.description,
      occurredAt: financeExpenses.occurredAt,
      merchant: financeExpenses.merchant,
      notes: financeExpenses.notes,
      createdAt: financeExpenses.createdAt,
      updatedAt: financeExpenses.updatedAt,
      categoryName: financeCategories.name,
      categoryColor: financeCategories.color,
    })
    .from(financeExpenses)
    .leftJoin(
      financeCategories,
      and(
        eq(financeExpenses.categoryId, financeCategories.id),
        eq(financeCategories.userId, userId),
      ),
    )
    .where(and(...conditions))
    .orderBy(
      order === 'desc'
        ? desc(financeExpenses[sort === 'occurredAt' ? 'occurredAt' : 'amount'])
        : financeExpenses[sort === 'occurredAt' ? 'occurredAt' : 'amount'],
    )
}

export function getExpenseByIdAndUserId(id: string, userId: string) {
  return db
    .select()
    .from(financeExpenses)
    .where(and(eq(financeExpenses.id, id), eq(financeExpenses.userId, userId)))
    .limit(1)
    .then((rows) => rows[0])
}

export function createExpense(
  userId: string,
  data: Omit<FinanceExpenseInsert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
) {
  return db
    .insert(financeExpenses)
    .values({
      userId,
      categoryId: data.categoryId ?? null,
      amount: data.amount,
      description: data.description ?? null,
      occurredAt: data.occurredAt,
      merchant: data.merchant ?? null,
      notes: data.notes ?? null,
    })
    .returning()
    .then((rows) => rows[0])
}

export function updateExpense(
  id: string,
  userId: string,
  data: Partial<
    Pick<
      FinanceExpenseSelect,
      | 'categoryId'
      | 'amount'
      | 'description'
      | 'occurredAt'
      | 'merchant'
      | 'notes'
    >
  >,
) {
  return db
    .update(financeExpenses)
    .set(data)
    .where(and(eq(financeExpenses.id, id), eq(financeExpenses.userId, userId)))
    .returning()
    .then((rows) => rows[0])
}

export function deleteExpense(id: string, userId: string) {
  return db
    .delete(financeExpenses)
    .where(and(eq(financeExpenses.id, id), eq(financeExpenses.userId, userId)))
    .returning()
    .then((rows) => rows[0])
}
