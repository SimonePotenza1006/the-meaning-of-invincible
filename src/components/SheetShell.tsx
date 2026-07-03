'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/app/crea/ui';
import { RollEffects } from '@/components/RollEffects';
import { WildMagicDialog } from '@/components/WildMagicDialog';

export interface ShellSection {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
  /** Omit the section entirely (e.g. spells for a non-caster). */
  hidden?: boolean;
}

/**
 * App-like layout shared by the player sheet and the DM dashboard: a left
 * sidebar to switch sections, a scrolling content area, and an always-visible
 * activity log ("Cronaca") pinned at the bottom with its own fixed-height
 * scroll. `banner` is a persistent slot above the content (e.g. pending
 * requests); `aside` sits at the foot of the sidebar (e.g. the player link).
 */
export function SheetShell({
  eyebrow,
  title,
  subtitle,
  accent,
  sections,
  banner,
  aside,
  rightRail,
  log,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  accent?: string;
  sections: ShellSection[];
  banner?: ReactNode;
  aside?: ReactNode;
  /** Persistent quick-access rail pinned to the right edge (DM dashboard). */
  rightRail?: ReactNode;
  log: ReactNode;
}) {
  const visible = sections.filter((s) => !s.hidden);
  const [active, setActive] = useState(visible[0]?.id ?? '');
  const current = visible.find((s) => s.id === active) ?? visible[0];

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <RollEffects />
      <WildMagicDialog />
      {/* Sidebar */}
      <aside className="flex w-16 shrink-0 flex-col border-r border-ink-border bg-ink-raised/40 sm:w-56">
        <div className="border-b border-ink-border px-2 py-4 text-center sm:px-4 sm:text-left">
          {eyebrow && (
            <p className={cn('truncate text-[10px] uppercase tracking-[0.2em]', accent ?? 'text-ochre')}>
              {eyebrow}
            </p>
          )}
          <h1 className="hidden truncate font-display text-lg leading-tight text-parchment sm:block">
            {title}
          </h1>
          {subtitle && <div className="mt-0.5 hidden text-xs text-parchment-dim sm:block">{subtitle}</div>}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {visible.map((s) => {
            const on = current?.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                aria-current={on}
                title={s.label}
                className={cn(
                  'flex w-full items-center justify-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors sm:justify-start sm:px-3',
                  on
                    ? 'bg-burgundy/40 text-parchment'
                    : 'text-parchment-dim hover:bg-ink-raised hover:text-parchment',
                )}
              >
                <span className={cn('shrink-0 text-xl', on ? 'text-gold' : 'text-ochre')} aria-hidden>
                  {s.icon}
                </span>
                <span className="hidden truncate sm:inline">{s.label}</span>
              </button>
            );
          })}
        </nav>

        {aside && <div className="hidden border-t border-ink-border p-2 sm:block">{aside}</div>}
      </aside>

      {/* Content + pinned log */}
      <div className="flex min-w-0 flex-1 flex-col">
        {banner && <div className="shrink-0 border-b border-ink-border bg-ink-raised/30">{banner}</div>}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto w-full max-w-2xl space-y-4">{current?.content}</div>
        </main>
        <section className="flex h-40 shrink-0 flex-col border-t border-ink-border bg-ink-raised/25 sm:h-48">
          <h2 className="px-4 pt-2 text-xs font-semibold uppercase tracking-[0.15em] text-ochre">
            Cronaca
          </h2>
          <div className="flex-1 overflow-y-auto px-4 pb-3 pt-1">{log}</div>
        </section>
      </div>

      {/* Persistent quick-access rail (right edge) */}
      {rightRail && (
        <aside className="flex w-14 shrink-0 flex-col items-center gap-1 overflow-y-auto border-l border-ink-border bg-ink-raised/40 py-2">
          {rightRail}
        </aside>
      )}
    </div>
  );
}
