import Link from 'next/link';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';

// Legacy two-door landing (player vs master). No longer the entry point — the
// root redirects the player straight into /play — but kept at /menu for debugging.
export const metadata = { title: 'The meaning of invincible' };

export default function Menu() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <GiDiceTwentyFacesTwenty className="mb-6 h-16 w-16 text-gold" aria-hidden />
      <h1 className="font-display text-3xl leading-tight text-parchment">
        La tua avventura
        <br />
        inizia qui
      </h1>
      <span
        className="mt-5 h-1 w-28 rounded-full"
        style={{ backgroundImage: 'var(--gradient-quest)' }}
        aria-hidden
      />
      <p className="mt-5 max-w-sm text-parchment-dim">
        Crea il tuo personaggio di Dungeons &amp; Dragons 5e passo dopo passo: scegli razza,
        classe e destino, poi entra in gioco.
      </p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/dm"
          className="inline-flex items-center justify-center rounded-xl bg-gold px-6 py-3 font-medium text-[color:var(--color-ink)] transition-all hover:brightness-110"
        >
          Sono il Master
        </Link>
        <Link
          href="/play"
          className="inline-flex items-center justify-center rounded-xl border border-ink-border px-6 py-3 font-medium text-parchment transition-colors hover:border-ochre"
        >
          Sono il Giocatore
        </Link>
      </div>
    </main>
  );
}
