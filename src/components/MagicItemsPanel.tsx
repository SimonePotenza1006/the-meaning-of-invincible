'use client';

import { useEffect, useMemo, useState } from 'react';
import { ABILITIES, type Ability } from '@/lib/rules';
import { ABILITY_LABELS, featureCatalog } from '@/lib/dnd';
import { effectLabel } from '@/lib/character/items';
import {
  addMagicItem,
  rechargeMagicItem,
  removeMagicItem,
  setMagicItemEquipped,
  useMagicItem,
  type MagicItemInput,
} from '@/app/game-actions';
import { Panel, cn } from '@/app/crea/ui';
import type { CharacterSheet, MagicItem, MagicItemEffect } from '@/lib/sheet';

const RARITIES = ['Comune', 'Non comune', 'Raro', 'Molto raro', 'Leggendario'];

export function MagicItemsPanel({
  token,
  sheet,
  refresh,
  canCreate = false,
}: {
  token: string;
  sheet: CharacterSheet;
  refresh: () => void;
  canCreate?: boolean;
}) {
  const [building, setBuilding] = useState(false);
  const run = async (p: Promise<unknown>) => {
    try {
      await p;
    } finally {
      refresh();
    }
  };

  const items = sheet.equipment.magicItems ?? [];

  return (
    <Panel title="Oggetti magici">
      {items.length === 0 && (
        <p className="text-sm text-parchment-dim">Nessun oggetto magico.</p>
      )}
      <ul className="space-y-2">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            canCreate={canCreate}
            onEquip={(eq) => run(setMagicItemEquipped(token, item.id, eq))}
            onUse={() => run(useMagicItem(token, item.id))}
            onRecharge={() => run(rechargeMagicItem(token, item.id))}
            onRemove={() => run(removeMagicItem(token, item.id))}
          />
        ))}
      </ul>

      {canCreate &&
        (building ? (
          <ItemBuilder
            onCreate={(input) => {
              run(addMagicItem(token, input));
              setBuilding(false);
            }}
            onCancel={() => setBuilding(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setBuilding(true)}
            className="mt-3 w-full rounded-md border border-dashed border-ink-border px-3 py-2 text-sm text-parchment-dim hover:border-ochre hover:text-parchment"
          >
            + Crea oggetto magico
          </button>
        ))}
    </Panel>
  );
}

function ItemCard({
  item,
  canCreate,
  onEquip,
  onUse,
  onRecharge,
  onRemove,
}: {
  item: MagicItem;
  canCreate: boolean;
  onEquip: (equipped: boolean) => void;
  onUse: () => void;
  onRecharge: () => void;
  onRemove: () => void;
}) {
  const spell = item.effects.find((e) => e.kind === 'spell');
  const features = item.effects.filter((e) => e.kind === 'feature');
  const canUse = !!spell || !!item.charges;
  return (
    <li
      className={cn(
        'rounded-lg border px-3 py-2',
        item.equipped ? 'border-gold/50 bg-burgundy/20' : 'border-ink-border bg-ink-raised opacity-70',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-parchment">{item.name}</span>
            {item.rarity && <span className="text-xs text-ochre">{item.rarity}</span>}
            {item.attunement && <span className="text-xs text-parchment-dim">· sintonia</span>}
          </div>
          {item.description && (
            <p className="mt-0.5 text-xs text-parchment-dim">{item.description}</p>
          )}
        </div>
        <label className="flex shrink-0 items-center gap-1 text-xs text-parchment-dim">
          <input type="checkbox" checked={item.equipped} onChange={(e) => onEquip(e.target.checked)} />
          Eq.
        </label>
      </div>

      {item.effects.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {item.effects.map((e, i) => (
            <span
              key={i}
              className="rounded-full border border-ink-border px-2 py-0.5 text-xs text-parchment"
            >
              {effectLabel(e)}
            </span>
          ))}
        </div>
      )}

      {features.map((f, i) => (
        f.featureDesc ? (
          <p key={i} className="mt-1.5 text-xs text-parchment-dim">
            <span className="text-ochre">{f.featureName}:</span> {f.featureDesc}
          </p>
        ) : null
      ))}

      {(canUse || canCreate) && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {item.charges && (
            <span className="text-xs text-parchment-dim">
              Cariche {item.charges.current}/{item.charges.max}
            </span>
          )}
          {canUse && (
            <button
              type="button"
              onClick={onUse}
              className="rounded-md border border-gold/60 px-2.5 py-1 text-sm text-parchment hover:border-gold"
            >
              {spell ? 'Lancia' : 'Usa'}
            </button>
          )}
          {canCreate && item.charges && (
            <button
              type="button"
              onClick={onRecharge}
              className="rounded-md border border-ochre/60 px-2.5 py-1 text-sm text-parchment hover:border-ochre"
            >
              Ricarica
            </button>
          )}
          {canCreate && (
            <button
              type="button"
              onClick={onRemove}
              className="ml-auto rounded-md border border-ink-border px-2 py-1 text-sm text-parchment-dim hover:border-flag-red hover:text-flag-red"
            >
              Elimina
            </button>
          )}
        </div>
      )}
    </li>
  );
}

