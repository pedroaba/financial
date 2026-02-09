'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useImperativeHandle, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { BucketSelector } from '@/components/bucket-selector'
import { CategorySelector } from '@/components/category-selector'
import { Button } from '@/components/ui/button'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRoot,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { updateTransaction } from '@/http/update-transaction'
import type { TransactionWithCategoryAndBucket } from '@/shared/schemas/transaction'

const schema = z.object({
  type: z.enum(['income', 'expense', 'savings']),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().max(500).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  bucketId: z.string().uuid().optional().nullable(),
  occurredAt: z.string().min(1, 'Date and time is required'),
  merchant: z.string().max(200).optional(),
})

type Schema = z.infer<typeof schema>

function getDefaultOccurredAt(): string {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function occurredAtToDatetimeLocal(iso: string): string {
  try {
    const date = new Date(iso)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  } catch {
    return getDefaultOccurredAt()
  }
}

export interface UpdateTransactionFormRef {
  open: (transaction: TransactionWithCategoryAndBucket) => void
}

interface UpdateTransactionFormProps {
  ref: React.RefObject<UpdateTransactionFormRef | null>
}

export function UpdateTransactionForm({ ref }: UpdateTransactionFormProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'expense',
      amount: 1,
      description: '',
      categoryId: null,
      bucketId: null,
      occurredAt: getDefaultOccurredAt(),
      merchant: '',
    },
  })

  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const queryClient = useQueryClient()
  const type = useWatch({
    control: form.control,
    name: 'type',
    defaultValue: 'expense',
  })

  async function handleUpdateTransaction(values: Schema) {
    const toastId = toast.loading('Updating transaction...')
    if (transactionId === null) {
      toast.error('Transaction not found', { id: toastId })
      return
    }

    try {
      const occurredAt =
        values.occurredAt.includes('Z') || values.occurredAt.includes('+')
          ? values.occurredAt
          : new Date(values.occurredAt).toISOString()

      await updateTransaction(transactionId, {
        type: values.type,
        amount: values.amount,
        occurredAt,
        description: values.description ?? null,
        categoryId:
          values.type === 'income' || values.type === 'expense'
            ? (values.categoryId ?? null)
            : null,
        bucketId: values.type === 'savings' ? (values.bucketId ?? null) : null,
        merchant: values.merchant ?? null,
      })

      toast.success('Transaction updated successfully', { id: toastId })
      await queryClient.invalidateQueries({ queryKey: ['transactions'] })

      setIsDialogOpened(false)
      setTransactionId(null)
      form.reset({
        type: 'expense',
        amount: 1,
        description: '',
        categoryId: null,
        bucketId: null,
        occurredAt: getDefaultOccurredAt(),
        merchant: '',
      })
    } catch (error) {
      console.error(error)
      toast.error('Failed to update transaction', { id: toastId })
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      open: (transaction: TransactionWithCategoryAndBucket) => {
        setTransactionId(transaction.id)
        setIsDialogOpened(true)
        form.reset({
          type: transaction.type as 'income' | 'expense' | 'savings',
          amount: Number(transaction.amount) || 1,
          description: transaction.description ?? '',
          categoryId: transaction.categoryId ?? null,
          bucketId: transaction.bucketId ?? null,
          occurredAt: occurredAtToDatetimeLocal(transaction.occurredAt),
          merchant: transaction.merchant ?? '',
        })
      },
    }),
    [form],
  )

  return (
    <Dialog
      open={isDialogOpened}
      onOpenChange={(openState) => {
        setIsDialogOpened(openState)
        if (!openState) {
          setTransactionId(null)
          form.reset({
            type: 'expense',
            amount: 1,
            description: '',
            categoryId: null,
            bucketId: null,
            occurredAt: getDefaultOccurredAt(),
            merchant: '',
          })
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
          <DialogDescription>
            Update income, expense, or savings transaction.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <FormRoot onSubmit={form.handleSubmit(handleUpdateTransaction)}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? 0 : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="occurredAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date and time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick date and time"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Groceries"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(type === 'income' || type === 'expense') && (
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (optional)</FormLabel>
                    <FormControl>
                      <CategorySelector
                        value={field.value ?? null}
                        onChange={field.onChange}
                        kind={type}
                        placeholder="Select category"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {type === 'savings' && (
              <FormField
                control={form.control}
                name="bucketId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bucket (optional)</FormLabel>
                    <FormControl>
                      <BucketSelector
                        value={field.value ?? null}
                        onChange={field.onChange}
                        placeholder="Select bucket"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="merchant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merchant (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Store name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  disabled={form.formState.isSubmitting}
                  type="button"
                  variant="outline"
                >
                  {form.formState.isSubmitting ? 'Cancelling...' : 'Cancel'}
                </Button>
              </DialogClose>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting && <Spinner />}
                {form.formState.isSubmitting
                  ? 'Updating...'
                  : 'Update transaction'}
              </Button>
            </div>
          </FormRoot>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
