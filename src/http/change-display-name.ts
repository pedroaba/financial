import type z from 'zod'

import { env } from '@/env'
import {
  ChangeDisplayNameParamsSchema,
  ChangeDisplayNameResponseSchema,
} from '@/shared/schemas/change-display-name'

type ChangeDisplayNameParams = z.infer<typeof ChangeDisplayNameParamsSchema>

export async function changeDisplayName(params: ChangeDisplayNameParams) {
  const url = new URL(
    '/api/account/general/change-display-name',
    env.NEXT_PUBLIC_API_URL,
  )

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
    credentials: 'include',
  })

  const result = await response.json()
  return ChangeDisplayNameResponseSchema.parse(result)
}
