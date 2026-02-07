'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/better-auth/auth'

export type UserAccount = {
  id: string
  providerId: string
  accountId: string
  createdAt: Date
  updatedAt: Date
  scopes: string[]
}

/**
 * List linked accounts for the current user (server-side).
 * Use this when the client does not expose listUserAccounts.
 */
export async function getLinkedAccounts(): Promise<UserAccount[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return []
  }

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  })

  if (!Array.isArray(accounts)) {
    return []
  }

  return accounts as UserAccount[]
}
