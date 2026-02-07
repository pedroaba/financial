import { eq } from 'drizzle-orm'

import { db } from '@/database/drizzle'
import { users } from '@/database/drizzle/schema'

export class UserController {
  async updateDisplayName(
    userId: string,
    displayName: string,
  ): Promise<boolean> {
    const [updated] = await db
      .update(users)
      .set({ name: displayName })
      .where(eq(users.id, userId))
      .returning({ id: users.id })

    return Boolean(updated)
  }
}
