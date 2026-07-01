import { Roboto, Dela_Gothic_One } from 'next/font/google';

// Body / UI face.
export const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

// Display face for headings and hero moments — used with restraint.
//
// NOTE: the brief asked for "Montenegrin Gothic One", which is not published on
// Google Fonts. Dela Gothic One is the closest available gothic display face.
// To use the real font instead, swap this for next/font/local pointing at the
// font file — everything else references the `--font-dela` variable.
export const displayFont = Dela_Gothic_One({
  subsets: ['latin'],
  variable: '--font-dela',
  weight: '400',
  display: 'swap',
});
