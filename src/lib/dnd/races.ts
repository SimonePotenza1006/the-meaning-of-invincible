import type { RaceData } from './types';

// D&D 5e SRD 5.1 (2014) races. Ability score increases and traits follow the
// open SRD; descriptions and trait text are written fresh in Italian.

export const RACES: RaceData[] = [
  {
    key: 'dwarf',
    name: 'Nano',
    icon: 'dwarf',
    abilityBonuses: { CON: 2 },
    size: 'Media',
    speed: 25,
    languages: ['Comune', 'Nanico'],
    description:
      'Robusti e tenaci, i nani vivono per secoli scavando roccaforti nelle montagne. Fieri della tradizione, resistono a veleni e fatica come pochi.',
    traits: [
      { name: 'Scurovisione', description: 'Vedi al buio fino a 18 metri (in penombra).' },
      {
        name: 'Resistenza Nanica',
        description: 'Vantaggio ai tiri salvezza contro il veleno e resistenza al danno da veleno.',
      },
      {
        name: 'Addestramento al Combattimento Nanico',
        description: 'Competenza con ascia da battaglia, piccozza, martello da guerra e martello leggero.',
      },
      { name: 'Conoscenza della Pietra', description: 'Sei esperto nell’intuire l’origine di lavori in pietra.' },
    ],
    subraces: [
      {
        key: 'hill',
        name: 'Nano delle Colline',
        abilityBonuses: { WIS: 1 },
        description: 'Sensi acuti e straordinaria resistenza fisica.',
        traits: [
          { name: 'Robustezza Nanica', description: 'I tuoi punti ferita massimi aumentano di 1 per ogni livello.' },
        ],
      },
      {
        key: 'mountain',
        name: 'Nano delle Montagne',
        abilityBonuses: { STR: 2 },
        description: 'Forti e temprati dalla vita d’alta quota.',
        traits: [
          { name: 'Addestramento alle Armature', description: 'Competenza con armature leggere e medie.' },
        ],
      },
    ],
  },
  {
    key: 'elf',
    name: 'Elfo',
    icon: 'elf',
    abilityBonuses: { DEX: 2 },
    size: 'Media',
    speed: 30,
    languages: ['Comune', 'Elfico'],
    description:
      'Aggraziati e longevi, gli elfi uniscono grazia sovrannaturale e affinità con la magia. Non dormono davvero: meditano in trance.',
    traits: [
      { name: 'Scurovisione', description: 'Vedi al buio fino a 18 metri.' },
      { name: 'Percezione Acuita', description: 'Competenza nell’abilità Percezione.' },
      {
        name: 'Lignaggio Fatato',
        description: 'Vantaggio contro l’essere affascinato; la magia non può farti addormentare.',
      },
      { name: 'Trance', description: 'Ti bastano 4 ore di meditazione al posto di 8 ore di sonno.' },
    ],
    subraces: [
      {
        key: 'high',
        name: 'Alto Elfo',
        abilityBonuses: { INT: 1 },
        description: 'Menti brillanti con un talento innato per la magia arcana.',
        traits: [
          { name: 'Trucchetto', description: 'Conosci un trucchetto a scelta dalla lista del mago (usa INT).' },
          { name: 'Addestramento Elfico alle Armi', description: 'Competenza con spada corta, spada lunga, arco corto e arco lungo.' },
        ],
      },
      {
        key: 'wood',
        name: 'Elfo dei Boschi',
        abilityBonuses: { WIS: 1 },
        speedOverride: 35,
        description: 'Cacciatori silenziosi, in armonia con la natura selvaggia.',
        traits: [
          { name: 'Piede Veloce', description: 'La tua velocità base è di 10,5 metri.' },
          { name: 'Maschera della Natura', description: 'Puoi nasconderti anche se solo lievemente oscurato dalla vegetazione.' },
        ],
      },
      {
        key: 'drow',
        name: 'Elfo Oscuro (Drow)',
        abilityBonuses: { CHA: 1 },
        description: 'Abitanti del Sottosuolo, dotati di magia innata ma vulnerabili alla luce.',
        traits: [
          { name: 'Scurovisione Superiore', description: 'La tua scurovisione arriva a 36 metri.' },
          { name: 'Magia Drow', description: 'Conosci il trucchetto luci danzanti (usa CAR).' },
          { name: 'Sensibilità alla Luce Solare', description: 'Svantaggio ad attacchi e Percezione visiva alla luce diretta del sole.' },
        ],
      },
    ],
  },
  {
    key: 'halfling',
    name: 'Halfling',
    icon: 'halfling',
    abilityBonuses: { DEX: 2 },
    size: 'Piccola',
    speed: 25,
    languages: ['Comune', 'Halfling'],
    description:
      'Piccoli, affabili e sorprendentemente coraggiosi. La fortuna sembra sempre dalla loro parte nei momenti decisivi.',
    traits: [
      { name: 'Fortunato', description: 'Quando ottieni 1 al d20 di un attacco, prova di caratteristica o TS, ritira il dado.' },
      { name: 'Coraggioso', description: 'Vantaggio ai tiri salvezza contro l’essere spaventato.' },
      { name: 'Agilità Halfling', description: 'Puoi muoverti attraverso lo spazio di creature più grandi di te.' },
    ],
    subraces: [
      {
        key: 'lightfoot',
        name: 'Piedeleggero',
        abilityBonuses: { CHA: 1 },
        description: 'Affabili e discreti, sanno svanire nella folla.',
        traits: [
          { name: 'Furtività Naturale', description: 'Puoi tentare di nasconderti dietro una creatura più grande di te.' },
        ],
      },
      {
        key: 'stout',
        name: 'Tozzo',
        abilityBonuses: { CON: 1 },
        description: 'Più robusti della media, con un pizzico di sangue nanico.',
        traits: [
          { name: 'Resistenza dei Tozzi', description: 'Vantaggio ai TS contro il veleno e resistenza al danno da veleno.' },
        ],
      },
    ],
  },
  {
    key: 'human',
    name: 'Umano',
    icon: 'human',
    abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    size: 'Media',
    speed: 30,
    languages: ['Comune', 'una lingua a scelta'],
    description:
      'Versatili e ambiziosi, gli umani si adattano a ogni ruolo. Ciò che manca loro in longevità lo compensano con intraprendenza.',
    traits: [
      {
        name: 'Versatilità',
        description: 'Ogni caratteristica aumenta di 1, riflettendo l’adattabilità della tua specie.',
      },
    ],
  },
  {
    key: 'dragonborn',
    name: 'Dragonide',
    icon: 'dragonborn',
    abilityBonuses: { STR: 2, CHA: 1 },
    size: 'Media',
    speed: 30,
    languages: ['Comune', 'Draconico'],
    description:
      'Discendenti dei draghi, camminano eretti con squame fiere. Possono esalare l’energia elementale del loro lignaggio.',
    traits: [
      {
        name: 'Ascendenza Draconica',
        description: 'Scegli un tipo di drago: determina il tipo di danno del tuo soffio e la tua resistenza.',
      },
      { name: 'Arma del Soffio', description: 'Puoi esalare energia distruttiva (TS per dimezzare, ricarica a riposo).' },
      { name: 'Resistenza al Danno', description: 'Hai resistenza al tipo di danno legato alla tua ascendenza.' },
    ],
  },
  {
    key: 'gnome',
    name: 'Gnomo',
    icon: 'gnome',
    abilityBonuses: { INT: 2 },
    size: 'Piccola',
    speed: 25,
    languages: ['Comune', 'Gnomesco'],
    description:
      'Curiosi e brillanti inventori, gli gnomi affrontano la vita con entusiasmo inarrestabile e una mente sempre al lavoro.',
    traits: [
      { name: 'Scurovisione', description: 'Vedi al buio fino a 18 metri.' },
      {
        name: 'Astuzia Gnomesca',
        description: 'Vantaggio a tutti i TS su INT, SAG e CAR contro la magia.',
      },
    ],
    subraces: [
      {
        key: 'rock',
        name: 'Gnomo delle Rocce',
        abilityBonuses: { CON: 1 },
        description: 'Gli inventori e artigiani per eccellenza tra gli gnomi.',
        traits: [
          { name: 'Sapienza Artificiale', description: 'Aggiungi il doppio del bonus di competenza alle prove su oggetti magici e alchemici.' },
          { name: 'Armeggiare', description: 'Puoi costruire piccoli congegni meccanici.' },
        ],
      },
    ],
  },
  {
    key: 'half-elf',
    name: 'Mezzelfo',
    icon: 'half-elf',
    abilityBonuses: { CHA: 2 },
    bonusChoice: { count: 2, amount: 1, exclude: ['CHA'] },
    size: 'Media',
    speed: 30,
    languages: ['Comune', 'Elfico', 'una lingua a scelta'],
    description:
      'Sospesi tra due mondi, i mezzelfi uniscono il carisma umano alla grazia elfica. Diplomatici nati, non appartengono del tutto a nessuno.',
    traits: [
      { name: 'Scurovisione', description: 'Vedi al buio fino a 18 metri.' },
      { name: 'Lignaggio Fatato', description: 'Vantaggio contro l’essere affascinato; non puoi essere fatto addormentare dalla magia.' },
      { name: 'Versatilità Abile', description: 'Ottieni competenza in due abilità a tua scelta.' },
    ],
  },
  {
    key: 'half-orc',
    name: 'Mezzorco',
    icon: 'half-orc',
    abilityBonuses: { STR: 2, CON: 1 },
    size: 'Media',
    speed: 30,
    languages: ['Comune', 'Orchesco'],
    description:
      'Forza brutale e cuore indomito. I mezzorchi non si arrendono facilmente: restano in piedi quando chiunque altro cadrebbe.',
    traits: [
      { name: 'Scurovisione', description: 'Vedi al buio fino a 18 metri.' },
      { name: 'Minaccioso', description: 'Competenza nell’abilità Intimidire.' },
      {
        name: 'Tenacia Implacabile',
        description: 'Quando scenderesti a 0 PF (non uccisi sul colpo), scendi invece a 1 PF (1 volta a riposo lungo).',
      },
      { name: 'Attacchi Selvaggi', description: 'A ogni critico in mischia, tiri un dado di danno dell’arma in più.' },
    ],
  },
  {
    key: 'tiefling',
    name: 'Tiefling',
    icon: 'tiefling',
    abilityBonuses: { CHA: 2, INT: 1 },
    size: 'Media',
    speed: 30,
    languages: ['Comune', 'Infernale'],
    description:
      'Segnati da un antico patto infernale, i tiefling portano corna e sguardi ardenti. Sospettati ovunque, imparano presto a cavarsela da soli.',
    traits: [
      { name: 'Scurovisione', description: 'Vedi al buio fino a 18 metri.' },
      { name: 'Resistenza Infernale', description: 'Hai resistenza al danno da fuoco.' },
      {
        name: 'Eredità Infernale',
        description: 'Conosci il trucchetto taumaturgia; a livelli più alti ottieni altre magie (usa CAR).',
      },
    ],
  },
];

export function getRace(key: string): RaceData | undefined {
  return RACES.find((r) => r.key === key);
}
