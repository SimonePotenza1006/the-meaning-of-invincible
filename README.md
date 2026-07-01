# dnd-web — Creazione personaggio D&D 5e

App web (Next.js 16) per giocare una campagna di D&D 5e in due: il master gestisce
tutto da PC, il giocatore crea il personaggio da mobile con un wizard guidato e poi
usa la propria scheda. Regole basate sul **SRD 5.1 (2014)**.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** — palette del progetto come token in `src/app/globals.css`
- **Drizzle ORM** + Postgres — driver duale: `node-postgres` in locale, `neon-http` su Neon in produzione (scelto in base all'host in `src/db/index.ts`)
- **Zod** — validazione della scheda personaggio
- **react-icons** (set Game-Icons) per le icone di razze/classi

## Requisiti

- Node 20+ e npm
- Docker (solo per il DB di sviluppo locale)

## Sviluppo locale

1. **Avvia Postgres in Docker:**

   ```bash
   docker run --name dnd-postgres \
     -e POSTGRES_USER=dnd -e POSTGRES_PASSWORD=dnd -e POSTGRES_DB=dnd \
     -p 5432:5432 -d postgres:16
   ```

   `.env.local` è già impostato su questo container:
   `DATABASE_URL=postgresql://dnd:dnd@localhost:5432/dnd`

2. **Applica le migrazioni:**

   ```bash
   npm run db:migrate
   ```

3. **Avvia l'app:**

   ```bash
   npm run dev
   ```

   Apri http://localhost:3000 (o la porta indicata a console).
   Il wizard di creazione è su `/crea`.

## Comandi database (Drizzle)

| Comando              | Cosa fa                                                    |
| -------------------- | ---------------------------------------------------------- |
| `npm run db:generate`| Genera una migrazione SQL dallo schema (`src/db/schema.ts`)|
| `npm run db:migrate` | Applica le migrazioni al database                          |
| `npm run db:push`    | Sincronizza lo schema col DB senza migrazioni (rapido)     |
| `npm run db:studio`  | Apre Drizzle Studio per ispezionare i dati                 |

## Struttura

```
src/
├── app/
│   ├── crea/          # wizard di creazione personaggio (client)
│   ├── api/health/    # smoke-test connessione DB
│   ├── layout.tsx     # lang=it, font, metadata
│   ├── globals.css    # palette (token Tailwind) + stili base
│   └── page.tsx       # landing
├── db/                # schema Drizzle + client (driver duale)
└── lib/
    ├── rules/         # motore regole 5e (portato dalla skill claude-dnd-skill)
    ├── dnd/           # dati SRD 5.1 (razze, classi, background), etichette IT, icone
    ├── character/     # buildSheet(): assembla la scheda dal wizard
    ├── sheet.ts       # schema Zod della scheda personaggio
    └── fonts.ts       # Roboto + font display
```

## Note

- **Font display:** il brief chiedeva "Montenegrin Gothic One", non disponibile su
  Google Fonts. È in uso **Dela Gothic One** (la più vicina); per usare il font reale
  basta sostituire `displayFont` in `src/lib/fonts.ts` con `next/font/local`.
- **Deploy:** non ancora effettuato. In produzione, imposta `DATABASE_URL` sulla
  stringa di Neon (l'app passerà automaticamente al driver `neon-http`).
