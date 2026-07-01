import { modifier, proficiencyBonus } from '@/lib/rules';
import {
  applyBonuses,
  baseScoresFromArray,
  getClass,
  getRace,
  getSubclass,
  racialBonuses,
} from '@/lib/dnd';
import { averageHitDie } from '@/lib/character/levelup';
import type { Npc } from '@/lib/game/types';

export interface NpcInput {
  name: string;
  raceKey: string;
  classKey: string;
  subclassKey?: string | null;
  level: number;
}

/**
 * Derive a lightweight NPC from the minimal choices the DM makes (name, race,
 * class, subclass, level). Ability scores use the class's suggested standard
 * array + racial bonuses; HP/AC/proficiency follow from there. No spells/attacks
 * — this is a memory aid, not a full sheet.
 */
export function buildNpc(
  input: NpcInput,
  opts?: { id?: string; currentHp?: number; notes?: string },
): Npc {
  const race = getRace(input.raceKey);
  const cls = getClass(input.classKey);
  if (!race || !cls) throw new Error('Razza o classe non valida per l’NPC.');
  const level = Math.max(1, Math.min(20, Math.floor(input.level) || 1));
  const sub = input.subclassKey ? getSubclass(cls.key, input.subclassKey) : undefined;

  const abilities = applyBonuses(baseScoresFromArray(cls), racialBonuses(race, undefined), {});
  const conMod = modifier(abilities.CON);
  const dexMod = modifier(abilities.DEX);
  const hitDie = cls.hitDie;
  const maxHp =
    Math.max(1, hitDie + conMod) + (level - 1) * Math.max(1, averageHitDie(hitDie) + conMod);

  return {
    id: opts?.id ?? crypto.randomUUID(),
    name: input.name.trim() || 'PNG senza nome',
    raceKey: race.key,
    race: race.name,
    classKey: cls.key,
    className: cls.name,
    subclassKey: sub?.key,
    subclass: sub?.name,
    level,
    abilities,
    maxHp,
    currentHp: opts?.currentHp != null ? Math.min(Math.max(0, opts.currentHp), maxHp) : maxHp,
    armorClass: 10 + dexMod,
    speed: race.speed,
    proficiencyBonus: proficiencyBonus(level),
    hitDie,
    savingThrows: cls.savingThrows,
    notes: opts?.notes?.trim() || undefined,
  };
}
