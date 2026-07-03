# The Meaning of Invincible — Roadmap software
### Come trasformare l'app in un'avventura interattiva, mappata sul codice esistente

> Questo documento traduce i quattro documenti di design (`the_meaning_of_invincible.md`,
> `scontri_ed_enigmi_sessioni_2_3.md`, `immersione_e_narrazione.md`, `Lore.txt`) in
> feature concrete, ognuna agganciata ai file reali del repository. Non è codice: è la
> mappa da cui decidere cosa costruire, in che ordine e con quale sforzo.
>
> Legenda sforzo: **S** = piccolo (poche ore) · **M** = medio (una sessione di lavoro) · **L** = grande (progetto a sé)

---

## 0. Il principio guida (leggere prima di tutto)

I documenti mescolano due cose diverse. Tenerle separate è la decisione di design più importante.

1. **Artigianato da tavolo analogico** — linee e velature, check-out di fine sessione, la
   "domanda interiore", le descrizioni sensoriali dette a voce, il de-briefing emotivo.
   **Questo non va nell'app.** Sistematizzarlo in UI lo ucciderebbe. I documenti stessi lo
   ripetono: *"non annunciare mai le fasi"*, *"troppe immagini e diventa un videogioco"*,
   *"il mostro non spiega mai il piano"*.

2. **Ciò che solo un canale sincronizzato tra due dispositivi (+ una TV) può fare.** Questo è
   il dominio dell'app.

> **Tesi:** l'app è il *sistema nervoso condiviso* del tavolo — il canale che porta i colpi
> preparati dal Master nelle mani della giocatrice e sullo schermo della stanza, e che rimanda
> visibile ciò che lei fa. **Consegna, ricorda, riflette lo stato. Non racconta mai.**

Ogni volta che si sta per costruire qualcosa, la domanda di controllo è:
*"questo è un canale che porta un colpo del Master alla giocatrice, o sto cercando di far
raccontare la storia al software?"* Se è la seconda, si tiene analogico.

---

## 1. Cosa c'è già (per non ricostruirlo)

Prima di aggiungere, l'inventario di ciò che il codice fa oggi. Diverse idee dei documenti
sono **già implementate** o quasi.

| Sistema | Dove | Stato |
|---|---|---|
| Campagna singola fissa (1 DM + 1 giocatore, token in stato, non in URL) | `src/lib/game/repo.ts` (`getOrCreateSingletonCampaign`) | ✅ |
| Log eventi append-only con polling | tabella `events`, `/api/state/[token]`, `src/lib/game/client.ts` | ✅ |
| Tiri richiesti dal DM + registrati dal giocatore | `requestRoll` / `recordRoll` in `game-actions.ts` | ✅ |
| Tiri segreti del DM (filtrati dal log del giocatore) | `loadState` in `repo.ts` | ✅ |
| **Ispirazione** (DM concede, giocatrice spende per vantaggio) | `setInspiration` / `spendInspiration` | ✅ **già fatto** |
| PF / PF temporanei / condizioni / TS morte / dadi vita / slot | `game-actions.ts` (`changeHp`, `toggleCondition`, …) | ✅ |
| Roster PNG del DM (con statblock derivato) | `campaigns.npcs` JSONB, `Npc` in `game/types.ts`, `NpcPanel.tsx` | ✅ base |
| Combattimento: incontri, combattenti, iniziativa, terreno, mostri | `encounters`/`combatants`, `src/components/combat/*` | ✅ |
| Oggetti magici e consumabili (il DM consegna, il giocatore usa) | `addMagicItem` / `assignConsumable` / `useMagicItem` | ✅ |
| Level-up (DM avvia, giocatore risolve) | `levelUp` + risolutori in `game-actions.ts` | ✅ |
| Note persistenti (blocco DM sulla campagna, blocco giocatore sulla scheda) | `saveDmNotes` / `savePlayerNotes` | ✅ |
| Terreni con etichette IT | `src/lib/dnd/terrain.ts` | ✅ |
| Presentazione/intro narrativa | `src/lib/story/intro.ts`, `src/app/play/IntroPresentation.tsx` | ✅ base |

