'use client';

import { useState } from 'react';
import { ABILITIES, type Ability, formatMod } from '@/lib/rules';
import {
  ABILITY_LABELS,
  ABILITY_SHORT,
  CONDITIONS,
  SKILL_LABELS,
  skillLabel,
} from '@/lib/dnd';
import {
  abilityMod,
  initiativeMod,
  saveMod,
  skillMod,
} from '@/lib/character/derive-sheet';
import { useCampaignState } from '@/lib/game/client';
import { performDice, performRoll, type Adv } from '@/lib/game/roll';
import {
  changeHp,
  setDeathSaves,
  setTempHp,
  spendHitDie,
  toggleCondition,
} from '@/app/game-actions';
import {
  AdvToggle,
  HpBar,
  LogFeed,
  RollRow,
  RollTile,
  StatTile,
  Stepper,
} from '@/components/game';
import { Chip, cn, Panel } from '@/app/crea/ui';
import { CombatTracker } from '@/components/combat/CombatTracker';
import { LevelUpPanel } from '@/components/LevelUpPanel';
import { AttacksPanel } from '@/components/AttacksPanel';
import { SpellsPanel } from '@/components/SpellsPanel';
import { MagicItemsPanel } from '@/components/MagicItemsPanel';
import type { CampaignState } from '@/lib/game/repo';

const DICE = ['d20', 'd12', 'd10', 'd8', 'd6', 'd4'];
const SKILL_KEYS = Object.keys(SKILL_LABELS).sort((a, b) =>
  skillLabel(a).localeCompare(skillLabel(b), 'it'),
);

interface RequestData {
  mode?: string;
  key?: string;
  label?: string;
  advantage?: boolean;
}

