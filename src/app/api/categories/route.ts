import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { CategoryController } from '@/controllers/category-controller'
import { auth } from '@/lib/better-auth/auth'
import { CategoryRepository } from '@/repositories/category'
import { CreateCategoryParamsSchema } from '@/shared/schemas/category'

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
    const repository = new CategoryRepository()
    const controller = new CategoryController(repository)
    const list = await controller.list(session.user.id)

    return NextResponse.json(list, { status: 200 })
  } catch {
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

  const body = await request.json()
  const result = CreateCategoryParamsSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid request body' },
      { status: 400 },
    )
  }

  const categoryToCreate = result.data

  try {
    const repository = new CategoryRepository()
    const controller = new CategoryController(repository)
    await controller.create(session.user.id, {
      name: categoryToCreate.name,
      kind: categoryToCreate.kind,
      color: categoryToCreate.color,
      icon: categoryToCreate.icon,
    })

    return NextResponse.json(null, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to create category' },
      { status: 500 },
    )
  }
}
