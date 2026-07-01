'use client';

import { useMemo, useState } from 'react';
import { WEAPONS, isVersatile, resolveAttack, weaponName } from '@/lib/combat/weapons';
import { performDice, performRoll, type Adv } from '@/lib/game/roll';
import { addWeaponAttack, removeAttack } from '@/app/game-actions';
import { Panel, cn } from '@/app/crea/ui';
import { ActionGlyph, ActionLegend } from '@/components/action-cost';
import type { CharacterSheet } from '@/lib/sheet';

export function AttacksPanel({
  token,
  sheet,
  refresh,
  adv = 'normal',
}: {
  token: string;
  sheet: CharacterSheet;
  refresh: () => void;
  adv?: Adv;
}) {
  const [open, setOpen] = useState(false);
  const run = async (p: Promise<unknown>) => {
    try {
      await p;
    } finally {
      refresh();
    }
  };

  const attacks = sheet.attacks ?? [];

  return (
    <Panel title="Attacchi">
      {attacks.length === 0 && (
        <p className="mb-3 text-sm text-parchment-dim">Nessun attacco. Aggiungi un&rsquo;arma qui sotto.</p>
      )}
      {attacks.length > 0 && <ActionLegend className="mb-2" />}
      <ul className="space-y-2">
        {attacks.map((a, i) => {
          const r = resolveAttack(a, sheet);
          return (
            <li
              key={`${a.weaponIndex ?? a.name}-${i}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-ink-border bg-ink-raised px-3 py-2"
            >
              <div className="min-w-0">
                <span className="flex items-center gap-1.5 truncate text-parchment">
                  <ActionGlyph cost="action" className="shrink-0" />
                  {r.label}
                </span>
                <span className="text-xs text-parchment-dim">
                  {r.damage ? `${r.damage} ${r.damageType}` : 'senza danni'}
                  {a.twoHanded ? ' · a due mani' : ''}
                  {a.proficient === false ? ' · non competente' : ''}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => run(performRoll(token, `${r.label} (attacco)`, r.attackMod, adv))}
                  className="rounded-md border border-gold/60 px-2.5 py-1 text-sm font-medium text-parchment hover:border-gold"
                >
                  {r.attackLabel}
                </button>
                {r.damage && (
                  <button
                    type="button"
                    onClick={() => run(performDice(token, r.damage))}
                    className="rounded-md border border-ochre/60 px-2.5 py-1 text-sm text-parchment hover:border-ochre"
                  >
                    Danni
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Rimuovi attacco"
                  onClick={() => run(removeAttack(token, i))}
                  className="rounded-md border border-ink-border px-2 py-1 text-sm text-parchment-dim hover:border-flag-red hover:text-flag-red"
                >
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {open ? (
        <WeaponAdder
          onAdd={(idx, opts) => {
            run(addWeaponAttack(token, idx, opts));
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 w-full rounded-md border border-dashed border-ink-border px-3 py-2 text-sm text-parchment-dim hover:border-ochre hover:text-parchment"
        >
          + Aggiungi un&rsquo;arma
        </button>
      )}
    </Panel>
  );
}

function WeaponAdder({
  onAdd,
  onCancel,
}: {
  onAdd: (index: string, opts: { proficient: boolean; twoHanded: boolean }) => void;
  onCancel: () => void;
}) {
  const sorted = useMemo(
    () => [...WEAPONS].sort((a, b) => weaponName(a).localeCompare(weaponName(b), 'it')),
    [],
  );
  const [index, setIndex] = useState(sorted[0]?.index ?? '');
  const [proficient, setProficient] = useState(true);
  const [twoHanded, setTwoHanded] = useState(false);
  const weapon = sorted.find((w) => w.index === index);
  const versatile = weapon ? isVersatile(weapon) : false;
  const selectClass =
    'w-full rounded-lg border border-ink-border bg-[color:var(--color-ink)] px-3 py-2 text-sm text-parchment focus:border-gold focus:outline-none';

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-ink-border bg-ink-raised/70 p-3">
      <select value={index} onChange={(e) => setIndex(e.target.value)} className={selectClass}>
        {sorted.map((w) => (
          <option key={w.index} value={w.index}>
            {weaponName(w)} ({w.damage_2h && !w.damage ? w.damage_2h : w.damage || '—'})
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-3 text-sm text-parchment">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={proficient} onChange={(e) => setProficient(e.target.checked)} />
          Competente
        </label>
        {versatile && (
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={twoHanded} onChange={(e) => setTwoHanded(e.target.checked)} />
            A due mani
          </label>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-ink-border px-3 py-1.5 text-sm text-parchment-dim hover:border-ochre"
        >
          Annulla
        </button>
        <button
          type="button"
          onClick={() => onAdd(index, { proficient, twoHanded: versatile && twoHanded })}
          className={cn(
            'flex-1 rounded-md bg-gold px-3 py-1.5 text-sm font-medium text-[color:var(--color-ink)] hover:brightness-110',
          )}
        >
          Aggiungi
        </button>
      </div>
    </div>
  );
}
