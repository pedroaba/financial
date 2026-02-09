import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { TransactionController } from '@/controllers/transaction-controller'
import { auth } from '@/lib/better-auth/auth'
import { TransactionRepository } from '@/repositories/transaction'
import { CreateTransactionParamsSchema } from '@/shared/schemas/transaction'

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
    const repository = new TransactionRepository()
    const controller = new TransactionController(repository)
    const list = await controller.list(session.user.id)

    return NextResponse.json(list, { status: 200 })
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to list transactions',
      },
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
  const result = CreateTransactionParamsSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', message: 'Invalid request body' },
      { status: 400 },
    )
  }

  const transactionToCreate = result.data

  try {
    const repository = new TransactionRepository()
    const controller = new TransactionController(repository)
    await controller.create(session.user.id, {
      type: transactionToCreate.type,
      amount: transactionToCreate.amount,
      occurredAt: transactionToCreate.occurredAt,
      description: transactionToCreate.description,
      categoryId: transactionToCreate.categoryId,
      bucketId: transactionToCreate.bucketId,
      merchant: transactionToCreate.merchant,
    })

    return NextResponse.json(null, { status: 201 })
  } catch {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to create transaction',
      },
      { status: 500 },
    )
  }
}
