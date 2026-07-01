import { notFound } from 'next/navigation';
import { getOrCreateSingletonCampaign, loadState } from '@/lib/game/repo';
import { saveCharacterForCampaign } from '@/app/game-actions';
import { PlayerOnboarding } from './PlayerOnboarding';
import { PlayerSheet } from './[playerToken]/PlayerSheet';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'The meaning of invincible' };

/**
 * Tokenless player entry for the single fixed campaign. Resolves the campaign's
 * player token server-side (never shown in the URL) and drives the same
 * token-based sheet/onboarding as `/play/[playerToken]`.
 */
export default async function PlayHome() {
  const campaign = await getOrCreateSingletonCampaign();
  const state = await loadState(campaign.playerToken);
  if (!state) notFound();

  const active =
    state.character && state.character.status === 'active' && state.character.sheet;

  if (!active) {
    return (
      <PlayerOnboarding
        save={saveCharacterForCampaign.bind(null, campaign.playerToken)}
      />
    );
  }
  return <PlayerSheet token={campaign.playerToken} initial={state} />;
}
