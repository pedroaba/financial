import { desc, eq } from 'drizzle-orm'

import { db } from '@/database/drizzle'
import { financeInvestmentBuckets } from '@/database/drizzle/schema'
import { BucketMapper } from '@/mappers/bucket'
import type { Bucket } from '@/shared/schemas/bucket'

export class BucketRepository {
  async listByUserId(userId: string): Promise<Bucket[]> {
    const rows = await db
      .select()
      .from(financeInvestmentBuckets)
      .where(eq(financeInvestmentBuckets.userId, userId))
      .orderBy(desc(financeInvestmentBuckets.createdAt))

    return rows.map(BucketMapper.toResponse)
  }
}
