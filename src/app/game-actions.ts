'use server';

import { desc, eq, or } from 'drizzle-orm';
import { campaigns, characters, db, events } from '@/db';
import { characterSheetSchema, type CharacterSheet } from '@/lib/sheet';
import { type Ability, modifier } from '@/lib/rules';
import {
  applyAsi,
  assignSubclass,
  averageHitDie,
  levelUpDeterministic,
  mergePending,
} from '@/lib/character/levelup';
import { getWeapon, weaponName } from '@/lib/combat/weapons';
import { spellActionCost } from '@/lib/spells';
import { buildNpc, type NpcInput } from '@/lib/character/npc';
import { applyItemStats } from '@/lib/character/items';
import type { MagicItem, MagicItemEffect } from '@/lib/sheet';
import type { SaveResult } from '@/lib/game/types';

function token(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

async function findByToken(tok: string) {
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(or(eq(campaigns.dmToken, tok), eq(campaigns.playerToken, tok)));
  if (!campaign) return null;
  const role: 'dm' | 'player' = campaign.dmToken === tok ? 'dm' : 'player';
  return { campaign, role };
}

async function currentCharacter(campaignId: number) {
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.campaignId, campaignId))
    .orderBy(desc(characters.id))
    .limit(1);
  return character ?? null;
}

type MutationResult =
  | { kind: string; message: string; data?: unknown; actor?: 'dm' | 'player' | 'system' }
  | void;

/** Load the character, apply a mutation to a cloned sheet, persist, log. */
async function mutate(
  tok: string,
  apply: (sheet: CharacterSheet) => MutationResult,
  opts?: { dmOnly?: boolean },
) {
  const found = await findByToken(tok);
  if (!found) throw new Error('Campagna non trovata.');
  if (opts?.dmOnly && found.role !== 'dm') {
    throw new Error('Solo il DM può gestire l’inventario.');
  }
  const character = await currentCharacter(found.campaign.id);
  if (!character?.sheet) throw new Error('Nessun personaggio da modificare.');

  const sheet = structuredClone(character.sheet) as CharacterSheet;
  const result = apply(sheet);

  await db
    .update(characters)
    .set({ sheet, name: sheet.identity.name, level: sheet.identity.level })
    .where(eq(characters.id, character.id));

  if (result) {
    await db.insert(events).values({
      campaignId: found.campaign.id,
      actor: result.actor ?? found.role,
      kind: result.kind,
      message: result.message,
      data: (result.data as object) ?? null,
    });
  }
  return { ok: true };
}

// ─── DM: campaign lifecycle ───────────────────────────────────────────────
export async function createCampaign(name: string): Promise<SaveResult> {
  const [c] = await db
    .insert(campaigns)
    .values({
      name: name?.trim() || 'Nuova campagna',
      ruleset: '2014',
      status: 'setup',
      dmToken: token(),
      playerToken: token(),
    })
    .returning();
  return { campaignId: c.id, characterId: 0, playerToken: c.playerToken, dmToken: c.dmToken };
}

// ─── Player: attach the created character to the campaign ─────────────────
export async function saveCharacterForCampaign(
  playerToken: string,
  rawSheet: unknown,
): Promise<SaveResult> {
  const sheet = characterSheetSchema.parse(rawSheet);
  const found = await findByToken(playerToken);
  if (!found || found.role !== 'player') throw new Error('Link giocatore non valido.');
  const { campaign } = found;

  const existing = await currentCharacter(campaign.id);
  const values = {
    name: sheet.identity.name,
    race: sheet.identity.race,
    className: sheet.identity.className,
    level: sheet.identity.level,
    status: 'active',
    creationStep: 99,
    sheet,
  };

  let characterId: number;
  if (existing) {
    await db.update(characters).set(values).where(eq(characters.id, existing.id));
    characterId = existing.id;
  } else {
    const [c] = await db
      .insert(characters)
      .values({ campaignId: campaign.id, ...values })
      .returning();
    characterId = c.id;
  }

  await db.update(campaigns).set({ status: 'active' }).where(eq(campaigns.id, campaign.id));
  await db.insert(events).values({
    campaignId: campaign.id,
    actor: 'player',
    kind: 'system',
    message: `${sheet.identity.name || 'Un eroe'} entra in scena: ${sheet.identity.race} ${sheet.identity.className} di livello ${sheet.identity.level}.`,
  });

  return {
    campaignId: campaign.id,
    characterId,
    playerToken: campaign.playerToken,
    dmToken: campaign.dmToken,
  };
}

