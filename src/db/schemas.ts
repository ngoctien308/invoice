import { AVAILABLE_STATUSES } from "@/data/invoices";
import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type Status = typeof AVAILABLE_STATUSES[number]['id'];

const statuses = AVAILABLE_STATUSES.map(el => el.id) as Array<Status>
const statusEnum = pgEnum('status', statuses as [Status, ...Array<Status>]);

export const Invoices = pgTable('invoices', {
    id: serial('id').primaryKey(),
    createTs: timestamp('timestamp1').notNull().defaultNow(),
    value: integer('value').notNull(),
    description: text('description').notNull(),
    status: statusEnum('status').default('open'),
    userId: text('userId').notNull()
})