'use client';

import { useEffect, useState } from 'react';
import type { RollFx } from '@/lib/game/roll';

// Eight sparks flung outward on a critical.
const SPARKS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2;
  return { dx: `${Math.cos(angle) * 90}px`, dy: `${Math.sin(angle) * 90}px`, delay: i * 20 };
});

/**
 * Local dice animation. Listens for the `dnd:roll` browser event emitted by the
 * roll helpers (on the roller's screen only), tumbles a die to its result and
 * adds a flourish on a natural 20 (critical) or natural 1 (fumble).
 */
export function RollEffects() {
  const [fx, setFx] = useState<(RollFx & { id: number }) | null>(null);

  useEffect(() => {
    let counter = 0;
    let hideTimer = 0;
    function onRoll(e: Event) {
      const detail = (e as CustomEvent<RollFx>).detail;
      counter += 1;
      setFx({ ...detail, id: counter });
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setFx(null), detail.crit || detail.fumble ? 2300 : 1500);
    }
    window.addEventListener('dnd:roll', onRoll as EventListener);
    return () => {
      window.removeEventListener('dnd:roll', onRoll as EventListener);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!fx) return null;
  const { crit, fumble } = fx;
  const color = crit ? 'var(--color-gold)' : fumble ? 'var(--color-flag-red)' : 'var(--color-parchment)';
  const face = fx.kind === 'd20' ? (fx.natural ?? fx.total) : fx.total;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
      aria-hidden
    >
      <div key={fx.id} className="relative flex flex-col items-center">
        {(crit || fumble) && (
          <span
            className="absolute top-1 h-28 w-28 rounded-full"
            style={{ border: `3px solid ${color}`, animation: 'crit-ring 0.9s ease-out forwards' }}
          />
        )}
        {crit &&
          SPARKS.map((s, i) => (
            <span
              key={i}
              className="absolute top-12 h-1.5 w-1.5 rounded-full"
              style={{
                background: color,
                ['--dx' as string]: s.dx,
                ['--dy' as string]: s.dy,
                animation: `crit-spark 0.8s ${s.delay}ms ease-out forwards`,
              }}
            />
          ))}

        <div
          className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 font-display text-4xl"
          style={{
            borderColor: color,
            color,
            background: 'color-mix(in srgb, var(--color-ink) 82%, transparent)',
            boxShadow: `0 0 34px -6px ${color}`,
            animation: 'dice-tumble 0.6s cubic-bezier(0.2,0.8,0.2,1) both',
          }}
        >
          {face}
        </div>

        <div className="mt-3 text-center" style={{ animation: 'fx-label 0.5s ease-out both' }}>
          {(crit || fumble) && (
            <div className="font-display text-lg" style={{ color }}>
              {crit ? 'Critico!' : 'Fallimento critico!'}
            </div>
          )}
          <div className="rounded-full bg-[color:color-mix(in_srgb,var(--color-ink)_80%,transparent)] px-3 py-1 text-sm text-parchment-dim backdrop-blur-sm">
            {fx.label} · <span className="text-parchment">{fx.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