// ─── Shared: HP / temp HP / conditions / death saves / hit dice / slots ───
export async function changeHp(tok: string, delta: number) {
  return mutate(tok, (s) => {
    const c = s.combat;
    if (delta >= 0) {
      c.currentHp = Math.min(c.maxHp, c.currentHp + delta);
      return { kind: 'hp', message: `Cura +${delta} PF → ${c.currentHp}/${c.maxHp}.` };
    }
    let dmg = -delta;
    const fromTemp = Math.min(c.tempHp, dmg);
    c.tempHp -= fromTemp;
    dmg -= fromTemp;
    c.currentHp = Math.max(0, c.currentHp - dmg);
    return {
      kind: 'hp',
      message: `Danno ${-delta} PF → ${c.currentHp}/${c.maxHp}${fromTemp ? ` (${fromTemp} assorbiti dai PF temp)` : ''}.`,
    };
  });
}

export async function setTempHp(tok: string, value: number) {
  return mutate(tok, (s) => {
    s.combat.tempHp = Math.max(0, Math.floor(value));
    return { kind: 'hp', message: `PF temporanei impostati a ${s.combat.tempHp}.` };
  });
}

// Only the DM assigns/removes conditions; the player just receives them.
export async function toggleCondition(tok: string, condition: string) {
  return mutate(
    tok,
    (s) => {
      const set = new Set(s.conditions);
      const had = set.has(condition);
      if (had) set.delete(condition);
      else set.add(condition);
      s.conditions = [...set];
      return {
        kind: 'condition',
        message: had ? `Rimossa condizione: ${condition}.` : `Applicata condizione: ${condition}.`,
      };
    },
    { dmOnly: true },
  );
}

export async function setDeathSaves(tok: string, successes: number, failures: number) {
  return mutate(tok, (s) => {
    s.combat.deathSaves = { successes: clamp(successes, 0, 3), failures: clamp(failures, 0, 3) };
    const d = s.combat.deathSaves;
    return { kind: 'hp', message: `TS contro morte: ${d.successes}✓ / ${d.failures}✗.` };
  });
}

export async function spendHitDie(tok: string) {
  return mutate(tok, (s) => {
    if (s.combat.hitDiceRemaining <= 0) {
      return { kind: 'note', message: 'Nessun dado vita disponibile.' };
    }
    const conMod = Math.floor((s.abilities.CON - 10) / 2);
    const roll = Math.floor(Math.random() * s.combat.hitDieSize) + 1;
    const heal = Math.max(0, roll + conMod);
    s.combat.hitDiceRemaining -= 1;
    s.combat.currentHp = Math.min(s.combat.maxHp, s.combat.currentHp + heal);
    return {
      kind: 'hp',
      message: `Dado vita d${s.combat.hitDieSize}(${roll}) ${conMod >= 0 ? '+' : ''}${conMod} = +${heal} PF → ${s.combat.currentHp}/${s.combat.maxHp}.`,
    };
  });
}

export async function updateSpellSlot(tok: string, level: number, delta: number) {
  return mutate(tok, (s) => {
    if (!s.spellcasting) return;
    const slot = s.spellcasting.slots.find((x) => x.level === level);
    if (!slot) return;
    slot.used = clamp(slot.used + delta, 0, slot.total);
    return { kind: 'note', message: `Slot di livello ${level}: ${slot.used}/${slot.total} usati.` };
  });
}

