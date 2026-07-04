export interface SaveResult {
  campaignId: number;
  characterId: number;
  playerToken: string;
  dmToken: string;
}

export type RollMode = 'ability' | 'save' | 'skill' | 'custom';

export interface RollRequestData {
  mode: RollMode;
  key?: string;
  label: string;
  advantage?: boolean;
  status?: 'pending';
}

/** A lightweight DM-managed NPC: core stats derived from race/class/level. */
export interface Npc {
  id: string;
  name: string;
  raceKey: string;
  race: string;
  classKey: string;
  className: string;
  subclassKey?: string;
  subclass?: string;
  level: number;
  abilities: { STR: number; DEX: number; CON: number; INT: number; WIS: number; CHA: number };
  maxHp: number;
  currentHp: number;
  armorClass: number;
  speed: number;
  proficiencyBonus: number;
  hitDie: number;
  savingThrows: string[];
  notes?: string;
}

/** Snapshot of a monster/NPC stat block stored on a combatant. */
export interface CombatantStatblock {
  index?: string;
  /** Set when the combatant was spawned from a roster NPC (links back to Npc.id). */
  npcId?: string;
  type?: string;
  size?: string;
  cr?: number;
  xp?: number;
  speed?: string;
  description?: string;
  abilities?: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
}
