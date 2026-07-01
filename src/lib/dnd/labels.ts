import type { Ability } from '@/lib/rules';

/** Full Italian names for the six abilities. */
export const ABILITY_LABELS: Record<Ability, string> = {
  STR: 'Forza',
  DEX: 'Destrezza',
  CON: 'Costituzione',
  INT: 'Intelligenza',
  WIS: 'Saggezza',
  CHA: 'Carisma',
};

/** Three-letter Italian abbreviations. */
export const ABILITY_SHORT: Record<Ability, string> = {
  STR: 'FOR',
  DEX: 'DES',
  CON: 'COS',
  INT: 'INT',
  WIS: 'SAG',
  CHA: 'CAR',
};

/** Italian names for the 18 skills, keyed by their English rules key. */
export const SKILL_LABELS: Record<string, string> = {
  Acrobatics: 'Acrobazia',
  'Animal Handling': 'Addestrare Animali',
  Arcana: 'Arcano',
  Athletics: 'Atletica',
  Deception: 'Inganno',
  History: 'Storia',
  Insight: 'Intuizione',
  Intimidation: 'Intimidire',
  Investigation: 'Indagare',
  Medicine: 'Medicina',
  Nature: 'Natura',
  Perception: 'Percezione',
  Performance: 'Intrattenere',
  Persuasion: 'Persuasione',
  Religion: 'Religione',
  'Sleight of Hand': 'Rapidità di Mano',
  Stealth: 'Furtività',
  Survival: 'Sopravvivenza',
};

export const ALIGNMENTS = [
  'Legale Buono',
  'Neutrale Buono',
  'Caotico Buono',
  'Legale Neutrale',
  'Neutrale Puro',
  'Caotico Neutrale',
  'Legale Malvagio',
  'Neutrale Malvagio',
  'Caotico Malvagio',
] as const;

/** Standard 5e conditions (Italian). */
export const CONDITIONS = [
  'Accecato',
  'Affascinato',
  'Assordato',
  'Avvelenato',
  'Afferrato',
  'Incapacitato',
  'Invisibile',
  'Paralizzato',
  'Pietrificato',
  'Privo di sensi',
  'Prono',
  'Spaventato',
  'Stordito',
  'Trattenuto',
] as const;

export function skillLabel(key: string): string {
  return SKILL_LABELS[key] ?? key;
}
