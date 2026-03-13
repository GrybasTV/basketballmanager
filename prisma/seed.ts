// Basketball Manager - World Generator (Seed Script)
// Generates: 1 league, 12 teams, 180 players, 12 coaches, agents

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// DUOMENŲ ŠALTINIAI
// ============================================

const FIRST_NAMES_LT = [
  'Matas', 'Lukas', 'Nojus', 'Kajus', 'Domantas', 'Dovydas', 'Jonas', 'Markas',
  'Benas', 'Gabrielius', 'Emilis', 'Adomas', 'Martynas', 'Rokas', 'Tadas',
  'Vytenis', 'Danielius', 'Paulius', 'Arnas', 'Arūnas', 'Mantas', 'Karolis',
  'Edgaras', 'Laurynas', 'Rytis', 'Giedrius', 'Tomas', 'Žilvinas', 'Eimantas',
  'Donatas', 'Mindaugas', 'Sarunas', 'Ignas', 'Augustas', 'Kristupas'
];

const LAST_NAMES_LT = [
  'Petrauskas', 'Jankauskas', 'Stankevičius', 'Paulauskas', 'Žukauskas', 'Butkevičius',
  'Kazlauskas', 'Vasiliauskas', 'Kavaliauskas', 'Kairys', 'Navickas', 'Sakalauskas',
  'Katinauskas', 'Brazaitis', 'Urbonas', 'Narkūnas', 'Girdvainis', 'Lukošius',
  'Brazdeikis', 'Sabonis', 'Marčiulionis', 'Chomičius', 'Kurtinaitis', 'Jasaitis',
  'Jonusas', 'Gečys', 'Barevicius', 'Grigonis', 'Ulanovas', 'Dimša', 'Valinskas',
  'Milaknis', 'Sargūnas', 'Bendžius', 'Jokubaitis', 'Masiulis', 'Levavicius'
];

const TEAM_NAMES = [
  'Vilniaus "Rytas"', 'Kauno "Žalgiris"', 'Klaipėdos "Neptūnas"', 'Šiaulių "Šiauliai"',
  'Panevėžio "Lietkabelis"', 'Jonavos "Jonava"', 'Prienų "Prienai"',
  'Utenos "Juventus"', 'Marijampolės "Sūduva"', 'Alytaus "Dzūkija"',
  'Telšių "Telšiai"', 'Kretingos "Kretinga"'
];

const TEAM_CITIES = [
  'Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai',
  'Panevėžys', 'Jonava', 'Prienai',
  'Utena', 'Marijampolė', 'Alytus',
  'Telšiai', 'Kretinga'
];

const COACH_NAMES = [
  'Rimas Kurtinaitis', 'Šarūnas Marčiulionis', 'Jonas Kazlauskas', 'Gintaras Krapikas',
  'Robertas Kuncaitis', 'Antanas Sireika', 'Mindaugas Brazys', 'Dainius Adomaitis',
  'Vaidas Paulauskas', 'Linas Salkauskas', 'Rytis Vaišvila', 'Donatas Zavackas'
];

const AGENT_NAMES = [
  '"GM Solutions"', '"Top Player Agency"', '"Baltic Sports Management"',
  '"Elite Hoops Group"', '"Champions Agency"', '"Star Athletes Representation"',
  '"ProConnect Management"', '"Global Sports Partners"'
];

// ============================================
// PAGALBINĖS FUNKCIJOS
// ============================================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ============================================
// OVR SKAIČIAVIMAS (pagal poziciją)
// ============================================

