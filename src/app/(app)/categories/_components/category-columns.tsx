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
import { CATEGORY_KIND_BADGES } from '@/constants/badges'
import { cn } from '@/lib/utils'
import type { Category } from '@/shared/schemas/category'

type DeleteCategoryMutation = (variables: {
  categoryId: string
}) => Promise<unknown>

export function getCategoryColumns(
  onEditCategory: (category: Category) => void,
  deleteCategoryMutation: DeleteCategoryMutation,
): ColumnDef<Category>[] {
  return [
    {
      accessorKey: 'color',
      header: () => (
        <span className="min-w-28 text-muted-foreground">Color</span>
      ),
      cell: ({ row }) => {
        const category = row.original
        return (
          <Badge variant="secondary">
            {category.color && (
              <div
                className="mr-1 inline-block size-2 rounded-full ring-1 ring-zinc-50/30"
                style={{ backgroundColor: category.color }}
              />
            )}
            {category.color ?? 'No color'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'name',
      header: () => <span className="text-muted-foreground">Name</span>,
      cell: ({ row }) => row.getValue('name') as string,
    },
    {
      accessorKey: 'kind',
      header: () => <span className="text-muted-foreground">Kind</span>,
      cell: ({ row }) => {
        const kind = row.getValue('kind') as keyof typeof CATEGORY_KIND_BADGES
        const config =
          CATEGORY_KIND_BADGES[kind] ?? CATEGORY_KIND_BADGES.expense
        return (
          <Badge className={cn(config.textColor, config.backgroundColor)}>
            {config.label}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: () => (
        <div className="text-muted-foreground text-right w-full">Actions</div>
      ),
      cell: ({ row }) => {
        const category = row.original
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm">
                  <EllipsisIcon className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditCategory(category)}>
                  <PencilIcon className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => {
                    await deleteCategoryMutation({ categoryId: category.id })
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
