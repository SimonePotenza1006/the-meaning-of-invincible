import { notFound } from 'next/navigation';
import { getOrCreateSingletonCampaign, loadState } from '@/lib/game/repo';
import { DmDashboard } from './[dmToken]/DmDashboard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Master — The meaning of invincible' };

/**
 * Tokenless Master entry for the single fixed campaign. Resolves the campaign's
 * DM token server-side and renders the live dashboard (which shows a "waiting
 * for the player to create their character" state until one is active).
 * The legacy multi-campaign list lives on at /dm/campaigns.
 */
export default async function DmHome() {
  const campaign = await getOrCreateSingletonCampaign();
  const state = await loadState(campaign.dmToken);
  if (!state || state.role !== 'dm') notFound();
  return <DmDashboard token={campaign.dmToken} initial={state} />;
}