function calculateOVR(attrs: any, position: string): number {
  const weights: Record<string, Record<string, number>> = {
    PG: {
      passing: 0.20, ballHandling: 0.15, perimeterDef: 0.15, threePoint: 0.15,
      midRange: 0.10, speed: 0.10, basketballIQ: 0.10, steal: 0.05
    },
    SG: {
      threePoint: 0.20, midRange: 0.15, perimeterDef: 0.15, speed: 0.15,
      ballHandling: 0.10, closeRange: 0.10, clutch: 0.10, steal: 0.05
    },
    SF: {
      threePoint: 0.15, midRange: 0.15, closeRange: 0.15, perimeterDef: 0.15,
      interiorDef: 0.10, speed: 0.10, rebounding: 0.10, ballHandling: 0.10
    },
    PF: {
      interiorDef: 0.20, closeRange: 0.15, midRange: 0.15, defensiveReb: 0.15,
      strength: 0.15, offensiveReb: 0.10, speed: 0.05, block: 0.05
    },
    C: {
      interiorDef: 0.25, defensiveReb: 0.25, closeRange: 0.15,
      block: 0.15, strength: 0.10, offensiveReb: 0.10
    }
  };

  const w = weights[position];
  let ovr = 0;

  for (const [attr, weight] of Object.entries(w)) {
    const key = attr === 'rebounding' ? 'defensiveReb' : attr;
    ovr += (attrs[key] || 50) * weight;
  }

  return Math.round(ovr);
}

// ============================================
// ŽAIDĖJO GENERAVIMAS
// ============================================

interface PlayerAttributes {
  closeRange: number;
  midRange: number;
  threePoint: number;
  freeThrow: number;
  ballHandling: number;
  passing: number;
  offensiveReb: number;
  perimeterDef: number;
  interiorDef: number;
  steal: number;
  block: number;
  defensiveReb: number;
  speed: number;
  strength: number;
  vertical: number;
  stamina: number;
  injuryProne: number;
  basketballIQ: number;
  clutch: number;
}

function generatePositionalAttributes(position: string, tier: number): PlayerAttributes {
  // tier: 1 = star, 2 = starter, 3 = rotation, 4 = bench
  const baseMod = (4 - tier) * 15; // 45, 30, 15, 0

  const base = () => randomInt(40 + baseMod, 70 + baseMod);

  const attrs: PlayerAttributes = {
    closeRange: base(),
    midRange: base(),
    threePoint: base(),
    freeThrow: base(),
    ballHandling: base(),
    passing: base(),
    offensiveReb: base(),
    perimeterDef: base(),
    interiorDef: base(),
    steal: base(),
    block: base(),
    defensiveReb: base(),
    speed: base(),
    strength: base(),
    vertical: base(),
    stamina: randomInt(60, 85),
    injuryProne: randomInt(10, 50),
    basketballIQ: base(),
    clutch: base(),
  };

  // Poziciniai pataisymai (Soft Caps)
  const posMods: Record<string, Partial<PlayerAttributes>> = {
    PG: {
      speed: 20, ballHandling: 15, passing: 15, perimeterDef: 10,
      strength: -20, block: -15, interiorDef: -20
    },
    SG: {
      speed: 15, threePoint: 10, perimeterDef: 5,
      passing: -5, ballHandling: 5, strength: -10
    },
    SF: {
      threePoint: 5, midRange: 5, perimeterDef: 5, interiorDef: 5,
      speed: 5, strength: 0
    },
    PF: {
      interiorDef: 15, defensiveReb: 15, strength: 15, midRange: 5,
      speed: -10, threePoint: -10, ballHandling: -15
    },
    C: {
      interiorDef: 20, defensiveReb: 20, block: 15, strength: 20, offensiveReb: 10,
      speed: -20, threePoint: -20, ballHandling: -25, perimeterDef: -15
    }
  };

  const mods = posMods[position];
  for (const [key, mod] of Object.entries(mods)) {
    const k = key as keyof PlayerAttributes;
    attrs[k] = Math.max(0, Math.min(99, attrs[k] + mod));
  }

  return attrs;
}

