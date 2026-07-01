import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// The app's query surface. Both drivers expose the same Drizzle query builder,
// so app code is identical regardless of which one backs it.
export type DB = NeonHttpDatabase<typeof schema>;

let client: DB | null = null;

function createClient(): DB {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL non impostata. Copia .env.example in .env.local e inserisci la stringa di connessione.',
    );
  }
  // Neon (production) speaks over HTTP; any other Postgres — e.g. the local
  // Docker container used in development — connects over TCP via node-postgres.
  if (/neon\.tech/i.test(url)) {
    return drizzleNeon({ client: neon(url), schema });
  }
  const pool = new Pool({ connectionString: url });
  return drizzlePg({ client: pool, schema }) as unknown as DB;
}

// Lazily created on first use so `next build` works before a DB is configured.
function getClient(): DB {
  if (!client) client = createClient();
  return client;
}

export const db = new Proxy({} as DB, {
  get(_target, prop) {
    const instance = getClient();
    const value = instance[prop as keyof typeof instance];
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(instance)
      : value;
  },
});

export * from './schema';
