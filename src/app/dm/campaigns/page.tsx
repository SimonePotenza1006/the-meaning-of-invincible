import Link from 'next/link';
import { listCampaigns } from '@/lib/game/repo';
import { CreateCampaignForm } from '../CreateCampaignForm';

// Legacy multi-campaign console. No longer linked from the app (this app runs a
// single fixed campaign — see /dm), but kept reachable at /dm/campaigns for
// debugging and data inspection.
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Master — Le tue campagne' };

export default async function DmCampaigns() {
  const campaigns = await listCampaigns();
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-ochre">Vista Master</p>
      <h1 className="mt-1 font-display text-3xl text-parchment">Tavolo del Master</h1>
      <p className="mt-2 text-parchment-dim">
        Crea una campagna e condividi il link con la tua giocatrice: lei creerà il personaggio
        dal telefono, tu lo vedrai apparire qui.
      </p>

      <div className="mt-6">
        <CreateCampaignForm />
      </div>

      <h2 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-[0.15em] text-ochre">
        Campagne
      </h2>
      {campaigns.length === 0 ? (
        <p className="text-parchment-dim">Nessuna campagna. Creane una qui sopra.</p>
      ) : (
        <ul className="space-y-2">
          {campaigns.map((c) => (
            <li key={c.id}>
              <Link
                href={`/dm/${c.dmToken}`}
                className="flex items-center justify-between rounded-xl border border-ink-border bg-ink-raised p-4 transition-colors hover:border-ochre"
              >
                <span>
                  <span className="font-display text-lg text-parchment">{c.name}</span>
                  <span className="ml-2 text-xs text-parchment-dim">
                    #{c.id} · {c.status === 'active' ? 'in gioco' : 'in preparazione'}
                  </span>
                </span>
                <span className="text-sm text-gold">Apri →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
