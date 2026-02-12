'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useMemo, useRef } from 'react'
import { toast } from 'sonner'

import { PageList, PageListPagination } from '@/components/page'
import { DataTable } from '@/components/ui/data-table'
import { TABLE_PAGE_SIZE } from '@/constants/settings'
import { deleteTransaction } from '@/http/delete-transaction'
import { listTransactions } from '@/http/list-transactions'

import { getTransactionColumns } from './transaction-columns'
import { TransactionListSkeleton } from './transaction-list-skeleton'
import {
  UpdateTransactionForm,
  type UpdateTransactionFormRef,
} from './update-transaction-form'

export function TransactionList() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1),
  )

  const pageSize = TABLE_PAGE_SIZE

  const { isLoading, data } = useQuery({
    queryKey: ['transactions', currentPage, pageSize],
    queryFn: () => listTransactions(currentPage, pageSize),
  })

  const transactions = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.ceil(totalCount / pageSize) || 1

  const { mutateAsync: deleteTransactionMutation } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: (_, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transaction deleted successfully', {
        id: context?.toastId,
      })
    },
    onError: (_, _variables, context) => {
      toast.error('Failed to delete transaction', { id: context?.toastId })
    },
    onMutate: async () => {
      const toastId = toast.loading('Deleting transaction...')
      return {
        toastId,
      }
    },
  })

  const updateTransactionFormRef = useRef<UpdateTransactionFormRef | null>(null)

  const columns = useMemo(
    () =>
      getTransactionColumns(
        // eslint-disable-next-line react-hooks/refs
        (transaction) => updateTransactionFormRef.current?.open(transaction),
        deleteTransactionMutation,
      ),
    [deleteTransactionMutation],
  )

  function handleNextPage() {
    if (currentPage >= totalPages) {
      return
    }

    setCurrentPage(currentPage + 1)
  }

  function handlePreviousPage() {
    if (currentPage <= 1) {
      return
    }

    setCurrentPage(currentPage - 1)
  }

  if (isLoading) {
    return <TransactionListSkeleton />
  }

  return (
    <PageList.Root>
      <PageList.TableContainer>
        <DataTable
          columns={columns}
          data={transactions}
          emptyMessage="No transactions found"
        />
      </PageList.TableContainer>
      <PageListPagination.Root>
        <PageListPagination.CurrentPage>
          Página {currentPage} de {totalPages}
        </PageListPagination.CurrentPage>
        <PageListPagination.ActionsWrapper>
          <PageListPagination.Action
            disabled={currentPage <= 1}
            onClick={handlePreviousPage}
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
      <UpdateTransactionForm ref={updateTransactionFormRef} />
    </PageList.Root>
  )
}
