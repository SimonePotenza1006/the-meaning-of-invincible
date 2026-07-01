import {
  ABILITIES,
  type Ability,
  type AbilityScores,
  modifier,
  proficiencyBonus,
  STANDARD_ARRAY,
} from '@/lib/rules';
import {
  applyBonuses,
  baseScoresFromArray,
  choiceBonuses,
  getBackground,
  getClass,
  getRace,
  getSubclass,
  racialBonuses,
  subclassFeaturesUpTo,
  subclassMeta,
} from '@/lib/dnd';
import type { CharacterSheet, Feature } from '@/lib/sheet';

export type AbilityMethod = 'array' | 'pointbuy';

/** All the choices the wizard collects, in one serialisable object. */
export interface WizardState {
  raceKey: string | null;
  subraceKey: string | null;
  raceBonusChoice: Ability[]; // e.g. Half-Elf's two +1 picks
  classKey: string | null;
  subclassKey: string | null; // only picked at creation for level-1-subclass classes
  backgroundKey: string | null;
  abilityMethod: AbilityMethod;
  baseScores: AbilityScores; // pre-racial scores (from array or point buy)
  classSkills: string[];
  extraSkills: string[]; // Half-Elf skill versatility / custom background picks
  name: string;
  alignment: string;
  pillar: string;
}

export function initialBaseScores(): AbilityScores {
  const scores = {} as AbilityScores;
  ABILITIES.forEach((a, i) => {
    scores[a] = STANDARD_ARRAY[i] ?? 8;
  });
  return scores;
}

export function initialState(): WizardState {
  return {
    raceKey: null,
    subraceKey: null,
    raceBonusChoice: [],
    classKey: null,
    subclassKey: null,
    backgroundKey: null,
    abilityMethod: 'array',
    baseScores: initialBaseScores(),
    classSkills: [],
    extraSkills: [],
    name: '',
    alignment: '',
    pillar: '',
  };
}

/** Suggested base layout for a class (standard array by stat priority). */
export function suggestedBaseScores(classKey: string): AbilityScores {
  const cls = getClass(classKey);
  return cls ? baseScoresFromArray(cls) : initialBaseScores();
}

/** Final ability scores: base + racial + chosen bonuses. */
export function finalScores(state: WizardState): AbilityScores {
  const race = getRace(state.raceKey ?? '');
  const subrace = race?.subraces?.find((s) => s.key === state.subraceKey);
  const racial = racialBonuses(race, subrace);
  const chosen = choiceBonuses(state.raceBonusChoice, race?.bonusChoice?.amount ?? 1);
  return applyBonuses(state.baseScores, racial, chosen);
}

/** Skill proficiencies granted automatically by the race (SRD). */
function autoRaceSkills(raceKey: string | null): string[] {
  if (raceKey === 'half-orc') return ['Intimidation'];
  if (raceKey === 'elf') return ['Perception']; // Percezione Acuita
  return [];
}

/** Assemble the full, saveable character sheet from the wizard state. */
export function buildSheet(state: WizardState): CharacterSheet {
  const race = getRace(state.raceKey ?? '');
  const cls = getClass(state.classKey ?? '');
  const bg = getBackground(state.backgroundKey ?? '');
  if (!race || !cls || !bg) {
    throw new Error('Selezioni incomplete: razza, classe e background sono obbligatori.');
  }
  const subrace = race.subraces?.find((s) => s.key === state.subraceKey);
  // Only classes that pick their subclass at level 1 (cleric/sorcerer/warlock)
  // resolve one here; everyone else chooses it later, on level-up.
  const meta = subclassMeta(cls.key);
  const subclass =
    meta?.level === 1 && state.subclassKey ? getSubclass(cls.key, state.subclassKey) : undefined;

  const scores = finalScores(state);
  const prof = proficiencyBonus(1);
  const conMod = modifier(scores.CON);
  const dexMod = modifier(scores.DEX);
  const speed = subrace?.speedOverride ?? race.speed;

  const skills = Array.from(
    new Set([
      ...state.classSkills,
      ...bg.skills,
      ...state.extraSkills,
      ...autoRaceSkills(state.raceKey),
    ]),
  );

  const features: Feature[] = [];
  for (const t of race.traits) features.push({ source: race.name, ...t });
  if (subrace) for (const t of subrace.traits) features.push({ source: subrace.name, ...t });
  for (const t of cls.features) features.push({ source: cls.name, ...t });
  if (subclass) {
    for (const f of subclassFeaturesUpTo(cls.key, subclass.key, 1)) {
      features.push({ source: subclass.name, name: f.name, description: f.description });
    }
  }
  features.push({ source: bg.name, ...bg.feature });

  let spellcasting: CharacterSheet['spellcasting'];
  if (cls.spellcastingAbility) {
    const mod = modifier(scores[cls.spellcastingAbility]);
    spellcasting = {
      ability: cls.spellcastingAbility,
      spellSaveDc: 8 + prof + mod,
      spellAttackBonus: prof + mod,
      slots: [{ level: 1, total: cls.key === 'warlock' ? 1 : 2, used: 0 }],
      cantrips: [],
      known: [],
      prepared: [],
    };
  }

  return {
    schemaVersion: 1,
    ruleset: '2014',
    identity: {
      name: state.name.trim(),
      race: race.name,
      subrace: subrace?.name,
      className: cls.name,
      classKey: cls.key,
      subclass: subclass?.name,
      subclassKey: subclass?.key,
      level: 1,
      background: bg.name,
      alignment: state.alignment || undefined,
      xp: 0,
      pillar: state.pillar.trim() || undefined,
    },
    abilities: scores,
    proficiencies: {
      savingThrows: cls.savingThrows,
      skills,
      languages: race.languages,
      tools: bg.tools,
      proficiencyBonus: prof,
    },
    combat: {
      maxHp: Math.max(1, cls.hitDie + conMod),
      currentHp: Math.max(1, cls.hitDie + conMod),
      tempHp: 0,
      armorClass: 10 + dexMod,
      speed,
      hitDieSize: cls.hitDie,
      hitDiceTotal: 1,
      hitDiceRemaining: 1,
      deathSaves: { successes: 0, failures: 0 },
    },
    conditions: [],
    inspiration: false,
    attacks: [],
    spellcasting,
    features,
    equipment: {
      weapons: [],
      armor: [],
      gear: [cls.weapons, ...bg.equipment],
      currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
      magicItems: [],
    },
    notes: '',
  };
}
