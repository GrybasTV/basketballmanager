# Basketball Manager - Techninė Nuoroda

Greitas reference'as kūrėjui.

---

## Komandos

```bash
# Development
npm run dev              # Paleisti dev serverį (http://localhost:3000)
npm run build            # Build produkcijai
npm start                # Paleisti produkciją

# Database
npm run db:seed          # Sugeneruoti pasaulį (nauja DB)
npm run db:studio        # Atidaryti Prisma Studio
npx prisma migrate dev   # Sukurti migraciją
npx prisma generate      # Regeneruoti Prisma Client
```

---

## Projekto Struktūra

```
src/
├── app/
│   ├── api/              # API Routes
│   ├── teams/[id]/      # Team page
│   ├── standings/        # Standings page
│   ├── matches/          # Matches page
│   ├── page.tsx          # Home
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Tailwind
└── lib/
    └── matchEngine.ts    # Match simulation logic

prisma/
├── schema.prisma         # DB schema
└── seed.ts              # World generator
```

---

## API Endpoints

```
GET  /api/teams                    # Visos komandos
GET  /api/teams/:id                # Komanda pagal ID
GET  /api/players                  # Visi žaidėjai
GET  /api/players/:id              # Žaidėjas pagal ID
GET  /api/matches                  # Visos rungtynės
GET  /api/matches/:id              # Rungtynės pagal ID
POST /api/matches/:id/simulate     # Simuliuoti rungtynes
GET  /api/leagues                  # Visos lygos
GET  /api/leagues/:id/standings    # Turnyrinė lentelė
```

---

## Duomenų Bazė

### Pagrindinės lentelės

| Lentelė | Kiekis (MVP) |
|---------|--------------|
| Country | 1 |
| League  | 1 |
| Team    | 12 |
| Player  | 180 |
| Coach   | 12 |
| Agent   | 8 |
| Match   | 132 |

### Ryšiai

```
Team.hasMany(Players)
Team.hasMany(Contracts)
Team.hasOne(Coach)
Team.belongsTo(League)

Player.hasMany(Contracts)
Player.hasMany(MatchPlayerStats)

Match.hasMany(MatchPlayerStats)
```

---

## Match Engine

`src/lib/matchEngine.ts`

```typescript
// Simuliuoti rungtynes
const result = simulateMatch({
  homeTeam: teamWithPlayers,
  awayTeam: teamWithPlayers,
  season: 1,
});

// Išsaugoti į DB
await simulateAndSaveMatch(matchId);
```

### Algoritmas

1. Calculate team strength (offensive, defensive, pace, bench)
2. Calculate possessions (base 90 + pace modifier)
3. Simulate each possession → points
4. Generate player stats (minutes, points, rebounds, etc.)
5. Save to DB

---

## Stiliai (Tailwind)

```tsx
<div className="bg-slate-900 text-white p-4 rounded-lg">
  {/* Content */}
</div>
```

### Spalvų schema

- Background: `slate-900`
- Card: `slate-800`
- Border: `slate-700`
- Primary: `blue-500/600`
- Text: `white` / `slate-300/400`
- Success: `green-400`
- Error: `red-400`

---

## Player Attributes

| Kategorija | Atributai |
|-----------|-----------|
| **Puolimas** | closeRange, midRange, threePoint, freeThrow, ballHandling, passing, offensiveReb |
| **Gynyba** | perimeterDef, interiorDef, steal, block, defensiveReb |
| **Fizika** | speed, strength, vertical, stamina, injuryProne |
| **Mentalas** | basketballIQ, clutch |

### OVR Skaičiavimas

Svertinis vidurkis pagal poziciją:

- **PG**: passing(20%), ballHandling(15%), perimeterDef(15%), threePoint(15%)...
- **SG**: threePoint(20%), speed(15%), perimeterDef(15%)...
- **SF**: balanced scoring + defense
- **PF**: interiorDef(20%), defensiveReb(15%), strength(15%)...
- **C**: interiorDef(25%), defensiveReb(25%), block(15%)...

---

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

---

## Troubleshooting

### Prisma error: "table does not exist"
```bash
npx prisma migrate dev
```

### Seed not working
```bash
# Delete DB and re-seed
rm prisma/dev.db
npm run db:seed
```

### Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Git Ignore

```
.env
node_modules/
.next/
prisma/dev.db
prisma/dev.db-journal
```

---

## Versijos

- Next.js: 16.1.6
- Prisma: 6.19.2
- Node: 22+
- TypeScript: 5.x
