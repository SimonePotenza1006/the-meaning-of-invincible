import type { Ability } from '@/lib/rules';

export type AbilityBonuses = Partial<Record<Ability, number>>;

export interface Trait {
  name: string;
  description: string;
}

/** "Choose N +amount bonuses among abilities" (e.g. Half-Elf). */
export interface BonusChoice {
  count: number;
  amount: number;
  exclude?: Ability[];
}

export interface Subrace {
  key: string;
  name: string;
  abilityBonuses: AbilityBonuses;
  traits: Trait[];
  description: string;
  /** Extra walking speed granted by the subrace, if any. */
  speedOverride?: number;
}

export interface RaceData {
  key: string;
  name: string;
  icon: string;
  abilityBonuses: AbilityBonuses;
  bonusChoice?: BonusChoice;
  size: 'Piccola' | 'Media';
  speed: number;
  languages: string[];
  traits: Trait[];
  subraces?: Subrace[];
  description: string;
}

/** "Choose N skills from this list" (skill keys match SKILLS in rules). */
export interface SkillChoice {
  choose: number;
  from: string[];
}

export interface ClassData {
  key: string;
  name: string;
  icon: string;
  hitDie: number;
  primaryAbility: Ability[];
  savingThrows: Ability[];
  armor: string;
  weapons: string;
  skillChoice: SkillChoice;
  /** Ability priority best→worst, used to lay out the suggested base array. */
  statPriority: Ability[];
  spellcastingAbility?: Ability;
  description: string;
  features: Trait[];
}

export interface BackgroundData {
  key: string;
  name: string;
  icon: string;
  /** Fixed skill proficiencies (skill keys). */
  skills: string[];
  /** Some backgrounds let you pick your skills instead. */
  skillChoice?: SkillChoice;
  languages: number;
  tools: string[];
  equipment: string[];
  feature: Trait;
  description: string;
}
