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

  let body: { display_name: string }
  try {
    const raw = await request.json()
    body = ChangeDisplayNameParamsSchema.parse(raw)
  } catch {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid request body' },
      { status: 400 },
    )
  }

  const controller = new UserController()
  const updated = await controller.updateDisplayName(
    session.user.id,
    body.display_name,
  )

  if (!updated) {
    return NextResponse.json(
      { error: 'Not found', message: 'User not found' },
      { status: 404 },
    )
  }

  return NextResponse.json(null, { status: 200 })
}
