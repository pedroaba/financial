import z from 'zod'

export const ChangeDisplayNameParamsSchema = z.object({
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .max(32, 'Display name must be less than 32 characters'),
})

export const ChangeDisplayNameResponseSchema = z.null()
