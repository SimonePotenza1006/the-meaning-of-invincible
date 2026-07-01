import { SKILLS } from '@/lib/rules';
import type { BackgroundData } from './types';

const ALL_SKILLS = Object.keys(SKILLS);

// SRD 5.1 officially details only the Acolyte background. "Personalizzato"
// uses the official custom-background option (pick two skill proficiencies),
// keeping the wizard flexible without copying closed content.
export const BACKGROUNDS: BackgroundData[] = [
  {
    key: 'acolyte',
    name: 'Accolito',
    icon: 'acolyte',
    skills: ['Insight', 'Religion'],
    languages: 2,
    tools: [],
    equipment: [
      'Simbolo sacro',
      'Libro di preghiere',
      '5 bastoncini d’incenso',
      'Abiti da cerimonia',
      'Abiti comuni',
      '15 mo',
    ],
    feature: {
      name: 'Rifugio dei Fedeli',
      description:
        'Tu e i tuoi compagni potete ricevere cure e ospitalità presso templi e comunità che condividono la tua fede.',
    },
    description:
      'Hai servito in un tempio, mediando tra i mortali e il divino. Riti, preghiere e gerarchie sacre non hanno segreti per te.',
  },
  {
    key: 'custom',
    name: 'Personalizzato',
    icon: 'custom',
    skills: [],
    skillChoice: { choose: 2, from: ALL_SKILLS },
    languages: 0,
    tools: [],
    equipment: ['Da concordare con il Dungeon Master'],
    feature: {
      name: 'Tratto su Misura',
      description:
        'Definisci con il DM il tuo passato e un tratto distintivo adatto alla storia del personaggio.',
    },
    description:
      'Un passato tutto tuo: scegli due competenze nelle abilità e concorda i dettagli con il Dungeon Master.',
  },
];

export function getBackground(key: string): BackgroundData | undefined {
  return BACKGROUNDS.find((b) => b.key === key);
}
