import { and, eq } from 'drizzle-orm'

import { db } from '@/database/drizzle'
import { financeCategories } from '@/database/drizzle/schema'
import { ConflictError } from '@/shared/errors/conflict-error'
import type {
  CategoryResponse,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '@/shared/schemas/category'

const UNIQUE_VIOLATION_CODE = '23505'

function rowToResponse(row: {
  id: string
  userId: string
  name: string
  color: string | null
  icon: string | null
  kind: 'expense' | 'income' | 'investment'
  createdAt: Date
  updatedAt: Date
}): CategoryResponse {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    color: row.color,
    icon: row.icon,
    kind: row.kind,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export class CategoryController {
  async list(userId: string): Promise<CategoryResponse[]> {
    const rows = await db
      .select()
      .from(financeCategories)
      .where(eq(financeCategories.userId, userId))
      .orderBy(financeCategories.name)
    return rows.map(rowToResponse)
  }

  async create(
    userId: string,
    params: CreateCategoryParams,
  ): Promise<CategoryResponse> {
    try {
      const [row] = await db
        .insert(financeCategories)
        .values({
          userId,
          name: params.name.trim(),
          color: params.color ?? null,
          icon: params.icon ?? null,
          kind: params.kind ?? 'expense',
        })
        .returning()

      if (!row) throw new Error('Failed to create category')
      return rowToResponse(row)
    } catch (error) {
      const pgError = error as { code?: string }
      if (pgError.code === UNIQUE_VIOLATION_CODE) {
        throw new ConflictError('A category with this name already exists')
      }

      throw error
    }
  }

  async update(
    userId: string,
    id: string,
    params: UpdateCategoryParams,
  ): Promise<CategoryResponse | null> {
    const updateData: {
      name?: string
      color?: string | null
      icon?: string | null
      kind?: 'expense' | 'income' | 'investment'
    } = {}
    if (params.name !== undefined) {
      updateData.name = params.name.trim()
    }

    if (params.color !== undefined) {
      updateData.color = params.color
    }

    if (params.icon !== undefined) {
      updateData.icon = params.icon
    }

    if (params.kind !== undefined) {
      updateData.kind = params.kind
    }

    const [row] = await db
      .update(financeCategories)
      .set(updateData)
      .where(
        and(eq(financeCategories.id, id), eq(financeCategories.userId, userId)),
      )
      .returning()

    return row ? rowToResponse(row) : null
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const [deleted] = await db
      .delete(financeCategories)
      .where(
        and(eq(financeCategories.id, id), eq(financeCategories.userId, userId)),
      )
      .returning({ id: financeCategories.id })
    return Boolean(deleted)
  }
}
