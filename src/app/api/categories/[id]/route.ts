import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { CategoryController } from '@/controllers/category-controller'
import { auth } from '@/lib/better-auth/auth'
import {
  CategoryIdParamsSchema,
  UpdateCategoryParamsSchema,
  type UpdateCategoryParams,
} from '@/shared/schemas/category'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Not authenticated' },
      { status: 401 },
    )
  }

  const idResult = CategoryIdParamsSchema.safeParse(await params)
  const id = idResult.success ? idResult.data.id : undefined
  if (!id) {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid category id' },
      { status: 400 },
    )
  }

  let body: UpdateCategoryParams
  try {
    const raw = await request.json()
    body = UpdateCategoryParamsSchema.parse(raw)
  } catch {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid request body' },
      { status: 400 },
    )
  }

  try {
    const controller = new CategoryController()
    const category = await controller.update(session.user.id, id, body)
    if (!category) {
      return NextResponse.json(
        { error: 'Not found', message: 'Category not found' },
        { status: 404 },
      )
    }
    return NextResponse.json(category, { status: 200 })
  } catch (error) {
    console.error(error)
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
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Not authenticated' },
      { status: 401 },
    )
  }

  const idResult = CategoryIdParamsSchema.safeParse(await params)
  const id = idResult.success ? idResult.data.id : undefined
  if (!id) {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid category id' },
      { status: 400 },
    )
  }

  try {
    const controller = new CategoryController()
    const deleted = await controller.delete(session.user.id, id)
    if (!deleted) {
      return NextResponse.json(
        { error: 'Not found', message: 'Category not found' },
        { status: 404 },
      )
    }
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to delete category',
      },
      { status: 500 },
    )
  }
}