**Conseguenza pratica:** molte feature qui sotto non partono da zero — estendono un pattern
che esiste già (soprattutto: *nuovo `kind` di evento* + *nuova azione in `game-actions.ts`* +
*nuovo pezzo di UI in `PlayerSheet.tsx` / `DmDashboard.tsx`*).

---

## 2. Architettura: perché quasi nulla richiede migrazioni

Due fatti del codice cambiano tutto:

- **`events.kind` è testo libero** e **`events.data` è JSONB.** Un nuovo tipo di beat
  narrativo (scena, dialogo, handout, presagio, skill challenge, diceria) è semplicemente un
  nuovo valore di `kind` con un payload in `data`. **Zero migrazioni.** Il giocatore lo riceve
  già via polling; basta insegnare alla UI a *renderizzarlo*.
- **`characters.sheet` e `campaigns.npcs` sono JSONB.** Stato per-personaggio nuovo (es. grado
  di scurimento del marchio, tratti di personalità) può vivere dentro `sheet` senza toccare lo
  schema.

**Quando serve davvero una migrazione:** solo per stato *persistente e mutabile a livello di
campagna* che non è un evento e non appartiene alla scheda — cioè gli **orologi** (Raccolta,
Guerra) e l'eventuale **scena corrente** del Tavolo. Raccomandazione: aggiungere **una sola**
colonna `campaigns.meta` JSONB come contenitore generico (`{ clocks?, currentScene?, tavoloToken? }`),
così tutte le esigenze future di stato-campagna entrano lì senza altre migrazioni.

```
drizzle/ → una migrazione unica: ALTER TABLE campaigns ADD COLUMN meta jsonb NOT NULL DEFAULT '{}'
```

Regola generale per decidere dove mettere lo stato:
- **È un beat che accade una volta e resta nel log?** → evento (`kind` nuovo). Nessuna migrazione.
- **È stato per-personaggio?** → dentro `sheet` (JSONB). Nessuna migrazione.
- **È stato mutabile di campagna (orologi, scena attiva)?** → `campaigns.meta` (una migrazione, una volta sola).

---

## 3. Le feature

Struttura di ogni voce: **cosa fa · da quale documento · file da toccare · migrazione? · sforzo · note d'implementazione.**

---

### TIER 1 — Il cuore dell'"avventura interattiva"

#### 1.1 · Sistema di scene, dialoghi e handout `kind: 'scene'`
- **Cosa fa:** il Master compone un beat narrativo e lo "spinge" sullo schermo della
  giocatrice: carta read-aloud (testo su fondo pergamena), dialogo PNG (nome + ritratto +
  battuta), oppure handout-immagine (il biglietto *"NON BERE QUELLO CHE TI OFFRONO"*, la mappa
  di cuoio, il conio di Rasha). È la fondazione su cui poggiano poi 1.x successive e le rivelazioni.
- **Documenti:** `immersione §5` (handout), `the_meaning §3, §7` (dialoghi/PNG), idee-immersione (read-aloud).
- **File:**
  - `src/app/game-actions.ts` → nuova azione `pushScene(dmToken, { variant: 'read-aloud' | 'dialogue' | 'handout', title?, speaker?, portrait?, body?, image? })` sul modello di `requestRoll` (inserisce un evento, `kind: 'scene'`, `actor: 'dm'`).
  - `src/app/play/[playerToken]/PlayerSheet.tsx` → un renderer che, quando arriva un evento `scene`, mostra una **carta a tutto schermo/overlay** invece di una riga di log.
  - `src/app/dm/[dmToken]/DmDashboard.tsx` → un piccolo compositore (variante, testo, scelta immagine/ritratto).
  - immagini in `public/handouts/` e `public/portraits/` (vedi Decisione D2).
