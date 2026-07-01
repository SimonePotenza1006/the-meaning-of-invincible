import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import type { CharacterSheet } from '../lib/sheet';
import type { CombatantStatblock, Npc } from '../lib/game/types';

// One standalone campaign = one DM + one player, distinguished by secret
// tokens carried in the URL (no heavyweight auth for a two-person game).
export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ruleset: text('ruleset').notNull().default('2014'),
  // 'setup' while the player is still building their character, then 'active'.
  status: text('status').notNull().default('setup'),
  dmToken: text('dm_token').notNull(),
  playerToken: text('player_token').notNull(),
  // DM's private notepad and lightweight NPC roster (see src/lib/game/types.ts).
  dmNotes: text('dm_notes').notNull().default(''),
  npcs: jsonb('npcs').$type<Npc[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id')
    .references(() => campaigns.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name'),
  race: text('race'),
  className: text('class'),
  level: integer('level').notNull().default(1),
  // 'draft' during the creation wizard, 'active' once confirmed.
  status: text('status').notNull().default('draft'),
  // Index of the current wizard step, so a half-finished character resumes.
  creationStep: integer('creation_step').notNull().default(0),
  sheet: jsonb('sheet').$type<CharacterSheet>(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// Shared, append-only activity log (dice rolls, HP changes, DM requests…).
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id')
    .references(() => campaigns.id, { onDelete: 'cascade' })
    .notNull(),
  actor: text('actor').notNull(), // 'dm' | 'player' | 'system'
  kind: text('kind').notNull(), // 'roll' | 'hp' | 'condition' | 'xp' | 'note' | 'request' | 'level'
  message: text('message').notNull(),
  data: jsonb('data'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;
export type GameEvent = typeof events.$inferSelect;
export type NewGameEvent = typeof events.$inferInsert;

// A prepared/active combat encounter within a campaign.
export const encounters = pgTable('encounters', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id')
    .references(() => campaigns.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  terrain: text('terrain').notNull().default('plains'),
  // 'draft' while the DM builds it, 'active' during combat, 'ended' afterwards.
  status: text('status').notNull().default('draft'),
  round: integer('round').notNull().default(0),
  turnIndex: integer('turn_index').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const combatants = pgTable('combatants', {
  id: serial('id').primaryKey(),
  encounterId: integer('encounter_id')
    .references(() => encounters.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  side: text('side').notNull(), // 'player' | 'ally' | 'enemy'
  sourceType: text('source_type').notNull(), // 'character' | 'monster' | 'custom'
  characterId: integer('character_id'),
  monsterIndex: text('monster_index'),
  // HP/AC null for the player combatant (read live from their sheet instead).
  maxHp: integer('max_hp'),
  currentHp: integer('current_hp'),
  ac: integer('ac'),
  initMod: integer('init_mod').notNull().default(0),
  initiative: integer('initiative'),
  conditions: jsonb('conditions').$type<string[]>().default([]),
  statblock: jsonb('statblock').$type<CombatantStatblock | null>(),
  hidden: boolean('hidden').notNull().default(false),
  defeated: boolean('defeated').notNull().default(false),
  sortIndex: integer('sort_index').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Encounter = typeof encounters.$inferSelect;
export type NewEncounter = typeof encounters.$inferInsert;
export type Combatant = typeof combatants.$inferSelect;
export type NewCombatant = typeof combatants.$inferInsert;