// ─── DM: XP ───────────────────────────────────────────────────────────────
export async function grantXp(dmToken: string, amount: number) {
  return mutate(dmToken, (s) => {
    s.identity.xp = Math.max(0, s.identity.xp + amount);
    return {
      kind: 'xp',
      actor: 'dm',
      message: `${amount >= 0 ? '+' : ''}${amount} PE → totale ${s.identity.xp}.`,
    };
  });
}

// ─── Attacks (weapons) ─────────────────────────────────────────────────────
export async function addWeaponAttack(
  tok: string,
  weaponIndex: string,
  opts?: { proficient?: boolean; twoHanded?: boolean },
) {
  return mutate(tok, (s) => {
    const w = getWeapon(weaponIndex);
    if (!w) return { kind: 'note', message: 'Arma non trovata.' };
    s.attacks.push({
      name: weaponName(w),
      weaponIndex,
      proficient: opts?.proficient ?? true,
      twoHanded: opts?.twoHanded ?? false,
    });
    return { kind: 'note', message: `Arma aggiunta: ${weaponName(w)}.` };
  });
}

export async function removeAttack(tok: string, index: number) {
  return mutate(tok, (s) => {
    const removed = s.attacks[index];
    if (!removed) return;
    s.attacks.splice(index, 1);
    return { kind: 'note', message: `Attacco rimosso: ${removed.name}.` };
  });
}

// ─── Spells (client passes the localized {index,name,level} from /api/spells) ─
type SpellRef = { index: string; name: string; level: number };

export async function learnSpell(tok: string, spell: SpellRef) {
  return mutate(tok, (s) => {
    if (!s.spellcasting) return { kind: 'note', message: 'Questo personaggio non lancia incantesimi.' };
    const bucket = spell.level === 0 ? s.spellcasting.cantrips : s.spellcasting.known;
    if (bucket.some((x) => x.index === spell.index)) return;
    bucket.push({ index: spell.index, name: spell.name, level: spell.level, action: spellActionCost(spell.index) });
    return {
      kind: 'spell',
      message: spell.level === 0 ? `Nuovo trucchetto: ${spell.name}.` : `Impara ${spell.name} (liv ${spell.level}).`,
    };
  });
}

export async function forgetSpell(tok: string, index: string) {
  return mutate(tok, (s) => {
    if (!s.spellcasting) return;
    const sc = s.spellcasting;
    const before = sc.cantrips.length + sc.known.length;
    sc.cantrips = sc.cantrips.filter((x) => x.index !== index);
    sc.known = sc.known.filter((x) => x.index !== index);
    sc.prepared = sc.prepared.filter((i) => i !== index);
    if (sc.cantrips.length + sc.known.length === before) return;
    return { kind: 'spell', message: 'Incantesimo dimenticato.' };
  });
}

export async function togglePreparedSpell(tok: string, index: string) {
  return mutate(tok, (s) => {
    if (!s.spellcasting) return;
    const sc = s.spellcasting;
    if (!sc.known.some((x) => x.index === index)) return;
    const set = new Set(sc.prepared);
    const nowPrepared = !set.has(index);
    if (nowPrepared) set.add(index);
    else set.delete(index);
    sc.prepared = [...set];
    return { kind: 'spell', message: nowPrepared ? 'Incantesimo preparato.' : 'Incantesimo non più preparato.' };
  });
}

export async function castSpell(tok: string, spell: SpellRef) {
  return mutate(tok, (s) => {
    if (spell.level === 0) return { kind: 'spell', message: `Lancia ${spell.name} (trucchetto).` };
    if (!s.spellcasting) return;
    const tier = s.spellcasting.slots
      .filter((x) => x.level >= spell.level && x.used < x.total)
      .sort((a, b) => a.level - b.level)[0];
    if (!tier) return { kind: 'spell', message: `Nessuno slot disponibile per ${spell.name}.` };
    tier.used += 1;
    return {
      kind: 'spell',
      message: `Lancia ${spell.name} (slot di liv ${tier.level}: ${tier.used}/${tier.total}).`,
    };
  });
}

