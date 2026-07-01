import { BACKGROUNDS } from './backgrounds';
import { CLASSES } from './classes';
import { CLASS_FEATURES } from './class-progression';
import { RACES } from './races';
import { SUBCLASSES } from './subclasses';

// A flat, de-duplicated catalog of every feature already defined in the game —
// race/subrace traits, class features (all levels), subclass features and
// background features. Used to let the DM attach an existing feature to a
// custom magic item.

export interface CatalogFeature {
  source: string;
  name: string;
  description: string;
}

let cache: CatalogFeature[] | null = null;

export function featureCatalog(): CatalogFeature[] {
  if (cache) return cache;
  const out: CatalogFeature[] = [];

  for (const r of RACES) {
    r.traits.forEach((t) => out.push({ source: r.name, name: t.name, description: t.description }));
    r.subraces?.forEach((sr) =>
      sr.traits.forEach((t) => out.push({ source: sr.name, name: t.name, description: t.description })),
    );
  }
  for (const c of CLASSES) {
    c.features.forEach((t) => out.push({ source: c.name, name: t.name, description: t.description }));
  }
  for (const [key, byLevel] of Object.entries(CLASS_FEATURES)) {
    const cName = CLASSES.find((c) => c.key === key)?.name ?? key;
    for (const feats of Object.values(byLevel)) {
      feats.forEach((t) => out.push({ source: cName, name: t.name, description: t.description }));
    }
  }
  for (const list of Object.values(SUBCLASSES)) {
    for (const sc of list) {
      sc.features.forEach((f) => out.push({ source: sc.name, name: f.name, description: f.description }));
    }
  }
  for (const b of BACKGROUNDS) {
    out.push({ source: b.name, name: b.feature.name, description: b.feature.description });
  }

  const seen = new Set<string>();
  cache = out
    .filter((f) => {
      const k = `${f.source}|${f.name}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'it'));
  return cache;
}
