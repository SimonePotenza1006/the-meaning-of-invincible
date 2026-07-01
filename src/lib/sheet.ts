import { z } from 'zod';

// Character sheet shape, modelled on the claude-dnd-skill character-sheet.md
// template. Stored as JSONB in the `characters.sheet` column and validated at
// the API boundary.

const abilityEnum = z.enum(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']);

export const abilityScoresSchema = z.object({
  STR: z.number().int().min(1).max(30),
  DEX: z.number().int().min(1).max(30),
  CON: z.number().int().min(1).max(30),
  INT: z.number().int().min(1).max(30),
  WIS: z.number().int().min(1).max(30),
  CHA: z.number().int().min(1).max(30),
});

export const identitySchema = z.object({
  name: z.string().default(''),
  race: z.string().default(''),
  subrace: z.string().optional(),
  className: z.string().default(''),
  /** Stable class key (e.g. 'fighter'); className holds the localized label. */
  classKey: z.string().optional(),
  subclass: z.string().optional(),
  subclassKey: z.string().optional(),
  level: z.number().int().min(1).max(20).default(1),
  background: z.string().default(''),
  alignment: z.string().optional(),
  xp: z.number().int().min(0).default(0),
  /** The player's one-sentence "what should the DM know about you". */
  pillar: z.string().optional(),
});

export const proficienciesSchema = z.object({
  savingThrows: z.array(abilityEnum).default([]),
  skills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  proficiencyBonus: z.number().int().default(2),
});

export const deathSavesSchema = z.object({
  successes: z.number().int().min(0).max(3).default(0),
  failures: z.number().int().min(0).max(3).default(0),
});

export const combatSchema = z.object({
  maxHp: z.number().int().min(0),
  currentHp: z.number().int(),
  tempHp: z.number().int().min(0).default(0),
  armorClass: z.number().int(),
  speed: z.number().int().default(30),
  hitDieSize: z.number().int(),
  hitDiceTotal: z.number().int().min(1),
  hitDiceRemaining: z.number().int().min(0),
  deathSaves: deathSavesSchema.default({ successes: 0, failures: 0 }),
});

export const attackSchema = z.object({
  name: z.string(),
  /** When set, attack bonus & damage are computed live from the weapon + sheet. */
  weaponIndex: z.string().optional(),
  proficient: z.boolean().optional(),
  twoHanded: z.boolean().optional(),
  /** Stored strings for free-form/custom attacks (fallback when no weaponIndex). */
  attackBonus: z.string().optional(),
  damage: z.string().optional(),
  damageType: z.string().optional(),
  notes: z.string().optional(),
});

export const spellSlotSchema = z.object({
  level: z.number().int().min(1).max(9),
  total: z.number().int().min(0),
  used: z.number().int().min(0),
});

/** A spell the character has learned/prepared, denormalized for display. */
export const knownSpellSchema = z.object({
  index: z.string(),
  name: z.string(),
  level: z.number().int().min(0).max(9),
});

export const spellcastingSchema = z
  .object({
    ability: abilityEnum.optional(),
    spellSaveDc: z.number().int().optional(),
    spellAttackBonus: z.number().int().optional(),
    slots: z.array(spellSlotSchema).default([]),
    cantrips: z.array(knownSpellSchema).default([]),
    known: z.array(knownSpellSchema).default([]),
    /** Indices (from `known`) currently prepared — only meaningful for prepared casters. */
    prepared: z.array(z.string()).default([]),
  })
  .optional();

export const featureSchema = z.object({
  source: z.string(), // 'class' | 'race' | 'background' | free text
  name: z.string(),
  description: z.string().optional(),
});

export const currencySchema = z.object({
  cp: z.number().int().min(0).default(0),
  sp: z.number().int().min(0).default(0),
  ep: z.number().int().min(0).default(0),
  gp: z.number().int().min(0).default(0),
  pp: z.number().int().min(0).default(0),
});

/** One effect a custom magic item grants. */
export const magicItemEffectSchema = z.object({
  kind: z.enum(['ability', 'ac', 'maxHp', 'speed', 'spell', 'feature']),
  // stat bonuses
  ability: abilityEnum.optional(),
  bonus: z.number().int().optional(),
  // granted spell
  spellIndex: z.string().optional(),
  spellName: z.string().optional(),
  spellLevel: z.number().int().min(0).max(9).optional(),
  // granted feature
  featureName: z.string().optional(),
  featureDesc: z.string().optional(),
});

export const magicItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  rarity: z.string().optional(),
  attunement: z.boolean().optional(),
  /** Stat bonuses only apply while equipped. */
  equipped: z.boolean().default(true),
  /** Consumable: `charges` acts as a quantity and the item vanishes at 0 uses. */
  consumable: z.boolean().default(false),
  charges: z.object({ current: z.number().int().min(0), max: z.number().int().min(0) }).optional(),
  effects: z.array(magicItemEffectSchema).default([]),
});

export const equipmentSchema = z.object({
  weapons: z.array(z.string()).default([]),
  armor: z.array(z.string()).default([]),
  gear: z.array(z.string()).default([]),
  currency: currencySchema.default({ cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }),
  magicItems: z.array(magicItemSchema).default([]),
});

/** A level-up the DM triggered that the player still needs to resolve. */
export const pendingLevelUpSchema = z
  .object({
    level: z.number().int().min(1).max(20),
    hpGain: z.number().int(),
    hpMode: z.enum(['average', 'rolled']).default('average'),
    needsAsi: z.boolean().default(false),
    needsSubclass: z.boolean().default(false),
  })
  .optional();

export const characterSheetSchema = z.object({
  schemaVersion: z.literal(1).default(1),
  ruleset: z.enum(['2014', '2024']).default('2014'),
  identity: identitySchema,
  abilities: abilityScoresSchema,
  proficiencies: proficienciesSchema,
  combat: combatSchema,
  conditions: z.array(z.string()).default([]),
  attacks: z.array(attackSchema).default([]),
  spellcasting: spellcastingSchema,
  features: z.array(featureSchema).default([]),
  equipment: equipmentSchema,
  notes: z.string().default(''),
  pendingLevelUp: pendingLevelUpSchema,
});

export type CharacterSheet = z.infer<typeof characterSheetSchema>;
export type Identity = z.infer<typeof identitySchema>;
export type CombatStats = z.infer<typeof combatSchema>;
export type Attack = z.infer<typeof attackSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type KnownSpell = z.infer<typeof knownSpellSchema>;
export type Spellcasting = NonNullable<z.infer<typeof spellcastingSchema>>;
export type MagicItem = z.infer<typeof magicItemSchema>;
export type MagicItemEffect = z.infer<typeof magicItemEffectSchema>;
export type PendingLevelUp = NonNullable<z.infer<typeof pendingLevelUpSchema>>;
