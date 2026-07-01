'use client';

import { getTerrain } from '@/lib/dnd';

// Per-terrain atmosphere: an emblem and a dark gradient wash behind the header.
const SCENE: Record<string, { emoji: string; from: string; to: string }> = {
  forest: { emoji: '🌲', from: '#14301a', to: '#0a1a0d' },
  dungeon: { emoji: '🏰', from: '#241a2e', to: '#0f0b16' },
  cave: { emoji: '🕯️', from: '#241f18', to: '#0e0b08' },
  swamp: { emoji: '🐸', from: '#1d2a17', to: '#0c130a' },
  mountain: { emoji: '⛰️', from: '#2a2620', to: '#12100d' },
  plains: { emoji: '🌾', from: '#33280f', to: '#161206' },
  city: { emoji: '🏘️', from: '#251b1b', to: '#120c0c' },
  desert: { emoji: '🏜️', from: '#3a2a10', to: '#181206' },
  coast: { emoji: '🌊', from: '#123033', to: '#081619' },
  indoor: { emoji: '🍺', from: '#2c1d12', to: '#140d08' },
};

const DEFAULT = { emoji: '⚔️', from: '#2a1016', to: '#12060a' };

/**
 * Dynamic scene banner shown during an active encounter: the combat locality
 * (terrain) with its flavour text, plus the round. Same look for player and DM.
 */
export function SceneHeader({
  terrainKey,
  round,
  encounter,
}: {
  terrainKey: string;
  round?: number;
  encounter?: string;
}) {
  const t = getTerrain(terrainKey);
  const fx = SCENE[terrainKey] ?? DEFAULT;

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-ink-border p-4"
      style={{ backgroundImage: `linear-gradient(135deg, ${fx.from}, ${fx.to})` }}
    >
      <span
        className="pointer-events-none absolute -right-3 -top-2 select-none text-7xl opacity-20"
        aria-hidden
      >
        {fx.emoji}
      </span>
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.25em] text-gold">
          In scena{round != null ? ` · Round ${round}` : ''}
        </p>
        <h2 className="mt-0.5 font-display text-xl leading-tight text-parchment">
          {t?.name ?? 'Luogo sconosciuto'}
        </h2>
        {encounter && <p className="text-sm text-ochre">{encounter}</p>}
        {t?.description && <p className="mt-1 text-sm text-parchment-dim">{t.description}</p>}
      </div>
    </div>
  );
}
