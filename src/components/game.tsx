'use client';

import { useState } from 'react';
import type { GameEvent } from '@/db';
import { cn } from '@/app/crea/ui';
import type { Adv } from '@/lib/game/roll';

export function StatTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-ink-border bg-ink-raised px-2 py-2 text-center">
      <div className="font-display text-xl leading-none text-parchment">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wide text-parchment-dim">{label}</div>
    </div>
  );
}

export function HpBar({
  current,
  max,
  temp,
}: {
  current: number;
  max: number;
  temp: number;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  const color = pct > 50 ? 'var(--color-ochre)' : pct > 25 ? 'var(--color-paprika)' : 'var(--color-flag-red)';
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-display text-2xl text-parchment">
          {current}
          <span className="text-base text-parchment-dim"> / {max}</span>
        </span>
        {temp > 0 && <span className="text-sm text-gold">+{temp} temp</span>}
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-ink-border">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function AdvToggle({ value, onChange }: { value: Adv; onChange: (v: Adv) => void }) {
  const opts: [Adv, string][] = [
    ['disadvantage', 'Svantaggio'],
    ['normal', 'Normale'],
    ['advantage', 'Vantaggio'],
  ];
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg border border-ink-border bg-ink-raised p-1">
      {opts.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={cn(
            'rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
            value === v
              ? 'bg-gold text-[color:var(--color-ink)]'
              : 'text-parchment-dim hover:text-parchment',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function Stepper({
  value,
  onDec,
  onInc,
  suffix,
}: {
  value: React.ReactNode;
  onDec: () => void;
  onInc: () => void;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <RoundBtn label="−" onClick={onDec} />
      <span className="min-w-12 text-center tabular-nums text-parchment">
        {value}
        {suffix}
      </span>
      <RoundBtn label="+" onClick={onInc} />
    </div>
  );
}

export function RoundBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink-border text-lg text-parchment transition-colors',
        disabled ? 'cursor-not-allowed opacity-40' : 'hover:border-gold hover:text-gold',
      )}
    >
      {label}
    </button>
  );
}

const ACTOR_STYLE: Record<string, string> = {
  dm: 'text-gold',
  player: 'text-ochre',
  system: 'text-parchment-dim',
};

const ACTOR_LABEL: Record<string, string> = {
  dm: 'DM',
  player: 'Giocatore',
  system: 'Sistema',
};

function eventTime(value: unknown): string {
  try {
    const d = new Date(value as string);
    return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function LogFeed({ events }: { events: GameEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-parchment-dim">Ancora nessun evento.</p>;
  }
  return (
    <ul className="space-y-2">
      {events.map((e) => (
        <li key={e.id} className="text-sm leading-snug">
          <span className="text-[11px] tabular-nums text-parchment-dim">{eventTime(e.createdAt)}</span>{' '}
          <span className={cn('text-[11px] font-semibold uppercase', ACTOR_STYLE[e.actor] ?? '')}>
            {ACTOR_LABEL[e.actor] ?? e.actor}
          </span>
          <span className="text-parchment"> · {e.message}</span>
        </li>
      ))}
    </ul>
  );
}

export function RollRow({
  label,
  mod,
  onClick,
  highlight,
}: {
  label: string;
  mod: number;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors',
        highlight
          ? 'border-gold/60 bg-burgundy/30'
          : 'border-ink-border bg-ink-raised hover:border-ochre/70',
      )}
    >
      <span className="text-parchment">
        {highlight && <span className="mr-1 text-gold">●</span>}
        {label}
      </span>
      <span className="font-display text-base text-gold">{mod >= 0 ? `+${mod}` : mod}</span>
    </button>
  );
}

export function RollTile({
  label,
  score,
  mod,
  onClick,
}: {
  label: string;
  score: number;
  mod: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-ink-border bg-ink-raised py-2 text-center transition-colors hover:border-gold"
    >
      <div className="text-[10px] uppercase tracking-wide text-ochre">{label}</div>
      <div className="font-display text-xl text-parchment">{score}</div>
      <div className="text-xs text-parchment-dim">{mod >= 0 ? `+${mod}` : mod}</div>
    </button>
  );
}

export function TokenBox({ label, path }: { label: string; path: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="rounded-lg border border-ink-border bg-ink-raised p-3">
      <div className="mb-1 text-xs uppercase tracking-wide text-ochre">{label}</div>
      <div className="flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate text-xs text-parchment-dim">{path}</code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-md bg-gold px-3 py-1.5 text-xs font-medium text-[color:var(--color-ink)] hover:brightness-110"
        >
          {copied ? 'Copiato!' : 'Copia'}
        </button>
      </div>
    </div>
  );
}
