'use client';

import { useState } from 'react';
import { performRoll, type Adv } from '@/lib/game/roll';
import { AdvToggle } from '@/components/game';
import type { GameEvent } from '@/db';

interface RequestData {
  mode?: string;
  key?: string;
  label?: string;
  advantage?: boolean;
}

/**
 * Non-dismissable modal (like the level-up dialog) shown to the player whenever
 * the DM has asked for a roll. It handles one request at a time — rolling
 * answers the current one and the next (if any) takes its place. Rendered at the
 * player-sheet root so it overlays any section. Key it by the current request id
 * so the advantage state resets per request.
 */
export function RollRequestDialog({
  requests,
  token,
  modFor,
  onRolled,
}: {
  requests: GameEvent[];
  token: string;
  modFor: (data: RequestData) => number;
  onRolled: () => void;
}) {
  const current = requests[0];
  const data = (current?.data ?? {}) as RequestData;
  const [adv, setAdv] = useState<Adv>(data.advantage ? 'advantage' : 'normal');
  const [busy, setBusy] = useState(false);

  if (!current) return null;

  async function roll() {
    setBusy(true);
    try {
      await performRoll(token, data.label ?? 'Tiro', modFor(data), adv, current.id);
      onRolled();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Richiesta di tiro dal DM"
    >
      <section className="m-auto w-full max-w-md rounded-xl border-2 border-gold bg-ink-raised p-5 shadow-[0_20px_60px_-15px_var(--color-gold)]">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Il DM chiede un tiro</p>
        <h2 className="mt-1 font-display text-2xl leading-tight text-parchment">{data.label}</h2>
        {requests.length > 1 && (
          <p className="mt-1 text-xs text-parchment-dim">Richiesta 1 di {requests.length}</p>
        )}

        <div className="mt-5">
          <p className="mb-2 text-xs uppercase tracking-wide text-parchment-dim">Modalità di tiro</p>
          <AdvToggle value={adv} onChange={setAdv} />
        </div>

        <button
          type="button"
          onClick={roll}
          disabled={busy}
          className="mt-5 w-full rounded-xl bg-gold px-5 py-3 font-medium text-[color:var(--color-ink)] transition-all hover:brightness-110 disabled:opacity-60"
        >
          {busy ? 'Tiro…' : 'Tira'}
        </button>
        <p className="mt-3 text-center text-xs text-parchment-dim">Devi tirare per continuare.</p>
      </section>
    </div>
  );
}
