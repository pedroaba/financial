import { api } from '@/lib/api'
import {
  CreateCategoryParams,
  CreateCategoryParamsSchema,
} from '@/shared/schemas/category'

export async function createCategory(params: CreateCategoryParams) {
  const parsedParams = CreateCategoryParamsSchema.parse(params)
  const response = await api.post('categories', {
    json: {
      name: parsedParams.name,
      color: parsedParams.color,
      kind: parsedParams.kind,
    },
  })

  return response.json()
}
