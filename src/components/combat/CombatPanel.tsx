'use client';

import { useState } from 'react';
import { CONDITIONS, TERRAINS } from '@/lib/dnd';
import {
  addCustomCombatant,
  addMonsterCombatant,
  createEncounter,
  damageCombatant,
  endEncounter,
  nextTurn,
  prevTurn,
  removeCombatant,
  rollInitiative,
  rollNpcInitiative,
  setTerrain,
  startEncounter,
  toggleCombatantCondition,
} from '@/app/combat-actions';
import { performDice, performRoll, type Adv } from '@/lib/game/roll';
import { Chip, Panel, cn } from '@/app/crea/ui';
import {
  currentCombatantId,
  difficultyLabel,
  orderByInitiative,
  sideColor,
  sideLabel,
} from '@/lib/combat/util';
import { parseMonsterAttacks } from '@/lib/combat/monster-attacks';
import { MonsterBrowser } from './MonsterBrowser';
import { SceneHeader } from './SceneHeader';
import type { CampaignState } from '@/lib/game/repo';
import type { Combatant } from '@/db';

type Run = (p: Promise<unknown>) => Promise<void>;

const inputClass =
  'rounded-lg border border-ink-border bg-[color:var(--color-ink)] px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none';

export function CombatPanel({
  token,
  state,
  refresh,
  adv = 'normal',
  secret = false,
}: {
  token: string;
  state: CampaignState;
  refresh: () => void;
  adv?: Adv;
  secret?: boolean;
}) {
  const run: Run = async (p) => {
    try {
      await p;
    } finally {
      refresh();
    }
  };
  const enc = state.encounter;

  if (!enc) return <NewEncounterForm token={token} run={run} />;
  if (enc.status === 'draft') return <EncounterBuilder token={token} state={state} run={run} />;
  return <ActiveCombat token={token} state={state} run={run} adv={adv} secret={secret} />;
}

function NewEncounterForm({ token, run }: { token: string; run: Run }) {
  const [name, setName] = useState('');
  const [terrain, setTerrainKey] = useState('plains');
  return (
    <Panel title="Combattimento">
      <p className="mb-3 text-sm text-parchment-dim">
        Prepara un incontro: dai un nome, scegli il terreno, poi aggiungi i nemici.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome dell'incontro (es. Agguato nel bosco)"
          className={cn(inputClass, 'flex-1')}
        />
        <select value={terrain} onChange={(e) => setTerrainKey(e.target.value)} className={inputClass}>
          {TERRAINS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => run(createEncounter(token, name, terrain))}
          className="rounded-lg bg-gold px-4 py-2 font-medium text-[color:var(--color-ink)] hover:brightness-110"
        >
          Prepara
        </button>
      </div>
    </Panel>
  );
}

