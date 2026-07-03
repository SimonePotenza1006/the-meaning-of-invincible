# The Meaning of Invincible — Scontri ed Enigmi
### Sessioni 2 e 3 · D&D 5e (SRD 5.1) · compatibile con claude-dnd-skill

> **Calibrazione:** pg stregona della magia selvaggia **livello 2** + Aldric (sidekick guerriero liv. 2). Note di scaling per liv. 1 e 3 in ogni scontro. Progressione consigliata: **milestone** — la pg sale al livello 3 alla fine della Sessione 3 (dopo il santuario). Se usi i PX, i valori sono indicati per scontro.

---

## 0. Bilanciare il combattimento per una giocatrice sola

Il 5e presume 4 personaggi: contro un party da uno, l'economia delle azioni uccide. Regole della casa consigliate, tutte trasparenti alla giocatrice tranne l'ultima:

**Aldric ripara l'economia delle azioni.** Con lui in campo hai di fatto un party da due. Regola di regia: Aldric non infligge mai il colpo di grazia ai nemici "con nome" e non risolve mai gli enigmi — apre varchi, para colpi, assorbe danni. Il palcoscenico è della stregona.

**Pochi nemici, mai sciami veri.** Massimo 3-4 avversari in campo. Se vuoi la sensazione di orda, usa ondate: 2 nemici, poi altri 2 quando il primo cade.

**Niente save-or-suck contro la pg.** Nessuna paralisi, stordimento o charme che le tolga il turno per più di un round nei primi livelli. L'unico che paralizza è l'Ombra, e solo in scena scriptata (§8). Perdere il turno da soli significa guardare il DM giocare da solo.

**La rete di sicurezza.** A 0 PF la pg non muore quasi mai nei primi livelli: viene catturata, trascinata, salvata da Aldric, o — opzione tematica potentissima — **la magia selvaggia esplode e la sveglia altrove** (un blackout difensivo: il tema che la protegge prima che lei lo capisca). La morte vera torna sul tavolo dalla Fase 3, e va annunciato.

**Pozioni generose.** Ogni scontro delle prime sessioni lascia almeno una pozione di guarigione (2d4+2) sul campo o addosso ai nemici. I Marchiati ne portano sempre una: il rituale richiede corpi integri.

**Il round d'ambiente.** In ogni arena metti almeno due elementi interagibili (passerella marcia, catena, chiusa, vapore). Una caotica buona con la magia selvaggia deve poter vincere con la fantasia, non solo coi dadi: ogni uso creativo dell'ambiente riesce con CD 10-12 e fa qualcosa di grosso.

---

## 1. Aldric — sidekick (regole di Tasha semplificate)

**Aldric, cavaliere di Calù** — umanoide Medio (umano), legale buono
**CA** 17 (cotta di maglia, scudo) · **PF** 20 (3d8+6) · **Velocità** 9 m
FOR 16 (+3) · DES 12 (+1) · COS 15 (+2) · INT 10 (+0) · SAG 11 (+0) · CAR 13 (+1)
**Tiri salvezza** For +5, Cos +4 · **Abilità** Atletica +5, Percezione +2, Intimidire +3
**Spada lunga.** +5, 1d8+3 taglienti (versatile 1d10+3).
**Secondo Vento (1/riposo breve).** Azione bonus: recupera 1d10+2 PF.
**Protezione.** Reazione: quando una creatura che vede attacca la pg entro 1,5 m da lui, impone svantaggio al tiro.
*Regia:* in combattimento Aldric ingaggia il nemico più pericoloso e usa Protezione appena la pg è minacciata. La sua battuta ricorrente quando lei improvvisa: "Questo non era nel piano." / "Non c'era nessun piano." Fa affezionare in fretta — serve per la Fase 3.

**JSON per `combat.py init`:**
```json
{"name":"Aldric","dex_mod":1,"hp":20,"ac":17,"type":"pc"}
```

---

## 2. Bestiario delle fogne (stat block personalizzati)

