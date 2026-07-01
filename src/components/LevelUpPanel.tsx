'use client';

import { useState } from 'react';
import { ABILITIES, type Ability } from '@/lib/rules';
import { ABILITY_LABELS, getSubclasses, subclassMeta } from '@/lib/dnd';
import { resolveClassKey } from '@/lib/character/levelup';
import {
  addLevelUpFeature,
  applyLevelUpAsi,
  chooseLevelUpSubclass,
  finishLevelUp,
  rerollLevelUpHp,
  useAverageLevelUpHp,
} from '@/app/game-actions';
import { cn } from '@/app/crea/ui';
import type { CharacterSheet } from '@/lib/sheet';

export function LevelUpPanel({
  token,
  sheet,
  refresh,
}: {
  token: string;
  sheet: CharacterSheet;
  refresh: () => void;
}) {
  const p = sheet.pendingLevelUp;
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
      refresh();
    }
  };

  if (!p) return null;

  const classKey = resolveClassKey(sheet);
  const meta = subclassMeta(classKey);
  const subclasses = getSubclasses(classKey);

  return (
    <section className="rounded-xl border-2 border-gold bg-burgundy/40 p-4 shadow-[0_10px_30px_-14px_var(--color-gold)]">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg" aria-hidden>
          ✦
        </span>
        <h2 className="font-display text-xl text-parchment">Sei salito al livello {p.level}!</h2>
      </div>
      <p className="mb-4 text-sm text-parchment-dim">
        Sistema il tuo nuovo livello come preferisci, poi conferma.
      </p>

      <div className="space-y-4">
        {/* HP for the new level */}
        <div className="rounded-lg border border-ink-border bg-ink-raised/70 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-parchment">
              Punti Ferita del livello:{' '}
              <span className="font-semibold text-gold">+{p.hpGain}</span>{' '}
              <span className="text-xs text-parchment-dim">
                ({p.hpMode === 'rolled' ? 'tirato' : 'media'})
              </span>
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => useAverageLevelUpHp(token))}
              className="flex-1 rounded-md border border-ink-border px-3 py-1.5 text-sm text-parchment hover:border-gold disabled:opacity-50"
            >
              Usa la media
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => rerollLevelUpHp(token))}
              className="flex-1 rounded-md border border-ochre/60 px-3 py-1.5 text-sm text-parchment hover:border-ochre disabled:opacity-50"
            >
              Tira il dado
            </button>
          </div>
        </div>

        {/* Subclass choice */}
        {p.needsSubclass && subclasses.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ochre">
              Scegli: {meta?.label ?? 'Sottoclasse'}
            </p>
            <div className="space-y-2">
              {subclasses.map((sc) => (
                <button
                  key={sc.key}
                  type="button"
                  disabled={busy}
                  onClick={() => run(() => chooseLevelUpSubclass(token, sc.key))}
                  className="w-full rounded-lg border border-ink-border bg-ink-raised p-3 text-left transition-colors hover:border-gold disabled:opacity-50"
                >
                  <span className="block font-display text-parchment">{sc.name}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-parchment-dim">
                    {sc.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ability Score Improvement */}
        {p.needsAsi && <AsiPicker sheet={sheet} busy={busy} onApply={(picks) => run(() => applyLevelUpAsi(token, picks))} />}

        {/* Free-form feature */}
        <ManualFeature busy={busy} onAdd={(name, desc) => run(() => addLevelUpFeature(token, name, desc))} />

        <button
          type="button"
          disabled={busy}
          onClick={() => run(() => finishLevelUp(token))}
          className="w-full rounded-xl bg-gold px-5 py-3 font-medium text-[color:var(--color-ink)] transition-all hover:brightness-110 disabled:opacity-60"
        >
          Ho finito · conferma il livello
        </button>
      </div>
    </section>
  );
}

function AsiPicker({
  sheet,
  busy,
  onApply,
}: {
  sheet: CharacterSheet;
  busy: boolean;
  onApply: (picks: Partial<Record<Ability, number>>) => void;
}) {
  const [mode, setMode] = useState<'one' | 'two'>('two');
  const [picks, setPicks] = useState<Ability[]>([]);

  function toggle(a: Ability) {
    const max = mode === 'one' ? 1 : 2;
    setPicks((cur) =>
      cur.includes(a) ? cur.filter((x) => x !== a) : cur.length >= max ? cur : [...cur, a],
    );
  }
  function changeMode(m: 'one' | 'two') {
    setMode(m);
    setPicks([]);
  }
  const ready = mode === 'one' ? picks.length === 1 : picks.length === 2;

  return (
    <div className="rounded-lg border border-ink-border bg-ink-raised/70 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ochre">
        Aumento dei punteggi di caratteristica
      </p>
      <div className="mb-3 flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => changeMode('two')}
          className={cn(
            'flex-1 rounded-md border px-2 py-1.5',
            mode === 'two' ? 'border-gold text-parchment' : 'border-ink-border text-parchment-dim',
          )}
        >
          +1 a due
        </button>
        <button
          type="button"
          onClick={() => changeMode('one')}
          className={cn(
            'flex-1 rounded-md border px-2 py-1.5',
            mode === 'one' ? 'border-gold text-parchment' : 'border-ink-border text-parchment-dim',
          )}
        >
          +2 a una
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {ABILITIES.map((a) => {
          const picked = picks.includes(a);
          const atCap = sheet.abilities[a] >= 20;
          return (
            <button
              key={a}
              type="button"
              disabled={atCap && !picked}
              onClick={() => toggle(a)}
              className={cn(
                'rounded-lg border px-2 py-2 text-center transition-colors',
                picked ? 'border-gold bg-burgundy/40' : 'border-ink-border bg-ink-raised',
                atCap && !picked && 'cursor-not-allowed opacity-40',
              )}
            >
              <span className="block text-xs uppercase tracking-wide text-ochre">
                {ABILITY_LABELS[a]}
              </span>
              <span className="font-display text-parchment">
                {sheet.abilities[a]}
                {picked && (
                  <span className="text-gold"> +{mode === 'one' ? 2 : 1}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={!ready || busy}
        onClick={() => {
          const amount = mode === 'one' ? 2 : 1;
          const out: Partial<Record<Ability, number>> = {};
          picks.forEach((a) => (out[a] = amount));
          onApply(out);
          setPicks([]);
        }}
        className="mt-3 w-full rounded-md bg-gold px-3 py-2 text-sm font-medium text-[color:var(--color-ink)] hover:brightness-110 disabled:opacity-50"
      >
        Applica aumento
      </button>
    </div>
  );
}

function ManualFeature({
  busy,
  onAdd,
}: {
  busy: boolean;
  onAdd: (name: string, desc: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const inputClass =
    'w-full rounded-md border border-ink-border bg-[color:var(--color-ink)] px-2.5 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none';

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-md border border-dashed border-ink-border px-3 py-2 text-sm text-parchment-dim hover:border-ochre hover:text-parchment"
      >
        + Aggiungi un privilegio o tratto a mano
      </button>
    );
  }
  return (
    <div className="space-y-2 rounded-lg border border-ink-border bg-ink-raised/70 p-3">
      <input
        className={inputClass}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome del privilegio"
        maxLength={80}
      />
      <textarea
        className={cn(inputClass, 'min-h-16 resize-y')}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Descrizione (facoltativa)"
        maxLength={400}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setName('');
            setDesc('');
          }}
          className="rounded-md border border-ink-border px-3 py-1.5 text-sm text-parchment-dim hover:border-ochre"
        >
          Annulla
        </button>
        <button
          type="button"
          disabled={busy || !name.trim()}
          onClick={() => {
            onAdd(name, desc);
            setOpen(false);
            setName('');
            setDesc('');
          }}
          className="flex-1 rounded-md bg-gold px-3 py-1.5 text-sm font-medium text-[color:var(--color-ink)] hover:brightness-110 disabled:opacity-50"
        >
          Aggiungi
        </button>
      </div>
    </div>
  );
}
