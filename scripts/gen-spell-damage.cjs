// Extracts a client-safe spell-damage table from src/data/spells.json.
// Run from dnd-web/:  node scripts/gen-spell-damage.cjs
// Regenerate whenever spells.json changes. Output: src/lib/spells/damage.ts
const fs = require('fs');
const path = require('path');

const spells = require(path.join(__dirname, '../src/data/spells.json'));

const TYPE_IT = {
  acid: 'acido',
  bludgeoning: 'contundente',
  cold: 'freddo',
  fire: 'fuoco',
  force: 'forza',
  lightning: 'fulmine',
  necrotic: 'necrotico',
  piercing: 'perforante',
  poison: 'veleno',
  psychic: 'psichico',
  radiant: 'radioso',
  slashing: 'tagliente',
  thunder: 'tuono',
};

const SAVE_IT = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA',
};

const damageRe = /(\d+)d(\d+)\s+(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\s+damage/i;
const attackRe = /(ranged|melee)\s+spell\s+attack/i;
const saveRe = /(strength|dexterity|constitution|intelligence|wisdom|charisma)\s+saving\s+throw/i;

const out = {};
for (const s of spells) {
  const text = `${s.description || ''}\n${s.higher_level || ''}`;
  const dm = damageRe.exec(text);
  if (!dm) continue; // no rollable damage dice — skip (healing, utility, fixed damage…)
  const count = Number(dm[1]);
  const die = Number(dm[2]);
  const type = TYPE_IT[dm[3].toLowerCase()];
  const entry = { dice: `${count}d${die}`, count, die, type, cantrip: s.level === 0 };
  const am = attackRe.exec(text);
  const sm = saveRe.exec(text);
  if (am) entry.attack = am[1].toLowerCase();
  else if (sm) entry.save = SAVE_IT[sm[1].toLowerCase()];
  out[s.index] = entry;
}

const keys = Object.keys(out).sort();
const lines = keys.map((k) => {
  const e = out[k];
  const parts = [`dice: '${e.dice}'`, `count: ${e.count}`, `die: ${e.die}`, `type: '${e.type}'`];
  if (e.attack) parts.push(`attack: '${e.attack}'`);
  if (e.save) parts.push(`save: '${e.save}'`);
  parts.push(`cantrip: ${e.cantrip}`);
  return `  '${k}': { ${parts.join(', ')} },`;
});

const header = `// AUTO-GENERATED from src/data/spells.json — do not edit by hand.
// Regenerate with: node scripts/gen-spell-damage.cjs
// Client-safe (no server-only data): imported directly by SpellsPanel.
import type { Ability } from '@/lib/rules';

export interface SpellDamage {
  /** Base damage dice at the spell's lowest slot, e.g. "1d10". */
  dice: string;
  /** Number of dice (base). Cantrips scale this with character level. */
  count: number;
  /** Die size, e.g. 10 for d10. */
  die: number;
  /** Localized damage type, e.g. "fuoco". */
  type: string;
  /** Set when the spell uses a spell attack roll. */
  attack?: 'ranged' | 'melee';
  /** Set when the spell forces a saving throw instead of an attack. */
  save?: Ability;
  /** True for cantrips (level 0): damage scales at levels 5/11/17. */
  cantrip: boolean;
}

/** How many times a cantrip's dice are rolled at a given character level. */
export function cantripMultiplier(charLevel: number): number {
  if (charLevel >= 17) return 4;
  if (charLevel >= 11) return 3;
  if (charLevel >= 5) return 2;
  return 1;
}

/** Damage formula to roll for a spell, applying cantrip scaling. */
export function spellDamageFormula(d: SpellDamage, charLevel: number): string {
  const n = d.cantrip ? d.count * cantripMultiplier(charLevel) : d.count;
  return \`\${n}d\${d.die}\`;
}

export const SPELL_DAMAGE: Record<string, SpellDamage> = {
`;

fs.writeFileSync(
  path.join(__dirname, '../src/lib/spells/damage.ts'),
  header + lines.join('\n') + '\n};\n',
);
console.log(`Wrote ${keys.length} damaging spells (${keys.filter((k) => out[k].cantrip).length} cantrips).`);
