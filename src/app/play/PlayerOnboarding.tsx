'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreationWizard } from '@/app/crea/CreationWizard';
import { FORCE_INTRO, INTRO_SEEN_KEY } from '@/lib/story/intro';
import { cn } from '@/app/crea/ui';
import type { CharacterSheet } from '@/lib/sheet';
import type { SaveResult } from '@/lib/game/types';
import { IntroPresentation } from './IntroPresentation';

/**
 * Pre-character player flow: first the opening presentation, then the creation
 * wizard. Whether the intro shows is decided on the device:
 *   - `FORCE_INTRO` (debug) → always show;
 *   - otherwise show only until it's been seen once (localStorage flag).
 * Skipping creation after a character exists is handled server-side (this whole
 * component only renders when there is no active character yet).
 */
export function PlayerOnboarding({
  save,
}: {
  save: (sheet: CharacterSheet) => Promise<SaveResult>;
}) {
  const router = useRouter();
  // `null` = deciding (avoids a flash of the wrong screen before we read storage).
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  // True when we've just come out of the intro's water transition (ends on
  // black) — the wizard then fades in from black instead of cutting in.
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (FORCE_INTRO) {
      setShowIntro(true);
      return;
    }
    const seen = window.localStorage.getItem(INTRO_SEEN_KEY) === '1';
    setShowIntro(!seen);
  }, []);

  function finishIntro() {
    try {
      window.localStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      // Private mode / storage disabled — worst case the intro shows again.
    }
    setFadeIn(true);
    setShowIntro(false);
  }

  if (showIntro === null) return null;
  if (showIntro) return <IntroPresentation onDone={finishIntro} />;

  // On completion, refresh so the server swaps the wizard for the live sheet.
  const wizard = <CreationWizard save={save} onComplete={() => router.refresh()} />;
  return fadeIn ? <FadeFromBlack>{wizard}</FadeFromBlack> : wizard;
}

/**
 * Renders its children with a black overlay on top that fades away on mount,
 * so the screen gently emerges from black (continuing the intro's fade-out).
 */
function FadeFromBlack({ children }: { children: React.ReactNode }) {
  const [lifting, setLifting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = window.setTimeout(() => setLifting(true), 40);
    const end = window.setTimeout(() => setGone(true), 1240);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, []);

  return (
    <>
      {children}
      {!gone && (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-1000 ease-in-out',
            lifting ? 'opacity-0' : 'opacity-100',
          )}
        />
      )}
    </>
  );
}
