import { getSpellDetail, searchSpells } from '@/lib/spells';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const index = url.searchParams.get('index');
  if (index) {
    const spell = getSpellDetail(index);
    return spell
      ? Response.json(spell)
      : Response.json({ error: 'Incantesimo non trovato.' }, { status: 404 });
  }
  const classKey = url.searchParams.get('class') ?? undefined;
  const query = url.searchParams.get('q') ?? undefined;
  const levelRaw = url.searchParams.get('level');
  const level = levelRaw != null && levelRaw !== '' ? Number(levelRaw) : undefined;
  const maxLevelRaw = url.searchParams.get('maxLevel');
  const maxLevel = maxLevelRaw != null && maxLevelRaw !== '' ? Number(maxLevelRaw) : undefined;
  return Response.json(searchSpells({ classKey, level, maxLevel, query }));
}
