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

/** Snapshot of a monster/NPC stat block stored on a combatant. */
export interface CombatantStatblock {
  index?: string;
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