- **Migrazione:** ❌ nessuna (evento + JSONB).
- **Sforzo:** **M**.
- **Note:** è il primo mattone da posare — quasi tutto il Tier 2 lo riusa. Tenere il payload
  generico (`variant` discrimina il rendering) così busta sigillata e reveal blackout diventano
  varianti, non nuovi sistemi.

#### 1.2 · Modalità "Tavolo" — `/tavolo/[token]`
- **Cosa fa:** una route in **sola lettura** pensata per una TV/secondo schermo nella stanza:
  arte/nome della scena corrente, ordine d'iniziativa col turno evidenziato, ultima narrazione
  (dalle scene 1.1), ultimo tiro importante. **E lo schermo diventa nero quando entra l'Ombra**
  (vedi 1.3 e 2.1).
- **Documenti:** `immersione §5, §6`, `scontri §8`, idee-immersione ("Modalità Tavolo").
- **File:**
  - nuova route `src/app/tavolo/[token]/page.tsx` + componente board.
  - riusa `loadState` (`repo.ts`) e il polling di `src/lib/game/client.ts` — **legge, non scrive**.
  - la "scena corrente" da mostrare in grande può vivere in `campaigns.meta.currentScene`
    (aggiornata da 1.1) oppure derivare dall'ultimo evento `scene`.
- **Migrazione:** ❌ se deriva dall'ultimo evento; ✅ (la colonna `meta`) se si vuole una scena
  "fissata" indipendente dal log.
- **Sforzo:** **M**.
- **Note token (Decisione D1):** l'app è a campagna singola con `dmToken`/`playerToken`. Per il
  Tavolo o si riusa il `dmToken` (comodo in stanza, ma è un token potente) o si aggiunge un
  `tavoloToken` di sola lettura in `campaigns.meta`. Raccomando il `tavoloToken`.

#### 1.3 · Audio ambientale + il silenzio come segnale
- **Cosa fa:** loop ambientale per `terrain` (foresta, sotterraneo, palude, città…), avviato su
  entrambi i dispositivi quando il DM prepara/avvia lo scontro; SFX sugli eventi (tiro, critico,
  level-up, incantesimo). E — l'effetto più economico di tutto l'arsenale — **la musica si spegne
  quando entra l'Ombra**. Dopo due volte, sarà lo stop a annunciarla.
- **Documenti:** `immersione §6` ("il silenzio è la quinta playlist"), `scontri §8`, idee-immersione.
- **File:**
  - `src/lib/dnd/terrain.ts` → mappa `terrain → traccia audio`.
  - un piccolo audio-manager client che reagisce agli eventi in arrivo (in `PlayerSheet.tsx` e
    nella board Tavolo), con un mixer minimale lato DM (ambiente/musica/effetti).
  - file audio in `public/audio/` (loop ambientali + SFX corti).
- **Migrazione:** ❌.
- **Sforzo:** **M**.
- **Note:** rispettare l'autoplay policy dei browser (serve un gesto utente per "armare"
  l'audio: un pulsante "Entra nella stanza" all'apertura). Precaricare i loop; nessun servizio esterno.

---

### TIER 2 — La firma di *questa* campagna (non feature generiche)

#### 2.1 · Presagi e leitmotiv visivi `kind: 'omen'`
- **Cosa fa:** segnali che il Master attiva e che compaiono su scheda e Tavolo, sempre identici:
  le torce che si piegano senza vento (l'Ombra è vicina/osserva), il marchio che prude (creature
  marchiate nei paraggi), l'acqua che smette di riflettere. Disciplina ferrea: **mai a vuoto**.
  Include il trigger "entra l'Ombra" che spegne audio (1.3) e annerisce il Tavolo (1.2).
