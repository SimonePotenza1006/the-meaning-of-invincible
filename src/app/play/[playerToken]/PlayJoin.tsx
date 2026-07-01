'use client';

import { useRouter } from 'next/navigation';
import { CreationWizard } from '@/app/crea/CreationWizard';
import type { CharacterSheet } from '@/lib/sheet';
import type { SaveResult } from '@/lib/game/types';

export function PlayJoin({
  save,
}: {
  save: (sheet: CharacterSheet) => Promise<SaveResult>;
}) {
  const router = useRouter();
  // On completion, refresh so the server component swaps the wizard for the sheet.
  return <CreationWizard save={save} onComplete={() => router.refresh()} />;
}
