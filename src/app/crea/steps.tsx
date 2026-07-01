'use client';

import { ABILITIES, type Ability, formatMod, modifier } from '@/lib/rules';
import {
  ABILITY_LABELS,
  ABILITY_SHORT,
  ALIGNMENTS,
  BACKGROUNDS,
  CLASSES,
  getBackground,
  getClass,
  getIcon,
  getRace,
  getSubclasses,
  RACES,
  skillLabel,
  subclassMeta,
  type AbilityBonuses,
  type BonusChoice,
} from '@/lib/dnd';
import {
  buildSheet,
  finalScores,
  suggestedBaseScores,
  type WizardState,
} from '@/lib/character/build';
import { ChoiceCard, Chip, cn, InfoRow, Panel } from './ui';

function bonusText(bonuses: AbilityBonuses, choice?: BonusChoice): string {
  const active = ABILITIES.filter((a) => bonuses[a]);
  // Collapse "every ability by the same amount" (e.g. Human +1) so the tile
  // subtitle stays short instead of listing all six and overflowing.
  const allSame =
    active.length === ABILITIES.length &&
    active.every((a) => bonuses[a] === bonuses[active[0]]);
  const parts = allSame
    ? [`Tutte +${bonuses[active[0]]}`]
    : active.map((a) => `${ABILITY_SHORT[a]} +${bonuses[a]}`);
  if (choice) parts.push(`+${choice.amount} a ${choice.count} a scelta`);
  return parts.join(' · ');
}

function toggleInList(list: string[], item: string, max: number): string[] {
  if (list.includes(item)) return list.filter((x) => x !== item);
  if (list.length >= max) return list;
  return [...list, item];
}

