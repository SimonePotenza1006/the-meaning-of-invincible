import {
  ABILITIES,
  type Ability,
  type AbilityScores,
  STANDARD_ARRAY,
} from '@/lib/rules';
import type { AbilityBonuses, ClassData, RaceData, Subrace } from './types';

/**
 * Base scores from the standard array [15,14,13,12,10,8], assigned in the
 * class's stat-priority order. This is the "base layout per class" the player
 * can then customise.
 */
export function baseScoresFromArray(cls: ClassData): AbilityScores {
  const scores = {} as AbilityScores;
  cls.statPriority.forEach((ability, i) => {
    scores[ability] = STANDARD_ARRAY[i] ?? 8;
  });
  for (const a of ABILITIES) {
    if (scores[a] === undefined) scores[a] = 8;
  }
  return scores;
}

/** Sum the fixed ability bonuses from race + subrace (choices handled separately). */
export function racialBonuses(race?: RaceData, subrace?: Subrace): AbilityBonuses {
  const total: AbilityBonuses = {};
  const add = (bonuses?: AbilityBonuses) => {
    if (!bonuses) return;
    for (const a of ABILITIES) {
      if (bonuses[a] !== undefined) total[a] = (total[a] ?? 0) + (bonuses[a] as number);
    }
  };
  add(race?.abilityBonuses);
  add(subrace?.abilityBonuses);
  return total;
}

/** Apply a set of bonuses on top of base scores. */
export function applyBonuses(
  base: AbilityScores,
  ...bonusSets: (AbilityBonuses | undefined)[]
): AbilityScores {
  const out = { ...base };
  for (const bonuses of bonusSets) {
    if (!bonuses) continue;
    for (const a of ABILITIES) {
      if (bonuses[a] !== undefined) out[a] = out[a] + (bonuses[a] as number);
    }
  }
  return out;
}

/** Turn chosen "+1 to N abilities" selections into a bonus map. */
export function choiceBonuses(chosen: Ability[], amount = 1): AbilityBonuses {
  const out: AbilityBonuses = {};
  for (const a of chosen) out[a] = (out[a] ?? 0) + amount;
  return out;
}
