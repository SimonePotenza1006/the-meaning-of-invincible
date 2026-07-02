import 'server-only';
import consumablesData from '@/data/consumables.json';
import { ITEM_IT, itItemName, localizeItemCategory, localizeRarity } from './it';

export { itItemName, localizeRarity, localizeItemCategory } from './it';

// SRD 5.1 consumables (potions, scrolls, ammunition and single-use wondrous
// items), bundled so the app stays self-contained. Only names + a fresh Italian
// summary are localised; the English `description` remains as a fallback.
export interface RawConsumable {
  index: string;
  name: string;
  category: string;
  rarity?: string;
  attunement: boolean;
  description: string;
}

const CONSUMABLES = consumablesData as RawConsumable[];

export interface ConsumableItem {
  index: string;
  name: string;
  category: string;
  /** Localised category label, for grouping/badges. */
  categoryLabel: string;
  rarity: string;
  attunement: boolean;
  /** Italian summary when available, else the English statblock. */
  summary: string;
  /** true when a fresh Italian summary exists (else falls back to English). */
  it: boolean;
}

function toItem(c: RawConsumable): ConsumableItem {
  const it = ITEM_IT[c.index];
  return {
    index: c.index,
    name: itItemName(c.index, c.name),
    category: c.category,
    categoryLabel: localizeItemCategory(c.category),
    rarity: localizeRarity(c.rarity),
    attunement: c.attunement,
    summary: it?.summary ?? c.description,
    it: !!it,
  };
}

const CATEGORY_ORDER: Record<string, number> = {
  Potion: 0,
  Scroll: 1,
  Ammunition: 2,
  'Wondrous Items': 3,
};

export function searchConsumables(opts: { query?: string; category?: string }): ConsumableItem[] {
  let list = CONSUMABLES;
  if (opts.category) list = list.filter((c) => c.category === opts.category);
  if (opts.query) {
    const q = opts.query.toLowerCase();
    list = list.filter(
      (c) => itItemName(c.index, c.name).toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }
  return list
    .map(toItem)
    .sort(
      (a, b) =>
        (CATEGORY_ORDER[a.category] ?? 9) - (CATEGORY_ORDER[b.category] ?? 9) ||
        a.name.localeCompare(b.name, 'it'),
    );
}

export function getConsumable(index: string): ConsumableItem | null {
  const c = CONSUMABLES.find((x) => x.index === index);
  return c ? toItem(c) : null;
}

/** Distinct categories present, in display order, with their Italian labels. */
export function consumableCategories(): { key: string; label: string }[] {
  const keys = [...new Set(CONSUMABLES.map((c) => c.category))];
  keys.sort((a, b) => (CATEGORY_ORDER[a] ?? 9) - (CATEGORY_ORDER[b] ?? 9));
  return keys.map((key) => ({ key, label: localizeItemCategory(key) }));
}
