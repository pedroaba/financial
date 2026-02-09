import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { TransactionController } from '@/controllers/transaction-controller'
import { auth } from '@/lib/better-auth/auth'
import { TransactionRepository } from '@/repositories/transaction'
import {
  TransactionIdParamsSchema,
  UpdateTransactionParamsSchema,
} from '@/shared/schemas/transaction'

export async function PUT(
  request: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  const params = await paramsPromise
  const result = TransactionIdParamsSchema.safeParse(params)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid transaction id' },
      { status: 400 },
    )
  }

  const transactionId = result.data.id
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
  const bodyResult = UpdateTransactionParamsSchema.safeParse(body)
  if (!bodyResult.success) {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid request body' },
      { status: 400 },
    )
  }

  const transactionToUpdate = bodyResult.data

  try {
    const repository = new TransactionRepository()
    const controller = new TransactionController(repository)
    await controller.update(session.user.id, transactionId, transactionToUpdate)

    return NextResponse.json(null, { status: 200 })
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to update transaction',
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
  const result = TransactionIdParamsSchema.safeParse(params)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid transaction id' },
      { status: 400 },
    )
  }

  const transactionId = result.data.id
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
    const repository = new TransactionRepository()
    const controller = new TransactionController(repository)
    await controller.delete(session.user.id, transactionId)

    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to delete transaction',
      },
      { status: 500 },
    )
  }
}
