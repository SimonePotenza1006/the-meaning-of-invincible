import { getMonster, searchMonsters } from '@/lib/monsters';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const index = url.searchParams.get('index');
  if (index) {
    const monster = getMonster(index);
    return monster
      ? Response.json(monster)
      : Response.json({ error: 'Mostro non trovato.' }, { status: 404 });
  }
  const query = url.searchParams.get('q') ?? undefined;
  const type = url.searchParams.get('type') ?? undefined;
  const crMaxRaw = url.searchParams.get('crMax');
  const crMax = crMaxRaw != null ? Number(crMaxRaw) : undefined;
  return Response.json(searchMonsters({ query, type, crMax }));
}