- **Documenti:** `immersione §4` (scala degli occhi rossi e leitmotiv), `scontri §8`.
- **File:**
  - `game-actions.ts` → `pushOmen(dmToken, { signal: 'torch' | 'mark-itch' | 'still-water' | 'shadow-enters' })`.
  - `PlayerSheet.tsx` + board Tavolo → micro-animazioni/overlay per ciascun segnale (rispettare
    `prefers-reduced-motion`, già presente nel progetto).
- **Migrazione:** ❌.
- **Sforzo:** **S–M**.
- **Note:** tre-quattro segnali bastano. Il valore è la *coerenza*: la prima volta che si bara, il linguaggio muore.

#### 2.2 · Orologi di avanzamento (Raccolta · Guerra · Marchio)
- **Cosa fa:** i tre orologi dei documenti. Widget lato Master per riempirli; le **conseguenze**
  diventano visibili (un evento in fiction: "al mercato mancano i banchi del pesce, requisiti
  dall'esercito"). Il **grado di scurimento del marchio (0–3)** della giocatrice è mostrato sulla
  sua scheda come tensione crescente.
- **Documenti:** `immersione §8`, `scontri §11` ("Live State Flags").
- **File:**
  - orologi Raccolta/Guerra (campagna) → `campaigns.meta.clocks`.
  - marchio (personaggio) → dentro `characters.sheet` (es. `sheet.marks.corruption: 0..3`) via una `mutate(...)`.
  - `DmDashboard.tsx` → i tre orologi; `PlayerSheet.tsx` → l'indicatore del marchio.
- **Migrazione:** ✅ (la colonna `campaigns.meta`, una volta sola) per Raccolta/Guerra. Il marchio no.
- **Sforzo:** **M**.
- **Note:** legare il marchio alle *scelte* (offerte alle ciotole, contatti con l'acqua nera),
  mai al caso. Orologio pieno del Marchio = un blackout da svegli (aggancio a 2.3).

#### 2.3 · Reveal dei blackout e "busta sigillata"
- **Cosa fa:** contenuto che il Master **pre-carica** e sblocca a comando: il messaggio nella
  propria calligrafia, i frammenti di ricordo in seconda persona, la busta che "sta sul tavolo a
  fare pressione" per settimane e poi si apre.
- **Documenti:** `the_meaning §4` (scaletta rivelazioni), `immersione §5` (busta sigillata, diario di bordo).
- **File:** è una **variante** di 1.1 (`kind: 'scene'`, `variant: 'sealed'`) con uno stato
  "bloccato/sbloccato" nel payload; l'azione di sblocco è un secondo evento o un update di `meta`.
- **Migrazione:** ❌ (poggia su 1.1).
- **Sforzo:** **S** (dopo 1.1).
- **Note:** il reveal se lo legge la giocatrice con la propria voce in testa: nessuna descrizione
  del DM compete. Consegnare l'handout come immagine scritta a mano (in `public/handouts/`).

#### 2.4 · La "Crepa del Nome" in combattimento
- **Cosa fa:** un flag "vero nome scoperto" su un combattente (Marchiati, poi l'Ombra) che
  sblocca un'azione dedicata: pronunciare il nome per fargli perdere l'azione. È il **seme
  meccanico** della debolezza finale dell'Ombra, da imparare in piccolo ora.
- **Documenti:** `scontri §2` (tratto "La Crepa del Nome"), `§8` (l'Ombra esita al proprio nome).
- **File:**
  - `combatants` ha già `conditions` JSONB e `statblock` JSONB → aggiungere un campo
    `nameKnown`/`trueName` nel payload dello statblock (nessuna colonna nuova).
  - `src/components/combat/CombatTracker.tsx` + `src/app/combat-actions.ts` → l'azione e il suo effetto.
- **Migrazione:** ❌ (dentro `statblock` JSONB).
- **Sforzo:** **S**.
- **Note:** la scoperta del nome è narrativa (documenti, Intuizione CD 15 addosso al Marchiato):
  l'app registra solo *che* è stato scoperto e abilita l'azione.

#### 2.5 · PNG con ritratto, demeanor, movente, segreto
- **Cosa fa:** arricchisce il roster PNG esistente con ritratto e i campi che i documenti
  chiedono esplicitamente (demeanor/motivation/secret). **Aldric è già pronto**: statblock in
  `scontri §1` e ritratto `docs/Aldric.png`.
- **Documenti:** `immersione §7` (gesto/ritmo/parola per PNG), `scontri §1, §11` (formato npcs con demeanor/motivation/secret).
- **File:**
  - `src/lib/game/types.ts` → estendere `Npc` con `portrait?`, `demeanor?`, `motivation?`, `secret?`, `quirk?`.
  - `src/lib/character/npc.ts` (`buildNpc` / `NpcInput`) → accettare i nuovi campi.
  - `src/components/NpcPanel.tsx` → mostrarli (segreto visibile solo al DM).
  - spostare `docs/Aldric.png` → `public/portraits/aldric.png`.
- **Migrazione:** ❌ (`campaigns.npcs` è JSONB).
- **Sforzo:** **S**.
- **Note:** il ritratto del PNG si riusa immediatamente nei dialoghi (1.1) e nel tracker
  iniziativa. Alta resa, basso costo.

---

### TIER 3 — Meccaniche e profondità

#### 3.1 · Magia selvaggia come co-narratrice
- **Cosa fa:** la **tavola d10 delle fogne** (`scontri §10`) come roller dedicato che *racconta*;
  e il premio del finale: la giocatrice **sceglie** dalla tavola invece di tirare. Il "Focus della
  Marea Gentile" (`scontri §9`) è già il passo intermedio (tira due volte, scegli).
- **Documenti:** `scontri §9, §10`, `immersione §10` ("il caos ha un carattere").
- **File:**
  - `src/lib/game/roll.ts` → la tabella d10 e la logica surge.
  - un pannello magia selvaggia sulla scheda (`PlayerSheet.tsx`) o come oggetto/azione.
  - riusa `recordRoll` per loggare l'impennata.
- **Migrazione:** ❌.
- **Sforzo:** **M**.
- **Note:** all'impennata, passare la palla alla giocatrice ("com'è, vista da fuori?"). Il
  "barometro degli occhi iridescenti" (`immersione §10`) è un segnale visivo affine a 2.1.

#### 3.2 · Tracker per skill challenge
- **Cosa fa:** la struttura *N successi prima di M fallimenti* (fuga nel buio 4/3, navigazione
  fogne 3/2) come tracker condiviso tra DM e giocatrice, con l'estrazione delle complicazioni.
- **Documenti:** `scontri §3.3, §6`.
- **File:** `kind: 'challenge'` (stato nel payload: successi/fallimenti/CD); UI nel `DmDashboard`
  (avanza) e `PlayerSheet` (vede il progresso). Riusa il pattern di 1.1/2.2.
- **Migrazione:** ❌.
- **Sforzo:** **S–M**.

#### 3.3 · Tratti di personalità + riposi
- **Cosa fa:** ideali/legami/difetti + tratto caratteriale sulla scheda (l'Ispirazione che li
  premia **esiste già**); pulsanti Riposo Breve/Lungo che ripristinano PF, slot, dadi vita e
  cariche con un breve "rituale" visivo.
- **Documenti:** idee-immersione, `the_meaning §11`.
- **File:** `src/lib/sheet.ts` (schema Zod: campi su `identity`), `PlayerSheet.tsx`; i riposi
  orchestrano azioni già presenti (`spendHitDie`, slot, `rechargeMagicItem`).
- **Migrazione:** ❌ (dentro `sheet`).
- **Sforzo:** **S–M**.
- **Nota:** l'Ispirazione **non** va rifatta — c'è già (`setInspiration`/`spendInspiration`).

#### 3.4 · Voci di strada (d8) + quaderno delle promesse
- **Cosa fa:** un roller di dicerie (tabella d8 di `immersione §8`) che può spingere una diceria
  al giocatore come carta "senti dire che…"; e un tracker DM dei semi piantati con scadenza 4–6
  sessioni ("quaderno delle promesse").
- **Documenti:** `immersione §4` (quaderno), `§8` (voci).
- **File:** roller + carta = variante di 1.1; il quaderno = uno strumento nel `DmDashboard`
  (può vivere in `campaigns.meta` o nelle note DM esistenti).
- **Migrazione:** ❌.
- **Sforzo:** **S**.

---

## 4. Sequenza consigliata

1. **1.1 Sistema scene/handout** — è la fondazione: sblocca 2.1, 2.3, 3.2, 3.4 come varianti.
   Rischio basso (cavalca `events`), resa altissima (è *il* significato di "avventura interattiva").
2. **1.2 Tavolo + 1.3 audio/silenzio** — trasforma due telefoni in un tavolo da gioco e regala
   l'effetto-Ombra (silenzio + schermo nero) quasi gratis. Da fare insieme perché condividono
   il trigger "shadow-enters".
3. **2.5 PNG con ritratti (Aldric è pronto) + 2.4 Crepa del Nome** — piccoli, ad alta resa,
   agganciano subito il materiale delle Sessioni 2–3 che stai per giocare.
4. **2.1 presagi + 2.2 orologi** (qui entra l'unica migrazione: `campaigns.meta`).
5. **3.1 magia selvaggia**, poi il resto del Tier 3 quando serve al tavolo.

Milestone naturale dopo i punti 1–3: hai un'app con cui puoi *giocare la Sessione 2* in modo
sensibilmente più immersivo, senza aver toccato lo schema del database.

---

## 5. Cosa NON costruire (per disciplina)

Tenere questi analogici. Metterli in UI li ridurrebbe a checkbox e tradirebbe l'immersione che i
documenti proteggono:

- Linee e velature, patto sul buio, consenso in bianco (`immersione §1`).
- Check-out di fine sessione e de-briefing emotivo (`immersione §1, §11`).
- La "domanda interiore" e il flashback su richiesta (`immersione §2`) — sono momenti di voce, non funzioni.
- Le descrizioni sensoriali (la tavolozza dei profumi) — si dicono a voce; l'app al massimo
  suona l'ambiente (1.3), non elenca gli odori.
- La struttura in quattro fasi e la "domanda del titolo" — **mai** esposte come progress bar
  ("non annunciare mai le fasi").

Regola: se una tecnica funziona *perché* è detta da una persona a un'altra nella stessa stanza,
l'app la lascia stare.

---

## 6. Decisioni aperte (servono da te)

- **D1 — Token del Tavolo.** Riusare il `dmToken` per la TV (comodo, ma potente) o aggiungere un
  `tavoloToken` di sola lettura in `campaigns.meta`? *Raccomando `tavoloToken`.*
- **D2 — Storage immagini/handout/audio.** MVP: file statici in `public/` (handouts, portraits,
  audio), referenziati per path negli eventi `scene`. Upload dinamico dal DM (blob/marketplace)
  solo se poi servisse davvero. *Raccomando `public/` per iniziare.*
- **D3 — La colonna `campaigns.meta`.** Approvare l'unica migrazione (contenitore JSONB per
  orologi/scena/tavoloToken) prima di iniziare il Tier 2, così non ne servono altre.
- **D4 — Ambito della prima iterazione.** Fermarsi al punto 1 della sequenza (solo scene/handout)
  e provarlo al tavolo, o arrivare fino al punto 3 prima di testare?

---

*Nota finale, la stessa dei documenti di design: l'app non deve impressionare, deve* ricordare.
*Il valore vero è che il mondo si ricordi ciò che la giocatrice ha fatto — e ogni feature qui
sopra vale solo nella misura in cui serve quel ricordo.*
