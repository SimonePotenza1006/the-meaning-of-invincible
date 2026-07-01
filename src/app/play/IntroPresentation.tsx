'use client';

import { useState } from 'react';
import { INTRO_SLIDES } from '@/lib/story/intro';
import { cn } from '@/app/crea/ui';

// Palette blobs that glow (via `screen` blend) on pure black. Kept low-opacity
// and heavily blurred so the white gothic text on top stays perfectly readable.
const BLOBS = [
  { color: 'var(--color-burgundy)', pos: 'left-[-25%] top-[-15%]', size: 'h-[75vmin] w-[75vmin]', anim: 'intro-blob-a 24s ease-in-out infinite' },
  { color: 'var(--color-paprika)', pos: 'right-[-25%] top-[10%]', size: 'h-[65vmin] w-[65vmin]', anim: 'intro-blob-b 30s ease-in-out infinite' },
  { color: 'var(--color-gold)', pos: 'bottom-[-25%] left-[15%]', size: 'h-[70vmin] w-[70vmin]', anim: 'intro-blob-c 27s ease-in-out infinite' },
  { color: 'var(--color-flag-red)', pos: 'bottom-[-15%] right-[-15%]', size: 'h-[55vmin] w-[55vmin]', anim: 'intro-blob-a 33s ease-in-out infinite' },
];

/**
 * Full-screen opening presentation: white gothic text on black, over a subtle
 * drifting "psychedelic" wash in the brand palette. A wizard the reader advances
 * block by block; the final block hands off to character creation via `onDone`.
 */
export function IntroPresentation({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const slide = INTRO_SLIDES[i];
  const isLast = i === INTRO_SLIDES.length - 1;

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-black text-white">
      {/* Psychedelic backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ animation: 'intro-hue 60s linear infinite' }}
      >
        {BLOBS.map((b, idx) => (
          <span
            key={idx}
            className={cn('absolute rounded-full blur-[90px]', b.pos, b.size)}
            style={{
              background: `radial-gradient(circle, ${b.color}, transparent 68%)`,
              opacity: 0.5,
              mixBlendMode: 'screen',
              animation: b.anim,
            }}
          />
        ))}
        {/* Scrim: darkens the field a touch so text keeps its contrast. */}
        <span className="absolute inset-0 bg-black/45" />
      </div>

      {/* Content */}
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-12">
        <div
          className="flex flex-1 flex-col justify-center text-center"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.85)' }}
        >
          {slide.eyebrow && (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-white/60">
              {slide.eyebrow}
            </p>
          )}
          {slide.title && (
            <h1 className="font-display text-3xl leading-tight text-white sm:text-4xl">
              {slide.title}
            </h1>
          )}
          <div className={cn('space-y-5', slide.title && 'mt-7')}>
            {slide.body.map((p, idx) => (
              <p
                key={idx}
                className="font-display text-lg leading-relaxed text-white/90 sm:text-xl"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-10 flex items-center justify-center gap-2" aria-hidden>
          {INTRO_SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                idx === i ? 'w-8 bg-white' : 'w-1.5 bg-white/30',
              )}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center gap-3">
          {i > 0 && (
            <button
              type="button"
              onClick={() => setI((v) => v - 1)}
              className="rounded-full border border-white/25 px-5 py-3 font-medium text-white/80 transition-colors hover:border-white/60 hover:text-white"
            >
              Indietro
            </button>
          )}
          <button
            type="button"
            onClick={() => (isLast ? onDone() : setI((v) => v + 1))}
            className="flex-1 rounded-full border border-white/80 bg-white/5 px-5 py-3 font-display text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black"
          >
            {isLast ? 'Entra nell’avventura' : 'Continua'}
          </button>
        </div>
        {!isLast && (
          <button
            type="button"
            onClick={onDone}
            className="mt-4 self-center text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/80"
          >
            Salta
          </button>
        )}
      </main>
    </div>
  );
}
