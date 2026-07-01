// Iconic subclasses per class. Concepts follow D&D 5e; every description and
// feature note is written fresh in Italian (no verbatim SRD/PHB text).
// `features` list the traits gained AT a given character level.

export interface SubclassFeature {
  level: number;
  name: string;
  description: string;
}

export interface SubclassData {
  key: string;
  name: string;
  description: string;
  features: SubclassFeature[];
}

/** The level at which each class picks its subclass, and how it's labelled. */
export const SUBCLASS_META: Record<string, { level: number; label: string }> = {
  cleric: { level: 1, label: 'Dominio Divino' },
  sorcerer: { level: 1, label: 'Origine Stregonesca' },
  warlock: { level: 1, label: 'Patrono Ultraterreno' },
  druid: { level: 2, label: 'Circolo Druidico' },
  wizard: { level: 2, label: 'Tradizione Arcana' },
  barbarian: { level: 3, label: 'Sentiero Primordiale' },
  bard: { level: 3, label: 'Collegio Bardico' },
  fighter: { level: 3, label: 'Archetipo Marziale' },
  monk: { level: 3, label: 'Tradizione Monastica' },
  paladin: { level: 3, label: 'Giuramento Sacro' },
  ranger: { level: 3, label: 'Archetipo del Ranger' },
  rogue: { level: 3, label: 'Archetipo del Ladro' },
};

