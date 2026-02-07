import { UserRepository } from '@/repositories/user'

export class UserController {
  async updateDisplayName(userId: string, displayName: string) {
    const repository = new UserRepository()
    await repository.updateDisplayName({ userId, displayName })
  }
}
