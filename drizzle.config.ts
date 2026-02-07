import { defineConfig } from 'drizzle-kit'

import { apiEnv } from './src/api-env'

export default defineConfig({
  out: './src/database/drizzle/migrations',
  schema: './src/database/drizzle/schema.ts',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: apiEnv.DATABASE_URL,
  },
})
