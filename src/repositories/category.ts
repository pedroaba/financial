import { and, count, desc, eq } from 'drizzle-orm'

import { db } from '@/database/drizzle'
import { financeCategories } from '@/database/drizzle/schema'
import { CategoryMapper } from '@/mappers/category'
import type {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '@/shared/schemas/category'

const MAX_PAGE_SIZE = 50

export class CategoryRepository {
  async listByUserId(userId: string): Promise<Category[]> {
    const rawCategories = await db
      .select()
      .from(financeCategories)
      .where(eq(financeCategories.userId, userId))
      .orderBy(desc(financeCategories.createdAt))

    return rawCategories.map(CategoryMapper.toResponse)
  }

  async listByUserIdPaginated(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<{ items: Category[]; totalCount: number }> {
    const safePageSize = Math.min(
      Math.max(1, pageSize),
      MAX_PAGE_SIZE,
    ) as number
    const offset = (Math.max(1, page) - 1) * safePageSize

    const [countResult, rawCategories] = await Promise.all([
      db
        .select({ count: count() })
        .from(financeCategories)
        .where(eq(financeCategories.userId, userId)),
      db
        .select()
        .from(financeCategories)
        .where(eq(financeCategories.userId, userId))
        .orderBy(desc(financeCategories.createdAt))
        .limit(safePageSize)
        .offset(offset),
    ])

    const totalCount = Number(countResult[0]?.count ?? 0)
    const items = rawCategories.map(CategoryMapper.toResponse)
    return { items, totalCount }
  }

  async create(userId: string, params: CreateCategoryParams) {
    await db.insert(financeCategories).values({
      userId,
      name: params.name.trim(),
      color: params.color ?? null,
      icon: params.icon ?? null,
      kind: params.kind ?? 'expense',
    })
  }

  async update(
    userId: string,
    categoryId: string,
    params: UpdateCategoryParams,
  ) {
    await db
      .update(financeCategories)
      .set({
        name: params.name?.trim() || undefined,
        color: params.color || undefined,
        icon: params.icon || undefined,
        kind: params.kind || undefined,
      })
      .where(
        and(
          eq(financeCategories.id, categoryId),
          eq(financeCategories.userId, userId),
        ),
      )
  }

  async delete(userId: string, categoryId: string) {
    await db
      .delete(financeCategories)
      .where(
        and(
          eq(financeCategories.id, categoryId),
          eq(financeCategories.userId, userId),
        ),
      )
  }
}
