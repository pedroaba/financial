import { api } from '@/lib/api'
import {
  CreateTransactionParams,
  CreateTransactionParamsSchema,
} from '@/shared/schemas/transaction'

export async function createTransaction(params: CreateTransactionParams) {
  const parsedParams = CreateTransactionParamsSchema.parse(params)
  const response = await api.post('transactions', {
    json: {
      type: parsedParams.type,
      amount: parsedParams.amount,
      occurredAt: parsedParams.occurredAt,
      description: parsedParams.description,
      categoryId: parsedParams.categoryId,
      bucketId: parsedParams.bucketId,
      merchant: parsedParams.merchant,
    },
  })

  return response.json()
}
