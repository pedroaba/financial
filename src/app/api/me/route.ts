import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { auth } from '@/lib/better-auth/auth'

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

  return NextResponse.json({ user: session.user })
}