function EncounterBuilder({ token, state, run }: { token: string; state: CampaignState; run: Run }) {
  const enc = state.encounter!;
  const combatants = state.combatants;
  const totalXp = combatants
    .filter((c) => c.side === 'enemy')
    .reduce((sum, c) => sum + (c.statblock?.xp ?? 0), 0);

  return (
    <Panel title={`Prepara: ${enc.name}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-parchment-dim">Terreno</span>
        <select
          value={enc.terrain}
          onChange={(e) => run(setTerrain(token, e.target.value))}
          className={inputClass}
        >
          {TERRAINS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.name}
            </option>
          ))}
        </select>
        <span className="ml-auto text-xs text-parchment-dim">
          PE totali {totalXp} · Difficoltà ~{' '}
          <span className="text-ochre">{difficultyLabel(totalXp)}</span>
        </span>
      </div>

      <div className="mb-4 space-y-1.5">
        {combatants.length === 0 && (
          <p className="text-sm text-parchment-dim">Nessun combattente. Aggiungi nemici o alleati.</p>
        )}
        {combatants.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-ink-border bg-ink-raised px-3 py-2"
          >
            <span className="flex items-center gap-2">
              <span style={{ color: sideColor(c.side) }} aria-hidden>
                ●
              </span>
              <span className="text-parchment">{c.name}</span>
              <span className="text-xs text-parchment-dim">
                {sideLabel(c.side)} · CA {c.ac ?? '—'} · PF {c.maxHp ?? '—'}
              </span>
            </span>
            {c.side !== 'player' && (
              <button
                type="button"
                onClick={() => run(removeCombatant(token, c.id))}
                className="text-xs text-parchment-dim hover:text-flag-red"
              >
                Rimuovi
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ochre">
          Bestiario SRD
        </h3>
        <MonsterBrowser onAdd={(index, side, count) => run(addMonsterCombatant(token, index, side, count))} />
      </div>

      <CustomCombatantForm token={token} run={run} />

      <button
        type="button"
        disabled={combatants.length === 0}
        onClick={() => run(startEncounter(token))}
        className={cn(
          'mt-4 w-full rounded-lg px-4 py-2.5 font-medium transition-all',
          combatants.length === 0
            ? 'cursor-not-allowed bg-ink-raised text-parchment-dim'
            : 'bg-gold text-[color:var(--color-ink)] hover:brightness-110',
        )}
      >
        Inizia combattimento
      </button>
    </Panel>
  );
}

function CustomCombatantForm({ token, run }: { token: string; run: Run }) {
  const [name, setName] = useState('');
  const [maxHp, setMaxHp] = useState('10');
  const [ac, setAc] = useState('12');
  const [initMod, setInitMod] = useState('0');
  const [side, setSide] = useState<'enemy' | 'ally'>('ally');

  function add() {
    if (!name.trim()) return;
    run(
      addCustomCombatant(token, {
        name,
        side,
        maxHp: Number(maxHp) || 1,
        ac: Number(ac) || 10,
        initMod: Number(initMod) || 0,
      }),
    );
    setName('');
  }

  return (
    <details className="rounded-lg border border-ink-border bg-ink-raised p-3">
      <summary className="cursor-pointer text-sm text-parchment">PNG / combattente su misura</summary>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className={cn(inputClass, 'col-span-2')} />
        <input value={maxHp} onChange={(e) => setMaxHp(e.target.value.replace(/[^0-9]/g, ''))} placeholder="PF" inputMode="numeric" className={inputClass} />
        <input value={ac} onChange={(e) => setAc(e.target.value.replace(/[^0-9]/g, ''))} placeholder="CA" inputMode="numeric" className={inputClass} />
        <input value={initMod} onChange={(e) => setInitMod(e.target.value.replace(/[^0-9-]/g, ''))} placeholder="Mod Iniz." className={inputClass} />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <select value={side} onChange={(e) => setSide(e.target.value as 'enemy' | 'ally')} className={inputClass}>
          <option value="ally">Alleato</option>
          <option value="enemy">Nemico</option>
        </select>
        <button type="button" onClick={add} className="rounded-lg border border-ochre/60 px-3 py-2 text-sm text-parchment hover:border-ochre">
          Aggiungi
        </button>
      </div>
    </details>
  );
}

function ActiveCombat({
  token,
  state,
  run,
  adv,
  secret,
}: {
  token: string;
  state: CampaignState;
  run: Run;
  adv: Adv;
  secret: boolean;
}) {
  const enc = state.encounter!;
  const ordered = orderByInitiative(state.combatants);
  const currentId = currentCombatantId(enc, state.combatants);
  const pcId = state.combatants.find((c) => c.side === 'player')?.id ?? null;

  return (
    <div className="space-y-3">
      <SceneHeader terrainKey={enc.terrain} round={enc.round} encounter={enc.name} />
      <Panel title="Turni">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => run(prevTurn(token))} className="rounded-md border border-ink-border px-3 py-1.5 text-sm text-parchment hover:border-gold">
          ← Turno
        </button>
        <button type="button" onClick={() => run(nextTurn(token))} className="rounded-md bg-gold px-3 py-1.5 text-sm font-medium text-[color:var(--color-ink)] hover:brightness-110">
          Turno →
        </button>
        <button type="button" onClick={() => run(rollNpcInitiative(token))} className="rounded-md border border-ink-border px-3 py-1.5 text-sm text-parchment hover:border-gold">
          Tira iniziativa PNG
        </button>
        <button type="button" onClick={() => run(endEncounter(token))} className="ml-auto rounded-md border border-flag-red/50 px-3 py-1.5 text-sm text-parchment hover:border-flag-red">
          Termina
        </button>
      </div>

      <ul className="space-y-2">
        {ordered.map((c) => (
          <CombatantRow
            key={c.id}
            token={token}
            combatant={c}
            active={c.id === currentId}
            adv={adv}
            secret={secret}
            pcId={pcId}
            pcHp={
              c.side === 'player' && state.character?.sheet
                ? {
                    current: state.character.sheet.combat.currentHp,
                    max: state.character.sheet.combat.maxHp,
                  }
                : null
            }
            run={run}
          />
        ))}
      </ul>

      <details className="mt-4 rounded-lg border border-ink-border bg-ink-raised p-3">
        <summary className="cursor-pointer text-sm text-parchment">Aggiungi combattenti</summary>
        <div className="mt-3">
          <MonsterBrowser onAdd={(index, side, count) => run(addMonsterCombatant(token, index, side, count))} />
        </div>
      </details>
      </Panel>
    </div>
  );
}

function CombatantRow({
  token,
  combatant: c,
  active,
  adv,
  secret,
  pcId,
  pcHp,
  run,
}: {
  token: string;
  combatant: Combatant;
  active: boolean;
  adv: Adv;
  secret: boolean;
  pcId: number | null;
  pcHp: { current: number; max: number } | null;
  run: Run;
}) {
  const [dmg, setDmg] = useState('');
  const [lastDmg, setLastDmg] = useState<number | null>(null);
  const isPc = c.side === 'player';
  const attacks = c.side === 'enemy' ? parseMonsterAttacks(c.statblock?.description) : [];
  const hpText = pcHp
    ? `${pcHp.current}/${pcHp.max}`
    : `${c.currentHp ?? '—'}/${c.maxHp ?? '—'}`;

  function applyDmg(sign: number) {
    const n = Number(dmg);
    if (!Number.isFinite(n) || n <= 0) return;
    run(damageCombatant(token, c.id, sign * n));
    setDmg('');
  }

  return (
    <li
      className={cn(
        'rounded-lg border p-3',
        active ? 'border-gold bg-burgundy/30' : 'border-ink-border bg-ink-raised',
        c.defeated && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {c.initiative == null && !isPc ? (
            <button
              type="button"
              onClick={() => run(rollInitiative(token, c.id))}
              className="rounded-md border border-ink-border px-1.5 text-xs text-parchment-dim hover:border-gold"
              title="Tira iniziativa"
            >
              🎲
            </button>
          ) : (
            <span className="w-7 shrink-0 text-center font-display text-gold">{c.initiative ?? '—'}</span>
          )}
          <span style={{ color: sideColor(c.side) }} aria-hidden>
            ●
          </span>
          <span className={cn('truncate text-parchment', active && 'font-semibold')}>{c.name}</span>
        </div>
        <span className="shrink-0 text-sm text-parchment-dim">
          CA {c.ac ?? '—'} · PF {hpText}
        </span>
      </div>

      {c.conditions && c.conditions.length > 0 && (
        <div className="mt-1.5 text-xs text-flag-red">{c.conditions.join(', ')}</div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {[-5, -1, 1, 5].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => run(damageCombatant(token, c.id, d))}
            className="rounded-md border border-ink-border px-2 py-0.5 text-xs text-parchment hover:border-gold"
          >
            {d > 0 ? `+${d}` : d}
          </button>
        ))}
        <input
          value={dmg}
          onChange={(e) => setDmg(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="n"
          inputMode="numeric"
          className="w-12 rounded-md border border-ink-border bg-[color:var(--color-ink)] px-1.5 py-0.5 text-center text-xs text-parchment focus:border-gold focus:outline-none"
        />
        <button type="button" onClick={() => applyDmg(-1)} className="rounded-md border border-flag-red/50 px-2 py-0.5 text-xs text-parchment hover:border-flag-red">
          Danno
        </button>
        <button type="button" onClick={() => applyDmg(1)} className="rounded-md border border-ochre/60 px-2 py-0.5 text-xs text-parchment hover:border-ochre">
          Cura
        </button>
        {!isPc && (
          <button
            type="button"
            onClick={() => run(removeCombatant(token, c.id))}
            className="ml-auto text-xs text-parchment-dim hover:text-flag-red"
          >
            Rimuovi
          </button>
        )}
      </div>

      {attacks.length > 0 && (
        <div className="mt-2 space-y-1.5 rounded-md border border-ink-border/70 bg-[color:var(--color-ink)] p-2">
          <p className="text-[11px] uppercase tracking-wide text-ochre">
            Attacchi{secret ? ' · segreti' : ''}
          </p>
          {attacks.map((a, i) => (
            <div key={i} className="flex flex-wrap items-center gap-1.5">
              <span className="min-w-16 text-xs text-parchment">{a.name}</span>
              <button
                type="button"
                onClick={() =>
                  run(performRoll(token, `${c.name} · ${a.name} (colpire)`, a.toHit, adv, undefined, secret))
                }
                className="rounded-md border border-gold/60 px-2 py-0.5 text-xs text-parchment hover:border-gold"
              >
                Colpire {a.toHit >= 0 ? `+${a.toHit}` : a.toHit}
              </button>
              <button
                type="button"
                onClick={() => run(performDice(token, a.damage, secret).then((r) => setLastDmg(r.total)))}
                className="rounded-md border border-ochre/60 px-2 py-0.5 text-xs text-parchment hover:border-ochre"
              >
                Danni {a.damage}
              </button>
            </div>
          ))}
          {lastDmg != null && pcId != null && (
            <button
              type="button"
              onClick={() => {
                run(damageCombatant(token, pcId, -lastDmg));
                setLastDmg(null);
              }}
              className="rounded-md border border-flag-red/60 px-2 py-0.5 text-xs text-parchment hover:border-flag-red"
            >
              Infliggi {lastDmg} al PG →
            </button>
          )}
        </div>
      )}

      {!isPc && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-parchment-dim">Condizioni</summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {CONDITIONS.map((cond) => (
              <Chip
                key={cond}
                label={cond}
                selected={(c.conditions ?? []).includes(cond)}
                onClick={() => run(toggleCombatantCondition(token, c.id, cond))}
              />
            ))}
          </div>
        </details>
      )}

      {c.statblock?.description && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-parchment-dim">Blocco statistiche</summary>
          <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-parchment-dim">
            {c.statblock.description}
          </p>
        </details>
      )}
    </li>
  );
}
