import { UseCaseError } from './use-case-error'

export class ConflictError extends Error implements UseCaseError {
  constructor(message = 'Resource already exists') {
    super(message)
    this.name = 'ConflictError'
  }
}
