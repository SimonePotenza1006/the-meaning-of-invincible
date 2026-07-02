'use client';

import { useEffect, useMemo, useState } from 'react';
import { Panel, cn } from '@/app/crea/ui';
import { ActionGlyph } from '@/components/action-cost';

interface SpellListItem {
  index: string;
  name: string;
  level: number;
  school: string;
  classes: string[];
  concentration: boolean;
  ritual: boolean;
  action: 'action' | 'bonus' | 'reaction' | 'other';
  it: boolean;
}

interface SpellDetail extends SpellListItem {
  castingTime: string;
  range: string;
  components: string[];
  material: string;
  duration: string;
  summary: string;
}

const LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const levelLabel = (l: number) => (l === 0 ? 'Trucchetti' : `Livello ${l}`);

// DM-only reference: every SRD spell, grouped by level, searchable, with an
// expandable Italian detail. Read-only — it doesn't touch the character sheet.
export function SpellCompendiumPanel() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<SpellListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Set<number>>(new Set([0, 1]));
  const [detail, setDetail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    fetch(`/api/spells?${params.toString()}`)
      .then((r) => r.json())
      .then((d: SpellListItem[]) => {
        if (active) setItems(d);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [q]);

  // When searching, auto-open every level that has a hit.
  const byLevel = useMemo(() => {
    const map = new Map<number, SpellListItem[]>();
    for (const s of items) {
      const arr = map.get(s.level) ?? [];
      arr.push(s);
      map.set(s.level, arr);
    }
    return map;
  }, [items]);

  const searching = q.trim().length > 0;

  function toggleLevel(l: number) {
    setOpen((cur) => {
      const next = new Set(cur);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  }

  return (
    <Panel title="Compendio incantesimi">
      <p className="text-xs text-parchment-dim">
        Tutti gli incantesimi dell'SRD, divisi per livello. Consultazione: tocca un incantesimo per
        leggerne il riassunto.
      </p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cerca un incantesimo…"
        className="mt-3 w-full rounded-md border border-ink-border bg-[color:var(--color-ink)] px-2.5 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none"
      />

      {loading && <p className="mt-3 text-sm text-parchment-dim">Caricamento…</p>}
      {!loading && items.length === 0 && (
        <p className="mt-3 text-sm text-parchment-dim">Nessun incantesimo trovato.</p>
      )}

      <div className="mt-3 space-y-2">
        {LEVELS.map((l) => {
          const list = byLevel.get(l);
          if (!list || list.length === 0) return null;
          const isOpen = searching || open.has(l);
          return (
            <div key={l} className="rounded-lg border border-ink-border">
              <button
                type="button"
                onClick={() => toggleLevel(l)}
                className="flex w-full items-center justify-between px-3 py-2 text-left"
              >
                <span className="font-display text-sm text-gold">{levelLabel(l)}</span>
                <span className="text-xs text-parchment-dim">
                  {list.length} {isOpen ? '▾' : '▸'}
                </span>
              </button>
              {isOpen && (
                <ul className="border-t border-ink-border/60">
                  {list.map((s) => (
                    <SpellRow
                      key={s.index}
                      spell={s}
                      open={detail === s.index}
                      onToggle={() => setDetail((cur) => (cur === s.index ? null : s.index))}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function SpellRow({
  spell,
  open,
  onToggle,
}: {
  spell: SpellListItem;
  open: boolean;
  onToggle: () => void;
}) {
  const [detail, setDetail] = useState<SpellDetail | null>(null);

  useEffect(() => {
    if (!open || detail) return;
    let active = true;
    fetch(`/api/spells?index=${encodeURIComponent(spell.index)}`)
      .then((r) => r.json())
      .then((d: SpellDetail) => active && setDetail(d))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [open, detail, spell.index]);

  return (
    <li className="border-b border-ink-border/40 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-burgundy/20"
      >
        <ActionGlyph cost={spell.action} />
        <span className="flex-1 text-sm text-parchment">{spell.name}</span>
        {spell.concentration && (
          <span className="text-[10px] text-parchment-dim" title="Concentrazione">
            C
          </span>
        )}
        {spell.ritual && (
          <span className="text-[10px] text-parchment-dim" title="Rituale">
            R
          </span>
        )}
        {!spell.it && <span className="text-[10px] text-parchment-dim">EN</span>}
        <span className="text-xs text-ochre">{spell.school}</span>
      </button>
      {open && (
        <div className="px-3 pb-2 text-xs text-parchment-dim">
          {detail ? (
            <>
              <div className="mb-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]">
                <span>
                  <span className="text-parchment">Lancio:</span> {detail.castingTime}
                </span>
                <span>
                  <span className="text-parchment">Gittata:</span> {detail.range}
                </span>
                <span>
                  <span className="text-parchment">Durata:</span> {detail.duration}
                </span>
                {detail.components.length > 0 && (
                  <span>
                    <span className="text-parchment">Comp.:</span> {detail.components.join(', ')}
                  </span>
                )}
              </div>
              <p className={cn(detail.classes.length > 0 && 'mb-1')}>{detail.summary}</p>
              {detail.classes.length > 0 && (
                <p className="text-[11px] text-parchment-dim/80">Classi: {detail.classes.join(', ')}</p>
              )}
            </>
          ) : (
            <p>Caricamento…</p>
          )}
        </div>
      )}
    </li>
  );
}
