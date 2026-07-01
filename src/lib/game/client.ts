'use client';

import useSWR from 'swr';
import type { CampaignState } from '@/lib/game/repo';

async function fetcher(url: string): Promise<CampaignState> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Impossibile aggiornare lo stato della campagna.');
  return res.json();
}

/** Polls campaign state every few seconds and returns a manual refresh. */
export function useCampaignState(token: string, fallbackData: CampaignState) {
  const { data, mutate, isValidating } = useSWR<CampaignState>(
    `/api/state/${token}`,
    fetcher,
    {
      refreshInterval: 2500,
      fallbackData,
      revalidateOnFocus: true,
      keepPreviousData: true,
    },
  );
  return { state: data ?? fallbackData, refresh: () => mutate(), isValidating };
}
