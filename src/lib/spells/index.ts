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
    it: !!SPELL_IT[s.index],
  };
}

export function searchSpells(opts: {
  classKey?: string;
  level?: number;
  query?: string;
}): SpellListItem[] {
  let list = SPELLS;
  if (opts.classKey) list = list.filter((s) => s.classes.includes(opts.classKey!));
  if (opts.level != null) list = list.filter((s) => s.level === opts.level);
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
