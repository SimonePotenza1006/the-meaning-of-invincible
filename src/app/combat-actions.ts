'use server';

import { and, desc, eq, isNull, ne, or } from 'drizzle-orm';
import { campaigns, characters, combatants, db, encounters, events } from '@/db';
import type { CharacterSheet } from '@/lib/sheet';
import { getMonster, itMonsterName } from '@/lib/monsters';

function d20(): number {
  return Math.floor(Math.random() * 20) + 1;
}
function mod(score: number): number {
  return Math.floor((score - 10) / 2);
}
function sign(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

async function findByToken(tok: string) {
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(or(eq(campaigns.dmToken, tok), eq(campaigns.playerToken, tok)));
  if (!campaign) throw new Error('Campagna non trovata.');
  const role: 'dm' | 'player' = campaign.dmToken === tok ? 'dm' : 'player';
  return { campaign, role };
}

async function requireDm(tok: string) {
  const found = await findByToken(tok);
  if (found.role !== 'dm') throw new Error('Solo il DM può eseguire questa azione.');
  return found;
}

async function activeEncounter(campaignId: number) {
  const [enc] = await db
    .select()
    .from(encounters)
    .where(and(eq(encounters.campaignId, campaignId), ne(encounters.status, 'ended')))
    .orderBy(desc(encounters.id))
    .limit(1);
  return enc ?? null;
}

async function activeCharacter(campaignId: number) {
  const [ch] = await db
    .select()
    .from(characters)
    .where(eq(characters.campaignId, campaignId))
    .orderBy(desc(characters.id))
    .limit(1);
  return ch ?? null;
}

async function log(
  campaignId: number,
  actor: 'dm' | 'player' | 'system',
  kind: string,
  message: string,
) {
  await db.insert(events).values({ campaignId, actor, kind, message });
}

// ─── Encounter building ───────────────────────────────────────────────────
export async function createEncounter(dmToken: string, name: string, terrain: string) {
  const { campaign } = await requireDm(dmToken);
  const [enc] = await db
    .insert(encounters)
    .values({
      campaignId: campaign.id,
      name: name?.trim() || 'Incontro',
      terrain: terrain || 'plains',
      status: 'draft',
    })
    .returning();

  const ch = await activeCharacter(campaign.id);
  if (ch?.sheet) {
    await db.insert(combatants).values({
      encounterId: enc.id,
      name: ch.sheet.identity.name || 'Personaggio',
      side: 'player',
      sourceType: 'character',
      characterId: ch.id,
      maxHp: ch.sheet.combat.maxHp,
      currentHp: ch.sheet.combat.currentHp,
      ac: ch.sheet.combat.armorClass,
      initMod: mod(ch.sheet.abilities.DEX),
      sortIndex: 0,
    });
  }
  await log(campaign.id, 'dm', 'note', `Incontro preparato: ${enc.name}.`);
  return { encounterId: enc.id };
}

export async function setTerrain(dmToken: string, terrain: string) {
  const { campaign } = await requireDm(dmToken);
  const enc = await activeEncounter(campaign.id);
  if (!enc) return { ok: true };
  await db.update(encounters).set({ terrain }).where(eq(encounters.id, enc.id));
  return { ok: true };
}

export async function addMonsterCombatant(
  dmToken: string,
  monsterIndex: string,
  side: 'enemy' | 'ally',
  count: number,
) {
  const { campaign } = await requireDm(dmToken);
  const enc = await activeEncounter(campaign.id);
  if (!enc) throw new Error('Nessun incontro in preparazione.');
  const m = getMonster(monsterIndex);
  if (!m) throw new Error('Mostro non trovato.');

  const existing = await db
    .select()
    .from(combatants)
    .where(eq(combatants.encounterId, enc.id));
  const alreadyOfKind = existing.filter((c) => c.monsterIndex === monsterIndex).length;
  const n = Math.min(Math.max(count, 1), 12);

  const rows = Array.from({ length: n }, (_, i) => ({
    encounterId: enc.id,
    name: `${itMonsterName(m.index, m.name)} ${alreadyOfKind + i + 1}`,
    side,
    sourceType: 'monster',
    monsterIndex,
    maxHp: m.hp,
    currentHp: m.hp,
    ac: m.ac,
    initMod: mod(m.dex),
    statblock: {
      index: m.index,
      type: m.type,
      size: m.size,
      cr: m.cr,
      xp: m.xp,
      speed: m.speed,
      description: m.description,
      abilities: { str: m.str, dex: m.dex, con: m.con, int: m.int, wis: m.wis, cha: m.cha },
    },
    sortIndex: existing.length + i + 1,
  }));
  await db.insert(combatants).values(rows);
  await log(
    campaign.id,
    'dm',
    'note',
    `Aggiunti ${n}× ${itMonsterName(m.index, m.name)} (${side === 'enemy' ? 'nemici' : 'alleati'}).`,
  );
  return { ok: true };
}

export async function addCustomCombatant(
  dmToken: string,
  input: { name: string; side: 'enemy' | 'ally'; maxHp: number; ac: number; initMod: number },
) {
  const { campaign } = await requireDm(dmToken);
  const enc = await activeEncounter(campaign.id);
  if (!enc) throw new Error('Nessun incontro in preparazione.');
  const existing = await db
    .select({ id: combatants.id })
    .from(combatants)
    .where(eq(combatants.encounterId, enc.id));
  const hp = Math.max(1, Math.floor(input.maxHp || 1));
  await db.insert(combatants).values({
    encounterId: enc.id,
    name: input.name?.trim() || 'PNG',
    side: input.side,
    sourceType: 'custom',
    maxHp: hp,
    currentHp: hp,
    ac: Math.floor(input.ac || 10),
    initMod: Math.floor(input.initMod || 0),
    sortIndex: existing.length + 1,
  });
  await log(campaign.id, 'dm', 'note', `Aggiunto ${input.name || 'PNG'} (${input.side === 'enemy' ? 'nemico' : 'alleato'}).`);
  return { ok: true };
}

export async function removeCombatant(dmToken: string, combatantId: number) {
  await requireDm(dmToken);
  await db.delete(combatants).where(eq(combatants.id, combatantId));
  return { ok: true };
}

export async function startEncounter(dmToken: string) {
  const { campaign } = await requireDm(dmToken);
  const enc = await activeEncounter(campaign.id);
  if (!enc) throw new Error('Nessun incontro da avviare.');
  await db
    .update(encounters)
    .set({ status: 'active', round: 1, turnIndex: 0 })
    .where(eq(encounters.id, enc.id));
  await log(campaign.id, 'dm', 'note', `Combattimento iniziato: ${enc.name}.`);
  return { ok: true };
}

// ─── Initiative ─────────────────────────────────────────────────────────────
export async function rollInitiative(tok: string, combatantId: number) {
  const { campaign, role } = await findByToken(tok);
  const [c] = await db.select().from(combatants).where(eq(combatants.id, combatantId));
  if (!c) throw new Error('Combattente non trovato.');
  const enc = await activeEncounter(campaign.id);
  if (!enc || c.encounterId !== enc.id) throw new Error('Combattente non valido.');
  if (role === 'player' && c.side !== 'player') {
    throw new Error('Puoi tirare l’iniziativa solo per il tuo personaggio.');
  }
  const roll = d20();
  const total = roll + c.initMod;
  await db.update(combatants).set({ initiative: total }).where(eq(combatants.id, c.id));
  await log(campaign.id, role, 'roll', `Iniziativa ${c.name}: d20(${roll}) ${sign(c.initMod)} = ${total}`);
  return { ok: true, total };
}

export async function rollNpcInitiative(dmToken: string) {
  const { campaign } = await requireDm(dmToken);
  const enc = await activeEncounter(campaign.id);
  if (!enc) throw new Error('Nessun incontro attivo.');
  const rows = await db
    .select()
    .from(combatants)
    .where(and(eq(combatants.encounterId, enc.id), ne(combatants.side, 'player'), isNull(combatants.initiative)));
  for (const c of rows) {
    await db.update(combatants).set({ initiative: d20() + c.initMod }).where(eq(combatants.id, c.id));
  }
  await log(campaign.id, 'dm', 'note', `Iniziativa tirata per ${rows.length} combattenti non giocanti.`);
  return { ok: true, rolled: rows.length };
}

async function advanceTurn(dmToken: string, dir: 1 | -1) {
  const { campaign } = await requireDm(dmToken);
  const enc = await activeEncounter(campaign.id);
  if (!enc) throw new Error('Nessun incontro attivo.');
  const order = (await db.select().from(combatants).where(eq(combatants.encounterId, enc.id)))
    .filter((c) => c.initiative != null)
    .sort((a, b) => b.initiative! - a.initiative! || b.initMod - a.initMod);
  if (order.length === 0) return { ok: true };

  let idx = enc.turnIndex + dir;
  let round = enc.round || 1;
  if (dir > 0 && idx >= order.length) {
    idx = 0;
    round += 1;
  } else if (dir < 0 && idx < 0) {
    idx = order.length - 1;
    round = Math.max(1, round - 1);
  }
  await db.update(encounters).set({ turnIndex: idx, round }).where(eq(encounters.id, enc.id));
  await log(campaign.id, 'dm', 'note', `Round ${round} · turno di ${order[idx].name}.`);
  return { ok: true };
}

export async function nextTurn(dmToken: string) {
  return advanceTurn(dmToken, 1);
}
export async function prevTurn(dmToken: string) {
  return advanceTurn(dmToken, -1);
}

// ─── In-combat mutations ─────────────────────────────────────────────────────
export async function damageCombatant(tok: string, combatantId: number, delta: number) {
  const { campaign, role } = await findByToken(tok);
  const [c] = await db.select().from(combatants).where(eq(combatants.id, combatantId));
  if (!c) throw new Error('Combattente non trovato.');

  // Player character HP lives on the sheet — route damage there.
  if (c.sourceType === 'character' && c.characterId) {
    const [ch] = await db.select().from(characters).where(eq(characters.id, c.characterId));
    if (ch?.sheet) {
      const s = structuredClone(ch.sheet) as CharacterSheet;
      const combat = s.combat;
      if (delta >= 0) {
        combat.currentHp = Math.min(combat.maxHp, combat.currentHp + delta);
      } else {
        let dmg = -delta;
        const fromTemp = Math.min(combat.tempHp, dmg);
        combat.tempHp -= fromTemp;
        dmg -= fromTemp;
        combat.currentHp = Math.max(0, combat.currentHp - dmg);
      }
      await db.update(characters).set({ sheet: s }).where(eq(characters.id, ch.id));
      await log(
        campaign.id,
        role,
        'hp',
        `${c.name}: ${delta < 0 ? `subisce ${-delta}` : `recupera ${delta}`} PF → ${combat.currentHp}/${combat.maxHp}.`,
      );
    }
    return { ok: true };
  }

  const max = c.maxHp ?? 0;
  const cur = Math.max(0, Math.min(max, (c.currentHp ?? 0) + delta));
  const defeated = cur <= 0;
  await db.update(combatants).set({ currentHp: cur, defeated }).where(eq(combatants.id, c.id));
  await log(
    campaign.id,
    role,
    'hp',
    `${c.name}: ${delta < 0 ? `subisce ${-delta}` : `recupera ${delta}`} PF${defeated ? ' — sconfitto!' : ` → ${cur}/${max}`}.`,
  );
  return { ok: true };
}

export async function toggleCombatantCondition(dmToken: string, combatantId: number, condition: string) {
  await requireDm(dmToken);
  const [c] = await db.select().from(combatants).where(eq(combatants.id, combatantId));
  if (!c) throw new Error('Combattente non trovato.');
  const set = new Set(c.conditions ?? []);
  if (set.has(condition)) set.delete(condition);
  else set.add(condition);
  await db.update(combatants).set({ conditions: [...set] }).where(eq(combatants.id, c.id));
  return { ok: true };
}

export async function endEncounter(dmToken: string) {
  const { campaign } = await requireDm(dmToken);
  const enc = await activeEncounter(campaign.id);
  if (!enc) return { ok: true };
  const cs = await db.select().from(combatants).where(eq(combatants.encounterId, enc.id));
  const xp = cs
    .filter((c) => c.side === 'enemy' && c.defeated)
    .reduce((sum, c) => sum + (c.statblock?.xp ?? 0), 0);

  await db.update(encounters).set({ status: 'ended' }).where(eq(encounters.id, enc.id));

  if (xp > 0) {
    const ch = await activeCharacter(campaign.id);
    if (ch?.sheet) {
      const s = structuredClone(ch.sheet) as CharacterSheet;
      s.identity.xp = Math.max(0, s.identity.xp + xp);
      await db.update(characters).set({ sheet: s }).where(eq(characters.id, ch.id));
    }
  }
  await log(campaign.id, 'dm', 'xp', `Combattimento concluso: ${enc.name}. PE guadagnati: ${xp}.`);
  return { ok: true, xp };
}
