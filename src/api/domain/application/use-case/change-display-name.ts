import { type Either, left, right } from '@/api/core/either'
import type { NotAllowedError } from '@/api/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/resource-not-found-error'

import type { UserRepository } from '../repositories/user-repository'

type ChangeDisplayNameRequest = {
  userId: string
  displayName: string
}

type ChangeDisplayNameResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>

export class ChangeDisplayNameUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    userId,
    displayName,
  }: ChangeDisplayNameRequest): Promise<ChangeDisplayNameResponse> {
    const userOnDatabase = await this.userRepository.findById(userId)
    if (!userOnDatabase) {
      return left(new ResourceNotFoundError())
    }

    userOnDatabase.displayName = displayName
    await this.userRepository.update(userOnDatabase)

    return right(null)
  }
}
