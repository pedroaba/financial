import { api } from '@/lib/api'
import type { UpdateCategoryParams } from '@/shared/schemas/category'

export async function updateCategory(
  categoryId: string,
  params: UpdateCategoryParams,
) {
  await api.put(`categories/${categoryId}`, {
    body: JSON.stringify(params),
  })
}
