import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { CategoryController } from '@/controllers/category-controller'
import { auth } from '@/lib/better-auth/auth'
import { ConflictError } from '@/shared/errors/conflict-error'
import {
  type CreateCategoryParams,
  CreateCategoryParamsSchema,
} from '@/shared/schemas/category'

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
    const controller = new CategoryController()
    const list = await controller.list(session.user.id)
    return NextResponse.json(list, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to list categories' },
      { status: 500 },
    )
  }
}

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

  let body: CreateCategoryParams
  try {
    const raw = await request.json()
    body = CreateCategoryParamsSchema.parse(raw)
  } catch {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid request body' },
      { status: 400 },
    )
  }

  try {
    const controller = new CategoryController()
    const category = await controller.create(session.user.id, body)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof ConflictError) {
      return NextResponse.json(
        { error: error.name, message: error.message },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to create category',
      },
      { status: 500 },
    )
  }
}