// ─── Magic items (DM creates; stat bonuses apply while equipped) ────────────
export interface MagicItemInput {
  name: string;
  description?: string;
  rarity?: string;
  attunement?: boolean;
  consumable?: boolean;
  charges?: { current: number; max: number };
  effects: MagicItemEffect[];
}

// ─── Inventory: only the DM adds/removes/equips items on the player's sheet ──
export async function addMagicItem(tok: string, input: MagicItemInput) {
  return mutate(
    tok,
    (s) => {
      const item: MagicItem = {
        id: crypto.randomUUID(),
        name: input.name?.trim() || 'Oggetto magico',
        description: input.description?.trim() || undefined,
        rarity: input.rarity || undefined,
        attunement: !!input.attunement,
        consumable: !!input.consumable,
        equipped: true,
        charges: input.charges && input.charges.max > 0 ? input.charges : undefined,
        effects: input.effects ?? [],
      };
      s.equipment.magicItems.push(item);
      applyItemStats(s, item, 1);
      return { kind: 'item', actor: 'dm', message: `Nuovo oggetto magico: ${item.name}.` };
    },
    { dmOnly: true },
  );
}

// Assign a catalogue consumable (potion/scroll/…) straight onto the sheet as a
// consumable magic item. `quantity` seeds the charges (which act as a count);
// the player spends them via useMagicItem and the item vanishes at 0.
export interface ConsumableAssignInput {
  index: string;
  name: string;
  description?: string;
  rarity?: string;
  quantity: number;
  /** For spell scrolls: the (already localized) spell bound to the scroll. */
  spell?: { index: string; name: string; level: number };
}

export async function assignConsumable(tok: string, input: ConsumableAssignInput) {
  return mutate(
    tok,
    (s) => {
      const qty = Math.max(1, Math.min(99, Math.floor(input.quantity) || 1));
      const bound = input.spell;
      // A bound spell turns the item into a castable scroll (a `spell` effect
      // is what the player-facing card renders as "Lancia").
      const effects: MagicItemEffect[] = bound
        ? [{ kind: 'spell', spellIndex: bound.index, spellName: bound.name, spellLevel: bound.level }]
        : [];
      const name = bound
        ? `${input.name?.trim() || 'Pergamena'}: ${bound.name}`
        : input.name?.trim() || 'Consumabile';
      const item: MagicItem = {
        id: crypto.randomUUID(),
        name,
        description: input.description?.trim() || undefined,
        rarity: input.rarity || undefined,
        attunement: false,
        consumable: true,
        equipped: true,
        charges: { current: qty, max: qty },
        effects,
      };
      s.equipment.magicItems.push(item);
      return {
        kind: 'item',
        actor: 'dm',
        message: `Consegnato al PG: ${item.name}${qty > 1 ? ` ×${qty}` : ''}.`,
      };
    },
    { dmOnly: true },
  );
}

export async function removeMagicItem(tok: string, id: string) {
  return mutate(
    tok,
    (s) => {
      const idx = s.equipment.magicItems.findIndex((i) => i.id === id);
      if (idx < 0) return;
      const item = s.equipment.magicItems[idx];
      if (item.equipped) applyItemStats(s, item, -1);
      s.equipment.magicItems.splice(idx, 1);
      return { kind: 'item', message: `Oggetto rimosso: ${item.name}.` };
    },
    { dmOnly: true },
  );
}

export async function setMagicItemEquipped(tok: string, id: string, equipped: boolean) {
  return mutate(
    tok,
    (s) => {
      const item = s.equipment.magicItems.find((i) => i.id === id);
      if (!item || item.equipped === equipped) return;
      item.equipped = equipped;
      applyItemStats(s, item, equipped ? 1 : -1);
      return { kind: 'item', message: `${item.name}: ${equipped ? 'equipaggiato' : 'riposto'}.` };
    },
    { dmOnly: true },
  );
}

