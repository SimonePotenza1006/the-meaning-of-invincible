// AUTO-GENERATED from src/data/spells.json — do not edit by hand.
// Regenerate with: node scripts/gen-spell-damage.cjs
// Client-safe (no server-only data): imported directly by SpellsPanel.
import type { Ability } from '@/lib/rules';

export interface SpellDamage {
  /** Base damage dice at the spell's lowest slot, e.g. "1d10". */
  dice: string;
  /** Number of dice (base). Cantrips scale this with character level. */
  count: number;
  /** Die size, e.g. 10 for d10. */
  die: number;
  /** Localized damage type, e.g. "fuoco". */
  type: string;
  /** Set when the spell uses a spell attack roll. */
  attack?: 'ranged' | 'melee';
  /** Set when the spell forces a saving throw instead of an attack. */
  save?: Ability;
  /** True for cantrips (level 0): damage scales at levels 5/11/17. */
  cantrip: boolean;
}

/** How many times a cantrip's dice are rolled at a given character level. */
export function cantripMultiplier(charLevel: number): number {
  if (charLevel >= 17) return 4;
  if (charLevel >= 11) return 3;
  if (charLevel >= 5) return 2;
  return 1;
}

/** Damage formula to roll for a spell, applying cantrip scaling. */
export function spellDamageFormula(d: SpellDamage, charLevel: number): string {
  const n = d.cantrip ? d.count * cantripMultiplier(charLevel) : d.count;
  return `${n}d${d.die}`;
}

