'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { OMEN_PRESETS, type OmenData, type OmenType } from '@/lib/game/omens';
import type { GameEvent } from '@/db';

/**
 * Renders omens the DM pushes to the player. Watches the polled event log and,
 * whenever a new `omen` event appears (one created after this sheet loaded),
 * pops the matching full-screen modal. Player-only: mounted in PlayerSheet, not
 * in SheetShell, so it never fires on the DM's own screen. Dismissed by tap/Esc.
 */
export function OmenLayer({ events }: { events: GameEvent[] }) {
  const [active, setActive] = useState<{ id: number; data: OmenData } | null>(null);
  const seen = useRef<Set<number>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    const omens = events.filter((e) => e.kind === 'omen');
    if (!initialized.current) {
      // Baseline on first load: don't replay omens that already existed.
      omens.forEach((e) => seen.current.add(e.id));
      initialized.current = true;
      return;
    }
    const fresh = omens.filter((e) => !seen.current.has(e.id));
    if (fresh.length === 0) return;
    fresh.forEach((e) => seen.current.add(e.id));
    // Events are newest-first; show the most recent fresh omen.
    const newest = fresh[0];
    setActive({ id: newest.id, data: (newest.data ?? {}) as OmenData });
  }, [events]);

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  if (!active) return null;

  const dismiss = () => setActive(null);
  const { type, message } = active.data;
  const text = (message?.trim() || OMEN_PRESETS[type as OmenType]?.fallback) ?? '';

  const props = { key: active.id, text, onDismiss: dismiss };
  switch (type) {
    case 'voices':
      return <VoicesOmen {...props} />;
    case 'name':
      return <NameOmen {...props} />;
    case 'mark':
      return <MarkOmen {...props} />;
    case 'blackout':
      return <BlackoutOmen {...props} />;
    case 'watched':
      return <WatchedOmen {...props} />;
    case 'torches':
      return <TorchesOmen {...props} />;
    case 'water':
      return <WaterOmen {...props} />;
    case 'wild':
      return <WildOmen {...props} />;
    case 'dream':
      return <DreamOmen {...props} />;
    case 'handout':
      return <HandoutOmen {...props} />;
    case 'sealed':
      return <SealedOmen {...props} />;
    default:
      return null;
  }
}

interface OmenProps {
  text: string;
  onDismiss: () => void;
}

// Shared full-screen shell: click anywhere to dismiss, with a delayed hint.
function OmenOverlay({
  onDismiss,
  ariaLabel,
  background,
  children,
  hintDelay = 1600,
}: {
  onDismiss: () => void;
  ariaLabel: string;
  background: string;
  children: ReactNode;
  hintDelay?: number;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onDismiss}
      className="fixed inset-0 z-[80] flex cursor-pointer items-center justify-center overflow-hidden p-6"
      style={{ background, animation: 'omen-overlay-in 0.6s ease-out both' }}
    >
      {children}
      <span
        className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-[11px] uppercase tracking-[0.3em] text-parchment-dim/70"
        style={{ animation: `omen-overlay-in 1.2s ease-out ${hintDelay}ms both` }}
      >
        tocca per continuare
      </span>
    </div>
  );
}

// ─── "Voci nella tua testa" — the DM's words, front and centre, echoed by
// drifting whispers. The written text is the point, so it stays legible. ───
const VOICE_SPOTS = [
  { top: '14%', left: '12%', size: 1.1, opacity: 0.5, delay: 0.0, dur: 7 },
  { top: '22%', left: '72%', size: 0.9, opacity: 0.35, delay: 1.4, dur: 8 },
  { top: '34%', left: '30%', size: 0.8, opacity: 0.3, delay: 2.6, dur: 9 },
  { top: '68%', left: '18%', size: 1.0, opacity: 0.4, delay: 0.8, dur: 7.5 },
  { top: '74%', left: '66%', size: 0.85, opacity: 0.32, delay: 2.0, dur: 8.5 },
  { top: '82%', left: '40%', size: 0.95, opacity: 0.38, delay: 3.2, dur: 7 },
  { top: '10%', left: '48%', size: 0.8, opacity: 0.28, delay: 1.8, dur: 9.5 },
  { top: '58%', left: '82%', size: 0.9, opacity: 0.34, delay: 0.4, dur: 8 },
  { top: '46%', left: '6%', size: 0.85, opacity: 0.3, delay: 2.4, dur: 8.5 },
];

