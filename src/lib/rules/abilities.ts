// Ability scores and point-buy — ported from the claude-dnd-skill
// (ability-scores.py) to keep parity with the DM tooling.

export const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;
export type Ability = (typeof ABILITIES)[number];
export type AbilityScores = Record<Ability, number>;

/** 5e ability modifier: floor((score - 10) / 2). */
export function modifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Format a modifier with an explicit sign, e.g. "+3" / "-1". */
export function formatMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

// ─── Point buy (5e standard): 27 points, scores 8–15 ───────────────────────
export const POINT_BUY_COST: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};
export const POINT_BUY_BUDGET = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;

/** Standard array — assign these six values to abilities as desired. */
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

export interface PointBuyResult {
  totalCost: number;
  remaining: number;
  valid: boolean;
  errors: string[];
}

/** Validate and cost a full point-buy assignment (before racial bonuses). */
export function pointBuyCost(scores: AbilityScores): PointBuyResult {
  const errors: string[] = [];
  let totalCost = 0;
  for (const ability of ABILITIES) {
    const score = scores[ability];
    if (!(score in POINT_BUY_COST)) {
      errors.push(
        `${ability}=${score} fuori range (${POINT_BUY_MIN}–${POINT_BUY_MAX})`,
      );
    } else {
      totalCost += POINT_BUY_COST[score];
    }
  }
  const remaining = POINT_BUY_BUDGET - totalCost;
  return {
    totalCost,
    remaining,
    valid: errors.length === 0 && remaining === 0,
    errors,
  };
}
