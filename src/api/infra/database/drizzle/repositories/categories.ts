import { and, eq } from 'drizzle-orm'

import { db } from '../drizzle/index'
import { financeCategories } from '../drizzle/schema'

type FinanceCategoryInsert = typeof financeCategories.$inferInsert
type FinanceCategorySelect = typeof financeCategories.$inferSelect

export function listCategoriesByUserId(userId: string) {
  return db
    .select()
    .from(financeCategories)
    .where(eq(financeCategories.userId, userId))
    .orderBy(financeCategories.name)
}

export function getCategoryByIdAndUserId(id: string, userId: string) {
  return db
    .select()
    .from(financeCategories)
    .where(
      and(eq(financeCategories.id, id), eq(financeCategories.userId, userId)),
    )
    .limit(1)
    .then((rows) => rows[0])
}

export function createCategory(
  userId: string,
  data: Omit<
    FinanceCategoryInsert,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
  >,
) {
  return db
    .insert(financeCategories)
    .values({
      userId,
      name: data.name,
      color: data.color ?? null,
      icon: data.icon ?? null,
      kind: data.kind ?? 'expense',
    })
    .returning()
    .then((rows) => rows[0])
}

export function updateCategory(
  id: string,
  userId: string,
  data: Partial<
    Pick<FinanceCategorySelect, 'name' | 'color' | 'icon' | 'kind'>
  >,
) {
  return db
    .update(financeCategories)
    .set(data)
    .where(
      and(eq(financeCategories.id, id), eq(financeCategories.userId, userId)),
    )
    .returning()
    .then((rows) => rows[0])
}

export function deleteCategory(id: string, userId: string) {
  return db
    .delete(financeCategories)
    .where(
      and(eq(financeCategories.id, id), eq(financeCategories.userId, userId)),
    )
    .returning()
    .then((rows) => rows[0])
}
