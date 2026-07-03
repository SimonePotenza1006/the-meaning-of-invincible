'use client';

import { useEffect, useState } from 'react';
import type { WildMagicFx } from '@/lib/game/wild-magic';

// The iridescent accent is the protagonist's signature (the "occhi iridescenti"
// of her chaos, opposed to the red eyes of control). Kept subtle and readable.
const IRIDESCENT =
  'linear-gradient(120deg, #b48ce6 0%, #6ec3d6 30%, #7ee0b0 55%, #e6c46e 80%, #d98cc4 100%)';

/**
 * Dismissable modal that pops on the roller's own screen when a Wild Magic surge
 * fires (mirrors RollEffects, but a card the reader closes rather than a fleeting
 * animation). Listens for the local `dnd:wildmagic` browser event dispatched by
 * castWildMagic(). Mounted once in SheetShell, so it serves both the player sheet
 * and the DM dashboard. The other side sees the surge in the shared log.
 */
export function WildMagicDialog() {
  const [fx, setFx] = useState<(WildMagicFx & { id: number }) | null>(null);

  useEffect(() => {
    let counter = 0;
    function onSurge(e: Event) {
      const detail = (e as CustomEvent<WildMagicFx>).detail;
      counter += 1;
      setFx({ ...detail, id: counter });
    }
    window.addEventListener('dnd:wildmagic', onSurge as EventListener);
    return () => window.removeEventListener('dnd:wildmagic', onSurge as EventListener);
  }, []);

  // Close on Escape.
  useEffect(() => {
    if (!fx) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setFx(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fx]);

  if (!fx) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Scarica di Magia Selvaggia"
      onClick={() => setFx(null)}
    >
      <section
        key={fx.id}
        onClick={(e) => e.stopPropagation()}
        className="relative m-auto w-full max-w-md overflow-hidden rounded-2xl border-2 bg-ink-raised p-6 text-center"
        style={{
          borderColor: 'transparent',
          backgroundImage: `linear-gradient(var(--color-ink-raised), var(--color-ink-raised)), ${IRIDESCENT}`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 20px 60px -15px rgba(140, 110, 210, 0.55)',
        }}
      >
        <p className="text-xs uppercase tracking-[0.28em] text-parchment-dim">🌀 Magia Selvaggia</p>

        <div
          className="mx-auto mt-3 font-display text-6xl leading-none"
          style={{
            backgroundImage: IRIDESCENT,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: 'dice-tumble 0.6s cubic-bezier(0.2,0.8,0.2,1) both',
          }}
        >
          {fx.roll}
        </div>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-parchment-dim">d100</p>

        {fx.source && (
          <p className="mt-3 text-sm italic text-ochre">{fx.source}</p>
        )}

        <p className="mt-3 text-[15px] leading-relaxed text-parchment">{fx.effect}</p>

        <button
          type="button"
          onClick={() => setFx(null)}
          className="mt-6 w-full rounded-xl border border-ink-border px-5 py-2.5 text-sm text-parchment transition-colors hover:border-gold"
        >
          Chiudi
        </button>
      </section>
    </div>
  );
}
