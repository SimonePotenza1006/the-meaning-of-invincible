import { formatMod, roll, rollD20 } from '@/lib/rules';
import { recordRoll } from '@/app/game-actions';

export type Adv = 'normal' | 'advantage' | 'disadvantage';

/** Payload for the local dice animation (see components/RollEffects.tsx). */
export interface RollFx {
  kind: 'd20' | 'dice';
  label: string;
  total: number;
  natural?: number;
  crit?: boolean;
  fumble?: boolean;
}

/** Fire a browser event so the roller's screen animates the dice locally.
 * Local-only by design: the other side never receives it, so secret rolls
 * stay secret and there's no polling lag. */
function emitRollFx(fx: RollFx) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<RollFx>('dnd:roll', { detail: fx }));
  }
}

/** Roll a d20 (client-side, via the rules engine) and record it to the log.
 * `secret` hides the entry from the player's log (DM-only rolls). */
export async function performRoll(
  token: string,
  label: string,
  mod: number,
  adv: Adv,
  requestId?: number,
  secret?: boolean,
) {
  const r = rollD20({
    modifier: mod,
    advantage: adv === 'advantage',
    disadvantage: adv === 'disadvantage',
  });
  const advTag =
    r.mode === 'advantage' ? ' [Vantaggio]' : r.mode === 'disadvantage' ? ' [Svantaggio]' : '';
  const detail = `d20(${r.rolls.join(' / ')})${advTag} ${formatMod(mod)}`;
  emitRollFx({
    kind: 'd20',
    label,
    total: r.total,
    natural: r.used,
    crit: r.used === 20,
    fumble: r.used === 1,
  });
  await recordRoll(token, { label, detail, total: r.total, requestId, secret });
  return r;
}

/** Roll an arbitrary dice expression (e.g. "2d6+1") and record it. */
export async function performDice(token: string, expression: string, secret?: boolean) {
  const r = roll(expression);
  const modPart = r.modifier ? ` ${formatMod(r.modifier)}` : '';
  const detail = `[${r.rolls.join(', ')}]${modPart}`;
  emitRollFx({ kind: 'dice', label: `Dadi ${expression}`, total: r.total });
  await recordRoll(token, { label: `Dadi ${expression}`, detail, total: r.total, secret });
  return r;
}
