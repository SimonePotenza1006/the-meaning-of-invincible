'use client';

import { useEffect, useMemo, useState } from 'react';
import { assignConsumable } from '@/app/game-actions';
import { Panel, cn } from '@/app/crea/ui';

interface ConsumableItem {
  index: string;
  name: string;
  category: string;
  categoryLabel: string;
  rarity: string;
  attunement: boolean;
  summary: string;
  it: boolean;
  scrollLevel?: number;
}

interface SpellPick {
  index: string;
  name: string;
  level: number;
}

interface CategoryOpt {
  key: string;
  label: string;
}

// DM-only reference: the full SRD consumable catalogue (potions, scrolls,
// ammunition, single-use wondrous items) with search + category filter and a
// one-click "assign to the PC" that drops it on the sheet as a consumable.
export function ConsumablesCatalogPanel({ token, refresh }: { token: string; refresh: () => void }) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState<ConsumableItem[]>([]);
  const [cats, setCats] = useState<CategoryOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [justSent, setJustSent] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/consumables?categories')
      .then((r) => r.json())
      .then((d: CategoryOpt[]) => setCats(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (category) params.set('category', category);
    fetch(`/api/consumables?${params.toString()}`)
      .then((r) => r.json())
      .then((d: ConsumableItem[]) => {
        if (active) setItems(d);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [q, category]);

  // Group results by (localised) category for the list.
  const groups = useMemo(() => {
    const map = new Map<string, ConsumableItem[]>();
    for (const it of items) {
      const arr = map.get(it.categoryLabel) ?? [];
      arr.push(it);
      map.set(it.categoryLabel, arr);
    }
    return [...map.entries()];
  }, [items]);

  async function assign(item: ConsumableItem, quantity: number, spell?: SpellPick) {
    setBusy(item.index);
    try {
      await assignConsumable(token, {
        index: item.index,
        name: item.name,
        description: item.summary,
        rarity: item.rarity,
        quantity,
        spell,
      });
      setJustSent(item.index);
      setTimeout(() => setJustSent((cur) => (cur === item.index ? null : cur)), 1800);
      refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <Panel title="Catalogo consumabili">
      <p className="text-xs text-parchment-dim">
        Sfoglia e cerca pozioni, pergamene, munizioni e oggetti monouso, poi assegnali al
        personaggio: finiranno tra i suoi oggetti come consumabili che potrà usare.
      </p>

      <div className="mt-3 space-y-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca un consumabile…"
          className="w-full rounded-md border border-ink-border bg-[color:var(--color-ink)] px-2.5 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none"
        />
        <div className="flex flex-wrap gap-1.5">
          <CategoryChip label="Tutti" active={category === ''} onClick={() => setCategory('')} />
          {cats.map((c) => (
            <CategoryChip
              key={c.key}
              label={c.label}
              active={category === c.key}
              onClick={() => setCategory(c.key)}
            />
          ))}
        </div>
      </div>

      {loading && <p className="mt-3 text-sm text-parchment-dim">Caricamento…</p>}
      {!loading && items.length === 0 && (
        <p className="mt-3 text-sm text-parchment-dim">Nessun consumabile trovato.</p>
      )}

      <div className="mt-3 space-y-4">
        {groups.map(([label, list]) => (
          <div key={label}>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-ochre">
              {label} <span className="text-parchment-dim">({list.length})</span>
            </p>
            <ul className="space-y-1.5">
              {list.map((item) => (
                <CatalogRow
                  key={item.index}
                  item={item}
                  open={expanded === item.index}
                  onToggle={() =>
                    setExpanded((cur) => (cur === item.index ? null : item.index))
                  }
                  busy={busy === item.index}
                  sent={justSent === item.index}
                  onAssign={(qty, spell) => assign(item, qty, spell)}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-0.5 text-xs',
        active
          ? 'border-gold bg-burgundy/30 text-parchment'
          : 'border-ink-border text-parchment-dim hover:border-ochre hover:text-parchment',
      )}
    >
      {label}
    </button>
  );
}

function CatalogRow({
  item,
  open,
  onToggle,
  busy,
  sent,
  onAssign,
}: {
  item: ConsumableItem;
  open: boolean;
  onToggle: () => void;
  busy: boolean;
  sent: boolean;
  onAssign: (quantity: number, spell?: SpellPick) => void;
}) {
  const [qty, setQty] = useState('1');
  const [spell, setSpell] = useState<SpellPick | null>(null);
  const isScroll = item.scrollLevel != null;
  const canAssign = !busy && (!isScroll || !!spell);

  return (
    <li className="rounded-lg border border-ink-border bg-ink-raised">
      <div className="flex items-start justify-between gap-2 px-3 py-2">
        <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-parchment">{item.name}</span>
            {item.rarity && <span className="text-xs text-ochre">{item.rarity}</span>}
            {!item.it && <span className="text-[10px] text-parchment-dim">EN</span>}
          </div>
          {!open && (
            <p className="mt-0.5 line-clamp-1 text-xs text-parchment-dim">{item.summary}</p>
          )}
        </button>
      </div>

      {open && <p className="px-3 pb-2 text-xs text-parchment-dim">{item.summary}</p>}

      {isScroll && (
        <div className="border-t border-ink-border/60 px-3 py-2">
          <p className="mb-1 text-xs text-parchment-dim">
            Incantesimo della pergamena{' '}
            <span className="text-ochre">
              ({item.scrollLevel === 0 ? 'trucchetto' : `${item.scrollLevel}° livello`})
            </span>
          </p>
          <ScrollSpellPicker level={item.scrollLevel!} selected={spell} onPick={setSpell} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-ink-border/60 px-3 py-2">
        <label className="flex items-center gap-1 text-xs text-parchment-dim">
          Quantità
          <input
            value={qty}
            onChange={(e) => setQty(e.target.value.replace(/[^0-9]/g, ''))}
            inputMode="numeric"
            className="w-14 rounded-md border border-ink-border bg-[color:var(--color-ink)] px-2 py-1 text-center text-sm text-parchment focus:border-gold focus:outline-none"
          />
        </label>
        <button
          type="button"
          disabled={!canAssign}
          onClick={() => onAssign(Math.max(1, parseInt(qty, 10) || 1), spell ?? undefined)}
          className={cn(
            'ml-auto rounded-md px-3 py-1 text-sm font-medium',
            sent
              ? 'border border-gold text-gold'
              : 'bg-gold text-[color:var(--color-ink)] hover:brightness-110',
            !canAssign && 'opacity-50',
          )}
        >
          {sent ? '✓ Consegnato' : busy ? 'Assegno…' : isScroll && !spell ? 'Scegli incantesimo' : 'Assegna al PG'}
        </button>
      </div>
    </li>
  );
}

// Spell picker for a scroll: only spells of the scroll's exact level.
function ScrollSpellPicker({
  level,
  selected,
  onPick,
}: {
  level: number;
  selected: SpellPick | null;
  onPick: (s: SpellPick) => void;
}) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<SpellPick[]>([]);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ level: String(level) });
    if (q.trim()) params.set('q', q.trim());
    fetch(`/api/spells?${params.toString()}`)
      .then((r) => r.json())
      .then((d: SpellPick[]) => active && setHits(d.slice(0, 40)))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [q, level]);

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={selected ? `Scelto: ${selected.name}` : 'Cerca un incantesimo…'}
        className="w-full rounded-md border border-ink-border bg-[color:var(--color-ink)] px-2 py-1.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none"
      />
      <ul className="mt-1 max-h-40 overflow-y-auto rounded-md border border-ink-border">
        {hits.map((h) => (
          <li key={h.index}>
            <button
              type="button"
              onClick={() => {
                onPick(h);
                setQ('');
              }}
              className={cn(
                'flex w-full items-center justify-between px-2 py-1 text-left text-sm hover:bg-burgundy/30',
                selected?.index === h.index ? 'text-gold' : 'text-parchment',
              )}
            >
              <span>{h.name}</span>
              {selected?.index === h.index && <span className="text-xs">✓</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
