import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { CategoryController } from '@/controllers/category-controller'
import { auth } from '@/lib/better-auth/auth'
import { CategoryRepository } from '@/repositories/category'
import {
  CategoryIdParamsSchema,
  UpdateCategoryParamsSchema,
} from '@/shared/schemas/category'

export async function PUT(
  request: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  const params = await paramsPromise
  const result = CategoryIdParamsSchema.safeParse(params)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid category id' },
      { status: 400 },
    )
  }

  const categoryId = result.data.id
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
  const bodyResult = UpdateCategoryParamsSchema.safeParse(body)
  if (!bodyResult.success) {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid request body' },
      { status: 400 },
    )
  }

  const categoryToUpdate = bodyResult.data

  try {
    const repository = new CategoryRepository()
    const controller = new CategoryController(repository)
    await controller.update(session.user.id, categoryId, categoryToUpdate)

    return NextResponse.json(null, { status: 200 })
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to update category',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  const params = await paramsPromise
  const result = CategoryIdParamsSchema.safeParse(params)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid category id' },
      { status: 400 },
    )
  }

  const categoryId = result.data.id
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
    await controller.delete(session.user.id, categoryId)

    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to delete category',
      },
      { status: 500 },
    )
  }
}
