'use client';

import { useState } from 'react';
import { ABILITY_SHORT, CLASSES, RACES, getSubclasses } from '@/lib/dnd';
import { ABILITIES, formatMod, modifier } from '@/lib/rules';
import { addNpc, patchNpc, removeNpc, updateNpc } from '@/app/game-actions';
import { Panel, cn } from '@/app/crea/ui';
import type { Npc } from '@/lib/game/types';

const inputClass =
  'w-full rounded-lg border border-ink-border bg-[color:var(--color-ink)] px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none';

interface FormState {
  id: string | null;
  name: string;
  raceKey: string;
  classKey: string;
  subclassKey: string;
  level: string;
}

function emptyForm(): FormState {
  return {
    id: null,
    name: '',
    raceKey: RACES[0]?.key ?? '',
    classKey: CLASSES[0]?.key ?? '',
    subclassKey: '',
    level: '1',
  };
}

export function NpcPanel({
  token,
  npcs,
  refresh,
}: {
  token: string;
  npcs: Npc[];
  refresh: () => void;
}) {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [busy, setBusy] = useState(false);

  const run = async (p: Promise<unknown>) => {
    setBusy(true);
    try {
      await p;
    } finally {
      setBusy(false);
      refresh();
    }
  };

  const subclasses = getSubclasses(form.classKey);

  function editNpc(n: Npc) {
    setForm({
      id: n.id,
      name: n.name,
      raceKey: n.raceKey,
      classKey: n.classKey,
      subclassKey: n.subclassKey ?? '',
      level: String(n.level),
    });
  }

  async function submit() {
    const input = {
      name: form.name,
      raceKey: form.raceKey,
      classKey: form.classKey,
      subclassKey: form.subclassKey || null,
      level: Number(form.level) || 1,
    };
    await run(form.id ? updateNpc(token, form.id, input) : addNpc(token, input));
    setForm(emptyForm());
  }

  return (
    <div className="space-y-4">
      <Panel title={form.id ? 'Modifica NPC' : 'Nuovo NPC'}>
        <div className="space-y-2">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome dell'NPC"
            maxLength={80}
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.raceKey}
              onChange={(e) => setForm({ ...form, raceKey: e.target.value })}
              className={inputClass}
            >
              {RACES.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.name}
                </option>
              ))}
            </select>
            <select
              value={form.classKey}
              onChange={(e) => setForm({ ...form, classKey: e.target.value, subclassKey: '' })}
              className={inputClass}
            >
              {CLASSES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={form.subclassKey}
              onChange={(e) => setForm({ ...form, subclassKey: e.target.value })}
              className={inputClass}
              disabled={subclasses.length === 0}
            >
              <option value="">— Nessuna sottoclasse —</option>
              {subclasses.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              value={form.level}
              onChange={(e) =>
                setForm({ ...form, level: e.target.value.replace(/[^0-9]/g, '').slice(0, 2) })
              }
              inputMode="numeric"
              placeholder="Livello"
              className={inputClass}
            />
          </div>
          <div className="flex gap-2">
            {form.id && (
              <button
                type="button"
                onClick={() => setForm(emptyForm())}
                className="rounded-lg border border-ink-border px-3 py-2 text-sm text-parchment-dim hover:border-ochre"
              >
                Annulla
              </button>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={busy || !form.name.trim()}
              className="flex-1 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[color:var(--color-ink)] hover:brightness-110 disabled:opacity-50"
            >
              {form.id ? 'Salva modifiche' : 'Crea NPC'}
            </button>
          </div>
          <p className="text-xs text-parchment-dim">
            PF, CA, competenza e caratteristiche si calcolano da soli da razza, classe e livello.
          </p>
        </div>
      </Panel>

      <Panel title={`NPC (${npcs.length})`}>
        {npcs.length === 0 ? (
          <p className="text-sm text-parchment-dim">Ancora nessun NPC. Creane uno qui sopra.</p>
        ) : (
          <ul className="space-y-2">
            {npcs.map((n) => (
              <NpcCard
                key={n.id}
                npc={n}
                onEdit={() => editNpc(n)}
                onRemove={() => run(removeNpc(token, n.id))}
                onHp={(hp) => run(patchNpc(token, n.id, { currentHp: hp }))}
                onNotes={(notes) => run(patchNpc(token, n.id, { notes }))}
              />
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function NpcCard({
  npc: n,
  onEdit,
  onRemove,
  onHp,
  onNotes,
}: {
  npc: Npc;
  onEdit: () => void;
  onRemove: () => void;
  onHp: (hp: number) => void;
  onNotes: (notes: string) => void;
}) {
  const [dmg, setDmg] = useState('');
  const [notes, setNotes] = useState(n.notes ?? '');

  function applyDmg(sign: number) {
    const v = Number(dmg);
    if (!Number.isFinite(v) || v <= 0) return;
    onHp(n.currentHp + sign * v);
    setDmg('');
  }

  return (
    <li className="rounded-lg border border-ink-border bg-ink-raised p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="font-display text-parchment">{n.name}</span>
          <p className="text-xs text-parchment-dim">
            {n.race} · {n.className}
            {n.subclass ? ` (${n.subclass})` : ''} · Liv {n.level}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-md border border-ink-border px-2 py-1 text-xs text-parchment hover:border-gold"
          >
            Modifica
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md border border-ink-border px-2 py-1 text-xs text-parchment-dim hover:border-flag-red hover:text-flag-red"
          >
            Elimina
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-parchment-dim">
        <span>
          PF <span className="text-parchment">{n.currentHp}/{n.maxHp}</span>
        </span>
        <span>
          CA <span className="text-parchment">{n.armorClass}</span>
        </span>
        <span>
          Comp <span className="text-parchment">{formatMod(n.proficiencyBonus)}</span>
        </span>
        <span>
          Vel <span className="text-parchment">{n.speed}m</span>
        </span>
      </div>

      <div className="mt-1.5 grid grid-cols-6 gap-1">
        {ABILITIES.map((a) => (
          <div key={a} className="rounded border border-ink-border/60 py-1 text-center">
            <div className="text-[9px] uppercase text-ochre">{ABILITY_SHORT[a]}</div>
            <div className="text-xs text-parchment">{n.abilities[a]}</div>
            <div className="text-[10px] text-parchment-dim">{formatMod(modifier(n.abilities[a]))}</div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {[-5, -1, 1, 5].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onHp(n.currentHp + d)}
            className="rounded-md border border-ink-border px-2 py-0.5 text-xs text-parchment hover:border-gold"
          >
            {d > 0 ? `+${d}` : d}
          </button>
        ))}
        <input
          value={dmg}
          onChange={(e) => setDmg(e.target.value.replace(/[^0-9]/g, ''))}
          inputMode="numeric"
          placeholder="n"
          className="w-12 rounded-md border border-ink-border bg-[color:var(--color-ink)] px-1.5 py-0.5 text-center text-xs text-parchment focus:border-gold focus:outline-none"
        />
        <button
          type="button"
          onClick={() => applyDmg(-1)}
          className="rounded-md border border-flag-red/50 px-2 py-0.5 text-xs text-parchment hover:border-flag-red"
        >
          Danno
        </button>
        <button
          type="button"
          onClick={() => applyDmg(1)}
          className="rounded-md border border-ochre/60 px-2 py-0.5 text-xs text-parchment hover:border-ochre"
        >
          Cura
        </button>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => notes !== (n.notes ?? '') && onNotes(notes)}
        placeholder="Note su questo NPC…"
        className={cn(inputClass, 'mt-2 min-h-12 resize-y text-xs')}
      />
    </li>
  );
}
