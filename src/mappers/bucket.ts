import { financeInvestmentBuckets } from '@/database/drizzle/schema'
import type { Bucket } from '@/shared/schemas/bucket'

type RawBucket = typeof financeInvestmentBuckets.$inferSelect

export class BucketMapper {
  static toResponse(row: RawBucket): Bucket {
    return {
      id: row.id,
      name: row.name,
    }
  }
}
