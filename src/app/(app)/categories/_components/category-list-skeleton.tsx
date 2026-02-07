import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const DEFAULT_TABLE_SKELETON_ROWS = 5

interface CategoryListSkeletonProps {
  rows?: number
}

export function CategoryListSkeleton({
  rows = DEFAULT_TABLE_SKELETON_ROWS,
}: CategoryListSkeletonProps) {
  return (
    <div className="overflow-hidden mt-4 rounded border border-zinc-800 bg-zinc-900/50">
      <Table>
        <TableHeader className="bg-zinc-900/80">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="min-w-28 text-zinc-400">Color</TableHead>
            <TableHead className="text-zinc-400">Name</TableHead>
            <TableHead className="text-zinc-400">Kind</TableHead>
            <TableHead className="w-24 text-right text-zinc-400">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="border-zinc-800 hover:bg-transparent">
              <TableCell className="py-3">
                <Skeleton className="h-6 w-20 rounded-md" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded-md" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-8 w-8 shrink-0 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
