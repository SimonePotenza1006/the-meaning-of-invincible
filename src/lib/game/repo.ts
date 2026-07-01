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

  const rawLog = await db
    .select()
    .from(events)
    .where(eq(events.campaignId, campaign.id))
    .orderBy(desc(events.createdAt))
    .limit(60);
  // Secret rolls are the DM's alone — never surface them to the player.
  const log =
    role === 'player'
      ? rawLog.filter((e) => !(e.data as { secret?: boolean } | null)?.secret)
      : rawLog;

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

/** The one and only campaign this app runs. */
export const CAMPAIGN_NAME = 'The meaning of invincible';

function newToken(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

/**
 * This app hosts a single fixed campaign ("The meaning of invincible") shared by
 * one DM and one player — there is no campaign-creation flow. The row is created
 * lazily on first access (oldest campaign wins if several already exist, so we
 * stay stable across restarts). Callers get its tokens to drive the existing
 * token-based state/polling machinery without exposing them in the URL.
 */
export async function getOrCreateSingletonCampaign(): Promise<Campaign> {
  // Match by name so leftover test campaigns can't be mistaken for the real one.
  const [existing] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.name, CAMPAIGN_NAME))
    .orderBy(campaigns.id)
    .limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(campaigns)
    .values({
      name: CAMPAIGN_NAME,
      status: 'setup',
      dmToken: newToken(),
      playerToken: newToken(),
    })
    .returning();
  return created;
}