function generatePlayer(teamId: string, position: string, number: number, teamTier: number) {
  const firstName = randomItem(FIRST_NAMES_LT);
  const lastName = randomItem(LAST_NAMES_LT);

  // Amžiaus generavimas (jaunesni = didesnis potencialas)
  const age = randomInt(18, 34);
  const ageBonus = Math.max(0, (30 - age) * 2); // jauni gauna daugiau POT

  // Tier: 1-2 žaidėjai = stars, 3-8 = core, 9-12 = rotation, 13-15 = bench
  const playerTier = number <= 2 ? 1 : number <= 8 ? 2 : number <= 12 ? 3 : 4;

  const attrs = generatePositionalAttributes(position, playerTier);
  const ovr = calculateOVR(attrs, position);
  const pot = Math.min(99, ovr + randomInt(5, 20) + ageBonus);

  // Ūgis ir svoris pagal poziciją
  const heightRanges: Record<string, [number, number]> = {
    PG: [175, 195], SG: [190, 205], SF: [198, 210],
    PF: [203, 215], C: [208, 230]
  };
  const [hMin, hMax] = heightRanges[position];
  const height = randomInt(hMin, hMax);
  const weight = Math.round(height * 0.45 + randomInt(-5, 5));

  return {
    teamId,
    firstName,
    lastName,
    age,
    birthCountryId: 'LT', // bus užpildyta vėliau
    position,
    height,
    weight,
    ovr,
    pot,
    loyalty: randomInt(30, 90),
    morale: randomInt(50, 80),
    rhythm: randomInt(50, 80),
    ...attrs,
    injuryStatus: 'HEALTHY',
    fatigueSeason: 0,
    form: randomInt(55, 85),
  };
}

// ============================================
// RINKINIŲ (ROSTER) GENERAVIMAS
// ============================================

function generateRoster(teamId: string, teamTier: number) {
  // Kiekvienai pozicijai:
  // 2 PG, 3 SG, 3 SF, 3 PF, 3-4 C
  const positions = [
    'PG', 'PG',
    'SG', 'SG', 'SG',
    'SF', 'SF', 'SF',
    'PF', 'PF', 'PF',
    'C', 'C', 'C', 'C' // 15 žaidėjų
  ];

  return positions.map((pos, i) => generatePlayer(teamId, pos, i + 1, teamTier));
}

// ============================================
// MAIN - SEED FUNCTION
// ============================================

