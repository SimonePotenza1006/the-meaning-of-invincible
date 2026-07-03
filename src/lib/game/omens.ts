/**
 * Omens & messages — narrative pushes the DM sends to the player's screen, each
 * rendered as a bespoke full-screen modal (see components/OmenLayer.tsx). Unlike
 * the wild magic dialog (local to the roller), these travel DM → player through
 * the events table + polling, so they appear on the player's device on command.
 *
 * Signature beats of *this* campaign (the red eyes, the mark, the blackouts, the
 * watching Shadow, the leitmotivs, her iridescent chaos, the note in her own
 * hand). Discipline, per the design docs: never fire one "empty" — if the mark
 * itches, something marked really is near; if the torches lean, the Shadow is there.
 *
 * Every omen carries a DM-authored line. For some the text IS the content (the
 * words in her head, a whispered name, a written note), so it is required; for
 * the rest a fallback line covers an empty message.
 */
export type OmenType =
  | 'voices'
  | 'name'
  | 'mark'
  | 'blackout'
  | 'watched'
  | 'torches'
  | 'water'
  | 'wild'
  | 'dream'
  | 'handout'
  | 'sealed';

export type OmenGroup = 'presagio' | 'messaggio';

export interface OmenData {
  type: OmenType;
  /** DM-authored line shown inside the modal. Required where `requiresText`. */
  message?: string;
}

export interface OmenPreset {
  /** Which drawer of the DM composer this belongs to. */
  group: OmenGroup;
  /** Button label in the DM dashboard. */
  label: string;
  /** Short kicker shown above the text in the modal. */
  kicker: string;
  /** Emoji used on the DM button and in the log. */
  glyph: string;
  /** Placeholder for the DM's message field. */
  placeholder: string;
  /** Shown inside the modal when the DM leaves the message empty. */
  fallback: string;
  /** Whether the DM must write the text before sending (the words are the point). */
  requiresText: boolean;
}

export const OMEN_PRESETS: Record<OmenType, OmenPreset> = {
  voices: {
    group: 'presagio',
    label: 'Voci nella tua testa',
    kicker: 'Voci nella tua testa',
    glyph: '🗣️',
    placeholder: 'Scrivi le parole che le sussurrano dentro…',
    fallback: 'Non sei sola, qui dentro.',
    requiresText: true,
  },
  name: {
    group: 'presagio',
    label: 'Il tuo nome, sussurrato',
    kicker: 'Qualcuno sa il tuo nome',
    glyph: '👤',
    placeholder: 'Il nome che sente sussurrare (di solito il suo)…',
    fallback: '',
    requiresText: true,
  },
  mark: {
    group: 'presagio',
    label: 'Il marchio inizia a prudere',
    kicker: 'Il marchio brucia',
    glyph: '🩸',
    placeholder: 'Cosa avverte mentre il marchio si sveglia… (facoltativo)',
    fallback: 'Il marchio ti prude sotto la pelle. Qualcosa di segnato è vicino.',
    requiresText: false,
  },
  blackout: {
    group: 'presagio',
    label: 'Blackout',
    kicker: '…',
    glyph: '🌑',
    placeholder: 'Ciò che percepisce mentre riaffiora… (facoltativo)',
    fallback: 'Il mondo si spegne. Quando torni, non ricordi l’ultimo tratto.',
    requiresText: false,
  },
  watched: {
    group: 'presagio',
    label: 'Una presenza ti osserva',
    kicker: 'Qualcosa ti osserva',
    glyph: '👁️',
    placeholder: 'Cosa percepisce nel buio… (facoltativo)',
    fallback: 'Nel buio, qualcosa ti sta guardando. E non distoglie lo sguardo.',
    requiresText: false,
  },
  torches: {
    group: 'presagio',
    label: 'Le torce si piegano',
    kicker: 'Le fiamme si piegano',
    glyph: '🕯️',
    placeholder: 'Cosa nota… (facoltativo)',
    fallback: 'Le torce si piegano tutte verso qualcosa che non vedi. Non c’è vento.',
    requiresText: false,
  },
  water: {
    group: 'presagio',
    label: 'L’acqua non riflette',
    kicker: 'Il riflesso è sbagliato',
    glyph: '💧',
    placeholder: 'Cosa vede nell’acqua… (facoltativo)',
    fallback: 'L’acqua si ferma e smette di rifletterti. Nel suo specchio, un cielo che non è questo.',
    requiresText: false,
  },
  wild: {
    group: 'presagio',
    label: 'La magia selvaggia si sveglia',
    kicker: 'Il caos si desta',
    glyph: '✨',
    placeholder: 'Cosa sente montare… (facoltativo)',
    fallback: 'Qualcosa dentro di te si desta. Gli occhi ti si accendono di riflessi iridescenti.',
    requiresText: false,
  },
  dream: {
    group: 'presagio',
    label: 'Un sogno',
    kicker: 'Nel sonno',
    glyph: '🌙',
    placeholder: 'Il sogno che fa… (facoltativo)',
    fallback: 'Sogni. Non sai se è un ricordo, un presagio, o solo il tuo cuore.',
    requiresText: false,
  },
  handout: {
    group: 'messaggio',
    label: 'Biglietto (calligrafia)',
    kicker: 'Tra le tue cose',
    glyph: '📜',
    placeholder: 'Il testo del biglietto, nella sua calligrafia…',
    fallback: '',
    requiresText: true,
  },
  sealed: {
    group: 'messaggio',
    label: 'Busta sigillata',
    kicker: 'Una busta chiusa',
    glyph: '✉️',
    placeholder: 'Cosa c’è scritto sopra (es. “Aprila quando te lo dirò”)… (facoltativo)',
    fallback: 'Una busta sigillata con ceralacca. Non aprirla finché non te lo dico.',
    requiresText: false,
  },
};

export const OMEN_TYPES: readonly OmenType[] = Object.keys(OMEN_PRESETS) as OmenType[];
