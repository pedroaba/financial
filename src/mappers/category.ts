import { financeCategories } from '@/database/drizzle/schema'
import type { Category } from '@/shared/schemas/category'

type RawCategory = typeof financeCategories.$inferSelect

export class CategoryMapper {
  static toResponse(row: RawCategory): Category {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      color: row.color,
      kind: row.kind,
      icon: row.icon,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }
  }
}
