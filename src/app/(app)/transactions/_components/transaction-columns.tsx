'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { EllipsisIcon, PencilIcon, Trash2Icon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TRANSACTION_TYPE_BADGES } from '@/constants/badges'
import { cn } from '@/lib/utils'
import type { TransactionWithCategoryAndBucket } from '@/shared/schemas/transaction'
import { CurrencyFormatter } from '@/utils/format-currency'
import { DateFormatter } from '@/utils/format-date'

function getCategoryOrBucketLabel(
  transaction: TransactionWithCategoryAndBucket,
): string {
  if (transaction.category) {
    return transaction.category.name
  }

  if (transaction.bucket) {
    return transaction.bucket.name
  }

  return '—'
}

type DeleteTransactionMutation = (variables: {
  transactionId: string
}) => Promise<unknown>

export function getTransactionColumns(
  onEditTransaction: (transaction: TransactionWithCategoryAndBucket) => void,
  deleteTransactionMutation: DeleteTransactionMutation,
): ColumnDef<TransactionWithCategoryAndBucket>[] {
  return [
    {
      accessorKey: 'type',
      header: () => (
        <span className="min-w-24 text-muted-foreground">Type</span>
      ),
      cell: ({ row }) => {
        const type = row.getValue(
          'type',
        ) as keyof typeof TRANSACTION_TYPE_BADGES
        const config =
          TRANSACTION_TYPE_BADGES[type] ?? TRANSACTION_TYPE_BADGES.expense
        return (
          <Badge className={cn(config.textColor, config.backgroundColor)}>
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: () => (
        <span className="min-w-28 text-muted-foreground">Amount</span>
      ),
      cell: ({ row }) => {
        const transaction = row.original
        const type = transaction.type as keyof typeof TRANSACTION_TYPE_BADGES
        const config =
          TRANSACTION_TYPE_BADGES[type] ?? TRANSACTION_TYPE_BADGES.expense
        return (
          <span className={cn('font-medium tabular-nums', config.amountClass)}>
            {config.prefix}
            {CurrencyFormatter.format(transaction.amount)}
          </span>
        )
      },
    },
    {
      accessorKey: 'description',
      header: () => <span className="text-muted-foreground">Description</span>,
      cell: ({ row }) => (
        <span className="max-w-48 truncate block">
          {(row.getValue('description') as string | null) ?? '—'}
        </span>
      ),
    },
    {
      id: 'categoryOrBucket',
      header: () => (
        <span className="text-muted-foreground">Category / Bucket</span>
      ),
      cell: ({ row }) => {
        const transaction = row.original
        return (
          <Badge variant="secondary">
            {getCategoryOrBucketLabel(transaction)}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'occurredAt',
      header: () => (
        <span className="min-w-32 text-muted-foreground">Date</span>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {DateFormatter.format((row.getValue('occurredAt') as string) ?? '')}
        </span>
      ),
    },
    {
      accessorKey: 'merchant',
      header: () => <span className="text-muted-foreground">Merchant</span>,
      cell: ({ row }) => (
        <span className="max-w-32 truncate block text-muted-foreground">
          {(row.getValue('merchant') as string | null) ?? '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => (
        <div className="min-w-24 text-muted-foreground text-right">Actions</div>
      ),
      cell: ({ row }) => {
        const transaction = row.original
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm">
                  <EllipsisIcon className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onEditTransaction(transaction)}
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
          </div>
        )
      },
    },
  ]
}
