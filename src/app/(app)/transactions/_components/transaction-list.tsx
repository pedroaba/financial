'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EllipsisIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteTransaction } from '@/http/delete-transaction'
import { listTransactions } from '@/http/list-transactions'
import { cn } from '@/lib/utils'
import type { TransactionWithCategoryAndBucket } from '@/shared/schemas/transaction'

import { TransactionListSkeleton } from './transaction-list-skeleton'
import {
  UpdateTransactionForm,
  type UpdateTransactionFormRef,
} from './update-transaction-form'

const transactionTypeConfig = {
  income: {
    label: 'Income',
    backgroundColor: 'bg-green-500',
    textColor: 'text-white',
    amountClass: 'text-green-600 dark:text-green-400',
    prefix: '+',
  },
  expense: {
    label: 'Expense',
    backgroundColor: 'bg-destructive',
    textColor: 'text-destructive-foreground',
    amountClass: 'text-destructive',
    prefix: '−',
  },
  savings: {
    label: 'Savings',
    backgroundColor: 'bg-blue-500',
    textColor: 'text-white',
    amountClass: 'text-blue-600 dark:text-blue-400',
    prefix: '',
  },
} as const

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatAmount(amount: string): string {
  const num = Number(amount)
  if (Number.isNaN(num)) return amount
  return currencyFormatter.format(num)
}

function formatOccurredAt(occurredAt: string): string {
  try {
    const date = new Date(occurredAt)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return occurredAt
  }
}

function getCategoryOrBucketLabel(
  transaction: TransactionWithCategoryAndBucket,
): string {
  if (transaction.category) return transaction.category.name
  if (transaction.bucket) return transaction.bucket.name
  return '—'
}

export function TransactionList() {
  const queryClient = useQueryClient()

  const { isLoading, data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: listTransactions,
  })

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

  if (isLoading) {
    return <TransactionListSkeleton />
  }

  return (
    <div className="overflow-hidden mt-4 rounded border border-border bg-card/50">
      <Table>
        <TableHeader className="bg-card/80">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="min-w-24 text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="min-w-28 text-muted-foreground">
              Amount
            </TableHead>
            <TableHead className="text-muted-foreground">Description</TableHead>
            <TableHead className="text-muted-foreground">
              Category / Bucket
            </TableHead>
            <TableHead className="min-w-32 text-muted-foreground">
              Date
            </TableHead>
            <TableHead className="text-muted-foreground">Merchant</TableHead>
            <TableHead className="w-24 text-right text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const config =
              transactionTypeConfig[
                transaction.type as keyof typeof transactionTypeConfig
              ]
            return (
              <TableRow
                key={transaction.id}
                className="border-border hover:bg-transparent"
              >
                <TableCell className="py-3">
                  <Badge
                    className={cn(config.textColor, config.backgroundColor)}
                  >
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell
                  className={cn('font-medium tabular-nums', config.amountClass)}
                >
                  {config.prefix}
                  {formatAmount(transaction.amount)}
                </TableCell>
                <TableCell className="max-w-48 truncate">
                  {transaction.description ?? '—'}
                </TableCell>
                <TableCell>{getCategoryOrBucketLabel(transaction)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatOccurredAt(transaction.occurredAt)}
                </TableCell>
                <TableCell className="max-w-32 truncate text-muted-foreground">
                  {transaction.merchant ?? '—'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon-sm">
                        <EllipsisIcon className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          updateTransactionFormRef.current?.open(transaction)
                        }
                      >
                        <PencilIcon className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={async () => {
                          await deleteTransactionMutation({
                            transactionId: transaction.id,
                          })
                        }}
                      >
                        <Trash2Icon className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}

          {transactions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center h-40 text-muted-foreground"
              >
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <UpdateTransactionForm ref={updateTransactionFormRef} />
    </div>
  )
}
