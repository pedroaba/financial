import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { apiEnv } from '@/api-env'

import * as schema from './schema'

const client = postgres(apiEnv.DATABASE_URL)

export const db = drizzle({ client, schema, casing: 'snake_case' })
