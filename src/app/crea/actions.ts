'use server';

import { campaigns, characters, db, events } from '@/db';
import { characterSheetSchema } from '@/lib/sheet';
import type { SaveResult } from '@/lib/game/types';

function token(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

/**
 * Persist a freshly-created character. Creates a standalone campaign for it and
 * stores the validated sheet as an active character. (When the DM-side campaign
 * flow lands, this will instead attach to an existing campaign by token.)
 */
export async function saveNewCharacter(rawSheet: unknown): Promise<SaveResult> {
  const sheet = characterSheetSchema.parse(rawSheet);
  const heroName = sheet.identity.name || 'un eroe senza nome';

  const [campaign] = await db
    .insert(campaigns)
    .values({
      name: `Campagna di ${heroName}`,
      ruleset: sheet.ruleset,
      status: 'active',
      dmToken: token(),
      playerToken: token(),
    })
    .returning();

  const [character] = await db
    .insert(characters)
    .values({
      campaignId: campaign.id,
      name: sheet.identity.name,
      race: sheet.identity.race,
      className: sheet.identity.className,
      level: sheet.identity.level,
      status: 'active',
      creationStep: 99,
      sheet,
    })
    .returning();

  await db.insert(events).values({
    campaignId: campaign.id,
    actor: 'player',
    kind: 'system',
    message: `${heroName} entra in scena: ${sheet.identity.race} ${sheet.identity.className} di livello ${sheet.identity.level}.`,
  });

  return {
    campaignId: campaign.id,
    characterId: character.id,
    playerToken: campaign.playerToken,
    dmToken: campaign.dmToken,
  };
}
