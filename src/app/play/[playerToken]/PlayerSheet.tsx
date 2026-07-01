'use client';

import { useState } from 'react';
import {
  GiBattleGear,
  GiCrossedSwords,
  GiDiceTwentyFacesTwenty,
  GiHearts,
  GiNotebook,
  GiScrollUnfurled,
  GiSpellBook,
  GiSwapBag,
} from 'react-icons/gi';
import { ABILITIES, type Ability, formatMod } from '@/lib/rules';
import { ABILITY_LABELS, ABILITY_SHORT, SKILL_LABELS, skillLabel } from '@/lib/dnd';
import { abilityMod, initiativeMod, saveMod, skillMod } from '@/lib/character/derive-sheet';
import { useCampaignState } from '@/lib/game/client';
import { performDice, performRoll, type Adv } from '@/lib/game/roll';
import {
  changeHp,
  savePlayerNotes,
  setDeathSaves,
  setTempHp,
  spendHitDie,
  spendInspiration,
} from '@/app/game-actions';
import { AdvToggle, HpBar, LogFeed, RollRow, RollTile, StatTile, Stepper } from '@/components/game';
import { cn, Panel } from '@/app/crea/ui';
import { SheetShell, type ShellSection } from '@/components/SheetShell';
import { CombatTracker } from '@/components/combat/CombatTracker';
import { LevelUpPanel } from '@/components/LevelUpPanel';
import { AttacksPanel } from '@/components/AttacksPanel';
import { SpellsPanel } from '@/components/SpellsPanel';
import { MagicItemsPanel } from '@/components/MagicItemsPanel';
import { NotesPanel } from '@/components/NotesPanel';
import { RollRequestDialog } from '@/components/RollRequestDialog';
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

  // ── Section: Vitali (HP, conditions, dice) ──
  const vitali = (
    <>
      <Panel title="Punti Ferita">
        <HpBar current={sheet.combat.currentHp} max={sheet.combat.maxHp} temp={sheet.combat.tempHp} />
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

      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-parchment-dim">Modalità di tiro</p>
        <AdvToggle value={adv} onChange={setAdv} />
      </div>

      {sheet.inspiration && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-gold/50 bg-burgundy/30 p-3">
          <span className="text-sm text-gold">✦ Hai l’Ispirazione</span>
          <button
            type="button"
            onClick={() => run(spendInspiration(token))}
            className="rounded-lg border border-gold px-3 py-1.5 text-sm text-parchment transition-colors hover:bg-gold hover:text-[color:var(--color-ink)]"
          >
            Usa (vantaggio)
          </button>
        </div>
      )}

      <Panel title="Stati e condizioni">
        {sheet.conditions.length === 0 ? (
          <p className="text-sm text-parchment-dim">Nessuno stato attivo. È il DM ad assegnare gli stati.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sheet.conditions.map((c) => (
              <span
                key={c}
                className="rounded-full border border-flag-red/50 bg-flag-red/10 px-3 py-1 text-sm text-flag-red"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </Panel>

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
    </>
  );

  // ── Section: Prove (abilities, saves, skills) ──
  const prove = (
    <>
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

      <Panel title="Tiri salvezza">
        <div className="grid grid-cols-2 gap-2">
          {ABILITIES.map((a) => (
            <RollRow
              key={a}
              label={ABILITY_LABELS[a]}
              mod={saveMod(sheet, a)}
              highlight={sheet.proficiencies.savingThrows.includes(a)}
              onClick={() => run(performRoll(token, `TS ${ABILITY_LABELS[a]}`, saveMod(sheet, a), adv))}
            />
          ))}
        </div>
      </Panel>

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
    </>
  );

  const combattimento = (
    <>
      <CombatTracker token={token} state={state} refresh={refresh} />
      <AttacksPanel token={token} sheet={sheet} refresh={refresh} adv={adv} />
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
    </>
  );

  const privilegi = (
    <Panel title={`Privilegi e tratti (${sheet.features.length})`}>
      {sheet.features.length === 0 ? (
        <p className="text-sm text-parchment-dim">Ancora nessun privilegio.</p>
      ) : (
        <ul className="space-y-2">
          {sheet.features.map((f, i) => (
            <li key={`${f.source}-${f.name}-${i}`} className="text-sm">
              <span className="font-medium text-parchment">{f.name}</span>{' '}
              <span className="text-xs text-ochre">· {f.source}</span>
              {f.description && (
                <span className="mt-0.5 block text-parchment-dim">{f.description}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );

  const sections: ShellSection[] = [
    { id: 'vitali', label: 'Vitali', icon: <GiHearts />, content: vitali },
    { id: 'combattimento', label: 'Combattimento', icon: <GiBattleGear />, content: combattimento },
    {
      id: 'attacchi',
      label: 'Attacchi',
      icon: <GiCrossedSwords />,
      content: <AttacksPanel token={token} sheet={sheet} refresh={refresh} adv={adv} />,
    },
    { id: 'prove', label: 'Prove', icon: <GiDiceTwentyFacesTwenty />, content: prove },
    {
      id: 'incantesimi',
      label: 'Incantesimi',
      icon: <GiSpellBook />,
      hidden: !sheet.spellcasting,
      content: <SpellsPanel token={token} sheet={sheet} refresh={refresh} />,
    },
    { id: 'privilegi', label: 'Privilegi', icon: <GiScrollUnfurled />, content: privilegi },
    {
      id: 'oggetti',
      label: 'Oggetti',
      icon: <GiSwapBag />,
      content: <MagicItemsPanel token={token} sheet={sheet} refresh={refresh} />,
    },
    {
      id: 'note',
      label: 'Note',
      icon: <GiNotebook />,
      content: (
        <NotesPanel
          initial={sheet.notes ?? ''}
          save={(text) => run(savePlayerNotes(token, text))}
        />
      ),
    },
  ];

  // Answer the oldest pending request first.
  const pendingOrdered = [...pending].reverse();

  return (
    <>
      {/* Non-dismissable dialogs — overlay any section. Level-up takes priority. */}
      {sheet.pendingLevelUp ? (
        <LevelUpPanel token={token} sheet={sheet} refresh={refresh} />
      ) : (
        pendingOrdered.length > 0 && (
          <RollRequestDialog
            key={pendingOrdered[0].id}
            requests={pendingOrdered}
            token={token}
            modFor={reqMod}
            inspiration={sheet.inspiration}
            onSpendInspiration={() => spendInspiration(token)}
            onRolled={refresh}
          />
        )
      )}

      <SheetShell
        eyebrow="La tua scheda"
        title={sheet.identity.name}
        subtitle={
          <>
            {sheet.identity.subrace ?? sheet.identity.race} · {sheet.identity.className}
            {sheet.identity.subclass ? ` · ${sheet.identity.subclass}` : ''} · Liv {sheet.identity.level}
            {' · '}PE {sheet.identity.xp}
          </>
        }
        sections={sections}
        log={<LogFeed events={state.events} />}
      />
    </>
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
