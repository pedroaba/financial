import { and, desc, eq } from 'drizzle-orm'

import { db } from '@/database/drizzle'
import {
  financeCategories,
  financeInvestmentBuckets,
  financeTransactions,
} from '@/database/drizzle/schema'
import { TransactionMapper, type TransactionListRow } from '@/mappers/transaction'
import type {
  CreateTransactionParams,
  TransactionWithCategoryAndBucket,
  UpdateTransactionParams,
} from '@/shared/schemas/transaction'

export class TransactionRepository {
  async listByUserId(
    userId: string,
  ): Promise<TransactionWithCategoryAndBucket[]> {
    const rows = await db
      .select({
        id: financeTransactions.id,
        userId: financeTransactions.userId,
        type: financeTransactions.type,
        categoryId: financeTransactions.categoryId,
        bucketId: financeTransactions.bucketId,
        amount: financeTransactions.amount,
        description: financeTransactions.description,
        occurredAt: financeTransactions.occurredAt,
        merchant: financeTransactions.merchant,
        createdAt: financeTransactions.createdAt,
        updatedAt: financeTransactions.updatedAt,
        categoryIdJoin: financeCategories.id,
        categoryName: financeCategories.name,
        bucketIdJoin: financeInvestmentBuckets.id,
        bucketName: financeInvestmentBuckets.name,
      })
      .from(financeTransactions)
      .leftJoin(
        financeCategories,
        eq(financeTransactions.categoryId, financeCategories.id),
      )
      .leftJoin(
        financeInvestmentBuckets,
        eq(financeTransactions.bucketId, financeInvestmentBuckets.id),
      )
      .where(eq(financeTransactions.userId, userId))
      .orderBy(desc(financeTransactions.occurredAt))

    const mapped: TransactionListRow[] = rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      type: r.type,
      categoryId: r.categoryId,
      bucketId: r.bucketId,
      amount: String(r.amount),
      description: r.description,
      occurredAt: r.occurredAt,
      merchant: r.merchant,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      categoryIdJoin: r.categoryIdJoin,
      categoryName: r.categoryName,
      bucketIdJoin: r.bucketIdJoin,
      bucketName: r.bucketName,
    }))

    return mapped.map(TransactionMapper.toResponse)
  }

  async create(userId: string, params: CreateTransactionParams) {
    const amount =
      typeof params.amount === 'string' ? params.amount : String(params.amount)
    await db.insert(financeTransactions).values({
      userId,
      type: params.type,
      categoryId: params.categoryId ?? null,
      bucketId: params.bucketId ?? null,
      amount,
      description: params.description ?? null,
      occurredAt: new Date(params.occurredAt),
      merchant: params.merchant ?? null,
    })
  }

  async update(
    userId: string,
    transactionId: string,
    params: UpdateTransactionParams,
  ) {
    const set: Record<string, unknown> = {}
    if (params.type !== undefined) set.type = params.type
    if (params.amount !== undefined)
      set.amount =
        typeof params.amount === 'string' ? params.amount : String(params.amount)
    if (params.occurredAt !== undefined)
      set.occurredAt = new Date(params.occurredAt)
    if (params.description !== undefined) set.description = params.description
    if (params.categoryId !== undefined) set.categoryId = params.categoryId
    if (params.bucketId !== undefined) set.bucketId = params.bucketId
    if (params.merchant !== undefined) set.merchant = params.merchant

    if (Object.keys(set).length === 0) return

    await db
      .update(financeTransactions)
      .set(set as Record<string, string | number | Date | null>)
      .where(
        and(
          eq(financeTransactions.id, transactionId),
          eq(financeTransactions.userId, userId),
        ),
      )
  }

  async delete(userId: string, transactionId: string) {
    await db
      .delete(financeTransactions)
      .where(
        and(
          eq(financeTransactions.id, transactionId),
          eq(financeTransactions.userId, userId),
        ),
      )
  }
}
