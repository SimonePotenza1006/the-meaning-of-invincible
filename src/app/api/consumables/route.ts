import { consumableCategories, getConsumable, searchConsumables } from '@/lib/items';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const index = url.searchParams.get('index');
  if (index) {
    const item = getConsumable(index);
    return item
      ? Response.json(item)
      : Response.json({ error: 'Oggetto non trovato.' }, { status: 404 });
  }
  if (url.searchParams.get('categories') != null) {
    return Response.json(consumableCategories());
  }
  const query = url.searchParams.get('q') ?? undefined;
  const category = url.searchParams.get('category') ?? undefined;
  return Response.json(searchConsumables({ query, category }));
}
