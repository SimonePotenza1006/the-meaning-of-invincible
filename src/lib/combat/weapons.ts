import weaponsData from '@/data/weapons.json';
import { type Ability, formatMod, modifier } from '@/lib/rules';
import type { Attack, CharacterSheet } from '@/lib/sheet';

// SRD weapons (bundled — only 37, small enough for the client). Names and
// damage types are localized to Italian; mechanics come from the data.

export interface Weapon {
  index: string;
  name: string;
  damage: string; // e.g. "1d8 Slashing"
  damage_2h: string; // versatile two-handed damage, if any
  properties: string[];
  cost: string;
  weight: number | null;
  range: string;
  throw_range: string;
}

export const WEAPONS = weaponsData as Weapon[];

export const WEAPON_NAMES_IT: Record<string, string> = {
  battleaxe: 'Ascia da battaglia',
  blowgun: 'Cerbottana',
  club: 'Clava',
  'crossbow-hand': 'Balestra a mano',
  'crossbow-heavy': 'Balestra pesante',
  'crossbow-light': 'Balestra leggera',
  dagger: 'Pugnale',
  dart: 'Dardo',
  flail: 'Mazzafrusto',
  glaive: 'Glaive',
  greataxe: 'Ascia bipenne',
  greatclub: 'Randello',
  greatsword: 'Spadone',
  halberd: 'Alabarda',
  handaxe: 'Accetta',
  javelin: 'Giavellotto',
  lance: 'Lancia da carica',
  'light-hammer': 'Martello leggero',
  longbow: 'Arco lungo',
  longsword: 'Spada lunga',
  mace: 'Mazza',
  maul: 'Maglio',
  morningstar: 'Mazza chiodata',
  net: 'Rete',
  pike: 'Picca',
  quarterstaff: 'Bastone ferrato',
  rapier: 'Stocco',
  scimitar: 'Scimitarra',
  shortbow: 'Arco corto',
  shortsword: 'Spada corta',
  sickle: 'Falcetto',
  sling: 'Fionda',
  spear: 'Lancia',
  trident: 'Tridente',
  'war-pick': 'Piccone da guerra',
  warhammer: 'Martello da guerra',
  whip: 'Frusta',
};

const DAMAGE_TYPE_IT: Record<string, string> = {
  Slashing: 'taglienti',
  Piercing: 'perforanti',
  Bludgeoning: 'contundenti',
};

export const WEAPON_PROPERTY_IT: Record<string, string> = {
  Versatile: 'Versatile',
  Ammunition: 'Munizioni',
  Loading: 'Ricarica',
  Light: 'Leggera',
  Monk: 'Monaco',
  Heavy: 'Pesante',
  'Two-Handed': 'A due mani',
  Finesse: 'Accurata',
  Thrown: 'Da lancio',
  Reach: 'Portata',
  Special: 'Speciale',
};

export function weaponName(w: Weapon): string {
  return WEAPON_NAMES_IT[w.index] ?? w.name;
}

export function getWeapon(index: string): Weapon | undefined {
  return WEAPONS.find((w) => w.index === index);
}

export function isVersatile(w: Weapon): boolean {
  return !!w.damage_2h;
}

function isRanged(w: Weapon): boolean {
  return w.properties.includes('Ammunition');
}

/** Which ability governs a weapon's attack, given the current scores. */
export function weaponAbility(w: Weapon, sheet: CharacterSheet): Ability {
  if (isRanged(w)) return 'DEX';
  if (w.properties.includes('Finesse')) {
    return modifier(sheet.abilities.STR) >= modifier(sheet.abilities.DEX) ? 'STR' : 'DEX';
  }
  return 'STR';
}

export interface ResolvedAttack {
  label: string;
  ability?: Ability;
  attackMod: number;
  attackLabel: string; // e.g. "+5"
  damage: string; // e.g. "1d8+3" or "" if none
  damageType: string; // localized, e.g. "taglienti"
  properties: string[]; // localized
}

/** Compute a weapon attack live from the current sheet (never stale). */
export function resolveAttack(a: Attack, sheet: CharacterSheet): ResolvedAttack {
  if (a.weaponIndex) {
    const w = getWeapon(a.weaponIndex);
    if (w) {
      const ability = weaponAbility(w, sheet);
      const mod = modifier(sheet.abilities[ability]);
      const prof = a.proficient === false ? 0 : sheet.proficiencies.proficiencyBonus;
      const attackMod = mod + prof;
      const dmgStr = a.twoHanded && w.damage_2h ? w.damage_2h : w.damage;
      let damage = '';
      let damageType = '';
      if (dmgStr) {
        const [dice, type] = dmgStr.split(' ');
        damage = mod > 0 ? `${dice}+${mod}` : mod < 0 ? `${dice}${mod}` : dice;
        damageType = DAMAGE_TYPE_IT[type] ?? type ?? '';
      }
      return {
        label: weaponName(w),
        ability,
        attackMod,
        attackLabel: formatMod(attackMod),
        damage,
        damageType,
        properties: w.properties.map((p) => WEAPON_PROPERTY_IT[p] ?? p),
      };
    }
  }
  // Free-form / custom attack: use stored strings.
  const parsed = a.attackBonus ? parseInt(a.attackBonus, 10) : 0;
  const attackMod = Number.isFinite(parsed) ? parsed : 0;
  return {
    label: a.name,
    attackMod,
    attackLabel: formatMod(attackMod),
    damage: a.damage ?? '',
    damageType: a.damageType ?? '',
    properties: [],
  };
}
