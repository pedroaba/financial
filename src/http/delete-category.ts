import { api } from '@/lib/api'

interface DeleteCategoryParams {
  categoryId: string
}

export async function deleteCategory(params: DeleteCategoryParams) {
  await api.delete(`categories/${params.categoryId}`)
}
