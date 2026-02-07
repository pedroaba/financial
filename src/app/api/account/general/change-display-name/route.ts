import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { UserController } from '@/controllers/user-controller'
import { auth } from '@/lib/better-auth/auth'
import { ChangeDisplayNameParamsSchema } from '@/shared/schemas/change-display-name'

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Not authenticated' },
      { status: 401 },
    )
  }

  const body = await request.json()
  const result = ChangeDisplayNameParamsSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid request body' },
      { status: 400 },
    )
  }

  const { display_name: displayName } = result.data

  const controller = new UserController()
  await controller.updateDisplayName(session.user.id, displayName)

  return NextResponse.json(null, { status: 200 })
}
