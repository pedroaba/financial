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
import { deleteCategory } from '@/http/delete-category'
import { listCategories } from '@/http/list-categories'
import { cn } from '@/lib/utils'

import { CategoryListSkeleton } from './category-list-skeleton'
import {
  UpdateCategoryForm,
  type UpdateCategoryFormRef,
} from './update-category-form'

const categoryKind = {
  expense: {
    label: 'Expense',
    backgroundColor: 'bg-destructive',
    textColor: 'text-destructive-foreground',
  },
  income: {
    label: 'Income',
    backgroundColor: 'bg-green-500',
    textColor: 'text-white',
  },
  investment: {
    label: 'Investment',
    backgroundColor: 'bg-blue-500',
    textColor: 'text-white',
  },
}

export function CategoryList() {
  const queryClient = useQueryClient()

  const { isLoading, data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
  })

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

  if (isLoading) {
    return <CategoryListSkeleton />
  }

  return (
    <div className="overflow-hidden mt-4 rounded border border-border bg-card/50">
      <Table>
        <TableHeader className="bg-card/80">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="min-w-28 text-muted-foreground">
              Color
            </TableHead>
            <TableHead className="text-muted-foreground">Name</TableHead>
            <TableHead className="text-muted-foreground">Kind</TableHead>
            <TableHead className="w-24 text-right text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.id}
              className="border-border hover:bg-transparent"
            >
              <TableCell className="py-3">
                <Badge variant="secondary">
                  {category.color && (
                    <div
                      className="size-2 rounded-full inline-block mr-1 ring-1 ring-zinc-50/30"
                      style={{
                        backgroundColor: category.color,
                      }}
                    />
                  )}

                  {category.color ?? 'No color'}
                </Badge>
              </TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    categoryKind[category.kind as keyof typeof categoryKind]
                      .textColor,
                    categoryKind[category.kind as keyof typeof categoryKind]
                      .backgroundColor,
                  )}
                >
                  {
                    categoryKind[category.kind as keyof typeof categoryKind]
                      .label
                  }
                </Badge>
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
                        updateCategoryFormRef.current?.open(category)
                      }
                    >
                      <PencilIcon className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={async () => {
                        await deleteCategoryMutation({
                          categoryId: category.id,
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
          ))}

          {categories.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center h-40 text-muted-foreground"
              >
                No categories found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <UpdateCategoryForm ref={updateCategoryFormRef} />
    </div>
  )
}