### Ratto famelico dagli occhi rossi
*Bestia Piccola, senza allineamento* — **PX 25 (CR 1/8)**
**CA** 12 · **PF** 7 (2d6) · **Velocità** 9 m, nuoto 6 m
FOR 7 (−2) · DES 15 (+2) · COS 11 (+0) · INT 2 (−4) · SAG 10 (+0) · CAR 4 (−3)
**Sensi** scurovisione 18 m · **Morso.** +4, 1d4+2 perforanti.
**Assaggiato dall'Acqua.** Il ratto non prova paura: immune allo spaventato, non fugge mai. Quando muore, dagli occhi cola un filo di liquido nero.
*Nota di regia:* i ratti normali delle fogne scappano da questi. Se la pg lo nota (Percezione passiva 12+), è il primo indizio gratuito.

### Goblin delle fogne
*Umanoide Piccolo (goblinoide), neutrale malvagio* — **PX 50 (CR 1/4)**
**CA** 13 (armatura di cuoio rappezzata) · **PF** 7 (2d6) · **Velocità** 9 m
FOR 8 (−1) · DES 14 (+2) · COS 10 (+0) · INT 10 (+0) · SAG 8 (−1) · CAR 8 (−1)
**Abilità** Furtività +6 · **Sensi** scurovisione 18 m
**Scimitarra.** +4, 1d6+2 taglienti. · **Fionda.** +4, gittata 9/36 m, 1d4+2 contundenti.
**Fuga Agile.** Azione bonus: Disingaggio o Nascondersi.
*Regia:* i goblin sono manovalanza pagata, non fanatici. A metà PF o alla morte di un compagno **si arrendono o scappano** — e un goblin che si arrende è una miniera di esposizione ("Noi trasportiamo e basta! Le casse le porta il Sorvegliante alla chiusa vecchia!").

### Il Marchiato (occhi rossi)
*Umanoide Medio, allineamento cancellato* — **PX 100 (CR 1/2)**
**CA** 12 (giaco di cuoio) · **PF** 18 (4d8) · **Velocità** 9 m
FOR 15 (+2) · DES 11 (+0) · COS 14 (+2) · INT 9 (−1) · SAG 6 (−2) · CAR 5 (−3)
**Immunità alle condizioni** spaventato, affascinato
**Mazza pesante.** +4, 1d6+2 contundenti, due volte se il bersaglio è prono o afferrato.
**Presa del Raccoglitore.** +4: il bersaglio è afferrato (CD 12 per liberarsi). Il Marchiato preferisce afferrare e trascinare, non uccidere: *raccoglie*.
**Oltre il Dolore.** Quando scende a 0 PF, non cade: resta in piedi e agisce normalmente fino alla fine del suo turno successivo, poi crolla di colpo, come una marionetta tagliata. (Descrivilo sempre. È il tratto che la giocatrice ricorderà.)
**La Crepa del Nome.** Se una creatura usa un'azione per pronunciare ad alta voce il vero nome del Marchiato (scoperto con indagini, documenti, o Intuizione CD 15 su dettagli addosso a lui — un anello nuziale, un tatuaggio militare), il Marchiato deve superare un TS su Saggezza CD 13 o perdere la sua prossima azione, tremando. *Questo tratto è il seme meccanico della debolezza dell'Ombra: la giocatrice deve poterlo scoprire qui, in piccolo, per usarlo là, in grande.*
*Regia:* il Marchiato non parla, non urla quando viene ferito, non reagisce alle provocazioni. Combatterlo deve sembrare sbagliato. Se la pg tenta Intuizione su di lui: "Non leggi niente. Non perché nasconda qualcosa: perché non c'è più niente da leggere."

