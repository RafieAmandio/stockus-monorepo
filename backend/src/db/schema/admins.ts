import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.js'

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
})
