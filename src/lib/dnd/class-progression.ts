import type { Trait } from './types';

// Milestone class features gained at each level (2–20). Level-1 features live in
// classes.ts (used by the creation wizard). Subclass features come from
// subclasses.ts, and Ability Score Improvements are handled by the level-up flow,
// so neither is repeated here. Prose written fresh in Italian.

export const CLASS_FEATURES: Record<string, Record<number, Trait[]>> = {
  barbarian: {
    2: [
      { name: 'Attacco Irruento', description: 'Puoi attaccare con vantaggio a costo di concedere vantaggio agli attacchi contro di te fino al tuo turno.' },
      { name: 'Percezione del Pericolo', description: 'Hai vantaggio ai tiri salvezza su Destrezza contro effetti che puoi vedere (trappole, incantesimi).' },
    ],
    5: [
      { name: 'Attacco Extra', description: 'Puoi attaccare due volte, invece di una, quando compi l’azione di Attacco.' },
      { name: 'Movimento Veloce', description: 'La tua velocità aumenta di 3 metri se non indossi armature pesanti.' },
    ],
    7: [{ name: 'Istinto Ferino', description: 'Hai vantaggio ai tiri di iniziativa e puoi agire nel turno di sorpresa se entri subito in ira.' }],
    9: [{ name: 'Critico Brutale', description: 'Aggiungi un dado dell’arma extra ai danni dei tuoi colpi critici in mischia.' }],
    11: [{ name: 'Ira Implacabile', description: 'Se in ira scenderesti a 0 PF senza morire, puoi restare a 1 PF con un tiro salvezza su Costituzione.' }],
    15: [{ name: 'Ira Persistente', description: 'La tua ira termina prematuramente solo se cadi privo di sensi o se scegli di interromperla.' }],
    18: [{ name: 'Forza Indomabile', description: 'Se una prova di Forza è inferiore al tuo punteggio di Forza, usi quel punteggio come risultato.' }],
    20: [{ name: 'Campione Primordiale', description: 'Forza e Costituzione aumentano di 4 (fino a un massimo di 24).' }],
  },
  bard: {
    2: [
      { name: 'Factotum', description: 'Aggiungi metà del bonus di competenza alle prove di caratteristica in cui non sei competente.' },
      { name: 'Canzone di Riposo', description: 'Durante un riposo breve, tu e gli alleati che ti ascoltano recuperate PF extra.' },
    ],
    3: [{ name: 'Competenza (Expertise)', description: 'Raddoppi il bonus di competenza in due delle tue abilità.' }],
    5: [{ name: 'Fonte d’Ispirazione', description: 'Recuperi l’Ispirazione Bardica a ogni riposo breve, non solo lungo. Il dado sale a d8.' }],
    6: [{ name: 'Affascinare', description: 'Con la musica puoi disturbare gli effetti che affascinano o spaventano gli alleati vicini.' }],
    10: [
      { name: 'Segreti Magici', description: 'Impari due incantesimi da qualsiasi classe. Il dado d’Ispirazione sale a d10.' },
      { name: 'Competenza (Expertise)', description: 'Raddoppi il bonus di competenza in altre due abilità.' },
    ],
    14: [{ name: 'Segreti Magici Aggiuntivi', description: 'Impari altri due incantesimi da qualsiasi classe.' }],
    15: [{ name: 'Ispirazione Superiore (d12)', description: 'Il dado di Ispirazione Bardica sale a d12.' }],
    20: [{ name: 'Ispirazione Superiore', description: 'Se tiri l’iniziativa senza usi di Ispirazione Bardica, ne recuperi uno.' }],
  },
  cleric: {
    2: [{ name: 'Incanalare Divinità', description: 'Puoi incanalare energia divina per Scacciare i Non Morti o per un effetto del tuo dominio (1 uso per riposo).' }],
    5: [{ name: 'Distruggere Non Morti', description: 'I non morti di grado di sfida basso che scacci vengono distrutti all’istante.' }],
    6: [{ name: 'Incanalare Divinità (2 usi)', description: 'Ora recuperi due usi di Incanalare Divinità a ogni riposo.' }],
    10: [{ name: 'Intervento Divino', description: 'Puoi implorare l’aiuto diretto della tua divinità: c’è una possibilità che risponda.' }],
    18: [{ name: 'Incanalare Divinità (3 usi)', description: 'Ora recuperi tre usi di Incanalare Divinità a ogni riposo.' }],
    20: [{ name: 'Intervento Divino Migliorato', description: 'Il tuo Intervento Divino riesce automaticamente.' }],
  },
  druid: {
    2: [{ name: 'Forma Selvatica', description: 'Puoi trasformarti in una bestia che hai già visto, entro certi limiti di grado di sfida e movimento.' }],
    18: [
      { name: 'Corpo Senza Tempo', description: 'Invecchi molto più lentamente del normale.' },
      { name: 'Incantesimi Bestiali', description: 'Puoi lanciare incantesimi anche mentre sei in Forma Selvatica.' },
    ],
    20: [{ name: 'Arcidruido', description: 'Puoi usare la Forma Selvatica un numero illimitato di volte.' }],
  },
  fighter: {
    2: [{ name: 'Azione Impetuosa', description: 'Una volta per riposo puoi compiere un’azione aggiuntiva nel tuo turno.' }],
    5: [{ name: 'Attacco Extra', description: 'Puoi attaccare due volte quando compi l’azione di Attacco.' }],
    9: [{ name: 'Indomito', description: 'Puoi ripetere un tiro salvezza fallito (1 uso per riposo lungo).' }],
    11: [{ name: 'Attacco Extra (2)', description: 'Ora attacchi tre volte quando compi l’azione di Attacco.' }],
    13: [{ name: 'Indomito (2 usi)', description: 'Ora puoi usare Indomito due volte tra un riposo lungo e l’altro.' }],
    17: [
      { name: 'Azione Impetuosa (2 usi)', description: 'Ora recuperi due usi di Azione Impetuosa per riposo.' },
      { name: 'Indomito (3 usi)', description: 'Ora puoi usare Indomito tre volte tra un riposo lungo e l’altro.' },
    ],
    20: [{ name: 'Attacco Extra (3)', description: 'Ora attacchi quattro volte quando compi l’azione di Attacco.' }],
  },
  monk: {
    2: [
      { name: 'Ki', description: 'Ottieni punti ki per alimentare Raffica di Colpi, Scatto e Difesa Totale come azione bonus.' },
      { name: 'Movimento senza Armatura', description: 'La tua velocità aumenta se non indossi armature né scudi.' },
    ],
    3: [{ name: 'Deviare Proiettili', description: 'Con la reazione riduci i danni degli attacchi a distanza e puoi rilanciare il proiettile.' }],
    4: [{ name: 'Caduta Lenta', description: 'Con la reazione riduci i danni da caduta di una quantità pari a cinque volte il tuo livello.' }],
    5: [
      { name: 'Attacco Extra', description: 'Puoi attaccare due volte quando compi l’azione di Attacco.' },
      { name: 'Colpo Stordente', description: 'Spendi ki per tentare di stordire un bersaglio che colpisci in mischia.' },
    ],
    6: [{ name: 'Colpi Ki-potenziati', description: 'I tuoi colpi senz’armi contano come magici per superare le resistenze.' }],
    7: [
      { name: 'Elusione', description: 'Quando superi un TS su Destrezza per metà danno, non subisci alcun danno.' },
      { name: 'Mente Limpida', description: 'Puoi spendere ki per porre fine a effetti che ti affascinano o spaventano.' },
    ],
    10: [{ name: 'Purezza del Corpo', description: 'Sei immune a malattie e veleni.' }],
    13: [{ name: 'Lingua del Sole e della Luna', description: 'Comprendi tutte le lingue parlate e ti fai capire da chiunque.' }],
    14: [{ name: 'Anima di Diamante', description: 'Sei competente in tutti i tiri salvezza e puoi spendere ki per ripeterne uno fallito.' }],
    18: [{ name: 'Corpo Vuoto', description: 'Spendi ki per diventare invisibile e resistente a quasi ogni danno per breve tempo.' }],
    20: [{ name: 'Perfezione dell’Io', description: 'All’inizio di un combattimento senza ki, ne recuperi alcuni.' }],
  },
  paladin: {
    2: [
      { name: 'Stile di Combattimento', description: 'Adotti uno stile specializzato (es. difesa, grande arma, duello).' },
      { name: 'Incantesimi', description: 'Impari a lanciare incantesimi divini usando il Carisma.' },
      { name: 'Colpo Divino', description: 'Spendendo uno slot puoi infliggere danni radiosi extra con un attacco in mischia.' },
    ],
    3: [{ name: 'Salute Divina', description: 'La magia sacra che scorre in te ti rende immune alle malattie.' }],
    5: [{ name: 'Attacco Extra', description: 'Puoi attaccare due volte quando compi l’azione di Attacco.' }],
    6: [{ name: 'Aura di Protezione', description: 'Tu e gli alleati vicini aggiungete il tuo mod. Carisma ai tiri salvezza.' }],
    10: [{ name: 'Aura di Coraggio', description: 'Tu e gli alleati vicini non potete essere spaventati.' }],
    11: [{ name: 'Colpo Divino Migliorato', description: 'I tuoi attacchi in mischia infliggono danni radiosi extra anche senza spendere slot.' }],
    14: [{ name: 'Tocco Purificatore', description: 'Come azione, puoi porre fine a incantesimi che affliggono te o una creatura che tocchi.' }],
  },
  ranger: {
    2: [
      { name: 'Stile di Combattimento', description: 'Adotti uno stile specializzato (es. tiro, combattimento con due armi, difesa).' },
      { name: 'Incantesimi', description: 'Impari a lanciare incantesimi legati alla natura usando la Saggezza.' },
    ],
    3: [{ name: 'Consapevolezza Primeva', description: 'Spendi uno slot per percepire la presenza di alcuni tipi di creature nelle vicinanze.' }],
    5: [{ name: 'Attacco Extra', description: 'Puoi attaccare due volte quando compi l’azione di Attacco.' }],
    8: [{ name: 'Passo Silvano', description: 'Il terreno difficile naturale non ti rallenta più.' }],
    10: [{ name: 'Nascondersi in Piena Vista', description: 'Ti mimetizzi con l’ambiente naturale ottenendo un notevole bonus a nascondersi.' }],
    14: [{ name: 'Svanire', description: 'Puoi Nasconderti come azione bonus e non essere seguito con capacità non magiche.' }],
    18: [{ name: 'Sensi Ferini', description: 'Percepisci l’ambiente circostante anche senza vederlo, individuando i nemici invisibili.' }],
    20: [{ name: 'Uccisore di Nemici', description: 'Una volta a turno aggiungi il mod. Saggezza al tiro per colpire o ai danni contro un nemico.' }],
  },
  rogue: {
    2: [{ name: 'Azione Scaltra', description: 'Ogni turno puoi Scattare, Disimpegnarti o Nasconderti come azione bonus.' }],
    5: [{ name: 'Schivata Prodigiosa', description: 'Con la reazione dimezzi i danni di un attacco che ti colpisce.' }],
    7: [{ name: 'Elusione', description: 'Quando superi un TS su Destrezza per metà danno, non subisci alcun danno.' }],
    11: [{ name: 'Talento Affidabile', description: 'Nelle prove in cui sei competente, ogni tiro del d20 pari o inferiore a 9 conta come 10.' }],
    14: [{ name: 'Percezione Cieca', description: 'Individui le creature nascoste o invisibili entro breve distanza.' }],
    15: [{ name: 'Mente Sfuggente', description: 'Ottieni competenza nei tiri salvezza su Saggezza.' }],
    18: [{ name: 'Inafferrabile', description: 'Nessun attacco può avere vantaggio contro di te finché non sei incapacitato.' }],
    20: [{ name: 'Colpo di Fortuna', description: 'Puoi trasformare un mancato colpo in un colpo a segno, o un tiro fallito in un 20.' }],
  },
  sorcerer: {
    2: [{ name: 'Fonte di Magia', description: 'Ottieni punti stregoneria che puoi convertire in slot incantesimo e viceversa.' }],
    3: [{ name: 'Metamagia', description: 'Impari a piegare i tuoi incantesimi (es. gemellarli, accelerarli, potenziarli) spendendo punti stregoneria.' }],
    10: [{ name: 'Metamagia Aggiuntiva', description: 'Impari un’altra opzione di Metamagia.' }],
    17: [{ name: 'Metamagia Aggiuntiva', description: 'Impari un’altra opzione di Metamagia.' }],
    20: [{ name: 'Ripristino Stregonesco', description: 'Recuperi alcuni punti stregoneria a ogni riposo breve.' }],
  },
  warlock: {
    2: [{ name: 'Suggerimenti Occulti', description: 'Impari invocazioni occulte che ti concedono capacità magiche permanenti o a volontà.' }],
    3: [{ name: 'Dono del Patto', description: 'Il tuo patrono ti concede un dono: una lama patto, un tomo di trucchetti o un famiglio.' }],
    11: [{ name: 'Arcanum Mistico (6° livello)', description: 'Scegli un incantesimo di 6° livello che puoi lanciare una volta per riposo lungo senza slot.' }],
    13: [{ name: 'Arcanum Mistico (7° livello)', description: 'Ottieni un Arcanum Mistico di 7° livello.' }],
    15: [{ name: 'Arcanum Mistico (8° livello)', description: 'Ottieni un Arcanum Mistico di 8° livello.' }],
    17: [{ name: 'Arcanum Mistico (9° livello)', description: 'Ottieni un Arcanum Mistico di 9° livello.' }],
    20: [{ name: 'Maestro Occulto', description: 'Puoi recuperare tutti gli slot della Magia del Patto pregando il tuo patrono (1/giorno).' }],
  },
  wizard: {
    18: [{ name: 'Padronanza degli Incantesimi', description: 'Scegli un incantesimo di 1° e uno di 2° livello: puoi lanciarli a volontà senza slot.' }],
    20: [{ name: 'Incantesimi Firma', description: 'Scegli due incantesimi di 3° livello: puoi lanciarli una volta ciascuno per riposo breve senza slot.' }],
  },
};

/** Base-class features gained exactly at a given character level. */
export function classFeaturesAt(classKey: string, level: number): Trait[] {
  return CLASS_FEATURES[classKey]?.[level] ?? [];
}