### Sorvegliante Marchiato (miniboss, Sessione 2)
Come il Marchiato, ma: **PF 30 (4d8+12)**, COS 16 (+3), **CA 14** (giaco + scudo), **PX 200 (CR 1)**.
**Multiattacco.** Due attacchi con la mazza.
**Fischio Vuoto (1/scontro).** Soffia in un fischietto d'osso: tutti i ratti dagli occhi rossi entro 18 m si muovono immediatamente della loro velocità verso il nemico più vicino (senza attaccare). Ottimo per riposizionare la scacchiera.
Porta al collo **una chiave di ferro annerita, gemella** di quella che la pg ha trovato in tasca dopo un blackout. Non spiegare. Lascia che sia lei a fare due più due.

---

## 3. Sessione 2 — "Cinque tacche": scontri

### Scontro 2.1 — Il branco che non fugge *(riscaldamento, facile)*
**Dove:** il primo tratto di cunicoli, acqua alle caviglie, luce di torcia.
**Chi:** 3 Ratti famelici dagli occhi rossi (4 a liv. 3; 2 e PF ridotti a 4 a liv. 1). **PX 75.**
**Innesco:** i ratti stanno divorando qualcosa — il cadavere dissanguato del mendicante (indizio §5 del documento di trama). Non fuggono all'avvicinarsi: si voltano, tutti insieme, in silenzio.
**Ambiente:** una grata sul soffitto (colpirla: scroscio d'acqua, i ratti nell'area devono superare For CD 10 o sono spazzati via 3 m); il cadavere stesso (esaminarlo *durante* lo scontro con un'azione: si nota il foro alla base del collo).
**Scopo di design:** far ingranare la giocatrice coi dadi senza rischio reale, e piantare l'immagine dei "piccoli occhi rossi" che tornerà su creature sempre più grandi. Scala di corruzione visiva: ratti → goblin → uomini → Aldric.

### Scontro 2.2 — I trasportatori *(medio, cuore tattico della sessione)*
**Dove:** la chiusa vecchia — una camera con passerelle di legno marcio sospese a 3 m sopra un canale d'acqua nera, una chiatta carica di casse, un argano.
**Chi:** 2 Goblin delle fogne + 1 Sorvegliante Marchiato. (Liv. 1: togli un goblin e il Multiattacco. Liv. 3: aggiungi 1 Marchiato semplice.) **PX 300.**
**Situazione:** stanno caricando casse sulla chiatta. Dentro le casse: fiale di liquido scuro (la pozione degli occhi rossi) e — in una — oggetti personali confiscati, tra cui qualcosa che la pg riconosce come appartenente a una delle ragazze scomparse. La pg può osservare, seguire, o attaccare: **premiare l'osservazione** con un round di sorpresa e la scoperta della rotta della chiatta.
**Tattica nemica:** i goblin usano le fionde dalle passerelle e Fuga Agile; il Sorvegliante ignora Aldric e cerca di **afferrare e trascinare la pg verso la chiatta** (lei è merce, non nemico — se la giocatrice lo capisce, brivido garantito).
**Ambiente:** passerelle marce (For o peso: crollano — 1d6 da caduta e prono nel canale); l'argano (azione, For CD 12: la chiusa si apre e la corrente trascina chi è in acqua di 6 m); le casse (copertura tre quarti; se rotte, le fiale si spargono).
**Esiti oltre la vittoria:** un goblin catturato canta subito ("La chiatta va al Cuore Pulito. Il Sorvegliante ha la chiave. Noi non entriamo là: chi entra senza il segno, non riesce nemmeno a *vedere* la porta."). Il Fischio Vuoto del Sorvegliante può richiamare i ratti superstiti del 2.1 come ondata.
**Bottino:** 2 pozioni di guarigione, 1 fiala di Acqua degli Occhi Rossi (vedi §9), la chiave gemella, la mappa di cuoio (se non già data col goblin della Sessione 1), 15 mo in monete miste con conii di tre regni diversi — i traffici attraversano le frontiere della guerra.

### Scontro 2.3 — La fuga nel buio *(skill challenge, non un combattimento)*
**Innesco:** dopo il 2.2, il crollo di una passerella (o l'apertura della chiusa) fa franare un tratto di volta. L'acqua sale, la torcia muore, qualcosa nuota.
**Meccanica:** servono **4 successi prima di 3 fallimenti**, CD 12, ogni prova con un'abilità diversa e descritta dalla giocatrice. Esempi: Atletica (nuotare contro corrente), Sopravvivenza (orientarsi dalle correnti d'aria), Percezione (il bagliore dei simboli sul muro — i marchi *rispondono* al suo), Arcana (leggere i simboli al volo), Furtività (non farsi notare da ciò che nuota), o magia usata creativamente (successo automatico se la trovata è buona: premiala).
**Fallimenti:** 1° — perde un oggetto non essenziale nella corrente; 2° — 1d6 danni contundenti e Aldric ferito; 3° — non morte: **si risvegliano all'uscita della cloaca, all'alba, senza ricordare l'ultimo tratto.** Un micro-blackout condiviso. Aldric, scosso: "Tu... ricordi come siamo usciti?" Prima volta che il mistero tocca anche lui.
**Perché c'è:** chiude la sessione col registro dell'orrore anziché della vittoria, e mostra che le fogne stesse sono un avversario.

---

## 4. Sessione 3 — "Il muro che riconosce": scontri

### Scontro 3.1 — Il prelievo di Mira *(medio, combattimento con protezione)*
**Dove:** superficie, vicolo dietro il mercato del pesce, sera. (Sì, fuori dalle fogne: alternare gli ambienti respira.)
**Chi:** 2 Marchiati + 1 Goblin delle fogne come palo. (Liv. 1: 1 Marchiato + 2 goblin. Liv. 3: 3 Marchiati.) **PX 250.**
**Situazione:** i Marchiati stanno trascinando via Mira, priva di sensi, arrotolata in un tappeto. Obiettivo nemico: **non vincere — consegnare.** Un Marchiato combatte per coprire, l'altro porta Mira verso un tombino aperto. Round tracciati: se al round 4 il portatore raggiunge il tombino, sparisce con lei (e la trama della Sessione 4 diventa un salvataggio — fallire qui non rompe nulla, cambia strada).
**Regola d'oro della scena:** Mira è a 0 PF ma stabile; nessun nemico la colpisce mai. Rasha la vuole intatta. Se la giocatrice lo nota ("perché non l'hanno uccisa?"), ha appena capito da sola metà del piano nemico.
**Dopo:** Mira sveglia = primo confronto tra marchiate ("Perché tu sì e noi no?"), e il legame emotivo che renderà la Fase 3 devastante. Se la pg pronuncia il nome inciso sull'anello nuziale di un Marchiato caduto (Indagare CD 10 sul corpo), pianta qui la scoperta della Crepa del Nome.

### Scontro 3.2 — Il Guardiano dell'Acqua Nera *(boss del mini-arco, dentro il santuario)*
Vedi stat block e meccanica a enigma in §7. **PX 450.**

### Incontro 3.3 — L'Ombra *(scena scriptata, NON uno scontro)*
Vedi §8 per la gestione completa.

---

## 5. Enigmi e indovinelli

### 5.1 — Il cerchio delle cinque tacche *(enigma di lettura, Sessione 2)*
Sui muri, ricorrente: un cerchio con cinque tacche radiali, quattro annerite col carbone, la quinta pulita. In un punto, sotto il simbolo più grande, versi incisi da mano ferma:

> *Cinque figlie conta l'acqua nera,*
> *quattro han bevuto, una ancora spera.*
> *Non chiave, non fiamma, non ferro, non vento:*
> *passa soltanto chi porta il segno dentro.*

**Soluzione:** non c'è nulla da "risolvere" subito — è un enigma a scoppio ritardato. Ha tre letture progressive: (1) le cinque tacche sono le cinque ragazze; (2) la quarta tacca annerita di fresco significa che il conto avanza *adesso*; (3) "il segno dentro" è il marchio — ed è la chiave del muro cieco (5.2). Se la giocatrice arriva alla lettura 1 da sola, dalle un ispirazione. Non confermare mai la lettura 3 finché non la testa sul muro.

### 5.2 — Il muro che riconosce *(enigma-porta, Sessione 3)*
Il muro cieco dove convergono le tracce di trascinamento. Nessun meccanismo trovabile: Indagare rivela solo che la malta è *troppo* perfetta. La forza non funziona. Knock funzionerebbe (non ce l'ha). La porta si apre solo quando **il marchio della pg tocca la pietra** — pelle contro muro.
**Design del fallimento:** ogni tentativo sbagliato produce un indizio, mai un muro di gomma. Fuoco → i simboli attorno brillano un istante (quindi reagiscono alla magia). Colpi → il suono è pieno, non cavo, *tranne* in un punto a forma di mano. Se la giocatrice è bloccata da più di 10 minuti reali, Aldric nota: "Quel punto liscio... è all'altezza del tuo segno." (Il sidekick come suggeritore diegetico: mai il DM che suggerisce, sempre il mondo.)
**Il colpo di scena incluso:** aprendo la porta, la pg capisce che *è già entrata da qui* — durante i blackout. Sul lato interno della porta, un graffio recente alla sua altezza, e impigliato un filo del suo stesso vestito.

### 5.3 — Le cinque ciotole *(enigma a rischio, la stanza pulita)*
La stanza immacolata: tavolo di pietra con cinque incavi, sotto ognuno un piccolo bassorilievo — un nastro, un anello, una ciocca, un dente, e il quinto: **uno specchio vuoto** (nessuna immagine). Su un lato, inciso:

> *Quattro doni per quattro sorelle date,*
> *il quinto posto attende chi si è dimenticate.*
> *Deponi ciò che sei, ricevi ciò che eri:*
> *l'acqua rende il vero a chi le offre i suoi pensieri.*

**Meccanica:** se la pg depone nell'incavo vuoto qualcosa di *suo e significativo* (a scelta della giocatrice — più costa, più rende), l'incavo si riempie di acqua nera e le restituisce **un ricordo di blackout**: 30 secondi di visione in prima persona di una sua notte perduta (scegli tu quale frammento darle: la scena in cui salva la bambina, o quella in cui scrive il messaggio a se stessa). Prezzo: l'oggetto sparisce per sempre e il suo marchio si scurisce visibilmente di un grado. Rischio contro conoscenza: perfetto per una caotica buona, e la scelta è *sua*.
**Se non offre nulla:** legittimo. La stanza resta lì, e l'incavo vuoto la aspetta — un enigma che si può rifiutare pesa più di uno obbligatorio.

### 5.4 — L'indovinello del vecchio delle rane *(chiusura di sessione)*
All'uscita delle fogne, il mentore la fissa, ride piano, e invece di salutare recita:

> *"Rispondimi, occhi nuovi: che cosa perde*
> *chi ha fatto in modo di non poter perdere niente?"*

Non aspetta la risposta. Se ne va saltellando tra le pozzanghere. **La risposta è "tutto" (o "se stesso")** — ed è la tesi dell'intera campagna in una riga. Non risolverlo mai per lei: l'indovinello deve restarle addosso per settimane. Se un giorno, magari davanti a Rasha, la giocatrice lo cita da sola — quello è il momento in cui la campagna ha vinto.

### 5.5 — Il riflesso sbagliato *(enigma percettivo, il santuario)*
La vasca d'acqua nera non riflette il soffitto: riflette un cielo notturno di palude. **Le stelle di quel riflesso sono sbagliate** — Arcana o Natura CD 13: non è il cielo di Calù, le costellazioni sono quelle visibili solo dall'estremo nord. Chi copia il riflesso ha, di fatto, **una mappa stellare che localizza il santuario di Rasha nelle paludi** — inutilizzabile ora, indispensabile nella Fase 4. Ricompensa per chi osserva invece di toccare. (Toccare va bene lo stesso: parte la visione scriptata. Due porte, entrambe buone, contenuti diversi.)

---

## 6. Skill challenge ricorrente — Navigare le fogne profonde
Ogni volta che la pg scende oltre i tratti conosciuti, invece di mappare corridoio per corridoio: **3 successi prima di 2 fallimenti, CD 12** (4/3 e CD 13 per il tratto del santuario). Ogni prova va *descritta* dalla giocatrice, abilità mai ripetuta due volte di fila. Ogni fallimento estrae dalla tabella:

| d4 | Complicazione |
|---|---|
| 1 | Incontro casuale: 1d3 ratti dagli occhi rossi |
| 2 | Guado obbligato nell'acqua nera: TS Cos CD 11 o avvelenato per 1 ora |
| 3 | Attrezzatura danneggiata (torce bagnate, componenti materiali sporcate) |
| 4 | Sono *osservati*: svantaggio alla prima prova di Furtività del prossimo scontro |

Successo pieno: arrivano dove volevano, riposati. Il challenge trasforma il viaggio da tempo morto a tensione, senza disegnare mappe.

---

## 7. Il boss: Guardiano dell'Acqua Nera *(combattimento-enigma)*

*Elementale Grande, non allineato* — **PX 450 (CR 2, ridotto dall'enigma)**
**CA** 13 · **PF** 45 (7d10+7) · **Velocità** 9 m, nuoto 27 m
FOR 16 (+3) · DES 14 (+2) · COS 13 (+1) · INT 5 (−3) · SAG 10 (+0) · CAR 8 (−1)
**Resistenze** contundenti, perforanti e taglienti da attacchi non magici · **Vulnerabilità** fuoco, radiosi
**Immunità alle condizioni** afferrato, prono, spaventato · **Sensi** vista cieca 18 m
**Multiattacco.** Due schiaffi d'onda.
**Schiaffo d'onda.** +5, 1d8+3 contundenti più 1d4 necrotici (2d8+3 e 1d6 a liv. 3).
**Inghiottire il ricordo (ricarica 5-6).** Un bersaglio entro 1,5 m: TS For CD 13 o è trascinato nella massa d'acqua — trattenuto, sott'acqua, 2d6 necrotici all'inizio di ogni suo turno. Prova di For/Atletica CD 13 per uscire; chi è dentro *vede cose*: dagli un frammento di verità per ogni round trattenuto (dolore pagato in conoscenza).
**Azione di tana (iniziativa 20).** L'acqua della vasca *ricorda*: proietta un'immagine viva (Rasha incoronata; le quattro ragazze addormentate in fila; la pg stessa, di notte, che cammina in questi corridoi). Ogni creatura che vede l'immagine: TS Sag CD 12 o resta **incantata dalla visione** fino alla fine del suo prossimo turno (velocità 0, niente azioni, ma *guarda* — e ciò che guarda è un indizio vero). Aldric fallisce apposta il primo: la sua descrizione di ciò che vede fa capire la meccanica alla giocatrice.

### L'enigma dentro lo scontro
Il Guardiano è legato alle **cinque nicchie**. Ogni oggetto personale **riportato alla propria nicchia** (azione, o azione bonus con Arcana CD 12) gli strappa via una parte: **−10 PF immediati e perde un'azione di tana** per ogni oggetto deposto. Depositati tutti e quattro gli oggetti delle ragazze, il Guardiano collassa a prescindere dai PF rimasti — e l'acqua, ritirandosi, *ringrazia*: per un istante mostra quattro volti di ragazze addormentate, vive.
Indizio d'ingresso (non nasconderlo troppo): quando la pg entra con gli oggetti addosso (raccolti nelle nicchie o nella cassa della chiatta), le nicchie **brillano debolmente in direzione dell'oggetto corrispondente**, come calamite affamate.
**Perché è costruito così:** la stregona può vincere col fuoco (vulnerabilità: le sue Mani Brucianti diventano protagoniste), con l'enigma, o con un misto. Qualunque strada scelga la giocatrice, era quella giusta. E il boss del mini-arco insegna il pattern dell'intera campagna: *i mostri di Rasha non si abbattono soltanto — si liberano.*

---

## 8. L'Ombra — come gestire un incontro invincibile senza frustrare

Regola assoluta: **un nemico invincibile è tollerabile solo se non vuole ucciderti.** L'Ombra nel santuario non è una minaccia: è un esaminatore.

Sequenza consigliata (dopo il collasso del Guardiano, o al tocco dell'acqua):

1. **L'ingresso.** Il freddo prima della vista. Le torce si piegano *verso* di lui, come risucchiate. Niente musica d'azione nella tua testa: silenzio.
2. **Se la pg attacca** — lascia che tiri. Qualsiasi attacco lo attraversa... **tranne la sua magia.** Un trucco d'argento: al primo incantesimo che lo colpisce, chiedi un tiro sulla tavola della magia selvaggia (o usa la tabella §10). Qualunque cosa esca, l'Ombra **arretra di un passo.** Un passo solo. Poi inclina la testa, quasi incuriosito. Non subisce PF, non c'è barra da scalfire — ma la giocatrice ha appena visto l'unica cosa in tutta Luria che lo tocca. Speranza piantata, potere futuro promesso, zero vittoria regalata.
3. **Se la pg gli parla** — risponde. Massimo cinque parole per battuta, voce senza eco. Alle domande sulle ragazze: "Non ancora complete." Su di lei: "Non ancora matura." Sul suo padrone: silenzio, ma le torce si spengono per un secondo.
4. **Il tocco (solo se la pg insiste nel bloccarlo fisicamente):** la sfiora — TS Cos CD 20, fallimento automatico dichiarato *dopo* il tiro (che il dado rotoli comunque: deve sembrare una regola del mondo, non un editto del DM). Paralizzata per un round, e in quel round lui **le sistema una ciocca di capelli dietro l'orecchio** — un gesto di padrone col suo animale, o di sarto con l'abito buono. Poi se ne va. Questo gesto genererà più odio di mille danni.
5. **L'uscita.** Non svanisce in fumo: **smette di essere illuminato.** Le ombre normali lo riassorbono. Aldric, dopo, con la spada ancora tremante: "Io l'ho colpito. Ti giuro che l'ho colpito." — "Lo so. Anch'io."

Da questo momento, ogni volta che una torcia si piega senza vento, la giocatrice tratterrà il fiato. Quello è l'incontro che hai davvero costruito.

---

## 9. Bottino a tema

**Fiala di Acqua degli Occhi Rossi** *(oggetto maledetto, meraviglioso da tenere in inventario)*. Chi la beve: per 1 ora, +2 a For e Cos, immune allo spaventato. Poi: TS Sag CD 13 o perde un ricordo felice a scelta del DM, per sempre; gli occhi restano venati di rosso per 1d4 giorni. La magia selvaggia della pg la **rigetta**: se la beve lei, vomito immediato, un'impennata selvaggia gratuita, e una visione di 6 secondi delle paludi del nord. Curiosità premiata e punita insieme. Non toglierle mai la fiala: la tentazione nell'inventario vale più di dieci discorsi sul tema.

**Anello di rame di Mira.** Non magico. Diventerà l'oggetto più importante della campagna dopo la Fase 3. Consegnalo adesso, senza enfasi.

**Focus della Marea Gentile** *(oggetto raro minore, ricompensa del santuario — un frammento di ossidiana della vasca, ora inerte e tiepido)*. Richiede sintonia da parte di un incantatore con Magia Selvaggia. 1/riposo lungo, quando la pg tira sulla tavola della Magia Selvaggia può **tirare due volte e scegliere il risultato**. Primo, piccolo passo del percorso meccanico-tematico che culminerà nel finale (quando sceglierà dalla tavola senza tirare). Il caos non si doma: si ascolta.

**Pozioni di guarigione** (2d4+2): almeno una per scontro, sempre addosso ai Marchiati.

---

## 10. Tabella d'ambiente — Magia selvaggia nelle fogne (d10)
Da usare in aggiunta o in sostituzione di un risultato della tavola ufficiale quando vuoi che l'impennata *racconti*. Nessun effetto è punitivo: il caos della pg è vivo, curioso, e stranamente dalla sua parte.

| d10 | Impennata |
|---|---|
| 1 | Tutti i marchi (muri, nemici, il suo) brillano di luce iridescente per 1 round: nessuna creatura marchiata può nascondersi da lei |
| 2 | L'acqua nera entro 6 m *indietreggia* da lei, scoprendo il fondale (e ciò che nasconde) per 1 minuto |
| 3 | Per 1 round vede attraverso gli occhi dell'ultimo ratto dagli occhi rossi rimasto vivo |
| 4 | I suoi occhi diventano iridescenti per 10 minuti; le creature dagli occhi rossi la fissano, esitanti (svantaggio al loro primo attacco contro di lei) |
| 5 | Un ricordo di blackout riaffiora per 3 secondi: un'immagine, scegli tu quale (avanzamento di trama gratuito) |
| 6 | Ogni fiamma entro 9 m diventa fredda e azzurra per 1 minuto: luce senza calore, e l'Ombra — ovunque sia — lo *sente* |
| 7 | La voce le esce doppia per 1 round, la sua e una sconosciuta che parla all'unisono (chi la ode: TS Sag CD 12 o spaventato 1 round) |
| 8 | Il suo marchio brucia: 1 danno psichico, ma conosce la direzione esatta della creatura marchiata più vicina |
| 9 | Piovono dal soffitto 2d10 monete di un conio vecchio di 300 anni, con il volto di una giovane regina che somiglia a Rasha |
| 10 | Per 1 minuto la sua ombra si muove un mezzo secondo *prima* di lei — e para: +1 CA |

---

## 11. Integrazione con claude-dnd-skill

Questo documento è pronto per `/dnd import` (markdown), oppure puoi trapiantare i pezzi a mano:

**In `npcs.md`** — copia gli stat block di §1-2 e §7; per il formato del repo aggiungi a ciascuno demeanor/motivation/secret. Esempio per il Sorvegliante: *demeanor:* silenzio totale, movimenti economici; *motivation:* consegnare il carico al Cuore Pulito; *secret:* si chiamava Berrec, era un barcaiolo, l'anello al collo era di sua moglie.

**Inizializzare lo scontro 2.2:**
```json
[
  {"name":"PG","dex_mod":2,"hp":15,"ac":13,"type":"pc"},
  {"name":"Aldric","dex_mod":1,"hp":20,"ac":17,"type":"pc"},
  {"name":"Goblin A","dex_mod":2,"hp":7,"ac":13,"type":"npc"},
  {"name":"Goblin B","dex_mod":2,"hp":7,"ac":13,"type":"npc"},
  {"name":"Sorvegliante","dex_mod":0,"hp":30,"ac":14,"type":"npc"}
]
```
(Correggi `dex_mod`, `hp` e `ac` della PG con i valori reali della scheda.)

**In `state.md → Live State Flags`** — tieni traccia di: tacche annerite (4/5), grado di scurimento del marchio della pg (0-3), oggetti delle nicchie recuperati (0-4), nomi dei Marchiati scoperti, fiala di Acqua Rossa (posseduta/bevuta/distrutta).

**Arco narrativo** — se usi l'arc system del repo, mappa così: Inciting Incident = la piazza (fatto); Complication = il santuario e il marchio (Sessione 3); il Midpoint Shift arriverà quando scoprirà che i blackout sono lei.

---

*Ultima nota di regia: il combattimento gratifica quando la giocatrice vince* nel modo suo. *Con una stregona della magia selvaggia caotica buona, il tuo lavoro non è bilanciare i numeri — è costruire arene dove il caos è un'arma e la pietà una scelta possibile. Ogni goblin che si arrende, ogni Marchiato liberato dal proprio nome, è un mattone della risposta che darà a Rasha.*
