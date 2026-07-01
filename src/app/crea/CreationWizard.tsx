'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';
import { getBackground, getClass, getRace, subclassMeta } from '@/lib/dnd';
import { buildSheet, initialState, type WizardState } from '@/lib/character/build';
import type { CharacterSheet } from '@/lib/sheet';
import type { SaveResult } from '@/lib/game/types';
import { AbilityStep } from './AbilityStep';
import {
  BackgroundStep,
  ClassStep,
  DetailsStep,
  RaceStep,
  SkillsStep,
  SummaryStep,
} from './steps';
import { cn, StepHeading, StepRail } from './ui';

const STEP_LABELS = [
  'Razza',
  'Classe',
  'Background',
  'Caratteristiche',
  'Abilità',
  'Dettagli',
  'Riepilogo',
];

const HEADINGS: { title: string; hint: string }[] = [
  { title: 'Scegli la tua razza', hint: 'Determina i bonus alle caratteristiche e i tratti innati.' },
  { title: 'Scegli la tua classe', hint: 'Definisce dado vita, competenze e stile di gioco.' },
  { title: 'Il tuo background', hint: 'Da dove vieni: competenze ed equipaggiamento iniziale.' },
  { title: 'Distribuisci le caratteristiche', hint: 'Parti dalla disposizione consigliata e personalizza.' },
  { title: 'Scegli le abilità', hint: 'Le competenze in cui il tuo personaggio eccelle.' },
  { title: 'Ultimi dettagli', hint: 'Dai un nome e un’anima al personaggio.' },
  { title: 'Riepilogo', hint: 'Controlla tutto, poi salva il personaggio.' },
];

export function CreationWizard({
  save,
  onComplete,
}: {
  save: (sheet: CharacterSheet) => Promise<SaveResult>;
  onComplete?: (result: SaveResult) => void;
}) {
  const [state, setState] = useState<WizardState>(initialState);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SaveResult | null>(null);

  const update = (patch: Partial<WizardState>) => setState((s) => ({ ...s, ...patch }));

  function canProceed(): boolean {
    const race = getRace(state.raceKey ?? '');
    const cls = getClass(state.classKey ?? '');
    const bg = getBackground(state.backgroundKey ?? '');
    switch (step) {
      case 0:
        return !!race && (!race.subraces || !!state.subraceKey);
      case 1: {
        if (!cls) return false;
        const meta = subclassMeta(cls.key);
        // Classes that pick their subclass at level 1 must choose one now.
        return meta?.level === 1 ? !!state.subclassKey : true;
      }
      case 2:
        return !!bg;
      case 3:
        return !race?.bonusChoice || state.raceBonusChoice.length === race.bonusChoice.count;
      case 4: {
        if (!cls || !bg) return false;
        const extraNeeded =
          (state.raceKey === 'half-elf' ? 2 : 0) + (bg.key === 'custom' ? 2 : 0);
        return (
          state.classSkills.length === cls.skillChoice.choose &&
          state.extraSkills.length === extraNeeded
        );
      }
      case 5:
        return state.name.trim().length > 0;
      default:
        return true;
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const sheet = buildSheet(state);
      const res = await save(sheet);
      if (onComplete) onComplete(res);
      else setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore durante il salvataggio.');
    } finally {
      setSaving(false);
    }
  }

  if (result) {
    return (
      <SuccessScreen
        result={result}
        name={state.name}
        onRestart={() => {
          setState(initialState());
          setStep(0);
          setResult(null);
        }}
      />
    );
  }

  const isLast = step === STEP_LABELS.length - 1;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-ink-border bg-[color:color-mix(in_srgb,var(--color-ink)_88%,transparent)] px-5 pb-4 pt-5 backdrop-blur">
        <div className="mb-3 flex items-center gap-2">
          <GiDiceTwentyFacesTwenty className="h-5 w-5 text-gold" aria-hidden />
          <span className="font-display text-sm tracking-wide text-gold">
            Creazione Personaggio
          </span>
        </div>
        <StepRail steps={STEP_LABELS} current={step} />
      </header>

      <main className="flex-1 px-5 py-6">
        <StepHeading title={HEADINGS[step].title} hint={HEADINGS[step].hint} />
        {step === 0 && <RaceStep state={state} update={update} />}
        {step === 1 && <ClassStep state={state} update={update} />}
        {step === 2 && <BackgroundStep state={state} update={update} />}
        {step === 3 && <AbilityStep state={state} update={update} />}
        {step === 4 && <SkillsStep state={state} update={update} />}
        {step === 5 && <DetailsStep state={state} update={update} />}
        {step === 6 && <SummaryStep state={state} />}
      </main>

      <footer className="sticky bottom-0 border-t border-ink-border bg-[color:color-mix(in_srgb,var(--color-ink)_90%,transparent)] px-5 py-4 backdrop-blur">
        {error && <p className="mb-3 text-sm text-flag-red">{error}</p>}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-xl border border-ink-border px-5 py-3 font-medium text-parchment transition-colors hover:border-ochre"
            >
              Indietro
            </button>
          )}
          {!isLast ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className={cn(
                'flex-1 rounded-xl px-5 py-3 font-medium transition-all',
                canProceed()
                  ? 'bg-gold text-[color:var(--color-ink)] hover:brightness-110'
                  : 'cursor-not-allowed bg-ink-raised text-parchment-dim',
              )}
            >
              Continua
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-xl bg-gold px-5 py-3 font-medium text-[color:var(--color-ink)] transition-all hover:brightness-110 disabled:opacity-60"
            >
              {saving ? 'Salvataggio…' : 'Salva personaggio'}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

function SuccessScreen({
  result,
  name,
  onRestart,
}: {
  result: SaveResult;
  name: string;
  onRestart: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <GiDiceTwentyFacesTwenty className="mb-6 h-16 w-16 text-gold" aria-hidden />
      <h1 className="font-display text-2xl text-parchment">Personaggio salvato!</h1>
      <p className="mt-3 text-parchment-dim">
        <span className="text-gold">{name || 'Il tuo eroe'}</span> è pronto per l’avventura. Il
        Dungeon Master può ora vedere la scheda.
      </p>
      <p className="mt-2 text-xs text-parchment-dim">
        Campagna #{result.campaignId} · Personaggio #{result.characterId}
      </p>
      <div className="mt-8 flex flex-col gap-3 self-stretch">
        <Link
          href="/"
          className="rounded-xl border border-ink-border px-5 py-3 font-medium text-parchment transition-colors hover:border-ochre"
        >
          Torna alla home
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-xl bg-gold px-5 py-3 font-medium text-[color:var(--color-ink)] transition-all hover:brightness-110"
        >
          Crea un altro personaggio
        </button>
      </div>
    </main>
  );
}
