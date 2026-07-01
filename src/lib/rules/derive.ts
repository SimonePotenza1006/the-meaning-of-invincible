// Derive secondary character stats from raw inputs — the TS equivalent of
// character.py's `calc`.

import { ABILITIES, type Ability, type AbilityScores, modifier } from './abilities';
import {
  HIT_DICE,
  SAVE_PROFICIENCIES,
  SKILLS,
  proficiencyBonus,
} from './progression';

export interface DeriveInput {
  className: string;
  level: number;
  scores: AbilityScores;
  /** Skill names the character is proficient in. */
  proficientSkills?: string[];
  /** Overrides the class-default saving-throw proficiencies. */
  proficientSaves?: Ability[];
}

export interface SaveStat {
  bonus: number;
  proficient: boolean;
}

export interface SkillStat {
  ability: Ability;
  bonus: number;
  proficient: boolean;
}

export interface DerivedStats {
  proficiencyBonus: number;
  hitDie: number;
  /** Max HP at level 1: hit die + CON modifier. */
  maxHpLevel1: number;
  initiative: number;
  saves: Record<Ability, SaveStat>;
  skills: Record<string, SkillStat>;
}

export function deriveStats(input: DeriveInput): DerivedStats {
  const cls = input.className.toLowerCase();
  const prof = proficiencyBonus(input.level);
  const hitDie = HIT_DICE[cls] ?? 8;
  const conMod = modifier(input.scores.CON);
  const saveProfs = input.proficientSaves ?? SAVE_PROFICIENCIES[cls] ?? [];
  const skillProfs = new Set(
    (input.proficientSkills ?? []).map((s) => s.toLowerCase()),
  );

  const saves = {} as Record<Ability, SaveStat>;
  for (const ability of ABILITIES) {
    const proficient = saveProfs.includes(ability);
    saves[ability] = {
      proficient,
      bonus: modifier(input.scores[ability]) + (proficient ? prof : 0),
    };
  }

  const skills: Record<string, SkillStat> = {};
  for (const [skill, ability] of Object.entries(SKILLS)) {
    const proficient = skillProfs.has(skill.toLowerCase());
    skills[skill] = {
      ability,
      proficient,
      bonus: modifier(input.scores[ability]) + (proficient ? prof : 0),
    };
  }

  return {
    proficiencyBonus: prof,
    hitDie,
    maxHpLevel1: hitDie + conMod,
    initiative: modifier(input.scores.DEX),
    saves,
    skills,
  };
}
