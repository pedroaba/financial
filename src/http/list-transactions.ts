import type z from 'zod'

import { api } from '@/lib/api'
import { TransactionListResponseSchema } from '@/shared/schemas/transaction'

type TransactionListResponse = z.infer<typeof TransactionListResponseSchema>

export async function listTransactions() {
  const response = await api.get('transactions').json<TransactionListResponse>()

  return response
}
