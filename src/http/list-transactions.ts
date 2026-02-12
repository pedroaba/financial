import type z from 'zod'

import { api } from '@/lib/api'
import { TransactionPaginatedResponseSchema } from '@/shared/schemas/transaction'

type TransactionPaginatedResponse = z.infer<
  typeof TransactionPaginatedResponseSchema
>

export async function listTransactions(
  page: number = 1,
  pageSize: number = 10,
): Promise<TransactionPaginatedResponse> {
  const response = await api
    .get('transactions', {
      searchParams: { page: String(page), pageSize: String(pageSize) },
    })
    .json<TransactionPaginatedResponse>()

  return TransactionPaginatedResponseSchema.parse(response)
}
