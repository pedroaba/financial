'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useMemo, useRef } from 'react'
import { toast } from 'sonner'

import { PageList, PageListPagination } from '@/components/page'
import { DataTable } from '@/components/ui/data-table'
import { TABLE_PAGE_SIZE } from '@/constants/settings'
import { deleteCategory } from '@/http/delete-category'
import { listCategories } from '@/http/list-categories'

import { getCategoryColumns } from './category-columns'
import { CategoryListSkeleton } from './category-list-skeleton'
import {
  UpdateCategoryForm,
  type UpdateCategoryFormRef,
} from './update-category-form'

export function CategoryList() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1),
  )

  const pageSize = TABLE_PAGE_SIZE

  const { isLoading, data } = useQuery({
    queryKey: ['categories', currentPage, pageSize],
    queryFn: () => listCategories(currentPage, pageSize),
  })

  const categories = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.ceil(totalCount / pageSize) || 1

  const { mutateAsync: deleteCategoryMutation } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category deleted successfully', { id: context?.toastId })
    },
    onError: (_, _variables, context) => {
      toast.error('Failed to delete category', { id: context?.toastId })
    },
    onMutate: async () => {
      const toastId = toast.loading('Deleting category...')
      return {
        toastId,
      }
    },
  })

  const updateCategoryFormRef = useRef<UpdateCategoryFormRef | null>(null)

  const columns = useMemo(
    () =>
      getCategoryColumns(
        // eslint-disable-next-line react-hooks/refs
        (category) => updateCategoryFormRef.current?.open(category),
        deleteCategoryMutation,
      ),
    [deleteCategoryMutation],
  )

  function handleNextPage() {
    if (currentPage >= totalPages) {
      return
    }

    setCurrentPage(currentPage + 1)
  }

  function handlePrevieousPage() {
    if (currentPage <= 1) {
      return
    }

    setCurrentPage(currentPage - 1)
  }

  if (isLoading) {
    return <CategoryListSkeleton />
  }

  return (
    <PageList.Root>
      <PageList.TableContainer>
        <DataTable
          columns={columns}
          data={categories}
          emptyMessage="No categories found"
        />
      </PageList.TableContainer>
      <PageListPagination.Root>
        <PageListPagination.CurrentPage>
          Página {currentPage} de {totalPages}
        </PageListPagination.CurrentPage>
        <PageListPagination.ActionsWrapper>
          <PageListPagination.Action
            disabled={currentPage <= 1}
            onClick={handlePrevieousPage}
          >
            Previous
          </PageListPagination.Action>

          <PageListPagination.Action
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={handleNextPage}
          >
            Next
          </PageListPagination.Action>
        </PageListPagination.ActionsWrapper>
      </PageListPagination.Root>
      <UpdateCategoryForm ref={updateCategoryFormRef} />
    </PageList.Root>
  )
}
