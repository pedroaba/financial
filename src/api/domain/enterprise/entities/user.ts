import { Entity } from '@/api/core/entities/entity'
import type { UniqueEntityID } from '@/api/core/entities/unique-entity-id'
import type { Optional } from '@/api/core/types/optional'

type UserProps = {
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
}

type UserOptionalProps = 'emailVerified' | 'image' | 'createdAt' | 'updatedAt'

export class User extends Entity<UserProps> {
  get displayName(): string {
    return this.props.name
  }

  set displayName(value: string) {
    this.props.name = value
  }

  get email(): string {
    return this.props.email
  }

  set email(value: string) {
    this.props.email = value
  }

  get emailVerified(): boolean {
    return this.props.emailVerified
  }

  set emailVerified(value: boolean) {
    this.props.emailVerified = value
  }

  get image(): string | null {
    return this.props.image
  }

  set image(value: string | null) {
    this.props.image = value
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(value: Date) {
    this.props.updatedAt = value
  }

  static create(
    props: Optional<UserProps, UserOptionalProps>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        emailVerified: props.emailVerified ?? false,
        image: props.image ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )

    return user
  }
}
