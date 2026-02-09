import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { BucketController } from '@/controllers/bucket-controller'
import { auth } from '@/lib/better-auth/auth'
import { BucketRepository } from '@/repositories/bucket'

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Not authenticated' },
      { status: 401 },
    )
  }

  try {
    const repository = new BucketRepository()
    const controller = new BucketController(repository)
    const list = await controller.list(session.user.id)

    return NextResponse.json(list, { status: 200 })
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to list buckets',
      },
      { status: 500 },
    )
  }
}
