import type z from 'zod'

import { api } from '@/lib/api'
import { BucketListResponseSchema } from '@/shared/schemas/bucket'

type BucketListResponse = z.infer<typeof BucketListResponseSchema>

export async function listBuckets() {
  const response = await api.get('buckets').json<BucketListResponse>()

  return response
}
