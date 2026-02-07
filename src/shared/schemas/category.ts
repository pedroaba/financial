import z from 'zod'

export const CategoryKindSchema = z.enum(['expense', 'income', 'investment'])
export type CategoryKind = z.infer<typeof CategoryKindSchema>

export const CategorySchema = z.object({
  id: z.uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  color: z.string().nullable(),
  icon: z.string().nullable(),
  kind: CategoryKindSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type CategoryResponse = z.infer<typeof CategorySchema>

export const CreateCategoryParamsSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  color: z.string().max(50).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  kind: CategoryKindSchema.optional().default('expense'),
})
export type CreateCategoryParams = z.infer<typeof CreateCategoryParamsSchema>

export const UpdateCategoryParamsSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  color: z.string().max(50).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  kind: CategoryKindSchema.optional(),
})
export type UpdateCategoryParams = z.infer<typeof UpdateCategoryParamsSchema>

export const CategoryListResponseSchema = z.array(CategorySchema)

export const CategoryIdParamsSchema = z.object({
  id: z.string().uuid(),
})
