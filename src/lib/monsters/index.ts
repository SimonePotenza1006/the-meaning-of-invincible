import 'server-only';
import monstersData from '@/data/monsters.json';

// SRD 5.1 bestiary (334 monsters), bundled so the app stays self-contained.
export interface Monster {
  name: string;
  index: string;
  description: string;
  cr: number;
  xp: number;
  size: string;
  type: string;
  hp: number;
  hp_dice: string;
  ac: number;
  speed: string;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  alignment: string;
  languages: string;
}

const MONSTERS = monstersData as unknown as Monster[];

export interface MonsterSummary {
  index: string;
  name: string;
  cr: number;
  xp: number;
  type: string;
  size: string;
  hp: number;
  ac: number;
}

function summarize(m: Monster): MonsterSummary {
  return {
    index: m.index,
    name: m.name,
    cr: m.cr,
    xp: m.xp,
    type: m.type,
    size: m.size,
    hp: m.hp,
    ac: m.ac,
  };
}

export function searchMonsters({
  query,
  type,
  crMax,
}: {
  query?: string;
  type?: string;
  crMax?: number;
}): MonsterSummary[] {
  let list = MONSTERS;
  if (query) {
    const q = query.toLowerCase();
    list = list.filter((m) => m.name.toLowerCase().includes(q));
  }
  if (type) list = list.filter((m) => m.type === type);
  if (crMax !== undefined && !Number.isNaN(crMax)) list = list.filter((m) => m.cr <= crMax);
  return list
    .slice()
    .sort((a, b) => a.cr - b.cr || a.name.localeCompare(b.name))
    .slice(0, 80)
    .map(summarize);
}

export function getMonster(index: string): Monster | undefined {
  return MONSTERS.find((m) => m.index === index);
}

export function monsterTypes(): string[] {
  return [...new Set(MONSTERS.map((m) => m.type))].sort();
}
