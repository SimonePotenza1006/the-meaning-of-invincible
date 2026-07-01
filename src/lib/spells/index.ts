import 'server-only';
import spellsData from '@/data/spells.json';
import {
  SPELL_IT,
  localizeCastingTime,
  localizeDuration,
  localizeRange,
  localizeSchool,
} from './it';

export interface RawSpell {
  index: string;
  name: string;
  level: number;
  school: string;
  classes: string[];
  casting_time: string;
  range: string;
  components: string[];
  material: string;
  duration: string;
  concentration: boolean;
  ritual: boolean;
  description: string;
  higher_level: string;
}

const SPELLS = spellsData as RawSpell[];

export interface SpellListItem {
  index: string;
  name: string;
  level: number;
  school: string;
  classes: string[];
  concentration: boolean;
  ritual: boolean;
  /** Casting-time category, for the action-economy glyph. */
  action: SpellActionCost;
  /** true when a fresh Italian name exists (else falls back to English). */
  it: boolean;
}

export interface SpellDetail extends SpellListItem {
  castingTime: string;
  range: string;
  components: string[];
  material: string;
  duration: string;
  summary: string;
}

export type SpellActionCost = 'action' | 'bonus' | 'reaction' | 'other';

/** Categorise a raw English casting time into an action-economy bucket. */
function categorizeCasting(raw?: string): SpellActionCost {
  const t = (raw ?? '').toLowerCase();
  if (t.includes('bonus action')) return 'bonus';
  if (t.includes('reaction')) return 'reaction';
  if (t.includes('action')) return 'action';
  return 'other';
}

/** Action-economy cost of casting a spell, by index (for the action glyph). */
export function spellActionCost(index: string): SpellActionCost {
  return categorizeCasting(SPELLS.find((s) => s.index === index)?.casting_time);
}

function itName(s: RawSpell): string {
  return SPELL_IT[s.index]?.name ?? s.name;
}

function toItem(s: RawSpell): SpellListItem {
  return {
    index: s.index,
    name: itName(s),
    level: s.level,
    school: localizeSchool(s.school),
    classes: s.classes,
    concentration: s.concentration,
    ritual: s.ritual,
    action: categorizeCasting(s.casting_time),
    it: !!SPELL_IT[s.index],
  };
}

export function searchSpells(opts: {
  classKey?: string;
  level?: number;
  /** Cap: hide spells above this level (a caster can't learn what it can't cast). */
  maxLevel?: number;
  query?: string;
}): SpellListItem[] {
  let list = SPELLS;
  if (opts.classKey) list = list.filter((s) => s.classes.includes(opts.classKey!));
  if (opts.level != null) list = list.filter((s) => s.level === opts.level);
  if (opts.maxLevel != null) list = list.filter((s) => s.level <= opts.maxLevel!);
  if (opts.query) {
    const q = opts.query.toLowerCase();
    list = list.filter((s) => itName(s).toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }
  return list
    .map(toItem)
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, 'it'));
}

export function getSpellDetail(index: string): SpellDetail | null {
  const s = SPELLS.find((x) => x.index === index);
  if (!s) return null;
  const it = SPELL_IT[s.index];
  return {
    ...toItem(s),
    castingTime: localizeCastingTime(s.casting_time),
    range: localizeRange(s.range),
    components: s.components,
    material: s.material,
    duration: localizeDuration(s.duration),
    summary: it?.summary ?? s.description,
  };
}
