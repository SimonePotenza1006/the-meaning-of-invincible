// Spell-slot progression and ASI levels — SRD 5.1 tables (numbers only, no prose).

import type { Ability } from './abilities';

export type CasterType = 'full' | 'half' | 'warlock' | 'none';

/** Which spellcasting model a class uses. */
export function casterType(classKey: string): CasterType {
  switch (classKey) {
    case 'bard':
    case 'cleric':
    case 'druid':
    case 'sorcerer':
    case 'wizard':
      return 'full';
    case 'paladin':
    case 'ranger':
      return 'half';
    case 'warlock':
      return 'warlock';
    default:
      return 'none';
  }
}

/** Spellcasting ability per class (covers half-casters that classes.ts omits). */
export const CASTER_ABILITY: Record<string, Ability> = {
  bard: 'CHA',
  cleric: 'WIS',
  druid: 'WIS',
  sorcerer: 'CHA',
  wizard: 'INT',
  paladin: 'CHA',
  ranger: 'WIS',
  warlock: 'CHA',
};

// Full-caster slots by character level (index 0 = level 1), columns = spell levels 1–9.
const FULL: number[][] = [
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

// Half-caster slots by character level (index 0 = level 1), columns = spell levels 1–5.
const HALF: number[][] = [
  [0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0],
  [3, 0, 0, 0, 0],
  [3, 0, 0, 0, 0],
  [4, 2, 0, 0, 0],
  [4, 2, 0, 0, 0],
  [4, 3, 0, 0, 0],
  [4, 3, 0, 0, 0],
  [4, 3, 2, 0, 0],
  [4, 3, 2, 0, 0],
  [4, 3, 3, 0, 0],
  [4, 3, 3, 0, 0],
  [4, 3, 3, 1, 0],
  [4, 3, 3, 1, 0],
  [4, 3, 3, 2, 0],
  [4, 3, 3, 2, 0],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2],
];

export interface SlotTier {
  level: number;
  total: number;
}

/** Spell slots a character of this class/level has, highest tiers first omitted. */
export function spellSlotsFor(classKey: string, level: number): SlotTier[] {
  const type = casterType(classKey);
  const lvl = Math.min(20, Math.max(1, level));
  if (type === 'none') return [];
  if (type === 'warlock') {
    const total = lvl >= 17 ? 4 : lvl >= 11 ? 3 : lvl >= 2 ? 2 : 1;
    const slotLevel = Math.min(5, Math.ceil(lvl / 2));
    return [{ level: slotLevel, total }];
  }
  const row = (type === 'full' ? FULL : HALF)[lvl - 1] ?? [];
  const out: SlotTier[] = [];
  row.forEach((total, i) => {
    if (total > 0) out.push({ level: i + 1, total });
  });
  return out;
}

/** Character levels at which this class gains an Ability Score Improvement. */
export function asiLevels(classKey: string): number[] {
  if (classKey === 'fighter') return [4, 6, 8, 12, 14, 16, 19];
  if (classKey === 'rogue') return [4, 8, 10, 12, 16, 19];
  return [4, 8, 12, 16, 19];
}
