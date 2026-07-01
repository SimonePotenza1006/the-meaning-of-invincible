import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Next.js keeps secrets in .env.local; load it (falling back to .env) so the
// drizzle-kit CLI can read DATABASE_URL the same way the app does.
config({ path: ['.env.local', '.env'] });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