// Using an item is the one action the player may take. For a consumable the
// charge count is its quantity: when it hits 0 the item is spent and removed.
export async function useMagicItem(tok: string, id: string) {
  return mutate(tok, (s) => {
    const idx = s.equipment.magicItems.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const item = s.equipment.magicItems[idx];
    if (item.charges) {
      if (item.charges.current <= 0) return { kind: 'item', message: `${item.name}: esaurito.` };
      item.charges.current -= 1;
    }
    const spell = item.effects.find((e) => e.kind === 'spell');
    const what = spell?.spellName ? `lancia ${spell.spellName}` : 'utilizzato';

    if (item.consumable && item.charges && item.charges.current <= 0) {
      if (item.equipped) applyItemStats(s, item, -1);
      s.equipment.magicItems.splice(idx, 1);
      return { kind: 'item', message: `${item.name}: ${what}. Ultimo utilizzo — esaurito.` };
    }
    const qtyInfo = item.charges
      ? ` (${item.charges.current}/${item.charges.max}${item.consumable ? ' rimasti' : ' cariche'})`
      : '';
    return { kind: 'item', message: `${item.name}: ${what}.${qtyInfo}` };
  });
}

export async function rechargeMagicItem(tok: string, id: string) {
  return mutate(
    tok,
    (s) => {
      const item = s.equipment.magicItems.find((i) => i.id === id);
      if (!item?.charges) return;
      item.charges.current = item.charges.max;
      return { kind: 'item', message: `${item.name}: cariche ripristinate (${item.charges.max}).` };
    },
    { dmOnly: true },
  );
}

// ─── DM: instant level-up (player resolves the choices afterwards) ─────────
export async function levelUp(dmToken: string) {
  const found = await findByToken(dmToken);
  if (!found) throw new Error('Campagna non trovata.');
  if (found.role !== 'dm') throw new Error('Solo il DM può far salire di livello.');
  return mutate(dmToken, (s) => {
    if (s.identity.level >= 20) {
      return { kind: 'note', actor: 'dm', message: 'Livello massimo (20) già raggiunto.' };
    }
    const pending = levelUpDeterministic(s);
    s.pendingLevelUp = mergePending(s.pendingLevelUp, pending);
    return {
      kind: 'levelup',
      actor: 'dm',
      message: `Sale al livello ${s.identity.level}! (+${pending.hpGain} PF) — il giocatore deve sistemare il nuovo livello.`,
    };
  });
}

// ─── Player: resolve the pending level-up ──────────────────────────────────
export async function rerollLevelUpHp(tok: string) {
  return mutate(tok, (s) => {
    const p = s.pendingLevelUp;
    if (!p) return;
    const conMod = modifier(s.abilities.CON);
    const die = Math.floor(Math.random() * s.combat.hitDieSize) + 1;
    const gain = Math.max(1, die + conMod);
    const delta = gain - p.hpGain;
    s.combat.maxHp += delta;
    s.combat.currentHp += delta;
    p.hpGain = gain;
    p.hpMode = 'rolled';
    const sign = conMod >= 0 ? '+' : '';
    return {
      kind: 'levelup',
      message: `PF del nuovo livello: d${s.combat.hitDieSize}(${die}) ${sign}${conMod} = ${gain} PF → max ${s.combat.maxHp}.`,
    };
  });
}

export async function useAverageLevelUpHp(tok: string) {
  return mutate(tok, (s) => {
    const p = s.pendingLevelUp;
    if (!p) return;
    const conMod = modifier(s.abilities.CON);
    const gain = Math.max(1, averageHitDie(s.combat.hitDieSize) + conMod);
    const delta = gain - p.hpGain;
    s.combat.maxHp += delta;
    s.combat.currentHp += delta;
    p.hpGain = gain;
    p.hpMode = 'average';
    return {
      kind: 'levelup',
      message: `PF del nuovo livello: media ${gain} → max ${s.combat.maxHp}.`,
    };
  });
}

