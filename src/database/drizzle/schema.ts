import { relations } from 'drizzle-orm'
import {
  boolean,
  decimal,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

// Better Auth tables (plural names)
export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  image: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const sessions = pgTable('sessions', {
  id: uuid().primaryKey().defaultRandom(),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = pgTable('accounts', {
  id: uuid().primaryKey().defaultRandom(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const verifications = pgTable('verifications', {
  id: uuid().primaryKey().defaultRandom(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Finance enums
export const financeCategoryKindEnum = pgEnum('finance_category_kind', [
  'expense',
  'income',
  'investment',
])
export const financeInvestmentTransactionTypeEnum = pgEnum(
  'finance_investment_transaction_type',
  ['deposit', 'withdraw'],
)
export const financeTransactionTypeEnum = pgEnum('finance_transaction_type', [
  'income',
  'expense',
  'savings',
])

// Finance tables (user-scoped, multi-tenant)
export const financeCategories = pgTable(
  'finance_categories',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color'),
    icon: text('icon'),
    kind: financeCategoryKindEnum('kind').default('expense').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    uniqueIndex('finance_categories_user_id_name_idx').on(t.userId, t.name),
  ],
)

export const financeExpenses = pgTable(
  'finance_expenses',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').references(() => financeCategories.id, {
      onDelete: 'set null',
    }),
    amount: decimal('amount', { precision: 14, scale: 2 }).notNull(),
    description: text('description'),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
    merchant: text('merchant'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index('finance_expenses_user_occurred_idx').on(t.userId, t.occurredAt),
    index('finance_expenses_user_category_idx').on(t.userId, t.categoryId),
  ],
)

export const financeInvestmentBuckets = pgTable(
  'finance_investment_buckets',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    institution: text('institution'),
    goalAmount: decimal('goal_amount', { precision: 14, scale: 2 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    uniqueIndex('finance_investment_buckets_user_id_name_idx').on(
      t.userId,
      t.name,
    ),
  ],
)

export const financeInvestmentTransactions = pgTable(
  'finance_investment_transactions',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    bucketId: uuid('bucket_id')
      .notNull()
      .references(() => financeInvestmentBuckets.id, { onDelete: 'cascade' }),
    type: financeInvestmentTransactionTypeEnum('type').notNull(),
    amount: decimal('amount', { precision: 14, scale: 2 }).notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  // Table reference required by Drizzle for index definition; no indexes on this table
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- (_t) => []
  (_t) => [],
)

export const financeTransactions = pgTable(
  'finance_transactions',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: financeTransactionTypeEnum('type').notNull(),
    categoryId: uuid('category_id').references(() => financeCategories.id, {
      onDelete: 'set null',
    }),
    bucketId: uuid('bucket_id').references(() => financeInvestmentBuckets.id, {
      onDelete: 'set null',
    }),
    amount: decimal('amount', { precision: 14, scale: 2 }).notNull(),
    description: text('description'),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
    merchant: text('merchant'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index('finance_transactions_user_occurred_idx').on(t.userId, t.occurredAt),
    index('finance_transactions_user_category_idx').on(t.userId, t.categoryId),
    index('finance_transactions_user_bucket_idx').on(t.userId, t.bucketId),
  ],
)

// Relations
export const financeCategoriesRelations = relations(
  financeCategories,
  ({ one, many }) => ({
    user: one(users),
    expenses: many(financeExpenses),
    accountTransactions: many(financeTransactions),
  }),
)
export const financeExpensesRelations = relations(
  financeExpenses,
  ({ one }) => ({
    user: one(users),
    category: one(financeCategories),
  }),
)
export const financeInvestmentBucketsRelations = relations(
  financeInvestmentBuckets,
  ({ one, many }) => ({
    user: one(users),
    transactions: many(financeInvestmentTransactions),
    accountTransactions: many(financeTransactions),
  }),
)
export const financeInvestmentTransactionsRelations = relations(
  financeInvestmentTransactions,
  ({ one }) => ({
    user: one(users),
    bucket: one(financeInvestmentBuckets),
  }),
)
export const financeTransactionsRelations = relations(
  financeTransactions,
  ({ one }) => ({
    user: one(users),
    category: one(financeCategories),
    bucket: one(financeInvestmentBuckets),
  }),
)
