'use client';

import { rollInitiative } from '@/app/combat-actions';
import { Panel, cn } from '@/app/crea/ui';
import { SceneHeader } from './SceneHeader';
import {
  currentCombatantId,
  hpBand,
  orderByInitiative,
  sideColor,
} from '@/lib/combat/util';
import type { CampaignState } from '@/lib/game/repo';

// Player-facing initiative tracker. Enemy HP is shown as a band, not numbers.
export function CombatTracker({
  token,
  state,
  refresh,
}: {
  token: string;
  state: CampaignState;
  refresh: () => void;
}) {
  const enc = state.encounter;
  if (!enc || enc.status !== 'active') return null;

  const ordered = orderByInitiative(state.combatants);
  const currentId = currentCombatantId(enc, state.combatants);
  const pc = state.combatants.find((c) => c.side === 'player');
  const sheet = state.character?.sheet;
  const run = async (p: Promise<unknown>) => {
    try {
      await p;
    } finally {
      refresh();
    }
  };

  return (
    <div className="space-y-3">
      <SceneHeader terrainKey={enc.terrain} round={enc.round} encounter={enc.name} />
      <Panel title="Iniziativa">
      {pc && pc.initiative == null && (
        <button
          type="button"
          onClick={() => run(rollInitiative(token, pc.id))}
          className="mb-3 w-full rounded-lg bg-gold px-4 py-2.5 font-medium text-[color:var(--color-ink)] hover:brightness-110"
        >
          Tira iniziativa
        </button>
      )}

      <ul className="space-y-1.5">
        {ordered.map((c) => {
          const isPc = c.side === 'player';
          const active = c.id === currentId;
          let hp: React.ReactNode;
          if (isPc && sheet) {
            hp = `${sheet.combat.currentHp}/${sheet.combat.maxHp} PF`;
          } else if (c.side === 'ally') {
            hp = `${c.currentHp}/${c.maxHp} PF`;
          } else {
            const b = hpBand(c.currentHp ?? 0, c.maxHp ?? 0);
            hp = <span style={{ color: b.color }}>{b.label}</span>;
          }
          return (
            <li
              key={c.id}
              className={cn(
                'flex items-center justify-between rounded-lg border px-3 py-2',
                active ? 'border-gold bg-burgundy/30' : 'border-ink-border bg-ink-raised',
                c.defeated && 'opacity-50',
              )}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="w-7 shrink-0 text-center font-display text-gold">
                  {c.initiative ?? '—'}
                </span>
                <span style={{ color: sideColor(c.side) }} aria-hidden>
                  ●
                </span>
                <span className={cn('truncate text-parchment', active && 'font-semibold')}>
                  {c.name}
                  {isPc ? ' (tu)' : ''}
                </span>
              </div>
              <span className="shrink-0 text-sm text-parchment-dim">
                CA {c.ac ?? sheet?.combat.armorClass ?? '—'} · {hp}
              </span>
            </li>
          );
        })}
      </ul>
      </Panel>
    </div>
  );
}
