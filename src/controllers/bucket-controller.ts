import type { BucketRepository } from '@/repositories/bucket'
import type { Bucket } from '@/shared/schemas/bucket'

export class BucketController {
  constructor(private readonly repository: BucketRepository) {}

  async list(userId: string): Promise<Bucket[]> {
    return this.repository.listByUserId(userId)
  }
}
