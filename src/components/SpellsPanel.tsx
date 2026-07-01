'use client';

import { useEffect, useState } from 'react';
import { formatMod } from '@/lib/rules';
import { resolveClassKey } from '@/lib/character/levelup';
import { spellPlan } from '@/lib/spells/counts';
import {
  castSpell,
  forgetSpell,
  learnSpell,
  togglePreparedSpell,
  updateSpellSlot,
} from '@/app/game-actions';
import { Panel, cn } from '@/app/crea/ui';
import { StatTile, Stepper } from '@/components/game';
import type { CharacterSheet, KnownSpell } from '@/lib/sheet';

interface SpellItem {
  index: string;
  name: string;
  level: number;
  school: string;
  classes: string[];
  concentration: boolean;
  ritual: boolean;
  it: boolean;
}
interface SpellDetail extends SpellItem {
  castingTime: string;
  range: string;
  components: string[];
  material: string;
  duration: string;
  summary: string;
}

const LEVEL_LABEL = (l: number) => (l === 0 ? 'Trucchetto' : `Livello ${l}`);

export function SpellsPanel({
  token,
  sheet,
  refresh,
}: {
  token: string;
  sheet: CharacterSheet;
  refresh: () => void;
}) {
  const sc = sheet.spellcasting;
  const [manage, setManage] = useState(false);
  if (!sc) return null;

  const classKey = resolveClassKey(sheet);
  const plan = spellPlan(classKey, sheet);
  const isPrepared = plan.kind === 'prepared';
  const preparedSet = new Set(sc.prepared);
  const learnedSet = new Set([...sc.cantrips, ...sc.known].map((s) => s.index));

  const run = async (p: Promise<unknown>) => {
    try {
      await p;
    } finally {
      refresh();
    }
  };

  const knownSorted = [...sc.known].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, 'it'));
  const knownCount = isPrepared ? preparedSet.size : sc.known.length;

  return (
    <Panel title="Incantesimi">
      <div className="grid grid-cols-2 gap-2">
        <StatTile label="CD TS" value={sc.spellSaveDc ?? '—'} />
        <StatTile
          label="Attacco"
          value={sc.spellAttackBonus !== undefined ? formatMod(sc.spellAttackBonus) : '—'}
        />
      </div>

      {/* Guidance counts */}
      <p className="mt-2 text-xs text-parchment-dim">
        Trucchetti {sc.cantrips.length}
        {plan.cantrips ? `/${plan.cantrips}` : ''} · {plan.spellsLabel ?? 'Conosciuti'} {knownCount}
        {plan.spells != null ? `/${plan.spells}` : ''}
        {plan.spellbook != null ? ` · Libro ${sc.known.length}/${plan.spellbook}` : ''}
      </p>

      {/* Slots */}
      {sc.slots.map((slot) => (
        <div key={slot.level} className="mt-3 flex items-center justify-between">
          <span className="text-sm text-parchment">Slot di livello {slot.level}</span>
          <Stepper
            value={`${slot.used}/${slot.total}`}
            onDec={() => run(updateSpellSlot(token, slot.level, -1))}
            onInc={() => run(updateSpellSlot(token, slot.level, 1))}
          />
        </div>
      ))}

      {/* Cantrips */}
      {sc.cantrips.length > 0 && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-ochre">Trucchetti</p>
          <ul className="space-y-1.5">
            {sc.cantrips.map((sp) => (
              <SpellRow
                key={sp.index}
                spell={sp}
                canCast
                onCast={() => run(castSpell(token, sp))}
                onForget={() => run(forgetSpell(token, sp.index))}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Known / prepared spells */}
      {knownSorted.length > 0 && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-ochre">
            {isPrepared ? 'Incantesimi (tocca ★ per preparare)' : 'Incantesimi conosciuti'}
          </p>
          <ul className="space-y-1.5">
            {knownSorted.map((sp) => {
              const prep = preparedSet.has(sp.index);
              const canCast = isPrepared ? prep : true;
              return (
                <SpellRow
                  key={sp.index}
                  spell={sp}
                  canCast={canCast}
                  prepared={isPrepared ? prep : undefined}
                  onTogglePrepared={isPrepared ? () => run(togglePreparedSpell(token, sp.index)) : undefined}
                  onCast={() => run(castSpell(token, sp))}
                  onForget={() => run(forgetSpell(token, sp.index))}
                />
              );
            })}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setManage((m) => !m)}
        className="mt-4 w-full rounded-md border border-ink-border px-3 py-2 text-sm text-parchment hover:border-gold"
      >
        {manage ? 'Chiudi elenco incantesimi' : '+ Gestisci incantesimi'}
      </button>

      {manage && (
        <SpellBrowser
          classKey={classKey}
          learnedSet={learnedSet}
          onLearn={(sp) => run(learnSpell(token, sp))}
          onForget={(index) => run(forgetSpell(token, index))}
        />
      )}
    </Panel>
  );
}

function SpellRow({
  spell,
  canCast,
  prepared,
  onCast,
  onForget,
  onTogglePrepared,
}: {
  spell: KnownSpell;
  canCast: boolean;
  prepared?: boolean;
  onCast: () => void;
  onForget: () => void;
  onTogglePrepared?: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-lg border border-ink-border bg-ink-raised px-3 py-1.5">
      <div className="flex min-w-0 items-center gap-2">
        {onTogglePrepared && (
          <button
            type="button"
            aria-label="Prepara"
            onClick={onTogglePrepared}
            className={cn('shrink-0 text-lg leading-none', prepared ? 'text-gold' : 'text-parchment-dim')}
          >
            {prepared ? '★' : '☆'}
          </button>
        )}
        <span className="truncate text-parchment">{spell.name}</span>
        {spell.level > 0 && <span className="shrink-0 text-xs text-parchment-dim">L{spell.level}</span>}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          disabled={!canCast}
          onClick={onCast}
          className="rounded-md border border-gold/60 px-2.5 py-0.5 text-sm text-parchment hover:border-gold disabled:opacity-30"
        >
          Lancia
        </button>
        <button
          type="button"
          aria-label="Dimentica"
          onClick={onForget}
          className="rounded-md border border-ink-border px-2 py-0.5 text-sm text-parchment-dim hover:border-flag-red hover:text-flag-red"
        >
          ✕
        </button>
      </div>
    </li>
  );
}

function SpellBrowser({
  classKey,
  learnedSet,
  onLearn,
  onForget,
}: {
  classKey: string;
  learnedSet: Set<string>;
  onLearn: (spell: { index: string; name: string; level: number }) => void;
  onForget: (index: string) => void;
}) {
  const [level, setLevel] = useState<string>('');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<SpellItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, SpellDetail>>({});

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = new URLSearchParams({ class: classKey });
    if (level !== '') params.set('level', level);
    if (q.trim()) params.set('q', q.trim());
    fetch(`/api/spells?${params.toString()}`)
      .then((r) => r.json())
      .then((d: SpellItem[]) => {
        if (active) {
          setItems(d);
          setLoading(false);
        }
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [classKey, level, q]);

  async function toggleDetail(index: string) {
    setOpen((o) => (o === index ? null : index));
    if (!details[index]) {
      const d: SpellDetail = await fetch(`/api/spells?index=${index}`).then((r) => r.json());
      setDetails((m) => ({ ...m, [index]: d }));
    }
  }

  const selectClass =
    'rounded-lg border border-ink-border bg-[color:var(--color-ink)] px-2 py-1.5 text-sm text-parchment focus:border-gold focus:outline-none';

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-ink-border bg-ink-raised/60 p-3">
      <div className="flex gap-2">
        <select value={level} onChange={(e) => setLevel(e.target.value)} className={selectClass}>
          <option value="">Tutti i livelli</option>
          <option value="0">Trucchetti</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
            <option key={l} value={String(l)}>
              Livello {l}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca…"
          className={cn(selectClass, 'flex-1')}
        />
      </div>

      {loading && <p className="text-xs text-parchment-dim">Caricamento…</p>}
      {!loading && items.length === 0 && (
        <p className="text-xs text-parchment-dim">Nessun incantesimo trovato.</p>
      )}

      <ul className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
        {items.map((sp) => {
          const learned = learnedSet.has(sp.index);
          const d = details[sp.index];
          return (
            <li key={sp.index} className="rounded-lg border border-ink-border bg-ink-raised">
              <div className="flex items-center justify-between gap-2 px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => toggleDetail(sp.index)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="truncate text-parchment">{sp.name}</span>
                  {!sp.it && (
                    <span className="shrink-0 rounded bg-ink-border px-1 text-[10px] text-parchment-dim">EN</span>
                  )}
                  {sp.concentration && <span className="shrink-0 text-xs text-ochre" title="Concentrazione">C</span>}
                  {sp.ritual && <span className="shrink-0 text-xs text-ochre" title="Rituale">R</span>}
                </button>
                <span className="shrink-0 text-xs text-parchment-dim">{sp.school}</span>
                <button
                  type="button"
                  onClick={() => (learned ? onForget(sp.index) : onLearn(sp))}
                  className={cn(
                    'shrink-0 rounded-md border px-2.5 py-0.5 text-sm',
                    learned
                      ? 'border-flag-red/50 text-parchment-dim hover:border-flag-red'
                      : 'border-gold/60 text-parchment hover:border-gold',
                  )}
                >
                  {learned ? 'Rimuovi' : sp.level === 0 ? 'Impara' : 'Aggiungi'}
                </button>
              </div>
              {open === sp.index && (
                <div className="border-t border-ink-border px-3 py-2 text-xs text-parchment-dim">
                  {d ? (
                    <>
                      <p className="mb-1 text-ochre">
                        {LEVEL_LABEL(d.level)} · {d.school}
                      </p>
                      <p className="mb-1 text-parchment">{d.summary}</p>
                      <p>
                        Lancio: {d.castingTime} · Gittata: {d.range} · Durata: {d.duration}
                        {d.components?.length ? ` · Comp.: ${d.components.join(', ')}` : ''}
                      </p>
                    </>
                  ) : (
                    'Caricamento…'
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
