'use client';

import { useEffect, useRef, useState } from 'react';
import { INTRO_SLIDES } from '@/lib/story/intro';
import { cn } from '@/app/crea/ui';

// Palette blobs that glow (via `screen` blend) on pure black.
const BLOBS = [
  { color: 'var(--color-burgundy)', pos: 'left-[-25%] top-[-15%]', size: 'h-[80vmin] w-[80vmin]', anim: 'intro-blob-a 24s ease-in-out infinite' },
  { color: 'var(--color-paprika)', pos: 'right-[-25%] top-[8%]', size: 'h-[70vmin] w-[70vmin]', anim: 'intro-blob-b 30s ease-in-out infinite' },
  { color: 'var(--color-gold)', pos: 'bottom-[-28%] left-[12%]', size: 'h-[75vmin] w-[75vmin]', anim: 'intro-blob-c 27s ease-in-out infinite' },
  { color: 'var(--color-flag-red)', pos: 'bottom-[-18%] right-[-18%]', size: 'h-[60vmin] w-[60vmin]', anim: 'intro-blob-a 33s ease-in-out infinite' },
];

// How long text spends fading (must match the Tailwind duration below).
const FADE_MS = 700;

/**
 * Full-screen opening presentation: white gothic text on black, over a drifting
 * "psychedelic" wash in the brand palette. The reader advances one block at a
 * time (no going back, no progress indicator). Each block fades in and out. On
 * the final block, "Entra" plays a fullscreen water-ripple effect, fades to
 * black, then hands off to character creation via `onDone`.
 */
export function IntroPresentation({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);
  const [entering, setEntering] = useState(false);
  const slide = INTRO_SLIDES[i];
  const isLast = i === INTRO_SLIDES.length - 1;

  // Fade the first block in on mount.
  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 40);
    return () => window.clearTimeout(id);
  }, []);

  function advance() {
    if (!visible || entering) return;
    setVisible(false); // fade current block out
    window.setTimeout(() => {
      if (isLast) {
        setEntering(true); // last block gone → play the water transition
      } else {
        setI((v) => v + 1);
        window.setTimeout(() => setVisible(true), 40); // fade next block in
      }
    }, FADE_MS);
  }

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-black text-white">
      {/* Psychedelic backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ animation: 'intro-hue 45s linear infinite' }}
      >
        {BLOBS.map((b, idx) => (
          <span
            key={idx}
            className={cn('absolute rounded-full blur-[70px]', b.pos, b.size)}
            style={{
              background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
              opacity: 0.85,
              mixBlendMode: 'screen',
              animation: b.anim,
            }}
          />
        ))}
        {/* Light scrim — kept thin so the wash stays visible but text readable. */}
        <span className="absolute inset-0 bg-black/25" />
      </div>

      {/* Content */}
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-12">
        <div
          className={cn(
            'flex flex-1 flex-col justify-center text-center transition-opacity ease-in-out',
            visible ? 'opacity-100' : 'opacity-0',
          )}
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.9)', transitionDuration: `${FADE_MS}ms` }}
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

        {/* Navigation — only "Continua" (fades with the block). */}
        <div
          className={cn(
            'mt-10 transition-opacity ease-in-out',
            visible && !entering ? 'opacity-100' : 'opacity-0',
          )}
          style={{ transitionDuration: `${FADE_MS}ms` }}
        >
          <button
            type="button"
            onClick={advance}
            disabled={!visible || entering}
            className="w-full rounded-full border border-white/80 bg-white/5 px-5 py-3 font-display text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black disabled:pointer-events-none"
          >
            {isLast ? 'Entra' : 'Continua'}
          </button>
        </div>
      </main>

      {entering && <WaterTransition onFinish={onDone} />}
    </div>
  );
}

/**
 * Fullscreen "drops falling on water" effect: expanding ripple rings spawn at
 * random points for a beat, then the whole layer fades to black and calls
 * `onFinish`. Drawn on a canvas over everything (z-50).
 */
function WaterTransition({ onFinish }: { onFinish: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    function resize() {
      canvas!.width = W() * dpr;
      canvas!.height = H() * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    type Drop = { x: number; y: number; born: number };
    let drops: Drop[] = [];
    let raf = 0;
    let running = true;
    let lastSpawn = -Infinity;
    const start = performance.now();

    const SPAWN_UNTIL = 2200; // stop dropping after this
    const TOTAL = 2900; // then begin the fade-out
    const RIPPLE_LIFE = 2200; // how long a single ripple lives
    const SPAWN_EVERY = 260;

    function spawn(elapsed: number) {
      drops.push({ x: Math.random() * W(), y: Math.random() * H(), born: elapsed });
    }
    // A first drop right away, near center-ish.
    drops.push({ x: W() * 0.5, y: H() * 0.42, born: 0 });

    function frame(now: number) {
      const elapsed = now - start;
      ctx!.clearRect(0, 0, W(), H());

      if (elapsed < SPAWN_UNTIL && elapsed - lastSpawn > SPAWN_EVERY) {
        spawn(elapsed);
        lastSpawn = elapsed;
      }
      drops = drops.filter((d) => elapsed - d.born < RIPPLE_LIFE);

      const maxR = Math.max(W(), H()) * 0.45;
      for (const d of drops) {
        const p = (elapsed - d.born) / RIPPLE_LIFE; // 0 → 1
        const r = p * maxR;
        for (let k = 0; k < 3; k++) {
          const rr = r - k * 22;
          if (rr <= 0) continue;
          const alpha = (1 - p) * (0.55 - k * 0.15);
          if (alpha <= 0) continue;
          ctx!.beginPath();
          ctx!.arc(d.x, d.y, rr, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(190,214,255,${alpha})`;
          ctx!.lineWidth = 2;
          ctx!.stroke();
        }
      }

      if (elapsed < TOTAL && running) {
        raf = requestAnimationFrame(frame);
      } else {
        setFading(true);
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Once the ripples are done, fade the layer out then hand off.
  useEffect(() => {
    if (!fading) return;
    const id = window.setTimeout(onFinish, 1000);
    return () => window.clearTimeout(id);
  }, [fading, onFinish]);

  // The layer stays opaque black; only the ripples fade, so we end on pure
  // black ("ultimo fade out") before cutting to character creation.
  return (
    <div className="fixed inset-0 z-50 bg-black">
      <canvas
        ref={canvasRef}
        className={cn(
          'h-full w-full transition-opacity duration-1000 ease-in-out',
          fading ? 'opacity-0' : 'opacity-100',
        )}
      />
    </div>
  );
}
