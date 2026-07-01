import { notFound } from 'next/navigation';
import { loadState } from '@/lib/game/repo';
import { DmDashboard } from './DmDashboard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Master — Cruscotto campagna' };

export default async function DmCampaignPage({
  params,
}: {
  params: Promise<{ dmToken: string }>;
}) {
  const { dmToken } = await params;
  const state = await loadState(dmToken);
  if (!state || state.role !== 'dm') notFound();
  return <DmDashboard token={dmToken} initial={state} />;
}
