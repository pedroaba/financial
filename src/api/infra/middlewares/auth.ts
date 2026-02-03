import { createMiddleware } from 'hono/factory'

import type { AuthSession } from '../auth'

export const requireAuth = createMiddleware<{
  Variables: {
    user: AuthSession['user'] | null
    session: AuthSession['session'] | null
  }
}>(async (c, next) => {
  const user = c.get('user')
  const session = c.get('session')

  if (!user || !session) {
    return c.json(
      {
        error: 'Unauthorized',
        message: 'Authentication required',
      },
      401,
    )
  }

  await next()
})
