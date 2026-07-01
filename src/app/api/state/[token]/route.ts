import { loadState } from '@/lib/game/repo';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const state = await loadState(token);
  if (!state) {
    return Response.json({ error: 'Campagna non trovata.' }, { status: 404 });
  }
  return Response.json(state);
}
