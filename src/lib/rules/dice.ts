// Dice roller. Pure functions with an injectable RNG so results are testable
// and can be produced deterministically in tests.

export type Rng = () => number;
const defaultRng: Rng = Math.random;

/** Roll a single die with the given number of sides. */
export function rollDie(sides: number, rng: Rng = defaultRng): number {
  return Math.floor(rng() * sides) + 1;
}

export interface DiceRoll {
  expression: string;
  rolls: number[];
  modifier: number;
  total: number;
}

// Matches "NdX", "dX", "NdX+M", "NdX - M" (case-insensitive).
const DICE_RE = /^\s*(\d*)\s*d\s*(\d+)\s*([+-]\s*\d+)?\s*$/i;

/** Parse and roll a dice expression such as "2d6+3" or "d20". */
export function roll(expression: string, rng: Rng = defaultRng): DiceRoll {
  const match = DICE_RE.exec(expression);
  if (!match) {
    throw new Error(`Espressione dadi non valida: "${expression}"`);
  }
  const count = match[1] ? parseInt(match[1], 10) : 1;
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3].replace(/\s+/g, ''), 10) : 0;

  if (count < 1 || count > 100) {
    throw new Error('Numero di dadi fuori range (1–100).');
  }
  if (sides < 2 || sides > 1000) {
    throw new Error('Facce del dado fuori range (2–1000).');
  }

  const rolls = Array.from({ length: count }, () => rollDie(sides, rng));
  const total = rolls.reduce((sum, r) => sum + r, 0) + modifier;
  return { expression, rolls, modifier, total };
}

export type D20Mode = 'normal' | 'advantage' | 'disadvantage';

export interface D20Result {
  rolls: number[]; // raw d20s (two when advantage/disadvantage)
  used: number; // die actually applied
  modifier: number;
  total: number;
  mode: D20Mode;
}

/** Roll a d20 check/save/attack, honouring advantage or disadvantage. */
export function rollD20(
  {
    modifier = 0,
    advantage = false,
    disadvantage = false,
  }: { modifier?: number; advantage?: boolean; disadvantage?: boolean } = {},
  rng: Rng = defaultRng,
): D20Result {
  const mode: D20Mode =
    advantage && !disadvantage
      ? 'advantage'
      : disadvantage && !advantage
        ? 'disadvantage'
        : 'normal';

  const rolls =
    mode === 'normal'
      ? [rollDie(20, rng)]
      : [rollDie(20, rng), rollDie(20, rng)];

  const used =
    mode === 'advantage'
      ? Math.max(...rolls)
      : mode === 'disadvantage'
        ? Math.min(...rolls)
        : rolls[0];

  return { rolls, used, modifier, total: used + modifier, mode };
}

export interface AbilityRoll {
  rolls: number[]; // the four d6, sorted high→low
  dropped: number; // the discarded lowest die
  kept: number[]; // the three kept dice
  total: number;
}

/** Roll one ability score: 4d6, keep the highest three. */
export function rollAbilityScore(rng: Rng = defaultRng): AbilityRoll {
  const rolls = Array.from({ length: 4 }, () => rollDie(6, rng)).sort(
    (a, b) => b - a,
  );
  const kept = rolls.slice(0, 3);
  return {
    rolls,
    dropped: rolls[3],
    kept,
    total: kept.reduce((sum, r) => sum + r, 0),
  };
}

/** Roll a full set of six ability scores. */
export function rollAbilityArray(rng: Rng = defaultRng): AbilityRoll[] {
  return Array.from({ length: 6 }, () => rollAbilityScore(rng));
}
