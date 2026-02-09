import { api } from '@/lib/api'

interface DeleteTransactionParams {
  transactionId: string
}

export async function deleteTransaction(params: DeleteTransactionParams) {
  await api.delete(`transactions/${params.transactionId}`)
}
