import { recordWildMagic } from '@/app/game-actions';

/**
 * "The Wilder" Wild Magic Table — 100 effetti senza conseguenze permanenti,
 * pensati per il gioco e il ruolo più che per lo squilibrio meccanico.
 *
 * Tabella homebrew di r/DnDHomebrew ("The Wilder Wild Magic Table",
 * tradotta dal russo dall'autore originale). Qui riadattata in italiano per la
 * campagna. Gli effetti scalano col numero: più alto il tiro, più forte l'effetto.
 *
 * Uso in campagna: la stregona della Magia Selvaggia tira ogni volta che lancia
 * un incantesimo di 1° livello o superiore (i trucchetti non innescano la scarica).
 * Il DM può tirare per conto proprio dagli Strumenti.
 */
export const WILD_MAGIC_TABLE: readonly string[] = [
  // 01
  'Un’aura di Magia Selvaggia di 9 m ti circonda per 1 minuto; le creature che lanciano incantesimi di 1° livello o più al suo interno devono tirare un d20 (su 1, un’altra scarica).',
  // 02
  'Un uccellino ti consegna una busta con una lettera di un ammiratore e una tavoletta di cioccolato.',
  // 03
  'Per 1 ora starnutisci ogni volta che qualcuno pensa a te.',
  // 04
  'Forte sensazione di essere osservata per 24 ore; +1d4 alla Percezione passiva.',
  // 05
  'Sul capo ti compare un cappello alla moda che lascia una scia scintillante.',
  // 06
  'Compare un pasticcino con una candela accesa e un biglietto: “Esprimi un desiderio”.',
  // 07
  'Una nuvoletta ti pioviggina sulla testa e ti segue per 1d6 ore.',
  // 08
  'Compare una tavola imbandita (1,5 × 9 m) coi tuoi cibi preferiti.',
  // 09
  'Diventi protagonista del prossimo libro che leggi.',
  // 10
  'Per 1 ora, i piccoli oggetti infiammabili che fissi per più di 1 round prendono fuoco.',
  // 11
  'Fanfara e un araldo illusorio annunciano il tuo arrivo come “signore/a” per 24 ore.',
  // 12
  'Compare una statuetta di piombo di te stessa, che pesa quanto te malgrado le dimensioni.',
  // 13
  'Tutte le porte e le finestre entro 36 m si spalancano e sbattono.',
  // 14
  'Per 1 ora puoi aprire serrature semplici concentrandoti telepaticamente per 1 minuto.',
  // 15
  'Il terreno entro 18 m si ricopre di gusci d’uovo.',
  // 16
  'Per 1 ora non puoi mentire né tacere informazioni.',
  // 17
  'Lanci Linguaggi su te stessa.',
  // 18
  'Per 24 ore ti metti a ballare involontariamente ogni volta che stai ferma.',
  // 19
  'Per 24 ore, gli specchi non magici in cui ti guardi vanno in frantumi.',
  // 20
  'Lanci Servitore Invisibile.',
  // 21
  'Compare un uovo; si schiude in gallina; se la gallina viene sconfitta torna uovo.',
  // 22
  'Compare una minuscola fata che dice cattiverie su di te; intangibile; sparisce dopo 10 minuti.',
  // 23
  'La prossima creatura che ti tocca o colpisce subisce 1d6 danni da fulmine.',
  // 24
  'Per 24 ore non proietti ombra e sei invisibile nei riflessi.',
  // 25
  'Per 1 ora gli oggetti ti scivolano di mano quando li raccogli.',
  // 26
  'Per 1 minuto puoi Disimpegnarti come azione bonus.',
  // 27
  'Per 1 ora gli oggetti ti sussurrano di rimando tutto ciò che dici.',
  // 28
  'Per 1 minuto la tua voce rimbomba come tuono; le creature entro 4,5 m fanno TS su Costituzione CD 13 o subiscono 1d6 danni da tuono.',
  // 29
  'Una dolce vecchietta compare, ti bacia la fronte e sparisce; recuperi 1 PF.',
  // 30
  'Per 24 ore ti esce vapore dalle orecchie quando ti arrabbi.',
  // 31
  'Un petardo festivo esplode al tuo orecchio; sei assordata per 1 round.',
  // 32
  'Lanci Dardo Incantato di Jim a un livello determinato da 1d4.',
  // 33
  'Le fonti di fuoco entro 18 m avvampano; le creature entro 1,5 m subiscono 1d4 danni da fuoco.',
  // 34
  'Nel raggio di 1d10 km compaiono manifesti col tuo volto e un soprannome offensivo.',
  // 35
  'Per 1 ora percepisci le creature ostili entro 36 m.',
  // 36
  'Sei affascinata dalla prima creatura che ti parla, per 1d4 ore.',
  // 37
  'Per 1 minuto tutte le creature entro 18 m conoscono la tua posizione esatta.',
  // 38
  'Per 1 minuto, le creature che ti attaccano si teletrasportano a 4,5 m di distanza (in direzione casuale).',
  // 39
  'Per 1 ora sei in preda a un’ossessione a caso (fuoco, attaccare, raccogliere fiori…).',
  // 40
  'Per 1 minuto, mani spettrali escono dai muri entro 1,5 m e cercano di afferrarti.',
  // 41
  'Per 1 minuto superi automaticamente i TS su Costituzione.',
  // 42
  'Sotto i tuoi piedi cresce un roseto di 6 m di diametro; terreno difficile; gli steli spinati infliggono 1d6 danni perforanti a chi ti attacca in mischia.',
  // 43
  'Ti teletrasporti da un tuo parente a caso per 1d4 round.',
  // 44
  'Emani un bagliore intenso per 1d4 ore; le creature entro 18 m ti notano.',
  // 45
  'Profumo di lavanda; per 1 minuto le creature entro 4,5 m che scendono a 0 PF si stabilizzano automaticamente.',
  // 46
  'Tutte le creature con cui hai interagito nelle ultime 24 ore hanno il falso ricordo di aver preso il tè con te.',
  // 47
  'Perdi 1d4 punti Intelligenza fino alla prossima alba.',
  // 48
  'Lanci Cura Ferite su te stessa a un livello determinato da 1d4.',
  // 49
  'Attiri i piccoli animali; per 24 ore hai vantaggio alle prove di Addestrare Animali.',
  // 50
  'Il tuo focus arcano diventa una patata per 1d4 round (o diventi tu una patata, se non ne hai uno).',
  // 51
  'Il tuo prossimo attacco a segno è automaticamente un colpo critico.',
  // 52
  'In ogni soglia entro 36 m compare una pecora.',
  // 53
  'Per 1 round, le creature entro 9 m cercano di avvicinarsi il più possibile a te.',
  // 54
  'Per 1 ora non hai più bisogno di respirare.',
  // 55
  'Per 1 ora leggi la mente delle creature entro 9 m; ma loro leggono la tua.',
  // 56
  'Attorno a te si materializza una gabbia chiusa di un metallo casuale.',
  // 57
  'Il prossimo mercante, affascinato dai tuoi modi, ti fa uno sconto.',
  // 58
  'Per 1 minuto, i cadaveri umanoidi Medi/Piccoli entro 18 m si alzano come zombi o scheletri passivi; si sbriciolano quando uccisi.',
  // 59
  'Gli oggetti magici ti riempiono la mente di segreti proibiti; TS su Intelligenza (CD pari alla tua CD dei TS) o 1d6 danni psichici per ogni oggetto.',
  // 60
  'Per 1 minuto, le creature entro 9 m diventano vulnerabili a un tipo di danno (d6: 1 acido, 2 freddo, 3 fuoco, 4 forza, 5 fulmine, 6 veleno).',
  // 61
  'Le creature con una corda entro 18 m fanno TS su Destrezza CD 15 o la corda le impiglia.',
  // 62
  'Lanci Fuoco Fatato centrato su di te.',
  // 63
  'La tua pelle si fa dura come pietra: resistenza a tutti i danni per 1 minuto; l’effetto finisce se ti muovi.',
  // 64
  'Lanci Forza Fantasma su tutte le creature entro 9 m (stessa illusione per tutte; la sceglie il DM).',
  // 65
  'La tua borsa esplode; le monete volano in un raggio di 9 m; TS su Destrezza CD 13 o 1d6 danni ogni 100 monete (max 8d6). Con meno di 100 monete: 2d10 in oro e un biglietto da visita.',
  // 66
  'Uno scudo spettrale ti fluttua accanto: +2 alla CA e immunità a Dardo Incantato per 1 minuto.',
  // 67
  'Lanci Disegno Ipnotico centrato su di te.',
  // 68
  'Lanci Metamorfosi su te stessa; se fallisci il tiro, ti trasformi in pecora.',
  // 69
  'Per 1d4 round, tutte le creature e gli oggetti entro 18 m levitano.',
  // 70
  'Sotto i tuoi piedi cresce un albero alto 1d10 piedi con 1d4 frutti scintillanti: se mangiati, scatenano una scarica di magia selvaggia.',
  // 71
  'Tutti i dolci e le paste nel raggio di 1,5 km si teletrasportano da te.',
  // 72
  'Recuperi lo slot incantesimo usato per innescare la scarica.',
  // 73
  'Controlli la scarica: tira tre volte (ritira se esce ancora questo) e scegli tu quale risultato applicare.',
  // 74
  'Per 1d4 round, le creature non volanti ottengono velocità di volo di 9 m; quelle già volanti la perdono.',
  // 75
  'Nel raggio di 16 km il clima cambia (d6: 1 caldo torrido, 2 tormenta, 3 temporale, 4 vento intenso, 5 nebbia fitta, 6 eclissi solare); ci mette 1 ora a manifestarsi del tutto e dura 24 ore.',
  // 76
  'Tutta l’acqua liquida entro 36 m evapora all’istante.',
  // 77
  'Sul collo ti compare un tatuaggio di quadrifoglio; tira 2d20 e, per 24 ore, puoi usare uno dei due risultati al posto di un tiro di d20 (ciascuno una sola volta).',
  // 78
  'Nel prossimo riposo breve entro 24 ore puoi spendere dadi vita per ottenere Punti Stregoneria invece di recuperare PF.',
  // 79
  'Lanci Legame Telepatico di Rary sulle 8 creature più vicine a portata, senza bisogno del loro consenso.',
  // 80
  'Se provi a dormire entro 24 ore, una minuscola creatura d’ombra ti tiene sveglia; sparisce al risveglio.',
  // 81
  'Ogni tuo tiro di magia selvaggia che non produce una scarica aumenta di 1 la difficoltà del prossimo; una scarica azzera il conto.',
  // 82
  'Per 1 minuto, i muri spessi meno di 1,5 m entro 36 m diventano translucidi e intangibili; le creature al loro interno subiscono 1d12 danni quando l’effetto termina.',
  // 83
  'Il danno del tuo prossimo attacco a segno è il massimo dei dadi.',
  // 84
  'Recuperi 1d6 slot incantesimo spesi (a partire dai più bassi).',
  // 85
  'Lanci Arma Spirituale: appare come una statua di ghisa di tua madre che ti sculaccia.',
  // 86
  'Per 1 minuto, se scendi a 0 PF fai TS su Costituzione CD 15 o non svieni e recuperi 1 PF; la CD aumenta di 2 a ogni successo.',
  // 87
  'Urlo involontario; le creature entro 9 m fanno TS su Costituzione (CD pari alla tua CD dei TS): le non volanti cadono proni, le volanti precipitano.',
  // 88
  'Compare un coboldo gentile e colto in cilindro e monocolo; puoi affidargli compiti semplici (azione bonus) o fargli mantenere la concentrazione su un incantesimo per te; rifiuta le azioni dannose; sparisce dopo 10 minuti con un biglietto di scuse.',
  // 89
  'Passi su un altro piano (d4: 1 Astrale, 2 Reame Fatato, 3 Etereo, 4 Reame delle Ombre) fino alla fine del tuo prossimo turno.',
  // 90
  'Per 1 minuto, quando attacchi tiri un d20 aggiuntivo; se esce un 1, si crea uno scudo che riflette l’attacco al mittente.',
  // 91
  'Per 1d4 round la tua taglia cambia (d6: 1 Minuscola, 2 Piccola, 3 Media, 4 Grande, 5 Enorme, 6 Mastodontica); se lo spazio non basta, ti espandi al massimo possibile.',
  // 92
  'TS su Intelligenza CD 15 o perdi la sintonia con tutti i tuoi oggetti magici.',
  // 93
  'Per 1 ora gli oggetti magici entro 72 m diventano instabili e luminosi; per attivarli serve un tiro di magia selvaggia.',
  // 94
  'Per 1 minuto, Controincantesimi automaticamente qualsiasi incantesimo di 1° livello o più lanciato entro 9 m.',
  // 95
  'Per 1d4 giorni ti risvegli in un luogo casuale entro 1,5 km.',
  // 96
  'Lanci Campo Antimagia centrato su di te; il campo resta nel punto d’origine; dura 1d6 round.',
  // 97
  'Il tuo prossimo incantesimo è lanciato a un livello più alto dello slot usato; i trucchetti non ne sono influenzati.',
  // 98
  'Ottieni subito un’azione aggiuntiva.',
  // 99
  'Ti trasformi in un cucciolo di drago rosso per 1 round; niente privilegi di classe né accesso all’equipaggiamento.',
  // 100
  'All’inizio di ogni tuo turno per 1 minuto tiri sulla tabella (ignorando questo risultato ai tiri successivi).',
];

