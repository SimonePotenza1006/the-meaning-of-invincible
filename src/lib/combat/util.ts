import type { Combatant, Encounter } from '@/db';

export const MONSTER_TYPE_LABELS: Record<string, string> = {
  aberration: 'Aberrazione',
  beast: 'Bestia',
  celestial: 'Celestiale',
  construct: 'Costrutto',
  dragon: 'Drago',
  elemental: 'Elementale',
  fey: 'Folletto',
  fiend: 'Immondo',
  giant: 'Gigante',
  humanoid: 'Umanoide',
  monstrosity: 'Mostruosità',
  ooze: 'Melma',
  plant: 'Pianta',
  undead: 'Non morto',
};

export function typeLabel(type: string): string {
  return MONSTER_TYPE_LABELS[type] ?? type;
}

/** Format a challenge rating (handles 1/8, 1/4, 1/2). */
export function crLabel(cr?: number): string {
  if (cr == null) return '—';
  if (cr === 0.125) return '1/8';
  if (cr === 0.25) return '1/4';
  if (cr === 0.5) return '1/2';
  return String(cr);
}

export interface HpBand {
  label: string;
  color: string;
}

/** Health as a band, for hiding exact enemy HP from the player. */
export function hpBand(current: number, max: number): HpBand {
  if (current <= 0) return { label: 'Sconfitto', color: 'var(--color-parchment-dim)' };
  if (max <= 0) return { label: 'Sconosciuto', color: 'var(--color-parchment-dim)' };
  const pct = current / max;
  if (pct >= 1) return { label: 'Illeso', color: 'var(--color-ochre)' };
  if (pct > 0.5) return { label: 'Ferito', color: 'var(--color-ochre)' };
  if (pct > 0.25) return { label: 'Gravemente ferito', color: 'var(--color-paprika)' };
  return { label: 'Morente', color: 'var(--color-flag-red)' };
}

export function sideColor(side: string): string {
  if (side === 'player') return 'var(--color-gold)';
  if (side === 'ally') return 'var(--color-ochre)';
  return 'var(--color-flag-red)';
}

export function sideLabel(side: string): string {
  if (side === 'player') return 'Giocatore';
  if (side === 'ally') return 'Alleato';
  return 'Nemico';
}

/** Initiative order (highest first); un-rolled combatants sink to the bottom. */
export function orderByInitiative(list: Combatant[]): Combatant[] {
  return list.slice().sort((a, b) => {
    const ai = a.initiative ?? -999;
    const bi = b.initiative ?? -999;
    return bi - ai || b.initMod - a.initMod || a.id - b.id;
  });
}

/** Which combatant's turn it is (only those with rolled initiative count). */
export function currentCombatantId(enc: Encounter | null, list: Combatant[]): number | null {
  if (!enc || enc.status !== 'active') return null;
  const withInit = orderByInitiative(list).filter((c) => c.initiative != null);
  if (withInit.length === 0) return null;
  return withInit[enc.turnIndex % withInit.length]?.id ?? null;
}

/** Rough difficulty for a single level-1 character (SRD DMG thresholds). */
export function difficultyLabel(totalEnemyXp: number): string {
  if (totalEnemyXp <= 0) return '—';
  if (totalEnemyXp < 25) return 'Banale';
  if (totalEnemyXp < 50) return 'Facile';
  if (totalEnemyXp < 75) return 'Media';
  if (totalEnemyXp < 100) return 'Impegnativa';
  return 'Mortale';
}
