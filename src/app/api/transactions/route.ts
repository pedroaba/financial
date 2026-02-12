import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { TransactionController } from '@/controllers/transaction-controller'
import { auth } from '@/lib/better-auth/auth'
import { TransactionRepository } from '@/repositories/transaction'
import { CreateTransactionParamsSchema } from '@/shared/schemas/transaction'

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50

function parsePaginationParams(request: Request): {
  page: number
  pageSize: number
} {
  const url = new URL(request.url)
  const pageParam = url.searchParams.get('page')
  const pageSizeParam = url.searchParams.get('pageSize')
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(pageSizeParam ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE),
  )
  return { page, pageSize }
}

export async function GET(request: Request) {
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
    const { page, pageSize } = parsePaginationParams(request)
    const repository = new TransactionRepository()
    const controller = new TransactionController(repository)
    const result = await controller.listPaginated(
      session.user.id,
      page,
      pageSize,
    )

    return NextResponse.json(result, { status: 200 })
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
