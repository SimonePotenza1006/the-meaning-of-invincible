import { ABILITY_SHORT } from '@/lib/dnd';
import type { CharacterSheet, MagicItem, MagicItemEffect } from '@/lib/sheet';

// Custom magic items. Stat bonuses are applied directly to the sheet when the
// item is equipped and reverted when unequipped/removed (so derived rolls, AC,
// HP and speed reflect them without a separate bonus layer). Granted spells and
// features live on the item itself and are shown/used from its card.

function clampScore(n: number): number {
  return Math.max(1, Math.min(30, n));
}

/** Apply (sign +1) or revert (sign -1) an item's stat bonuses on the sheet. */
export function applyItemStats(sheet: CharacterSheet, item: MagicItem, sign: 1 | -1): void {
  for (const e of item.effects) {
    const bonus = (e.bonus ?? 0) * sign;
    if (!bonus) continue;
    switch (e.kind) {
      case 'ability':
        if (e.ability) sheet.abilities[e.ability] = clampScore(sheet.abilities[e.ability] + bonus);
        break;
      case 'ac':
        sheet.combat.armorClass += bonus;
        break;
      case 'maxHp':
        sheet.combat.maxHp = Math.max(1, sheet.combat.maxHp + bonus);
        sheet.combat.currentHp = Math.max(0, sheet.combat.currentHp + bonus);
        break;
      case 'speed':
        sheet.combat.speed = Math.max(0, sheet.combat.speed + bonus);
        break;
      default:
        break; // spell / feature: no stat change
    }
  }
}

/** Short human label for an effect, shown as a chip on the item card. */
export function effectLabel(e: MagicItemEffect): string {
  const sign = (e.bonus ?? 0) >= 0 ? '+' : '';
  switch (e.kind) {
    case 'ability':
      return `${sign}${e.bonus} ${e.ability ? ABILITY_SHORT[e.ability] : ''}`.trim();
    case 'ac':
      return `${sign}${e.bonus} CA`;
    case 'maxHp':
      return `${sign}${e.bonus} PF max`;
    case 'speed':
      return `${sign}${e.bonus} m velocità`;
    case 'spell':
      return `Incantesimo: ${e.spellName ?? '—'}`;
    case 'feature':
      return `Privilegio: ${e.featureName ?? '—'}`;
    default:
      return '';
  }
}
