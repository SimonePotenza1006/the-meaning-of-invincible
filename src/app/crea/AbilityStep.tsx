'use client';

import {
  ABILITIES,
  type Ability,
  formatMod,
  modifier,
  POINT_BUY_BUDGET,
  POINT_BUY_COST,
  POINT_BUY_MAX,
  POINT_BUY_MIN,
  pointBuyCost,
  STANDARD_ARRAY,
} from '@/lib/rules';
import {
  ABILITY_LABELS,
  ABILITY_SHORT,
  choiceBonuses,
  getRace,
  racialBonuses,
} from '@/lib/dnd';
import {
  finalScores,
  suggestedBaseScores,
  type WizardState,
} from '@/lib/character/build';
import { cn, Panel } from './ui';

const ARRAY_VALUES = [...STANDARD_ARRAY];

export function AbilityStep({
  state,
  update,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
}) {
  const race = getRace(state.raceKey ?? '');
  const subrace = race?.subraces?.find((s) => s.key === state.subraceKey);
  const racial = racialBonuses(race, subrace);
  const chosen = choiceBonuses(state.raceBonusChoice, race?.bonusChoice?.amount ?? 1);
  const totalBonus: Partial<Record<Ability, number>> = {};
  for (const a of ABILITIES) {
    totalBonus[a] = (racial[a] ?? 0) + (chosen[a] ?? 0);
  }
  const finals = finalScores(state);
  const pb = pointBuyCost(state.baseScores);

  function setMethod(method: 'array' | 'pointbuy') {
    if (method === state.abilityMethod) return;
    if (method === 'array') {
      update({
        abilityMethod: 'array',
        baseScores: suggestedBaseScores(state.classKey ?? ''),
      });
    } else {
      const reset = {} as WizardState['baseScores'];
      for (const a of ABILITIES) reset[a] = 8;
      update({ abilityMethod: 'pointbuy', baseScores: reset });
    }
  }

  // Array mode: assigning a value to one ability swaps it with whoever held it.
  function assignArrayValue(ability: Ability, value: number) {
    const scores = { ...state.baseScores };
    const previous = scores[ability];
    const holder = ABILITIES.find((a) => a !== ability && scores[a] === value);
    if (holder) scores[holder] = previous;
    scores[ability] = value;
    update({ baseScores: scores });
  }

  function stepPointBuy(ability: Ability, delta: number) {
    const current = state.baseScores[ability];
    const next = current + delta;
    if (next < POINT_BUY_MIN || next > POINT_BUY_MAX) return;
    const scores = { ...state.baseScores, [ability]: next };
    if (pointBuyCost(scores).totalCost > POINT_BUY_BUDGET) return;
    update({ baseScores: scores });
  }

  const bonusChoice = race?.bonusChoice;
  function toggleBonusChoice(ability: Ability) {
    const picked = state.raceBonusChoice.includes(ability);
    if (picked) {
      update({ raceBonusChoice: state.raceBonusChoice.filter((a) => a !== ability) });
    } else if (state.raceBonusChoice.length < (bonusChoice?.count ?? 0)) {
      update({ raceBonusChoice: [...state.raceBonusChoice, ability] });
    }
  }

  return (
    <div className="space-y-4">
      {/* Method toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-ink-border bg-ink-raised p-1">
        {(
          [
            ['array', 'Array consigliato'],
            ['pointbuy', 'Point buy'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMethod(value)}
            aria-pressed={state.abilityMethod === value}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              state.abilityMethod === value
                ? 'bg-gold text-[color:var(--color-ink)]'
                : 'text-parchment-dim hover:text-parchment',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {state.abilityMethod === 'array' ? (
        <p className="text-sm text-parchment-dim">
          Disposizione base consigliata per la classe. Cambia i valori a piacere: verranno
          scambiati automaticamente per restare unici.
        </p>
      ) : (
        <p className="text-sm text-parchment-dim">
          Punti disponibili:{' '}
          <span
            className={cn(
              'font-semibold',
              pb.remaining === 0 ? 'text-gold' : 'text-parchment',
            )}
          >
            {pb.remaining}
          </span>{' '}
          / {POINT_BUY_BUDGET}
        </p>
      )}

      {/* Ability rows */}
      <div className="space-y-2">
        {ABILITIES.map((ability) => {
          const base = state.baseScores[ability];
          const bonus = totalBonus[ability] ?? 0;
          const total = finals[ability];
          return (
            <div
              key={ability}
              className="flex items-center gap-3 rounded-xl border border-ink-border bg-ink-raised px-3 py-2.5"
            >
              <div className="w-24 shrink-0">
                <div className="font-display text-sm text-gold">{ABILITY_SHORT[ability]}</div>
                <div className="text-xs text-parchment-dim">{ABILITY_LABELS[ability]}</div>
              </div>

              <div className="flex flex-1 items-center justify-center">
                {state.abilityMethod === 'array' ? (
                  <select
                    aria-label={`Valore base per ${ABILITY_LABELS[ability]}`}
                    value={base}
                    onChange={(e) => assignArrayValue(ability, Number(e.target.value))}
                    className="rounded-lg border border-ink-border bg-[color:var(--color-ink)] px-3 py-1.5 text-center text-base text-parchment focus:border-gold focus:outline-none"
                  >
                    {ARRAY_VALUES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <StepBtn
                      label="−"
                      onClick={() => stepPointBuy(ability, -1)}
                      disabled={base <= POINT_BUY_MIN}
                    />
                    <span className="w-8 text-center text-base tabular-nums text-parchment">
                      {base}
                    </span>
                    <StepBtn
                      label="+"
                      onClick={() => stepPointBuy(ability, 1)}
                      disabled={
                        base >= POINT_BUY_MAX ||
                        pointBuyCost({ ...state.baseScores, [ability]: base + 1 }).totalCost >
                          POINT_BUY_BUDGET
                      }
                    />
                  </div>
                )}
              </div>

              <div className="w-10 shrink-0 text-center">
                {bonus !== 0 ? (
                  <span className="text-sm font-medium text-ochre">{formatMod(bonus)}</span>
                ) : (
                  <span className="text-sm text-parchment-dim">—</span>
                )}
              </div>

              <div className="w-16 shrink-0 text-right">
                <div className="font-display text-xl leading-none text-parchment">{total}</div>
                <div className="text-xs text-parchment-dim">{formatMod(modifier(total))}</div>
              </div>
            </div>
          );
        })}
      </div>

      {bonusChoice && (
        <Panel title={`Bonus di specie · scegli ${bonusChoice.count}`}>
          <p className="mb-3 text-sm text-parchment-dim">
            La tua specie concede +{bonusChoice.amount} a {bonusChoice.count} caratteristiche a
            scelta.
          </p>
          <div className="flex flex-wrap gap-2">
            {ABILITIES.filter((a) => !(bonusChoice.exclude ?? []).includes(a)).map((a) => {
              const picked = state.raceBonusChoice.includes(a);
              const full =
                !picked && state.raceBonusChoice.length >= bonusChoice.count;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleBonusChoice(a)}
                  disabled={full}
                  aria-pressed={picked}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm transition-colors',
                    picked
                      ? 'border-gold bg-gold text-[color:var(--color-ink)]'
                      : 'border-ink-border bg-ink-raised text-parchment-dim',
                    full && 'cursor-not-allowed opacity-45',
                  )}
                >
                  {ABILITY_LABELS[a]}
                </button>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
}

function StepBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg border border-ink-border text-lg text-parchment transition-colors',
        disabled ? 'cursor-not-allowed opacity-40' : 'hover:border-gold hover:text-gold',
      )}
    >
      {label}
    </button>
  );
}
