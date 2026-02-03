import { createRoute, OpenAPIHono } from '@hono/zod-openapi'

import { NotAllowedError } from '@/api/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/api/core/errors/resource-not-found-error'
import { ChangeDisplayNameUseCase } from '@/api/domain/application/use-case/change-display-name'
import {
  ChangeDisplayNameParamsSchema,
  ChangeDisplayNameResponseSchema,
} from '@/shared/schemas/change-display-name'
import { ErrorSchema } from '@/shared/schemas/errors'

import type { AuthSession } from '../auth'
import { DrizzleUserRepository } from '../database/drizzle/repositories/drizzle-user'
import { requireAuth } from '../middlewares/auth'

const changeDisplayNameRoute = createRoute({
  method: 'post',
  path: '/account/general/change-display-name',
  tags: ['Account Settings'],
  summary: 'Change the display name',
  description: 'Change the display name for the current user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ChangeDisplayNameParamsSchema.openapi({
            description: 'Request body for changing the display name',
            example: {
              display_name: 'John Doe',
            },
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Display name updated successfully',
      content: {
        'application/json': {
          schema: ChangeDisplayNameResponseSchema.openapi({
            description: 'No content',
          }),
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
    404: {
      description: 'Not found',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
    },
  },
})

const app = new OpenAPIHono<{
  Variables: {
    user: AuthSession['user'] | null
    session: AuthSession['session'] | null
  }
}>()

app.use(requireAuth)

export const changeDisplayNameHandler = app.openapi(
  changeDisplayNameRoute,
  async (context) => {
    const { display_name } = context.req.valid('json')
    const user = context.get('user')

    if (!user) {
      return context.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required',
        },
        401,
      )
    }

    try {
      const changeDisplayNameUseCase = new ChangeDisplayNameUseCase(
        new DrizzleUserRepository(),
      )

      const result = await changeDisplayNameUseCase.execute({
        userId: user.id,
        displayName: display_name,
      })

      if (result.isLeft()) {
        if (result.value instanceof NotAllowedError) {
          return context.json(
            {
              error: result.value.name,
              message: result.value.message,
            },
            403,
          )
        }

        if (result.value instanceof ResourceNotFoundError) {
          return context.json(
            {
              error: result.value.name,
              message: result.value.message,
            },
            404,
          )
        }

        return context.json(
          {
            error: 'Internal server error',
            message: 'An unexpected error occurred',
          },
          400,
        )
      }

      return context.json(null, 200)
    } catch (error) {
      console.error(error)

      return context.json(
        {
          error: 'Internal server error',
          message: 'Failed to update display name',
        },
        500,
      )
    }
  },
)
