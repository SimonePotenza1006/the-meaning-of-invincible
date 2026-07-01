import { notFound } from 'next/navigation';
import { loadState } from '@/lib/game/repo';
import { saveCharacterForCampaign } from '@/app/game-actions';
import { PlayerOnboarding } from '../PlayerOnboarding';
import { PlayerSheet } from './PlayerSheet';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'La tua scheda — D&D 5e' };

export default async function PlayPage({
  params,
}: {
  params: Promise<{ playerToken: string }>;
}) {
  const { playerToken } = await params;
  const state = await loadState(playerToken);
  if (!state || state.role !== 'player') notFound();

  const active =
    state.character && state.character.status === 'active' && state.character.sheet;

  if (!active) {
    return <PlayerOnboarding save={saveCharacterForCampaign.bind(null, playerToken)} />;
  }
  return <PlayerSheet token={playerToken} initial={state} />;
}
