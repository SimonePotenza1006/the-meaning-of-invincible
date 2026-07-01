'use client';

import type { ActionCost } from '@/lib/sheet';

// Action economy at a glance: a green square = costs an Action, an orange
// triangle = costs a Bonus Action. Reactions get a faint diamond; anything
// slower (minutes+) shows nothing.
const GREEN = '#3fae5a';

export function ActionGlyph({ cost, className }: { cost?: ActionCost; className?: string }) {
  if (cost === 'action') {
    return (
      <span
        role="img"
        aria-label="Azione"
        title="Azione"
        className={className}
        style={{ color: GREEN, fontSize: '0.7em', lineHeight: 1 }}
      >
        ■
      </span>
    );
  }
  if (cost === 'bonus') {
    return (
      <span
        role="img"
        aria-label="Azione bonus"
        title="Azione bonus"
        className={className}
        style={{ color: 'var(--color-ochre)', fontSize: '0.8em', lineHeight: 1 }}
      >
        ▲
      </span>
    );
  }
  if (cost === 'reaction') {
    return (
      <span
        role="img"
        aria-label="Reazione"
        title="Reazione"
        className={className}
        style={{ color: 'var(--color-parchment-dim)', fontSize: '0.7em', lineHeight: 1 }}
      >
        ◆
      </span>
    );
  }
  return null;
}

/** Small legend explaining the glyphs — show once near actionable lists. */
export function ActionLegend({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-parchment-dim ${className ?? ''}`}>
      <span className="inline-flex items-center gap-1">
        <ActionGlyph cost="action" /> Azione
      </span>
      <span className="inline-flex items-center gap-1">
        <ActionGlyph cost="bonus" /> Azione bonus
      </span>
    </div>
  );
}
