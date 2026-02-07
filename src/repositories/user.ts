import { eq } from 'drizzle-orm'

import { db } from '@/database/drizzle'
import { users } from '@/database/drizzle/schema'

interface UpdateDisplayNameParams {
  userId: string
  displayName: string
}

export class UserRepository {
  async updateDisplayName(params: UpdateDisplayNameParams) {
    const { userId, displayName } = params

    await db
      .update(users)
      .set({ name: displayName })
      .where(eq(users.id, userId))
  }
}