export interface WildMagicResult {
  /** The d100 roll (1–100). */
  roll: number;
  /** The corresponding effect text. */
  effect: string;
}

/** Payload for the local surge dialog (see components/WildMagicDialog.tsx). */
export interface WildMagicFx extends WildMagicResult {
  /** What triggered the surge, e.g. "Lancio di Palla di Fuoco" or "Tiro del Master". */
  source?: string;
}

/** Roll a d100 on the Wilder table and return the effect. */
export function rollWildMagic(): WildMagicResult {
  const roll = Math.floor(Math.random() * 100) + 1;
  return { roll, effect: WILD_MAGIC_TABLE[roll - 1] };
}

/** Fire a browser event so the roller's screen shows the surge dialog locally
 * (mirrors emitRollFx in lib/game/roll.ts). */
function emitWildMagicFx(fx: WildMagicFx) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<WildMagicFx>('dnd:wildmagic', { detail: fx }));
  }
}

/**
 * Trigger a wild magic surge: roll on the table, pop the local dialog on the
 * roller's screen, and record it to the shared log so the other side sees it.
 * `secret` (DM only) keeps the result out of the player's log.
 */
export async function castWildMagic(
  token: string,
  opts?: { source?: string; secret?: boolean },
) {
  const { roll, effect } = rollWildMagic();
  emitWildMagicFx({ roll, effect, source: opts?.source });
  await recordWildMagic(token, { roll, effect, source: opts?.source, secret: opts?.secret });
  return { roll, effect };
}
