'use client';

import { useState } from 'react';
import { ABILITIES, type Ability } from '@/lib/rules';
import {
  ABILITY_LABELS,
  classFeaturesAt,
  getSubclasses,
  subclassFeaturesAt,
  subclassMeta,
} from '@/lib/dnd';
import { resolveClassKey } from '@/lib/character/levelup';
import {
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

  // Features the engine already granted for this level (base class + subclass if
  // one is chosen). Shown read-only so nothing has to be written by hand.
  const grantedFeatures = [
    ...classFeaturesAt(classKey, p.level),
    ...(sheet.identity.subclassKey
      ? subclassFeaturesAt(classKey, sheet.identity.subclassKey, p.level)
      : []),
  ];

  // Choices that MUST be made before the level-up can be confirmed. The dialog
  // cannot be dismissed until these are resolved.
  const mustResolve = p.needsSubclass || p.needsAsi;

  return (
    <div
      className="fixed inset-0 z-50 flex overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Sei salito al livello ${p.level}`}
    >
    <section className="m-auto w-full max-w-md rounded-xl border-2 border-gold bg-ink-raised p-4 shadow-[0_20px_60px_-15px_var(--color-gold)]">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg" aria-hidden>
          ✦
        </span>
        <h2 className="font-display text-xl text-parchment">Sei salito al livello {p.level}!</h2>
      </div>
      <p className="mb-4 text-sm text-parchment-dim">
        Sistema il tuo nuovo livello e completa le scelte richieste: questa finestra
        resta aperta finché non hai finito.
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

        {/* Features granted automatically at this level (read-only) */}
        {grantedFeatures.length > 0 && (
          <div className="rounded-lg border border-ink-border bg-ink-raised/70 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ochre">
              Privilegi ottenuti · aggiunti in automatico
            </p>
            <ul className="space-y-2">
              {grantedFeatures.map((f, i) => (
                <li key={`${f.name}-${i}`}>
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-gold" aria-hidden>
                      ✦
                    </span>
                    <span className="font-display text-sm text-parchment">{f.name}</span>
                  </span>
                  {f.description && (
                    <p className="mt-0.5 pl-5 text-xs leading-snug text-parchment-dim">
                      {f.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {mustResolve && (
          <p className="text-center text-xs text-ochre">
            Completa {p.needsSubclass ? 'la sottoclasse' : ''}
            {p.needsSubclass && p.needsAsi ? ' e ' : ''}
            {p.needsAsi ? 'l’aumento di caratteristiche' : ''} per continuare.
          </p>
        )}
        <button
          type="button"
          disabled={busy || mustResolve}
          onClick={() => run(() => finishLevelUp(token))}
          className="w-full rounded-xl bg-gold px-5 py-3 font-medium text-[color:var(--color-ink)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Ho finito · conferma il livello
        </button>
      </div>
    </section>
    </div>
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

