import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .env.local explicitly
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./config/schema.ts", // use .ts if your schema is written in TypeScript
  out: "./drizzle/migrations",  // folder for generated migrations
  dialect: "postgresql",        // using Neon/Postgres
  dbCredentials: {
    url: process.env.DATABASE_URL!, // "!" tells TypeScript this will exist
  },
  verbose: true,                 // optional: logs SQL queries
  strict: true,                  // optional: enables extra type checks
});
