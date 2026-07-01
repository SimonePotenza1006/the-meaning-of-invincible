'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreationWizard } from '@/app/crea/CreationWizard';
import { FORCE_INTRO, INTRO_SEEN_KEY } from '@/lib/story/intro';
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
    setShowIntro(false);
  }

  if (showIntro === null) return null;
  if (showIntro) return <IntroPresentation onDone={finishIntro} />;

  // On completion, refresh so the server swaps the wizard for the live sheet.
  return <CreationWizard save={save} onComplete={() => router.refresh()} />;
}