function ItemBuilder({
  onCreate,
  onCancel,
}: {
  onCreate: (input: MagicItemInput) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rarity, setRarity] = useState('Non comune');
  const [attunement, setAttunement] = useState(false);
  const [chargesMax, setChargesMax] = useState('');
  const [effects, setEffects] = useState<MagicItemEffect[]>([]);

  const inputClass =
    'w-full rounded-md border border-ink-border bg-[color:var(--color-ink)] px-2.5 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none';

  function updateEffect(i: number, patch: Partial<MagicItemEffect>) {
    setEffects((cur) => cur.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  }
  function addEffect() {
    setEffects((cur) => [...cur, { kind: 'ability', ability: 'STR', bonus: 1 }]);
  }
  function removeEffect(i: number) {
    setEffects((cur) => cur.filter((_, idx) => idx !== i));
  }

  function create() {
    const max = parseInt(chargesMax, 10);
    onCreate({
      name,
      description,
      rarity,
      attunement,
      charges: Number.isFinite(max) && max > 0 ? { current: max, max } : undefined,
      effects,
    });
  }

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-ink-border bg-ink-raised/70 p-3">
      <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome dell'oggetto" maxLength={80} />
      <textarea
        className={cn(inputClass, 'min-h-14 resize-y')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrizione (facoltativa)"
        maxLength={400}
      />
      <div className="flex flex-wrap items-center gap-2">
        <select value={rarity} onChange={(e) => setRarity(e.target.value)} className={cn(inputClass, 'w-auto')}>
          {RARITIES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm text-parchment">
          <input type="checkbox" checked={attunement} onChange={(e) => setAttunement(e.target.checked)} />
          Sintonia
        </label>
        <input
          className={cn(inputClass, 'w-28')}
          value={chargesMax}
          onChange={(e) => setChargesMax(e.target.value.replace(/[^0-9]/g, ''))}
          inputMode="numeric"
          placeholder="Cariche max"
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ochre">Effetti</p>
        {effects.map((e, i) => (
          <EffectRow
            key={i}
            effect={e}
            onChange={(patch) => updateEffect(i, patch)}
            onRemove={() => removeEffect(i)}
          />
        ))}
        <button
          type="button"
          onClick={addEffect}
          className="w-full rounded-md border border-dashed border-ink-border px-3 py-1.5 text-sm text-parchment-dim hover:border-ochre hover:text-parchment"
        >
          + Aggiungi effetto
        </button>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-ink-border px-3 py-1.5 text-sm text-parchment-dim hover:border-ochre"
        >
          Annulla
        </button>
        <button
          type="button"
          disabled={!name.trim()}
          onClick={create}
          className="flex-1 rounded-md bg-gold px-3 py-1.5 text-sm font-medium text-[color:var(--color-ink)] hover:brightness-110 disabled:opacity-50"
        >
          Crea oggetto
        </button>
      </div>
    </div>
  );
}

const KIND_LABEL: Record<MagicItemEffect['kind'], string> = {
  ability: 'Caratteristica',
  ac: 'CA',
  maxHp: 'PF max',
  speed: 'Velocità',
  spell: 'Incantesimo',
  feature: 'Privilegio',
};

function EffectRow({
  effect,
  onChange,
  onRemove,
}: {
  effect: MagicItemEffect;
  onChange: (patch: Partial<MagicItemEffect>) => void;
  onRemove: () => void;
}) {
  const inputClass =
    'rounded-md border border-ink-border bg-[color:var(--color-ink)] px-2 py-1.5 text-sm text-parchment focus:border-gold focus:outline-none';

  return (
    <div className="space-y-1.5 rounded-md border border-ink-border/70 bg-ink-raised p-2">
      <div className="flex items-center gap-2">
        <select
          value={effect.kind}
          onChange={(e) => onChange(resetForKind(e.target.value as MagicItemEffect['kind']))}
          className={inputClass}
        >
          {(Object.keys(KIND_LABEL) as MagicItemEffect['kind'][]).map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onRemove}
          className="ml-auto rounded-md border border-ink-border px-2 py-1 text-xs text-parchment-dim hover:border-flag-red hover:text-flag-red"
        >
          ✕
        </button>
      </div>

      {effect.kind === 'ability' && (
        <div className="flex gap-2">
          <select
            value={effect.ability ?? 'STR'}
            onChange={(e) => onChange({ ability: e.target.value as Ability })}
            className={cn(inputClass, 'flex-1')}
          >
            {ABILITIES.map((a) => (
              <option key={a} value={a}>
                {ABILITY_LABELS[a]}
              </option>
            ))}
          </select>
          <NumberInput value={effect.bonus} onChange={(n) => onChange({ bonus: n })} />
        </div>
      )}

      {(effect.kind === 'ac' || effect.kind === 'maxHp' || effect.kind === 'speed') && (
        <NumberInput value={effect.bonus} onChange={(n) => onChange({ bonus: n })} />
      )}

      {effect.kind === 'spell' && (
        <SpellEffectPicker
          spellName={effect.spellName}
          onPick={(sp) => onChange({ spellIndex: sp.index, spellName: sp.name, spellLevel: sp.level })}
        />
      )}

      {effect.kind === 'feature' && (
        <FeatureEffectPicker
          featureName={effect.featureName}
          featureDesc={effect.featureDesc}
          onName={(v) => onChange({ featureName: v })}
          onDesc={(v) => onChange({ featureDesc: v })}
        />
      )}
    </div>
  );
}

function resetForKind(kind: MagicItemEffect['kind']): Partial<MagicItemEffect> {
  if (kind === 'ability') return { kind, ability: 'STR', bonus: 1, spellIndex: undefined, spellName: undefined, spellLevel: undefined, featureName: undefined, featureDesc: undefined };
  if (kind === 'ac' || kind === 'maxHp' || kind === 'speed')
    return { kind, ability: undefined, bonus: 1, spellIndex: undefined, spellName: undefined, spellLevel: undefined, featureName: undefined, featureDesc: undefined };
  if (kind === 'spell') return { kind, ability: undefined, bonus: undefined, featureName: undefined, featureDesc: undefined };
  return { kind, ability: undefined, bonus: undefined, spellIndex: undefined, spellName: undefined, spellLevel: undefined };
}

function NumberInput({ value, onChange }: { value?: number; onChange: (n: number) => void }) {
  return (
    <input
      type="number"
      value={value ?? 0}
      onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      className="w-20 rounded-md border border-ink-border bg-[color:var(--color-ink)] px-2 py-1.5 text-center text-sm text-parchment focus:border-gold focus:outline-none"
    />
  );
}

interface SpellHit {
  index: string;
  name: string;
  level: number;
}
function SpellEffectPicker({
  spellName,
  onPick,
}: {
  spellName?: string;
  onPick: (sp: SpellHit) => void;
}) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<SpellHit[]>([]);
  useEffect(() => {
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    let active = true;
    fetch(`/api/spells?q=${encodeURIComponent(q.trim())}`)
      .then((r) => r.json())
      .then((d: SpellHit[]) => active && setHits(d.slice(0, 8)))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [q]);
  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={spellName ? `Scelto: ${spellName}` : 'Cerca un incantesimo…'}
        className="w-full rounded-md border border-ink-border bg-[color:var(--color-ink)] px-2 py-1.5 text-sm text-parchment focus:border-gold focus:outline-none"
      />
      {hits.length > 0 && (
        <ul className="mt-1 max-h-40 overflow-y-auto rounded-md border border-ink-border">
          {hits.map((h) => (
            <li key={h.index}>
              <button
                type="button"
                onClick={() => {
                  onPick(h);
                  setQ('');
                  setHits([]);
                }}
                className="flex w-full items-center justify-between px-2 py-1 text-left text-sm text-parchment hover:bg-burgundy/30"
              >
                <span>{h.name}</span>
                <span className="text-xs text-parchment-dim">{h.level === 0 ? 'Trucch.' : `L${h.level}`}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FeatureEffectPicker({
  featureName,
  featureDesc,
  onName,
  onDesc,
}: {
  featureName?: string;
  featureDesc?: string;
  onName: (v: string) => void;
  onDesc: (v: string) => void;
}) {
  const catalog = useMemo(() => featureCatalog(), []);
  const inputClass =
    'w-full rounded-md border border-ink-border bg-[color:var(--color-ink)] px-2 py-1.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none';
  return (
    <div className="space-y-1.5">
      <select
        value=""
        onChange={(e) => {
          const f = catalog[Number(e.target.value)];
          if (f) {
            onName(f.name);
            onDesc(f.description);
          }
        }}
        className={inputClass}
      >
        <option value="">— Scegli dal catalogo… —</option>
        {catalog.map((f, i) => (
          <option key={`${f.source}-${f.name}-${i}`} value={i}>
            {f.name} ({f.source})
          </option>
        ))}
      </select>
      <input className={inputClass} value={featureName ?? ''} onChange={(e) => onName(e.target.value)} placeholder="Nome del privilegio" maxLength={80} />
      <textarea
        className={cn(inputClass, 'min-h-12 resize-y')}
        value={featureDesc ?? ''}
        onChange={(e) => onDesc(e.target.value)}
        placeholder="Descrizione"
        maxLength={400}
      />
    </div>
  );
}
