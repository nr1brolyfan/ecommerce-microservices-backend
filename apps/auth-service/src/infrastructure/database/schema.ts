import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core'

// Enum for user roles
export const roleEnum = pgEnum('role', ['user', 'admin'])

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: roleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// TypeScript types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
