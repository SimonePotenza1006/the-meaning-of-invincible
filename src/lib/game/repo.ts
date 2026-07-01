import 'server-only';
import { and, desc, eq, ne, or } from 'drizzle-orm';
import { campaigns, characters, combatants, db, encounters, events } from '@/db';
import type {
  Campaign,
  Character,
  Combatant,
  Encounter,
  GameEvent,
} from '@/db';

export type Role = 'dm' | 'player';

export interface CampaignState {
  role: Role;
  campaign: Campaign;
  character: Character | null;
  events: GameEvent[];
  encounter: Encounter | null;
  combatants: Combatant[];
}

/** Load the full state for whichever token (DM or player) is presented. */
export async function loadState(tok: string): Promise<CampaignState | null> {
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(or(eq(campaigns.dmToken, tok), eq(campaigns.playerToken, tok)));
  if (!campaign) return null;

  const role: Role = campaign.dmToken === tok ? 'dm' : 'player';

  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.campaignId, campaign.id))
    .orderBy(desc(characters.id))
    .limit(1);

  const log = await db
    .select()
    .from(events)
    .where(eq(events.campaignId, campaign.id))
    .orderBy(desc(events.createdAt))
    .limit(60);

  // Most recent encounter that hasn't ended (draft while building, active in combat).
  const [encounter] = await db
    .select()
    .from(encounters)
    .where(and(eq(encounters.campaignId, campaign.id), ne(encounters.status, 'ended')))
    .orderBy(desc(encounters.id))
    .limit(1);

  let combatantList: Combatant[] = [];
  if (encounter) {
    combatantList = await db
      .select()
      .from(combatants)
      .where(eq(combatants.encounterId, encounter.id))
      .orderBy(combatants.sortIndex, combatants.id);
  }

  return {
    role,
    campaign,
    character: character ?? null,
    events: log,
    encounter: encounter ?? null,
    combatants: combatantList,
  };
}

export async function listCampaigns(): Promise<Campaign[]> {
  return db.select().from(campaigns).orderBy(desc(campaigns.id)).limit(50);
}
