import type { Metadata } from 'next';
import './globals.css';
import { roboto, displayFont } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Creazione Personaggio — D&D 5e',
  description:
    'Crea il tuo personaggio di Dungeons & Dragons 5e passo dopo passo e unisciti alla campagna.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${roboto.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
