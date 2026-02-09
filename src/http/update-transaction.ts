import { api } from '@/lib/api'
import type { UpdateTransactionParams } from '@/shared/schemas/transaction'

export async function updateTransaction(
  transactionId: string,
  params: UpdateTransactionParams,
) {
  await api.put(`transactions/${transactionId}`, {
    json: params,
  })
}
