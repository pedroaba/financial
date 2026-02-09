'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { BucketSelector } from '@/components/bucket-selector'
import { CategorySelector } from '@/components/category-selector'
import { Toolbar } from '@/components/toolbar'
import { Button } from '@/components/ui/button'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { createTransaction } from '@/http/create-transaction'

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

export function CreateTransactionForm() {
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

  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const queryClient = useQueryClient()
  const type = useWatch({
    control: form.control,
    name: 'type',
    defaultValue: 'expense',
  })

  async function handleCreateTransaction(values: Schema) {
    const toastId = toast.loading('Creating transaction...')

    try {
      const occurredAt =
        values.occurredAt.includes('Z') || values.occurredAt.includes('+')
          ? values.occurredAt
          : new Date(values.occurredAt).toISOString()

      await createTransaction({
        type: values.type,
        amount: values.amount,
        occurredAt,
        description: values.description || undefined,
        categoryId:
          values.type === 'income' || values.type === 'expense'
            ? (values.categoryId ?? undefined)
            : undefined,
        bucketId:
          values.type === 'savings'
            ? (values.bucketId ?? undefined)
            : undefined,
        merchant: values.merchant || undefined,
      })

      toast.success('Transaction created successfully', { id: toastId })
      await queryClient.invalidateQueries({ queryKey: ['transactions'] })

      setIsDialogOpened(false)
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
      toast.error('Failed to create transaction', { id: toastId })
    }
  }

  return (
    <Dialog open={isDialogOpened} onOpenChange={setIsDialogOpened}>
      <DialogTrigger asChild>
        <Toolbar.Action>
          <PlusIcon className="size-4" />
          Add transaction
        </Toolbar.Action>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New transaction</DialogTitle>
          <DialogDescription>
            Record income, an expense, or money moved to a savings bucket.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <FormRoot onSubmit={form.handleSubmit(handleCreateTransaction)}>
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
                  ? 'Creating...'
                  : 'Create transaction'}
              </Button>
            </div>
          </FormRoot>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
