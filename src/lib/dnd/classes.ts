import type { ClassData } from './types';

// D&D 5e SRD 5.1 (2014) classes. Hit dice, saving throws, proficiencies and
// level-1 features follow the open SRD; prose is written fresh in Italian.
// `statPriority` (best→worst) drives the suggested base ability layout.

const ALL_SKILLS = [
  'Acrobatics',
  'Animal Handling',
  'Arcana',
  'Athletics',
  'Deception',
  'History',
  'Insight',
  'Intimidation',
  'Investigation',
  'Medicine',
  'Nature',
  'Perception',
  'Performance',
  'Persuasion',
  'Religion',
  'Sleight of Hand',
  'Stealth',
  'Survival',
];

export const CLASSES: ClassData[] = [
  {
    key: 'barbarian',
    name: 'Barbaro',
    icon: 'barbarian',
    hitDie: 12,
    primaryAbility: ['STR'],
    savingThrows: ['STR', 'CON'],
    armor: 'Armature leggere e medie, scudi',
    weapons: 'Armi semplici e da guerra',
    skillChoice: {
      choose: 2,
      from: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
    },
    statPriority: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
    description:
      'Un guerriero furioso che attinge a una rabbia primordiale. Regge colpi che stenderebbero chiunque e li restituisce con gli interessi.',
    features: [
      { name: 'Ira', description: 'In combattimento entri in ira: bonus al danno in mischia e resistenza a taglienti, contundenti e perforanti.' },
      { name: 'Difesa senza Armatura', description: 'Senza armatura, la tua CA è 10 + mod. DES + mod. COS.' },
    ],
  },
  {
    key: 'bard',
    name: 'Bardo',
    icon: 'bard',
    hitDie: 8,
    primaryAbility: ['CHA'],
    savingThrows: ['DEX', 'CHA'],
    armor: 'Armature leggere',
    weapons: 'Armi semplici, balestra a mano, spada lunga, stocco, spada corta',
    skillChoice: { choose: 3, from: ALL_SKILLS },
    statPriority: ['CHA', 'DEX', 'CON', 'WIS', 'INT', 'STR'],
    spellcastingAbility: 'CHA',
    description:
      'Un artista dai mille talenti che intreccia magia e parole. Ispira gli alleati e conosce un po’ di tutto.',
    features: [
      { name: 'Incantesimi', description: 'Lanci incantesimi arcani usando il Carisma.' },
      { name: 'Ispirazione Bardica (d6)', description: 'Con un’azione bonus concedi un d6 da aggiungere a una prova, attacco o TS di un alleato.' },
    ],
  },
  {
    key: 'cleric',
    name: 'Chierico',
    icon: 'cleric',
    hitDie: 8,
    primaryAbility: ['WIS'],
    savingThrows: ['WIS', 'CHA'],
    armor: 'Armature leggere e medie, scudi',
    weapons: 'Armi semplici',
    skillChoice: {
      choose: 2,
      from: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    },
    statPriority: ['WIS', 'CON', 'STR', 'CHA', 'DEX', 'INT'],
    spellcastingAbility: 'WIS',
    description:
      'Un campione votato a una divinità, capace di guarire e incenerire in egual misura. La fede è la sua arma più potente.',
    features: [
      { name: 'Incantesimi', description: 'Lanci incantesimi divini usando la Saggezza.' },
      { name: 'Dominio Divino', description: 'Scegli un dominio (es. Vita) che plasma i tuoi poteri.' },
    ],
  },
  {
    key: 'druid',
    name: 'Druido',
    icon: 'druid',
    hitDie: 8,
    primaryAbility: ['WIS'],
    savingThrows: ['INT', 'WIS'],
    armor: 'Armature leggere e medie, scudi (non di metallo)',
    weapons: 'Bastoni, scimitarre, falcetti, fionde, lance, pugnali, dardi, giavellotti, mazze, clave',
    skillChoice: {
      choose: 2,
      from: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    },
    statPriority: ['WIS', 'CON', 'DEX', 'INT', 'CHA', 'STR'],
    spellcastingAbility: 'WIS',
    description:
      'Un custode della natura che parla il linguaggio segreto del creato e, presto, saprà assumere forma animale.',
    features: [
      { name: 'Druidico', description: 'Conosci il linguaggio segreto dei druidi.' },
      { name: 'Incantesimi', description: 'Lanci incantesimi legati alla natura usando la Saggezza.' },
    ],
  },
  {
    key: 'fighter',
    name: 'Guerriero',
    icon: 'fighter',
    hitDie: 10,
    primaryAbility: ['STR', 'DEX'],
    savingThrows: ['STR', 'CON'],
    armor: 'Tutte le armature, scudi',
    weapons: 'Armi semplici e da guerra',
    skillChoice: {
      choose: 2,
      from: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    },
    statPriority: ['STR', 'CON', 'DEX', 'WIS', 'CHA', 'INT'],
    description:
      'Il maestro delle armi per eccellenza. Versatile e resistente, eccelle in qualunque stile di combattimento scelga.',
    features: [
      { name: 'Stile di Combattimento', description: 'Adotti uno stile specializzato (es. duello, tiro, difesa).' },
      { name: 'Recuperare Energie', description: 'Come azione bonus recuperi 1d10 + livello punti ferita (1/riposo breve).' },
    ],
  },
  {
    key: 'monk',
    name: 'Monaco',
    icon: 'monk',
    hitDie: 8,
    primaryAbility: ['DEX', 'WIS'],
    savingThrows: ['STR', 'DEX'],
    armor: 'Nessuna',
    weapons: 'Armi semplici, spade corte',
    skillChoice: {
      choose: 2,
      from: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    },
    statPriority: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
    description:
      'Un artista marziale che affina corpo e mente. Colpisce a mani nude con velocità sovrumana.',
    features: [
      { name: 'Difesa senza Armatura', description: 'Senza armatura né scudo la tua CA è 10 + mod. DES + mod. SAG.' },
      { name: 'Arti Marziali', description: 'Puoi usare la Destrezza per i colpi senz’armi e i colpi da monaco, con un attacco senz’armi bonus.' },
    ],
  },
  {
    key: 'paladin',
    name: 'Paladino',
    icon: 'paladin',
    hitDie: 10,
    primaryAbility: ['STR', 'CHA'],
    savingThrows: ['WIS', 'CHA'],
    armor: 'Tutte le armature, scudi',
    weapons: 'Armi semplici e da guerra',
    skillChoice: {
      choose: 2,
      from: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    },
    statPriority: ['STR', 'CHA', 'CON', 'WIS', 'DEX', 'INT'],
    description:
      'Un guerriero sacro legato a un giuramento. Unisce l’acciaio alla magia divina per proteggere e punire.',
    features: [
      { name: 'Percezione del Divino', description: 'Come azione, percepisci celestiali, immondi e non morti nelle vicinanze.' },
      { name: 'Imposizione delle Mani', description: 'Hai una riserva di guarigione pari a 5 × livello punti ferita.' },
    ],
  },
  {
    key: 'ranger',
    name: 'Ranger',
    icon: 'ranger',
    hitDie: 10,
    primaryAbility: ['DEX', 'WIS'],
    savingThrows: ['STR', 'DEX'],
    armor: 'Armature leggere e medie, scudi',
    weapons: 'Armi semplici e da guerra',
    skillChoice: {
      choose: 3,
      from: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
    },
    statPriority: ['DEX', 'WIS', 'CON', 'STR', 'INT', 'CHA'],
    description:
      'Un cacciatore dei territori selvaggi, letale con arco e lama. Conosce i suoi nemici e non si perde mai.',
    features: [
      { name: 'Nemico Prescelto', description: 'Scegli un tipo di nemico: hai vantaggio per seguirne le tracce e ricordarne le informazioni.' },
      { name: 'Esploratore Nato', description: 'Sei esperto di un tipo di terreno prescelto: viaggio e sopravvivenza diventano molto più facili.' },
    ],
  },
  {
    key: 'rogue',
    name: 'Ladro',
    icon: 'rogue',
    hitDie: 8,
    primaryAbility: ['DEX'],
    savingThrows: ['DEX', 'INT'],
    armor: 'Armature leggere',
    weapons: 'Armi semplici, balestra a mano, spada lunga, stocco, spada corta',
    skillChoice: {
      choose: 4,
      from: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
    },
    statPriority: ['DEX', 'CON', 'INT', 'WIS', 'CHA', 'STR'],
    description:
      'Un opportunista scaltro che colpisce nei punti deboli. Furtivo, agile e insostituibile davanti a serrature e trappole.',
    features: [
      { name: 'Attacco Furtivo', description: 'Infliggi 1d6 danni extra quando hai vantaggio o un alleato affianca il bersaglio.' },
      { name: 'Competenza (Expertise)', description: 'Raddoppi il bonus di competenza in due delle tue abilità.' },
      { name: 'Gergo dei Ladri', description: 'Conosci il codice segreto della malavita.' },
    ],
  },
  {
    key: 'sorcerer',
    name: 'Stregone',
    icon: 'sorcerer',
    hitDie: 6,
    primaryAbility: ['CHA'],
    savingThrows: ['CON', 'CHA'],
    armor: 'Nessuna',
    weapons: 'Pugnali, dardi, fionde, bastoni, balestre leggere',
    skillChoice: {
      choose: 2,
      from: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    },
    statPriority: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
    spellcastingAbility: 'CHA',
    description:
      'La magia scorre nel suo sangue, non nei libri. Un potere innato e istintivo, pericoloso quanto affascinante.',
    features: [
      { name: 'Incantesimi', description: 'Lanci incantesimi arcani innati usando il Carisma.' },
      { name: 'Origine Stregonesca', description: 'La fonte del tuo potere (es. lignaggio draconico) ti concede tratti unici.' },
    ],
  },
  {
    key: 'warlock',
    name: 'Warlock',
    icon: 'warlock',
    hitDie: 8,
    primaryAbility: ['CHA'],
    savingThrows: ['WIS', 'CHA'],
    armor: 'Armature leggere',
    weapons: 'Armi semplici',
    skillChoice: {
      choose: 2,
      from: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
    },
    statPriority: ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'],
    spellcastingAbility: 'CHA',
    description:
      'Ha stretto un patto con un’entità ultraterrena in cambio di potere. La sua magia è oscura, mirata e implacabile.',
    features: [
      { name: 'Patrono Ultraterreno', description: 'Un’entità potente (es. Immondo) è la fonte della tua magia.' },
      { name: 'Magia del Patto', description: 'I tuoi slot incantesimo si ricaricano a ogni riposo breve.' },
    ],
  },
  {
    key: 'wizard',
    name: 'Mago',
    icon: 'wizard',
    hitDie: 6,
    primaryAbility: ['INT'],
    savingThrows: ['INT', 'WIS'],
    armor: 'Nessuna',
    weapons: 'Pugnali, dardi, fionde, bastoni, balestre leggere',
    skillChoice: {
      choose: 2,
      from: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    },
    statPriority: ['INT', 'CON', 'DEX', 'WIS', 'CHA', 'STR'],
    spellcastingAbility: 'INT',
    description:
      'Uno studioso della magia arcana che piega la realtà attraverso lo studio. Fragile di corpo, temibile per ingegno.',
    features: [
      { name: 'Incantesimi', description: 'Lanci incantesimi dal tuo libro degli incantesimi usando l’Intelligenza.' },
      { name: 'Recupero Arcano', description: 'A un riposo breve recuperi alcuni slot incantesimo spesi.' },
    ],
  },
];

export function getClass(key: string): ClassData | undefined {
  return CLASSES.find((c) => c.key === key);
}

/** Reverse lookup by the localized class name stored on a sheet. */
export function classByName(name: string): ClassData | undefined {
  return CLASSES.find((c) => c.name === name);
}
