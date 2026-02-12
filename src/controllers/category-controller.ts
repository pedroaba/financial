import type { CategoryRepository } from '@/repositories/category'
import type {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '@/shared/schemas/category'

export class CategoryController {
  constructor(private readonly repository: CategoryRepository) {}

  async list(userId: string): Promise<Category[]> {
    return this.repository.listByUserId(userId)
  }

  async listPaginated(
    userId: string,
    page: number,
    pageSize: number,
  ): Promise<{ items: Category[]; totalCount: number; page: number; pageSize: number }> {
    const { items, totalCount } = await this.repository.listByUserIdPaginated(
      userId,
      page,
      pageSize,
    )
    return { items, totalCount, page, pageSize }
  }

  async create(userId: string, params: CreateCategoryParams) {
    await this.repository.create(userId, params)
  }

  async update(
    userId: string,
    categoryId: string,
    params: UpdateCategoryParams,
  ) {
    await this.repository.update(userId, categoryId, params)
  }

  async delete(userId: string, categoryId: string) {
    await this.repository.delete(userId, categoryId)
  }
}
