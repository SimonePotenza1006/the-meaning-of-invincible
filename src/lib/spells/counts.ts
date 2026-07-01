import { type Ability, modifier } from '@/lib/rules';
import type { CharacterSheet } from '@/lib/sheet';

// Recommended spell counts per class/level. Used as on-screen guidance
// ("3 / 4 conosciuti"), not hard-enforced — the player manages their own list.

export type SpellcasterKind = 'known' | 'prepared' | 'none';

const PREPARED_ABILITY: Record<string, Ability> = {
  cleric: 'WIS',
  druid: 'WIS',
  wizard: 'INT',
  paladin: 'CHA',
};
const KNOWN_CASTERS = new Set(['bard', 'sorcerer', 'ranger', 'warlock']);

export function spellcasterKind(classKey: string): SpellcasterKind {
  if (PREPARED_ABILITY[classKey]) return 'prepared';
  if (KNOWN_CASTERS.has(classKey)) return 'known';
  return 'none';
}

const CANTRIP_BASE: Record<string, number> = {
  bard: 2,
  cleric: 3,
  druid: 2,
  sorcerer: 4,
  warlock: 2,
  wizard: 3,
};

function cantripsKnown(classKey: string, level: number): number {
  const base = CANTRIP_BASE[classKey];
  if (base == null) return 0;
  if (level >= 10) return base + 2;
  if (level >= 4) return base + 1;
  return base;
}

// Spells known by character level (index 0 = level 1), for the "known" casters.
const KNOWN_TABLE: Record<string, number[]> = {
  bard: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
  sorcerer: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
  warlock: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
  ranger: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
};

function preparedCount(classKey: string, level: number, sheet: CharacterSheet): number {
  const ab = PREPARED_ABILITY[classKey];
  if (!ab) return 0;
  const mod = modifier(sheet.abilities[ab]);
  if (classKey === 'paladin') return Math.max(1, mod + Math.floor(level / 2));
  return Math.max(1, mod + level); // cleric, druid, wizard
}

export interface SpellPlan {
  kind: SpellcasterKind;
  cantrips: number;
  /** Label for the main list: "conosciuti" (known) vs "preparati" (prepared). */
  spellsLabel?: string;
  /** Target count of known / prepared spells. */
  spells?: number;
  /** Wizard spellbook target size (spells recorded), distinct from prepared. */
  spellbook?: number;
}

export function spellPlan(classKey: string, sheet: CharacterSheet): SpellPlan {
  const level = sheet.identity.level;
  const kind = spellcasterKind(classKey);
  if (kind === 'none') return { kind, cantrips: 0 };

  const cantrips = cantripsKnown(classKey, level);

  if (kind === 'known') {
    const table = KNOWN_TABLE[classKey];
    return {
      kind,
      cantrips,
      spellsLabel: 'Conosciuti',
      spells: table ? (table[Math.min(20, level) - 1] ?? 0) : undefined,
    };
  }

  const plan: SpellPlan = {
    kind,
    cantrips,
    spellsLabel: 'Preparati',
    spells: preparedCount(classKey, level, sheet),
  };
  if (classKey === 'wizard') plan.spellbook = 6 + 2 * (level - 1);
  return plan;
}