export async function chooseLevelUpSubclass(tok: string, subclassKey: string) {
  return mutate(tok, (s) => {
    if (s.identity.subclassKey) {
      return { kind: 'note', message: 'La sottoclasse è già stata scelta.' };
    }
    if (!assignSubclass(s, subclassKey)) {
      return { kind: 'note', message: 'Sottoclasse non valida.' };
    }
    if (s.pendingLevelUp) s.pendingLevelUp.needsSubclass = false;
    return { kind: 'levelup', message: `Sottoclasse scelta: ${s.identity.subclass}.` };
  });
}

export async function applyLevelUpAsi(tok: string, picks: Partial<Record<Ability, number>>) {
  return mutate(tok, (s) => {
    const p = s.pendingLevelUp;
    if (!p?.needsAsi) return { kind: 'note', message: 'Nessun aumento di caratteristiche in sospeso.' };
    if (!applyAsi(s, picks)) {
      return { kind: 'note', message: 'Devi distribuire esattamente 2 punti.' };
    }
    p.needsAsi = false;
    const entries = (Object.entries(picks) as [Ability, number][]).filter(([, v]) => v > 0);
    const summary = entries.map(([a, v]) => `${a} +${v}`).join(', ');
    s.features.push({
      source: 'Aumento di livello',
      name: `Aumento dei punteggi di caratteristica (Liv ${p.level})`,
      description: summary,
    });
    return { kind: 'levelup', message: `Aumento caratteristiche: ${summary}.` };
  });
}

export async function addLevelUpFeature(tok: string, name: string, description: string) {
  return mutate(tok, (s) => {
    const clean = name.trim();
    if (!clean) return;
    s.features.push({
      source: 'Personalizzato',
      name: clean,
      description: description.trim() || undefined,
    });
    return { kind: 'levelup', message: `Nuovo tratto aggiunto: ${clean}.` };
  });
}

export async function finishLevelUp(tok: string) {
  return mutate(tok, (s) => {
    if (!s.pendingLevelUp) return;
    const level = s.pendingLevelUp.level;
    delete s.pendingLevelUp;
    return { kind: 'levelup', message: `Livello ${level} sistemato.` };
  });
}

// ─── DM: request a roll from the player ───────────────────────────────────
export async function requestRoll(
  dmToken: string,
  payload: { mode: string; key?: string; label: string; advantage?: boolean },
) {
  const found = await findByToken(dmToken);
  if (!found) throw new Error('Campagna non trovata.');
  await db.insert(events).values({
    campaignId: found.campaign.id,
    actor: 'dm',
    kind: 'request',
    message: `Richiesta di tiro: ${payload.label}`,
    data: { ...payload, status: 'pending' },
  });
  return { ok: true };
}

// ─── Either side: record a dice roll (rolled client-side via the rules engine) ─
export async function recordRoll(
  tok: string,
  payload: { label: string; detail: string; total: number; requestId?: number; secret?: boolean },
) {
  const found = await findByToken(tok);
  if (!found) throw new Error('Campagna non trovata.');
  // A secret roll is only ever the DM's; the player's log filters it out.
  const secret = !!payload.secret && found.role === 'dm';
  await db.insert(events).values({
    campaignId: found.campaign.id,
    actor: found.role,
    kind: 'roll',
    message: `${payload.label}: ${payload.detail} = ${payload.total}`,
    data: { ...payload, secret },
  });
  return { ok: true };
}

export async function addNote(tok: string, text: string) {
  const found = await findByToken(tok);
  if (!found) throw new Error('Campagna non trovata.');
  const clean = text.trim();
  if (!clean) return { ok: true };
  await db.insert(events).values({
    campaignId: found.campaign.id,
    actor: found.role,
    kind: 'note',
    message: clean,
  });
  return { ok: true };
}

