import { eq } from 'drizzle-orm'

import { UserRepository } from '@/api/domain/application/repositories/user-repository'
import type { User } from '@/api/domain/enterprise/entities/user'

import { db } from '..'
import { UserMapper } from '../mappers/user'
import { users } from '../schema'

export class DrizzleUserRepository extends UserRepository {
  async update(user: User) {
    const persistenceUser = UserMapper.toDrizzle(user)
    await db
      .update(users)
      .set(persistenceUser)
      .where(eq(users.id, persistenceUser.id))
  }
  async findById(userId: string): Promise<User | null> {
    const userOnDatabase = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!userOnDatabase) {
      return null
    }

    return UserMapper.toDomain(userOnDatabase)
  }
}