export function PlayerSheet({ token, initial }: { token: string; initial: CampaignState }) {
  const { state, refresh } = useCampaignState(token, initial);
  const [adv, setAdv] = useState<Adv>('normal');

  const run = async (p: Promise<unknown>) => {
    try {
      await p;
    } finally {
      refresh();
    }
  };

  const sheet = state.character?.sheet;
  if (!sheet) {
    return (
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-8">
        <Panel>
          <p className="text-parchment-dim">Personaggio non disponibile.</p>
        </Panel>
      </main>
    );
  }

  const answered = new Set(
    state.events
      .filter((e) => e.kind === 'roll' && (e.data as { requestId?: number })?.requestId)
      .map((e) => (e.data as { requestId: number }).requestId),
  );
  const pending = state.events.filter((e) => e.kind === 'request' && !answered.has(e.id));

  function reqMod(data: RequestData): number {
    if (!data.key) return 0;
    if (data.mode === 'skill') return skillMod(sheet!, data.key);
    if (data.mode === 'save') return saveMod(sheet!, data.key as Ability);
    if (data.mode === 'ability') return abilityMod(sheet!, data.key as Ability);
    return 0;
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 space-y-4 px-5 py-6">
      {/* Identity */}
      <div className="rounded-xl border border-gold/40 bg-burgundy/30 p-4 text-center">
        <h1 className="font-display text-2xl text-parchment">{sheet.identity.name}</h1>
        <p className="mt-1 text-sm text-parchment-dim">
          {sheet.identity.subrace ?? sheet.identity.race} · {sheet.identity.className}
          {sheet.identity.subclass ? ` · ${sheet.identity.subclass}` : ''} · Liv{' '}
          {sheet.identity.level}
        </p>
        <p className="text-xs text-parchment-dim">PE {sheet.identity.xp}</p>
      </div>

      <LevelUpPanel token={token} sheet={sheet} refresh={refresh} />

      <CombatTracker token={token} state={state} refresh={refresh} />

      {/* Pending DM requests */}
      {pending.map((e) => {
        const data = (e.data ?? {}) as RequestData;
        const useAdv: Adv = data.advantage ? 'advantage' : adv;
        return (
          <div
            key={e.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-gold bg-burgundy/40 p-4"
          >
            <div>
              <div className="text-xs uppercase tracking-wide text-gold">Il DM chiede un tiro</div>
              <div className="text-parchment">{data.label}</div>
            </div>
            <button
              type="button"
              onClick={() => run(performRoll(token, data.label ?? 'Tiro', reqMod(data), useAdv, e.id))}
              className="shrink-0 rounded-lg bg-gold px-4 py-2 font-medium text-[color:var(--color-ink)] hover:brightness-110"
            >
              Tira
            </button>
          </div>
        );
      })}

      {/* HP */}
      <Panel title="Punti Ferita">
        <HpBar
          current={sheet.combat.currentHp}
          max={sheet.combat.maxHp}
          temp={sheet.combat.tempHp}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {[-5, -1, 1, 5].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => run(changeHp(token, d))}
              className="rounded-md border border-ink-border px-2.5 py-1 text-sm text-parchment hover:border-gold"
            >
              {d > 0 ? `+${d}` : d}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-parchment-dim">PF temporanei</span>
          <Stepper
            value={sheet.combat.tempHp}
            onDec={() => run(setTempHp(token, Math.max(0, sheet.combat.tempHp - 1)))}
            onInc={() => run(setTempHp(token, sheet.combat.tempHp + 1))}
          />
        </div>
        {sheet.combat.hitDiceRemaining > 0 && (
          <button
            type="button"
            onClick={() => run(spendHitDie(token))}
            className="mt-3 w-full rounded-lg border border-ochre/60 px-3 py-2 text-sm text-parchment hover:border-ochre"
          >
            Riposo breve · spendi dado vita ({sheet.combat.hitDiceRemaining} rimasti)
          </button>
        )}
      </Panel>

      {/* Death saves */}
      {sheet.combat.currentHp === 0 && (
        <Panel title="Tiri salvezza contro morte">
          <DeathDots
            label="Successi"
            count={sheet.combat.deathSaves.successes}
            active="var(--color-ochre)"
            onSet={(n) => run(setDeathSaves(token, n, sheet.combat.deathSaves.failures))}
          />
          <DeathDots
            label="Fallimenti"
            count={sheet.combat.deathSaves.failures}
            active="var(--color-flag-red)"
            onSet={(n) => run(setDeathSaves(token, sheet.combat.deathSaves.successes, n))}
          />
          <button
            type="button"
            onClick={() => run(performDice(token, 'd20'))}
            className="mt-3 w-full rounded-lg border border-ink-border px-3 py-2 text-sm text-parchment hover:border-gold"
          >
            Tira (d20)
          </button>
        </Panel>
      )}

      {/* Combat */}
      <div className="grid grid-cols-4 gap-2">
        <StatTile label="CA" value={sheet.combat.armorClass} />
        <StatTile label="Velocità" value={`${sheet.combat.speed}m`} />
        <StatTile label="Comp." value={formatMod(sheet.proficiencies.proficiencyBonus)} />
        <button
          type="button"
          onClick={() => run(performRoll(token, 'Iniziativa', initiativeMod(sheet), adv))}
        >
          <StatTile label="Iniz. ▶" value={formatMod(initiativeMod(sheet))} />
        </button>
      </div>

      {/* Advantage toggle */}
      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-parchment-dim">Modalità di tiro</p>
        <AdvToggle value={adv} onChange={setAdv} />
      </div>

      {/* Attacks */}
      <AttacksPanel token={token} sheet={sheet} refresh={refresh} adv={adv} />

      {/* Abilities */}
      <Panel title="Caratteristiche — tocca per tirare">
        <div className="grid grid-cols-3 gap-2">
          {ABILITIES.map((a) => (
            <RollTile
              key={a}
              label={ABILITY_SHORT[a]}
              score={sheet.abilities[a]}
              mod={abilityMod(sheet, a)}
              onClick={() =>
                run(performRoll(token, `Prova di ${ABILITY_LABELS[a]}`, abilityMod(sheet, a), adv))
              }
            />
          ))}
        </div>
      </Panel>

      {/* Saving throws */}
      <Panel title="Tiri salvezza">
        <div className="grid grid-cols-2 gap-2">
          {ABILITIES.map((a) => (
            <RollRow
              key={a}
              label={ABILITY_LABELS[a]}
              mod={saveMod(sheet, a)}
              highlight={sheet.proficiencies.savingThrows.includes(a)}
              onClick={() =>
                run(performRoll(token, `TS ${ABILITY_LABELS[a]}`, saveMod(sheet, a), adv))
              }
            />
          ))}
        </div>
      </Panel>

      {/* Skills */}
      <Panel title="Abilità">
        <div className="grid gap-2">
          {SKILL_KEYS.map((s) => (
            <RollRow
              key={s}
              label={skillLabel(s)}
              mod={skillMod(sheet, s)}
              highlight={sheet.proficiencies.skills.includes(s)}
              onClick={() => run(performRoll(token, skillLabel(s), skillMod(sheet, s), adv))}
            />
          ))}
        </div>
      </Panel>

      {/* Spellcasting */}
      <SpellsPanel token={token} sheet={sheet} refresh={refresh} />

      {/* Magic items */}
      <MagicItemsPanel token={token} sheet={sheet} refresh={refresh} />

      {/* Conditions */}
      <Panel title="Condizioni">
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={sheet.conditions.includes(c)}
              onClick={() => run(toggleCondition(token, c))}
            />
          ))}
        </div>
      </Panel>

      {/* Dice tray */}
      <Panel title="Dadi">
        <div className="flex flex-wrap gap-2">
          {DICE.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => run(performDice(token, d))}
              className="rounded-md border border-ink-border px-3 py-1.5 text-sm text-parchment hover:border-gold"
            >
              {d}
            </button>
          ))}
        </div>
      </Panel>

      {/* Log */}
      <Panel title="Cronaca">
        <LogFeed events={state.events} />
      </Panel>
    </main>
  );
}

function DeathDots({
  label,
  count,
  active,
  onSet,
}: {
  label: string;
  count: number;
  active: string;
  onSet: (n: number) => void;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm text-parchment-dim">{label}</span>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => {
          const filled = i < count;
          return (
            <button
              key={i}
              type="button"
              aria-label={`${label} ${i + 1}`}
              onClick={() => onSet(count === i + 1 ? i : i + 1)}
              className={cn(
                'h-6 w-6 rounded-full border transition-colors',
                filled ? 'border-transparent' : 'border-ink-border',
              )}
              style={{ background: filled ? active : 'transparent' }}
            />
          );
        })}
      </div>
    </div>
  );
}
