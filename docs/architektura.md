# Sistemos Architektūra ir Moduliarumas (Puzzle Design)

Šis dokumentas apibrėžia techninę realizaciją.

## 2. Technologijų Rinkinys (Cloudflare Stack)

*   **Framework:** Next.js (naudojant `@cloudflare/next-on-pages`).
*   **Database:** Cloudflare D1 (Serverless SQL/SQLite).
*   **Talpinimas:** Cloudflare Pages (Edge Runtime).
*   **Logic:** Edge Functions užtikrina minimalią delsą visame pasaulyje.
*   **Styling:** Modernus dizainas naudojant CSS modulius arba Tailwind (Rich Aesthetics).

## 3. Modulių Žemėlapis (Puzlės dalys)

## 2. Projekto Struktūra

```
basketballprojekt/
├── prisma/
│   ├── schema.prisma       # Duomenų bazės schema (14 lentelių)
│   ├── seed.ts             # Pasaulio generatorius
│   └── migrations/         # DB migracijos
├── src/
│   ├── app/
│   │   ├── api/            # API Routes
│   │   │   ├── teams/      # Komandų endpoints
│   │   │   ├── players/    # Žaidėjų endpoints
│   │   │   ├── matches/    # Rungtynių endpoints
│   │   │   └── leagues/    # Lygų endpoints
│   │   ├── teams/[id]/     # Komandos puslapis
│   │   ├── standings/      # Turnyrinė lentelė
│   │   └── matches/        # Rungtynių puslapis
│   └── lib/
│       └── matchEngine.ts  # Rungtynių simuliacijos variklis
├── docs/                   # Dokumentacija
└── package.json
```

## 3. Duomenų Bazės Schema

### Pagrindinės Lentelės (14)

```
User          - Vartotojai
Country       - Šalys
League        - Lygos
Team          - Komandos
Player        - Žaidėjai
Contract      - Sutartys
Agent         - Agentai
Offer         - Derybų pasiūlymai
Match         - Rungtynės
MatchPlayerStats - Rungtynių statistika
PlayerStats   - Sezoninė statistika
PlayoffSeries - Play-off serijos
Coach         - Treneriai
SeasonState   - Sezono būsena
Notification  - Pranešimai
```

### Ryšiai (Relations)

```
Country 1──N Teams
Country 1──N Players
League  1──N Teams
Team    1──N Players
Team    1──N Contracts
Team    1──1 Coach
Player  1──N Contracts
Match   N──1 League (home/away)
```

## 4. API Routes

| Endpoint | Method | Aprašymas |
|----------|--------|-----------|
| `/api/teams` | GET | Visos komandos su žaidėjais |
| `/api/teams/[id]` | GET | Komandos detalės |
| `/api/players` | GET | Visi žaidėjai (su filtrais) |
| `/api/players/[id]` | GET | Žaidėjo detalės |
| `/api/matches` | GET | Visos rungtynės |
| `/api/matches/[id]` | GET | Rungtynių detalės |
| `/api/matches/[id]/simulate` | POST | Simuliuoti rungtynes |
| `/api/leagues` | GET | Visos lygos |
| `/api/leagues/[id]/standings` | GET | Turnyrinė lentelė |

## 5. Match Engine

`src/lib/matchEngine.ts` - Rungtynių simuliacijos variklis.

### Algoritmas:

1. **Komandos stiprumo vertinimas**
   - Offensive Rating: threePoint + midRange + closeRange + ballHandling
   - Defensive Rating: perimeterDef + interiorDef + steal + block + defensiveReb
   - Pace Rating: speed + stamina
   - Bench Rating: atsarginių vidutinis OVR

2. **Possessions skaičiavimas**
   - Base: 90 possession
   - Pace modifier: +/-15 priklausomai nuo tempo
   - Home/Away pasiskirstymas

3. **Taškų skaičiavimas**
   - Kiekvienos possession bazinis šansas = offensiveEff / 100
   - 2 vs 3 taškai pagal threePoint %
   - Baudos metimai už pražangas (5% šansas)

4. **Žaidėjų statistika**
   - Minutes: pradinė penketa 25-35, bench 10-20
   - Points: pagal usage rate * minutes
   - Rebounds, assists, steals, blocks - pagal atitinkamus atributus

## 6. Pasaulio Generatorius (Seed)

`prisma/seed.ts` - Sukuria pradinį pasaulį.

### Generuojami duomenys:

| Objektas | Kiekis | Aprašymas |
|----------|--------|-----------|
| Šalys | 1 | Lietuva |
| Lygos | 1 | LKL |
| Komandos | 12 | LKL komandos |
| Žaidėjai | 180 | 15 per komandą |
| Treneriai | 12 | 1 per komandą |
| Agentai | 8 | Rinkos agentai |
| Rungtynės | 132 | 22 dienos × 6 rungtynių |

### Žaidėjo generavimas:

1. **Pozicijų pasiskirstymas**: 2 PG, 3 SG, 3 SF, 3 PF, 4 C
2. **Atributai**: pagal `docs/atributai.md` soft caps
3. **OVR skaičiavimas**: svertinis vidurkis pagal poziciją
4. **Potencialas**: OVR + random(5, 20) + amžiaus bonus

## 7. Frontend (Next.js App Router)

### Puslapiai:

| Route | Komponentas |
|-------|-------------|
| `/` | Home - lygos apžvalga |
| `/teams` | Komandų sąrašas |
| `/teams/[id]` | Komandos sudėtis |
| `/standings` | Turnyrinė lentelė |
| `/matches` | Rungtynių sąrašas + simuliacija |

### Stiliai:

- Tailwind CSS utilities
- Spalvų schema: slate-900 (bg), blue-500-600 (accents)
- Responsive: grid sistema

## 8. Commandai

```bash
# Dev serveris
npm run dev

# Build
npm run build

# Prisma migracija
npx prisma migrate dev

# DB seed (generuoti pasaulį)
npm run db:seed

# Prisma Studio (DB viewer)
npm run db:studio
```

## 9. Event Bus (Planuojamas)

Šiuo metu sistema naudoja tiesioginį API kvietimą. Ateityje:
- `MATCH_FINISHED` event'as → atnaujinti lentelę
- `PLAYER_INJURED` → pranešimas vartotojui
- `CONTRACT_SIGNED` → ekonomikos atnaujinimas

---

**Statusas:** MVP implementuotas, testuojamas.
