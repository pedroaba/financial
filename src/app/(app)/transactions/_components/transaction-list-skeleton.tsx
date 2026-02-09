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

interface TransactionListSkeletonProps {
  rows?: number
}

export function TransactionListSkeleton({
  rows = DEFAULT_TABLE_SKELETON_ROWS,
}: TransactionListSkeletonProps) {
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
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="border-border hover:bg-transparent">
              <TableCell className="py-3">
                <Skeleton className="h-6 w-16 rounded-md" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
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
