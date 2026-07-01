import { type Ability, modifier, SKILLS } from '@/lib/rules';
import type { CharacterSheet } from '@/lib/sheet';

// Read modifiers straight off a stored sheet (client-safe).

export function abilityMod(sheet: CharacterSheet, a: Ability): number {
  return modifier(sheet.abilities[a]);
}

export function saveMod(sheet: CharacterSheet, a: Ability): number {
  const prof = sheet.proficiencies.savingThrows.includes(a)
    ? sheet.proficiencies.proficiencyBonus
    : 0;
  return modifier(sheet.abilities[a]) + prof;
}

export function skillMod(sheet: CharacterSheet, skill: string): number {
  const ability = SKILLS[skill] as Ability;
  const prof = sheet.proficiencies.skills.includes(skill)
    ? sheet.proficiencies.proficiencyBonus
    : 0;
  return modifier(sheet.abilities[ability]) + prof;
}

export function initiativeMod(sheet: CharacterSheet): number {
  return modifier(sheet.abilities.DEX);
}
