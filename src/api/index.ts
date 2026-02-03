import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'

import { auth, type AuthSession } from './infra/auth'
import { changeDisplayNameHandler } from './infra/http/change-display-name'

const app = new OpenAPIHono<{
  Variables: {
    user: AuthSession['user'] | null
    session: AuthSession['session'] | null
  }
}>({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: 'Validation failed',
          message: result.error.issues.map((i) => i.message).join(', '),
        },
        400,
      )
    }
  },
}).basePath('/api')

// CORS middleware for auth routes
app.use(
  '*',
  cors({
    origin: 'http://localhost:3000',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  }),
)

// Better Auth handler
app.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

app.on(['POST', 'GET'], '/sign-up/*', (c) => {
  return auth.handler(c.req.raw)
})

// OpenAPI documentation - register BEFORE session middleware to avoid auth check
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Kanban API',
    description: 'REST API for the Kanban application',
  },
})

// Scalar API reference UI - register BEFORE session middleware
app.get(
  '/docs',
  apiReference({
    url: '/api/openapi.json',
    theme: 'purple',
    pageTitle: 'Kanban API Documentation',
  }),
)

// Session middleware for all routes (except docs and openapi.json)
app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    c.set('user', null)
    c.set('session', null)
  } else {
    c.set('user', session.user)
    c.set('session', session.session)
  }

  return next()
})

// Current user (for layout / redirect check)
app.get('/me', (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Unauthorized', message: 'Not authenticated' }, 401)
  }

  return c.json({ user })
})

// Account Settings Routes
app.route('/', changeDisplayNameHandler)

export default app
