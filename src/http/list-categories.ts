import type z from 'zod'

import { api } from '@/lib/api'
import { CategoryListResponseSchema } from '@/shared/schemas/category'

type CategoryListResponse = z.infer<typeof CategoryListResponseSchema>

export async function listCategories() {
  const response = await api.get('categories').json<CategoryListResponse>()

  return response
}
