import z from 'zod'

export const BucketSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export type Bucket = z.infer<typeof BucketSchema>

export const BucketListResponseSchema = z.array(BucketSchema)
