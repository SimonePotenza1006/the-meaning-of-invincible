'use client';

import { useState } from 'react';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';
import { INTRO_SLIDES } from '@/lib/story/intro';
import { cn } from '@/app/crea/ui';

/**
 * Full-screen opening presentation. Steps through the intro slides, then calls
 * `onDone` to hand off to character creation. Mobile-first (played on a tablet).
 */
export function IntroPresentation({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const slide = INTRO_SLIDES[i];
  const isLast = i === INTRO_SLIDES.length - 1;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <div className="mb-8 flex items-center justify-center gap-2">
        <GiDiceTwentyFacesTwenty className="h-5 w-5 text-gold" aria-hidden />
        <span className="font-display text-xs tracking-[0.2em] text-gold uppercase">
          The meaning of invincible
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {slide.eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ochre">
            {slide.eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-display text-3xl leading-tight text-parchment">
          {slide.title}
        </h1>
        <span
          className="mt-5 h-1 w-24 rounded-full"
          style={{ backgroundImage: 'var(--gradient-quest)' }}
          aria-hidden
        />
        <div className="mt-6 space-y-4">
          {slide.body.map((p, idx) => (
            <p key={idx} className="text-parchment-dim leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-2" aria-hidden>
        {INTRO_SLIDES.map((_, idx) => (
          <span
            key={idx}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              idx === i ? 'w-6 bg-gold' : 'w-2 bg-ink-border',
            )}
          />
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        {i > 0 && (
          <button
            type="button"
            onClick={() => setI((v) => v - 1)}
            className="rounded-xl border border-ink-border px-5 py-3 font-medium text-parchment transition-colors hover:border-ochre"
          >
            Indietro
          </button>
        )}
        <button
          type="button"
          onClick={() => (isLast ? onDone() : setI((v) => v + 1))}
          className="flex-1 rounded-xl bg-gold px-5 py-3 font-medium text-[color:var(--color-ink)] transition-all hover:brightness-110"
        >
          {isLast ? 'Crea il tuo personaggio' : 'Continua'}
        </button>
      </div>
      {!isLast && (
        <button
          type="button"
          onClick={onDone}
          className="mt-3 self-center text-xs text-parchment-dim underline-offset-4 transition-colors hover:text-parchment hover:underline"
        >
          Salta l’introduzione
        </button>
      )}
    </main>
  );
}
