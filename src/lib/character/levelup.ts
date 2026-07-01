import {
  type Ability,
  asiLevels,
  CASTER_ABILITY,
  casterType,
  modifier,
  proficiencyBonus,
  spellSlotsFor,
  XP_THRESHOLDS,
} from '@/lib/rules';
import {
  classByName,
  classFeaturesAt,
  getSubclass,
  getSubclasses,
  subclassFeaturesAt,
  subclassFeaturesUpTo,
  subclassMeta,
} from '@/lib/dnd';
import type { CharacterSheet, PendingLevelUp } from '@/lib/sheet';

/** Resolve the stable class key from a sheet (new sheets store it; old ones fall back to the name). */
export function resolveClassKey(sheet: CharacterSheet): string {
  return sheet.identity.classKey ?? classByName(sheet.identity.className)?.key ?? '';
}

/** Fixed "take the average" HP for a hit die: d6→4, d8→5, d10→6, d12→7. */
export function averageHitDie(size: number): number {
  return Math.floor(size / 2) + 1;
}

/**
 * Rebuild the spellcasting block for the sheet's current class/level, preserving
 * expended slots. Creates the block for half-casters (paladin/ranger) that only
 * start casting at level 2, and refreshes the save DC / attack bonus.
 */
export function recomputeSpellcasting(sheet: CharacterSheet, classKey: string): void {
  if (casterType(classKey) === 'none') return;
  const target = spellSlotsFor(classKey, sheet.identity.level);
  if (target.length === 0) return;

  if (!sheet.spellcasting) {
    sheet.spellcasting = {
      ability: CASTER_ABILITY[classKey],
      slots: [],
      cantrips: [],
      known: [],
      prepared: [],
    };
  }
  const ability = sheet.spellcasting.ability ?? CASTER_ABILITY[classKey];
  if (ability) {
    const mod = modifier(sheet.abilities[ability]);
    sheet.spellcasting.ability = ability;
    sheet.spellcasting.spellSaveDc = 8 + sheet.proficiencies.proficiencyBonus + mod;
    sheet.spellcasting.spellAttackBonus = sheet.proficiencies.proficiencyBonus + mod;
  }

  const prev = new Map(sheet.spellcasting.slots.map((s) => [s.level, s]));
  sheet.spellcasting.slots = target.map((t) => {
    const old = prev.get(t.level);
    return { level: t.level, total: t.total, used: old ? Math.min(old.used, t.total) : 0 };
  });
}

/**
 * Apply the deterministic parts of gaining a level to the sheet, in place:
 * bump level, proficiency bonus, hit dice, HP (average), features gained at the
 * new level, and spell slots. Returns what the player still has to resolve.
 */
export function levelUpDeterministic(sheet: CharacterSheet): PendingLevelUp {
  const classKey = resolveClassKey(sheet);
  const newLevel = Math.min(20, sheet.identity.level + 1);
  sheet.identity.level = newLevel;

  // Keep XP consistent with the (possibly instant) new level.
  const threshold = XP_THRESHOLDS[newLevel] ?? sheet.identity.xp;
  sheet.identity.xp = Math.max(sheet.identity.xp, threshold);

  sheet.proficiencies.proficiencyBonus = proficiencyBonus(newLevel);

  sheet.combat.hitDiceTotal += 1;
  sheet.combat.hitDiceRemaining += 1;

  const conMod = modifier(sheet.abilities.CON);
  const hpGain = Math.max(1, averageHitDie(sheet.combat.hitDieSize) + conMod);
  sheet.combat.maxHp += hpGain;
  sheet.combat.currentHp += hpGain;

  // Base-class features gained at this level.
  for (const t of classFeaturesAt(classKey, newLevel)) {
    sheet.features.push({ source: sheet.identity.className, name: t.name, description: t.description });
  }
  // Subclass features, if a subclass is already chosen.
  if (sheet.identity.subclassKey) {
    for (const f of subclassFeaturesAt(classKey, sheet.identity.subclassKey, newLevel)) {
      sheet.features.push({
        source: sheet.identity.subclass ?? 'Sottoclasse',
        name: f.name,
        description: f.description,
      });
    }
  }

  recomputeSpellcasting(sheet, classKey);

  const subclassAt = subclassMeta(classKey)?.level;
  const needsAsi = asiLevels(classKey).includes(newLevel);
  const needsSubclass =
    subclassAt != null &&
    newLevel >= subclassAt &&
    !sheet.identity.subclassKey &&
    getSubclasses(classKey).length > 0;

  return { level: newLevel, hpGain, hpMode: 'average', needsAsi, needsSubclass };
}

/**
 * Assign a chosen subclass, adding all its features up to the current level.
 * Returns false if the subclass key is invalid for the class.
 */
export function assignSubclass(sheet: CharacterSheet, subclassKey: string): boolean {
  const classKey = resolveClassKey(sheet);
  const sc = getSubclass(classKey, subclassKey);
  if (!sc) return false;
  sheet.identity.subclass = sc.name;
  sheet.identity.subclassKey = sc.key;
  for (const f of subclassFeaturesUpTo(classKey, sc.key, sheet.identity.level)) {
    sheet.features.push({ source: sc.name, name: f.name, description: f.description });
  }
  return true;
}

/**
 * Apply an Ability Score Improvement (total of +2 spread over one or two abilities).
 * Bumps max/current HP retroactively if the Constitution modifier increased.
 */
export function applyAsi(sheet: CharacterSheet, picks: Partial<Record<Ability, number>>): boolean {
  const entries = (Object.entries(picks) as [Ability, number][]).filter(([, v]) => v > 0);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  if (total !== 2) return false;

  const conBefore = modifier(sheet.abilities.CON);
  for (const [ab, v] of entries) {
    sheet.abilities[ab] = Math.min(20, sheet.abilities[ab] + v);
  }
  const conAfter = modifier(sheet.abilities.CON);
  if (conAfter > conBefore) {
    const delta = (conAfter - conBefore) * sheet.identity.level;
    sheet.combat.maxHp += delta;
    sheet.combat.currentHp += delta;
  }
  // A caster's DC/attack may depend on the boosted ability.
  recomputeSpellcasting(sheet, resolveClassKey(sheet));
  return true;
}

/** Merge a fresh pending level-up onto any unresolved one (DM leveled more than once). */
export function mergePending(
  prev: PendingLevelUp | undefined,
  next: PendingLevelUp,
): PendingLevelUp {
  if (!prev) return next;
  return {
    level: next.level,
    hpGain: next.hpGain,
    hpMode: next.hpMode,
    needsAsi: prev.needsAsi || next.needsAsi,
    needsSubclass: prev.needsSubclass || next.needsSubclass,
  };
}
