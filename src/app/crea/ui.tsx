'use client';

import type { IconType } from 'react-icons';

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

// Warm ramp sampled from the brand palette, one stop per creation step.
export const STEP_COLORS = [
  '#780116',
  '#9e1f1e',
  '#c32f27',
  '#d8572a',
  '#db7c26',
  '#e79a30',
  '#f7b538',
];

/** The signature "quest path": nodes brighten along the palette as you advance. */
export function StepRail({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div>
      <div className="flex items-center" role="presentation">
        {steps.map((label, i) => {
          const done = i <= current;
          const color = STEP_COLORS[i % STEP_COLORS.length];
          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <span
                className={cn(
                  'h-3 w-3 shrink-0 rounded-full transition-all duration-300',
                  i === current && 'h-4 w-4 ring-2 ring-offset-2 ring-offset-[color:var(--color-ink)]',
                )}
                style={{
                  background: done ? color : 'var(--color-ink-border)',
                  boxShadow: i === current ? `0 0 12px ${color}` : undefined,
                  ...(i === current ? { ['--tw-ring-color' as string]: color } : {}),
                }}
              />
              {i < steps.length - 1 && (
                <span
                  className="mx-1 h-0.5 flex-1 rounded-full transition-colors duration-300"
                  style={{ background: i < current ? color : 'var(--color-ink-border)' }}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.15em] text-parchment-dim">
        Passo {current + 1} di {steps.length} ·{' '}
        <span className="text-gold">{steps[current]}</span>
      </p>
    </div>
  );
}

export function StepHeading({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <header className="mb-5">
      <h1 className="font-display text-2xl leading-tight text-parchment">{title}</h1>
      {hint && <p className="mt-2 text-sm text-parchment-dim">{hint}</p>}
    </header>
  );
}

export function ChoiceCard({
  icon: Icon,
  title,
  subtitle,
  description,
  selected,
  compact,
  onClick,
}: {
  icon: IconType;
  title: string;
  subtitle?: string;
  description?: string;
  selected: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        selected
          ? 'border-gold bg-burgundy/40'
          : 'border-ink-border bg-ink-raised hover:border-ochre/70 hover:bg-burgundy/20',
      )}
      style={
        selected
          ? { boxShadow: '0 10px 30px -14px var(--color-gold)' }
          : undefined
      }
    >
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg transition-colors',
          compact ? 'h-10 w-10' : 'h-12 w-12',
          selected ? 'text-gold' : 'text-ochre group-hover:text-gold',
        )}
        style={{ background: 'color-mix(in srgb, var(--color-ink) 65%, transparent)' }}
      >
        <Icon className={compact ? 'h-6 w-6' : 'h-7 w-7'} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span
            className={cn(
              'font-display leading-tight text-parchment',
              compact ? 'text-base' : 'text-lg',
            )}
          >
            {title}
          </span>
          {subtitle && (
            <span className="max-w-[50%] shrink-0 text-right text-xs text-parchment-dim">
              {subtitle}
            </span>
          )}
        </span>
        {description && (
          <span className="mt-1 block text-sm leading-snug text-parchment-dim">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}

export function Chip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        selected
          ? 'border-gold bg-gold text-[color:var(--color-ink)]'
          : 'border-ink-border bg-ink-raised text-parchment-dim hover:border-ochre/70',
        disabled && 'cursor-not-allowed opacity-45',
      )}
    >
      {label}
    </button>
  );
}

export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink-border/60 py-1.5 text-sm last:border-0">
      <span className="text-parchment-dim">{label}</span>
      <span className="text-right font-medium text-parchment">{value}</span>
    </div>
  );
}

export function Panel({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-ink-border bg-ink-raised/70 p-4">
      {title && (
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ochre">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
