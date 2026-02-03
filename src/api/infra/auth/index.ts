import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { apiEnv } from '@/api-env'

import { db } from '../database/drizzle'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  appName: 'financial-management',
  secret: apiEnv.BETTER_AUTH_SECRET,
  baseURL: apiEnv.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: apiEnv.GITHUB_CLIENT_ID,
      clientSecret: apiEnv.GITHUB_CLIENT_SECRET,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
    cookiePrefix: 'financial-management',
    cookies: {
      session_token: {
        name: 'financial-management-session-token',
        attributes: {
          httpOnly: true,
          secure: true,
        },
      },
    },
  },
})

export type AuthSession = typeof auth.$Infer.Session
