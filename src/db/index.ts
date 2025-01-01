import { Invoices } from '@/db/schemas';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const db = drizzle(new Pool({ connectionString: process.env.XATA_DATABASE_URL, max:20 }), {
    schema: { Invoices }
})
