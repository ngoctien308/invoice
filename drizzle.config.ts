import { defineConfig } from "drizzle-kit";
import dotenv from 'dotenv';
dotenv.config({
    path: './.env.local'
})

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: String(process.env.XATA_DATABASE_URL)
  }
});