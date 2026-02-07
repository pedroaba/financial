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
