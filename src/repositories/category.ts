import { and, desc, eq } from 'drizzle-orm'

import { db } from '@/database/drizzle'
import { financeCategories } from '@/database/drizzle/schema'
import { CategoryMapper } from '@/mappers/category'
import type {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '@/shared/schemas/category'

export class CategoryRepository {
  async listByUserId(userId: string): Promise<Category[]> {
    const rawCategories = await db
      .select()
      .from(financeCategories)
      .where(eq(financeCategories.userId, userId))
      .orderBy(desc(financeCategories.createdAt))

    return rawCategories.map(CategoryMapper.toResponse)
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
