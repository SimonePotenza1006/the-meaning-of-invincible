export interface MonsterAttack {
  name: string;
  toHit: number;
  /** Dice expression usable by the roller, e.g. "1d6+2". */
  damage: string;
  damageType?: string;
}

// SRD statblock prose is English and regular, e.g.:
//   "Action — Scimitar: Melee Weapon Attack: +4 to hit, reach 5 ft., one
//    target. Hit: 5 (1d6 + 2) slashing damage."
// Grab each attack's name, its "+N to hit", and the "(XdY + Z)" damage. Lines
// without a to-hit (save-based breath weapons, etc.) are intentionally skipped —
// the DM can still use the manual roller for those.
const ATTACK_RE =
  /Action\s*[—–-]\s*([^:]+?):\s*[\s\S]*?([+-]\d+)\s*to hit[\s\S]*?\((\d*d\d+(?:\s*[+-]\s*\d+)?)\)\s*([A-Za-zàèéìòù]+)/gi;

export function parseMonsterAttacks(description?: string | null): MonsterAttack[] {
  if (!description) return [];
  const out: MonsterAttack[] = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  ATTACK_RE.lastIndex = 0;
  while ((m = ATTACK_RE.exec(description)) !== null && out.length < 6) {
    const name = m[1].trim().replace(/\s*\([^)]*\)\s*$/, ''); // drop trailing "(Recharge …)"
    const toHit = parseInt(m[2], 10) || 0;
    const damage = m[3].replace(/\s+/g, '');
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ name, toHit, damage, damageType: m[4]?.trim() });
  }
  return out;
}
