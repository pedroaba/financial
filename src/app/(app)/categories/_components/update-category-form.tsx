'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useImperativeHandle, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { ColorPickerField } from '@/components/color-picker-field'
import { Button } from '@/components/ui/button'
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
import { updateCategory } from '@/http/update-category'
import type { Category } from '@/shared/schemas/category'
import { RandomColor } from '@/utils/get-random-color'

const schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  color: z.string().max(50).optional().nullable(),
  kind: z.enum(['expense', 'income', 'investment']).nullable(),
})

type Schema = z.infer<typeof schema>

export interface UpdateCategoryFormRef {
  open: (category: Category) => void
}

interface UpdateCategoryFormProps {
  ref: React.RefObject<UpdateCategoryFormRef | null>
}

export function UpdateCategoryForm({ ref }: UpdateCategoryFormProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      color: RandomColor.generate(),
      kind: 'expense',
    },
  })

  const [categoryId, setCategoryId] = useState<string | null>(null)

  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const queryClient = useQueryClient()

  async function handleUpdateCategory(values: Schema) {
    const toastId = toast.loading('Updating category...')
    if (categoryId === null) {
      toast.error('Category not found', { id: toastId })
      return
    }

    try {
      await updateCategory(categoryId, {
        name: values.name,
        color: values.color,
        kind: values.kind ?? 'expense',
      })

      toast.success('Category created successfully', { id: toastId })
      await queryClient.invalidateQueries({ queryKey: ['categories'] })

      setIsDialogOpened(false)
      form.reset({
        name: '',
        color: RandomColor.generate(),
        kind: 'expense',
      })
    } catch (error) {
      console.error(error)

      toast.error('Failed to create category', { id: toastId })
    }
  }

  useImperativeHandle(ref, () => {
    return {
      open: (category: Category) => {
        setIsDialogOpened(true)
        setCategoryId(category.id)
        form.reset(category)
      },
    }
  }, [form])

  return (
    <Dialog
      open={isDialogOpened}
      onOpenChange={(openState) => {
        setIsDialogOpened(openState)
        if (!openState) {
          setCategoryId(null)
          form.reset({
            name: '',
            color: RandomColor.generate(),
            kind: 'expense',
          })
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New category</DialogTitle>
          <DialogDescription>
            Create a new category to organize your expenses, income and
            investments.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <FormRoot onSubmit={form.handleSubmit(handleUpdateCategory)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. food" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorPickerField
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      className="h-auto w-full gap-2"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kind"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kind</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? 'expense'}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a kind" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
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
                  : 'Update Category'}
              </Button>
            </div>
          </FormRoot>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
