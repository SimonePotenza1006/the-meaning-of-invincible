import { redirect } from 'next/navigation';

// Single fixed campaign: the front door is the player experience (presentation →
// character creation → sheet). The Master uses /dm directly; the legacy landing
// with both doors is kept at /menu.
export default function Home() {
  redirect('/play');
}
