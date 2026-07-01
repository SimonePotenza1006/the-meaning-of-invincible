// Smoke-test endpoint: GET /api/health
// Reports whether the Neon connection string is wired up, without opening a
// connection — safe to call before the database has been provisioned.
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    status: 'ok',
    database: process.env.DATABASE_URL ? 'configured' : 'not-configured',
  });
}
