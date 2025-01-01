import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

const statusEnum = pgEnum('status', ['open', 'paid', 'void', 'uncollectible']);

export const Invoices = pgTable('invoices', {
    id: serial('id').primaryKey(),
    createTs: timestamp('timestamp1').notNull().defaultNow(),
    value: integer('value').notNull(),
    description: text('description').notNull(),
    status: statusEnum('status').default('open'),
})