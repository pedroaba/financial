import { UniqueEntityID } from '@/api/core/entities/unique-entity-id'
import { User } from '@/api/domain/enterprise/entities/user'

import { users } from '../schema'

type UserDrizzle = typeof users.$inferSelect

export class UserMapper {
  static toDomain(user: UserDrizzle): User {
    return User.create(
      {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      new UniqueEntityID(user.id),
    )
  }

  static toDrizzle(user: User): UserDrizzle {
    return {
      id: user.id.toValue(),
      name: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
