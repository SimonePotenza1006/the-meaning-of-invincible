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
    eyebrow: '',
    title: '',
    body: [
      'Buio.',
      'Le tenebre avvolgono i tuoi occhi.',
      'Non riesci a capire cosa ci sia intorno a te.',
      'Senti il tuo corpo fluttuare nel vuoto.'
    ],
  },
  {
    eyebrow: '',
    title: '',
    body: [
      '"Sei stata scelta, Eletta del tutto."',
      'Una voce grave risuona nelle tue tempie. Non riesci a capire da dove provenga. Continui a non vedere nulla.',
    ],
  },
  {
    eyebrow: '',
    title: '',
    body: [
      'La voce prosegue il suo discorso, quasi come una litania:',
      '"Il mondo versa nel caos. La guerra imperversa. I re lottano per un trono."',
      '"Un trono che, alla fine, sarà il simbolo di un regno in macerie."',
    ],
  },
  {
    eyebrow: '',
    title: '',
    body: [
      '"Solo tu potrai salvare il mondo dal disastro, o scegliere di dargli una ultima spinta verso il baratro cui già è rivolto."',
    ],
  },
  {
    eyebrow: '"Si comincia"',
    title: '"Adesso tocca a te"',
    body: [
      '"Riuscirai, come narrano le antiche leggende, a trovare finalmente il significato di essere invincibile?"',
    ],
  },
];
