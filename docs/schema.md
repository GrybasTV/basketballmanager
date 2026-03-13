# Duomenų Bazės Schema (Implementation Status)

Šis dokumentas apibrėžia visų žaidimo sistemų ryšius. Naudojamas **Prisma + SQLite**.

## Statusas: ✅ SUKURTA

Visos 14 lentelių sukurtos ir veikia.

---

## 1. Pagrindinės Lentelės (Core Infrastructure)

### Users
```prisma
id              String   @id @default(cuid())
username        String   @unique
email           String   @unique
passwordHash    String
lastLoginAt     DateTime?
vacationModeEnd DateTime?
```

### Teams
```prisma
id               String   @id @default(cuid())
name             String
city             String
countryId        String
prestige         Int      @default(50)      // 0-99
wageBudget       Int      @default(100000)
transferBudget   Int      @default(500000)
isAiControlled   Boolean  @default(false)
localLeagueId    String
europeanLeagueId String?
userId           String?  @unique
```

### Leagues
```prisma
id          String   @id @default(cuid())
name        String
type        String   // LOCAL_I, LOCAL_II, EUROPEAN
tier        Int      // 1-50
countryId   String?
```

### Countries
```prisma
id        String   @id @default(cuid())
name      String
code      String   @unique  // LT, US, FR
```

---

## 2. Žaidėjai ir Sutartys

### Players
```prisma
id              String   @id @default(cuid())
teamId          String
firstName       String
lastName        String
age             Int
birthCountryId  String
position        String   // PG, SG, SF, PF, C
height          Int      // cm (160-230)
weight          Int      // kg (70-150)

// Reitingai
ovr             Int      @default(50)  // 0-99
pot             Int      @default(60)  // Potential (hidden)
loyalty         Int      @default(50)
morale          Int      @default(70)
rhythm          Int      @default(70)

// Puolimo įgūdžiai (0-99)
closeRange      Int      @default(50)
midRange        Int      @default(50)
threePoint      Int      @default(50)
freeThrow       Int      @default(50)
ballHandling    Int      @default(50)
passing         Int      @default(50)
offensiveReb    Int      @default(50)

// Gynybos įgūdžiai (0-99)
perimeterDef    Int      @default(50)
interiorDef     Int      @default(50)
steal           Int      @default(50)
block           Int      @default(50)
defensiveReb    Int      @default(50)

// Fiziniai atributai (0-99)
speed           Int      @default(50)
strength        Int      @default(50)
vertical        Int      @default(50)
stamina         Int      @default(70)
injuryProne     Int      @default(30)

// Mentalitetas (0-99)
basketballIQ    Int      @default(50)
clutch          Int      @default(50)

// Dinaminiai rodikliai
injuryStatus    String   @default("HEALTHY")
fatigueSeason   Int      @default(0)
form            Int      @default(70)
```

### Contracts
```prisma
id               String   @id @default(cuid())
playerId         String
teamId           String
weeklyWage       Int
expiresAtSeason  Int      // Sezono numeris
effectiveAtSeason Int
releaseClause    Int?
isLoan           Boolean  @default(false)
loanMinGuarantee Int?
isRenewable      Boolean  @default(true)
```

### Offers (Derybų Rinka)
```prisma
id             String   @id @default(cuid())
playerId       String
teamId         String
agentId        String
wageOffered    Int
roleOffered    String   // STAR, STARTER, BENCH, PROSPECT
minutesOffered Int
offerCategory  String   // CURRENT_SEASON, NEXT_SEASON
status         String   @default("PENDING")
```

### Agents
```prisma
id          String   @id @default(cuid())
name        String
greed       Int      @default(50)    // 0-99
reputation  Int      @default(50)
negotiation Int      @default(50)
```

---

## 3. Simuliacija ir Rezultatai

### Matches
```prisma
id          String   @id @default(cuid())
leagueId    String
homeTeamId  String
awayTeamId  String
homeScore   Int      @default(0)
awayScore   Int      @default(0)
isPlayed    Boolean  @default(false)
isPlayoff   Boolean  @default(false)
matchDay    Int      // 1-44
playedAt    DateTime?
```

### MatchPlayerStats
```prisma
id           String   @id @default(cuid())
matchId      String
playerId     String
minutes      Int      @default(0)
points       Int      @default(0)
rebounds     Int      @default(0)
assists      Int      @default(0)
steals       Int      @default(0)
blocks       Int      @default(0)
turnovers    Int      @default(0)
fgMade       Int      @default(0)
fgAttempted  Int      @default(0)
threePtMade  Int      @default(0)
threePtAtt   Int      @default(0)
ftMade       Int      @default(0)
ftAttempted  Int      @default(0)
```

### PlayerStats (Sezoninė)
```prisma
id             String   @id @default(cuid())
playerId       String
season         Int
gamesPlayed    Int      @default(0)
points         Float    @default(0)
rebounds       Float    @default(0)
assists        Float    @default(0)
fgPercent      Float?
threePtPercent Float?
```

### PlayoffSeries
```prisma
id           String   @id @default(cuid())
leagueId     String
team1Id      String
team2Id      String
team1Wins    Int      @default(0)
team2Wins    Int      @default(0)
bestOf       Int      @default(3)
winnerTeamId String?
```

---

## 4. Personalas

### Coaches
```prisma
id          String   @id @default(cuid())
teamId      String
name        String
rotation    Int      @default(50)  // 0-99
tactics     Int      @default(50)
development Int      @default(50)
motivation  Int      @default(50)
salary      Int      @default(5000)
```

---

## 5. Sezono Būsena

### SeasonState
```prisma
id        String   @id @default(cuid())
season    Int      @default(1)
matchDay  Int      @default(1)  // 1-44
phase     String   @default("REGULAR_SEASON")
```

---

## 6. Pranešimai

### Notifications
```prisma
id        String   @id @default(cuid())
userId    String
type      String   // INJURY, OFFER_REJECTED, MATCH_START
content   String
isRead    Boolean  @default(false)
```

---

## Ryšių Schema (ER Diagram)

```
Country ───< Teams ───< League
   │           │
   │           └──< Players ───< Contracts
   │                      │
   └──< BirthCountries    └──< MatchPlayerStats ───< Matches ───< League
        │                                          │
        └──< Agents ───< Offers ───────────────────┘
```

---

## Duomenų Išdėstymas (MVP)

- **Šalys**: 1 (Lietuva)
- **Lygos**: 1 (LKL)
- **Komandos**: 12
- **Žaidėjai**: 180 (15/komanda)
- **Treneriai**: 12
- **Agentai**: 8
- **Rungtynės**: 132 (22 dienos × 6 rungtynių)

---

**Seed scriptas**: `npm run db:seed`
**DB viewer**: `npm run db:studio` (Prisma Studio)