// ─── Step 1: Race ──────────────────────────────────────────────────────────
export function RaceStep({
  state,
  update,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
}) {
  const selected = getRace(state.raceKey ?? '');
  const subrace = selected?.subraces?.find((s) => s.key === state.subraceKey);
  return (
    <div className="space-y-3">
      {RACES.map((r) => (
        <div key={r.key}>
          <ChoiceCard
            icon={getIcon(r.icon)}
            title={r.name}
            subtitle={bonusText(r.abilityBonuses, r.bonusChoice)}
            description={r.description}
            selected={state.raceKey === r.key}
            onClick={() =>
              update({ raceKey: r.key, subraceKey: null, raceBonusChoice: [] })
            }
          />
          {state.raceKey === r.key && r.subraces && (
            <div className="ml-4 mt-2 space-y-2 border-l-2 border-ink-border pl-3">
              <p className="text-xs uppercase tracking-[0.15em] text-ochre">
                Scegli una sottorazza
              </p>
              {r.subraces.map((s) => (
                <ChoiceCard
                  key={s.key}
                  compact
                  icon={getIcon(r.icon)}
                  title={s.name}
                  subtitle={bonusText(s.abilityBonuses)}
                  description={s.description}
                  selected={state.subraceKey === s.key}
                  onClick={() => update({ subraceKey: s.key })}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {selected && (
        <Panel title="Tratti di specie">
          <ul className="space-y-2">
            {[...selected.traits, ...(subrace?.traits ?? [])].map((t) => (
              <li key={t.name} className="text-sm">
                <span className="font-medium text-parchment">{t.name}.</span>{' '}
                <span className="text-parchment-dim">{t.description}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}

// ─── Step 2: Class ─────────────────────────────────────────────────────────
export function ClassStep({
  state,
  update,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
}) {
  const selected = getClass(state.classKey ?? '');
  const meta = selected ? subclassMeta(selected.key) : undefined;
  const subclasses = selected ? getSubclasses(selected.key) : [];
  const picksSubclassNow = meta?.level === 1;
  return (
    <div className="space-y-3">
      {CLASSES.map((c) => (
        <ChoiceCard
          key={c.key}
          icon={getIcon(c.icon)}
          title={c.name}
          subtitle={`d${c.hitDie} · ${c.primaryAbility.map((a) => ABILITY_SHORT[a]).join('/')}`}
          description={c.description}
          selected={state.classKey === c.key}
          onClick={() =>
            update({
              classKey: c.key,
              subclassKey: null,
              baseScores: suggestedBaseScores(c.key),
              classSkills: [],
            })
          }
        />
      ))}

      {selected && picksSubclassNow && subclasses.length > 0 && (
        <div className="ml-4 mt-2 space-y-2 border-l-2 border-ink-border pl-3">
          <p className="text-xs uppercase tracking-[0.15em] text-ochre">
            Scegli: {meta?.label}
          </p>
          {subclasses.map((sc) => (
            <ChoiceCard
              key={sc.key}
              compact
              icon={getIcon(selected.icon)}
              title={sc.name}
              description={sc.description}
              selected={state.subclassKey === sc.key}
              onClick={() => update({ subclassKey: sc.key })}
            />
          ))}
        </div>
      )}

      {selected && meta && !picksSubclassNow && (
        <p className="rounded-lg border border-ink-border bg-ink-raised/70 px-3 py-2 text-xs text-parchment-dim">
          Sceglierai la tua specializzazione ({meta.label}) al livello {meta.level}, salendo di
          livello durante il gioco.
        </p>
      )}

      {selected && (
        <Panel title="Dettagli di classe">
          <InfoRow label="Dado vita" value={`d${selected.hitDie}`} />
          <InfoRow
            label="Tiri salvezza"
            value={selected.savingThrows.map((a) => ABILITY_SHORT[a]).join(', ')}
          />
          <InfoRow label="Armature" value={selected.armor} />
          <InfoRow label="Competenze" value={`${selected.skillChoice.choose} abilità a scelta`} />
          {selected.spellcastingAbility && (
            <InfoRow
              label="Incantesimi"
              value={`sì (${ABILITY_LABELS[selected.spellcastingAbility]})`}
            />
          )}
          <ul className="mt-3 space-y-2">
            {selected.features.map((f) => (
              <li key={f.name} className="text-sm">
                <span className="font-medium text-parchment">{f.name}.</span>{' '}
                <span className="text-parchment-dim">{f.description}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}

// ─── Step 3: Background ──────────────────────────────────────────────────────
export function BackgroundStep({
  state,
  update,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
}) {
  const selected = getBackground(state.backgroundKey ?? '');
  return (
    <div className="space-y-3">
      {BACKGROUNDS.map((b) => (
        <ChoiceCard
          key={b.key}
          icon={getIcon(b.icon)}
          title={b.name}
          subtitle={
            b.skills.length
              ? b.skills.map(skillLabel).join(', ')
              : `${b.skillChoice?.choose ?? 0} abilità a scelta`
          }
          description={b.description}
          selected={state.backgroundKey === b.key}
          onClick={() => update({ backgroundKey: b.key, extraSkills: [] })}
        />
      ))}

      {selected && (
        <Panel title={`Privilegio · ${selected.feature.name}`}>
          <p className="text-sm text-parchment-dim">{selected.feature.description}</p>
          {selected.equipment.length > 0 && (
            <p className="mt-3 text-sm">
              <span className="text-ochre">Equipaggiamento: </span>
              <span className="text-parchment-dim">{selected.equipment.join(', ')}</span>
            </p>
          )}
        </Panel>
      )}
    </div>
  );
}

// ─── Step 5: Skills ──────────────────────────────────────────────────────────
export function SkillsStep({
  state,
  update,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
}) {
  const cls = getClass(state.classKey ?? '');
  const bg = getBackground(state.backgroundKey ?? '');
  if (!cls || !bg) return null;

  const raceAuto =
    state.raceKey === 'half-orc'
      ? ['Intimidation']
      : state.raceKey === 'elf'
        ? ['Perception']
        : [];
  const locked = new Set([...bg.skills, ...raceAuto]);
  const extraNeeded = (state.raceKey === 'half-elf' ? 2 : 0) + (bg.key === 'custom' ? 2 : 0);

  const extraPool = Object.keys(skillPool()).filter(
    (s) => !locked.has(s) && !state.classSkills.includes(s),
  );

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-ochre">
            Abilità di classe
          </h2>
          <span
            className={cn(
              'text-xs',
              state.classSkills.length === cls.skillChoice.choose
                ? 'text-gold'
                : 'text-parchment-dim',
            )}
          >
            {state.classSkills.length} / {cls.skillChoice.choose}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {cls.skillChoice.from.map((s) => {
            const isLocked = locked.has(s);
            const picked = state.classSkills.includes(s);
            const full = !picked && state.classSkills.length >= cls.skillChoice.choose;
            return (
              <Chip
                key={s}
                label={isLocked ? `${skillLabel(s)} ✓` : skillLabel(s)}
                selected={picked}
                disabled={isLocked || full}
                onClick={() =>
                  update({
                    classSkills: toggleInList(state.classSkills, s, cls.skillChoice.choose),
                  })
                }
              />
            );
          })}
        </div>
      </div>

      {extraNeeded > 0 && (
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-ochre">
              Abilità aggiuntive
            </h2>
            <span
              className={cn(
                'text-xs',
                state.extraSkills.length === extraNeeded ? 'text-gold' : 'text-parchment-dim',
              )}
            >
              {state.extraSkills.length} / {extraNeeded}
            </span>
          </div>
          <p className="mb-2 text-xs text-parchment-dim">
            {state.raceKey === 'half-elf' && 'Versatilità Abile (mezzelfo)'}
            {state.raceKey === 'half-elf' && bg.key === 'custom' ? ' + ' : ''}
            {bg.key === 'custom' && 'background personalizzato'}
          </p>
          <div className="flex flex-wrap gap-2">
            {extraPool.map((s) => {
              const picked = state.extraSkills.includes(s);
              const full = !picked && state.extraSkills.length >= extraNeeded;
              return (
                <Chip
                  key={s}
                  label={skillLabel(s)}
                  selected={picked}
                  disabled={full}
                  onClick={() =>
                    update({ extraSkills: toggleInList(state.extraSkills, s, extraNeeded) })
                  }
                />
              );
            })}
          </div>
        </div>
      )}

      {locked.size > 0 && (
        <Panel title="Già acquisite">
          <p className="text-sm text-parchment-dim">
            {[...locked].map(skillLabel).join(', ')}
          </p>
        </Panel>
      )}
    </div>
  );
}

// Minimal accessor to the 18 skill keys (labels map covers them all).
function skillPool(): Record<string, string> {
  return {
    Acrobatics: '',
    'Animal Handling': '',
    Arcana: '',
    Athletics: '',
    Deception: '',
    History: '',
    Insight: '',
    Intimidation: '',
    Investigation: '',
    Medicine: '',
    Nature: '',
    Perception: '',
    Performance: '',
    Persuasion: '',
    Religion: '',
    'Sleight of Hand': '',
    Stealth: '',
    Survival: '',
  };
}

// ─── Step 6: Details ──────────────────────────────────────────────────────────
export function DetailsStep({
  state,
  update,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
}) {
  const inputClass =
    'w-full rounded-lg border border-ink-border bg-[color:var(--color-ink)] px-3 py-2.5 text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none';
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm text-parchment-dim">Nome del personaggio</span>
        <input
          className={inputClass}
          value={state.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Es. Lyra Fiammadargento"
          maxLength={60}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm text-parchment-dim">Allineamento</span>
        <select
          className={inputClass}
          value={state.alignment}
          onChange={(e) => update({ alignment: e.target.value })}
        >
          <option value="">— Non specificato —</option>
          {ALIGNMENTS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm text-parchment-dim">
          Cosa dovrebbe sapere di te il Dungeon Master? (facoltativo)
        </span>
        <textarea
          className={cn(inputClass, 'min-h-24 resize-y')}
          value={state.pillar}
          onChange={(e) => update({ pillar: e.target.value })}
          placeholder="Una frase sul tuo passato, un obiettivo o un legame che ti definisce."
          maxLength={280}
        />
      </label>
    </div>
  );
}

// ─── Step 7: Summary ──────────────────────────────────────────────────────────
export function SummaryStep({ state }: { state: WizardState }) {
  let error: string | null = null;
  let sheet: ReturnType<typeof buildSheet> | null = null;
  try {
    sheet = buildSheet(state);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Dati incompleti.';
  }
  const finals = finalScores(state);

  if (error || !sheet) {
    return (
      <Panel>
        <p className="text-sm text-parchment-dim">{error}</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gold/40 bg-burgundy/30 p-4 text-center">
        <h1 className="font-display text-2xl text-parchment">
          {sheet.identity.name || 'Eroe senza nome'}
        </h1>
        <p className="mt-1 text-sm text-parchment-dim">
          {sheet.identity.subrace ? `${sheet.identity.subrace}` : sheet.identity.race} ·{' '}
          {sheet.identity.className}
          {sheet.identity.subclass ? ` · ${sheet.identity.subclass}` : ''} · Livello{' '}
          {sheet.identity.level}
        </p>
        <p className="text-xs text-parchment-dim">
          {sheet.identity.background}
          {sheet.identity.alignment ? ` · ${sheet.identity.alignment}` : ''}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {ABILITIES.map((a) => (
          <div
            key={a}
            className="rounded-lg border border-ink-border bg-ink-raised py-2 text-center"
          >
            <div className="text-xs uppercase tracking-wide text-ochre">{ABILITY_SHORT[a]}</div>
            <div className="font-display text-xl text-parchment">{finals[a]}</div>
            <div className="text-xs text-parchment-dim">{formatMod(modifier(finals[a]))}</div>
          </div>
        ))}
      </div>

      <Panel title="Combattimento">
        <div className="grid grid-cols-4 gap-2 text-center">
          <Stat label="PF" value={sheet.combat.maxHp} />
          <Stat label="CA" value={sheet.combat.armorClass} />
          <Stat label="Velocità" value={`${sheet.combat.speed}m`} />
          <Stat label="Comp." value={formatMod(sheet.proficiencies.proficiencyBonus)} />
        </div>
        <p className="mt-2 text-xs text-parchment-dim">
          CA calcolata senza armatura (10 + DES). Il DM la aggiornerà con l’equipaggiamento.
        </p>
      </Panel>

      <Panel title="Competenze">
        <p className="text-sm">
          <span className="text-ochre">Tiri salvezza: </span>
          <span className="text-parchment">
            {sheet.proficiencies.savingThrows.map((a) => ABILITY_LABELS[a]).join(', ')}
          </span>
        </p>
        <p className="mt-1 text-sm">
          <span className="text-ochre">Abilità: </span>
          <span className="text-parchment">
            {sheet.proficiencies.skills.map(skillLabel).sort().join(', ') || '—'}
          </span>
        </p>
      </Panel>

      {sheet.spellcasting && (
        <Panel title="Incantesimi">
          <div className="grid grid-cols-2 gap-2 text-center">
            <Stat label="CD Tiro Salvezza" value={sheet.spellcasting.spellSaveDc ?? '—'} />
            <Stat
              label="Bonus Attacco"
              value={
                sheet.spellcasting.spellAttackBonus !== undefined
                  ? formatMod(sheet.spellcasting.spellAttackBonus)
                  : '—'
              }
            />
          </div>
        </Panel>
      )}

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
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="font-display text-xl text-parchment">{value}</div>
      <div className="text-xs text-parchment-dim">{label}</div>
    </div>
  );
}
