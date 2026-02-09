import type { TransactionWithCategoryAndBucket } from '@/shared/schemas/transaction'

/** Flat row shape returned by repository list query with left joins */
export interface TransactionListRow {
  id: string
  userId: string
  type: 'income' | 'expense' | 'savings'
  categoryId: string | null
  bucketId: string | null
  amount: string
  description: string | null
  occurredAt: Date
  merchant: string | null
  createdAt: Date
  updatedAt: Date
  categoryIdJoin: string | null
  categoryName: string | null
  bucketIdJoin: string | null
  bucketName: string | null
}

export class TransactionMapper {
  static toResponse(row: TransactionListRow): TransactionWithCategoryAndBucket {
    return {
      id: row.id,
      userId: row.userId,
      type: row.type,
      categoryId: row.categoryId,
      bucketId: row.bucketId,
      amount: row.amount,
      description: row.description,
      occurredAt: row.occurredAt.toISOString(),
      merchant: row.merchant,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      category:
        row.categoryIdJoin && row.categoryName
          ? { id: row.categoryIdJoin, name: row.categoryName }
          : null,
      bucket:
        row.bucketIdJoin && row.bucketName
          ? { id: row.bucketIdJoin, name: row.bucketName }
          : null,
    }
  }
}
