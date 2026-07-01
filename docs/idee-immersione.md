# Idee per rendere la campagna più immersiva

Raccolta ragionata di possibili aggiunte, pensate **su misura** per questo progetto:
una campagna a due (Master su PC, giocatrice su mobile), giocata **nella stessa stanza**,
UI in italiano, estetica "pergamena scura" con la palette del brand.

Ogni voce indica **cosa**, **perché è immersiva**, **a cosa si aggancia** nel codice
esistente e lo **sforzo** stimato (S = piccolo, M = medio, L = grande).

> Legenda impatto: ⭐ utile · ⭐⭐ forte · ⭐⭐⭐ trasformativo

---

## 🎯 I 3 consigliati per primi

Il miglior rapporto immersione/sforzo, sfruttando ciò che c'è già:

1. **Atmosfera audio per terreno** (⭐⭐⭐, M) — il sistema dei terreni esiste già: farlo
   "suonare" è il salto di immersione più grande con meno lavoro.
2. **Modalità "Tavolo" su schermo condiviso / TV** (⭐⭐⭐, M) — un terzo schermo che fa da
   plancia di gioco per la stanza. Il repo di riferimento aveva già dei mockup per una TV display.
3. **Carte di narrazione e dialogo dei PNG** (⭐⭐, S–M) — trasformano il DM da "gestore di
   numeri" a narratore, con testo da leggere ad alta voce che appare sullo schermo.

---

## 🔊 Atmosfera sonora

- **Ambienti per terreno** (⭐⭐⭐, M) — a ogni `terrain` (foresta, sotterraneo, palude, città…)
  associa un loop ambientale; quando il DM prepara/avvia lo scontro, l'audio parte su entrambi i
  dispositivi. Aggancio: `src/lib/dnd/terrain.ts`, `CombatPanel`/`CombatTracker`.
- **Musica di sottofondo commutabile** (⭐⭐, M) — tracce Esplorazione / Combattimento / Boss che
  il DM cambia dal cruscotto; transizione in dissolvenza all'inizio del combattimento.
- **Effetti sonori sugli eventi** (⭐⭐, S) — tiro di dado, colpo critico, level-up, lancio di
  incantesimo, morte di un nemico. Aggancio: il feed eventi (`kind`: `roll`/`levelup`/`spell`/…).
- **Controllo audio lato DM** (⭐, S) — un mixer minimale (volume ambiente/musica/effetti) nel
  cruscotto, così l'audio non copre le voci al tavolo.

> Nota: precaricare/streammare i file localmente; nessun servizio esterno necessario.

## 🎬 Regia e narrazione

- **Carte di narrazione (read-aloud)** (⭐⭐, S) — il DM scrive un testo descrittivo che compare
  come "carta pergamena" sullo schermo della giocatrice (e sul Tavolo). Riusa il pattern eventi:
  un nuovo `kind: 'scene'`.
- **Dialoghi dei PNG** (⭐⭐, M) — carte con nome del parlante (+ ritratto opzionale) e battuta;
  utili per far "parlare" gli NPC che il DM già controlla in combattimento.
- **Handout / immagini** (⭐⭐, M) — il DM invia allo schermo del giocatore una mappa, una lettera,
  il ritratto di un mostro. Aggancio: un evento con URL immagine + un visualizzatore.
- **Diario di campagna condiviso** (⭐⭐, M) — obiettivi correnti, luoghi scoperti, PNG incontrati;
  cronologia persistente separata dal log volatile.
- **"Nelle puntate precedenti…"** (⭐, S) — riassunto della sessione generato dal log eventi come
  apertura della sessione successiva.

## 🖼️ Atmosfera visiva

- **Header di scena dinamico** (⭐⭐, S–M) — banner con nome del terreno + arte/gradiente evocativo
  su entrambe le schede, che cambia con la scena. Usa `--gradient-quest` e i token di palette.
- **Animazione dei dadi** (⭐⭐, M) — invece del risultato istantaneo, un breve tiro "fisico";
  esalta ogni tiro. Aggancio: `performRoll`/`performDice` in `src/lib/game/roll.ts`.
- **Fioriture per i critici** (⭐⭐, S) — Nat 20 lampo dorato, Nat 1 tremolio rosso; numeri di
  danno/cura "fluttuanti" sulla barra dei PF. Rispettare `prefers-reduced-motion` (già gestito).
- **Icone delle condizioni** (⭐, S) — glifi al posto delle chip testuali (le 14 condizioni italiane
  sono già in `labels.ts`); a colpo d'occhio si capisce lo stato.
- **Ritratto del personaggio** (⭐⭐, S) — avatar caricato o scelto da un set, mostrato su scheda,
  cruscotto e nel tracker iniziativa. Aggancio: `identity` nel foglio + upload.
- **Meteo / ora del giorno** (⭐, S) — una tinta dell'header (alba, notte, tempesta) impostata dal DM.

