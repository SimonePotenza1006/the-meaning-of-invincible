'use client';

import { useState } from 'react';
import { ABILITIES, formatMod } from '@/lib/rules';
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
  grantXp,
  levelUp,
  requestRoll,
  toggleCondition,
} from '@/app/game-actions';
import {
  AdvToggle,
  HpBar,
  LogFeed,
  RollRow,
  RollTile,
  StatTile,
  TokenBox,
} from '@/components/game';
import { Chip, Panel } from '@/app/crea/ui';
import { CombatPanel } from '@/components/combat/CombatPanel';
import { AttacksPanel } from '@/components/AttacksPanel';
import { SpellsPanel } from '@/components/SpellsPanel';
import { MagicItemsPanel } from '@/components/MagicItemsPanel';
import type { CampaignState } from '@/lib/game/repo';

const DICE = ['d20', 'd12', 'd10', 'd8', 'd6', 'd4'];
const SKILL_KEYS = Object.keys(SKILL_LABELS).sort((a, b) =>
  skillLabel(a).localeCompare(skillLabel(b), 'it'),
);

export function DmDashboard({ token, initial }: { token: string; initial: CampaignState }) {
  const { state, refresh } = useCampaignState(token, initial);
  const [adv, setAdv] = useState<Adv>('normal');

  const run = async (p: Promise<unknown>) => {
    try {
      await p;
    } finally {
      refresh();
    }
  };

  const character = state.character;
  const sheet = character?.sheet ?? null;
  const ready = sheet && character?.status === 'active';

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ochre">Vista Master</p>
          <h1 className="font-display text-2xl text-parchment">{state.campaign.name}</h1>
        </div>
        <span className="text-xs text-parchment-dim">Aggiornamento automatico ogni pochi secondi</span>
      </header>

      {!ready ? (
        <div className="space-y-4">
          <Panel>
            <p className="text-parchment-dim">
              In attesa che la giocatrice crei il personaggio. Condividi il link qui sotto: quando
              avrà finito, la scheda comparirà qui in tempo reale.
            </p>
          </Panel>
          <TokenBox label="Link giocatore" path={`/play/${state.campaign.playerToken}`} />
        </div>
      ) : (
        <div className="space-y-4">
          <CombatPanel token={token} state={state} refresh={refresh} />
          <div className="grid gap-4 lg:grid-cols-3">
          {/* ── Character ── */}
          <div className="space-y-4 lg:col-span-2">
            <Panel>
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-display text-xl text-parchment">{sheet.identity.name}</h2>
                <span className="text-xs text-parchment-dim">PE {sheet.identity.xp}</span>
              </div>
              <p className="text-sm text-parchment-dim">
                {sheet.identity.subrace ?? sheet.identity.race} · {sheet.identity.className}
                {sheet.identity.subclass ? ` · ${sheet.identity.subclass}` : ''} · Liv{' '}
                {sheet.identity.level}
                {sheet.identity.alignment ? ` · ${sheet.identity.alignment}` : ''}
              </p>
              {sheet.pendingLevelUp && (
                <p className="mt-2 rounded-md border border-gold/50 bg-burgundy/30 px-2.5 py-1.5 text-xs text-gold">
                  Level up in corso: il giocatore sta sistemando il livello{' '}
                  {sheet.pendingLevelUp.level}.
                </p>
              )}
              {sheet.identity.pillar && (
                <p className="mt-2 text-sm italic text-parchment-dim">“{sheet.identity.pillar}”</p>
              )}
              {sheet.conditions.length > 0 && (
                <p className="mt-2 text-sm">
                  <span className="text-ochre">Condizioni: </span>
                  <span className="text-flag-red">{sheet.conditions.join(', ')}</span>
                </p>
              )}
            </Panel>

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
                <HpAmount onDamage={(n) => run(changeHp(token, -n))} onHeal={(n) => run(changeHp(token, n))} />
              </div>
            </Panel>

            <div className="grid grid-cols-4 gap-2">
              <StatTile label="CA" value={sheet.combat.armorClass} />
              <StatTile label="Velocità" value={`${sheet.combat.speed}m`} />
              <StatTile label="Comp." value={formatMod(sheet.proficiencies.proficiencyBonus)} />
              <button
                type="button"
                onClick={() =>
                  run(performRoll(token, 'Iniziativa (DM)', initiativeMod(sheet), adv))
                }
              >
                <StatTile label="Iniz. ▶" value={formatMod(initiativeMod(sheet))} />
              </button>
            </div>

            <AttacksPanel token={token} sheet={sheet} refresh={refresh} adv={adv} />

            <Panel title="Caratteristiche — tocca per tirare">
              <div className="grid grid-cols-3 gap-2">
                {ABILITIES.map((a) => (
                  <RollTile
                    key={a}
                    label={ABILITY_SHORT[a]}
                    score={sheet.abilities[a]}
                    mod={abilityMod(sheet, a)}
                    onClick={() =>
                      run(performRoll(token, `${ABILITY_LABELS[a]} (DM)`, abilityMod(sheet, a), adv))
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
                    onClick={() =>
                      run(performRoll(token, `TS ${ABILITY_LABELS[a]} (DM)`, saveMod(sheet, a), adv))
                    }
                  />
                ))}
              </div>
            </Panel>

            <Panel title="Abilità">
              <div className="grid gap-2 sm:grid-cols-2">
                {SKILL_KEYS.map((s) => (
                  <RollRow
                    key={s}
                    label={skillLabel(s)}
                    mod={skillMod(sheet, s)}
                    highlight={sheet.proficiencies.skills.includes(s)}
                    onClick={() =>
                      run(performRoll(token, `${skillLabel(s)} (DM)`, skillMod(sheet, s), adv))
                    }
                  />
                ))}
              </div>
            </Panel>

            <SpellsPanel token={token} sheet={sheet} refresh={refresh} />

            <MagicItemsPanel token={token} sheet={sheet} refresh={refresh} canCreate />

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

            <Panel title={`Privilegi e tratti (${sheet.features.length})`}>
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
            </Panel>
          </div>

          {/* ── Tools ── */}
          <div className="space-y-4">
            <Panel title="Vantaggio / Svantaggio">
              <AdvToggle value={adv} onChange={setAdv} />
              <p className="mt-2 text-xs text-parchment-dim">
                Vale per i tiri del DM e per le richieste al giocatore.
              </p>
            </Panel>

            <Panel title="Richiedi un tiro">
              <RequestForm token={token} adv={adv} onDone={refresh} />
            </Panel>

            <Panel title="Esperienza">
              <div className="flex flex-wrap gap-2">
                {[25, 50, 100, 300].map((x) => (
                  <button
                    key={x}
                    type="button"
                    onClick={() => run(grantXp(token, x))}
                    className="rounded-md border border-ink-border px-2.5 py-1 text-sm text-parchment hover:border-gold"
                  >
                    +{x}
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Livello">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-parchment">
                  Livello attuale: <span className="font-semibold text-gold">{sheet.identity.level}</span>
                </span>
                <button
                  type="button"
                  disabled={sheet.identity.level >= 20}
                  onClick={() => run(levelUp(token))}
                  className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-[color:var(--color-ink)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sali di livello ▲
                </button>
              </div>
              <p className="mt-2 text-xs text-parchment-dim">
                {sheet.pendingLevelUp
                  ? `In attesa che il giocatore sistemi il livello ${sheet.pendingLevelUp.level}.`
                  : 'Il giocatore sistemerà PF, sottoclasse e aumenti dalla sua scheda.'}
              </p>
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

            <TokenBox label="Link giocatore" path={`/play/${state.campaign.playerToken}`} />

            <Panel title="Cronaca">
              <LogFeed events={state.events} />
            </Panel>
          </div>
          </div>
        </div>
      )}
    </main>
  );
}

function HpAmount({
  onDamage,
  onHeal,
}: {
  onDamage: (n: number) => void;
  onHeal: (n: number) => void;
}) {
  const [v, setV] = useState('');
  const n = parseInt(v, 10);
  const valid = Number.isFinite(n) && n > 0;
  return (
    <div className="flex items-center gap-1">
      <input
        value={v}
        onChange={(e) => setV(e.target.value.replace(/[^0-9]/g, ''))}
        inputMode="numeric"
        placeholder="n"
        className="w-14 rounded-md border border-ink-border bg-[color:var(--color-ink)] px-2 py-1 text-center text-sm text-parchment focus:border-gold focus:outline-none"
      />
      <button
        type="button"
        disabled={!valid}
        onClick={() => {
          onDamage(n);
          setV('');
        }}
        className="rounded-md border border-flag-red/50 px-2 py-1 text-xs text-parchment hover:border-flag-red disabled:opacity-40"
      >
        Danno
      </button>
      <button
        type="button"
        disabled={!valid}
        onClick={() => {
          onHeal(n);
          setV('');
        }}
        className="rounded-md border border-ochre/60 px-2 py-1 text-xs text-parchment hover:border-ochre disabled:opacity-40"
      >
        Cura
      </button>
    </div>
  );
}

function RequestForm({
  token,
  adv,
  onDone,
}: {
  token: string;
  adv: Adv;
  onDone: () => void;
}) {
  const [mode, setMode] = useState<'ability' | 'save' | 'skill'>('skill');
  const [key, setKey] = useState('Perception');

  const selectClass =
    'w-full rounded-lg border border-ink-border bg-[color:var(--color-ink)] px-3 py-2 text-sm text-parchment focus:border-gold focus:outline-none';

  function changeMode(m: 'ability' | 'save' | 'skill') {
    setMode(m);
    setKey(m === 'skill' ? 'Perception' : 'STR');
  }

  async function send() {
    const label =
      mode === 'skill'
        ? skillLabel(key)
        : mode === 'save'
          ? `Tiro salvezza su ${ABILITY_LABELS[key as keyof typeof ABILITY_LABELS]}`
          : `Prova di ${ABILITY_LABELS[key as keyof typeof ABILITY_LABELS]}`;
    await requestRoll(token, { mode, key, label, advantage: adv === 'advantage' });
    onDone();
  }

  return (
    <div className="space-y-2">
      <select
        value={mode}
        onChange={(e) => changeMode(e.target.value as 'ability' | 'save' | 'skill')}
        className={selectClass}
      >
        <option value="skill">Prova di abilità</option>
        <option value="ability">Prova di caratteristica</option>
        <option value="save">Tiro salvezza</option>
      </select>
      <select value={key} onChange={(e) => setKey(e.target.value)} className={selectClass}>
        {mode === 'skill'
          ? SKILL_KEYS.map((s) => (
              <option key={s} value={s}>
                {skillLabel(s)}
              </option>
            ))
          : ABILITIES.map((a) => (
              <option key={a} value={a}>
                {ABILITY_LABELS[a]}
              </option>
            ))}
      </select>
      <button
        type="button"
        onClick={send}
        className="w-full rounded-lg bg-gold px-4 py-2 font-medium text-[color:var(--color-ink)] transition-all hover:brightness-110"
      >
        Richiedi al giocatore
      </button>
    </div>
  );
}
