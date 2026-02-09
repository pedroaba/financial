import type { TransactionRepository } from '@/repositories/transaction'
import type {
  CreateTransactionParams,
  TransactionWithCategoryAndBucket,
  UpdateTransactionParams,
} from '@/shared/schemas/transaction'

export class TransactionController {
  constructor(private readonly repository: TransactionRepository) {}

  async list(userId: string): Promise<TransactionWithCategoryAndBucket[]> {
    return this.repository.listByUserId(userId)
  }

  async create(userId: string, params: CreateTransactionParams) {
    await this.repository.create(userId, params)
  }

  async update(
    userId: string,
    transactionId: string,
    params: UpdateTransactionParams,
  ) {
    await this.repository.update(userId, transactionId, params)
  }

  async delete(userId: string, transactionId: string) {
    await this.repository.delete(userId, transactionId)
  }
}
