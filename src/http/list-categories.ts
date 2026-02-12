import type z from 'zod'

import { api } from '@/lib/api'
import { CategoryPaginatedResponseSchema } from '@/shared/schemas/category'

type CategoryPaginatedResponse = z.infer<typeof CategoryPaginatedResponseSchema>

export async function listCategories(
  page: number = 1,
  pageSize: number = 10,
): Promise<CategoryPaginatedResponse> {
  const response = await api
    .get('categories', { searchParams: { page: String(page), pageSize: String(pageSize) } })
    .json<CategoryPaginatedResponse>()

  return CategoryPaginatedResponseSchema.parse(response)
}
