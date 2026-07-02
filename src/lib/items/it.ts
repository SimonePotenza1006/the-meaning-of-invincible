// Italian names + short summaries for the SRD consumable catalogue (potions,
// scrolls, ammunition and single-use wondrous items), keyed by index. Mirrors the
// spells localisation: only names + a freshly-written Italian summary are provided;
// the English statblock stays in consumables.json as a fallback.

export interface ItemIt {
  name: string;
  summary: string;
}

export const ITEM_IT: Record<string, ItemIt> = {
  // ── Pozioni e oli ────────────────────────────────────────────────────────
  'oil-of-etherealness': {
    name: "Olio dell'Eterealità",
    summary:
      "Spalmato su una creatura Media o più piccola e sul suo equipaggiamento, le concede l'effetto dell'incantesimo etereità per 1 ora.",
  },
  'oil-of-sharpness': {
    name: "Olio dell'Affilatura",
    summary:
      'Riveste un\'arma o fino a 5 munizioni taglienti o perforanti: per 1 ora l\'arma è magica e ottiene +3 ai tiri per colpire e ai danni.',
  },
  'oil-of-slipperiness': {
    name: 'Olio della Scivolosità',
    summary:
      "Ricopre una creatura donandole per 8 ore l'effetto di libertà di movimento, oppure può essere versato a terra per creare una zona come l'incantesimo unto.",
  },
  'philter-of-love': {
    name: "Filtro d'Amore",
    summary:
      'La prossima creatura che vedi entro 10 minuti dal berlo ti rende ammaliato nei suoi confronti per 1 ora.',
  },
  'potion-of-animal-friendship': {
    name: "Pozione dell'Amicizia Animale",
    summary: 'Per 1 ora puoi lanciare a volontà amicizia con gli animali (CD 13).',
  },
  'potion-of-clairvoyance': {
    name: 'Pozione della Chiaroveggenza',
    summary: "Bevendola ottieni l'effetto dell'incantesimo chiaroveggenza.",
  },
  'potion-of-climbing': {
    name: "Pozione dell'Arrampicata",
    summary:
      'Per 1 ora ottieni una velocità di scalata pari alla tua velocità e vantaggio alle prove di Forza (Atletica) per arrampicarti.',
  },
  'potion-of-diminution': {
    name: 'Pozione della Riduzione',
    summary:
      'Ottieni l\'effetto "riduci" di ingrandire/ridurre per 1d4 ore, senza bisogno di concentrazione.',
  },
  'potion-of-flying': {
    name: 'Pozione del Volo',
    summary:
      'Per 1 ora ottieni una velocità di volo pari alla tua velocità e puoi librarti; se scade mentre sei in aria, cadi.',
  },
  'potion-of-gaseous-form': {
    name: 'Pozione della Forma Gassosa',
    summary: "Ottieni l'effetto di forma gassosa per 1 ora (senza concentrazione).",
  },
  'potion-of-giant-strength-hill': {
    name: 'Pozione della Forza del Gigante delle Colline',
    summary: 'Per 1 ora il tuo punteggio di Forza diventa 21 (se non è già superiore).',
  },
  'potion-of-giant-strength-frost': {
    name: 'Pozione della Forza del Gigante del Gelo',
    summary: 'Per 1 ora il tuo punteggio di Forza diventa 23 (se non è già superiore).',
  },
  'potion-of-giant-strength-stone': {
    name: 'Pozione della Forza del Gigante di Pietra',
    summary: 'Per 1 ora il tuo punteggio di Forza diventa 23 (se non è già superiore).',
  },
  'potion-of-giant-strength-fire': {
    name: 'Pozione della Forza del Gigante del Fuoco',
    summary: 'Per 1 ora il tuo punteggio di Forza diventa 25 (se non è già superiore).',
  },
  'potion-of-giant-strength-cloud': {
    name: 'Pozione della Forza del Gigante delle Nuvole',
    summary: 'Per 1 ora il tuo punteggio di Forza diventa 27 (se non è già superiore).',
  },
  'potion-of-giant-strength-storm': {
    name: 'Pozione della Forza del Gigante delle Tempeste',
    summary: 'Per 1 ora il tuo punteggio di Forza diventa 29 (se non è già superiore).',
  },
  'potion-of-growth': {
    name: 'Pozione della Crescita',
    summary:
      'Ottieni l\'effetto "ingrandisci" di ingrandire/ridurre per 1d4 ore, senza bisogno di concentrazione.',
  },
  'potion-of-healing-common': {
    name: 'Pozione di Guarigione',
    summary: 'Recuperi 2d4 + 2 punti ferita bevendola.',
  },
  'potion-of-healing-greater': {
    name: 'Pozione di Guarigione Superiore',
    summary: 'Recuperi 4d4 + 4 punti ferita bevendola.',
  },
  'potion-of-healing-superior': {
    name: 'Pozione di Guarigione Eccelsa',
    summary: 'Recuperi 8d4 + 8 punti ferita bevendola.',
  },
  'potion-of-healing-supreme': {
    name: 'Pozione di Guarigione Suprema',
    summary: 'Recuperi 10d4 + 20 punti ferita bevendola.',
  },
  'potion-of-heroism': {
    name: "Pozione dell'Eroismo",
    summary:
      'Per 1 ora ottieni 10 punti ferita temporanei e sei sotto l\'effetto di benedizione (senza concentrazione).',
  },
  'potion-of-invisibility': {
    name: "Pozione dell'Invisibilità",
    summary: "Per 1 ora diventi invisibile, assieme a tutto ciò che indossi e trasporti; l'effetto termina se attacchi o lanci un incantesimo.",
  },
  'potion-of-mind-reading': {
    name: 'Pozione della Lettura del Pensiero',
    summary: "Ottieni l'effetto di individuazione dei pensieri (CD 13).",
  },
  'potion-of-poison': {
    name: 'Pozione di Veleno',
    summary:
      'Sembra una pozione benefica ma è veleno mascherato: chi la beve subisce 3d6 danni da veleno e resta avvelenato (TS Costituzione CD 13 dimezza e annulla la condizione).',
  },
  'potion-of-resistance-acid': {
    name: 'Pozione di Resistenza (acido)',
    summary: 'Per 1 ora ottieni resistenza ai danni da acido.',
  },
  'potion-of-resistance-cold': {
    name: 'Pozione di Resistenza (freddo)',
    summary: 'Per 1 ora ottieni resistenza ai danni da freddo.',
  },
  'potion-of-resistance-fire': {
    name: 'Pozione di Resistenza (fuoco)',
    summary: 'Per 1 ora ottieni resistenza ai danni da fuoco.',
  },
  'potion-of-resistance-force': {
    name: 'Pozione di Resistenza (forza)',
    summary: 'Per 1 ora ottieni resistenza ai danni da forza.',
  },
  'potion-of-resistance-lightning': {
    name: 'Pozione di Resistenza (fulmine)',
    summary: 'Per 1 ora ottieni resistenza ai danni da fulmine.',
  },
  'potion-of-resistance-necrotic': {
    name: 'Pozione di Resistenza (necrotici)',
    summary: 'Per 1 ora ottieni resistenza ai danni necrotici.',
  },
  'potion-of-resistance-poison': {
    name: 'Pozione di Resistenza (veleno)',
    summary: 'Per 1 ora ottieni resistenza ai danni da veleno.',
  },
  'potion-of-resistance-psychic': {
    name: 'Pozione di Resistenza (psichici)',
    summary: 'Per 1 ora ottieni resistenza ai danni psichici.',
  },
  'potion-of-resistance-radiant': {
    name: 'Pozione di Resistenza (radiosi)',
    summary: 'Per 1 ora ottieni resistenza ai danni radiosi.',
  },
  'potion-of-resistance-thunder': {
    name: 'Pozione di Resistenza (tuono)',
    summary: 'Per 1 ora ottieni resistenza ai danni da tuono.',
  },
  'potion-of-speed': {
    name: 'Pozione della Velocità',
    summary: "Ottieni l'effetto dell'incantesimo velocità per 1 minuto (senza concentrazione).",
  },
  'potion-of-water-breathing': {
    name: 'Pozione del Respiro Acquatico',
    summary: 'Puoi respirare sott\'acqua per 1 ora dopo averla bevuta.',
  },

  // ── Pergamene ─────────────────────────────────────────────────────────────
  'spell-scroll-cantrip': {
    name: 'Pergamena di Incantesimo (trucchetto)',
    summary:
      "Contiene un trucchetto scritto in cifra mistica. Se è nella lista della tua classe puoi lanciarlo senza componenti; la pergamena si sgretola all'uso.",
  },
  'spell-scroll-1st': {
    name: 'Pergamena di Incantesimo (1° livello)',
    summary:
      "Contiene un incantesimo di 1° livello. Se è nella lista della tua classe lo lanci senza componenti materiali; la pergamena si sgretola all'uso.",
  },
  'spell-scroll-2nd': {
    name: 'Pergamena di Incantesimo (2° livello)',
    summary:
      "Contiene un incantesimo di 2° livello. Se è nella lista della tua classe lo lanci senza componenti materiali; la pergamena si sgretola all'uso.",
  },
  'spell-scroll-3rd': {
    name: 'Pergamena di Incantesimo (3° livello)',
    summary:
      "Contiene un incantesimo di 3° livello. Se è nella lista della tua classe lo lanci senza componenti materiali; la pergamena si sgretola all'uso.",
  },
  'spell-scroll-4th': {
    name: 'Pergamena di Incantesimo (4° livello)',
    summary:
      "Contiene un incantesimo di 4° livello. Se è nella lista della tua classe lo lanci senza componenti materiali; la pergamena si sgretola all'uso.",
  },
  'spell-scroll-5th': {
    name: 'Pergamena di Incantesimo (5° livello)',
    summary:
      "Contiene un incantesimo di 5° livello. Se è nella lista della tua classe lo lanci senza componenti materiali; la pergamena si sgretola all'uso.",
  },
  'spell-scroll-6th': {
    name: 'Pergamena di Incantesimo (6° livello)',
    summary:
      "Contiene un incantesimo di 6° livello. Lanciarlo se è di livello superiore a quelli che padroneggi richiede una prova di caratteristica da incantatore (CD 17).",
  },
  'spell-scroll-7th': {
    name: 'Pergamena di Incantesimo (7° livello)',
    summary:
      "Contiene un incantesimo di 7° livello. Lanciarlo se è di livello superiore a quelli che padroneggi richiede una prova di caratteristica da incantatore (CD 18).",
  },
  'spell-scroll-8th': {
    name: 'Pergamena di Incantesimo (8° livello)',
    summary:
      "Contiene un incantesimo di 8° livello. Lanciarlo se è di livello superiore a quelli che padroneggi richiede una prova di caratteristica da incantatore (CD 19).",
  },
  'spell-scroll-9th': {
    name: 'Pergamena di Incantesimo (9° livello)',
    summary:
      "Contiene un incantesimo di 9° livello. Lanciarlo se è di livello superiore a quelli che padroneggi richiede una prova di caratteristica da incantatore (CD 20); in caso di fallimento critico può accadere di peggio.",
  },

  // ── Munizioni ─────────────────────────────────────────────────────────────
  'ammunition-1': {
    name: 'Munizione +1',
    summary:
      'Munizione magica con +1 ai tiri per colpire e ai danni; una volta colpito il bersaglio, perde la sua magia.',
  },
  'ammunition-2': {
    name: 'Munizione +2',
    summary:
      'Munizione magica con +2 ai tiri per colpire e ai danni; una volta colpito il bersaglio, perde la sua magia.',
  },
  'ammunition-3': {
    name: 'Munizione +3',
    summary:
      'Munizione magica con +3 ai tiri per colpire e ai danni; una volta colpito il bersaglio, perde la sua magia.',
  },
  'arrow-of-slaying': {
    name: 'Freccia Assassina',
    summary:
      'Destinata a un tipo specifico di creatura: se colpisce quel tipo, infligge 6d10 danni extra da veleno (TS Costituzione CD 17 per dimezzarli). Dopo il colpo diventa una normale freccia.',
  },

  // ── Oggetti meravigliosi monouso ─────────────────────────────────────────
  'elemental-gem-air': {
    name: 'Gemma Elementale (aria)',
    summary:
      "Uno zaffiro azzurro: con un'azione lo rompi per evocare un elementale dell'aria (come evoca elementale). La gemma si consuma.",
  },
  'elemental-gem-earth': {
    name: 'Gemma Elementale (terra)',
    summary:
      "Un diamante giallo: con un'azione lo rompi per evocare un elementale della terra (come evoca elementale). La gemma si consuma.",
  },
  'elemental-gem-fire': {
    name: 'Gemma Elementale (fuoco)',
    summary:
      "Un corindone rosso: con un'azione lo rompi per evocare un elementale del fuoco (come evoca elementale). La gemma si consuma.",
  },
  'elemental-gem-water': {
    name: 'Gemma Elementale (acqua)',
    summary:
      "Uno smeraldo: con un'azione lo rompi per evocare un elementale dell'acqua (come evoca elementale). La gemma si consuma.",
  },
  'feather-token-anchor': {
    name: 'Gettone Piuma (àncora)',
    summary:
      "Tocchi il gettone a un'imbarcazione: per 24 ore la nave non può essere mossa in alcun modo. Monouso.",
  },
  'feather-token-bird': {
    name: 'Gettone Piuma (uccello)',
    summary:
      'Lanciato in aria evoca un enorme uccello cavalcabile che ti trasporta per 5 ore o finché non subisce danni. Monouso.',
  },
  'feather-token-fan': {
    name: 'Gettone Piuma (ventaglio)',
    summary:
      "Su un'imbarcazione, evoca un ventaglio fluttuante che genera vento per spingere la nave. Monouso.",
  },
  'feather-token-swan-boat': {
    name: 'Gettone Piuma (barca-cigno)',
    summary:
      'Toccato a uno specchio d\'acqua, evoca una barca a forma di cigno lunga circa 15 metri che si muove da sola per 24 ore. Monouso.',
  },
  'feather-token-tree': {
    name: 'Gettone Piuma (albero)',
    summary:
      "All'aperto, toccato al terreno fa crescere istantaneamente una grande quercia. Monouso.",
  },
  'feather-token-whip': {
    name: 'Gettone Piuma (frusta)',
    summary:
      'Evoca una frusta fluttuante che per 1 ora attacca a comando (+9 al colpire, 1d6+5 danni da forza) entro 3 metri. Monouso.',
  },
  'bag-of-beans': {
    name: 'Sacco di Fagioli',
    summary:
      'Contiene 3d4 fagioli secchi; piantandone uno si scatena un effetto magico casuale, spesso imprevedibile e pericoloso. Ogni fagiolo si consuma con l\'uso.',
  },
  'bead-of-force': {
    name: 'Sfera di Forza',
    summary:
      'La lanci fino a 18 metri: esplode in una sfera da 5d4 danni da forza (TS Destrezza CD 15) e può intrappolare le creature vicine in una sfera di forza per 1 minuto. Monouso.',
  },
  'dust-of-disappearance': {
    name: 'Polvere della Sparizione',
    summary:
      "Lanciata in aria, rende invisibili te e le creature entro 3 metri per 2d4 minuti; l'invisibilità termina se una creatura attacca o lancia un incantesimo. Monouso.",
  },
  'dust-of-dryness': {
    name: 'Polvere del Disseccamento',
    summary:
      'Contiene 1d6+4 pizzichi. Un pizzico assorbe un cubo d\'acqua di 4,5 metri di lato in un pellet, e può danneggiare creature fatte d\'acqua.',
  },
  'dust-of-sneezing-and-choking': {
    name: 'Polvere dello Starnuto e del Soffocamento',
    summary:
      'Sembra polvere della sparizione, ma quando la lanci ogni creatura entro 9 metri deve superare un TS Costituzione CD 15 o resta incapacitata mentre soffoca. Monouso.',
  },
  'restorative-ointment': {
    name: 'Unguento Ristoratore',
    summary:
      'Un barattolo con 1d4+1 dosi: una dose applicata cura 2d8+2 punti ferita, oppure neutralizza un veleno o una malattia.',
  },
  'universal-solvent': {
    name: 'Solvente Universale',
    summary:
      'Versato su una superficie, scioglie istantaneamente qualsiasi adesivo con cui viene a contatto, colla sovrana compresa. Monouso.',
  },
};

const RARITY_IT: Record<string, string> = {
  Common: 'Comune',
  Uncommon: 'Non comune',
  Rare: 'Raro',
  'Very Rare': 'Molto raro',
  Legendary: 'Leggendario',
  Artifact: 'Artefatto',
  Varies: 'Varia',
};

const CATEGORY_IT: Record<string, string> = {
  Potion: 'Pozione',
  Scroll: 'Pergamena',
  Ammunition: 'Munizione',
  'Wondrous Items': 'Oggetto meraviglioso',
};

export function itItemName(index: string, fallback: string): string {
  return ITEM_IT[index]?.name ?? fallback;
}

export function localizeRarity(rarity?: string): string {
  if (!rarity) return '';
  return RARITY_IT[rarity] ?? rarity;
}

export function localizeItemCategory(category: string): string {
  return CATEGORY_IT[category] ?? category;
}