export const SUBCLASSES: Record<string, SubclassData[]> = {
  barbarian: [
    {
      key: 'berserker',
      name: 'Sentiero del Berserker',
      description: 'Pura violenza incanalata: quando entri in ira, la furia ti travolge e trascini con te chiunque ti si pari davanti.',
      features: [
        { level: 3, name: 'Frenesia', description: 'Mentre sei in ira puoi entrare in frenesia: ottieni un attacco in mischia bonus a ogni turno, ma alla fine dell’ira soffri un livello di sfinimento.' },
        { level: 6, name: 'Ira Folle', description: 'Non puoi essere affascinato né spaventato mentre sei in ira; se lo eri, l’effetto è sospeso.' },
      ],
    },
    {
      key: 'totem',
      name: 'Sentiero del Guerriero Totemico',
      description: 'La tua ira è guidata da uno spirito-guida animale che ti presta i suoi doni: la tenacia dell’orso, la vista dell’aquila, l’istinto del lupo.',
      features: [
        { level: 3, name: 'Spirito Totem', description: 'Scegli uno spirito guida. Con l’Orso, in ira, hai resistenza a tutti i danni tranne quelli psichici.' },
        { level: 6, name: 'Aspetto della Bestia', description: 'Il tuo spirito ti dona un vantaggio permanente (es. forza dell’orso per portare carichi, vista dell’aquila a distanza).' },
      ],
    },
    {
      key: 'zealot',
      name: 'Sentiero dello Zelota',
      description: 'Combatti in nome di un dio della guerra: la tua furia è sacra e la morte stessa fatica a trattenerti.',
      features: [
        { level: 3, name: 'Furia Divina', description: 'Mentre sei in ira, il primo bersaglio che colpisci ogni turno subisce danni necrotici o radiosi extra.' },
        { level: 6, name: 'Guerriero Sacro', description: 'Se muori in ira, gli incantesimi che ti riportano in vita non richiedono componenti materiali.' },
      ],
    },
  ],
  bard: [
    {
      key: 'lore',
      name: 'Collegio della Sapienza',
      description: 'Sai un po’ di tutto e usi il sapere come un’arma: smonti le certezze dei nemici e rubi magie da ogni tradizione.',
      features: [
        { level: 3, name: 'Parole Taglienti', description: 'Usi l’Ispirazione Bardica per sottrarre il dado a un tiro per colpire, una prova o i danni di una creatura.' },
        { level: 6, name: 'Segreti Magici Aggiuntivi', description: 'Impari due incantesimi da qualsiasi classe: diventano incantesimi da bardo per te.' },
      ],
    },
    {
      key: 'valor',
      name: 'Collegio del Valore',
      description: 'Il bardo-guerriero che canta le gesta in prima linea, ispirando gli alleati con l’acciaio oltre che con la voce.',
      features: [
        { level: 3, name: 'Addestramento Marziale', description: 'Ottieni competenza in armature medie, scudi e armi da guerra.' },
        { level: 6, name: 'Attacco Extra', description: 'Puoi attaccare due volte, invece di una, ogni volta che compi l’azione di Attacco.' },
      ],
    },
    {
      key: 'swords',
      name: 'Collegio delle Spade',
      description: 'Un menestrello-spadaccino che trasforma il combattimento in spettacolo, intrecciando fioretti letali e acrobazie.',
      features: [
        { level: 3, name: 'Fioretti', description: 'Ottieni uno stile di combattimento e, spendendo l’Ispirazione Bardica, aggiungi effetti (spinta, difesa, colpo mobile) ai tuoi attacchi.' },
        { level: 6, name: 'Attacco Extra', description: 'Puoi attaccare due volte, invece di una, ogni volta che compi l’azione di Attacco.' },
      ],
    },
  ],
  cleric: [
    {
      key: 'life',
      name: 'Dominio della Vita',
      description: 'Canale della forza vitale positiva: le tue cure superano quelle di ogni altro e proteggi gli alleati come un baluardo.',
      features: [
        { level: 1, name: 'Discepolo della Vita', description: 'Le tue magie di cura ripristinano PF extra (2 + livello dell’incantesimo). Ottieni anche competenza nelle armature pesanti.' },
        { level: 8, name: 'Colpo Divino', description: 'Una volta a turno infliggi danni radiosi extra con un attacco in mischia.' },
      ],
    },
    {
      key: 'war',
      name: 'Dominio della Guerra',
      description: 'Sacerdote-soldato: la battaglia è la tua preghiera e la divinità guida la tua lama.',
      features: [
        { level: 1, name: 'Sacerdote Guerriero', description: 'Ottieni competenza in armature pesanti e armi da guerra; puoi compiere un attacco in mischia come azione bonus alcune volte tra i riposi.' },
        { level: 8, name: 'Colpo Divino', description: 'Una volta a turno infliggi danni extra con un attacco in mischia.' },
      ],
    },
    {
      key: 'light',
      name: 'Dominio della Luce',
      description: 'Portatore di fiamma sacra e verità: accechi i nemici e squarci le tenebre con lampi radiosi.',
      features: [
        { level: 1, name: 'Bagliore Accecante', description: 'Ottieni il trucchetto Luce Radiosa e, con una reazione, puoi dimezzare i danni di un attacco avvolgendo l’aggressore di luce.' },
        { level: 6, name: 'Corona di Luce', description: 'Emani luce accecante che rende vulnerabili al radioso i nemici che illumini.' },
      ],
    },
  ],
  druid: [
    {
      key: 'land',
      name: 'Circolo della Terra',
      description: 'Custode dei luoghi sacri della natura: attingi alla magia del territorio che ami e recuperi le forze meditando.',
      features: [
        { level: 2, name: 'Ristoro Naturale', description: 'Durante un riposo breve recuperi alcuni slot incantesimo. Ottieni un trucchetto bonus.' },
        { level: 6, name: 'Passo Naturale', description: 'Il terreno difficile naturale non ti rallenta e hai vantaggio contro incantesimi generati dalle piante.' },
      ],
    },
    {
      key: 'moon',
      name: 'Circolo della Luna',
      description: 'Il druido-mutaforma da combattimento: assumi le sembianze di bestie possenti e combatti tra gli artigli.',
      features: [
        { level: 2, name: 'Forma Selvatica da Combattimento', description: 'Assumi la Forma Selvatica con un’azione bonus e in bestie più potenti; da trasformato puoi spendere slot per curarti.' },
        { level: 6, name: 'Forme Primordiali', description: 'I tuoi attacchi in forma di bestia contano come magici per superare le resistenze.' },
      ],
    },
    {
      key: 'shepherd',
      name: 'Circolo del Pastore',
      description: 'Voce degli spiriti animali: evochi totem che vegliano su di te e potenzi le creature che chiami in battaglia.',
      features: [
        { level: 2, name: 'Totem Spirituale', description: 'Evochi uno spirito incorporeo (Falco, Orso o Unicorno) che offre cure, PF temporanei o vantaggio agli alleati nell’area.' },
        { level: 6, name: 'Fascia Potenziata', description: 'Le creature che evochi ottengono più PF e i loro attacchi contano come magici.' },
      ],
    },
  ],
  fighter: [
    {
      key: 'champion',
      name: 'Campione',
      description: 'La perfezione marziale nella sua forma più diretta: colpi critici più frequenti e un fisico da atleta.',
      features: [
        { level: 3, name: 'Critico Migliorato', description: 'I tuoi attacchi in mischia mettono a segno un critico con un tiro di 19 o 20.' },
        { level: 7, name: 'Atleta Eccezionale', description: 'Ottieni mezza competenza a diverse prove fisiche e la corsa in salto è più lunga.' },
      ],
    },
    {
      key: 'battlemaster',
      name: 'Maestro di Battaglia',
      description: 'Uno stratega dell’acciaio: manovre studiate che disarmano, atterrano e spingono i nemici dove vuoi tu.',
      features: [
        { level: 3, name: 'Manovre di Combattimento', description: 'Impari alcune manovre alimentate da Dadi di Superiorità (d8): attacchi mirati, finte, spinte e comandi in battaglia.' },
        { level: 7, name: 'Conoscere il Nemico', description: 'Studiando una creatura scopri se ti è superiore o inferiore in alcune capacità.' },
      ],
    },
    {
      key: 'eldritch',
      name: 'Cavaliere Mistico',
      description: 'Guerriero che intreccia l’acciaio con la magia arcana, legando le sue armi a incantesimi di protezione e attacco.',
      features: [
        { level: 3, name: 'Incantesimi', description: 'Impari a lanciare incantesimi arcani (soprattutto di Invocazione e Ammaliamento) usando l’Intelligenza. (Slot da terzo incantatore: da gestire a mano.)' },
        { level: 7, name: 'Magia Bellica', description: 'Quando lanci un trucchetto puoi anche compiere un attacco con arma come azione bonus.' },
      ],
    },
  ],
  monk: [
    {
      key: 'open-hand',
      name: 'Via della Mano Aperta',
      description: 'Maestria assoluta nel combattimento a mani nude: ogni colpo può sbilanciare, atterrare o togliere il fiato.',
      features: [
        { level: 3, name: 'Tecnica della Mano Aperta', description: 'Quando colpisci con la Raffica di Colpi puoi atterrare il bersaglio, spingerlo via o impedirgli le reazioni.' },
        { level: 6, name: 'Ristoro', description: 'Come azione, spendi ki per curarti di una quantità di PF pari a tre volte il tuo livello da monaco.' },
      ],
    },
    {
      key: 'shadow',
      name: 'Via dell’Ombra',
      description: 'Un monaco-ombra che si muove nel buio come un fantasma, colpendo dal nulla e svanendo di nuovo.',
      features: [
        { level: 3, name: 'Arti dell’Ombra', description: 'Spendi ki per lanciare Oscurità, Scurovisione, Passo Velato o Silenzio senza componenti.' },
        { level: 6, name: 'Passo dell’Ombra', description: 'Da un’area in penombra o buio ti teletrasporti in un’altra, ottenendo vantaggio al primo attacco in mischia successivo.' },
      ],
    },
    {
      key: 'elements',
      name: 'Via dei Quattro Elementi',
      description: 'Pieghi il ki alla forma degli elementi, scagliando fiamme, gelo e raffiche di vento come un incantatore marziale.',
      features: [
        { level: 3, name: 'Discepolo degli Elementi', description: 'Impari discipline elementali che, spendendo ki, producono effetti magici (es. pugno di fuoco, sferzata di vento).' },
        { level: 6, name: 'Nuova Disciplina', description: 'Amplii il tuo repertorio elementale e puoi potenziare gli effetti spendendo più ki.' },
      ],
    },
  ],
  paladin: [
    {
      key: 'devotion',
      name: 'Giuramento di Devozione',
      description: 'Il paladino classico: onestà, coraggio e compassione. L’ideale del cavaliere senza macchia.',
      features: [
        { level: 3, name: 'Incanalare Divinità: Arma Sacra', description: 'Infondi la tua arma di energia radiosa (bonus per colpire e luce), oppure scacci gli immondi e i non morti.' },
        { level: 7, name: 'Aura di Devozione', description: 'Tu e gli alleati vicini non potete essere affascinati.' },
      ],
    },
    {
      key: 'ancients',
      name: 'Giuramento degli Antichi',
      description: 'Un campione della luce e della vita, legato agli spiriti primordiali della natura contro le tenebre.',
      features: [
        { level: 3, name: 'Incanalare Divinità: Ira della Natura', description: 'Avvolgi un nemico di rampicanti spettrali che lo trattengono, oppure scacci i fedifraghi.' },
        { level: 7, name: 'Aura di Protezione degli Antichi', description: 'Tu e gli alleati vicini avete resistenza ai danni da incantesimi.' },
      ],
    },
    {
      key: 'vengeance',
      name: 'Giuramento di Vendetta',
      description: 'Un giustiziere implacabile che sacrifica la propria purezza pur di punire i colpevoli di grandi mali.',
      features: [
        { level: 3, name: 'Incanalare Divinità: Nemico Giurato', description: 'Marchi una creatura: ottieni vantaggio agli attacchi contro di essa, oppure scacci i senza fede.' },
        { level: 7, name: 'Cacciatore Implacabile', description: 'La tua velocità aumenta quando insegui il nemico giurato e nulla ti costringe a rallentare.' },
      ],
    },
  ],
  ranger: [
    {
      key: 'hunter',
      name: 'Cacciatore',
      description: 'Predatore specializzato: adatti le tue tecniche a ogni tipo di minaccia, dai singoli colossi alle orde.',
      features: [
        { level: 3, name: 'Preda del Cacciatore', description: 'Scegli una tecnica: danni extra contro nemici feriti, colpo contro chi si avvicina, o difesa contro più aggressori.' },
        { level: 7, name: 'Tattiche Difensive', description: 'Ottieni una difesa a scelta, come vantaggio contro gli attacchi di più nemici o immunità allo spavento in mischia.' },
      ],
    },
    {
      key: 'beast-master',
      name: 'Signore delle Bestie',
      description: 'Combatti al fianco di un compagno animale addestrato, coordinando i vostri attacchi come un’unica creatura.',
      features: [
        { level: 3, name: 'Compagno Animale Primevo', description: 'Un animale fedele combatte con te: agisce ai tuoi comandi e cresce in efficacia con i tuoi livelli.' },
        { level: 7, name: 'Compagno Eccezionale', description: 'Il tuo compagno può usare la reazione e migliora nelle sue capacità di combattimento.' },
      ],
    },
    {
      key: 'gloom-stalker',
      name: 'Cacciatore Oscuro',
      description: 'Un ranger delle tenebre e dei luoghi dimenticati: colpisci per primo e sparisci prima che il nemico reagisca.',
      features: [
        { level: 3, name: 'Occhi nell’Oscurità', description: 'Ottieni scurovisione superiore, bonus all’iniziativa e un attacco extra al primo turno di ogni combattimento.' },
        { level: 7, name: 'Passo Ombroso', description: 'Nell’oscurità puoi teletrasportarti brevemente e ottenere vantaggio all’attacco successivo.' },
      ],
    },
  ],
  rogue: [
    {
      key: 'thief',
      name: 'Ladro',
      description: 'Il maestro del furto e dell’acrobazia urbana: mani velocissime e agilità per arrampicarti ovunque.',
      features: [
        { level: 3, name: 'Mani Veloci', description: 'Con l’Azione Scaltra puoi usare le mani (Rapidità di Mano, disinnescare trappole, usare un oggetto) come azione bonus.' },
        { level: 13, name: 'Uso di Oggetti Magici', description: 'Ignori i requisiti di classe, razza e livello nell’usare oggetti magici.' },
      ],
    },
    {
      key: 'assassin',
      name: 'Assassino',
      description: 'Specialista dell’eliminazione silenziosa: colpisci per primo e i tuoi bersagli spesso non arrivano a reagire.',
      features: [
        { level: 3, name: 'Assassinare', description: 'Hai vantaggio contro chi non ha ancora agito; ogni colpo a sorpresa che va a segno è un critico. Competenza in kit da trucco e da veleni.' },
        { level: 9, name: 'Infiltrazione', description: 'Sai creare identità di copertura credibili e imitare voci e modi altrui.' },
      ],
    },
    {
      key: 'arcane-trickster',
      name: 'Furfante Arcano',
      description: 'Ladro che tinge il proprio mestiere di magia illusoria e ammaliante, con una Mano Magica sempre al lavoro.',
      features: [
        { level: 3, name: 'Incantesimi', description: 'Impari incantesimi arcani (soprattutto Illusione e Ammaliamento) usando l’Intelligenza e ottieni una Mano Magica potenziata e invisibile.' },
        { level: 9, name: 'Furto Magico', description: 'La tua Mano Magica può disarmare trappole, scassinare serrature e sfilare oggetti a distanza.' },
      ],
    },
  ],
  sorcerer: [
    {
      key: 'draconic',
      name: 'Lignaggio Draconico',
      description: 'Nelle tue vene scorre il sangue dei draghi: la loro resistenza e la loro maestà si manifestano man mano che cresci.',
      features: [
        { level: 1, name: 'Ascendenza Draconica', description: 'Scegli un tipo di drago: aumenti i tuoi PF massimi e, senza armatura, la tua CA diventa 13 + mod. DES.' },
        { level: 6, name: 'Affinità Elementale', description: 'Aggiungi il mod. CAR ai danni degli incantesimi del tuo tipo elementale e puoi ottenere resistenza a quell’elemento.' },
      ],
    },
    {
      key: 'wild',
      name: 'Magia Selvaggia',
      description: 'Il caos primordiale scorre in te: la tua magia è imprevedibile e può scatenare effetti tanto meravigliosi quanto disastrosi.',
      features: [
        { level: 1, name: 'Ondata di Magia Selvaggia', description: 'Quando lanci un incantesimo, il DM può farti tirare sulla tavola della Sorte Selvaggia per un effetto casuale.' },
        { level: 6, name: 'Flusso di Fortuna', description: 'Spendi punti stregoneria per concedere vantaggio o svantaggio a una creatura che vedi.' },
      ],
    },
    {
      key: 'storm',
      name: 'Anima della Tempesta',
      description: 'Il potere delle tempeste ti pervade: fulmine, vento e tuono rispondono alla tua magia.',
      features: [
        { level: 1, name: 'Furia della Tempesta', description: 'Ogni volta che lanci un incantesimo di livello 1 o superiore puoi volare brevemente come azione bonus.' },
        { level: 6, name: 'Cuore della Tempesta', description: 'Hai resistenza ai danni da fulmine e tuono e puoi respingere e folgorare i nemici vicini quando lanci incantesimi.' },
      ],
    },
  ],
  warlock: [
    {
      key: 'fiend',
      name: 'L’Immondo',
      description: 'Il tuo patrono è un signore degli inferi: dalle sue fiamme trai potere distruttivo e una tenacia soprannaturale.',
      features: [
        { level: 1, name: 'Benedizione dell’Oscuro Padrone', description: 'Quando riduci un nemico a 0 PF, ottieni PF temporanei pari al mod. CAR + il tuo livello da warlock.' },
        { level: 6, name: 'Ricompensa dell’Oscuro Padrone', description: 'Quando fallisci un tiro salvezza puoi ritirarlo, obbligandoti ad accettare il nuovo risultato.' },
      ],
    },
    {
      key: 'archfey',
      name: 'L’Arcifata',
      description: 'Un signore o una signora del Reame Fatato ti ha concesso poteri d’incanto, illusione e fuga fatata.',
      features: [
        { level: 1, name: 'Presenza Fatata', description: 'Come azione, affascini o spaventi le creature in un cubo davanti a te (TS di Saggezza per resistere).' },
        { level: 6, name: 'Ritirata Fatata', description: 'Quando vieni colpito ti teletrasporti brevemente lontano e diventi invisibile fino al tuo prossimo turno.' },
      ],
    },
    {
      key: 'great-old-one',
      name: 'Il Grande Antico',
      description: 'La tua mente ha sfiorato un’entità aliena e inconoscibile: ne hai tratto poteri telepatici e segreti proibiti.',
      features: [
        { level: 1, name: 'Mente Risvegliata', description: 'Comunichi telepaticamente con qualsiasi creatura entro breve distanza che condivida una lingua con te.' },
        { level: 6, name: 'Presagio Malvagio', description: 'Come reazione, quando una creatura vicina viene colpita puoi deviare l’attacco o l’incantesimo su un’altra creatura.' },
      ],
    },
  ],
  wizard: [
    {
      key: 'evocation',
      name: 'Scuola dell’Evocazione',
      description: 'Maestro dell’energia pura: fulmini, palle di fuoco e raggi di gelo che sai modellare per risparmiare gli alleati.',
      features: [
        { level: 2, name: 'Evocazione Scolpita', description: 'Quando lanci un incantesimo di evocazione ad area, alcuni alleati subiscono danni dimezzati o nulli.' },
        { level: 6, name: 'Trucchetto Potente', description: 'I bersagli dei tuoi trucchetti da evocatore subiscono comunque metà danno anche se superano il tiro salvezza.' },
      ],
    },
    {
      key: 'abjuration',
      name: 'Scuola dell’Abiurazione',
      description: 'Lo specialista della protezione: erigi barriere arcane che assorbono i colpi e annulli le magie nemiche.',
      features: [
        { level: 2, name: 'Barriera Arcana', description: 'Quando lanci un incantesimo di abiurazione crei uno scudo di punti che assorbe danni finché non si esaurisce.' },
        { level: 6, name: 'Abiurazione Proiettata', description: 'La tua Barriera Arcana può proteggere anche un alleato vicino invece di te.' },
      ],
    },
    {
      key: 'necromancy',
      name: 'Scuola della Negromanzia',
      description: 'Studioso del confine tra vita e morte: rubi la forza vitale ai nemici e comandi i non morti che crei.',
      features: [
        { level: 2, name: 'Mietitura Sinistra', description: 'Quando uccidi una creatura con un incantesimo da negromante recuperi PF pari al livello dell’incantesimo + il mod. INT.' },
        { level: 6, name: 'Non Morti Rinvigoriti', description: 'I non morti che animi ottengono più PF e infliggono più danni.' },
      ],
    },
  ],
};

export function getSubclasses(classKey: string): SubclassData[] {
  return SUBCLASSES[classKey] ?? [];
}

export function getSubclass(classKey: string, subclassKey: string): SubclassData | undefined {
  return getSubclasses(classKey).find((s) => s.key === subclassKey);
}

export function subclassMeta(classKey: string): { level: number; label: string } | undefined {
  return SUBCLASS_META[classKey];
}

/** Subclass features gained exactly at a given level. */
export function subclassFeaturesAt(
  classKey: string,
  subclassKey: string,
  level: number,
): SubclassFeature[] {
  return getSubclass(classKey, subclassKey)?.features.filter((f) => f.level === level) ?? [];
}

/** All subclass features gained up to and including a given level. */
export function subclassFeaturesUpTo(
  classKey: string,
  subclassKey: string,
  level: number,
): SubclassFeature[] {
  return getSubclass(classKey, subclassKey)?.features.filter((f) => f.level <= level) ?? [];
}