async function main() {
  console.log('🏀 Basketball Manager - World Generator');
  console.log('==========================================');

  // Išvalyti seną duomenų bazę
  console.log('🗑️  Clearing existing data...');
  await prisma.matchPlayerStats.deleteMany();
  await prisma.match.deleteMany();
  await prisma.playerStats.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.player.deleteMany();
  await prisma.coach.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.team.deleteMany();
  await prisma.league.deleteMany();
  await prisma.country.deleteMany();
  await prisma.seasonState.deleteMany();

  // 1. Sukurti šalį
  console.log('🌍 Creating country...');
  const lithuania = await prisma.country.create({
    data: {
      name: 'Lietuva',
      code: 'LT',
    },
  });
  console.log(`   Created: ${lithuania.name}`);

  // 2. Sukurti lygą
  console.log('🏆 Creating league...');
  const lkl = await prisma.league.create({
    data: {
      name: 'Lietuvos Krepšinio Lyga (LKL)',
      type: 'LOCAL_I',
      tier: 1,
      countryId: lithuania.id,
    },
  });
  console.log(`   Created: ${lkl.name}`);

  // 3. Sukurti agentus
  console.log('👔 Creating agents...');
  const agents = await Promise.all(
    AGENT_NAMES.map((name, i) =>
      prisma.agent.create({
        data: {
          name,
          greed: randomInt(30, 80),
          reputation: randomInt(40, 90),
          negotiation: randomInt(40, 90),
        },
      })
    )
  );
  console.log(`   Created ${agents.length} agents`);

  // 4. Sukurti komandas su žaidėjais ir treneriais
  console.log('🏀 Creating teams and players...');
  const teams = [];

  for (let i = 0; i < TEAM_NAMES.length; i++) {
    const teamName = TEAM_NAMES[i];
    const cityName = TEAM_CITIES[i];

    // Komandos lygis (pirmos 3-4 stipresnės)
    const teamTier = i < 3 ? 1 : i < 7 ? 2 : 3;

    // Sudėti komandą
    const team = await prisma.team.create({
      data: {
        name: teamName,
        city: cityName,
        countryId: lithuania.id,
        prestige: randomInt(40, 90) - (teamTier * 10),
        wageBudget: 100000 - (teamTier * 15000),
        transferBudget: 500000 - (teamTier * 100000),
        isAiControlled: true,
        localLeagueId: lkl.id,
      },
    });

    // Treneris
    await prisma.coach.create({
      data: {
        teamId: team.id,
        name: COACH_NAMES[i] || `Treneris ${i + 1}`,
        rotation: randomInt(40, 80),
        tactics: randomInt(40, 80),
        development: randomInt(40, 80),
        motivation: randomInt(40, 80),
        salary: randomInt(3000, 8000),
      },
    });

    // Roster (15 žaidėjų)
    const roster = generateRoster(team.id, teamTier);
    const players = await Promise.all(
      roster.map((p) =>
        prisma.player.create({
          data: {
            ...p,
            birthCountryId: lithuania.id,
          },
        })
      )
    );

    // Sukurti sutartis
    await Promise.all(
      players.map((player) =>
        prisma.contract.create({
          data: {
            playerId: player.id,
            teamId: team.id,
            weeklyWage: Math.round(player.ovr * player.ovr * 0.5) + randomInt(-100, 200),
            expiresAtSeason: 1,
            effectiveAtSeason: 1,
            releaseClause: player.ovr > 75 ? randomInt(50000, 200000) : null,
            isLoan: false,
            isRenewable: true,
          },
        })
      )
    );

    teams.push(team);
    console.log(
      `   ${i + 1}. ${teamName} - ${players.length} players (OVR: ${Math.round(
        players.reduce((sum, p) => sum + p.ovr, 0) / players.length
      )})`
    );
  }

  // 5. Sukurti sezono būseną
  console.log('📅 Creating season state...');
  await prisma.seasonState.create({
    data: {
      season: 1,
      matchDay: 1,
      phase: 'REGULAR_SEASON',
    },
  });

  // 6. Sugeneruoti tvarkaraštį (66 rungtynės - kiekviena su kiekviena namuose ir svečiuose)
  console.log('📅 Creating schedule...');
  const matches = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = 0; j < teams.length; j++) {
      if (i !== j) {
        matches.push({
          leagueId: lkl.id,
          homeTeamId: teams[i].id,
          awayTeamId: teams[j].id,
          matchDay: 0, // bus nustatyta vėliau
        });
      }
    }
  }

  // Išmiksuti rungtynes ir priskirti matchDay
  const shuffledMatches = shuffle(matches);
  const matchesPerDay = 6; // 6 rungtynių per dieną (12 komandų)
  for (let i = 0; i < shuffledMatches.length; i++) {
    shuffledMatches[i].matchDay = Math.floor(i / matchesPerDay) + 1;
  }

  for (const match of shuffledMatches) {
    await prisma.match.create({
      data: match,
    });
  }

  console.log(`   Created ${shuffledMatches.length} matches (${Math.ceil(shuffledMatches.length / matchesPerDay)} days)`);

  console.log('==========================================');
  console.log('✅ World generation complete!');
  console.log('');
  console.log(`Summary:`);
  console.log(`   - Countries: 1`);
  console.log(`   - Leagues: 1`);
  console.log(`   - Teams: ${teams.length}`);
  console.log(`   - Players: ${teams.length * 15}`);
  console.log(`   - Coaches: ${teams.length}`);
  console.log(`   - Agents: ${agents.length}`);
  console.log(`   - Matches: ${shuffledMatches.length}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