// ─── Persistent notepads (not log entries) ────────────────────────────────
/** Player's private notepad, stored on the sheet. */
export async function savePlayerNotes(tok: string, text: string) {
  return mutate(tok, (s) => {
    s.notes = text.slice(0, 20000);
    return undefined; // silent save — no log spam
  });
}

/** DM's private notepad, stored on the campaign row. */
export async function saveDmNotes(dmToken: string, text: string) {
  const found = await findByToken(dmToken);
  if (!found) throw new Error('Campagna non trovata.');
  if (found.role !== 'dm') throw new Error('Solo il DM può salvare queste note.');
  await db
    .update(campaigns)
    .set({ dmNotes: text.slice(0, 40000) })
    .where(eq(campaigns.id, found.campaign.id));
  return { ok: true };
}

// ─── Heroic Inspiration (DM grants, player spends for advantage) ──────────
export async function setInspiration(dmToken: string, value: boolean) {
  return mutate(
    dmToken,
    (s) => {
      if (s.inspiration === value) return;
      s.inspiration = value;
      return {
        kind: 'note',
        actor: 'dm',
        message: value ? 'Il DM concede l’Ispirazione ✦' : 'Ispirazione rimossa.',
      };
    },
    { dmOnly: true },
  );
}

export async function spendInspiration(tok: string) {
  return mutate(tok, (s) => {
    if (!s.inspiration) return { kind: 'note', message: 'Nessuna Ispirazione da spendere.' };
    s.inspiration = false;
    return { kind: 'note', message: 'Spende l’Ispirazione: tira con vantaggio ✦' };
  });
}

// ─── NPC roster (DM-only, stored on the campaign row) ─────────────────────
async function requireDm(dmToken: string) {
  const found = await findByToken(dmToken);
  if (!found) throw new Error('Campagna non trovata.');
  if (found.role !== 'dm') throw new Error('Solo il DM può gestire gli NPC.');
  return found;
}

export async function addNpc(dmToken: string, input: NpcInput) {
  const found = await requireDm(dmToken);
  const npc = buildNpc(input);
  const npcs = [...(found.campaign.npcs ?? []), npc];
  await db.update(campaigns).set({ npcs }).where(eq(campaigns.id, found.campaign.id));
  return { ok: true };
}

export async function updateNpc(dmToken: string, id: string, input: NpcInput) {
  const found = await requireDm(dmToken);
  const list = found.campaign.npcs ?? [];
  const prev = list.find((n) => n.id === id);
  if (!prev) throw new Error('NPC non trovato.');
  const rebuilt = buildNpc(input, { id, currentHp: prev.currentHp, notes: prev.notes });
  const npcs = list.map((n) => (n.id === id ? rebuilt : n));
  await db.update(campaigns).set({ npcs }).where(eq(campaigns.id, found.campaign.id));
  return { ok: true };
}

/** Adjust an NPC's current HP (and, optionally, its notes) without a full rebuild. */
export async function patchNpc(
  dmToken: string,
  id: string,
  patch: { currentHp?: number; notes?: string },
) {
  const found = await requireDm(dmToken);
  const list = found.campaign.npcs ?? [];
  const npcs = list.map((n) =>
    n.id === id
      ? {
          ...n,
          currentHp:
            patch.currentHp != null ? Math.max(0, Math.min(patch.currentHp, n.maxHp)) : n.currentHp,
          notes: patch.notes != null ? patch.notes.trim() || undefined : n.notes,
        }
      : n,
  );
  await db.update(campaigns).set({ npcs }).where(eq(campaigns.id, found.campaign.id));
  return { ok: true };
}

export async function removeNpc(dmToken: string, id: string) {
  const found = await requireDm(dmToken);
  const npcs = (found.campaign.npcs ?? []).filter((n) => n.id !== id);
  await db.update(campaigns).set({ npcs }).where(eq(campaigns.id, found.campaign.id));
  return { ok: true };
}
