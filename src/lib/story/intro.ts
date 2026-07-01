/**
 * Opening presentation shown to the player on their very first access, before
 * character creation. Pure content + a debug switch — safe to import anywhere.
 *
 * DEBUG: while `FORCE_INTRO` is true the presentation is shown on every visit
 * (ignoring the "already seen" flag on the device), so we can iterate on the
 * texts together. Flip it to `false` once the intro is final.
 */
export const FORCE_INTRO = true;

/** localStorage key holding the per-device "intro already seen" flag. */
export const INTRO_SEEN_KEY = 'tmoi:intro-seen';

export interface IntroSlide {
  /** Small eyebrow label above the title (optional). */
  eyebrow?: string;
  /** Optional heading — omit for a pure block of prose. */
  title?: string;
  /** One or more paragraphs of body prose. */
  body: string[];
}

/**
 * Draft prose — evocative but SRD-safe (no PHB/setting text), freshly written
 * in Italian. Placeholder to be refined together.
 */
export const INTRO_SLIDES: IntroSlide[] = [
  {
    eyebrow: 'Una campagna per due',
    title: 'The meaning of invincible',
    body: [
      'Alcuni nascono per essere ricordati. Altri per essere temuti. Tu non sai ancora quale delle due cose sarai — ma il mondo sta per scoprirlo insieme a te.',
      'Prima di alzare lo sguardo, respira. Questa storia comincia dal silenzio che precede la prima scelta.',
    ],
  },
  {
    eyebrow: 'Il mondo',
    title: 'Una terra che non perdona',
    body: [
      'Le strade sono vecchie e le leggende più vecchie ancora. C’è chi le racconta accanto al fuoco e chi preferisce dimenticarle, perché certe leggende hanno la brutta abitudine di tornare a bussare.',
      'Qui la forza non basta. Servono nervi saldi, alleati veri e la testardaggine di rialzarsi una volta di più di quante volte cadi.',
    ],
  },
  {
    eyebrow: 'La domanda',
    title: 'Cosa significa essere invincibile?',
    body: [
      'Non significa non essere mai feriti. Significa avere qualcosa per cui vale la pena tornare in piedi.',
      'Nelle sessioni che verranno, ogni tiro di dado sarà una risposta parziale a questa domanda. La risposta definitiva la scriverai tu.',
    ],
  },
  {
    eyebrow: 'Come si gioca',
    title: 'Tu e il Master',
    body: [
      'Il Master guida il mondo, gli incontri e le conseguenze. Tu guidi un’unica cosa, la più importante: il tuo personaggio.',
      'La tua scheda è viva. Punti ferita, incantesimi, condizioni: tutto si aggiorna in tempo reale, così il Master vede ciò che vedi tu — senza che nessuno debba gridare i numeri attraverso il tavolo.',
    ],
  },
  {
    eyebrow: 'Si comincia',
    title: 'Adesso tocca a te',
    body: [
      'Tra un momento darai un volto, un nome e un’anima al tuo eroe: razza, classe, storia. Non esiste una scelta sbagliata — esiste solo la tua.',
      'Quando avrai finito, il Master saprà che sei pronto. E la prima pagina di "The meaning of invincible" si aprirà davvero.',
    ],
  },
];
