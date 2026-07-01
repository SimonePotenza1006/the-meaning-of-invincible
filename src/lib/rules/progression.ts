// Level progression tables — ported from claude-dnd-skill (character.py).

import type { Ability } from './abilities';

/** Proficiency bonus by character level (1–20). */
export function proficiencyBonus(level: number): number {
  return Math.floor((Math.min(Math.max(level, 1), 20) - 1) / 4) + 2;
}

/** Total XP required to reach each level. */
export const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000,
};

/** Hit die size per class. */
export const HIT_DICE: Record<string, number> = {
  barbarian: 12,
  fighter: 10,
  paladin: 10,
  ranger: 10,
  bard: 8,
  cleric: 8,
  druid: 8,
  monk: 8,
  rogue: 8,
  warlock: 8,
  sorcerer: 6,
  wizard: 6,
};

/** Saving-throw proficiencies granted by each class. */
export const SAVE_PROFICIENCIES: Record<string, Ability[]> = {
  barbarian: ['STR', 'CON'],
  fighter: ['STR', 'CON'],
  ranger: ['STR', 'DEX'],
  paladin: ['WIS', 'CHA'],
  rogue: ['DEX', 'INT'],
  bard: ['DEX', 'CHA'],
  cleric: ['WIS', 'CHA'],
  druid: ['INT', 'WIS'],
  monk: ['STR', 'DEX'],
  warlock: ['WIS', 'CHA'],
  sorcerer: ['CON', 'CHA'],
  wizard: ['INT', 'WIS'],
};

/** All 18 skills mapped to their governing ability. */
export const SKILLS: Record<string, Ability> = {
  Acrobatics: 'DEX',
  'Animal Handling': 'WIS',
  Arcana: 'INT',
  Athletics: 'STR',
  Deception: 'CHA',
  History: 'INT',
  Insight: 'WIS',
  Intimidation: 'CHA',
  Investigation: 'INT',
  Medicine: 'WIS',
  Nature: 'INT',
  Perception: 'WIS',
  Performance: 'CHA',
  Persuasion: 'CHA',
  Religion: 'INT',
  'Sleight of Hand': 'DEX',
  Stealth: 'DEX',
  Survival: 'WIS',
};

/** Given total XP, the highest level reached. */
export function levelForXp(xp: number): number {
  let level = 1;
  for (let l = 20; l >= 1; l--) {
    if (xp >= XP_THRESHOLDS[l]) {
      level = l;
      break;
    }
  }
  return level;
}