## ⚔️ Combattimento più vivo

- **Nastro dell'iniziativa con ritratti** (⭐⭐, M) — ordine dei turni come striscia con avatar e
  turno corrente evidenziato, su scheda e Tavolo. Aggancio: `orderByInitiative`, `CombatTracker`.
- **Tracciamento della concentrazione** (⭐⭐, M) — quando un incantatore lancia un incantesimo di
  concentrazione, badge "Concentrando: X" e richiesta automatica di TS Costituzione quando subisce
  danni. Aggancio: i dati `concentration` già presenti negli incantesimi.
- **Intenzioni del nemico / telegrafo** (⭐, S) — il DM annota cosa sta per fare un mostro; crea
  tensione e scelte tattiche per la giocatrice.
- **Griglia tattica opzionale** (⭐⭐⭐, L) — mappa a caselle con segnalini trascinabili (già rimandata
  in precedenza). Grande impatto ma grande lavoro; valutarla come progetto a sé.
- **Prompt di reazione** (⭐, S) — quando è appropriato (attacco d'opportunità, Scudo…), un invito
  sullo schermo del giocatore.

## 🎲 Dadi e tiri

- **Cronologia dei tiri con contesto** (⭐, S) — "Prova di Furtività: 18 (vantaggio)" con storico
  scorrevole; già in parte nel log, da valorizzare graficamente.
- **Tiri di gruppo** (⭐, S) — il DM chiede lo stesso tiro a tutti i partecipanti presenti.
- **Vibrazione (haptics) su mobile** (⭐, S) — un colpetto per tiro/critico/danno sul telefono della
  giocatrice. `navigator.vibrate`, solo mobile.

## 🧝 Profondità del personaggio

- **Tratti di personalità 5e** (⭐⭐, S) — ideali, legami, difetti + tratto caratteriale, mostrati
  con stile sulla scheda. Aggancio: aggiungere campi a `identity` (già c'è `pillar`).
- **Ispirazione** (⭐⭐, S) — gettone che il DM assegna e la giocatrice spende per il vantaggio, con
  un piccolo effetto visivo. Meccanica ufficiale, molto "da tavolo".
- **Riposo breve / lungo** (⭐⭐, M) — pulsanti che ripristinano PF, slot, dadi vita e cariche degli
  oggetti con un breve "rituale" visivo. Aggancio: `spendHitDie`, slot incantesimo, `charges`.
- **Inventario con carte oggetto** (⭐, M) — oltre agli oggetti magici, un inventario con peso/ingombro
  e carte; estende `equipment`.

## 📺 Modalità "Tavolo" (schermo condiviso)

- **Vista plancia** (⭐⭐⭐, M) — una route in sola lettura (es. `/tavolo/[dmToken]`) pensata per un
  secondo schermo/TV nella stanza: nome e arte della scena, ordine di iniziativa con turno corrente,
  ultima narrazione e ultimo tiro importante. Riusa `useCampaignState` + gli eventi.
  Nel repo di riferimento (`claude-dnd-skill/design-mockups`) ci sono già bozze di TV display da cui
  attingere per lo stile.

## ♿ Rifiniture che aiutano l'immersione

- **Wake-lock** (⭐, S) — impedisce al telefono di spegnere lo schermo durante il gioco
  (`navigator.wakeLock`).
- **Modalità "leggi ad alta voce"** (⭐, S) — testo più grande e ad alto contrasto per le carte di
  narrazione mostrate al tavolo.
- **Micro-transizioni coerenti** (⭐, S) — comparsa morbida di carte ed eventi; poco, ma dà "peso"
  alle azioni. Sempre nel rispetto di `prefers-reduced-motion`.

---

## Come procederei (proposta di sequenza)

1. **Audio per terreno + effetti sugli eventi** — massima resa, si aggancia a sistemi esistenti.
2. **Carte di narrazione + dialoghi PNG** — dà voce alla storia (nuovo `kind: 'scene'` negli eventi).
3. **Modalità Tavolo** — trasforma la stanza in un tavolo da gioco vero.
4. **Animazione dadi + fioriture dei critici + haptics** — rende ogni tiro un momento.
5. **Ritratto + tratti + Ispirazione + riposi** — attaccamento al personaggio e ritmo di gioco.
6. (più avanti) **Griglia tattica** come progetto dedicato.

## Note tecniche

- Tutto quanto sopra è realizzabile **in locale**, senza servizi esterni e senza toccare il vincolo
  di "nessun deploy finché non richiesto".
- La maggior parte non richiede migrazioni DB: nuovi tipi di evento e campi possono vivere nel JSONB
  del foglio o nella tabella `events` esistente.
- Mantenere il contenuto entro l'**SRD 5.1** e riscrivere sempre i testi in italiano, come già fatto
  per classi, sottoclassi e incantesimi.
