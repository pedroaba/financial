import type { User } from '../../enterprise/entities/user'

export abstract class UserRepository {
  abstract update(user: User): Promise<void>
  abstract findById(userId: string): Promise<User | null>
}
