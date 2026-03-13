# Basketball Manager - MVP Įgyvendinimo Planas

## Statusas: ✅ MVP UŽBAIGTA

Visos pagrindinės funkcijos sukurta ir veikia.

---

## Atlikti Darbai

### ✅ 1 Faza: Duomenų Bazė ir Schema

- [x] Prisma + SQLite setup
- [x] 14 lentelių schema sukurta
- [x] Migracijos sukuriamos automatiškai
- [x] Prisma Client generuojamas

**Failai:**
- `prisma/schema.prisma`
- `prisma/migrations/`

### ✅ 2 Faza: Pasaulio Generavimas

- [x] Seed scriptas (`prisma/seed.ts`)
- [x] 12 LKL komandų generavimas
- [x] 180 žaidėjų su atributais
- [x] 12 trenerių
- [x] 8 agentai
- [x] 132 rungtynių tvarkaraštis

**Komanda:** `npm run db:seed`

### ✅ 3 Faza: API Routes

- [x] `GET /api/teams` - visos komandos
- [x] `GET /api/teams/[id]` - komandos detalės
- [x] `GET /api/players` - visi žaidėjai (su filtrais)
- [x] `GET /api/players/[id]` - žaidėjo detalės
- [x] `GET /api/matches` - visos rungtynės
- [x] `GET /api/matches/[id]` - rungtynių detalės
- [x] `POST /api/matches/[id]/simulate` - simuliuoti rungtynes
- [x] `GET /api/leagues` - visos lygos
- [x] `GET /api/leagues/[id]/standings` - turnyrinė lentelė

**Failai:**
- `src/app/api/teams/route.ts`
- `src/app/api/teams/[id]/route.ts`
- `src/app/api/players/route.ts`
- `src/app/api/players/[id]/route.ts`
- `src/app/api/matches/route.ts`
- `src/app/api/matches/[id]/route.ts`
- `src/app/api/matches/[id]/simulate/route.ts`
- `src/app/api/leagues/route.ts`
- `src/app/api/leagues/[id]/standings/route.ts`

### ✅ 4 Faza: Match Engine

- [x] Komandos stiprumo vertinimas
- [x] Possessions skaičiavimas
- [x] Taškų simuliacija
- [x] Žaidėjų statistikos generavimas
- [x] Play-by-play (sutrumpinta)
- [x] DB išsaugojimas

**Failai:**
- `src/lib/matchEngine.ts`

### ✅ 5 Faza: UI Dashboard

- [x] Home page (`/`) - lygos apžvalga
- [x] Teams page (`/teams`) - komandų sąrašas
- [x] Team page (`/teams/[id]`) - komandos sudėtis
- [x] Standings page (`/standings`) - turnyrinė lentelė
- [x] Matches page (`/matches`) - rungtynių sąrašas ir simuliacija

**Failai:**
- `src/app/page.tsx`
- `src/app/teams/page.tsx`
- `src/app/teams/[id]/page.tsx`
- `src/app/standings/page.tsx`
-- `src/app/matches/page.tsx`

**Stiliai:** Tailwind CSS

---

## Technologijos

| Komponentas | Technologija |
|-------------|--------------|
| Framework | Next.js 16.1.6 |
| Runtime | TypeScript 5.x |
| Database | SQLite (Prisma 6.19.2) |
| Styling | Tailwind CSS |
| Deployment | Vercel (planuojama) |

---

## Darbo Eiga (Timeline)

1. **2026-03-13 17:00** - Pradėta: Prisma setup
2. **2026-03-13 17:30** - Baigta: Schema + Seed
3. **2026-03-13 18:00** - Baigta: API Routes
4. **2026-03-13 18:30** - Baigta: Match Engine
5. **2026-03-13 19:00** - Baigta: UI Dashboard
6. **2026-03-13 19:30** - MVP Ready ✅

---

## Testavimas

```bash
# 1. Paleisti dev serverį
npm run dev

# 2. Atidaryti http://localhost:3000

# 3. Testavimo scenarijai:
#    - Peržiūrėti komandas
#    - Simuliuoti rungtynes
#    - Patikrinti lentelę
#    - Peržiūrėti žaidėjų statistiką
```

---

## Sekanti Iteracija (Planuojama)

- [ ] Derybų sistema (negalioja laisvi agentai)
- [ ] Ekonomikos ciklas (pajamos/išlaidos)
- [ ] Treniruočių sistema
- [ ] Žaidėjo progresas (XP)
- [ ] Play-off sistema
- [ ] Sezono pabaiga (Midnight Flip)
- [ ] Vartotojo auth/login
- [ ] AI GM derybos
