import { and, eq } from 'drizzle-orm'

import { db } from '../drizzle/index'
import {
  financeInvestmentBuckets,
  financeInvestmentTransactions,
} from '../drizzle/schema'

type BucketInsert = typeof financeInvestmentBuckets.$inferInsert
type TransactionInsert = typeof financeInvestmentTransactions.$inferInsert

export function listBucketsByUserId(userId: string) {
  return db
    .select()
    .from(financeInvestmentBuckets)
    .where(eq(financeInvestmentBuckets.userId, userId))
    .orderBy(financeInvestmentBuckets.name)
}

export function getBucketByIdAndUserId(id: string, userId: string) {
  return db
    .select()
    .from(financeInvestmentBuckets)
    .where(
      and(
        eq(financeInvestmentBuckets.id, id),
        eq(financeInvestmentBuckets.userId, userId),
      ),
    )
    .limit(1)
    .then((rows) => rows[0])
}

export function createBucket(
  userId: string,
  data: Omit<BucketInsert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
) {
  return db
    .insert(financeInvestmentBuckets)
    .values({
      userId,
      name: data.name,
      institution: data.institution ?? null,
      goalAmount: data.goalAmount ?? null,
    })
    .returning()
    .then((rows) => rows[0])
}

export function updateBucket(
  id: string,
  userId: string,
  data: Partial<
    Pick<
      typeof financeInvestmentBuckets.$inferSelect,
      'name' | 'institution' | 'goalAmount'
    >
  >,
) {
  return db
    .update(financeInvestmentBuckets)
    .set(data)
    .where(
      and(
        eq(financeInvestmentBuckets.id, id),
        eq(financeInvestmentBuckets.userId, userId),
      ),
    )
    .returning()
    .then((rows) => rows[0])
}

export function deleteBucket(id: string, userId: string) {
  return db
    .delete(financeInvestmentBuckets)
    .where(
      and(
        eq(financeInvestmentBuckets.id, id),
        eq(financeInvestmentBuckets.userId, userId),
      ),
    )
    .returning()
    .then((rows) => rows[0])
}

export function listTransactionsByBucketIdAndUserId(
  bucketId: string,
  userId: string,
) {
  return db
    .select()
    .from(financeInvestmentTransactions)
    .where(
      and(
        eq(financeInvestmentTransactions.bucketId, bucketId),
        eq(financeInvestmentTransactions.userId, userId),
      ),
    )
    .orderBy(financeInvestmentTransactions.occurredAt)
}

export async function getBucketBalance(bucketId: string, userId: string) {
  const rows = await db
    .select({
      type: financeInvestmentTransactions.type,
      amount: financeInvestmentTransactions.amount,
    })
    .from(financeInvestmentTransactions)
    .where(
      and(
        eq(financeInvestmentTransactions.bucketId, bucketId),
        eq(financeInvestmentTransactions.userId, userId),
      ),
    )
  let balance = 0
  for (const row of rows) {
    const amount = Number(row.amount)
    balance += row.type === 'deposit' ? amount : -amount
  }
  return String(balance)
}

export function createTransaction(
  userId: string,
  bucketId: string,
  data: Omit<
    TransactionInsert,
    'id' | 'userId' | 'bucketId' | 'createdAt' | 'updatedAt'
  >,
) {
  return db
    .insert(financeInvestmentTransactions)
    .values({
      userId,
      bucketId,
      type: data.type,
      amount: data.amount,
      occurredAt: data.occurredAt,
      notes: data.notes ?? null,
    })
    .returning()
    .then((rows) => rows[0])
}

export function deleteTransaction(id: string, userId: string) {
  return db
    .delete(financeInvestmentTransactions)
    .where(
      and(
        eq(financeInvestmentTransactions.id, id),
        eq(financeInvestmentTransactions.userId, userId),
      ),
    )
    .returning()
    .then((rows) => rows[0])
}
