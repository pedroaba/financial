import z from 'zod'

export const TransactionTypeSchema = z.enum(['income', 'expense', 'savings'])
export type TransactionType = z.infer<typeof TransactionTypeSchema>

const CategoryRefSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

const BucketRefSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: TransactionTypeSchema,
  categoryId: z.string().uuid().nullable(),
  bucketId: z.string().uuid().nullable(),
  amount: z.string(),
  description: z.string().nullable(),
  occurredAt: z.string(),
  merchant: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Transaction = z.infer<typeof TransactionSchema>

export const TransactionWithCategoryAndBucketSchema = TransactionSchema.extend({
  category: CategoryRefSchema.nullable(),
  bucket: BucketRefSchema.nullable(),
})

export type TransactionWithCategoryAndBucket = z.infer<
  typeof TransactionWithCategoryAndBucketSchema
>

const positiveAmountSchema = z.union([
  z.string().refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, {
    message: 'Amount must be a positive number',
  }),
  z.number().positive('Amount must be positive'),
])

export const CreateTransactionParamsSchema = z.object({
  type: TransactionTypeSchema,
  amount: positiveAmountSchema,
  occurredAt: z.string().min(1, 'Occurred at is required'),
  description: z.string().max(500).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  bucketId: z.string().uuid().optional().nullable(),
  merchant: z.string().max(200).optional().nullable(),
})

export type CreateTransactionParams = z.infer<
  typeof CreateTransactionParamsSchema
>

export const UpdateTransactionParamsSchema = z.object({
  type: TransactionTypeSchema.optional(),
  amount: positiveAmountSchema.optional(),
  occurredAt: z.string().min(1).optional(),
  description: z.string().max(500).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  bucketId: z.string().uuid().optional().nullable(),
  merchant: z.string().max(200).optional().nullable(),
})

export type UpdateTransactionParams = z.infer<
  typeof UpdateTransactionParamsSchema
>

export const TransactionIdParamsSchema = z.object({
  id: z.string().uuid(),
})

export const TransactionListResponseSchema = z.array(
  TransactionWithCategoryAndBucketSchema,
)

export const TransactionPaginatedResponseSchema = z.object({
  items: z.array(TransactionWithCategoryAndBucketSchema),
  totalCount: z.number(),
  page: z.number(),
  pageSize: z.number(),
})
export type TransactionPaginatedResponse = z.infer<
  typeof TransactionPaginatedResponseSchema
>
