'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCampaign } from '@/app/game-actions';

export function CreateCampaignForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await createCampaign(name);
      router.push(`/dm/${res.dmToken}`);
    } catch {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome della campagna"
        maxLength={80}
        className="flex-1 rounded-lg border border-ink-border bg-[color:var(--color-ink)] px-3 py-2.5 text-parchment placeholder:text-parchment-dim/60 focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-gold px-5 py-2.5 font-medium text-[color:var(--color-ink)] transition-all hover:brightness-110 disabled:opacity-60"
      >
        {busy ? 'Creo…' : 'Crea campagna'}
      </button>
    </form>
  );
}
