'use client';

import { useEffect, useState } from 'react';
import { MONSTER_TYPE_LABELS, crLabel, typeLabel } from '@/lib/combat/util';
import { cn } from '@/app/crea/ui';

interface Summary {
  index: string;
  name: string;
  cr: number;
  xp: number;
  type: string;
  size: string;
  hp: number;
  ac: number;
}

export function MonsterBrowser({
  onAdd,
}: {
  onAdd: (index: string, side: 'enemy' | 'ally', count: number) => void;
}) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [crMax, setCrMax] = useState('');
  const [qty, setQty] = useState(1);
  const [results, setResults] = useState<Summary[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (type) params.set('type', type);
    if (crMax) params.set('crMax', crMax);
    fetch(`/api/monsters?${params.toString()}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d: Summary[]) => setResults(d))
      .catch(() => {});
    return () => ctrl.abort();
  }, [q, type, crMax]);

  const inputClass =
    'rounded-lg border border-ink-border bg-[color:var(--color-ink)] px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca un mostro…"
          className={cn(inputClass, 'flex-1 min-w-40')}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
          <option value="">Ogni tipo</option>
          {Object.entries(MONSTER_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <input
          value={crMax}
          onChange={(e) => setCrMax(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="GS max"
          inputMode="decimal"
          className={cn(inputClass, 'w-24')}
        />
        <div className="flex items-center gap-1">
          <span className="text-xs text-parchment-dim">Qtà</span>
          <input
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(12, Number(e.target.value.replace(/[^0-9]/g, '')) || 1)))}
            inputMode="numeric"
            className={cn(inputClass, 'w-14 text-center')}
          />
        </div>
      </div>

      <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
        {results.length === 0 ? (
          <li className="text-sm text-parchment-dim">Nessun mostro trovato.</li>
        ) : (
          results.map((m) => (
            <li
              key={m.index}
              className="flex items-center justify-between gap-2 rounded-lg border border-ink-border bg-ink-raised px-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-sm text-parchment">{m.name}</div>
                <div className="text-xs text-parchment-dim">
                  GS {crLabel(m.cr)} · PF {m.hp} · CA {m.ac} · {typeLabel(m.type)}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => onAdd(m.index, 'enemy', qty)}
                  className="rounded-md border border-flag-red/50 px-2 py-1 text-xs text-parchment hover:border-flag-red"
                >
                  + Nemico
                </button>
                <button
                  type="button"
                  onClick={() => onAdd(m.index, 'ally', qty)}
                  className="rounded-md border border-ochre/60 px-2 py-1 text-xs text-parchment hover:border-ochre"
                >
                  + Alleato
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