export const SPELL_DAMAGE: Record<string, SpellDamage> = {
  'acid-arrow': { dice: '4d4', count: 4, die: 4, type: 'acido', attack: 'ranged', cantrip: false },
  'acid-splash': { dice: '1d6', count: 1, die: 6, type: 'acido', save: 'DEX', cantrip: true },
  'arcane-hand': { dice: '4d8', count: 4, die: 8, type: 'forza', attack: 'melee', cantrip: false },
  'arcane-sword': { dice: '3d10', count: 3, die: 10, type: 'forza', attack: 'melee', cantrip: false },
  'bestow-curse': { dice: '1d8', count: 1, die: 8, type: 'necrotico', save: 'WIS', cantrip: false },
  'black-tentacles': { dice: '3d6', count: 3, die: 6, type: 'contundente', save: 'DEX', cantrip: false },
  'blade-barrier': { dice: '6d10', count: 6, die: 10, type: 'tagliente', save: 'DEX', cantrip: false },
  'blight': { dice: '8d8', count: 8, die: 8, type: 'necrotico', save: 'CON', cantrip: false },
  'branding-smite': { dice: '2d6', count: 2, die: 6, type: 'radioso', cantrip: false },
  'burning-hands': { dice: '3d6', count: 3, die: 6, type: 'fuoco', save: 'DEX', cantrip: false },
  'call-lightning': { dice: '3d10', count: 3, die: 10, type: 'fulmine', save: 'DEX', cantrip: false },
  'chain-lightning': { dice: '10d8', count: 10, die: 8, type: 'fulmine', save: 'DEX', cantrip: false },
  'chill-touch': { dice: '1d8', count: 1, die: 8, type: 'necrotico', attack: 'ranged', cantrip: true },
  'circle-of-death': { dice: '8d6', count: 8, die: 6, type: 'necrotico', save: 'CON', cantrip: false },
  'cloudkill': { dice: '5d8', count: 5, die: 8, type: 'veleno', save: 'CON', cantrip: false },
  'cone-of-cold': { dice: '8d8', count: 8, die: 8, type: 'freddo', save: 'CON', cantrip: false },
  'contact-other-plane': { dice: '6d6', count: 6, die: 6, type: 'psichico', save: 'INT', cantrip: false },
  'control-water': { dice: '2d8', count: 2, die: 8, type: 'contundente', save: 'STR', cantrip: false },
  'dimension-door': { dice: '4d6', count: 4, die: 6, type: 'forza', cantrip: false },
  'divine-favor': { dice: '1d4', count: 1, die: 4, type: 'radioso', cantrip: false },
  'dream': { dice: '3d6', count: 3, die: 6, type: 'psichico', save: 'WIS', cantrip: false },
  'earthquake': { dice: '5d6', count: 5, die: 6, type: 'contundente', save: 'CON', cantrip: false },
  'eldritch-blast': { dice: '1d10', count: 1, die: 10, type: 'forza', attack: 'ranged', cantrip: true },
  'faithful-hound': { dice: '4d8', count: 4, die: 8, type: 'perforante', cantrip: false },
  'feeblemind': { dice: '4d6', count: 4, die: 6, type: 'psichico', save: 'INT', cantrip: false },
  'fire-bolt': { dice: '1d10', count: 1, die: 10, type: 'fuoco', attack: 'ranged', cantrip: true },
  'fire-storm': { dice: '7d10', count: 7, die: 10, type: 'fuoco', save: 'DEX', cantrip: false },
  'fireball': { dice: '8d6', count: 8, die: 6, type: 'fuoco', save: 'DEX', cantrip: false },
  'flame-blade': { dice: '3d6', count: 3, die: 6, type: 'fuoco', attack: 'melee', cantrip: false },
  'flame-strike': { dice: '4d6', count: 4, die: 6, type: 'fuoco', save: 'DEX', cantrip: false },
  'flaming-sphere': { dice: '2d6', count: 2, die: 6, type: 'fuoco', save: 'DEX', cantrip: false },
  'freezing-sphere': { dice: '10d6', count: 10, die: 6, type: 'freddo', save: 'CON', cantrip: false },
  'geas': { dice: '5d10', count: 5, die: 10, type: 'psichico', save: 'WIS', cantrip: false },
  'guiding-bolt': { dice: '4d6', count: 4, die: 6, type: 'radioso', attack: 'ranged', cantrip: false },
  'harm': { dice: '14d6', count: 14, die: 6, type: 'necrotico', save: 'CON', cantrip: false },
  'heat-metal': { dice: '2d8', count: 2, die: 8, type: 'fuoco', save: 'CON', cantrip: false },
  'hellish-rebuke': { dice: '2d10', count: 2, die: 10, type: 'fuoco', save: 'DEX', cantrip: false },
  'ice-storm': { dice: '2d8', count: 2, die: 8, type: 'contundente', save: 'DEX', cantrip: false },
  'incendiary-cloud': { dice: '10d8', count: 10, die: 8, type: 'fuoco', save: 'DEX', cantrip: false },
  'inflict-wounds': { dice: '3d10', count: 3, die: 10, type: 'necrotico', attack: 'melee', cantrip: false },
  'insect-plague': { dice: '4d10', count: 4, die: 10, type: 'perforante', save: 'CON', cantrip: false },
  'lightning-bolt': { dice: '8d6', count: 8, die: 6, type: 'fulmine', save: 'DEX', cantrip: false },
  'meld-into-stone': { dice: '6d6', count: 6, die: 6, type: 'contundente', cantrip: false },
  'meteor-swarm': { dice: '20d6', count: 20, die: 6, type: 'fuoco', save: 'DEX', cantrip: false },
  'moonbeam': { dice: '2d10', count: 2, die: 10, type: 'radioso', save: 'CON', cantrip: false },
  'phantasmal-killer': { dice: '4d10', count: 4, die: 10, type: 'psichico', save: 'WIS', cantrip: false },
  'poison-spray': { dice: '1d12', count: 1, die: 12, type: 'veleno', save: 'CON', cantrip: true },
  'prismatic-spray': { dice: '10d6', count: 10, die: 6, type: 'fuoco', save: 'DEX', cantrip: false },
  'prismatic-wall': { dice: '10d6', count: 10, die: 6, type: 'fuoco', save: 'CON', cantrip: false },
  'produce-flame': { dice: '1d8', count: 1, die: 8, type: 'fuoco', attack: 'ranged', cantrip: true },
  'ray-of-frost': { dice: '1d8', count: 1, die: 8, type: 'freddo', attack: 'ranged', cantrip: true },
  'sacred-flame': { dice: '1d8', count: 1, die: 8, type: 'radioso', save: 'DEX', cantrip: true },
  'scorching-ray': { dice: '2d6', count: 2, die: 6, type: 'fuoco', attack: 'ranged', cantrip: false },
  'shatter': { dice: '3d8', count: 3, die: 8, type: 'tuono', save: 'CON', cantrip: false },
  'shocking-grasp': { dice: '1d8', count: 1, die: 8, type: 'fulmine', attack: 'melee', cantrip: true },
  'spike-growth': { dice: '2d4', count: 2, die: 4, type: 'perforante', cantrip: false },
  'spirit-guardians': { dice: '3d8', count: 3, die: 8, type: 'radioso', save: 'WIS', cantrip: false },
  'storm-of-vengeance': { dice: '2d6', count: 2, die: 6, type: 'tuono', save: 'CON', cantrip: false },
  'sunbeam': { dice: '6d8', count: 6, die: 8, type: 'radioso', save: 'CON', cantrip: false },
  'sunburst': { dice: '12d6', count: 12, die: 6, type: 'radioso', save: 'CON', cantrip: false },
  'teleport': { dice: '3d10', count: 3, die: 10, type: 'forza', cantrip: false },
  'thunderwave': { dice: '2d8', count: 2, die: 8, type: 'tuono', save: 'CON', cantrip: false },
  'vampiric-touch': { dice: '3d6', count: 3, die: 6, type: 'necrotico', attack: 'melee', cantrip: false },
  'vicious-mockery': { dice: '1d4', count: 1, die: 4, type: 'psichico', save: 'WIS', cantrip: true },
  'wall-of-fire': { dice: '5d8', count: 5, die: 8, type: 'fuoco', save: 'DEX', cantrip: false },
  'wall-of-ice': { dice: '10d6', count: 10, die: 6, type: 'freddo', save: 'DEX', cantrip: false },
  'wall-of-thorns': { dice: '7d8', count: 7, die: 8, type: 'perforante', save: 'DEX', cantrip: false },
  'web': { dice: '2d4', count: 2, die: 4, type: 'fuoco', save: 'DEX', cantrip: false },
  'weird': { dice: '4d10', count: 4, die: 10, type: 'psichico', save: 'WIS', cantrip: false },
  'wind-wall': { dice: '3d8', count: 3, die: 8, type: 'contundente', save: 'STR', cantrip: false },
  'wish': { dice: '1d10', count: 1, die: 10, type: 'necrotico', cantrip: false },
};