function VoicesOmen({ text, onDismiss }: OmenProps) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <OmenOverlay
      onDismiss={onDismiss}
      ariaLabel="Voci nella tua testa"
      background="radial-gradient(120% 90% at 50% 50%, #100418 0%, #06010a 70%, #000 100%)"
    >
      {/* Drifting whisper echoes */}
      {VOICE_SPOTS.map((s, i) => (
        <span
          key={i}
          className="pointer-events-none absolute select-none italic text-[color:#c9b6e6]"
          style={{
            top: s.top,
            left: s.left,
            fontSize: `${s.size}rem`,
            ['--whisper-opacity' as string]: String(s.opacity),
            animation: `omen-whisper-float ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          {words[i % Math.max(1, words.length)]}
        </span>
      ))}

      {/* The DM's message, legible at the centre */}
      <p
        className="relative max-w-lg text-center font-display text-2xl leading-snug text-parchment sm:text-3xl"
        style={{
          textShadow: '0 0 24px rgba(140,110,210,0.55)',
          animation: 'fx-label 1s ease-out both',
        }}
      >
        <span className="mb-3 block text-xs font-normal uppercase tracking-[0.3em] text-[color:#b48ce6]">
          Voci nella tua testa
        </span>
        “{text}”
      </p>
    </OmenOverlay>
  );
}

// ─── "Il marchio inizia a prudere" — blood runs down the dark; the five-notch
// mark (four blackened, the fifth — hers — still clean) glows red. ───
const DRIPS = [
  { left: '8%', w: 3, delay: 0.0, dur: 3.4, opacity: 0.8 },
  { left: '20%', w: 2, delay: 1.1, dur: 4.2, opacity: 0.6 },
  { left: '33%', w: 4, delay: 0.5, dur: 3.0, opacity: 0.9 },
  { left: '47%', w: 2, delay: 1.8, dur: 4.6, opacity: 0.5 },
  { left: '61%', w: 3, delay: 0.9, dur: 3.6, opacity: 0.75 },
  { left: '74%', w: 2, delay: 0.2, dur: 4.0, opacity: 0.6 },
  { left: '88%', w: 3, delay: 1.4, dur: 3.2, opacity: 0.85 },
];

function MarkOmen({ text, onDismiss }: OmenProps) {
  return (
    <OmenOverlay
      onDismiss={onDismiss}
      ariaLabel="Il marchio inizia a prudere"
      background="radial-gradient(120% 100% at 50% 30%, #2a0409 0%, #12020a 60%, #000 100%)"
    >
      {/* Falling blood */}
      {DRIPS.map((d, i) => (
        <span
          key={i}
          className="pointer-events-none absolute top-0 rounded-b-full"
          style={{
            left: d.left,
            width: `${d.w}px`,
            height: '28px',
            background: 'linear-gradient(to bottom, transparent, var(--color-flag-red))',
            opacity: d.opacity,
            animation: `omen-blood-drip ${d.dur}s linear ${d.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative flex flex-col items-center">
        <FiveNotchMark />
        <p className="mt-8 max-w-md text-center text-lg leading-relaxed text-[color:#e9b7ad]">
          <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-flag-red">
            Il marchio brucia
          </span>
          {text}
        </p>
      </div>
    </OmenOverlay>
  );
}

// A circle with five radial notches: four blackened with charcoal, the fifth
// (top) still clean — the player is the fifth (from the lore's wall symbol).
function FiveNotchMark() {
  const cx = 60;
  const cy = 60;
  const inner = 30;
  const outer = 46;
  const notches = [0, 1, 2, 3, 4].map((i) => {
    // Top notch (i === 0) is the clean fifth; angle starts at -90°.
    const angle = (-90 + i * 72) * (Math.PI / 180);
    return {
      clean: i === 0,
      x1: cx + inner * Math.cos(angle),
      y1: cy + inner * Math.sin(angle),
      x2: cx + outer * Math.cos(angle),
      y2: cy + outer * Math.sin(angle),
    };
  });
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      style={{ animation: 'omen-mark-pulse 2.4s ease-in-out infinite' }}
      aria-hidden
    >
      <circle cx={cx} cy={cy} r={outer} fill="none" stroke="var(--color-flag-red)" strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r={inner} fill="none" stroke="var(--color-flag-red)" strokeWidth="1.5" opacity="0.6" />
      {notches.map((n, i) => (
        <line
          key={i}
          x1={n.x1}
          y1={n.y1}
          x2={n.x2}
          y2={n.y2}
          stroke={n.clean ? 'var(--color-parchment-dim)' : 'var(--color-flag-red)'}
          strokeWidth={n.clean ? 2 : 5}
          strokeLinecap="round"
          opacity={n.clean ? 0.5 : 1}
        />
      ))}
    </svg>
  );
}

// ─── "Blackout" — the world drops out; a hard flicker, then black, then the
// line she comes to with swims into focus. ───
function BlackoutOmen({ text, onDismiss }: OmenProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Blackout"
      onClick={onDismiss}
      className="fixed inset-0 z-[80] flex cursor-pointer items-center justify-center overflow-hidden p-8"
      style={{ background: '#000', animation: 'omen-flicker 1.3s steps(1, end) 1 both' }}
    >
      <p
        className="max-w-md text-center text-lg leading-relaxed text-[color:#cbb79a]"
        style={{ animation: 'omen-reveal 2.6s ease-out 1.3s both' }}
      >
        {text}
      </p>
      <span
        className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-[11px] uppercase tracking-[0.3em] text-parchment-dim/60"
        style={{ animation: 'omen-overlay-in 1.4s ease-out 3.6s both' }}
      >
        tocca per continuare
      </span>
    </div>
  );
}

// ─── "Una presenza ti osserva" — red eyes open in the dark, some barely there;
// one pair (the Shadow) burns brighter. ───
const EYES = [
  { top: '26%', left: '18%', scale: 0.7, opacity: 0.35, delay: 0.6, blink: 5.5 },
  { top: '40%', left: '78%', scale: 0.8, opacity: 0.45, delay: 1.4, blink: 0 },
  { top: '62%', left: '30%', scale: 0.6, opacity: 0.25, delay: 2.2, blink: 6.5 },
  { top: '20%', left: '60%', scale: 0.65, opacity: 0.3, delay: 1.0, blink: 0 },
  { top: '70%', left: '68%', scale: 0.75, opacity: 0.4, delay: 2.8, blink: 7 },
  // The Shadow: closer, brighter, unblinking.
  { top: '48%', left: '48%', scale: 1.15, opacity: 0.95, delay: 3.4, blink: 0 },
];

function WatchedOmen({ text, onDismiss }: OmenProps) {
  return (
    <OmenOverlay
      onDismiss={onDismiss}
      ariaLabel="Una presenza ti osserva"
      background="radial-gradient(90% 70% at 50% 45%, #0a0406 0%, #000 75%)"
      hintDelay={4200}
    >
      {EYES.map((e, i) => (
        <EyePair key={i} {...e} />
      ))}
      <p
        className="pointer-events-none absolute bottom-16 left-0 right-0 mx-auto max-w-sm px-6 text-center text-base leading-relaxed text-[color:#b8998f]"
        style={{ animation: 'omen-overlay-in 2s ease-out 3.4s both' }}
      >
        {text}
      </p>
    </OmenOverlay>
  );
}

function EyePair({
  top,
  left,
  scale,
  opacity,
  delay,
  blink,
}: {
  top: string;
  left: string;
  scale: number;
  opacity: number;
  delay: number;
  blink: number;
}) {
  const eye = (
    <span
      className="block rounded-full"
      style={{
        width: '14px',
        height: '9px',
        background: 'radial-gradient(circle, #ff5a4d 0%, var(--color-flag-red) 55%, #4a0a06 100%)',
        boxShadow: '0 0 12px 2px rgba(195,47,39,0.8)',
        animation: blink ? `omen-blink ${blink}s ease-in-out ${delay + 1}s infinite` : undefined,
      }}
    />
  );
  return (
    <div
      className="pointer-events-none absolute flex items-center gap-[10px]"
      style={{
        top,
        left,
        transform: `scale(${scale})`,
        ['--eye-opacity' as string]: String(opacity),
        animation: `omen-eye-open 1.6s ease-out ${delay}s both`,
      }}
    >
      {eye}
      {eye}
    </div>
  );
}

// ─── "Il tuo nome, sussurrato" — a single word (her name) echoing from the
// dark. Like Voices, but the whole void knows only that one word. ───
const NAME_SPOTS = [
  { top: '18%', left: '20%', size: 1.4, opacity: 0.4, delay: 0.2, dur: 7 },
  { top: '30%', left: '66%', size: 1.1, opacity: 0.3, delay: 1.6, dur: 8.5 },
  { top: '64%', left: '24%', size: 1.2, opacity: 0.34, delay: 0.9, dur: 8 },
  { top: '72%', left: '62%', size: 1.0, opacity: 0.28, delay: 2.4, dur: 9 },
  { top: '44%', left: '82%', size: 0.95, opacity: 0.25, delay: 1.2, dur: 8 },
  { top: '52%', left: '6%', size: 1.0, opacity: 0.3, delay: 2.0, dur: 7.5 },
];

function NameOmen({ text, onDismiss }: OmenProps) {
  return (
    <OmenOverlay
      onDismiss={onDismiss}
      ariaLabel="Il tuo nome, sussurrato"
      background="radial-gradient(120% 90% at 50% 45%, #0b0f14 0%, #04070a 70%, #000 100%)"
    >
      {NAME_SPOTS.map((s, i) => (
        <span
          key={i}
          className="pointer-events-none absolute select-none italic text-[color:#a8c7d6]"
          style={{
            top: s.top,
            left: s.left,
            fontSize: `${s.size}rem`,
            ['--whisper-opacity' as string]: String(s.opacity),
            animation: `omen-whisper-float ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          {text}
        </span>
      ))}
      <p
        className="relative text-center font-display text-4xl text-parchment sm:text-5xl"
        style={{ textShadow: '0 0 26px rgba(120,160,190,0.5)', animation: 'fx-label 1.2s ease-out both' }}
      >
        <span className="mb-3 block text-xs font-normal uppercase tracking-[0.3em] text-[color:#8fb3c4]">
          Qualcuno sa il tuo nome
        </span>
        {text}
      </p>
    </OmenOverlay>
  );
}

// ─── "Le torce si piegano" — every flame leans toward the unseen presence. ───
const FLAMES = [
  { left: '12%', size: 1.0, delay: 0.0, dur: 2.2 },
  { left: '30%', size: 1.3, delay: 0.4, dur: 2.6 },
  { left: '50%', size: 1.1, delay: 0.2, dur: 2.0 },
  { left: '70%', size: 1.35, delay: 0.6, dur: 2.4 },
  { left: '86%', size: 0.95, delay: 0.3, dur: 2.2 },
];

function Flame({ left, size, delay, dur }: { left: string; size: number; delay: number; dur: number }) {
  return (
    <span
      className="pointer-events-none absolute bottom-[16%]"
      style={{ left, transformOrigin: 'bottom center', animation: `omen-flame-lean ${dur}s ease-in-out ${delay}s infinite` }}
    >
      <span
        className="block"
        style={{
          width: `${14 * size}px`,
          height: `${32 * size}px`,
          background:
            'radial-gradient(ellipse at 50% 80%, #ffd98a 0%, var(--color-ochre) 45%, var(--color-flag-red) 80%, transparent 100%)',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          filter: 'blur(1px)',
          boxShadow: '0 0 18px 4px rgba(219,124,38,0.5)',
        }}
      />
    </span>
  );
}

function TorchesOmen({ text, onDismiss }: OmenProps) {
  return (
    <OmenOverlay
      onDismiss={onDismiss}
      ariaLabel="Le torce si piegano"
      background="radial-gradient(120% 90% at 50% 82%, #16100a 0%, #070402 65%, #000 100%)"
    >
      {FLAMES.map((f, i) => (
        <Flame key={i} {...f} />
      ))}
      <p
        className="max-w-md text-center text-lg leading-relaxed text-[color:#d8c4a0]"
        style={{ animation: 'fx-label 1s ease-out both' }}
      >
        <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-ochre">Le fiamme si piegano</span>
        {text}
      </p>
    </OmenOverlay>
  );
}

// ─── "L'acqua non riflette" — the shimmer flattens and a wrong sky seeps in. ───
function WaterOmen({ text, onDismiss }: OmenProps) {
  return (
    <OmenOverlay
      onDismiss={onDismiss}
      ariaLabel="L'acqua non riflette"
      background="linear-gradient(to bottom, #05080a 0%, #060a0e 50%, #01040a 100%)"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(90,130,150,0.18), transparent 70%)',
            animation: 'omen-water-still 3.5s ease-out 0.8s forwards',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(80% 60% at 50% 100%, rgba(20,26,30,0.6), transparent)' }}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px" style={{ background: 'rgba(120,150,165,0.35)' }} />
      <p
        className="relative -translate-y-10 max-w-md text-center text-lg leading-relaxed text-[color:#a9c2ce]"
        style={{ animation: 'fx-label 1s ease-out both' }}
      >
        <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-[color:#7fa6b6]">Il riflesso è sbagliato</span>
        {text}
      </p>
    </OmenOverlay>
  );
}

// ─── "La magia selvaggia si sveglia" — her chaos, iridescent: the anti-red. ───
const IRIDESCENT = 'linear-gradient(120deg, #b48ce6 0%, #6ec3d6 30%, #7ee0b0 55%, #e6c46e 80%, #d98cc4 100%)';
const MOTES = [
  { top: '22%', left: '24%', s: 8, o: 0.6, delay: 0.0, dur: 6.5 },
  { top: '34%', left: '70%', s: 6, o: 0.5, delay: 1.2, dur: 7.5 },
  { top: '58%', left: '18%', s: 10, o: 0.5, delay: 0.6, dur: 7 },
  { top: '66%', left: '76%', s: 7, o: 0.45, delay: 2.0, dur: 8 },
  { top: '16%', left: '54%', s: 6, o: 0.4, delay: 1.6, dur: 8.5 },
  { top: '48%', left: '88%', s: 8, o: 0.5, delay: 0.9, dur: 7 },
  { top: '74%', left: '42%', s: 6, o: 0.42, delay: 2.4, dur: 7.5 },
  { top: '40%', left: '8%', s: 7, o: 0.45, delay: 1.4, dur: 8 },
];

function WildOmen({ text, onDismiss }: OmenProps) {
  return (
    <OmenOverlay
      onDismiss={onDismiss}
      ariaLabel="La magia selvaggia si sveglia"
      background="radial-gradient(120% 90% at 50% 50%, #14061c 0%, #0a0410 70%, #02030a 100%)"
    >
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            top: m.top,
            left: m.left,
            width: `${m.s}px`,
            height: `${m.s}px`,
            background: IRIDESCENT,
            boxShadow: '0 0 12px 2px rgba(150,120,210,0.6)',
            ['--whisper-opacity' as string]: String(m.o),
            animation: `omen-whisper-float ${m.dur}s ease-in-out ${m.delay}s infinite`,
          }}
        />
      ))}
      <div className="relative flex flex-col items-center">
        <span className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:#b48ce6]">Il caos si desta</span>
        <p
          className="max-w-md text-center font-display text-3xl leading-snug"
          style={{
            backgroundImage: IRIDESCENT,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: 'dice-tumble 0.7s ease-out both',
          }}
        >
          {text}
        </p>
      </div>
    </OmenOverlay>
  );
}

// ─── "Un sogno" — soft, drifting, dreamlike (reuses the intro blob motion). ───
function DreamOmen({ text, onDismiss }: OmenProps) {
  return (
    <OmenOverlay
      onDismiss={onDismiss}
      ariaLabel="Un sogno"
      hintDelay={2800}
      background="radial-gradient(120% 90% at 50% 40%, #10131f 0%, #08060f 70%, #04030a 100%)"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ animation: 'intro-hue 40s linear infinite' }}>
        <div
          className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(120,110,200,0.35), transparent 70%)', filter: 'blur(40px)', animation: 'intro-blob-a 18s ease-in-out infinite' }}
        />
        <div
          className="absolute right-0 top-0 h-96 w-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(90,150,170,0.3), transparent 70%)', filter: 'blur(44px)', animation: 'intro-blob-b 22s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(180,120,170,0.28), transparent 70%)', filter: 'blur(48px)', animation: 'intro-blob-c 20s ease-in-out infinite' }}
        />
      </div>
      <p
        className="relative max-w-md text-center text-xl italic leading-relaxed text-[color:#d8d2ea]"
        style={{ textShadow: '0 0 30px rgba(120,110,200,0.5)', animation: 'omen-reveal 2.4s ease-out both' }}
      >
        <span className="mb-3 block text-xs not-italic uppercase tracking-[0.3em] text-[color:#a99fd0]">Nel sonno</span>
        {text}
      </p>
    </OmenOverlay>
  );
}

// ─── "Biglietto" — a note in her own hand, on aged paper. ───
function HandoutOmen({ text, onDismiss }: OmenProps) {
  return (
    <OmenOverlay
      onDismiss={onDismiss}
      ariaLabel="Un biglietto"
      hintDelay={2200}
      background="radial-gradient(120% 90% at 50% 40%, #1a120a 0%, #0a0603 70%, #000 100%)"
    >
      <div
        className="relative max-w-sm rounded-sm px-8 py-10 text-[color:#2a1a10]"
        style={{
          fontFamily: 'var(--font-hand)',
          backgroundColor: '#e9dcbf',
          boxShadow: '0 24px 60px -20px rgba(0,0,0,0.85), inset 0 0 40px rgba(150,110,60,0.25)',
          animation: 'omen-paper-in 0.9s cubic-bezier(0.2,0.8,0.2,1) both',
        }}
      >
        <p className="whitespace-pre-wrap text-2xl leading-relaxed sm:text-3xl">{text}</p>
      </div>
    </OmenOverlay>
  );
}

// ─── "Busta sigillata" — a wax-sealed envelope; the pressure of the unopened. ───
function SealedOmen({ text, onDismiss }: OmenProps) {
  return (
    <OmenOverlay
      onDismiss={onDismiss}
      ariaLabel="Una busta sigillata"
      background="radial-gradient(120% 90% at 50% 40%, #16100c 0%, #080503 70%, #000 100%)"
    >
      <div className="relative flex flex-col items-center">
        <div
          className="relative w-72 max-w-[80vw] rounded-sm px-6 pb-16 pt-10 text-center text-xl text-[color:#3a2a18]"
          style={{
            fontFamily: 'var(--font-hand)',
            backgroundColor: '#ddceac',
            boxShadow: '0 24px 60px -20px rgba(0,0,0,0.85), inset 0 0 30px rgba(150,110,60,0.2)',
            animation: 'omen-paper-in 0.9s cubic-bezier(0.2,0.8,0.2,1) both',
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-16"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.12), transparent)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
          />
          <span className="relative whitespace-pre-wrap">{text}</span>
          <span
            className="absolute bottom-3 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full text-lg"
            style={{
              background: 'radial-gradient(circle at 40% 35%, #a83226, var(--color-burgundy) 70%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 2px 6px rgba(255,255,255,0.2)',
              color: 'rgba(255,220,200,0.55)',
            }}
          >
            ✦
          </span>
        </div>
        <p className="mt-5 text-xs uppercase tracking-[0.3em] text-parchment-dim">Sigillata</p>
      </div>
    </OmenOverlay>
  );
}
