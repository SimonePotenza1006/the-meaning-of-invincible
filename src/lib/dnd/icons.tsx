import type { IconType } from 'react-icons';
import {
  // races
  GiDwarfFace,
  GiElfHelmet,
  GiElfEar,
  GiOrcHead,
  GiPerson,
  GiBadGnome,
  GiDragonHead,
  GiDevilMask,
  GiHobbitDoor,
  // classes
  GiBarbarian,
  GiLyre,
  GiHolySymbol,
  GiOak,
  GiSwordman,
  GiMonkFace,
  GiWingedSword,
  GiBowman,
  GiHood,
  GiFireSpellCast,
  GiWarlockHood,
  GiWizardFace,
  // misc / backgrounds
  GiDiceTwentyFacesTwenty,
  GiScrollUnfurled,
  GiCampfire,
  GiBackpack,
  GiHolyGrail,
} from 'react-icons/gi';

// Icons from the Game-Icons set (via react-icons). Approximations where no exact
// match exists (e.g. halfling → hobbit door); swap freely by editing this map.
export const ICONS: Record<string, IconType> = {
  // races
  dwarf: GiDwarfFace,
  elf: GiElfHelmet,
  'half-elf': GiElfEar,
  'half-orc': GiOrcHead,
  human: GiPerson,
  gnome: GiBadGnome,
  dragonborn: GiDragonHead,
  tiefling: GiDevilMask,
  halfling: GiHobbitDoor,
  // classes
  barbarian: GiBarbarian,
  bard: GiLyre,
  cleric: GiHolySymbol,
  druid: GiOak,
  fighter: GiSwordman,
  monk: GiMonkFace,
  paladin: GiWingedSword,
  ranger: GiBowman,
  rogue: GiHood,
  sorcerer: GiFireSpellCast,
  warlock: GiWarlockHood,
  wizard: GiWizardFace,
  // misc / backgrounds
  dice: GiDiceTwentyFacesTwenty,
  scroll: GiScrollUnfurled,
  acolyte: GiHolyGrail,
  folk: GiCampfire,
  custom: GiBackpack,
};

export function getIcon(key: string): IconType {
  return ICONS[key] ?? GiScrollUnfurled;
}
